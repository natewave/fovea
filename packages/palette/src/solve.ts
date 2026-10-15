import {
  apcaLc,
  clampChroma,
  compositeOver,
  formatHex,
  type Hex,
  hexToOklch,
  oklchToRgb,
  parseHex,
  type Rgb,
  withAlpha,
} from "@fovea/colorlab";
import {
  ACCENT_TONES,
  FAMILIES,
  type LcSpec,
  type LSpec,
  NEUTRAL_KEYS,
  type NeutralKey,
  OVERLAY_KEYS,
  type Overlay,
  type OverlayKey,
  type OverlaySpec,
  type Polarity,
  SYNTAX_KEYS,
  type ToneSpec,
  type Variant,
  type VariantSpec,
} from "./types.ts";

export const isLcSpec = (spec: ToneSpec): spec is LcSpec => "lc" in spec;

/** The in-gamut hex at a given lightness: chroma is capped at the sRGB boundary for that L and hue. */
export const toneHex = (l: number, c: number, h: number): Hex =>
  formatHex(oklchToRgb(clampChroma({ l, c, h })));

export const solveL = ({ l, c, h }: LSpec): Hex => toneHex(l, c, h);

const BISECT_STEPS = 48;
const NUDGE = 0.0005;
const MAX_NUDGES = 200;

/**
 * Finds the lightness whose tone reaches `lc` against `surface`. Text runs darker than the surface
 * in light variants and lighter in dark ones. After 8-bit quantisation the result is nudged, if
 * needed, so the shipped hex meets the target rather than the unrounded value.
 */
export const solveLc = (spec: LcSpec, surface: Hex, polarity: Polarity): Hex => {
  const surfaceL = hexToOklch(surface).l;
  const light = polarity === "light";
  const contrast = (l: number): number => apcaLc({ text: toneHex(l, spec.c, spec.h), surface });
  const bisect = (lo: number, hi: number, i: number): number => {
    if (i === 0) {
      return (lo + hi) / 2;
    }
    const mid = (lo + hi) / 2;
    const enough = contrast(mid) >= spec.lc;
    if (light) {
      return enough ? bisect(mid, hi, i - 1) : bisect(lo, mid, i - 1);
    }
    return enough ? bisect(lo, mid, i - 1) : bisect(mid, hi, i - 1);
  };
  const start = light ? bisect(0, surfaceL, BISECT_STEPS) : bisect(surfaceL, 1, BISECT_STEPS);
  const nudge = (l: number, n: number): Hex => {
    const hex = toneHex(l, spec.c, spec.h);
    if (apcaLc({ text: hex, surface }) >= spec.lc || n === 0) {
      return hex;
    }
    return nudge(light ? l - NUDGE : l + NUDGE, n - 1);
  };
  return nudge(start, MAX_NUDGES);
};

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
const fits = (rgb: Rgb): boolean => [rgb.r, rgb.g, rgb.b].every((v) => v >= 0 && v <= 1);

/**
 * VS Code paints overlays over other decorations and asks that they not be opaque, so no overlay
 * goes above this alpha.
 */
export const MAX_OVERLAY_ALPHA = 0.8;
const ALPHA_STEP = 0.05;
const CHROMA_STEPS = 30;

/** The overlay color that composites onto `target` over `base` at `alpha`. */
const overlayColor = (target: Rgb, base: Rgb, alpha: number): Rgb => ({
  r: base.r + (target.r - base.r) / alpha,
  g: base.g + (target.g - base.g) / alpha,
  b: base.b + (target.b - base.b) / alpha,
});

/**
 * Solves a translucent overlay whose composite over `base` lands on the designed surface, which
 * sits `dl` from `bg` in lightness. When the overlay color would leave the sRGB cube, alpha rises
 * in 0.05 steps up to `MAX_OVERLAY_ALPHA`; past that, the target's chroma is reduced (lightness
 * and hue are kept, so token contrast is unchanged).
 */
