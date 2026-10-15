# 014. What the website does and doesn't simulate

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

The brief asks the website to simulate color-vision deficiency with SVG `feColorMatrix` filters using the Machado matrices, and to map `prefers-contrast: more` to the high-contrast variants if they exist. Fovea's tests simulate tritanopia with Brettel et al.'s model ([decision 002](002-cvd-simulation.md)), which projects onto two half-planes and cannot be expressed as one color matrix. Fovea has no high-contrast variants (they are not in the brief's list of v1 variants).

## Options

1. Offer protanopia and deuteranopia only.
2. Offer Machado's tritan matrix too, labelled as an approximation.
3. Build a per-pixel Brettel filter with several SVG primitives.

## Decision

Option 2. The palette page offers typical vision, protanopia, deuteranopia, "tritanopia (approximate)" and grayscale. The page says that Machado's tritan matrix only approximates tritanopia and that the tests use Brettel's model. `prefers-contrast: more` is not mapped, because there are no high-contrast variants to map it to.

## Consequences

- The tritan preview is a rough guide; the authoritative check is the tritanopia test in `packages/palette/test/cvd.test.ts`.
- If high-contrast variants are added later, the site should map `prefers-contrast: more` to them.
