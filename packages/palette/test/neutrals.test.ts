import { hexToOklch } from "@fovea/colorlab";
import { describe, expect, it } from "vitest";
import { emittedLight, isMonotonic, rampLightness, whitePoints } from "../src/audit.ts";
import { budget, palette, variants } from "../src/index.ts";
import { NEUTRAL_KEYS } from "../src/types.ts";

const hueGap = (a: number, b: number): number => Math.abs(((a - b + 540) % 360) - 180);

describe.each(variants)("neutrals: $name", (v) => {
  it("forms a monotonic lightness ramp from background to text", () => {
    const ramp = rampLightness(v);
    const values = ramp.map(([, l]) => l);
    expect(
      isMonotonic(values, v.polarity === "dark"),
      ramp.map(([k, l]) => `${k} ${l.toFixed(3)}`).join(", "),
    ).toBe(true);
  });

  it(`stays below chroma ${budget.neutralChromaMax}`, () => {
    const over = NEUTRAL_KEYS.filter((k) => hexToOklch(v.neutral[k]).c > budget.neutralChromaMax);
    expect(over).toEqual([]);
  });

  it("shares one hue across the ramp", () => {
    const hues = NEUTRAL_KEYS.map((k) => hexToOklch(v.neutral[k])).filter((o) => o.c >= 0.006);
    const first = hues[0];
    expect(first).toBeDefined();
    const spread = Math.max(...hues.map((o) => hueGap(o.h, first?.h ?? 0)));
    expect(spread).toBeLessThanOrEqual(12);
  });

  it("puts its near-white neutrals in the warm-neutral CCT band with no tint", () => {
    const { cctMin, cctMax, duvMax } = budget.whitePoint;
    for (const w of whitePoints(v)) {
      expect(w.cct, `${w.key} CCT`).toBeGreaterThanOrEqual(cctMin);
      expect(w.cct, `${w.key} CCT`).toBeLessThanOrEqual(cctMax);
      expect(Math.abs(w.duv), `${w.key} Duv`).toBeLessThanOrEqual(duvMax);
    }
  });
});

describe("emitted light", () => {
  it("is lower for Night than for Dusk, and for Dusk than for Day", () => {
    expect(emittedLight(palette.night)).toBeLessThan(emittedLight(palette.dusk));
    expect(emittedLight(palette.dusk)).toBeLessThan(emittedLight(palette.day));
  });
});
