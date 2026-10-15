# 008. ANSI red stays below the Lc 75 aim in the dark variants

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

The brief's contrast budget (§4.3) sets a floor of Lc 60 and 4.5:1 for ANSI colors used as text, and an aim of Lc 75 for red, green, yellow and blue. It also requires ANSI red against green (1/2 and 9/10) to keep a worst-case ΔE_OK of at least 0.10 under CVD simulation, and to differ in lightness.

At equal lightness, red and green collapse under deuteranopia to a ΔE_OK of about 0.005. In Fovea's dark variants, the red/green pairs that clear the 0.10 bar sit about 0.10 apart in OKLab lightness, with red the darker. Red has to be the darker one because people with protan CVD already see red as darker, so an offset in the other direction cancels out.

With red at Lc 75 (OKLab lightness about 0.85), green would need lightness 0.95, which is about Lc 98: far brighter than body text in Dusk (Lc 87) and Night (Lc 78), and above both variants' upper bound for primary text. A red that light is also a pale salmon, since sRGB allows it only about 0.08 chroma, and no longer reads as an alarm.

## Options

1. **Meet the aim for red,** and push green above body text.
2. **Meet the aim for red,** and accept red and green collapsing under CVD.
3. **Keep red near the floor,** and give it the darkness that the CVD separation needs.

## Decision

Option 3. In Dusk and Night, ANSI red sits at about Lc 60 (8.2:1 and 8.9:1 WCAG) and bright red at about Lc 65–66. Green, yellow and blue meet the aim in every variant, and red meets it in Day.

The exemption is data, not a silent gap: `ansiAim.exempt` in `packages/palette/src/budget.ts` lists it, and a test fails if any other color drops below the aim, or if red ever meets the aim and its exemption is no longer needed.

## Consequences

- Red text in the terminal is a little quieter than green in the dark variants, but still well above the floor in both APCA and WCAG terms.
- Writing this record also caught Night's ANSI blue at Lc 73, which had slipped under the aim. It was raised to 75, and bright blue to Lc 83 to stay distinct from it.
