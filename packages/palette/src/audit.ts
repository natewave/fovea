import {
  apcaLc,
  cctDuv,
  cvdDifference,
  deltaEOK,
  deltaL,
  flatten,
  type Hex,
  hexToOklch,
  relativeLuminance,
  wcagContrast,
} from "@fovea/colorlab";
import { type Band, budget } from "./budget.ts";
import { resolveSurface, role, semanticPairs } from "./roles.ts";
import {
  FAMILIES,
  type NeutralKey,
  OVERLAY_KEYS,
  type Polarity,
  SYNTAX_KEYS,
  type SyntaxKey,
  type Variant,
  type VariantId,
} from "./types.ts";

/**
 * Pure audits of a resolved variant against the contrast budget and design rules. The palette
 * tests assert on these, and the report page renders them, so both always agree.
 */

export type BudgetRow =
  | "primaryText"
  | "syntax"
  | "quiet"
  | "onOverlay"
  | "active"
  | "secondary"
  | "semanticText"
  | "uiText"
  | "strongText"
  | "placeholder"
  | "cursor"
  | "uiComponent"
  | "decorative"
  | "ansiText"
  | "ansiBrightBlackDark";

export interface ContrastCheck {
  readonly variant: VariantId;
  readonly row: BudgetRow;
  readonly label: string;
  readonly text: Hex;
  readonly surface: Hex;
  readonly lc: number;
  readonly wcag: number;
  readonly band: Band;
  readonly pass: boolean;
}

const bandFor = (row: BudgetRow, id: VariantId): Band =>
  row === "ansiBrightBlackDark" ? budget.ansiBrightBlackDark : budget[row][id];

export const meets = (lc: number, wcag: number, band: Band): boolean =>
  lc >= band.min &&
  (band.max === undefined || lc <= band.max) &&
  (band.wcag === undefined || wcag >= band.wcag);

const check = (
  v: Variant,
  row: BudgetRow,
  label: string,
  text: Hex,
  surface: Hex,
): ContrastCheck => {
  const band = bandFor(row, v.id);
  const lc = apcaLc({ text, surface });
  const wcag = wcagContrast(text, surface);
  return { variant: v.id, row, label, text, surface, lc, wcag, band, pass: meets(lc, wcag, band) };
};

/** Syntax classes sharing the default emphasis tier (definitions are deliberately stronger). */
export const ACCENT_TIER: readonly SyntaxKey[] = [
  "keyword",
  "string",
  "escape",
  "constant",
  "type",
];

/** Token colors that appear in code, with the budget row each must satisfy on `bg`. */
export const tokenColors = (v: Variant): readonly (readonly [string, Hex, BudgetRow])[] => [
  ["plain text", v.neutral.fg, "primaryText"],
  ["comment/punctuation", v.neutral["fg.subtle"], "quiet"],
  ...SYNTAX_KEYS.map((k) => [`syntax.${k}`, v.syntax[k], "syntax"] as const),
];

/** ANSI indices used as text, per polarity. */
export const ansiTextIndices = (polarity: Polarity): readonly number[] =>
  polarity === "dark"
    ? [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15]
    : [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14];

export const ANSI_NAMES: readonly string[] = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "bright black",
  "bright red",
  "bright green",
  "bright yellow",
  "bright blue",
  "bright magenta",
  "bright cyan",
  "bright white",
];

const uiSurfaces = (v: Variant): readonly (readonly [string, Hex])[] => [
  ["bg", v.neutral.bg],
  ["bg.sunken", v.neutral["bg.sunken"]],
  ["bg.raised", v.neutral["bg.raised"]],
];

/**
 * Every surface tokens can sit on besides `bg`: each overlay, plus the overlays VS Code paints on
 * top of the current-line highlight.
 */
export const tokenSurfaces = (v: Variant): readonly (readonly [string, Hex])[] => {
  const line = v.overlay["line.current"].surface;
  const stacked = (["selection", "word", "word.strong", "find.match", "find.other"] as const).map(
    (o) => [`${o} on line.current`, flatten(v.overlay[o].color, line)] as const,
  );
  return [...OVERLAY_KEYS.map((o) => [o, v.overlay[o].surface] as const), ...stacked];
};

