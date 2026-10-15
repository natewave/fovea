# 011. Generated previews instead of screenshots

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

The brief asks for screenshots of each variant in the README and the Marketplace listing, and suggests measuring each variant's light output from rendered pixels with Playwright. In the environment where Fovea was built, the sandbox blocks every browser: Google Chrome, Playwright's Chromium and macOS Quick Look all fail to start. Nothing can be rendered to pixels.

## Options

1. Leave the README and listing without images until someone takes screenshots.
2. Draw the previews from the palette: an editor window as SVG, rasterized to PNG by the build, from the same tokens Shiki produces for the TypeScript fixture.
3. Commit hand-made mockups.

## Decision

Option 2. `pnpm build` writes `docs/assets/preview-{day,dusk,night}.svg` and `.png`, the palette strips and the logo. They are deterministic, so the staleness check covers them, and they can never show a color the palette doesn't have. The light-output figure on the website comes from the palette's model of an editor layout (`emittedLight` in the audit), labelled as a model rather than a measurement.

## Consequences

- The previews show Fovea's colors exactly but not a real editor's chrome or font rendering.
- `pnpm report:screenshots` (Chrome through Playwright) still exists for machines with a browser. Adding real screenshots to the README and the Marketplace listing is listed as a follow-up for the maintainer.
- The website's Playwright and axe checks run only in CI.
