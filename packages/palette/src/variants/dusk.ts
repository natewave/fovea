import type { VariantSpec } from "../types.ts";
import { hueOf, syntaxTones, tones } from "./shared.ts";

/** Neutral hue: warm graphite. */
const N = 70;
const C = 0.12;

const tint = { l: 0.27, c: 0.035 };
const tintStrong = { l: 0.32, c: 0.05 };

export const dusk: VariantSpec = {
  id: "dusk",
  name: "Fovea Dusk",
  polarity: "dark",
  description:
    "Soft light on warm graphite, for dim rooms, evenings and anyone who prefers dark mode.",
  neutral: {
    "bg.sunken": { l: 0.195, c: 0.008, h: N },
    bg: { l: 0.225, c: 0.008, h: N },
    "bg.raised": { l: 0.262, c: 0.009, h: N },
    "bg.overlay": { l: 0.3, c: 0.01, h: N },
    border: { lc: 20, c: 0.01, h: N },
    "border.strong": { lc: 48, c: 0.01, h: N },
    "fg.faint": { lc: 36, c: 0.01, h: N },
    "fg.muted": { lc: 50, c: 0.01, h: N },
    "fg.subtle": { lc: 68, c: 0.01, h: N },
    fg: { lc: 87, c: 0.01, h: N },
    "fg.strong": { lc: 91, c: 0.01, h: N },
  },
  accent: {
    red: tones("red", { lc: { fg: 66, strong: 75, dim: 46 }, c: C, tint, tintStrong }),
    orange: tones("orange", { lc: { fg: 78, strong: 84, dim: 56 }, c: C, tint, tintStrong }),
    yellow: tones("yellow", { lc: { fg: 84, strong: 88, dim: 64 }, c: C, tint, tintStrong }),
    green: tones("green", { lc: { fg: 82, strong: 88, dim: 62 }, c: C, tint, tintStrong }),
    teal: tones("teal", { lc: { fg: 84, strong: 88, dim: 66 }, c: 0.1, tint, tintStrong }),
    blue: tones("blue", { lc: { fg: 78, strong: 84, dim: 52 }, c: 0.09, tint, tintStrong }),
    violet: tones("violet", { lc: { fg: 78, strong: 84, dim: 52 }, c: 0.09, tint, tintStrong }),
    pink: tones("pink", { lc: { fg: 78, strong: 84, dim: 52 }, c: C, tint, tintStrong }),
  },
  syntax: syntaxTones({
    accent: 77,
    definition: 84,
    invalid: 76,
    inserted: 86,
    deleted: 75,
    c: C,
    quietC: 0.08,
  }),
  ansi: [
    { l: 0.3, c: 0.01, h: N },
    { lc: 60, c: 0.08, h: hueOf("red", 12) },
    { lc: 82, c: 0.08, h: hueOf("green", 15) },
    { lc: 80, c: C, h: hueOf("yellow", -13) },
    { lc: 76, c: 0.09, h: hueOf("blue") },
    { lc: 75, c: 0.1, h: hueOf("pink", -15) },
    { lc: 80, c: 0.09, h: hueOf("teal", -10) },
    { lc: 76, c: 0.01, h: N },
    { lc: 52, c: 0.01, h: N },
    { lc: 66, c: C, h: hueOf("red", 12) },
    { lc: 90, c: C, h: hueOf("green", 15) },
    { lc: 91, c: C, h: hueOf("yellow", -13) },
    { lc: 85, c: 0.08, h: hueOf("blue") },
    { lc: 85, c: 0.09, h: hueOf("pink", -15) },
    { lc: 89, c: 0.09, h: hueOf("teal", -10) },
    { lc: 93, c: 0.01, h: N },
  ],
  overlay: {
    "line.current": { dl: 0.018, c: 0.01, h: N, alpha: 0.5 },
    selection: { dl: 0.065, c: 0.05, h: 250, alpha: 0.4 },
    "selection.inactive": { dl: 0.04, c: 0.022, h: 250, alpha: 0.4 },
    word: { dl: 0.04, c: 0.03, h: 250, alpha: 0.35 },
    "word.strong": { dl: 0.052, c: 0.04, h: 250, alpha: 0.4 },
    "find.match": { dl: -0.028, c: 0.075, h: 75, alpha: 0.55 },
    "find.other": { dl: 0.02, c: 0.05, h: 80, alpha: 0.45 },
    "diff.added.line": { dl: 0.085, c: 0.045, h: 215, alpha: 0.35 },
    "diff.added.text": { dl: 0.115, c: 0.06, h: 215, alpha: 0.45, over: "diff.added.line" },
    "diff.removed.line": { dl: -0.008, c: 0.05, h: 30, alpha: 0.35 },
    "diff.removed.text": { dl: -0.004, c: 0.08, h: 30, alpha: 0.45, over: "diff.removed.line" },
  },
};
