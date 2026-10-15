import { contrastAPCA } from "colorjs.io/fn";
import { srgbToLinear } from "./convert.ts";
import { fromRgb } from "./engine.ts";
import { toRgb } from "./hex.ts";
import type { ColorLike } from "./types.ts";

/** WCAG 2.2 relative luminance (sRGB, IEC 61966-2-1 transfer, Rec. 709 coefficients). */
export const relativeLuminance = (color: ColorLike): number => {
  const { r, g, b } = toRgb(color);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
};

/** WCAG 2.2 contrast ratio, from 1 to 21. Symmetric in its arguments. */
export const wcagContrast = (a: ColorLike, b: ColorLike): number => {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

export interface TextOnSurface {
  readonly text: ColorLike;
  readonly surface: ColorLike;
}

/**
 * APCA lightness contrast (Lc) of `text` on `surface`, signed: positive for dark text on a light
 * surface, negative for light text on a dark surface. Computed with Color.js's implementation of
 * APCA 0.0.98G-4g, which takes the background first; the named arguments here avoid mix-ups.
 */
export const apcaContrast = ({ text, surface }: TextOnSurface): number =>
  contrastAPCA(fromRgb(toRgb(surface)), fromRgb(toRgb(text)));

/** Absolute APCA Lc, the number every Fovea threshold is written in. */
export const apcaLc = (pair: TextOnSurface): number => Math.abs(apcaContrast(pair));
