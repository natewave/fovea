# 013. The Ghostty themes require Ghostty 1.3

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

The brief asks for Ghostty themes that set the palette, background, foreground, cursor and selection colors. Fovea also colors search matches, so that they match the find overlays in VS Code. The `search-background`, `search-foreground`, `search-selected-background` and `search-selected-foreground` keys are absent from Ghostty 1.2.3's configuration source; scrollback search arrived in 1.3.0 ([engineering notes](../research/verification/e-engineering.md)). Ghostty 1.3.1 was the current release when the themes were built.

## Options

1. Leave out the search colors, so the themes load in 1.2.
2. Set them, and require Ghostty 1.3 or newer.

## Decision

Option 2. The themes set the search colors, and the Ghostty README and the website's install page say that Ghostty 1.3 or newer is required. The test of allowed keys pins the 1.3 color keys, and the themes pass `ghostty +validate-config` with Ghostty 1.3.1.

## Consequences

Ghostty 1.2 doesn't know the four search keys, so users of it should expect configuration errors for them. Removing those four lines from a theme file makes it load on 1.2. This was not tested, because only Ghostty 1.3.1 was available.
