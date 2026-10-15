import { describe, expect, it } from "vitest";
import {
  cctDuv,
  cctDuvFromXy,
  clampChroma,
  compositeOver,
  deltaEOK,
  flatten,
  formatHex,
  gamutMapCss,
  hexToOklch,
  isInSrgb,
  maxChromaInSrgb,
  oklchToRgb,
  parseHex,
  rgbInGamut,
} from "../src/index.ts";

describe("sRGB gamut", () => {
  it("finds the chroma limit of sRGB red", () => {
    const red = hexToOklch("#ff0000");
    expect(maxChromaInSrgb(red.l, red.h)).toBeCloseTo(red.c, 3);
  });

  it("clamps chroma while keeping lightness and hue", () => {
    const out = { l: 0.7, c: 0.4, h: 150 };
    expect(isInSrgb(out)).toBe(false);
    const clamped = clampChroma(out);
    expect(isInSrgb(clamped)).toBe(true);
    expect(clamped.l).toBe(0.7);
    expect(clamped.h).toBe(150);
    expect(clamped.c).toBeLessThan(0.4);
  });

  it("leaves in-gamut colors untouched", () => {
    const inside = { l: 0.6, c: 0.05, h: 80 };
    expect(clampChroma(inside)).toEqual(inside);
  });

  it("maps with the CSS Color 4 algorithm into gamut", () => {
    const mapped = gamutMapCss({ l: 0.85, c: 0.35, h: 145 });
    expect(rgbInGamut(oklchToRgb(mapped), 1e-4)).toBe(true);
    expect(mapped.l).toBeGreaterThan(0.8);
  });

  it("measures ΔE_OK as Euclidean OKLab distance", () => {
    expect(deltaEOK("#ffffff", "#ffffff")).toBe(0);
    expect(deltaEOK("#000000", "#ffffff")).toBeCloseTo(1, 3);
  });
});

describe("CCT and Duv", () => {
  it("places sRGB white (D65) at about 6504 K, slightly above the Planckian locus", () => {
    const d65 = cctDuv("#ffffff");
    expect(d65.mccamy).toBeGreaterThan(6490);
    expect(d65.mccamy).toBeLessThan(6520);
    expect(d65.cct).toBeGreaterThan(6450);
    expect(d65.cct).toBeLessThan(6550);
    expect(d65.duv).toBeGreaterThan(0.0025);
    expect(d65.duv).toBeLessThan(0.004);
  });

  it("puts CIE illuminant A on the Planckian locus at about 2856 K", () => {
    const a = cctDuvFromXy({ x: 0.44757, y: 0.40745 });
    expect(a.cct).toBeGreaterThan(2840);
    expect(a.cct).toBeLessThan(2870);
    expect(Math.abs(a.duv)).toBeLessThan(0.0005);
    expect(a.mccamy).toBeGreaterThan(2840);
    expect(a.mccamy).toBeLessThan(2870);
  });
});

describe("compositing", () => {
  it("blends in gamma-encoded sRGB", () => {
    const mid = compositeOver(parseHex("#ffffff"), 0.5, parseHex("#000000"));
    expect(formatHex(mid)).toBe("#808080");
    expect(flatten("#ffffff80", "#000000")).toBe("#808080");
    expect(flatten("#123456", "#ffffff")).toBe("#123456");
  });
});
