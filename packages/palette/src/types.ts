import type { Hex, Oklch } from "@fovea/colorlab";

export type VariantId = "day" | "dusk" | "night";
export type Polarity = "light" | "dark";

export const VARIANT_IDS: readonly VariantId[] = ["day", "dusk", "night"];

export const NEUTRAL_KEYS = [
  "bg.sunken",
  "bg",
  "bg.raised",
  "bg.overlay",
  "border",
  "border.strong",
  "fg.faint",
  "fg.muted",
  "fg.subtle",
  "fg",
  "fg.strong",
] as const;
export type NeutralKey = (typeof NEUTRAL_KEYS)[number];

export const FAMILIES = [
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "violet",
  "pink",
] as const;
export type Family = (typeof FAMILIES)[number];

/** Tones every accent family provides. */
export const ACCENT_TONES = ["fg", "strong", "dim", "tint", "tint.strong"] as const;
export type AccentTone = (typeof ACCENT_TONES)[number];

/**
 * Syntax classes that get their own color (see docs/design.md, "Syntax"). `inserted` and
 * `deleted` are the semantic pair used in diff files; they share the teal and red families.
 */
export const SYNTAX_KEYS = [
  "keyword",
  "string",
  "escape",
  "constant",
  "definition",
  "type",
  "invalid",
  "inserted",
  "deleted",
] as const;
export type SyntaxKey = (typeof SYNTAX_KEYS)[number];

export const OVERLAY_KEYS = [
  "line.current",
  "selection",
  "selection.inactive",
  "word",
  "word.strong",
  "find.match",
  "find.other",
  "diff.added.line",
  "diff.added.text",
  "diff.removed.line",
  "diff.removed.text",
] as const;
export type OverlayKey = (typeof OVERLAY_KEYS)[number];

/**
 * A tone solved for an APCA target: lightness is whatever reaches `lc` (absolute Lc) against
 * the reference surface, with chroma capped at `c` and further at the sRGB boundary.
 */
export interface LcSpec {
  readonly lc: number;
  readonly c: number;
  readonly h: number;
  /** Reference surface; defaults to the variant's `bg`. */
  readonly on?: NeutralKey;
}

/** A tone at an explicit OKLCH lightness (used for surfaces). */
export interface LSpec {
  readonly l: number;
  readonly c: number;
  readonly h: number;
}

export type ToneSpec = LcSpec | LSpec;

/** A translucent overlay: the composited surface sits `dl` from `bg` in OKLCH lightness. */
export interface OverlaySpec {
  readonly dl: number;
  readonly c: number;
  readonly h: number;
  readonly alpha: number;
  /** The overlay this one is painted over (diff text tints sit on diff line tints); else `bg`. */
  readonly over?: OverlayKey;
}

export interface VariantSpec {
  readonly id: VariantId;
  readonly name: string;
  readonly polarity: Polarity;
  readonly description: string;
  readonly neutral: Readonly<Record<NeutralKey, ToneSpec>>;
  readonly accent: Readonly<Record<Family, Readonly<Record<AccentTone, ToneSpec>>>>;
  readonly syntax: Readonly<Record<SyntaxKey, ToneSpec>>;
  /** ANSI 0–15. */
  readonly ansi: readonly ToneSpec[];
  readonly overlay: Readonly<Record<OverlayKey, OverlaySpec>>;
}

export interface Overlay {
  /** `#rrggbbaa`, the value ports write. */
  readonly color: Hex;
  /** The overlay flattened onto what it is painted over; contrast is measured against this. */
  readonly surface: Hex;
}

export interface Variant {
  readonly id: VariantId;
  readonly name: string;
  readonly polarity: Polarity;
  readonly description: string;
  readonly neutral: Readonly<Record<NeutralKey, Hex>>;
  readonly accent: Readonly<Record<Family, Readonly<Record<AccentTone, Hex>>>>;
  readonly syntax: Readonly<Record<SyntaxKey, Hex>>;
  readonly ansi: readonly Hex[];
  readonly overlay: Readonly<Record<OverlayKey, Overlay>>;
}

export interface SwatchInfo {
  readonly hex: Hex;
  readonly oklch: Oklch;
}
