import type { VariantSpec } from "../types.ts";
import { hueOf, syntaxTones, tones } from "./shared.ts";

/** Neutral hue: Dusk's graphite, leaning slightly warmer. */
const N = 62;
const C = 0.1;

const tint = { l: 0.215, c: 0.028 };
const tintStrong = { l: 0.26, c: 0.04 };

export const night: VariantSpec = {
  id: "night",
  name: "Fovea Night",
  polarity: "dark",
  description:
    "Dusk dimmed for dark rooms and late hours: the least light that still meets body-text minimums.",
  neutral: {
    "bg.sunken": { l: 0.15, c: 0.006, h: N },
    bg: { l: 0.175, c: 0.007, h: N },
    "bg.raised": { l: 0.205, c: 0.008, h: N },
    "bg.overlay": { l: 0.24, c: 0.009, h: N },
    border: { lc: 18, c: 0.009, h: N },
    "border.strong": { lc: 47, c: 0.01, h: N },
    "fg.faint": { lc: 34, c: 0.012, h: N },
    "fg.muted": { lc: 48, c: 0.012, h: N },
    "fg.subtle": { lc: 66, c: 0.013, h: N },
    fg: { lc: 78, c: 0.014, h: N },
    "fg.strong": { lc: 81, c: 0.014, h: N },
  },
  accent: {
    red: tones("red", { lc: { fg: 62, strong: 75, dim: 45 }, c: C, tint, tintStrong }),
    orange: tones("orange", { lc: { fg: 76, strong: 80, dim: 52 }, c: C, tint, tintStrong }),
    yellow: tones("yellow", { lc: { fg: 82, strong: 82, dim: 64 }, c: C, tint, tintStrong }),
    green: tones("green", { lc: { fg: 78, strong: 82, dim: 58 }, c: C, tint, tintStrong }),
    teal: tones("teal", { lc: { fg: 80, strong: 82, dim: 62 }, c: 0.075, tint, tintStrong }),
    blue: tones("blue", { lc: { fg: 76, strong: 80, dim: 50 }, c: 0.07, tint, tintStrong }),
    violet: tones("violet", { lc: { fg: 76, strong: 80, dim: 50 }, c: 0.07, tint, tintStrong }),
    pink: tones("pink", { lc: { fg: 76, strong: 80, dim: 50 }, c: C, tint, tintStrong }),
  },
  syntax: syntaxTones({
    accent: 76,
    definition: 82,
    invalid: 75,
    inserted: 85,
    deleted: 75,
    c: C,
    quietC: 0.075,
  }),
  ansi: [
    { l: 0.24, c: 0.009, h: N },
    { lc: 60, c: 0.06, h: hueOf("red", 12) },
    { lc: 82, c: 0.06, h: hueOf("green", 15) },
    { lc: 76, c: 0.07, h: hueOf("yellow", -13) },
    { lc: 75, c: 0.055, h: hueOf("blue") },
    { lc: 70, c: 0.06, h: hueOf("pink", -15) },
    { lc: 74, c: 0.055, h: hueOf("teal", -10) },
    { lc: 72, c: 0.013, h: N },
    { lc: 48, c: 0.012, h: N },
    { lc: 65, c: C, h: hueOf("red", 12) },
    { lc: 88, c: C, h: hueOf("green", 15) },
    { lc: 83, c: C, h: hueOf("yellow", -13) },
    { lc: 83, c: 0.075, h: hueOf("blue") },
    { lc: 78, c: 0.085, h: hueOf("pink", -15) },
    { lc: 82, c: 0.075, h: hueOf("teal", -10) },
    { lc: 90, c: 0.014, h: N },
  ],
  overlay: {
    "line.current": { dl: 0.015, c: 0.008, h: N, alpha: 0.5 },
    selection: { dl: 0.074, c: 0.045, h: 250, alpha: 0.4 },
    "selection.inactive": { dl: 0.04, c: 0.02, h: 250, alpha: 0.4 },
    word: { dl: 0.04, c: 0.026, h: 250, alpha: 0.35 },
    "word.strong": { dl: 0.05, c: 0.034, h: 250, alpha: 0.4 },
    "find.match": { dl: -0.028, c: 0.065, h: 75, alpha: 0.7 },
    "find.other": { dl: 0.016, c: 0.04, h: 80, alpha: 0.45 },
    "diff.added.line": { dl: 0.088, c: 0.04, h: 215, alpha: 0.35 },
    "diff.added.text": { dl: 0.105, c: 0.05, h: 215, alpha: 0.45, over: "diff.added.line" },
    "diff.removed.line": { dl: -0.008, c: 0.045, h: 30, alpha: 0.35 },
    "diff.removed.text": { dl: -0.005, c: 0.07, h: 30, alpha: 0.45, over: "diff.removed.line" },
  },
};
