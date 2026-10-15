import {
  ColorSpace,
  OKLab,
  OKLCH,
  type PlainColorObject,
  sRGB,
  sRGB_Linear,
  XYZ_D65,
} from "colorjs.io/fn";
import type { Oklch, Rgb } from "./types.ts";

// Color.js resolves some conversions by space id, so the spaces must be registered once.
for (const space of [XYZ_D65, sRGB_Linear, sRGB, OKLab, OKLCH]) {
  if (!(space.id in ColorSpace.registry)) {
    ColorSpace.register(space);
  }
}

export const srgbSpace: ColorSpace = sRGB;
export const oklabSpace: ColorSpace = OKLab;
export const oklchSpace: ColorSpace = OKLCH;
export const xyzD65Space: ColorSpace = XYZ_D65;

export const fromRgb = (rgb: Rgb): PlainColorObject => ({
  space: sRGB,
  coords: [rgb.r, rgb.g, rgb.b],
  alpha: 1,
});

export const fromOklch = (c: Oklch): PlainColorObject => ({
  space: OKLCH,
  coords: [c.l, c.c, c.h],
  alpha: 1,
});

/** Color.js may report achromatic hue as NaN ("none"); normalise it to 0. */
export const num = (value: number | null | undefined): number =>
  value === null || value === undefined || Number.isNaN(value) ? 0 : value;
