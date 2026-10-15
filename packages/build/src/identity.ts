import type { Hex } from "@fovea/colorlab";
import { FAMILIES, role, type Variant } from "@fovea/palette";
import { encodePng } from "./png.ts";
import { circle, type Layer, rect, render, ring } from "./raster.ts";

/**
 * The logo on a 64-unit grid: a calm ring around a sharp central pit, the fovea. The SVG logo,
 * the favicon, the Open Graph image and the VS Code icon all draw from these numbers.
 */
export const LOGO = {
  grid: 64,
  corner: 14,
  ring: { r: 19, width: 6 },
  pit: { r: 7 },
} as const;

export interface LogoColors {
  readonly tile: Hex;
  readonly ring: Hex;
  readonly pit: Hex;
}

export const logoColors = (v: Variant): LogoColors => ({
  tile: role(v, "surface.editor"),
  ring: role(v, "text.subtle"),
  pit: role(v, "accent"),
});

/** The logo as SVG. Without a tile it inherits its colors from CSS through `currentColor`. */
export const logoSvg = (colors: LogoColors | undefined, label = "Fovea"): string => {
  const c = LOGO.grid / 2;
  const tile =
    colors === undefined
      ? ""
      : `<rect width="${LOGO.grid}" height="${LOGO.grid}" rx="${LOGO.corner}" fill="${colors.tile}"/>`;
  const ringColor = colors?.ring ?? "currentColor";
  const pitColor = colors?.pit ?? "var(--fovea-accent, currentColor)";
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LOGO.grid} ${LOGO.grid}" role="img" aria-label="${label}">`,
    tile,
    `<circle cx="${c}" cy="${c}" r="${LOGO.ring.r}" fill="none" stroke="${ringColor}" stroke-width="${LOGO.ring.width}"/>`,
    `<circle cx="${c}" cy="${c}" r="${LOGO.pit.r}" fill="${pitColor}"/>`,
    "</svg>\n",
  ].join("");
};

const logoLayers = (colors: LogoColors, x: number, y: number, size: number): readonly Layer[] => {
  const unit = size / LOGO.grid;
  const c = size / 2;
  return [
    { shape: rect(x, y, size, size, LOGO.corner * unit), color: colors.tile },
    { shape: ring(x + c, y + c, LOGO.ring.r * unit, LOGO.ring.width * unit), color: colors.ring },
    { shape: circle(x + c, y + c, LOGO.pit.r * unit), color: colors.pit },
  ];
};

/** The extension icon: the logo tile as a 128 px PNG with transparent corners. */
export const iconPng = (v: Variant, size = 128): Uint8Array =>
  encodePng(size, size, render(size, size, logoLayers(logoColors(v), 0, 0, size)));

/**
 * The Open Graph image: the logo on the variant's chrome, over a strip of its accent text tones.
 * It has no text, so it needs no font.
 */
export const ogImagePng = (v: Variant, width = 1200, height = 630): Uint8Array => {
  const logo = 280;
  const strip = 24;
  const swatch = width / FAMILIES.length;
  const layers: readonly Layer[] = [
    { shape: rect(0, 0, width, height), color: role(v, "surface.chrome") },
    ...logoLayers(logoColors(v), (width - logo) / 2, (height - strip - logo) / 2, logo),
    ...FAMILIES.map((f, i) => ({
      shape: rect(i * swatch, height - strip, swatch + 1, strip),
      color: v.accent[f].fg,
    })),
  ];
  return encodePng(width, height, render(width, height, layers, 2));
};
