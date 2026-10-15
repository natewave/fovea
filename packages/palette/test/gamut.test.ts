import { type Hex, hexToOklch, parseHexAlpha } from "@fovea/colorlab";
import { describe, expect, it } from "vitest";
import { allHexes } from "../src/audit.ts";
import { budget, isLcSpec, specs, variants } from "../src/index.ts";
import { MAX_OVERLAY_ALPHA } from "../src/solve.ts";
import { ACCENT_TONES, FAMILIES, SYNTAX_KEYS, type ToneSpec } from "../src/types.ts";

const opaque = (hex: string): string => {
  const { rgb } = parseHexAlpha(hex);
  const to8 = (v: number): string =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to8(rgb.r)}${to8(rgb.g)}${to8(rgb.b)}`;
};

const hueGap = (a: number, b: number): number => Math.abs(((a - b + 540) % 360) - 180);

describe.each(variants)("gamut and banned colors: $name", (v) => {
  it("ships no pure black or white, including inside overlay colors", () => {
    const banned: readonly string[] = budget.banned;
    expect(allHexes(v).filter((hex) => banned.includes(opaque(hex)))).toEqual([]);
  });

  it("keeps every overlay translucent", () => {
    for (const [key, o] of Object.entries(v.overlay)) {
      const { alpha } = parseHexAlpha(o.color);
      expect(alpha, key).toBeLessThan(1);
      expect(alpha, key).toBeLessThanOrEqual(MAX_OVERLAY_ALPHA + 1 / 255);
    }
  });

  it("maps into sRGB by reducing chroma, never by clipping hue", () => {
    const spec = specs[v.id];
    const tones: readonly (readonly [string, ToneSpec, Hex])[] = [
      ...FAMILIES.flatMap((f) =>
        ACCENT_TONES.map((t) => [`${f}.${t}`, spec.accent[f][t], v.accent[f][t]] as const),
      ),
      ...SYNTAX_KEYS.map((k) => [`syntax.${k}`, spec.syntax[k], v.syntax[k]] as const),
    ];
    const drifted = tones.flatMap(([label, s, hex]) => {
      const o = hexToOklch(hex);
      return o.c >= 0.03 && hueGap(o.h, s.h) > 4
        ? [`${label}: wanted h ${s.h}, got ${o.h.toFixed(1)}`]
        : [];
    });
    expect(drifted).toEqual([]);
  });

  it("keeps accent and syntax chroma under the variant's cap", () => {
    const cap = budget.chromaCap[v.id];
    const spec = specs[v.id];
    const requested = [
      ...FAMILIES.flatMap((f) => Object.values(spec.accent[f])),
      ...SYNTAX_KEYS.map((k) => spec.syntax[k]),
    ].filter(isLcSpec);
    expect(requested.filter((s) => s.c > cap + 1e-9)).toEqual([]);
    const shipped = [
      ...FAMILIES.flatMap((f) => Object.values(v.accent[f])),
      ...Object.values(v.syntax),
    ];
    expect(shipped.filter((hex) => hexToOklch(hex).c > cap + 0.005)).toEqual([]);
  });
});
