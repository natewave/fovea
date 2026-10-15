import { filterDeficiencyDeuter, filterDeficiencyProt, filterDeficiencyTrit } from "culori";
import { describe, expect, it } from "vitest";
import {
  applyBrettel,
  applyMatrix,
  BRETTEL_1997_TRITAN,
  CVD_KINDS,
  cvdDifference,
  feColorMatrixValues,
  MACHADO_2009,
  MACHADO_KINDS,
  type MachadoKind,
  type Matrix3,
  simulateCvdHex,
} from "../src/index.ts";

const rowSums = (m: Matrix3): readonly number[] => m.map((row) => row[0] + row[1] + row[2]);

describe("Machado 2009 matrices", () => {
  it.each(MACHADO_KINDS)("%s rows sum to 1, so neutrals stay neutral", (kind) => {
    for (const sum of rowSums(MACHADO_2009[kind])) {
      expect(sum).toBeCloseTo(1, 5);
    }
  });

  // culori ships the same severity-1.0 matrices but applies them to gamma-encoded RGB.
  // Feeding it linear values isolates the matrices themselves for comparison.
  const culoriFilters: Readonly<Record<MachadoKind, ReturnType<typeof filterDeficiencyProt>>> = {
    protan: filterDeficiencyProt(1),
    deutan: filterDeficiencyDeuter(1),
    tritan: filterDeficiencyTrit(1),
  };

  it.each(MACHADO_KINDS)("%s matches culori's published matrix", (kind) => {
    const samples = [
      { r: 1, g: 0, b: 0 },
      { r: 0, g: 1, b: 0 },
      { r: 0, g: 0, b: 1 },
      { r: 0.3, g: 0.6, b: 0.1 },
    ];
    for (const lin of samples) {
      const ours = applyMatrix(MACHADO_2009[kind], lin);
      const theirs = culoriFilters[kind]({ mode: "rgb", ...lin });
      expect(theirs).toBeDefined();
      expect(ours.r).toBeCloseTo(theirs?.r ?? Number.NaN, 6);
      expect(ours.g).toBeCloseTo(theirs?.g ?? Number.NaN, 6);
      expect(ours.b).toBeCloseTo(theirs?.b ?? Number.NaN, 6);
    }
  });

  it("collapses equal-lightness red and green for deuteranopes", () => {
    const d = cvdDifference("#c0504d", "#4f9a4f");
    expect(d.normal).toBeGreaterThan(0.15);
    expect(d.simulated.deuteranopia).toBeLessThan(d.normal / 2);
  });

  it("emits a 4×5 feColorMatrix", () => {
    const values = feColorMatrixValues(MACHADO_2009.deutan).split(" ");
    expect(values).toHaveLength(20);
    expect(values.slice(15)).toEqual(["0", "0", "0", "1", "0"]);
  });
});

describe("Brettel 1997 tritanopia", () => {
  const { plane1, plane2, separationNormal: n } = BRETTEL_1997_TRITAN;

  it("keeps white on the separation plane and maps it to itself", () => {
    expect(n[0] + n[1] + n[2]).toBeCloseTo(0, 5);
    for (const sum of [...rowSums(plane1), ...rowSums(plane2)]) {
      expect(sum).toBeCloseTo(1, 4);
    }
  });

  // Both projections must agree on the plane, so each row of their difference is a multiple of
  // the plane's normal. This catches a mistyped constant in any of the 21 values.
  it("is continuous across the separation plane", () => {
    const [n0, n1, n2] = n;
    for (let i = 0; i < 3; i++) {
      const d = [0, 1, 2].map((j) => (plane1[i]?.[j] ?? 0) - (plane2[i]?.[j] ?? 0));
      const k = (d[0] ?? 0) / n0;
      expect(d[1] ?? 0).toBeCloseTo(k * n1, 4);
      expect(d[2] ?? 0).toBeCloseTo(k * n2, 4);
    }
    const onPlane = { r: -n1, g: n0, b: 0 };
    const a = applyMatrix(plane1, onPlane);
    const b = applyMatrix(plane2, onPlane);
    expect(a.r).toBeCloseTo(b.r, 5);
    expect(a.g).toBeCloseTo(b.g, 5);
    expect(a.b).toBeCloseTo(b.b, 5);
  });

  it("picks the projection by the side of the plane", () => {
    const blue = { r: 0, g: 0, b: 1 };
    const red = { r: 1, g: 0, b: 0 };
    expect(applyBrettel(BRETTEL_1997_TRITAN, red)).toEqual(applyMatrix(plane1, red));
    expect(applyBrettel(BRETTEL_1997_TRITAN, blue)).toEqual(applyMatrix(plane2, blue));
  });
});

describe("simulateCvd", () => {
  it.each(CVD_KINDS)("%s leaves neutrals unchanged", (kind) => {
    expect(simulateCvdHex("#ffffff", kind)).toBe("#ffffff");
    expect(simulateCvdHex("#000000", kind)).toBe("#000000");
    expect(simulateCvdHex("#777777", kind)).toBe("#777777");
  });

  it("models tritanopia differently from Machado's tritanomaly", () => {
    expect(simulateCvdHex("#3060d0", "tritanopia")).not.toBe(
      simulateCvdHex("#3060d0", "tritanomaly"),
    );
  });
});
