import type { VariantSpec } from "../types.ts";
import { hueOf, syntaxTones, tones } from "./shared.ts";

/** Neutral hue: a warm paper white close to the daylight locus. */
const N = 80;
const C = 0.15;

const tint = { l: 0.935, c: 0.035 };
const tintStrong = { l: 0.895, c: 0.06 };

export const day: VariantSpec = {
  id: "day",
  name: "Fovea Day",
  polarity: "light",
  description:
    "Ink on warm paper. The most legible variant for long reading, and the natural match for bright rooms and daylight.",
  neutral: {
    "bg.sunken": { l: 0.947, c: 0.013, h: N },
    bg: { l: 0.97, c: 0.012, h: N },
    "bg.raised": { l: 0.985, c: 0.008, h: N },
    "bg.overlay": { l: 0.925, c: 0.014, h: N },
    border: { lc: 22, c: 0.014, h: N },
    "border.strong": { lc: 57, c: 0.014, h: N },
    "fg.faint": { lc: 40, c: 0.014, h: N },
    "fg.muted": { lc: 58, c: 0.014, h: N },
    "fg.subtle": { lc: 74.6, c: 0.014, h: N },
    fg: { lc: 96, c: 0.012, h: N },
    "fg.strong": { lc: 98, c: 0.012, h: N },
  },
  accent: {
    red: tones("red", { lc: { fg: 90, strong: 95, dim: 76 }, c: C, tint, tintStrong }),
    orange: tones("orange", { lc: { fg: 80, strong: 90, dim: 58 }, c: C, tint, tintStrong }),
    yellow: tones("yellow", { lc: { fg: 78, strong: 88, dim: 58 }, c: C, tint, tintStrong }),
    green: tones("green", { lc: { fg: 78, strong: 88, dim: 58 }, c: C, tint, tintStrong }),
    teal: tones("teal", { lc: { fg: 76, strong: 86, dim: 58 }, c: 0.12, tint, tintStrong }),
    blue: tones("blue", { lc: { fg: 82, strong: 90, dim: 60 }, c: 0.13, tint, tintStrong }),
    violet: tones("violet", { lc: { fg: 80, strong: 90, dim: 58 }, c: 0.13, tint, tintStrong }),
    pink: tones("pink", { lc: { fg: 80, strong: 90, dim: 58 }, c: C, tint, tintStrong }),
  },
  syntax: syntaxTones({
    accent: 78,
    definition: 88,
    invalid: 86,
    inserted: 76,
    deleted: 88,
    c: C,
    quietC: 0.09,
    // Lemon at reading contrast on paper turns olive; a gold in the same family reads as yellow.
    hueShift: { definition: -12 },
  }),
  ansi: [
    { lc: 96, c: 0.012, h: N },
    { lc: 92, c: C, h: hueOf("red") },
    { lc: 77, c: C, h: hueOf("green") },
    { lc: 77, c: C, h: hueOf("yellow", -13) },
    { lc: 82, c: 0.13, h: hueOf("blue") },
    { lc: 80, c: C, h: hueOf("pink", -15) },
    { lc: 80, c: 0.12, h: hueOf("teal", -10) },
    { l: 0.86, c: 0.012, h: N },
    { lc: 72, c: 0.012, h: N },
    { lc: 86, c: C, h: hueOf("red", 5) },
    { lc: 71, c: C, h: hueOf("green", 5) },
    { lc: 71, c: C, h: hueOf("yellow", -13) },
    { lc: 73, c: C, h: hueOf("blue") },
    { lc: 72, c: C, h: hueOf("pink", -15) },
    { lc: 71, c: C, h: hueOf("teal", -10) },
    { l: 0.935, c: 0.01, h: N },
  ],
  overlay: {
    "line.current": { dl: -0.012, c: 0.012, h: N, alpha: 0.5 },
    selection: { dl: -0.024, c: 0.045, h: 205, alpha: 0.4 },
    "selection.inactive": { dl: -0.016, c: 0.02, h: 205, alpha: 0.4 },
    word: { dl: -0.016, c: 0.028, h: 205, alpha: 0.35 },
    "word.strong": { dl: -0.024, c: 0.035, h: 205, alpha: 0.4 },
    "find.match": { dl: -0.07, c: 0.1, h: 75, alpha: 0.7 },
    "find.other": { dl: -0.032, c: 0.07, h: 80, alpha: 0.45 },
    "diff.added.line": { dl: 0.012, c: 0.025, h: 210, alpha: 0.35 },
    "diff.added.text": { dl: -0.008, c: 0.045, h: 210, alpha: 0.45, over: "diff.added.line" },
    "diff.removed.line": { dl: -0.05, c: 0.045, h: 32, alpha: 0.35 },
    "diff.removed.text": {
      dl: -0.063,
      c: 0.05,
      h: 32,
      alpha: 0.45,
      over: "diff.removed.line",
    },
  },
};
