/**
 * Checks the pixel-city background against the brief it was built to.
 * Run with: npm run test:background   (needs a built site being served)
 *
 * The brief says "phosphor green dominant, cyan and magenta only as accent".
 * That is the kind of claim that quietly stops being true the third time
 * someone nudges a constant, so it is asserted here rather than trusted:
 * the script reads the actual pixels off the rendered canvas and counts them.
 *
 * No test dependencies. It drives Chrome over the DevTools protocol using
 * Node's built-in fetch and WebSocket, so there is nothing to install beyond
 * the Chrome that is already on the machine.
 */

import { spawn } from 'node:child_process';
import { readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const URL_UNDER_TEST = process.argv[2] || 'http://127.0.0.1:8899/index.html';
const SHOT_DIR = process.argv[3] || null;
const PORT = 9333;
const VIEWPORT = { width: 1440, height: 900 };

/* ------------------------------------------------------------ find chrome */

function findChrome() {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;

  const candidates = [
    '/opt/google/chrome/chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
  for (const c of candidates) if (existsSync(c)) return c;

  // Puppeteer's download cache, which is what dev containers usually have.
  const cache = join(homedir(), '.cache', 'puppeteer', 'chrome');
  if (existsSync(cache)) {
    for (const dir of readdirSync(cache)) {
      const p = join(cache, dir, 'chrome-linux64', 'chrome');
      if (existsSync(p)) return p;
    }
  }
  return null;
}

/* --------------------------------------------------------------- cdp glue */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForEndpoint(port, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return await res.json();
    } catch {
      // Chrome has not opened the port yet. Keep waiting.
    }
    await sleep(120);
  }
  throw new Error(`Chrome never opened a debugging port on ${port}`);
}

/** Minimal CDP session over one WebSocket. */
class Session {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    });
  }

  static async open(wsUrl) {
    const ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', () => reject(new Error('CDP socket failed')), { once: true });
    });
    return new Session(ws);
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.delete(id)) reject(new Error(`${method} timed out`));
      }, 30000);
    });
  }

  /**
   * Evaluate in the page and unwrap the value, surfacing page-side throws.
   *
   * This is CDP Runtime.evaluate, not JavaScript eval(): the only sources it
   * ever receives are the literals in this file, and they run in the page's
   * sandbox, not in this process. Driving a browser is what it is for.
   */
  async eval(fnSource) {
    const res = await this.send('Runtime.evaluate', {
      expression: `(${fnSource})()`,
      awaitPromise: true,
      returnByValue: true,
    });
    if (res.exceptionDetails) {
      const d = res.exceptionDetails;
      throw new Error(`page threw: ${d.exception?.description || d.text}`);
    }
    return res.result.value;
  }

  close() {
    this.ws.close();
  }
}

/* --------------------------------------------------- the in-page measurer */

/*
 * Runs inside the browser. Copies the WebGL canvas into a 2D context (the GL
 * context is created with preserveDrawingBuffer, so this is a real read of
 * what was drawn) and classifies every pixel.
 *
 * Classification is deliberately coarse — the question is not "what shade of
 * green is this" but "is this pixel carrying green, or carrying an accent".
 */
const MEASURE = `() => {
  const cv = document.getElementById('pixel-city');
  if (!cv) return { error: 'no #pixel-city canvas in the document' };
  if (!document.documentElement.classList.contains('webgl-bg')) {
    return { error: 'canvas mounted but .webgl-bg never went on - no frame landed' };
  }

  const off = document.createElement('canvas');
  off.width = cv.width;
  off.height = cv.height;
  const ctx = off.getContext('2d');
  ctx.drawImage(cv, 0, 0);
  const px = ctx.getImageData(0, 0, cv.width, cv.height).data;

  const total = px.length / 4;
  const colours = new Set();
  let green = 0, cyan = 0, magenta = 0;

  for (let i = 0; i < px.length; i += 4) {
    const r = px[i], g = px[i + 1], b = px[i + 2];
    colours.add((r << 16) | (g << 8) | b);

    // Accents first — they are the saturated cases, and a fixed margin is a
    // fair test for them.
    // Cyan: blue and green together, red absent.
    if (b > 90 && g > 70 && r + 40 < b) cyan++;
    // Magenta: red leads, blue present, green suppressed.
    else if (r > 120 && b > 50 && g + 40 < r) magenta++;
    // Green: the channel simply leads, with no margin required. A margin is
    // wrong here — the sky is a near-black and a near-white whose green lead is
    // only a few counts wide, and those two surfaces are most of the frame.
    // "Green dominant" is a claim about which way the neutrals lean.
    else if (g > r && g > b) green++;
  }

  return {
    scene: cv.dataset.scene || 'city',
    w: cv.width,
    h: cv.height,
    cssW: cv.clientWidth,
    cssH: cv.clientHeight,
    total,
    distinctColours: colours.size,
    greenPct: (green / total) * 100,
    accentPct: ((cyan + magenta) / total) * 100,
    cyanPct: (cyan / total) * 100,
    magentaPct: (magenta / total) * 100,
  };
}`;

