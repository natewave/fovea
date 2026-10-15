import { describe, expect, it } from "vitest";
import { chromostereopsisWarnings, semanticChecks, syntaxPairs } from "../src/audit.ts";
import { budget, variants } from "../src/index.ts";

describe.each(variants)("color-vision deficiency: $name", (v) => {
  const semantic = semanticChecks(v);

  it.each(semantic.map((s) => [s.label, s] as const))("%s survives CVD", (_label, s) => {
    expect(s.worstCvd, `worst ${s.worstKind}`).toBeGreaterThanOrEqual(s.threshold);
    expect(s.dl, "lightness difference").toBeGreaterThanOrEqual(budget.semanticDeltaL);
  });

  it(`keeps every syntax accent pair ≥ ${budget.syntaxDeltaE[v.id]} ΔE_OK apart`, () => {
    const close = syntaxPairs(v)
      .filter((p) => p.normal < budget.syntaxDeltaE[v.id])
      .map((p) => `${p.a}/${p.b}: ${p.normal.toFixed(3)}`);
    expect(close).toEqual([]);
  });

  it("reports syntax pairs that collapse under CVD (informational)", () => {
    const collapsed = syntaxPairs(v).filter((p) => p.worstCvd < 0.04);
    if (collapsed.length > 0) {
      console.info(
        `${v.name}: syntax pairs close under CVD simulation (not a failure):`,
        collapsed.map((p) => `${p.a}/${p.b} ${p.worstCvd.toFixed(3)} (${p.worstKind})`).join(", "),
      );
    }
    expect(collapsed.length).toBeLessThanOrEqual(syntaxPairs(v).length);
  });

  it("warns about chromostereopsis risks (informational)", () => {
    const warnings = chromostereopsisWarnings(v);
    for (const w of warnings) {
      console.warn(`${v.name}: ${w.message}`);
    }
    expect(warnings.every((w) => w.variant === v.id)).toBe(true);
  });
});
