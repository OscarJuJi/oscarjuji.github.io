/**
 * PIXEL CITY — runtime.
 *
 * Mounts the background shader on a fixed canvas behind the page and drives it.
 *
 * Three things here are load-bearing:
 *
 *   1. The framebuffer is a quarter of the viewport in each axis, pinned to the
 *      --px: 4px token the rest of the site snaps to. The pixels are therefore
 *      real, not a filter, and the GPU shades sixteen times fewer fragments.
 *      devicePixelRatio is deliberately ignored — chunky is the point, so a
 *      retina screen costs exactly the same as any other.
 *
 *   2. Time is quantised to eight steps a second, and frames within a step are
 *      bit-identical. So the loop compares the step and returns without issuing
 *      a draw when nothing has moved: ~8 draws a second, not 60. That matters
 *      more than usual here because every glass surface on the page runs a
 *      backdrop-filter that the compositor has to redo on each repaint.
 *
 *   3. Nothing is assumed to work. The CSS background in base.css stays live
 *      until the first frame actually lands, and comes back if the context is
 *      lost for good.
 */

import { VERT_SRC, FRAG_SRC } from './pixel-city.glsl.mjs';

const CANVAS_ID = 'pixel-city';
const READY_CLASS = 'webgl-bg';

/** CSS pixels per shader pixel. Mirrors --px in base.css. */
const PIXEL = 4;
/** Animation steps per second. Everything in the shader lands on this grid. */
const STEP_HZ = 8;
/** Scroll is quantised too, into this many slices per viewport height. */
const SCROLL_STEPS = 32;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`pixel-city: shader failed to compile\n${log}`);
  }
  return sh;
}

function link(gl, vertSrc, fragSrc) {
  const vs = compile(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  // Attached shaders are reference-counted; the program holds them from here.
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error(`pixel-city: program failed to link\n${log}`);
  }
  return prog;
}

function isDark() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

/** Scene names, matching the uScene branch in the shader. */
const SCENES = { city: 0, calm: 1 };

/**
 * Mount the background. Safe to call more than once — later calls are ignored.
 *
 * @param {{ scene?: 'city' | 'calm' }} [options]
 *   'city' is the full skyline, for the home page. 'calm' drops the city, the
 *   street and the horizon glow for a single drifting noise field — quieter to
 *   read a page of prose over, and cheaper to draw.
 * @returns {(() => void) | null} teardown, or null if the background did not
 *   start (no WebGL, shader rejected). In that case base.css keeps its own
 *   static fallback on screen and nothing else needs to know.
 */
