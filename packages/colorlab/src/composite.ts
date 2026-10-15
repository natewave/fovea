import { formatHex, parseHexAlpha, toRgb } from "./hex.ts";
import type { Hex, Rgb } from "./types.ts";

/**
 * Source-over compositing in gamma-encoded sRGB, which is how Chromium (and so VS Code)
 * blends translucent theme colors by default.
 */
export const compositeOver = (top: Rgb, alpha: number, bottom: Rgb): Rgb => ({
  r: top.r * alpha + bottom.r * (1 - alpha),
  g: top.g * alpha + bottom.g * (1 - alpha),
  b: top.b * alpha + bottom.b * (1 - alpha),
});

/** Flattens a `#rrggbbaa` (or opaque) color onto an opaque surface. */
export const flatten = (overlay: string, surface: Hex | Rgb): Hex => {
  const { rgb, alpha } = parseHexAlpha(overlay);
  return formatHex(compositeOver(rgb, alpha, toRgb(surface)));
};
