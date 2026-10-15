# 002. CVD simulation: Machado for red–green, Brettel for tritanopia

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

The brief (§4.5) asks for protanopia, deuteranopia and tritanopia to be simulated at full severity with the Machado et al. 2009 matrices, applied in linear RGB. §5.1 offers culori's `filterDeficiency*` functions as an alternative.

Verification ([notes](../research/verification/b-color-vision.md)) found three problems:

- Machado et al. write that they "restrain our model from trying to model tritanopia", and their validation had no tritan participants. Their tritan matrix models a shifted S-cone response, which approximates tritanomaly, not missing S cones.
- The DaltonLens review of open-source simulators concludes: "For tritanopia the Brettel 1997 approach is still the most solid and basically only valid choice."
- culori multiplies the Machado matrices with gamma-encoded sRGB values and snaps severity to steps of 0.1, which contradicts the brief's linear-RGB requirement.

## Options

1. **Machado for all three,** as written. Simple, but the tritanopia check would rest on a model its authors say doesn't cover it.
2. **culori.** Rejected: it applies the matrices in gamma space.
3. **Machado for protanopia and deuteranopia, Brettel 1997 for tritanopia,** and keep Machado's tritan matrix as an extra tritanomaly check.

## Decision

Option 3, implemented in colorlab, in linear RGB:

- **Protanopia and deuteranopia:** Machado severity 1.0, copied digit for digit from the authors' project page and cross-checked against culori's matrices.
- **Tritanopia:** Brettel, Viénot & Mollon 1997, using libDaltonLens's public-domain precomputed constants (Smith & Pokorny cone fundamentals, with sRGB white as the neutral axis). Each color is projected onto one of two half-planes, chosen by its side of the separation plane.
- **Tritanomaly:** Machado's tritan matrix, labeled as such.

Every semantic pair must keep a worst-case ΔE_OK of at least 0.10 across all four simulations (0.06 for Day's diff tints; see [decision 004](004-day-diff-tints.md)). Tests check the Brettel constants for internal consistency: rows sum to 1, and both projections agree on the separation plane.

## Consequences

- **One pair failed the new check:** find match against selection, at 0.089 (Day), 0.090 (Dusk) and 0.096 (Night) under tritanopia. The overlays were retuned. Day's selection and word highlights moved to hue 205 and its find match deepened. Dusk and Night's find match became a slightly darker amber well. The pair now reaches 0.106, 0.109 and 0.109, and the find match also keeps the border the brief calls for.
- **Website previews:** §6.2 plans SVG `feColorMatrix` filters with the Machado matrices. That works for protanopia and deuteranopia. Brettel needs a choice between two projections for every pixel, which one color matrix can't express. DaltonLens has published an SVG filter construction for Brettel; phase 6 will use it if it works across browsers, and otherwise label the tritan preview "tritanomaly (approximation)".
- [`research.md`](../research.md) row 9 records the correction.