export function mountPixelCity({ scene = 'city' } = {}) {
  const sceneId = SCENES[scene] === undefined ? SCENES.city : SCENES[scene];
  if (typeof document === 'undefined') return null;
  if (document.getElementById(CANVAS_ID)) return null;

  const canvas = document.createElement('canvas');
  canvas.id = CANVAS_ID;
  canvas.setAttribute('aria-hidden', 'true');
  // Declared on the element so the verification script can tell which scene it
  // is looking at: the two have different invariants, and the calm one has no
  // accent colours at all by design.
  canvas.dataset.scene = SCENES[scene] === undefined ? 'city' : scene;

  const opts = {
    alpha: false,
    antialias: false,       // antialiasing is the one thing we must not have
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
    preserveDrawingBuffer: true, // so the verification script can read pixels
  };
  const gl =
    canvas.getContext('webgl', opts) ||
    canvas.getContext('experimental-webgl', opts);

  if (!gl) return null;

  let prog;
  try {
    prog = link(gl, VERT_SRC, FRAG_SRC);
  } catch (err) {
    // A shader the driver rejects is a bug worth seeing, not one worth hiding.
    console.error(err);
    return null;
  }

  document.body.insertBefore(canvas, document.body.firstChild);

  // One triangle large enough to cover the clip volume. Cheaper than a quad
  // and avoids the seam a two-triangle quad puts down the diagonal.
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );

  gl.useProgram(prog);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uScroll = gl.getUniformLocation(prog, 'uScroll');
  const uTheme = gl.getUniformLocation(prog, 'uTheme');
  const uScene = gl.getUniformLocation(prog, 'uScene');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let raf = 0;
  let started = 0;
  let ready = false;
  let dead = false;
  /** Forces the next loop pass to draw regardless of the step comparison. */
  let dirty = true;
  let lastStep = -1;
  let lastScrollStep = -1;

  function resize() {
    // Measure the element, not the window: with a scrollbar present the canvas
    // is narrower than innerWidth, and sizing off the window stretches the
    // framebuffer by a few pixels — which shears the whole pixel grid.
    const cssW = canvas.clientWidth || window.innerWidth;
    const cssH = canvas.clientHeight || window.innerHeight;
    const w = Math.max(1, Math.ceil(cssW / PIXEL));
    const h = Math.max(1, Math.ceil(cssH / PIXEL));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    dirty = true;
  }

  function draw(time, scroll) {
    gl.useProgram(prog);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, time);
    gl.uniform1f(uScroll, scroll);
    gl.uniform1f(uTheme, isDark() ? 1 : 0);
    gl.uniform1f(uScene, sceneId);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!ready) {
      ready = true;
      // Only now does the CSS fallback stand down.
      document.documentElement.classList.add(READY_CLASS);
    }
  }

  function currentScrollStep() {
    const vh = window.innerHeight || 1;
    return Math.round((window.scrollY / vh) * SCROLL_STEPS);
  }

  function frame(now) {
    if (dead) return;
    raf = window.requestAnimationFrame(frame);

    if (!started) started = now;
    const step = Math.floor(((now - started) / 1000) * STEP_HZ);
    const scrollStep = currentScrollStep();

    // The overwhelmingly common path: nothing has changed since last frame, so
    // skip the draw entirely and leave the compositor alone.
    if (!dirty && step === lastStep && scrollStep === lastScrollStep) return;

    dirty = false;
    lastStep = step;
    lastScrollStep = scrollStep;
    draw(step / STEP_HZ, scrollStep / SCROLL_STEPS);
  }

  function start() {
    if (dead || raf) return;
    started = 0;
    lastStep = -1;
    raf = window.requestAnimationFrame(frame);
  }

  function stop() {
    if (!raf) return;
    window.cancelAnimationFrame(raf);
    raf = 0;
  }

  /** One frame, held. What reduced-motion and hidden tabs get. */
  function drawStill() {
    resize();
    draw(0, currentScrollStep() / SCROLL_STEPS);
  }

  function applyMotionPreference() {
    // Always land a frame synchronously first. The canvas stays hidden until
    // .webgl-bg goes on, and that only happens on a completed draw — so
    // without this the page shows the CSS fallback for a frame and then swaps.
    drawStill();
    if (reduceMotion.matches) stop();
    else start();
  }

  function onVisibility() {
    if (document.hidden) stop();
    else if (!reduceMotion.matches) start();
  }

  function onResize() {
    resize();
    if (reduceMotion.matches) drawStill();
  }

  function onScroll() {
    // The loop samples scroll itself; this only matters while paused.
    if (reduceMotion.matches) drawStill();
  }

  function onThemeChange() {
    dirty = true;
    if (reduceMotion.matches) drawStill();
  }

  function onContextLost(e) {
    // Without this the context is never eligible for restoration.
    e.preventDefault();
    stop();
    ready = false;
    document.documentElement.classList.remove(READY_CLASS);
  }

  function onContextRestored() {
    // The program and buffer died with the context. Rebuilding them is more
    // machinery than this is worth, so hand back to CSS and stay down.
    dead = true;
    stop();
    document.documentElement.classList.remove(READY_CLASS);
    canvas.remove();
  }

  const themeObserver = new MutationObserver(onThemeChange);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  // The canvas can change size without the window doing so: this mounts before
  // React renders, so the scrollbar appears afterwards and takes a dozen pixels
  // off the width with no resize event to announce it.
  const sizeObserver =
    typeof ResizeObserver === 'function' ? new ResizeObserver(onResize) : null;
  sizeObserver?.observe(canvas);

  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);

  // Safari still only has the deprecated listener form on MediaQueryList.
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', applyMotionPreference);
  } else {
    reduceMotion.addListener(applyMotionPreference);
  }

  resize();
  applyMotionPreference();

  return function unmount() {
    dead = true;
    stop();
    themeObserver.disconnect();
    sizeObserver?.disconnect();
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    canvas.removeEventListener('webglcontextrestored', onContextRestored);
    if (reduceMotion.removeEventListener) {
      reduceMotion.removeEventListener('change', applyMotionPreference);
    } else {
      reduceMotion.removeListener(applyMotionPreference);
    }
    gl.deleteBuffer(buf);
    gl.deleteProgram(prog);
    document.documentElement.classList.remove(READY_CLASS);
    canvas.remove();
  };
}
