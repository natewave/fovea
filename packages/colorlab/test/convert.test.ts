import { describe, expect, it } from "vitest";
import {
  formatHex,
  hexToOklch,
  linearToSrgb,
  oklabToOklch,
  oklchToHex,
  oklchToOklab,
  parseHex,
  parseHexAlpha,
  srgbToLinear,
  withAlpha,
  xyzToOklab,
} from "../src/index.ts";

describe("hex", () => {
  it("parses and formats round trip", () => {
    expect(formatHex(parseHex("#f9f5ec"))).toBe("#f9f5ec");
    expect(formatHex(parseHex("#FFF"))).toBe("#ffffff");
  });

  it("parses alpha", () => {
    const { rgb, alpha } = parseHexAlpha("#33669980");
    expect(formatHex(rgb)).toBe("#336699");
    expect(alpha).toBeCloseTo(128 / 255, 10);
    expect(withAlpha("#336699", 0.5)).toBe("#33669980");
  });

  it("rejects malformed input", () => {
    expect(() => parseHex("f9f5ec")).toThrow();
    expect(() => parseHex("#12345")).toThrow();
    expect(() => parseHex("#33669980")).toThrow();
  });
});

describe("sRGB transfer function", () => {
  it("is invertible", () => {
    // The standard's thresholds (0.04045 and 0.0031308) disagree at the knee by ~3e-8.
    for (const v of [0, 0.002, 0.04045, 0.2, 0.5, 0.9, 1]) {
      expect(linearToSrgb(srgbToLinear(v))).toBeCloseTo(v, 6);
    }
  });
});

describe("OKLab reference values (Ottosson 2020, XYZ D65 → OKLab)", () => {
  // https://bottosson.github.io/posts/oklab/ — "Table of example XYZ and Oklab pairs".
  const table: readonly (readonly [number, number, number, number, number, number])[] = [
    [0.95, 1.0, 1.089, 1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0, 0.45, 1.236, -0.019],
    [0.0, 1.0, 0.0, 0.922, -0.671, 0.263],
    [0.0, 0.0, 1.0, 0.153, -1.415, -0.449],
  ];
  it.each(table)("XYZ(%s, %s, %s)", (x, y, z, l, a, b) => {
    const lab = xyzToOklab({ x, y, z });
    expect(lab.l).toBeCloseTo(l, 2);
    expect(lab.a).toBeCloseTo(a, 2);
    expect(lab.b).toBeCloseTo(b, 2);
  });
});

describe("OKLCH", () => {
  it("matches the known OKLCH of sRGB red", () => {
    const red = hexToOklch("#ff0000");
    expect(red.l).toBeCloseTo(0.62796, 4);
    expect(red.c).toBeCloseTo(0.25768, 4);
    expect(red.h).toBeCloseTo(29.2339, 2);
  });

  it("round-trips hex through OKLCH", () => {
    for (const hex of ["#f9f5ec", "#1e1b18", "#13100d", "#2f2a25", "#4078c0"] as const) {
      expect(oklchToHex(hexToOklch(hex))).toBe(hex);
    }
  });

  it("pins the hue of neutrals to 0", () => {
    expect(hexToOklch("#808080").h).toBe(0);
  });

  it("converts between OKLab and OKLCH", () => {
    const lch = { l: 0.7, c: 0.1, h: 250 };
    const back = oklabToOklch(oklchToOklab(lch));
    expect(back.l).toBeCloseTo(0.7, 12);
    expect(back.c).toBeCloseTo(0.1, 12);
    expect(back.h).toBeCloseTo(250, 9);
  });
});
