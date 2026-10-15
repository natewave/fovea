import { families, QUIET_SYNTAX, syntaxFamily } from "../families.ts";
import type { AccentTone, Family, SyntaxKey, ToneSpec } from "../types.ts";

export const hueOf = (family: Family, shift = 0): number => families[family].hue + shift;

export interface Tint {
  readonly l: number;
  readonly c: number;
}

export interface FamilyTones {
  /** Lc targets for the text-like tones. */
  readonly lc: { readonly fg: number; readonly strong: number; readonly dim: number };
  /** Chroma cap for the text-like tones; sRGB may cap further. */
  readonly c: number;
  readonly tint: Tint;
  readonly tintStrong: Tint;
}

/**
 * UI tones that sit off their family's base hue (still inside its band). Warnings use a gold
 * rather than the lemon of definitions: on paper, lemon at reading contrast turns olive.
 */
export const UI_HUE_SHIFT: Readonly<Partial<Record<Family, number>>> = { yellow: -14 };

/** The five tones of one accent family. */
export const tones = (family: Family, t: FamilyTones): Readonly<Record<AccentTone, ToneSpec>> => {
  const h = hueOf(family, UI_HUE_SHIFT[family] ?? 0);
  return {
    fg: { lc: t.lc.fg, c: t.c, h },
    strong: { lc: t.lc.strong, c: t.c, h },
    dim: { lc: t.lc.dim, c: t.c, h },
    tint: { l: t.tint.l, c: t.tint.c, h },
    "tint.strong": { l: t.tintStrong.l, c: t.tintStrong.c, h },
  };
};

export interface SyntaxTiers {
  /** Lc of the default tier (keyword, string, escape, constant, type). */
  readonly accent: number;
  /** Lc of definitions, deliberately a step stronger. */
  readonly definition: number;
  /** Lc of invalid code. */
  readonly invalid: number;
  /**
   * Lc of the diff pair; red stays the darker of the two (see docs/design.md, "Color-vision
   * deficiency").
   */
  readonly inserted: number;
  readonly deleted: number;
  /** Chroma cap for the saturated syntax hues. */
  readonly c: number;
  /** Chroma cap for the quiet hues (keywords and types). */
  readonly quietC: number;
  /** Per-variant hue adjustments, in degrees, inside each family's band. */
  readonly hueShift?: Readonly<Partial<Record<SyntaxKey, number>>>;
}

/**
 * The diff pair leans away from each other inside their bands (coral against cyan) so it stays
 * apart under deuteranopia, where it relies on the blue-yellow axis.
 */
export const SYNTAX_HUE_SHIFT: Readonly<Partial<Record<SyntaxKey, number>>> = {
  inserted: 8,
  deleted: 5,
};

const lcOf = (key: SyntaxKey, t: SyntaxTiers): number => {
  switch (key) {
    case "definition":
      return t.definition;
    case "invalid":
      return t.invalid;
    case "inserted":
      return t.inserted;
    case "deleted":
      return t.deleted;
    default:
      return t.accent;
  }
};

/** Syntax tones: each class takes its family's hue, its tier's Lc and its chroma cap. */
export const syntaxTones = (t: SyntaxTiers): Readonly<Record<SyntaxKey, ToneSpec>> => {
  const tone = (key: SyntaxKey): ToneSpec => ({
    lc: lcOf(key, t),
    c: QUIET_SYNTAX.includes(key) ? t.quietC : t.c,
    h: hueOf(syntaxFamily[key], (SYNTAX_HUE_SHIFT[key] ?? 0) + (t.hueShift?.[key] ?? 0)),
  });
  return {
    keyword: tone("keyword"),
    string: tone("string"),
    escape: tone("escape"),
    constant: tone("constant"),
    definition: tone("definition"),
    type: tone("type"),
    invalid: tone("invalid"),
    inserted: tone("inserted"),
    deleted: tone("deleted"),
  };
};
