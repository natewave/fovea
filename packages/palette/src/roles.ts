import type { Hex } from "@fovea/colorlab";
import {
  ACCENT_TONES,
  type AccentTone,
  FAMILIES,
  type Family,
  NEUTRAL_KEYS,
  type NeutralKey,
  OVERLAY_KEYS,
  type OverlayKey,
  SYNTAX_KEYS,
  type SyntaxKey,
  type Variant,
} from "./types.ts";

/** A reference to one palette entry. Overlay references resolve to the `#rrggbbaa` color. */
export type Ref =
  | `neutral.${NeutralKey}`
  | `${Family}.${AccentTone}`
  | `syntax.${SyntaxKey}`
  | `ansi.${number}`
  | `overlay.${OverlayKey}`;

/**
 * Semantic roles. Ports consume these, so meaning stays stable when the palette is tuned. A port
 * uses a palette entry directly only where the app asks for a hue by name (chart series, terminal
 * colors, merge sides); docs/style-guide.md lists those uses. The mapping is the same in every
 * variant.
 */
export const roles = {
  // Text, from strongest to faintest.
  "text.strong": "neutral.fg.strong",
  text: "neutral.fg",
  "text.subtle": "neutral.fg.subtle",
  "text.muted": "neutral.fg.muted",
  "text.faint": "neutral.fg.faint",

  // Surfaces: at most three elevations plus a neutral hover/active fill.
  "surface.chrome": "neutral.bg.sunken",
  "surface.editor": "neutral.bg",
  "surface.popup": "neutral.bg.raised",
  "surface.hover": "neutral.bg.overlay",
  border: "neutral.border",
  "border.strong": "neutral.border.strong",

  // Interaction.
  cursor: "yellow.strong",
  focus: "blue.dim",
  link: "blue.fg",
  accent: "yellow.fg",
  /** Fill behind primary actions (buttons, toggled options); text on it uses `text`. */
  "action.bg": "blue.tint.strong",

  // Diagnostics: text tones, non-text marks (squiggles, gutter, icons) and background tints.
  error: "red.fg",
  "error.mark": "red.dim",
  "error.bg": "red.tint",
  warning: "yellow.fg",
  "warning.mark": "yellow.dim",
  "warning.bg": "yellow.tint",
  info: "blue.fg",
  "info.mark": "blue.dim",
  "info.bg": "blue.tint",
  hint: "neutral.fg.muted",
  "hint.mark": "neutral.fg.muted",
  // Success and additions use teal, not green: red against teal survives red-green CVD when
  // red is the darker of the two (docs/design.md, "Color-vision deficiency").
  success: "teal.fg",
  "success.mark": "teal.dim",

  // Version control and diffs.
  added: "teal.fg",
  removed: "red.fg",
  modified: "blue.fg",
  renamed: "green.fg",
  untracked: "teal.fg",
  conflict: "pink.fg",
  ignored: "neutral.fg.faint",
  "added.mark": "teal.dim",
  "removed.mark": "red.dim",
  "modified.mark": "blue.dim",

  // Testing.
  "test.passed": "teal.dim",
  "test.failed": "red.dim",
  "test.skipped": "neutral.fg.muted",

  // Overlays.
  "overlay.line": "overlay.line.current",
  "overlay.selection": "overlay.selection",
  "overlay.selection.inactive": "overlay.selection.inactive",
  "overlay.word": "overlay.word",
  "overlay.word.strong": "overlay.word.strong",
  "overlay.find": "overlay.find.match",
  "overlay.find.other": "overlay.find.other",
  "overlay.added.line": "overlay.diff.added.line",
  "overlay.added.text": "overlay.diff.added.text",
  "overlay.removed.line": "overlay.diff.removed.line",
  "overlay.removed.text": "overlay.diff.removed.text",

  // Syntax.
  "syntax.plain": "neutral.fg",
  "syntax.punctuation": "neutral.fg.subtle",
  "syntax.comment": "neutral.fg.subtle",
  "syntax.keyword": "syntax.keyword",
  "syntax.string": "syntax.string",
  "syntax.escape": "syntax.escape",
  "syntax.constant": "syntax.constant",
  "syntax.definition": "syntax.definition",
  "syntax.type": "syntax.type",
  "syntax.invalid": "syntax.invalid",
  "syntax.inserted": "syntax.inserted",
  "syntax.deleted": "syntax.deleted",
} as const satisfies Record<string, Ref>;

