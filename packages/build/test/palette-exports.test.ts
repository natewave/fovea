import { fileURLToPath } from "node:url";
import {
  budget,
  NEUTRAL_KEYS,
  palette,
  ROLE_NAMES,
  resolveRef,
  roles,
  variants,
} from "@fovea/palette";
import { beforeAll, describe, expect, it } from "vitest";
import {
  cssName,
  cssProperties,
  formatJson,
  type Inputs,
  isTextOutput,
  type Output,
  outputs,
  paletteCss,
  paletteData,
  paletteJson,
} from "../src/index.ts";
import { loadInputs } from "../src/inputs.ts";

describe("formatJson", () => {
  it("keeps arrays and objects of primitives on one line", () => {
    expect(formatJson({ a: [1, 2], b: { c: "x", d: null }, e: [] })).toBe(
      '{\n  "a": [1, 2],\n  "b": { "c": "x", "d": null },\n  "e": []\n}',
    );
  });

  it("nests composite values with two-space indentation", () => {
    expect(formatJson([{ a: [1] }, {}])).toBe('[\n  {\n    "a": [1]\n  },\n  {}\n]');
  });
});

describe("generated outputs", () => {
  const root = fileURLToPath(new URL("../../../", import.meta.url));
  let inputs: Inputs;
  let first: readonly Output[];

  beforeAll(async () => {
    inputs = await loadInputs(root);
    first = await outputs(inputs);
  }, 60_000);

  it("are deterministic", async () => {
    expect(await outputs(inputs)).toEqual(first);
  }, 60_000);

  it("never contain pure black or white", () => {
    for (const o of first.filter(isTextOutput)) {
      for (const banned of budget.banned) {
        expect(o.contents.toLowerCase(), o.path).not.toMatch(new RegExp(`${banned}(?![0-9a-f])`));
      }
    }
  });

  it("have unique paths", () => {
    const paths = first.map((o) => o.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe("fovea.json", () => {
  const data = paletteData(variants);

  it("round-trips through JSON unchanged", () => {
    expect(JSON.parse(paletteJson(variants))).toEqual(data);
  });

  it.each(variants)("lists every role for $name with its resolved color", (v) => {
    const entry = data.variants[v.id];
    expect(Object.keys(entry?.roles ?? {})).toEqual(ROLE_NAMES);
    for (const r of ROLE_NAMES) {
      expect(entry?.roles[r]).toEqual({ ref: roles[r], hex: resolveRef(v, roles[r]) });
    }
  });

  it.each(variants)("gives hex, RGB and OKLCH for every neutral of $name", (v) => {
    const neutral = data.variants[v.id]?.neutral ?? {};
    expect(Object.keys(neutral)).toEqual(NEUTRAL_KEYS);
    const bg = neutral.bg;
    expect(bg?.hex).toBe(v.neutral.bg);
    expect(bg?.rgb).toHaveLength(3);
    expect(bg?.oklch.l).toBeGreaterThan(0);
  });

  it.each(variants)("has 16 ANSI colors for $name", (v) => {
    expect(data.variants[v.id]?.ansi.map((c) => c.hex)).toEqual(v.ansi);
  });
});

describe("fovea.css", () => {
  const css = paletteCss(palette);

  it.each(variants)("defines every role for $name", (v) => {
    const props = new Map(cssProperties(v));
    for (const r of ROLE_NAMES) {
      expect(props.get(cssName(r)), r).toBe(resolveRef(v, roles[r]));
    }
  });

  it("has a block per variant, with Day and Dusk as the system defaults", () => {
    expect(css).toContain(':root,\n[data-theme="day"] {\n  color-scheme: light;');
    expect(css).toContain(
      "@media (prefers-color-scheme: dark) {\n  :root:not([data-theme]) {\n    color-scheme: dark;",
    );
    expect(css).toContain('[data-theme="dusk"] {\n  color-scheme: dark;');
    expect(css).toContain('[data-theme="night"] {\n  color-scheme: dark;');
  });

  it("uses Dusk's colors for the dark-system default", () => {
    const defaultBlock = css.slice(css.indexOf("@media"), css.indexOf('[data-theme="dusk"]'));
    expect(defaultBlock).toContain(`--fovea-bg: ${palette.dusk.neutral.bg};`);
  });
});
