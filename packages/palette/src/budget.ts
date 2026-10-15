import type { VariantId } from "./types.ts";

/**
 * Fovea's contrast budget and design limits. Every test reads its thresholds from here; nothing
 * else in the repository hard-codes a threshold. APCA values are absolute Lc (APCA 0.0.98G-4g)
 * against the surface the element sits on; WCAG values are WCAG 2.2 contrast ratios.
 * See docs/design.md for the reasoning behind each row.
 */

export interface Band {
  /** Minimum absolute APCA Lc. */
  readonly min: number;
  /** Maximum absolute APCA Lc, where an upper bound applies. */
  readonly max?: number;
  /** Minimum WCAG 2.2 contrast ratio, where a floor applies. */
  readonly wcag?: number;
}

type PerVariant<T> = Readonly<Record<VariantId, T>>;

const same = <T>(value: T): PerVariant<T> => ({ day: value, dusk: value, night: value });

export const budget = {
  /** Plain code text and body text. Upper bounds in dark variants guard against halation. */
  primaryText: {
    day: { min: 90, wcag: 7 },
    dusk: { min: 85, max: 92, wcag: 7 },
    night: { min: 75, max: 82, wcag: 7 },
  } satisfies PerVariant<Band>,

  /** Syntax token colors other than comments and punctuation. */
  syntax: same<Band>({ min: 75, wcag: 4.5 }),

  /** Comments, doc comments and punctuation. */
  quiet: same<Band>({ min: 60, max: 75, wcag: 4.5 }),

  /** Any token color on selection, find/word highlights, diff line backgrounds or the current line. */
  onOverlay: same<Band>({ min: 60, wcag: 4.5 }),

  /** Active line number and active tab title. */
  active: same<Band>({ min: 75, wcag: 4.5 }),

  /** Secondary UI text, line numbers, inlay hints and ghost text. */
  secondary: same<Band>({ min: 45, wcag: 3 }),

  /**
   * UI text in an accent color: diagnostics, git decorations, test results. APCA's floor for
   * content text that is not body text. Accent colors used inside code come from the syntax tones,
   * which meet the syntax row instead.
   */
  semanticText: same<Band>({ min: 60, wcag: 4.5 }),

  /**
   * Workbench labels in the neutral UI tone: side bar, status bar and title bar text, and button
   * labels. Content text that is scanned rather than read, so it takes APCA's content-text floor.
   */
  uiText: same<Band>({ min: 60, wcag: 4.5 }),

  /** Emphasized accent text (the `strong` tones). */
  strongText: same<Band>({ min: 75, wcag: 4.5 }),

  /** Placeholder and disabled text. */
  placeholder: same<Band>({ min: 30 }),

  /** The text cursor. */
  cursor: same<Band>({ min: 60, wcag: 3 }),

  /** Focus outlines, input borders and squiggles (WCAG 2.2 SC 1.4.11). */
  uiComponent: same<Band>({ min: 45, wcag: 3 }),

  /** Indent guides, rulers, whitespace markers and dividers. */
  decorative: same<Band>({ min: 15, max: 30 }),

  /** ANSI colors used as text: 1–6 and 9–14, plus 7/15 (dark) or 0/8 (light). */
  ansiText: same<Band>({ min: 60, wcag: 4.5 }),
  /**
   * Design aim (not a floor) for ANSI red, green, yellow and blue. The dark variants exempt red,
   * which must sit well below green to survive CVD simulation
   * (docs/decisions/008-ansi-red-dark-variants.md).
   */
  ansiAim: {
    lc: 75,
    indices: [1, 2, 3, 4],
    exempt: { day: [], dusk: [1], night: [1] },
  },

  /** ANSI 8 (bright black) in dark variants: dim output and shell autosuggestions. */
  ansiBrightBlackDark: { min: 45, max: 60, wcag: 3 } satisfies Band,

  /** Accents in the same emphasis tier sit within this many Lc of each other. */
  tierSpread: 3,

  /** Minimum ΔE_OK between any two syntax accents in normal vision. */
  syntaxDeltaE: { day: 0.08, dusk: 0.08, night: 0.08 } satisfies PerVariant<number>,

  /**
   * Semantic pairs: worst-case ΔE_OK across the CVD simulations (the three dichromacies plus
   * Machado's tritanomaly approximation).
   */
  semanticCvdDeltaE: 0.1,
  /**
   * The diff background-tint pair. On Day's light paper, tints dark enough to separate under CVD
   * would push comments below the token-on-overlay floor, so Day uses a lower bar and relies on
   * the diff gutter's +/− markers (docs/decisions/004-day-diff-tints.md).
   */
  diffTintCvdDeltaE: { day: 0.06, dusk: 0.1, night: 0.1 } satisfies PerVariant<number>,
  /**
   * Semantic pairs must also differ in OKLab lightness by at least this much (about three CIELAB
   * ΔL* units: visible side by side, and in grayscale). The CVD ΔE carries the main separation;
   * this keeps pairs from relying on chroma alone. Night's text band is too narrow for more.
   */
  semanticDeltaL: 0.03,

  /** ΔE_OK between an ANSI normal color and its bright counterpart. */
  ansiBrightDeltaE: 0.04,
  /** ANSI 7 is a light gray: neutral, and lighter than bright black (8). */
  ansiGrayChromaMax: 0.02,

  /**
   * OKLCH chroma caps for accents. Night's starting cap of 0.09 was raised to 0.10 so six syntax
   * hues can keep ΔE_OK ≥ 0.08 (docs/decisions/003-night-chroma-cap.md).
   */
  chromaCap: { day: 0.15, dusk: 0.12, night: 0.1 } satisfies PerVariant<number>,

  /** Neutral ramp limits. */
  neutralChromaMax: 0.02,

  /** Warm-neutral white point for Day's background and the dark variants' foregrounds. */
  whitePoint: { cctMin: 4500, cctMax: 6500, duvMax: 0.006 },

  /**
   * Two syntax colors whose hues are within `oppositeWithin` degrees of opposite, both above
   * `chroma`, raise a warning. 60° covers red against blue, the classic chromostereopsis pair,
   * which sits about 120–140° apart in OKLCH.
   */
  chromostereopsis: { oppositeWithin: 60, chroma: 0.12 },

  /** Pure black and white are banned from every theme. */
  banned: ["#000000", "#ffffff"],
} as const;

export type Budget = typeof budget;
