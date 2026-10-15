# 016. The home page leaves the principles to the science page

- **Status:** Accepted. The maintainer chose option 2 on 2026-10-15.
- **Date:** 2026-10-15

## Context

The brief asks for 3–4 principle cards on the home page that link to the science page. The home page showed four, under "The principles behind it": "Lightness and hue", "Dark text on a light background reads best", "Contrast band" and "Restrained syntax color". Each card gave a principle's title, a one-line summary and its evidence labels, and linked to that principle on the science page ("Why these colors"), which covers it in full: what the research found, how Fovea applies it, the caveats and the sources.

## Options

1. Keep the cards, as the brief asks.
2. Remove them. The hero's "Why these colors" button and the "Science" link in the site header lead to the science page.

## Decision

Option 2, chosen by the maintainer: the science page already presents every principle, so the cards were redundant.

## Consequences

- The home page has the hero (the thesis, the install, palette and science buttons, and the editor and terminal mocks), the three variants, and what Fovea is not.
- The principles, with their evidence, caveats and sources, appear only on the science page. The one-line summaries in `site/src/data/science.ts` are no longer shown anywhere.
