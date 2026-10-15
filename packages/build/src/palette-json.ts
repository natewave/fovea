import { type Hex, hexToOklch, parseHexAlpha } from "@fovea/colorlab";
import {
  ACCENT_TONES,
  FAMILIES,
  NEUTRAL_KEYS,
  OVERLAY_KEYS,
  type Overlay,
  type Polarity,
  type Ref,
  ROLE_NAMES,
  resolveRef,
  roles,
  SYNTAX_KEYS,
  type Variant,
  type VariantId,
} from "@fovea/palette";

export interface JsonColor {
  readonly hex: Hex;
  readonly rgb: readonly [number, number, number];
  readonly oklch: { readonly l: number; readonly c: number; readonly h: number };
}

export interface JsonOverlay {
  /** `#rrggbbaa`, the value to paint over the surface below. */
  readonly hex: Hex;
  readonly alpha: number;
  /** The overlay flattened onto its surface: the color contrast is measured against. */
  readonly surface: JsonColor;
}

export interface JsonVariant {
  readonly name: string;
  readonly polarity: Polarity;
  readonly description: string;
  readonly neutral: Readonly<Record<string, JsonColor>>;
  readonly accent: Readonly<Record<string, Readonly<Record<string, JsonColor>>>>;
  readonly syntax: Readonly<Record<string, JsonColor>>;
  readonly ansi: readonly JsonColor[];
  readonly overlay: Readonly<Record<string, JsonOverlay>>;
  readonly roles: Readonly<Record<string, { readonly ref: Ref; readonly hex: Hex }>>;
}

export interface PaletteData {
  readonly $comment: string;
  readonly name: string;
  readonly license: string;
  readonly variants: Readonly<Partial<Record<VariantId, JsonVariant>>>;
}

const round = (x: number, digits: number): number => Number(x.toFixed(digits));
const byte = (x: number): number => Math.round(x * 255);

/** Hue is meaningless for near-neutral colors; report 0 so the output stays stable. */
const MIN_CHROMA_FOR_HUE = 1e-4;

export const jsonColor = (hex: Hex): JsonColor => {
  const { rgb } = parseHexAlpha(hex);
  const { l, c, h } = hexToOklch(hex);
  return {
    hex,
    rgb: [byte(rgb.r), byte(rgb.g), byte(rgb.b)],
    oklch: {
      l: round(l, 4),
      c: round(c, 4),
      h: Number.isFinite(h) && c >= MIN_CHROMA_FOR_HUE ? round(h, 2) : 0,
    },
  };
};

const jsonOverlay = (o: Overlay): JsonOverlay => ({
  hex: o.color,
  alpha: round(parseHexAlpha(o.color).alpha, 3),
  surface: jsonColor(o.surface),
});

const record = <K extends string, T>(
  keys: readonly K[],
  value: (key: K) => T,
): Readonly<Record<string, T>> => Object.fromEntries(keys.map((k) => [k, value(k)]));

export const jsonVariant = (v: Variant): JsonVariant => ({
  name: v.name,
  polarity: v.polarity,
  description: v.description,
  neutral: record(NEUTRAL_KEYS, (k) => jsonColor(v.neutral[k])),
  accent: record(FAMILIES, (f) => record(ACCENT_TONES, (t) => jsonColor(v.accent[f][t]))),
  syntax: record(SYNTAX_KEYS, (k) => jsonColor(v.syntax[k])),
  ansi: v.ansi.map(jsonColor),
  overlay: record(OVERLAY_KEYS, (k) => jsonOverlay(v.overlay[k])),
  roles: record(ROLE_NAMES, (r) => ({ ref: roles[r], hex: resolveRef(v, roles[r]) })),
});

export const paletteData = (variants: readonly Variant[]): PaletteData => ({
  $comment: "Generated from packages/palette by packages/build. Do not edit.",
  name: "Fovea",
  license: "MIT",
  variants: Object.fromEntries(variants.map((v) => [v.id, jsonVariant(v)])),
});

const isPrimitive = (value: unknown): boolean => typeof value !== "object" || value === null;

/** JSON with two-space indentation, keeping arrays and objects of primitives on one line. */
export const formatJson = (value: unknown, indent = ""): string => {
  if (isPrimitive(value)) {
    return JSON.stringify(value);
  }
  const inner = `${indent}  `;
  if (Array.isArray(value)) {
    return value.every(isPrimitive)
      ? `[${value.map((x) => JSON.stringify(x)).join(", ")}]`
      : `[\n${value.map((x) => inner + formatJson(x, inner)).join(",\n")}\n${indent}]`;
  }
  const entries = Object.entries(value as Readonly<Record<string, unknown>>);
  if (entries.length === 0) {
    return "{}";
  }
  return entries.every(([, x]) => isPrimitive(x))
    ? `{ ${entries.map(([k, x]) => `${JSON.stringify(k)}: ${JSON.stringify(x)}`).join(", ")} }`
    : `{\n${entries.map(([k, x]) => `${inner}${JSON.stringify(k)}: ${formatJson(x, inner)}`).join(",\n")}\n${indent}}`;
};

/** `fovea.json`: OKLCH, RGB, hex and roles for every variant. */
export const paletteJson = (variants: readonly Variant[]): string =>
  `${formatJson(paletteData(variants))}\n`;
