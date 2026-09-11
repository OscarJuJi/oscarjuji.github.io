# Pixel City Background — Design

**Date:** 2026-08-03
**Branch:** `redesign/pixel-liquid-glass`
**Replaces:** the CSS-only background in `src/styles/base.css` (lines ~228–434)

## Brief

A 16-bit cyberpunk pixel city: neon horizon, layered depth, HUD grid, phosphor
green dominant with cyan and magenta only as accent, every edge hard, all motion
stepped.

The reference is a GLSL shader built on three things CSS cannot express: 4D
Perlin noise, an `sdMoon` crescent that orbits and reshapes as it goes, and
quantisation of the whole frame to a coarse grid. That is why this stops being a
stylesheet and becomes a shader.

## Decisions taken

| Question | Decision |
|---|---|
| Rendering | WebGL canvas at low internal resolution |
| Light theme | Same geometry, second palette via uniform |
| Framing | Sky-dominant, city in the lower third, scroll drives parallax |

## Architecture

Two new files under `src/background/`:

- **`pixel-city.glsl.mjs`** — the fragment shader, exported as a string. Kept as
  a JS module rather than a `.glsl` file so nothing depends on a Parcel
  transformer being configured.
- **`pixel-city.mjs`** — the runtime. Creates the canvas, compiles the program,
  drives the loop, watches theme / reduced-motion / tab visibility / context
  loss, and tears down cleanly. Exports `mountPixelCity()`.

`index.js` and `about.js` each call `mountPixelCity()`. Neither HTML file
changes.

### Fallback

`base.css` keeps a slimmed, static version of the old background, gated behind
`html:not(.webgl-bg)`. The runtime adds `.webgl-bg` to `<html>` only after the
first frame draws successfully. No WebGL, a shader that fails to compile, or a
context loss that cannot be restored all land back on CSS. The page is never
left with no background.

## The pixels are real

The canvas fills the viewport in CSS pixels, but its framebuffer is
`width/4 × height/4` — tied to `--px: 4px`, the token the rest of the site
already snaps to. `image-rendering: pixelated` does the upscale.

Two consequences: the pixel grid is genuine rather than a post-process filter,
and the GPU shades 16× fewer fragments.

## Scene layers

Back to front:

1. Sky in hard bands — `floor(t*N)/N`, never a smooth ramp
2. Stars by hash, above the horizon only, twinkling on stepped time
3. **The body in the sky** — night hangs a moon, day hangs a sun, same spot and
   size. The moon is `sdMoon` from the reference, parked at a quarter with only
   a breath either side of the phase; the sun is a hard disc, a dithered corona
   and eight spokes stepping round in twenty-fourths
4. **Clouds** — `cnoise` 4D Perlin from the reference, hard-thresholded, with a
   dithered band at the boundary; drift lives in the 4th dimension
5. Horizon burn — a thin hard-edged bar, the one place cyan and magenta pool
6. Far city — column heights by hash, no windows, scroll ×0.15
7. Mid city — scroll ×0.40
8. Near city — setbacks, antennas, windows lit by hash, scroll ×1.0, flicker
9. Ground plane — `1/y` perspective, still, and thinned out well before the
   horizon so it is a strip at the foot of the frame rather than a floor
10. HUD grid full-frame, plus corner brackets
11. **Hard replacement, not blending** — every composite is `mix(col, layer, m)`
    with `m` exactly 0 or 1

Rule 11 is what makes the frame read as 16-bit. The original plan was a
nearest-colour snap to five flat colours at the end; hard replacement per layer
replaced it, because it is how sprite-over-background actually worked and
because five colours could not hold three city depths apart. Measured result:
29–30 distinct colours on screen.

### Two scenes

`mountPixelCity({ scene })` picks a branch on a `uScene` uniform, so both pages
share one program.

- **`city`** (home) — everything above.
- **`calm`** (About) — layers 5 through 9 dropped entirely, and with them the
  horizon: the sky spans the full frame. In their place, one drifting Perlin
  field sampled wide and flat, banded and dithered into a slow aurora low down.
  A page of prose needs a background it can be read over, and this is roughly a
  third of the fragment cost.

The canvas carries `data-scene`, so the verification script knows which
invariants apply — the calm scene has no accent colour at all, and asserting
its presence there would be asserting a bug.

### Colour discipline

Phosphor green carries the sky glow, the city, the grid and the moon. Cyan and
magenta appear in three places only: the horizon bar, a handful of signs on near
buildings, and antenna lights.

This is enforced structurally, not by restraint — the palette holds three greens
and two accents, and the accents are only eligible inside those three masks.

## Motion

`uTime = floor(t * 8.0) / 8.0`. Eight steps a second; nothing interpolates.

Because consecutive frames within a step are bit-identical, the loop **only
issues a draw when the step changes** — roughly 8 draws a second instead of 60.
`uScroll` is quantised the same way.

## Guards

- `prefers-reduced-motion: reduce` — draw one frame, stop. A static pixel city.
- Hidden tab — loop paused.
- `webglcontextlost` — attempt restore; on failure drop `.webgl-bg` and let CSS
  take back over.

## Known risk: backdrop-filter

Every glass surface on the site uses `backdrop-filter`. An animated canvas
behind them forces the compositor to recompute each blur on every repaint.

**Measured:** 7.6 `drawArrays` calls per second over a five-second window, and
**83** elements on the home page with a live `backdrop-filter`. The stepped
clock does what it was built to do — the compositor is asked to redo those 83
blurs eight times a second, not sixty.

What that measurement does *not* settle: it was taken under headless
SwiftShader, which could not sustain 60fps for anything, so absolute frame
timings from it do not transfer to real hardware. The draw *count* does. If the
background ever feels heavy on a real machine, the levers are `STEP_HZ` in
`pixel-city.mjs` and `--glass-blur` in `base.css`.

## Verification

`npm run test:background` reads pixels back off the rendered canvas, in both
themes, and asserts the brief in terms that can fail:

- the framebuffer is a quarter of the viewport (the pixels are real)
- the frame is not uniform, and the palette stayed flat (8–400 colours)
- green leads on at least 60% of pixels
- cyan and magenta together stay under 2% — and are not zero

It is not in the aggregate `npm test`, because it needs a built site on a live
HTTP server.

Two of those numbers were corrected by what they found. The green rule
originally demanded a 10/255 channel margin, which the near-black and near-white
sky both failed despite leading green — the margin was the bug, not the sky. The
accent ceiling started at 8%: at 2.6% the horizon glow was already a solid neon
wall across the page, so the ceiling came down to 2%.
