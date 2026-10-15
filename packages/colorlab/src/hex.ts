import type { Hex, Rgb } from "./types.ts";

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export const isHex = (value: string): value is Hex => HEX_RE.test(value);

const expand = (hex: string): string => {
  const body = hex.slice(1);
  return body.length === 3
    ? body
        .split("")
        .map((ch) => ch + ch)
        .join("")
    : body;
};

const channel = (body: string, index: number): number =>
  Number.parseInt(body.slice(index * 2, index * 2 + 2), 16) / 255;

/** Parses `#rgb`, `#rrggbb` or `#rrggbbaa` into sRGB plus alpha in [0, 1]. */
export const parseHexAlpha = (hex: string): { readonly rgb: Rgb; readonly alpha: number } => {
  if (!isHex(hex)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  const body = expand(hex);
  return {
    rgb: { r: channel(body, 0), g: channel(body, 1), b: channel(body, 2) },
    alpha: body.length === 8 ? channel(body, 3) : 1,
  };
};

/** Parses an opaque hex color. Alpha, if present, is rejected. */
export const parseHex = (hex: string): Rgb => {
  const { rgb, alpha } = parseHexAlpha(hex);
  if (alpha !== 1) {
    throw new Error(`Expected an opaque color, got ${hex}`);
  }
  return rgb;
};

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

const byte = (v: number): string =>
  Math.round(clamp01(v) * 255)
    .toString(16)
    .padStart(2, "0");

/** Quantises to 8 bits per channel, clamping out-of-gamut values. */
export const formatHex = (rgb: Rgb): Hex => `#${byte(rgb.r)}${byte(rgb.g)}${byte(rgb.b)}`;

/** Appends an 8-bit alpha channel to an opaque hex color. */
export const withAlpha = (hex: Hex, alpha: number): Hex => {
  parseHex(hex);
  return `${hex.slice(0, 7)}${byte(alpha)}` as Hex;
};

export const toRgb = (color: Hex | Rgb): Rgb =>
  typeof color === "string" ? parseHex(color) : color;
