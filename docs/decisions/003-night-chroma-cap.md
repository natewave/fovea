# 003. Night's chroma cap is 0.10, not 0.09

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

The brief's starting chroma caps (§4.4) are 0.15 for Day, 0.12 for Dusk and 0.09 for Night. Two other rules constrain Night's syntax colors:

- Every pair of syntax accents needs ΔE_OK ≥ 0.08 in normal vision; "if 8 hues can't meet that at the required contrast, use fewer" (§4.5).
- A role keeps its hue family in every variant (§4.2).

Night's six syntax accents sit at Lc 76–82. At those lightnesses, the closest pair depends on the cap like this:

| Night chroma cap | Closest pair | ΔE_OK |
|---|---|---|
| 0.080 | constant / definition | 0.068 |
| 0.085 | constant / definition | 0.070 |
| 0.090 | constant / definition | 0.076 |
| 0.095 | keyword / escape | 0.080 |
| 0.100 | constant / definition | 0.083 |

## Options

1. **Keep 0.09 and use five syntax hues in Night only.** Two roles would share a color in Night but not in Dusk or Day, which breaks hue identity across variants.
2. **Keep 0.09 and lower Night's ΔE bar.** Syntax colors would be harder to tell apart.
3. **Raise Night's cap to 0.10.** 0.095 would land exactly on the bar with no margin.

## Decision

Option 3. Night's cap is 0.10 (`chromaCap.night` in `packages/palette/src/budget.ts`).

## Consequences

- Night still has the lowest chroma of the three variants (Dusk 0.12, Day 0.15).
- Its blues, cyans and violets stay the most restrained, as §4.1 asks. Keywords and types use 0.075, the blue, teal and violet families 0.07–0.075, and ANSI blue and cyan 0.055. In Dusk the same roles use 0.08–0.10, and in Day 0.09–0.13.
