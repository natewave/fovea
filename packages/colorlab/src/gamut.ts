import { to, toGamut } from "colorjs.io/fn";
import { oklchToRgb } from "./convert.ts";
import { fromOklch, num, oklchSpace } from "./engine.ts";
import type { Oklch, Rgb } from "./types.ts";

/** Tolerance for floating-point noise when testing channel bounds. */
export const GAMUT_EPSILON = 1e-6;

const channelInRange = (v: number, eps: number): boolean => v >= -eps && v <= 1 + eps;

export const rgbInGamut = (rgb: Rgb, eps = GAMUT_EPSILON): boolean =>
  channelInRange(rgb.r, eps) && channelInRange(rgb.g, eps) && channelInRange(rgb.b, eps);

export const isInSrgb = (c: Oklch, eps = GAMUT_EPSILON): boolean => rgbInGamut(oklchToRgb(c), eps);

/**
 * The largest chroma at lightness `l` and hue `h` that stays inside sRGB, found by bisection.
 * Deterministic: a fixed number of iterations, no early exit.
 */
export const maxChromaInSrgb = (l: number, h: number): number => {
  if (l <= 0 || l >= 1) {
    return 0;
  }
  const step = (lo: number, hi: number, i: number): number => {
    if (i === 0) {
      return lo;
    }
    const mid = (lo + hi) / 2;
    return isInSrgb({ l, c: mid, h }, 0) ? step(mid, hi, i - 1) : step(lo, mid, i - 1);
  };
  return step(0, 0.5, 40);
};

/** Reduces chroma until the color fits in sRGB, preserving lightness and hue exactly. */
export const clampChroma = (c: Oklch): Oklch =>
  isInSrgb(c, 0) ? c : { ...c, c: Math.min(c.c, maxChromaInSrgb(c.l, c.h)) };

/** CSS Color 4 gamut mapping (Color.js `method: "css"`), returned as OKLCH. */
export const gamutMapCss = (c: Oklch): Oklch => {
  const mapped = toGamut(fromOklch(c), { method: "css", space: "srgb" });
  const [l, ch, h] = to(mapped, oklchSpace).coords;
  return { l: num(l), c: num(ch), h: num(h) };
};