export const solveOverlay = (spec: OverlaySpec, bg: Hex, base: Hex = bg): Overlay => {
  const baseRgb = parseHex(base);
  const l = hexToOklch(bg).l + spec.dl;
  const targetAt = (c: number): Rgb => oklchToRgb(clampChroma({ l, c, h: spec.h }));
  const feasibleAlpha = (target: Rgb, alpha: number): number | undefined => {
    if (alpha > MAX_OVERLAY_ALPHA + 1e-9) {
      return undefined;
    }
    return fits(overlayColor(target, baseRgb, alpha))
      ? alpha
      : feasibleAlpha(target, Math.round((alpha + ALPHA_STEP) * 100) / 100);
  };
  const reduceChroma = (lo: number, hi: number, i: number): number => {
    if (i === 0) {
      return lo;
    }
    const mid = (lo + hi) / 2;
    return fits(overlayColor(targetAt(mid), baseRgb, MAX_OVERLAY_ALPHA))
      ? reduceChroma(mid, hi, i - 1)
      : reduceChroma(lo, mid, i - 1);
  };
  const direct = feasibleAlpha(targetAt(spec.c), spec.alpha);
  const alpha = direct ?? MAX_OVERLAY_ALPHA;
  const target =
    direct === undefined ? targetAt(reduceChroma(0, spec.c, CHROMA_STEPS)) : targetAt(spec.c);
  const raw = overlayColor(target, baseRgb, alpha);
  const quantised = formatHex({ r: clamp01(raw.r), g: clamp01(raw.g), b: clamp01(raw.b) });
  const color = withAlpha(quantised, alpha);
  const quantisedAlpha = Math.round(alpha * 255) / 255;
  const surface = formatHex(compositeOver(parseHex(quantised), quantisedAlpha, baseRgb));
  return { color, surface };
};

const mapRecord = <K extends string, A, B>(
  keys: readonly K[],
  record: Readonly<Record<K, A>>,
  fn: (value: A, key: K) => B,
): Readonly<Record<K, B>> =>
  Object.fromEntries(keys.map((k) => [k, fn(record[k], k)])) as Record<K, B>;

export const resolveVariant = (spec: VariantSpec): Variant => {
  const surfaces = Object.fromEntries(
    NEUTRAL_KEYS.flatMap((k) => {
      const tone = spec.neutral[k];
      return isLcSpec(tone) ? [] : [[k, solveL(tone)]];
    }),
  ) as Partial<Record<NeutralKey, Hex>>;

  const surfaceOf = (key: NeutralKey | undefined): Hex => {
    const hex = surfaces[key ?? "bg"];
    if (hex === undefined) {
      throw new Error(
        `${spec.id}: reference surface "${key ?? "bg"}" must be an explicit-L neutral`,
      );
    }
    return hex;
  };

  const solve = (tone: ToneSpec): Hex =>
    isLcSpec(tone) ? solveLc(tone, surfaceOf(tone.on), spec.polarity) : solveL(tone);

  const neutral = mapRecord(NEUTRAL_KEYS, spec.neutral, solve);
  const bg = neutral.bg;

  const baseOverlays = Object.fromEntries(
    OVERLAY_KEYS.flatMap((k) => {
      const o = spec.overlay[k];
      return o.over === undefined ? [[k, solveOverlay(o, bg)]] : [];
    }),
  ) as Partial<Record<OverlayKey, Overlay>>;
  const overlay = mapRecord(OVERLAY_KEYS, spec.overlay, (o, k) => {
    if (o.over === undefined) {
      return baseOverlays[k] ?? solveOverlay(o, bg);
    }
    const under = baseOverlays[o.over];
    if (under === undefined) {
      throw new Error(`${spec.id}: overlay "${k}" must sit on an overlay painted directly on bg`);
    }
    return solveOverlay(o, bg, under.surface);
  });

  return {
    id: spec.id,
    name: spec.name,
    polarity: spec.polarity,
    description: spec.description,
    neutral,
    accent: mapRecord(FAMILIES, spec.accent, (tones) => mapRecord(ACCENT_TONES, tones, solve)),
    syntax: mapRecord(SYNTAX_KEYS, spec.syntax, solve),
    ansi: spec.ansi.map(solve),
    overlay,
  };
};