export type Role = keyof typeof roles;

/** Every role name, in declaration order, so generated files list roles in a stable order. */
export const ROLE_NAMES = Object.keys(roles) as readonly Role[];

const isNeutralKey = (key: string): key is NeutralKey =>
  (NEUTRAL_KEYS as readonly string[]).includes(key);
const isFamily = (key: string): key is Family => (FAMILIES as readonly string[]).includes(key);
const isAccentTone = (key: string): key is AccentTone =>
  (ACCENT_TONES as readonly string[]).includes(key);
const isSyntaxKey = (key: string): key is SyntaxKey =>
  (SYNTAX_KEYS as readonly string[]).includes(key);
const isOverlayKey = (key: string): key is OverlayKey =>
  (OVERLAY_KEYS as readonly string[]).includes(key);

/** Resolves a palette reference in a variant. Overlays return the translucent color. */
export const resolveRef = (variant: Variant, ref: Ref): Hex => {
  const dot = ref.indexOf(".");
  const head = ref.slice(0, dot);
  const tail = ref.slice(dot + 1);
  if (head === "neutral" && isNeutralKey(tail)) {
    return variant.neutral[tail];
  }
  if (head === "syntax" && isSyntaxKey(tail)) {
    return variant.syntax[tail];
  }
  if (head === "overlay" && isOverlayKey(tail)) {
    return variant.overlay[tail].color;
  }
  if (head === "ansi") {
    const hex = variant.ansi[Number(tail)];
    if (hex !== undefined) {
      return hex;
    }
  }
  if (isFamily(head) && isAccentTone(tail)) {
    return variant.accent[head][tail];
  }
  throw new Error(`Unknown palette reference: ${ref}`);
};

/** For overlay refs, the composited surface; otherwise the color itself. */
export const resolveSurface = (variant: Variant, ref: Ref): Hex => {
  if (ref.startsWith("overlay.")) {
    const key = ref.slice("overlay.".length);
    if (isOverlayKey(key)) {
      return variant.overlay[key].surface;
    }
  }
  return resolveRef(variant, ref);
};

export const role = (variant: Variant, name: Role): Hex => resolveRef(variant, roles[name]);

export interface SemanticPair {
  readonly label: string;
  readonly a: Ref;
  readonly b: Ref;
  /** Diff background tints have their own threshold (see `budget.diffTintCvdDeltaE`). */
  readonly tint?: true;
}

/** Semantic pairs that must survive color-vision deficiency (worst-case ΔE_OK and a lightness gap). */
export const semanticPairs: readonly SemanticPair[] = [
  { label: "error vs success", a: roles.error, b: roles.success },
  {
    label: "diff removed vs added (text)",
    a: roles["syntax.deleted"],
    b: roles["syntax.inserted"],
  },
  {
    label: "diff removed vs added (line tint)",
    a: roles["overlay.removed.line"],
    b: roles["overlay.added.line"],
    tint: true,
  },
  {
    label: "diff removed vs added (text tint)",
    a: roles["overlay.removed.text"],
    b: roles["overlay.added.text"],
    tint: true,
  },
  { label: "diff removed vs added (gutter)", a: roles["removed.mark"], b: roles["added.mark"] },
  { label: "git deleted vs added", a: roles.removed, b: roles.added },
  { label: "git deleted vs untracked", a: roles.removed, b: roles.untracked },
  { label: "test failed vs passed", a: roles["test.failed"], b: roles["test.passed"] },
  { label: "ANSI red vs green (1/2)", a: "ansi.1", b: "ansi.2" },
  { label: "ANSI bright red vs green (9/10)", a: "ansi.9", b: "ansi.10" },
  { label: "warning vs error", a: roles.warning, b: roles.error },
  { label: "warning vs error (marks)", a: roles["warning.mark"], b: roles["error.mark"] },
  { label: "find match vs selection", a: roles["overlay.find"], b: roles["overlay.selection"] },
];
