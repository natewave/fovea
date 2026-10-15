import { cssName } from "@fovea/build/palette-css";
import { apcaLc, type Hex, hexToOklch, parseHex, wcagContrast } from "@fovea/colorlab";
import {
  ACCENT_TONES,
  type AccentTone,
  FAMILIES,
  type Family,
  families,
  NEUTRAL_KEYS,
  type Role,
  role,
  type Variant,
} from "@fovea/palette";
import { ANSI_NAMES, emittedLight } from "@fovea/palette/audit";

export interface Contrast {
  readonly lc: number;
  readonly wcag: number;
}

/** Contrast computed at build time; the site ships the numbers, never the algorithm. */
export const contrast = (text: Hex, surface: Hex): Contrast => ({
  lc: apcaLc({ text, surface }),
  wcag: wcagContrast(text, surface),
});

export const formatContrast = (c: Contrast): string =>
  `Lc ${Math.round(c.lc)} · ${c.wcag.toFixed(1)}:1`;

export interface Swatch {
  readonly label: string;
  /** The custom property in fovea.css. */
  readonly cssVar: string;
  readonly hex: Hex;
  readonly oklch: string;
  readonly rgb: string;
  /** Contrast as text on the editor surface, for colors used as text. */
  readonly onEditor?: Contrast;
}

export const oklchString = (hex: Hex): string => {
  const c = hexToOklch(hex);
  const h = Number.isFinite(c.h) ? c.h : 0;
  return `oklch(${(c.l * 100).toFixed(1)}% ${c.c.toFixed(3)} ${h.toFixed(1)})`;
};

export const rgbString = (hex: Hex): string => {
  const { r, g, b } = parseHex(hex);
  return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`;
};

const swatch = (v: Variant, label: string, key: string, hex: Hex, asText: boolean): Swatch => ({
  label,
  cssVar: cssName(key),
  hex,
  oklch: oklchString(hex),
  rgb: rgbString(hex),
  ...(asText ? { onEditor: contrast(hex, role(v, "surface.editor")) } : {}),
});

const TEXT_NEUTRALS = new Set([
  "fg.strong",
  "fg",
  "fg.subtle",
  "fg.muted",
  "fg.faint",
  "border.strong",
]);

export const neutralSwatches = (v: Variant): readonly Swatch[] =>
  NEUTRAL_KEYS.map((k) => swatch(v, k, k, v.neutral[k], TEXT_NEUTRALS.has(k)));

const TEXT_TONES: ReadonlySet<AccentTone> = new Set(["fg", "strong", "dim"]);

export interface FamilySwatches {
  readonly family: Family;
  readonly name: string;
  readonly hue: number;
  readonly tones: readonly Swatch[];
}

export const accentSwatches = (v: Variant): readonly FamilySwatches[] =>
  FAMILIES.map((f) => ({
    family: f,
    name: families[f].name,
    hue: families[f].hue,
    tones: ACCENT_TONES.map((t) => swatch(v, t, `${f}.${t}`, v.accent[f][t], TEXT_TONES.has(t))),
  }));

export const SEMANTIC_ROLES: readonly Role[] = [
  "accent",
  "cursor",
  "link",
  "focus",
  "error",
  "warning",
  "info",
  "success",
  "added",
  "removed",
  "modified",
  "conflict",
];

export const semanticSwatches = (v: Variant): readonly Swatch[] =>
  SEMANTIC_ROLES.map((r) => swatch(v, r, r, role(v, r), r !== "focus"));

export const SYNTAX_ROLES: readonly Role[] = [
  "syntax.plain",
  "syntax.comment",
  "syntax.keyword",
  "syntax.string",
  "syntax.escape",
  "syntax.constant",
  "syntax.definition",
  "syntax.type",
  "syntax.invalid",
];

export const syntaxSwatches = (v: Variant): readonly Swatch[] =>
  SYNTAX_ROLES.map((r) => swatch(v, r.replace("syntax.", ""), r, role(v, r), true));

export const ansiSwatches = (v: Variant): readonly Swatch[] =>
  v.ansi.map((hex, i) => swatch(v, `${i} ${ANSI_NAMES[i] ?? ""}`, `ansi.${i}`, hex, false));

export const MATRIX_TEXT: readonly Role[] = ["text", "text.subtle", "text.muted", "link", "error"];
export const MATRIX_SURFACES: readonly Role[] = [
  "surface.chrome",
  "surface.editor",
  "surface.popup",
  "surface.hover",
];

/** Text roles against every surface, as rows of the contrast matrix. */
export const contrastMatrix = (
  v: Variant,
): readonly { readonly text: Role; readonly cells: readonly Contrast[] }[] =>
  MATRIX_TEXT.map((text) => ({
    text,
    cells: MATRIX_SURFACES.map((s) => contrast(role(v, text), role(v, s))),
  }));

/** Relative light output of each variant against the brightest one, from the palette's model. */
export const lightOutput = (
  all: readonly Variant[],
): readonly { readonly v: Variant; readonly share: number }[] => {
  const max = Math.max(...all.map(emittedLight));
  return all.map((v) => ({ v, share: emittedLight(v) / max }));
};
