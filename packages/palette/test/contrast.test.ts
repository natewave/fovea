import { describe, expect, it } from "vitest";
import { ansiAimChecks, type BudgetRow, contrastChecks, tierCheck } from "../src/audit.ts";
import { budget, variants } from "../src/index.ts";

const ROWS: readonly BudgetRow[] = [
  "primaryText",
  "syntax",
  "quiet",
  "onOverlay",
  "active",
  "secondary",
  "semanticText",
  "uiText",
  "strongText",
  "placeholder",
  "cursor",
  "uiComponent",
  "decorative",
  "ansiText",
];

const describeFailure = (c: ReturnType<typeof contrastChecks>[number]): string =>
  `${c.label}: Lc ${c.lc.toFixed(1)}, WCAG ${c.wcag.toFixed(2)}:1 (${c.text} on ${c.surface})`;

describe.each(variants)("contrast budget: $name", (v) => {
  const checks = contrastChecks(v);
  const rows: readonly BudgetRow[] =
    v.polarity === "dark" ? [...ROWS, "ansiBrightBlackDark"] : ROWS;

  it.each(rows)("every %s check passes", (row) => {
    const inRow = checks.filter((c) => c.row === row);
    expect(inRow.length).toBeGreaterThan(0);
    expect(inRow.filter((c) => !c.pass).map(describeFailure)).toEqual([]);
  });

  it("checks every token color on every overlay surface", () => {
    const onOverlay = checks.filter((c) => c.row === "onOverlay");
    const overlayLabels = new Set(
      onOverlay.map((c) => c.label.split(" on ").slice(1).join(" on ")),
    );
    expect(overlayLabels.size).toBeGreaterThanOrEqual(Object.keys(v.overlay).length);
  });

  it(`keeps the default syntax tier within ±${budget.tierSpread} Lc`, () => {
    const t = tierCheck(v);
    expect(t.spread).toBeLessThanOrEqual(budget.tierSpread);
  });

  it(`holds ANSI red, green, yellow and blue to the Lc ${budget.ansiAim.lc} aim, except documented exemptions`, () => {
    const aims = ansiAimChecks(v);
    expect(
      aims.filter((c) => !c.exempt && !c.pass).map((c) => `ANSI ${c.index}: Lc ${c.lc.toFixed(1)}`),
    ).toEqual([]);
    expect(
      aims
        .filter((c) => c.exempt && c.pass)
        .map((c) => `ANSI ${c.index} no longer needs its exemption`),
    ).toEqual([]);
  });
});
