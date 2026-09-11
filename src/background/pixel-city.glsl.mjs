/**
 * PIXEL CITY — the background, as a fragment shader.
 *
 * Kept as an exported string rather than a .glsl file so nothing here depends
 * on a Parcel transformer being configured.
 *
 * House rules, enforced throughout:
 *
 *   - Nothing blends. Every composite is `col = mix(col, layer, mask)` where
 *     mask is exactly 0.0 or 1.0. That is what keeps the frame to a handful of
 *     flat colours; a single smoothstep would open the door to the intermediate
 *     tones the whole aesthetic is built to exclude.
 *   - Where a shape needs a soft edge, it gets a dither band instead — an
 *     ordered Bayer threshold, so the gradient is made of dots.
 *   - Green carries the scene. Cyan and magenta are eligible in exactly three
 *     places: the horizon bar, building signs, antenna lights.
 *
 * sdMoon is Inigo Quilez's. cnoise is Stefan Gustavson's classic 4D Perlin,
 * both taken from the reference shader this design is based on.
 */

export const VERT_SRC = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const FRAG_SRC = `
precision highp float;

uniform vec2  uRes;     // framebuffer size, in real (low-res) pixels
uniform float uTime;    // seconds, already quantised to 8 steps/sec
uniform float uScroll;  // page scroll in viewport heights, quantised
uniform float uTheme;   // 0.0 = light, 1.0 = dark
uniform float uScene;   // 0.0 = city (home), 1.0 = calm (about)

/* ---------------------------------------------------------------- palette */
/* Two sets, same geometry. uTheme is only ever exactly 0 or 1, so every mix
   below resolves to one constant or the other — no interpolated colours. */

vec3 SKY_HI, SKY_LO, INK, CLOUD, GRID, G_DIM, G_MID, G_HOT, CYAN, MAG;

void loadPalette() {
  /* The sky is not blue. A phosphor tube's black is green, and "green
     dominant" has to be true of the largest surface in the frame or it is not
     true of the frame. */
  SKY_HI = mix(vec3(0.929,0.945,0.925), vec3(0.020,0.035,0.031), uTheme);
  SKY_LO = mix(vec3(0.878,0.910,0.875), vec3(0.043,0.086,0.063), uTheme);
  INK    = mix(vec3(0.678,0.729,0.686), vec3(0.012,0.024,0.020), uTheme);
  /* Cloud and grid are pinned close to the sky on purpose. They are texture,
     not subject, and in daylight they have to stay under the body copy. */
  CLOUD  = mix(vec3(0.898,0.925,0.898), vec3(0.055,0.098,0.078), uTheme);
  GRID   = mix(vec3(0.855,0.886,0.855), vec3(0.078,0.153,0.118), uTheme);
  G_DIM  = mix(vec3(0.706,0.769,0.706), vec3(0.141,0.318,0.196), uTheme);
  G_MID  = mix(vec3(0.478,0.596,0.475), vec3(0.306,0.561,0.290), uTheme);
  G_HOT  = mix(vec3(0.227,0.451,0.227), vec3(0.647,0.910,0.545), uTheme);
  CYAN   = mix(vec3(0.000,0.412,0.490), vec3(0.000,0.898,1.000), uTheme);
  MAG    = mix(vec3(0.878,0.000,0.302), vec3(1.000,0.165,0.427), uTheme);
}

/* ------------------------------------------------------------------ noise */

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

/* Compact ordered Bayer. Returns [0,1) varying per pixel in a 4x4 tile —
   the threshold that turns a ramp into dots. */
float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }

/* Ordered-dither mask: 1 where a value v (0..1) should light this pixel.

   The threshold is nudged off zero deliberately. step(d, v) returns 1 when
   v == 0 and d == 0, and bayer4 really does return 0 for one pixel in sixteen
   — so the naive form leaks every masked layer across the whole frame at
   1/16 density. That is how a horizon glow ends up freckling the entire sky.

   No backticks in this file below the template delimiter: the GLSL lives in a
   JS template literal, and one in a comment silently truncates the shader. */
float dmask(float v, float d) { return step(d + 0.03125, v); }

float checker(vec2 p) { return mod(floor(p.x) + floor(p.y), 2.0); }

/* One tapered bar lying along +x, for a coordinate already folded into a
   single octant. Folding first is what makes the sun's rays identical: they
   are all this same bar seen through a different reflection, so none of them
   can come out a pixel wider than its neighbour. */
float sunRay(vec2 f, float inner, float outer) {
  float t = clamp((f.x - inner) / max(outer - inner, 0.001), 0.0, 1.0);
  float halfW = mix(0.115, 0.025, t);
  return step(inner, f.x) * step(f.x, outer) * step(f.y, halfW);
}

/* Fold a coordinate into the 0-45 degree octant: mirror into the first
   quadrant, then mirror across the diagonal. One shape drawn here comes back
   out as four, in exact symmetry. */
vec2 foldOctant(vec2 v) {
  v = abs(v);
  return (v.y > v.x) ? v.yx : v;
}

/* ------------------------------------------------- moon (iq's sdMoon) --- */

float sdMoon(vec2 p, float d, float ra, float rb) {
  p.y = abs(p.y);
  float a = (ra * ra - rb * rb + d * d) / (2.0 * d);
  float b = sqrt(max(ra * ra - a * a, 0.0));
  if (d * (p.x * b - p.y * a) > d * d * max(b - p.y, 0.0)) {
    return length(p - vec2(a, b));
  }
  return max((length(p) - ra), -(length(p - vec2(d, 0.0)) - rb));
}

/* ------------------------------- classic Perlin 4D noise, S. Gustavson --- */

vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec4 fade(vec4 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float cnoise(vec4 P) {
  vec4 Pi0 = floor(P);
  vec4 Pi1 = Pi0 + 1.0;
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec4 Pf0 = fract(P);
  vec4 Pf1 = Pf0 - 1.0;
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = vec4(Pi0.zzzz);
  vec4 iz1 = vec4(Pi1.zzzz);
  vec4 iw0 = vec4(Pi0.wwww);
  vec4 iw1 = vec4(Pi1.wwww);

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 ixy00 = permute(ixy0 + iw0);
  vec4 ixy01 = permute(ixy0 + iw1);
  vec4 ixy10 = permute(ixy1 + iw0);
  vec4 ixy11 = permute(ixy1 + iw1);

  vec4 gx00 = ixy00 / 7.0;
  vec4 gy00 = floor(gx00) / 7.0;
  vec4 gz00 = floor(gy00) / 6.0;
  gx00 = fract(gx00) - 0.5;
  gy00 = fract(gy00) - 0.5;
  gz00 = fract(gz00) - 0.5;
  vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
  vec4 sw00 = step(gw00, vec4(0.0));
  gx00 -= sw00 * (step(0.0, gx00) - 0.5);
  gy00 -= sw00 * (step(0.0, gy00) - 0.5);

  vec4 gx01 = ixy01 / 7.0;
  vec4 gy01 = floor(gx01) / 7.0;
  vec4 gz01 = floor(gy01) / 6.0;
  gx01 = fract(gx01) - 0.5;
  gy01 = fract(gy01) - 0.5;
  gz01 = fract(gz01) - 0.5;
  vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
  vec4 sw01 = step(gw01, vec4(0.0));
  gx01 -= sw01 * (step(0.0, gx01) - 0.5);
  gy01 -= sw01 * (step(0.0, gy01) - 0.5);

  vec4 gx10 = ixy10 / 7.0;
  vec4 gy10 = floor(gx10) / 7.0;
  vec4 gz10 = floor(gy10) / 6.0;
  gx10 = fract(gx10) - 0.5;
  gy10 = fract(gy10) - 0.5;
  gz10 = fract(gz10) - 0.5;
  vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
  vec4 sw10 = step(gw10, vec4(0.0));
  gx10 -= sw10 * (step(0.0, gx10) - 0.5);
  gy10 -= sw10 * (step(0.0, gy10) - 0.5);

  vec4 gx11 = ixy11 / 7.0;
  vec4 gy11 = floor(gx11) / 7.0;
  vec4 gz11 = floor(gy11) / 6.0;
  gx11 = fract(gx11) - 0.5;
  gy11 = fract(gy11) - 0.5;
  gz11 = fract(gz11) - 0.5;
  vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
  vec4 sw11 = step(gw11, vec4(0.0));
  gx11 -= sw11 * (step(0.0, gx11) - 0.5);
  gy11 -= sw11 * (step(0.0, gy11) - 0.5);

  vec4 g0000 = vec4(gx00.x, gy00.x, gz00.x, gw00.x);
  vec4 g1000 = vec4(gx00.y, gy00.y, gz00.y, gw00.y);
  vec4 g0100 = vec4(gx00.z, gy00.z, gz00.z, gw00.z);
  vec4 g1100 = vec4(gx00.w, gy00.w, gz00.w, gw00.w);
  vec4 g0010 = vec4(gx10.x, gy10.x, gz10.x, gw10.x);
  vec4 g1010 = vec4(gx10.y, gy10.y, gz10.y, gw10.y);
  vec4 g0110 = vec4(gx10.z, gy10.z, gz10.z, gw10.z);
  vec4 g1110 = vec4(gx10.w, gy10.w, gz10.w, gw10.w);
  vec4 g0001 = vec4(gx01.x, gy01.x, gz01.x, gw01.x);
  vec4 g1001 = vec4(gx01.y, gy01.y, gz01.y, gw01.y);
  vec4 g0101 = vec4(gx01.z, gy01.z, gz01.z, gw01.z);
  vec4 g1101 = vec4(gx01.w, gy01.w, gz01.w, gw01.w);
  vec4 g0011 = vec4(gx11.x, gy11.x, gz11.x, gw11.x);
  vec4 g1011 = vec4(gx11.y, gy11.y, gz11.y, gw11.y);
  vec4 g0111 = vec4(gx11.z, gy11.z, gz11.z, gw11.z);
  vec4 g1111 = vec4(gx11.w, gy11.w, gz11.w, gw11.w);

  vec4 norm00 = taylorInvSqrt(vec4(dot(g0000,g0000), dot(g0100,g0100), dot(g1000,g1000), dot(g1100,g1100)));
  g0000 *= norm00.x; g0100 *= norm00.y; g1000 *= norm00.z; g1100 *= norm00.w;

  vec4 norm01 = taylorInvSqrt(vec4(dot(g0001,g0001), dot(g0101,g0101), dot(g1001,g1001), dot(g1101,g1101)));
  g0001 *= norm01.x; g0101 *= norm01.y; g1001 *= norm01.z; g1101 *= norm01.w;

  vec4 norm10 = taylorInvSqrt(vec4(dot(g0010,g0010), dot(g0110,g0110), dot(g1010,g1010), dot(g1110,g1110)));
  g0010 *= norm10.x; g0110 *= norm10.y; g1010 *= norm10.z; g1110 *= norm10.w;

  vec4 norm11 = taylorInvSqrt(vec4(dot(g0011,g0011), dot(g0111,g0111), dot(g1011,g1011), dot(g1111,g1111)));
  g0011 *= norm11.x; g0111 *= norm11.y; g1011 *= norm11.z; g1111 *= norm11.w;

  float n0000 = dot(g0000, Pf0);
  float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
  float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
  float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
  float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
  float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
  float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
  float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
  float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
  float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
  float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
  float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
  float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
  float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
  float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
  float n1111 = dot(g1111, Pf1);

  vec4 fade_xyzw = fade(Pf0);
  vec4 n_0w = mix(vec4(n0000,n1000,n0100,n1100), vec4(n0001,n1001,n0101,n1101), fade_xyzw.w);
  vec4 n_1w = mix(vec4(n0010,n1010,n0110,n1110), vec4(n0011,n1011,n0111,n1111), fade_xyzw.w);
  vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
  vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
  return 2.2 * mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
}

/* ================================================================= scene */

/* Where the sky stops. Rises a little as the page scrolls, so descending the
   page reads as descending into the street.

   Low. The background is fixed, so anything up here is behind body copy for
   the whole length of the page — the skyline has to live in the bottom band
   and only its tallest spires may reach past a third of the frame. */
float horizonY() {
  float h = 0.17 + min(uScroll, 2.0) * 0.022;
  /* The calm scene has no city and no street, so it has no horizon either —
     dropping it to zero lets the sky bands span the whole frame instead of
     stopping short at a line with nothing under it. */
  return mix(h, 0.0, step(0.5, uScene));
}

/* One band of city.
   Buildings are columns on a hashed height field — no sprite sheet, no mask
   image, and it tiles forever in both directions.

   Returns 1.0 inside the silhouette. colId and colU come back out so the
   caller can hang windows, signs and antennas off the same column identity the
   silhouette was built from; keying them separately would let a window drift
   off its own building. */
float cityBand(
  vec2 uv, float aspect, float baseY, float colW, float minH, float varH,
  float seed, float xoff, float setbacks,
  out float colId, out float colU, out float topY
) {
  float x = (uv.x * aspect + xoff) / colW;
  colId = floor(x);
  colU = fract(x);

  float h = minH + hash11(colId * 1.37 + seed) * varH;
  topY = baseY + h;

  /* Solid from its own base up, not down to the bottom of the frame: the near
     band's base is where the street stops, and filling past it paints over the
     ground plane entirely. */
  float inside = step(uv.y, topY) * step(baseY, uv.y);

  /* A setback is a narrower storey standing on the main block. Present on a
     little over a third of buildings, which is enough to break the row of flat
     tops without making every roof fussy. */
  float hasSet = step(0.62, hash11(colId * 3.11 + seed)) * setbacks;
  float setW = 0.28 + hash11(colId * 5.7 + seed) * 0.16;
  float setIn = step(setW, colU) * step(colU, 1.0 - setW);
  float setTop = topY + (0.020 + hash11(colId * 7.3 + seed) * 0.045);
  inside = max(inside, hasSet * setIn * step(uv.y, setTop) * step(baseY, uv.y));
  topY = mix(topY, max(topY, setTop), hasSet * setIn);

  return inside;
}

void main() {
  loadPalette();

  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  float aspect = uRes.x / uRes.y;
  float hz = horizonY();
  float dith = bayer4(frag);

  vec3 col = SKY_HI;

  /* ---- sky: five hard bands, dithered between so the steps are dotted --- */
  float skyT = clamp((uv.y - hz) / max(1.0 - hz, 0.001), 0.0, 1.0);
  float band = floor(skyT * 5.0 + dith) / 5.0;
  col = mix(SKY_LO, SKY_HI, band);

  /* ---- stars: sparse, above the horizon, twinkling on the time step -----
     One pixel per cell, at a hashed spot inside it. Thresholding the cell
     itself instead would light the whole 5x5 block, and a star five pixels
     square is not a star, it is confetti. */
  vec2 scell = floor(frag / 5.0);
  vec2 sIn = frag - scell * 5.0;
  vec2 sPos = floor(vec2(hash21(scell + 3.7), hash21(scell + 9.1)) * 5.0);
  float sRnd = hash21(scell);
  float twinkle = step(0.35, hash21(scell + floor(uTime * 1.5) * 17.0));
  float star = step(0.90, sRnd) * step(0.5, 1.0 - min(length(sIn - sPos), 1.0))
             * twinkle * step(hz + 0.06, uv.y);
  /* At night a star is a bright dot; by day it is barely a speck of grain.
     Lit the same in both, daylight ends up flecked with dark green confetti. */
  vec3 starDim = mix(GRID, G_MID, uTheme);
  vec3 starHot = mix(G_DIM, G_HOT, uTheme);
  col = mix(col, mix(starDim, starHot, step(0.994, sRnd)), star);

  /* ---- the thing in the sky ---------------------------------------------
     Night hangs a moon, day hangs a sun: same spot, same size, same hard
     edges. Switching the theme should read as the hour changing, not as a
     different page. */
  float skyBody = 0.0;   // the solid disc, whichever body it is
  float skyRim = 0.0;    // dithered edge or corona

  if (uTheme > 0.5) {
    /* No coordinate quantisation here, deliberately.
       Snapping uv to a 90-step grid before the SDF was mimicking the
       reference's grid() — but the reference ran at full resolution, where
       that snap is what created the pixels. This framebuffer is already a
       quarter of the viewport, so it IS the pixel grid, and a second grid at a
       different pitch just beats against it: the edge picks up a stair of
       stray pixels instead of a clean one. Evaluated straight at the fragment
       centre, each pixel makes exactly one decision and the limb comes out
       crisp. */
    vec2 q = (uv - vec2(0.80, 0.72)) * vec2(aspect, 1.0) * 6.4;

    /* Waning crescent.
       The thickness is ra - (rb - d): the subtracting circle is nearly as
       large as the moon, and how far it is offset decides how much limb
       survives. The sign of the offset is what makes it waning — mirror d and
       the horns point the other way.

       An earlier pass used a large rb with d close to it, which puts a
       straight terminator through the centre and gives a half-lit disc. Right
       for a quarter, wrong for a crescent: a crescent's terminator has to bow
       into the disc, and that needs rb only a hair under ra. */
    float md = sdMoon(q, 0.38, 0.72, 0.70);
    skyBody = step(md, 0.0);
    /* The halo starts clear of the body rather than touching it. Dither that
       runs right up against the silhouette reads as a frayed edge, not as
       glow. */
    skyRim = step(md, 0.11) * step(0.045, md);

    col = mix(col, G_MID, skyRim * checker(frag));
    col = mix(col, G_HOT, skyBody);

    /* Motes: single pixels in the dark around the crescent, blinking on the
       stepped clock. The phase is fixed now — a crescent that keeps changing
       shape is not a crescent — so this is where the motion went. */
    vec2 mcell = floor(frag / 4.0);
    vec2 mIn = frag - mcell * 4.0;
    vec2 mPos = floor(vec2(hash21(mcell + 13.3), hash21(mcell + 27.9)) * 4.0);
    float onMote = step(0.5, 1.0 - min(length(mIn - mPos), 1.0));
    float rq = length(q);
    float ring = step(0.80, rq) * step(rq, 1.75);
    float blink = step(0.66, hash21(mcell + floor(uTime * 5.0) * 31.0));
    float mote = step(0.88, hash21(mcell + 61.0)) * onMote * ring * blink;
    col = mix(col, G_MID, mote);
  } else {
    /* Sun: a hard disc, a dithered corona, and eight spokes that turn one
       notch at a time — twenty-four notches to the full revolution, so the
       rotation lands on the same stepped clock as everything else.

       Smaller than the moon and pushed further into the corner. Its spokes
       carry it well past its own disc, so at the moon's placement and scale
       the left reach landed in the middle of the body copy. */
    vec2 q = (uv - vec2(0.87, 0.74)) * vec2(aspect, 1.0) * 6.4;
    float r = length(q);
    skyBody = step(r, 0.40);
    /* Tight. A wide corona pushes the rays out past it, and eight blobs in a
       ring with a gap between them and the disc do not read as a sun — they
       read as debris orbiting one. */
    skyRim = step(r, 0.50) * step(0.42, r);

    col = mix(col, G_MID, skyRim * checker(frag));
    col = mix(col, G_HOT, skyBody);

    /* Solid spokes, and wide ones. Dithering these with a checker turns them
       into diagonal hatching: an atan-derived angle aliases badly at a quarter
       resolution, and a checker laid over that reads as scratches rather than
       as rays. Dither is for shading a large area, not for drawing a shape
       eight pixels across. */
    /* Rays as folded bars, not angular sectors.
       A sector cut from atan aliases badly here: the angle is sampled unevenly
       across a quarter-resolution grid, so the eight wedges came out visibly
       different thicknesses. Folding into an octant makes them identical by
       construction — four land on the axes, where a pixel grid has no stairs
       at all, and four on the diagonals, where a 45-degree stair is the
       crispest a diagonal can be.

       That symmetry costs the continuous rotation: rays only stay clean on
       those eight headings, and turning between them is exactly what was
       tearing them up. So instead of turning, the two sets trade length on a
       two-beat — which is how an 8-bit sun twinkled anyway. */
    float beat = mod(floor(uTime * 1.2), 2.0);
    vec2 diag = vec2(q.x + q.y, q.y - q.x) * 0.70710678;

    float ray = max(
      sunRay(foldOctant(q),    0.40, mix(1.12, 0.86, beat)),
      sunRay(foldOctant(diag), 0.40, mix(0.86, 1.12, beat))
    );
    col = mix(col, G_MID, ray);
  }

  /* ---- clouds: 4D Perlin, hard-thresholded, dither band at the edge -----
     Confined to the upper sky. Loose in the middle of the frame they turn into
     grey mass directly behind the headline, which in daylight is unreadable. */
  vec2 cq = floor(vec2(uv.x * aspect, uv.y) * 34.0) / 34.0;
  float n = cnoise(vec4(cq * 2.1, cq.x * 1.4 + uTime * 0.012, uTime * 0.035));
  float cloudCore = step(0.16, n);
  float cloudRim = step(0.06, n) * step(n, 0.16) * step(dith, 0.5);
  float cloudSky = step(0.52, uv.y);
  float cloud = min(cloudCore + cloudRim, 1.0) * cloudSky;

  /* Cloud over moon lights up rather than occluding — the one place the two
     shapes interact, and the reference's checkerboard overlap in spirit. */
  /* Clouds pass behind the moon and the sun, never across them. Lighting the
     body where a cloud crosses it — which is what used to happen here — lays a
     diagonal hatch over the one solid shape in the frame and reads as dirt on
     the disc, not as weather. */
  col = mix(col, CLOUD, cloud * (1.0 - skyBody));

if (uScene > 0.5) {

  /* ---- calm scene: the About page ---------------------------------------
     No city, no street, no horizon glow. One drifting Perlin field, banded
     and dithered into a slow aurora low in the frame — the same noise the
     clouds are cut from, doing all the work on its own. Roughly a third of
     the fragment cost of the city scene, and quiet enough to read a page of
     prose over. */
  /* Sampled wide and flat — a low x frequency against a high y one. Equal
     frequencies give isotropic noise, which reads as grain rather than as
     bands of light lying along the horizon. */
  vec2 aq = floor(vec2(uv.x * aspect, uv.y) * 26.0) / 26.0;
  float av = cnoise(vec4(aq * vec2(0.9, 4.5), uTime * 0.045, 7.0));
  float envelope = clamp(1.0 - abs(uv.y - 0.20) / 0.26, 0.0, 1.0);
  float aur = clamp(av * 1.7 + 0.24, 0.0, 1.0) * envelope;
  col = mix(col, G_DIM, dmask(aur * 0.50, dith));
  col = mix(col, G_MID, dmask(aur * 0.18, dith));

} else {

  /* ---- horizon burn: accent zone 1 of 3 ---------------------------------
     Never solid. A filled band here draws a hard cyan rule straight across the
     page — it reads as a broken scanline, not as a city glowing. Dithering
     every level keeps it a speckled pool that dies out into the sky.

     Tall enough that its upper half clears the rooflines. Confined to the
     first few percent above the horizon it is drawn entirely behind the city
     and never seen — the glow has to reach into open sky to exist. */
  float burn = clamp(1.0 - (uv.y - hz) / 0.16, 0.0, 1.0) * step(hz, uv.y);
  vec3 burnCol = mix(CYAN, MAG, step(0.46, uv.x + (dith - 0.5) * 0.10));
  /* Squared, and capped low. Saturated neon on near-black carries far more
     weight than its pixel count suggests: at a linear 0.55 this is only a few
     percent of the frame and still reads as a wall across the page. */
  col = mix(col, burnCol, dmask(burn * burn * 0.30, dith));

  /* ---- ground: a flat grid in 1/y perspective ----------------------------
     Still. It used to run toward the viewer, which put permanent motion along
     the bottom edge of every page — the one place the eye rests. A street
     that holds its position still reads as a street, and the city above it
     keeps all the movement.

     Shallow, too: the lines are thinned out well before the horizon, so the
     ground is a strip at the foot of the frame rather than a floor competing
     with the skyline. */
  if (uv.y < hz) {
    col = INK;
    /* 1/y projection: the depth of the ground point this pixel looks at.
       Small numerator = the camera is close to the deck, which is what puts
       the receding lines far enough apart to read as a floor. */
    float depth = 0.10 / max(hz - uv.y, 0.002);
    float gx = (uv.x - 0.5) * depth * aspect * 0.9;
    float lineZ = step(0.93, fract(depth));
    /* abs, because fract of a small negative is ~0.99 — without it every pixel
       left of the vanishing point clears the threshold and the near half of
       the street fills in as one solid wedge. */
    float lineX = step(0.95, fract(abs(gx)));
    /* Thin the grid out toward the horizon with dither rather than opacity —
       a half-lit line is not a colour we own. */
    float reach = dmask(clamp((hz - uv.y) / 0.040, 0.0, 1.0), dith);
    col = mix(col, G_DIM, min(lineZ + lineX, 1.0) * reach);
  }

  /* ---- city, back to front ---------------------------------------------- */
  float cid, cu, ctop;

  /* Far: small, dim, barely moves. No windows — distance eats them. */
  float far = cityBand(uv, aspect, hz, 0.045, 0.012, 0.038, 3.0,
                       uScroll * 0.06 + uTime * 0.0020, 0.0, cid, cu, ctop);
  col = mix(col, mix(SKY_LO, INK, 0.45), far);

  /* Mid. */
  float mid = cityBand(uv, aspect, hz - 0.012, 0.065, 0.022, 0.062, 11.0,
                       uScroll * 0.18 + uTime * 0.0055, 1.0, cid, cu, ctop);
  vec3 midCol = mix(SKY_LO, INK, 0.78);
  col = mix(col, midCol, mid);
  /* A thin lit crown just under the roofline reads as depth without windows. */
  float midCrown = mid * step(uv.y, ctop) * step(ctop - 0.005, uv.y);
  col = mix(col, G_DIM, midCrown);

  /* Near: the detailed layer. Windows, signs, antennas, flicker. */
  float near = cityBand(uv, aspect, hz - 0.035, 0.100, 0.038, 0.105, 29.0,
                        uScroll * 0.52 + uTime * 0.0130, 1.0, cid, cu, ctop);
  col = mix(col, INK, near);

  /* Windows key off the same column id as the silhouette, so they stay on
     their own building however far the layer has drifted. */
  float wRow = (ctop - uv.y) / 0.0115;
  vec2 wc = floor(vec2(cu * 7.0, wRow));
  float wRnd = hash21(wc + cid * 41.0);
  float lit = step(0.52, wRnd);
  /* Most rooms hold steady; a few switch on the time step. */
  float unstable = step(0.94, hash21(wc + cid * 41.0 + 7.0));
  lit = mix(lit, step(0.5, hash21(wc + floor(uTime * 0.9) * 3.0)), unstable);
  float wCell = step(0.18, fract(cu * 7.0)) * step(fract(cu * 7.0), 0.72)
              * step(0.22, fract(wRow)) * step(fract(wRow), 0.74);
  float window = near * lit * wCell * step(uv.y, ctop - 0.007) * step(hz - 0.030, uv.y);
  col = mix(col, mix(G_DIM, G_HOT, step(0.86, wRnd)), window);

  /* Signs: accent zone 2. One building in eight carries a lit panel. */
  float hasSign = step(0.875, hash11(cid * 13.9 + 29.0));
  float signY = hz + 0.028 + hash11(cid * 17.3) * 0.045;
  float signOn = step(0.30, fract(uTime * 0.35 + hash11(cid * 2.7)));
  float sgn = near * hasSign * signOn
            * step(0.24, cu) * step(cu, 0.76)
            * step(signY, uv.y) * step(uv.y, signY + 0.018);
  col = mix(col, mix(CYAN, MAG, step(0.5, hash11(cid * 23.1))), sgn);

  /* Antennas: accent zone 3. A mast on the roof, with a blinking tip. */
  float hasMast = step(0.72, hash11(cid * 9.4 + 5.0));
  float mastX = step(abs(cu - 0.5), 0.030);
  float mastTop = ctop + 0.018 + hash11(cid * 4.1) * 0.034;
  float mast = hasMast * mastX * step(ctop, uv.y) * step(uv.y, mastTop)
             * step(hz - 0.035, ctop);
  col = mix(col, G_DIM, mast);
  float tip = hasMast * mastX * step(mastTop - 0.006, uv.y) * step(uv.y, mastTop)
            * step(0.5, fract(uTime * 0.7 + hash11(cid * 6.2)));
  col = mix(col, MAG, tip);

}

  /* ---- HUD grid ---------------------------------------------------------
     11 low-res pixels = 44 CSS px, the same pitch as --grid-size. Dashed via
     checker so it stays a readout and not a cage, and drawn in a colour picked
     to sit a hair off the sky — this runs behind every paragraph on the page,
     so it has to be findable rather than present. */
  vec2 g = mod(frag, 11.0);
  float hud = max(step(g.x, 0.5), step(g.y, 0.5)) * checker(frag * 0.5);
  /* Never across the moon or the sun. The grid is drawn last, so without this
     it punches dashes straight through the one solid lit shape in the frame
     and the body reads as speckled rather than lit. */
  col = mix(col, GRID, hud * (1.0 - skyBody));

  /* Corner brackets, dim — the frame admitting it is a screen. */
  vec2 edge = min(frag, uRes - frag);
  float arm = 16.0, gap = 7.0, thick = 1.0;
  float bx = step(edge.x, gap + thick) * step(gap, edge.x) * step(edge.y, gap + arm);
  float by = step(edge.y, gap + thick) * step(gap, edge.y) * step(edge.x, gap + arm);
  col = mix(col, G_DIM, min(bx + by, 1.0));

  /* ---- vignette: stepped, dithered, never a smooth falloff -------------- */
  vec2 vp = (uv - 0.5) * vec2(aspect, 1.0);
  float vig = clamp(length(vp) * 0.78 - 0.28, 0.0, 1.0);
  /* Off the moon and the sun, for the same reason as the grid: at this
     distance from centre the vignette only fires on a tenth of the pixels, and
     a tenth of a fixed 4x4 dither tile is a visible lattice sitting on the one
     surface that should read as solid light. */
  col = mix(col, mix(col, mix(vec3(1.0), vec3(0.0), uTheme), 0.30),
            dmask(vig, dith) * (1.0 - skyBody));

  gl_FragColor = vec4(col, 1.0);
}
`;
