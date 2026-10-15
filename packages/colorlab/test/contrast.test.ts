import { contrastWCAG21 } from "colorjs.io/fn";
import { describe, expect, it } from "vitest";
import { apcaContrast, apcaLc, relativeLuminance, wcagContrast } from "../src/index.ts";

describe("APCA (0.0.98G-4g) reference pairs", () => {
  // All eight published test values (SAPC-APCA documentation, "TEXT vs BKGND", G-constants).
  const pairs: readonly (readonly [string, string, number])[] = [
    ["#888888", "#ffffff", 63.056469930209424],
    ["#ffffff", "#888888", -68.54146436644962],
    ["#000000", "#aaaaaa", 58.146262578561334],
    ["#aaaaaa", "#000000", -56.24113336839742],
    ["#112233", "#ddeeff", 91.66830811481631],
    ["#ddeeff", "#112233", -93.06770049484275],
    ["#112233", "#444444", 8.32326136957393],
    ["#444444", "#112233", -7.526878460278154],
  ];
  it.each(pairs)("text %s on %s gives Lc %s", (text, surface, expected) => {
    const lc = apcaContrast({ text: text as `#${string}`, surface: surface as `#${string}` });
    expect(lc).toBeCloseTo(expected, 10);
  });

  it("is polarity aware and returns 0 for identical colors", () => {
    expect(apcaContrast({ text: "#000000", surface: "#ffffff" })).toBeGreaterThan(100);
    expect(apcaContrast({ text: "#ffffff", surface: "#000000" })).toBeLessThan(-100);
    expect(apcaLc({ text: "#777777", surface: "#777777" })).toBe(0);
  });
});

describe("WCAG 2.2 contrast", () => {
  const pairs: readonly (readonly [string, string, number])[] = [
    ["#000000", "#ffffff", 21],
    ["#767676", "#ffffff", 4.54],
    ["#777777", "#ffffff", 4.48],
    ["#595959", "#ffffff", 7.0],
  ];
  it.each(pairs)("%s vs %s is %s:1", (a, b, expected) => {
    const ratio = wcagContrast(a as `#${string}`, b as `#${string}`);
    expect(Math.round(ratio * 100) / 100).toBe(expected);
  });

  it("is symmetric", () => {
    expect(wcagContrast("#2f2a25", "#f9f5ec")).toBe(wcagContrast("#f9f5ec", "#2f2a25"));
  });

  it("agrees with Color.js's WCAG 2.1 implementation", () => {
    for (const [a, b] of [
      ["#2f2a25", "#f9f5ec"],
      ["#e3dfd8", "#1e1b18"],
      ["#d6d0c9", "#13100d"],
    ] as const) {
      expect(wcagContrast(a, b)).toBeCloseTo(contrastWCAG21(a, b), 2);
    }
  });

  it("uses the sRGB luminance endpoints", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 12);
  });
});