export const contrastChecks = (v: Variant): readonly ContrastCheck[] => {
  const bg = v.neutral.bg;
  const n = (k: NeutralKey): Hex => v.neutral[k];
  const tokens = tokenColors(v);
  return [
    check(v, "primaryText", "fg on bg", n("fg"), bg),
    check(v, "primaryText", "fg on bg.raised", n("fg"), n("bg.raised")),
    ...tokens
      .filter(([, , row]) => row !== "primaryText")
      .map(([label, hex, row]) => check(v, row, `${label} on bg`, hex, bg)),
    ...FAMILIES.flatMap((f) => [
      ...uiSurfaces(v).map(([s, hex]) =>
        check(v, "semanticText", `${f}.fg on ${s}`, v.accent[f].fg, hex),
      ),
      check(v, "strongText", `${f}.strong on bg`, v.accent[f].strong, bg),
      check(v, "uiComponent", `${f}.dim on bg`, v.accent[f].dim, bg),
      check(v, "uiComponent", `${f}.dim on bg.sunken`, v.accent[f].dim, n("bg.sunken")),
    ]),
    ...tokenSurfaces(v).flatMap(([s, surface]) =>
      tokens.map(([label, hex]) => check(v, "onOverlay", `${label} on ${s}`, hex, surface)),
    ),
    check(v, "active", "active line number / tab title", role(v, "text"), bg),
    check(v, "uiText", "fg.subtle on bg.sunken", n("fg.subtle"), n("bg.sunken")),
    check(v, "uiText", "fg.subtle on bg.raised", n("fg.subtle"), n("bg.raised")),
    ...uiSurfaces(v).map(([s, hex]) =>
      check(v, "secondary", `fg.muted on ${s}`, n("fg.muted"), hex),
    ),
    ...uiSurfaces(v).map(([s, hex]) =>
      check(v, "placeholder", `fg.faint on ${s}`, n("fg.faint"), hex),
    ),
    check(v, "cursor", "cursor on bg", role(v, "cursor"), bg),
    check(v, "cursor", "cursor on selection", role(v, "cursor"), v.overlay.selection.surface),
    check(v, "uiComponent", "focus on bg", role(v, "focus"), bg),
    check(v, "uiComponent", "focus on bg.sunken", role(v, "focus"), n("bg.sunken")),
    check(v, "uiComponent", "border.strong on bg", n("border.strong"), bg),
    check(v, "uiComponent", "border.strong on bg.raised", n("border.strong"), n("bg.raised")),
    check(v, "uiComponent", "border.strong on bg.sunken", n("border.strong"), n("bg.sunken")),
    check(v, "decorative", "border on bg", n("border"), bg),
    ...ansiTextIndices(v.polarity).map((i) =>
      check(v, "ansiText", `ANSI ${i} (${ANSI_NAMES[i]})`, v.ansi[i] ?? bg, bg),
    ),
    ...(v.polarity === "dark"
      ? [check(v, "ansiBrightBlackDark", "ANSI 8 (bright black)", v.ansi[8] ?? bg, bg)]
      : []),
  ];
};

export interface TierCheck {
  readonly variant: VariantId;
  readonly values: Readonly<Record<string, number>>;
  readonly spread: number;
  readonly pass: boolean;
}

export const tierCheck = (v: Variant): TierCheck => {
  const values = Object.fromEntries(
    ACCENT_TIER.map((k) => [k, apcaLc({ text: v.syntax[k], surface: v.neutral.bg })]),
  );
  const lcs = Object.values(values);
  const spread = Math.max(...lcs) - Math.min(...lcs);
  return { variant: v.id, values, spread, pass: spread <= budget.tierSpread };
};