/* ------------------------------------------------------------------ suite */

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(`  ${pass ? 'ok  ' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

async function measureTheme(session, theme) {
  await session.eval(`() => {
    document.documentElement.setAttribute('data-theme', ${JSON.stringify(theme)});
  }`);
  // Two animation frames: one for the MutationObserver, one for the redraw.
  await session.eval(
    `() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`
  );
  return session.eval(MEASURE);
}

async function main() {
  const chrome = findChrome();
  if (!chrome) {
    console.error('No Chrome found. Set CHROME_PATH to a Chrome binary.');
    process.exit(2);
  }

  const proc = spawn(chrome, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--disable-dev-shm-usage',
    // Software GL. Without this a headless container has no WebGL at all and
    // the test would fail for reasons unrelated to the shader.
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
    'about:blank',
  ], { stdio: 'ignore' });

  let session;
  try {
    await waitForEndpoint(PORT);

    const target = await (
      await fetch(
        `http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(URL_UNDER_TEST)}`,
        { method: 'PUT' }
      )
    ).json();

    session = await Session.open(target.webSocketDebuggerUrl);

    // A rejected shader reports itself through console.error and nowhere else.
    // Without this the failure mode is "it didn't start", which says nothing.
    const consoleLines = [];
    session.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args
          .map((a) => a.value ?? a.description ?? '')
          .join(' ');
        if (text) consoleLines.push(`[${msg.params.type}] ${text}`);
      }
    });

    await session.send('Page.enable');
    await session.send('Runtime.enable');
    await session.send('Emulation.setDeviceMetricsOverride', {
      ...VIEWPORT, deviceScaleFactor: 1, mobile: false,
    });

    // The shader draws on the first frame after mount, but the bundle has to
    // parse first. Poll rather than guess at a sleep duration.
    const deadline = Date.now() + 25000;
    let mounted = false;
    while (Date.now() < deadline) {
      mounted = await session.eval(
        `() => document.documentElement.classList.contains('webgl-bg')`
      );
      if (mounted) break;
      await sleep(250);
    }
    if (!mounted) {
      const hasCanvas = await session.eval(
        `() => !!document.getElementById('pixel-city')`
      );
      throw new Error(
        `background never started (canvas present: ${hasCanvas}).\n` +
        (consoleLines.length
          ? consoleLines.join('\n')
          : 'nothing on the page console — WebGL is probably unavailable')
      );
    }

    console.log(`\npixel-city background — ${URL_UNDER_TEST}\n`);

    for (const theme of ['dark', 'light']) {
      const m = await measureTheme(session, theme);
      if (m.error) throw new Error(m.error);

      console.log(`[${theme}] scene: ${m.scene}`);

      // The framebuffer must be a quarter of the viewport: that is where the
      // pixels come from. If this drifts, the art silently gets smoother.
      const expectW = Math.ceil(m.cssW / 4);
      const expectH = Math.ceil(m.cssH / 4);
      check(
        'framebuffer is a quarter of the viewport',
        m.w === expectW && m.h === expectH,
        `${m.w}x${m.h}, expected ${expectW}x${expectH}`
      );

      // A uniform frame means the shader ran but drew nothing worth seeing.
      check(
        'the frame has structure',
        m.distinctColours >= 8,
        `${m.distinctColours} distinct colours`
      );

      // Flat palette: hard compositing should keep this to tens, not thousands.
      check(
        'palette stayed flat',
        m.distinctColours <= 400,
        `${m.distinctColours} distinct colours`
      );

      check(
        'green dominates',
        m.greenPct >= 60,
        `${m.greenPct.toFixed(1)}% of pixels lead green`
      );

      // 8% was the first guess and it was far too generous: 2.6% of saturated
      // neon over a near-black sky already reads as a wall across the page.
      check(
        'cyan and magenta stay accents',
        m.accentPct <= 2,
        `${m.accentPct.toFixed(1)}% (cyan ${m.cyanPct.toFixed(1)}%, ` +
          `magenta ${m.magentaPct.toFixed(1)}%)`
      );

      // Accents that never appear are not restraint, they are a broken mask —
      // but only where accents are supposed to be. The calm scene has no
      // horizon glow and no signs, so zero is the correct answer there.
      if (m.scene === 'city') {
        check(
          'accents are actually present',
          m.accentPct >= 0.05,
          `${m.accentPct.toFixed(2)}%`
        );
      } else {
        check(
          'calm scene carries no accent colour',
          m.accentPct === 0,
          `${m.accentPct.toFixed(2)}%`
        );
      }

      if (SHOT_DIR) {
        const shot = await session.send('Page.captureScreenshot', { format: 'png' });
        const path = join(SHOT_DIR, `pixel-city-${theme}.png`);
        writeFileSync(path, Buffer.from(shot.data, 'base64'));
        console.log(`  shot  ${path}`);
      }
      console.log('');
    }
  } finally {
    session?.close();
    proc.kill();
  }

  const failed = results.filter((r) => !r.pass);
  console.log(`${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) process.exit(1);
}

main().catch((err) => {
  console.error(`\n${err.message}`);
  process.exit(1);
});
