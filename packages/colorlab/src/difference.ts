import { rgbToOklab } from "./convert.ts";
import { CVD_KINDS, type CvdKind, simulateCvd } from "./cvd.ts";
import { toRgb } from "./hex.ts";
import type { ColorLike, Oklab } from "./types.ts";

export const deltaEOkLab = (a: Oklab, b: Oklab): number =>
  Math.hypot(a.l - b.l, a.a - b.a, a.b - b.b);

/** ΔE_OK: Euclidean distance in OKLab (lightness in [0, 1]). */
export const deltaEOK = (a: ColorLike, b: ColorLike): number =>
  deltaEOkLab(rgbToOklab(toRgb(a)), rgbToOklab(toRgb(b)));

/** Absolute difference in OKLab lightness. */
export const deltaL = (a: ColorLike, b: ColorLike): number =>
  Math.abs(rgbToOklab(toRgb(a)).l - rgbToOklab(toRgb(b)).l);

export interface CvdDifference {
  readonly normal: number;
  readonly simulated: Readonly<Record<CvdKind, number>>;
  /** The smallest ΔE_OK across all simulations. */
  readonly worstCvd: number;
  readonly worstKind: CvdKind;
}

/** ΔE_OK between two colors in normal vision and under each full-severity simulation. */
export const cvdDifference = (a: ColorLike, b: ColorLike): CvdDifference => {
  const under = (kind: CvdKind): number => deltaEOK(simulateCvd(a, kind), simulateCvd(b, kind));
  const simulated: Record<CvdKind, number> = {
    protanopia: under("protanopia"),
    deuteranopia: under("deuteranopia"),
    tritanopia: under("tritanopia"),
    tritanomaly: under("tritanomaly"),
  };
  const worstKind = CVD_KINDS.reduce((w, k) => (simulated[k] < simulated[w] ? k : w));
  return { normal: deltaEOK(a, b), simulated, worstCvd: simulated[worstKind], worstKind };
};
