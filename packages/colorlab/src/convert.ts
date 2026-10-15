import { to } from "colorjs.io/fn";
import {
  fromOklch,
  fromRgb,
  num,
  oklabSpace,
  oklchSpace,
  srgbSpace,
  xyzD65Space,
} from "./engine.ts";
import { formatHex, toRgb } from "./hex.ts";
import type { Hex, LinearRgb, Oklab, Oklch, Rgb, Xyz } from "./types.ts";

/** IEC 61966-2-1 sRGB transfer function (encoded → linear). */
export const srgbToLinear = (v: number): number => {
  const a = Math.abs(v);
  const lin = a <= 0.04045 ? a / 12.92 : ((a + 0.055) / 1.055) ** 2.4;
  return Math.sign(v) * lin;
};

/** Inverse sRGB transfer function (linear → encoded). */
export const linearToSrgb = (v: number): number => {
  const a = Math.abs(v);
  const enc = a <= 0.0031308 ? a * 12.92 : 1.055 * a ** (1 / 2.4) - 0.055;
  return Math.sign(v) * enc;
};

export const toLinear = (rgb: Rgb): LinearRgb => ({
  r: srgbToLinear(rgb.r),
  g: srgbToLinear(rgb.g),
  b: srgbToLinear(rgb.b),
});

export const fromLinear = (lin: LinearRgb): Rgb => ({
  r: linearToSrgb(lin.r),
  g: linearToSrgb(lin.g),
  b: linearToSrgb(lin.b),
});

const normHue = (h: number): number => ((h % 360) + 360) % 360;

/** OKLCH → gamma-encoded sRGB, without clamping (out-of-gamut channels fall outside [0, 1]). */
export const oklchToRgb = (c: Oklch): Rgb => {
  const [r, g, b] = to(fromOklch(c), srgbSpace).coords;
  return { r: num(r), g: num(g), b: num(b) };
};

export const rgbToOklch = (rgb: Rgb): Oklch => {
  const [l, c, h] = to(fromRgb(rgb), oklchSpace).coords;
  const chroma = num(c);
  // Hue is meaningless for neutrals; pin it so output stays deterministic.
  return { l: num(l), c: chroma, h: chroma < 1e-6 ? 0 : normHue(num(h)) };
};

export const rgbToOklab = (rgb: Rgb): Oklab => {
  const [l, a, b] = to(fromRgb(rgb), oklabSpace).coords;
  return { l: num(l), a: num(a), b: num(b) };
};

export const oklchToOklab = (c: Oklch): Oklab => {
  const rad = (c.h * Math.PI) / 180;
  return { l: c.l, a: c.c * Math.cos(rad), b: c.c * Math.sin(rad) };
};

export const oklabToOklch = (lab: Oklab): Oklch => {
  const c = Math.hypot(lab.a, lab.b);
  const h = c < 1e-6 ? 0 : normHue((Math.atan2(lab.b, lab.a) * 180) / Math.PI);
  return { l: lab.l, c, h };
};

/** CIE XYZ (D65, Y of white = 1) → OKLab. */
export const xyzToOklab = (xyz: Xyz): Oklab => {
  const [l, a, b] = to(
    { space: xyzD65Space, coords: [xyz.x, xyz.y, xyz.z], alpha: 1 },
    oklabSpace,
  ).coords;
  return { l: num(l), a: num(a), b: num(b) };
};

/** Gamma-encoded sRGB → CIE XYZ (D65), via the IEC 61966-2-1 matrix. */
export const rgbToXyz = (color: Hex | Rgb): Xyz => {
  const lin = toLinear(toRgb(color));
  return {
    x: 0.4124 * lin.r + 0.3576 * lin.g + 0.1805 * lin.b,
    y: 0.2126 * lin.r + 0.7152 * lin.g + 0.0722 * lin.b,
    z: 0.0193 * lin.r + 0.1192 * lin.g + 0.9505 * lin.b,
  };
};

export const hexToOklch = (hex: Hex): Oklch => rgbToOklch(toRgb(hex));

export const hexToOklab = (hex: Hex): Oklab => rgbToOklab(toRgb(hex));

/** OKLCH → 8-bit hex. Out-of-gamut channels are clipped, so check gamut first. */
export const oklchToHex = (c: Oklch): Hex => formatHex(oklchToRgb(c));
