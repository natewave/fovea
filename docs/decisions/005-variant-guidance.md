# 005. What each variant is recommended for

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

The brief's "intended for" column (§4.1) says Day is for "bright rooms and daylight; best legibility for long reading", and Night for "dark rooms and the hours before sleep".

Verification changed two parts of that picture (see [`research.md`](../research.md), rows 1, 2 and 7):

- **Day's legibility advantage isn't limited to bright rooms.** Dark text on a light background was read more accurately in a dark room and under office lighting. The penalty for dark mode is largest in a dark room, and lost significance in only one glance-reading study, at 4,750 lux.
- **Nothing shows that a theme improves sleep.** Evening light matters through its intensity and spectrum. Night's honest benefit is that it emits less light. "For the hours before sleep" reads as a sleep claim.

## Options

1. Keep the brief's wording.
2. Recommend Day for long reading in any room, and drop the sleep framing from Night.

## Decision

Option 2. The variant descriptions, which feed `fovea.json`, the VS Code themes and the website, now read:

- **Day:** "Ink on warm paper. The most legible variant for long reading, and the natural match for bright rooms and daylight."
- **Dusk:** "Soft light on warm graphite, for dim rooms, evenings and anyone who prefers dark mode."
- **Night:** "Dusk dimmed for dark rooms and late hours: the least light that still meets body-text minimums."

## Consequences

- The site's variant picker and the comfort guide say that Day is the most legible choice, that dark variants are a matter of preference and comfort with mixed evidence, and that screen brightness and room lighting matter more than the theme.
- The comfort guide advises keeping some room light on when using a dark variant, because the dark-mode penalty is largest in a dark room.
- The palette is unchanged.
