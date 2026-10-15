import { hexToOklch } from "@fovea/colorlab";
import { describe, expect, it } from "vitest";
import { ansiChecks } from "../src/audit.ts";
import { families, palette, specs, syntaxFamily, variants } from "../src/index.ts";
import { resolveVariant } from "../src/solve.ts";
import { FAMILIES, type Family, SYNTAX_KEYS } from "../src/types.ts";

const hueGap = (a: number, b: number): number => Math.abs(((a - b + 540) % 360) - 180);
const inFamily = (h: number, f: Family): boolean => hueGap(h, families[f].hue) <= families[f].band;

/** ANSI slots and the family each chromatic slot belongs to. */
const ANSI_FAMILY: Readonly<Record<number, Family>> = {
  1: "red",
  2: "green",
  3: "yellow",
  4: "blue",
  5: "pink",
  6: "teal",
  9: "red",
  10: "green",
  11: "yellow",
  12: "blue",
  13: "pink",
  14: "teal",
};

describe("hue families", () => {
  it("do not overlap", () => {
    const overlaps = FAMILIES.flatMap((a, i) =>
      FAMILIES.slice(i + 1).flatMap((b) =>
        hueGap(families[a].hue, families[b].hue) < families[a].band + families[b].band
          ? [`${a}/${b}`]
          : [],
      ),
    );
    expect(overlaps).toEqual([]);
  });
});

describe.each(variants)("hue identity: $name", (v) => {
  const spec = specs[v.id];

  it("keeps every syntax class in its family's band", () => {
    const out = SYNTAX_KEYS.filter((k) => !inFamily(spec.syntax[k].h, syntaxFamily[k]));
    expect(out).toEqual([]);
  });

  it("keeps every accent tone in its family's band", () => {
    const out = FAMILIES.flatMap((f) =>
      Object.entries(spec.accent[f]).flatMap(([tone, s]) =>
        inFamily(s.h, f) ? [] : [`${f}.${tone}`],
      ),
    );
    expect(out).toEqual([]);
  });

  it("keeps every chromatic ANSI color in its family's band", () => {
    const out = Object.entries(ANSI_FAMILY).flatMap(([i, f]) => {
      const tone = spec.ansi[Number(i)];
      return tone !== undefined && inFamily(tone.h, f) ? [] : [`ANSI ${i}`];
    });
    expect(out).toEqual([]);
  });

  it("keeps ANSI meanings: 0 darkest, 7 light gray, 15 lightest, brights distinct", () => {
    expect(
      ansiChecks(v)
        .filter((c) => !c.pass)
        .map((c) => c.label),
    ).toEqual([]);
  });

  it("gives definitions a stronger tier than the default accents", () => {
    const l = (hex: `#${string}`): number => hexToOklch(hex).l;
    const definition = l(v.syntax.definition);
    const accents = (["keyword", "string", "constant"] as const).map((k) => l(v.syntax[k]));
    const stronger =
      v.polarity === "dark"
        ? accents.every((a) => definition > a)
        : accents.every((a) => definition < a);
    expect(stronger).toBe(true);
  });
});

describe("determinism", () => {
  it("resolves every variant to the same palette each time", () => {
    for (const v of variants) {
      expect(resolveVariant(specs[v.id])).toEqual(palette[v.id]);
    }
  });
});