export interface PairCheck {
  readonly variant: VariantId;
  readonly a: string;
  readonly b: string;
  readonly normal: number;
  readonly worstCvd: number;
  readonly worstKind: string;
  readonly dl: number;
}

const pairs = <T>(items: readonly T[]): readonly (readonly [T, T])[] =>
  items.flatMap((a, i) => items.slice(i + 1).map((b) => [a, b] as const));

/**
 * The syntax accents that must stay apart from each other. The reserved red and the diff pair are
 * excluded: invalid code is also underlined, and inserted/deleted only appear in diff files.
 */
export const SYNTAX_ACCENTS: readonly SyntaxKey[] = [
  "keyword",
  "string",
  "escape",
  "constant",
  "definition",
  "type",
];

export const syntaxPairs = (v: Variant): readonly PairCheck[] =>
  pairs(SYNTAX_ACCENTS).map(([a, b]) => {
    const d = cvdDifference(v.syntax[a], v.syntax[b]);
    return {
      variant: v.id,
      a,
      b,
      normal: d.normal,
      worstCvd: d.worstCvd,
      worstKind: d.worstKind,
      dl: deltaL(v.syntax[a], v.syntax[b]),
    };
  });

export interface SemanticCheck extends PairCheck {
  readonly label: string;
  readonly threshold: number;
  readonly pass: boolean;
}

export const semanticChecks = (v: Variant): readonly SemanticCheck[] =>
  semanticPairs.map(({ label, a: ra, b: rb, tint }) => {
    const a = resolveSurface(v, ra);
    const b = resolveSurface(v, rb);
    const d = cvdDifference(a, b);
    const dl = deltaL(a, b);
    const threshold = tint ? budget.diffTintCvdDeltaE[v.id] : budget.semanticCvdDeltaE;
    return {
      variant: v.id,
      label,
      a: ra,
      b: rb,
      normal: d.normal,
      worstCvd: d.worstCvd,
      worstKind: d.worstKind,
      dl,
      threshold,
      pass: d.worstCvd >= threshold && dl >= budget.semanticDeltaL,
    };
  });

export interface AnsiCheck {
  readonly variant: VariantId;
  readonly label: string;
  readonly pass: boolean;
}

/** ANSI meanings: 0 darkest, 7 a light gray, 15 lightest, each bright distinct from its normal. */
export const ansiChecks = (v: Variant): readonly AnsiCheck[] => {
  const lightness = v.ansi.map((hex) => hexToOklch(hex).l);
  const at = (i: number): number => lightness[i] ?? Number.NaN;
  const others = (i: number): readonly number[] => lightness.filter((_, j) => j !== i);
  const ansi = (i: number): Hex => v.ansi[i] ?? v.neutral.bg;
  return [
    { variant: v.id, label: "ANSI 0 is the darkest", pass: others(0).every((l) => at(0) < l) },
    { variant: v.id, label: "ANSI 15 is the lightest", pass: others(15).every((l) => at(15) > l) },
    {
      variant: v.id,
      label: "ANSI 7 is a light gray",
      pass: hexToOklch(ansi(7)).c <= budget.ansiGrayChromaMax && at(7) > at(8) && at(7) < at(15),
    },
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
      variant: v.id,
      label: `ANSI ${i + 8} is distinct from ANSI ${i}`,
      pass: deltaEOK(ansi(i), ansi(i + 8)) >= budget.ansiBrightDeltaE,
    })),
  ];
};

export interface AimCheck {
  readonly variant: VariantId;
  readonly index: number;
  readonly lc: number;
  readonly exempt: boolean;
  readonly pass: boolean;
}

/** ANSI red, green, yellow and blue against the design aim, flagging documented exemptions. */
export const ansiAimChecks = (v: Variant): readonly AimCheck[] => {
  const exempt: readonly number[] = budget.ansiAim.exempt[v.id];
  return budget.ansiAim.indices.map((index) => {
    const lc = Math.abs(apcaLc({ text: v.ansi[index] ?? v.neutral.bg, surface: v.neutral.bg }));
    return {
      variant: v.id,
      index,
      lc,
      exempt: exempt.includes(index),
      pass: lc >= budget.ansiAim.lc,
    };
  });
};

