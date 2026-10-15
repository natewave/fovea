import { describe, expect, it } from "vitest";
import { scopeRules } from "../src/index.ts";

describe("scope rules", () => {
  const selectors = scopeRules.flatMap((r) => r.scope);

  it("list each selector once", () => {
    const repeated = selectors.filter((s, i) => selectors.indexOf(s) !== i);
    expect(repeated).toEqual([]);
  });

  it("all set a color or a font style", () => {
    for (const rule of scopeRules) {
      expect(rule.scope.length, rule.name).toBeGreaterThan(0);
      expect(rule.role !== undefined || rule.fontStyle !== undefined, rule.name).toBe(true);
    }
  });

  it("use italics only for emphasis the author wrote", () => {
    const italic = scopeRules.filter((r) => r.fontStyle?.includes("italic"));
    expect(italic.flatMap((r) => r.scope)).toEqual(["markup.italic"]);
  });

  it("have unique names", () => {
    const names = scopeRules.map((r) => r.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
