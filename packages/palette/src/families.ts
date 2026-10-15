import type { Family, SyntaxKey } from "./types.ts";

export interface FamilyInfo {
  /** Display name, used on the website and in docs. */
  readonly name: string;
  /** Base OKLCH hue in degrees, shared by every variant. */
  readonly hue: number;
  /** Tones may sit up to this many degrees from `hue` (ANSI tones use this room). */
  readonly band: number;
}

/**
 * The eight hue families. A role keeps its family in every variant, so switching variants never
 * changes meaning; only lightness and chroma adapt. The six syntax hues were spaced by a search
 * that maximised the smallest ΔE_OK between syntax colors in all three variants at once (see
 * docs/design.md, "Hue families"). Red leans toward coral so it survives red-green CVD against
 * teal. The bands do not overlap, so every tone belongs to exactly one family.
 */
export const families: Readonly<Record<Family, FamilyInfo>> = {
  red: { name: "Ember", hue: 27, band: 14 },
  orange: { name: "Clay", hue: 60, band: 12 },
  yellow: { name: "Macula", hue: 108, band: 17 },
  green: { name: "Fern", hue: 155, band: 17 },
  teal: { name: "Lagoon", hue: 210, band: 15 },
  blue: { name: "Cornflower", hue: 250, band: 12 },
  violet: { name: "Iris", hue: 280, band: 12 },
  pink: { name: "Heather", hue: 335, band: 18 },
};

/** Which family each syntax class belongs to (fixed across variants). */
export const syntaxFamily: Readonly<Record<SyntaxKey, Family>> = {
  keyword: "violet",
  string: "green",
  escape: "pink",
  constant: "orange",
  definition: "yellow",
  type: "teal",
  invalid: "red",
  inserted: "teal",
  deleted: "red",
};

/**
 * The quiet syntax classes: the two most frequent highlighted roles, kept at low chroma so the
 * colors seen most often are the calmest (docs/generated/token-frequency.md).
 */
export const QUIET_SYNTAX: readonly SyntaxKey[] = ["keyword", "type"];

/** Neutral display names per variant. */
export const neutralNames = {
  day: "Paper",
  dusk: "Graphite",
  night: "Umbra",
} as const;