export interface Warning {
  readonly variant: VariantId;
  readonly message: string;
}

/** Hue difference in degrees, 0–180. */
export const hueDistance = (a: number, b: number): number => Math.abs(((a - b + 540) % 360) - 180);

/** Roughly opposite hues that are both saturated can trigger chromostereopsis. */
export const chromostereopsisWarnings = (v: Variant): readonly Warning[] =>
  pairs(SYNTAX_KEYS).flatMap(([a, b]) => {
    const ca = hexToOklch(v.syntax[a]);
    const cb = hexToOklch(v.syntax[b]);
    const { oppositeWithin, chroma } = budget.chromostereopsis;
    return hueDistance(ca.h, cb.h) >= 180 - oppositeWithin && ca.c > chroma && cb.c > chroma
      ? [{ variant: v.id, message: `${a} and ${b} are near-opposite hues, both above C ${chroma}` }]
      : [];
  });

/** Neutral keys from the background end of the ramp to the text end. */
export const rampOrder = (polarity: Polarity): readonly NeutralKey[] => [
  ...(polarity === "dark"
    ? (["bg.sunken", "bg", "bg.raised", "bg.overlay"] as const)
    : (["bg.raised", "bg", "bg.sunken", "bg.overlay"] as const)),
  "border",
  "fg.faint",
  "border.strong",
  "fg.muted",
  "fg.subtle",
  "fg",
  "fg.strong",
];

export const rampLightness = (v: Variant): readonly (readonly [NeutralKey, number])[] =>
  rampOrder(v.polarity).map((k) => [k, hexToOklch(v.neutral[k]).l] as const);

export const isMonotonic = (values: readonly number[], increasing: boolean): boolean =>
  values.every((x, i) => {
    const prev = values[i - 1];
    return i === 0 || prev === undefined || (increasing ? x > prev : x < prev);
  });

/** The near-white neutrals whose white point matters: Day's paper, the dark variants' text. */
export const whiteNeutrals = (v: Variant): readonly (readonly [string, Hex])[] =>
  v.polarity === "light"
    ? [["bg", v.neutral.bg]]
    : [
        ["fg", v.neutral.fg],
        ["fg.strong", v.neutral["fg.strong"]],
      ];

export interface WhitePoint {
  readonly key: string;
  readonly hex: Hex;
  readonly cct: number;
  readonly duv: number;
}

export const whitePoints = (v: Variant): readonly WhitePoint[] =>
  whiteNeutrals(v).map(([key, hex]) => {
    const { cct, duv } = cctDuv(hex);
    return { key, hex, cct, duv };
  });

/**
 * A model of the light an editor window emits: area-weighted mean relative luminance of a typical
 * layout (editor and chrome surfaces plus the share of pixels covered by glyphs). The website
 * shows this estimate; it is a model of a layout, not a measurement of rendered pixels.
 */
export const emittedLight = (v: Variant): number => {
  const y = relativeLuminance;
  const accents = SYNTAX_ACCENTS.reduce((s, k) => s + y(v.syntax[k]), 0) / SYNTAX_ACCENTS.length;
  const ink = (y(v.neutral.fg) + accents) / 2;
  const editor = 0.88 * y(v.neutral.bg) + 0.12 * ink;
  const chrome = 0.92 * y(v.neutral["bg.sunken"]) + 0.08 * y(v.neutral["fg.muted"]);
  return 0.65 * editor + 0.35 * chrome;
};

/** Every color a variant ships, including overlay colors and their flattened surfaces. */
export const allHexes = (v: Variant): readonly Hex[] => [
  ...Object.values(v.neutral),
  ...FAMILIES.flatMap((f) => Object.values(v.accent[f])),
  ...Object.values(v.syntax),
  ...v.ansi,
  ...OVERLAY_KEYS.flatMap((o) => [v.overlay[o].color, v.overlay[o].surface]),
];
