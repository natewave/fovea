import { rgbToXyz } from "./convert.ts";
import type { ColorLike, Uv, Xy, Xyz } from "./types.ts";

export const xyzToXy = (xyz: Xyz): Xy => {
  const sum = xyz.x + xyz.y + xyz.z;
  return sum === 0 ? { x: 0, y: 0 } : { x: xyz.x / sum, y: xyz.y / sum };
};

/** CIE 1931 xy → CIE 1960 UCS uv. */
export const xyToUv = ({ x, y }: Xy): Uv => {
  const d = -2 * x + 12 * y + 3;
  return { u: (4 * x) / d, v: (6 * y) / d };
};

/** McCamy (1992) cubic approximation of correlated color temperature from xy, in kelvin. */
export const cctMcCamy = ({ x, y }: Xy): number => {
  const n = (x - 0.332) / (0.1858 - y);
  return 449 * n ** 3 + 3525 * n ** 2 + 6823.3 * n + 5520.33;
};

/** Krystek (1985) rational approximation of the Planckian locus in CIE 1960 uv, 1000–15000 K. */
export const planckianUv = (t: number): Uv => ({
  u:
    (0.860117757 + 1.54118254e-4 * t + 1.28641212e-7 * t * t) /
    (1 + 8.42420235e-4 * t + 7.08145163e-7 * t * t),
  v:
    (0.317398726 + 4.22806245e-5 * t + 4.20481691e-8 * t * t) /
    (1 - 2.89741816e-5 * t + 1.61456053e-7 * t * t),
});

export interface CctDuv {
  /** Correlated color temperature (kelvin): temperature of the nearest Planckian point in uv. */
  readonly cct: number;
  /** Signed distance from the Planckian locus in uv: positive is greenish, negative is magenta-ish. */
  readonly duv: number;
  /** McCamy's approximation, reported alongside for cross-checking. */
  readonly mccamy: number;
}

const MIRED_MIN = 1e6 / 15000;
const MIRED_MAX = 1e6 / 1000;

const distanceAt = (uv: Uv, mired: number): number => {
  const p = planckianUv(1e6 / mired);
  return Math.hypot(uv.u - p.u, uv.v - p.v);
};

/** Golden-section search for the nearest Planckian point; fixed iteration count for determinism. */
const nearestMired = (uv: Uv): number => {
  const coarse = Array.from(
    { length: 200 },
    (_, i) => MIRED_MIN + ((MIRED_MAX - MIRED_MIN) * i) / 199,
  );
  const best = coarse.reduce((a, b) => (distanceAt(uv, b) < distanceAt(uv, a) ? b : a));
  const span = (MIRED_MAX - MIRED_MIN) / 199;
  const phi = (Math.sqrt(5) - 1) / 2;
  const refine = (lo: number, hi: number, i: number): number => {
    if (i === 0) {
      return (lo + hi) / 2;
    }
    const m1 = hi - phi * (hi - lo);
    const m2 = lo + phi * (hi - lo);
    return distanceAt(uv, m1) < distanceAt(uv, m2) ? refine(lo, m2, i - 1) : refine(m1, hi, i - 1);
  };
  return refine(Math.max(MIRED_MIN, best - span), Math.min(MIRED_MAX, best + span), 60);
};

export const cctDuvFromXy = (xy: Xy): CctDuv => {
  const uv = xyToUv(xy);
  const mired = nearestMired(uv);
  const p = planckianUv(1e6 / mired);
  const dist = Math.hypot(uv.u - p.u, uv.v - p.v);
  return { cct: 1e6 / mired, duv: uv.v >= p.v ? dist : -dist, mccamy: cctMcCamy(xy) };
};

/** CCT and Duv of an sRGB color, using its chromaticity under the sRGB (D65) primaries. */
export const cctDuv = (color: ColorLike): CctDuv => cctDuvFromXy(xyzToXy(rgbToXyz(color)));
