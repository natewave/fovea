# 010. Escapes get their own hue

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

The brief's default syntax mapping (§4.6) says: "Strings: one accent. Escapes, regex and interpolation get a related accent." Other rules constrain the escape color too:

- Every pair of syntax accents needs ΔE_OK ≥ 0.08 in normal vision (§4.5).
- Accents in the same tier sit within ±3 Lc of each other (§4.4), and syntax colors need Lc ≥ 75 (§4.3).
- Night's body text sits at Lc 75–82 (§4.3).

The numbers below were computed with the palette's own solver (`packages/palette/src/solve.ts`) against each variant's background.

**Same hue as strings, different lightness.** At the string's hue and chroma, an escape reaches ΔE_OK 0.08 from strings only at:

| Variant | Strings | Lower-contrast escape | Higher-contrast escape |
|---|--:|--:|--:|
| Day | Lc 78.1 | Lc 68.1 | Lc 86.6 |
| Dusk | Lc 77.3 | Lc 61.8 | Lc 93.3 |
| Night | Lc 76.4 | Lc 61.4 | Lc 92.4 |

In every variant the lower-contrast option falls below the Lc 75 floor, and the higher-contrast one is 8–16 Lc louder than strings, which breaks the ±3 Lc tier. In Night it would also be brighter than body text (Lc 78).

**A neighboring hue.** Scanning hues in 5° steps at the escape's contrast and the variant's chroma cap, these hues keep ΔE_OK ≥ 0.08 from keywords, strings, constants, definitions and types:

| Variant | Hues that work |
|---|---|
| Day | 0–25°, 105–110°, 310–355° |
| Dusk | 325–355°, 0° |
| Night | 335–355°, 0–5° |

Hues near the string's green (155°) are taken by yellow definitions (108°) and teal types (210°). The only hues that work in all three variants are pink and magenta, from 335° to 355°; 0–5° belongs to red, which is reserved for errors.

## Options

1. **A lighter or darker green.** Fails the contrast floor or the equal-emphasis tier in every variant.
2. **Leave escapes in the string color.** Escapes, placeholders and interpolation delimiters change what a string means, so losing the cue has a cost. Keeping it adds little color to the screen: escapes cover 2.4% of highlighted corpus text.
3. **A separate pink hue.**

## Decision

Option 3. Escapes, regular expressions, format placeholders and interpolation delimiters share one accent: Heather (pink, hue 335°). It is "related" to strings by role: it only appears inside or next to them. It doesn't share their hue.

## Consequences

- The palette uses six syntax hues plus the reserved red, the brief's limit.
- Within the workable range, moving toward magenta gains distance from violet keywords and loses it from the invalid red. The hue search settled on 335°: in Dusk, escapes are ΔE_OK 0.084 from keywords (the variant's closest syntax pair) and 0.082 from invalid. The audit doesn't require the red distance, since invalid code is also underlined, but the shipped escape keeps it anyway: 0.158 in Day, 0.082 in Dusk and 0.080 in Night.
- [Decision 009](009-frequency-by-characters.md) explains why the rarest class by characters gets this hue.
