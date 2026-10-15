# Contributing to Fovea

Thanks for helping. Fovea is small on purpose: one palette, a few generators and a website, all checked by tests. This guide covers setup, how the pieces fit together, and the rules that keep the ports honest.

## Setup

You need Node.js 22.18 or newer (`.nvmrc` pins the version CI uses) and pnpm 10.

```sh
pnpm install
pnpm build
pnpm test
```

| Command | What it does |
|---|---|
| `pnpm build` | Regenerates the ports, the generated docs, the preview images and the site's icons from the palette |
| `pnpm test` | Runs the palette, color-math, generator and port tests |
| `pnpm lint` / `pnpm lint:fix` | Biome |
| `pnpm typecheck` | TypeScript in strict mode |
| `pnpm check:stale` | Rebuilds, then fails if git sees any change (CI runs this) |
| `pnpm package:vscode` | Builds the VS Code extension into `dist/vscode/fovea.vsix` |
| `pnpm report` | Writes an internal palette report to `dist/report/` |
| `pnpm site:dev` | Runs the website locally |
| `pnpm site:build` / `pnpm site:test` | Builds the website and checks the output |
| `pnpm site:e2e` | Accessibility and behavior checks in a browser (needs `pnpm --filter @fovea/site exec playwright install chromium` once) |

## How the repository fits together

- [`packages/colorlab`](packages/colorlab) is the color math: OKLCH conversion, gamut mapping, WCAG and perceptual contrast, color-vision simulation and white points. Its tests use published reference values.
- [`packages/palette`](packages/palette) defines the three variants as OKLCH specs with contrast targets, solves them to sRGB hex, and maps them to semantic roles. The contrast budget is in `budget.ts`, the hue families in `families.ts`, the roles in `roles.ts`, and the TextMate scope rules in `scopes.ts`.
- [`packages/build`](packages/build) turns the palette into every port: the VS Code themes and manifest, the Ghostty themes, the iTerm2 YAML, `fovea.json`, `fovea.css`, the generated docs and the preview images. `outputs()` in `src/index.ts` lists them all.
- [`site`](site) is the Astro website. It uses only `ports/palette/fovea.css` for color and the generated VS Code themes for code samples.

### Generated files

`outputs()` lists every generated file: everything under `ports/` except `ports/vscode/.vscodeignore`, plus `docs/generated/`, `docs/assets/` and `site/public/`. Never edit one by hand: change the source, run `pnpm build`, and commit the source and the generated files together. `packages/build/test/generated.test.ts` and `pnpm check:stale` fail if they disagree.

## Changing the palette

1. Edit the specs in `packages/palette/src/variants/` (lightness targets are perceptual contrast values, chroma and hue are OKLCH), or the budget, roles or scope rules.
2. Run `pnpm test`. The contrast, color-vision, gamut and identity tests say exactly which pair or rule fails and by how much.
3. Run `pnpm build` and look at the result in `pnpm report` or `pnpm site:dev`.
4. If the change departs from the [design](docs/design.md) or the [brief](docs/brief.md), add a decision record (see below).

Hard rules, enforced by tests:

- No `#000000` or `#ffffff`, and every color stays inside sRGB.
- Meaning never rests on hue alone: every pair that must be told apart also differs in lightness, under simulated color-vision deficiency too.
- Every text color meets its row of the contrast budget, which never goes below WCAG 2.2.
- Output is deterministic: the same input always produces byte-identical files.

## Research claims

Anything Fovea says about vision, comfort or health must come from a source that was actually opened and recorded in [`docs/research.md`](docs/research.md) or its [verification notes](docs/research/verification/), with the study type, the sample size and the strength of the evidence. Never cite from memory, and drop a claim you can't verify.

- Use calibrated language: "designed to", "studies suggest", "the evidence is limited".
- Never claim that Fovea prevents eye damage, cures eye strain or improves sleep.
- Public material calls contrast values "perceptual contrast (Lc)"; APCA is named only in the method docs ([decision 001](docs/decisions/001-apca-via-colorjs.md)).
- The website can link only to URLs recorded in the research notes; `site/test/dist.test.ts` checks this. To cite something new, add it to the dossier first, then to `site/src/data/sources.ts`.

## Adding a port

Ports are generators, so they can never drift from the palette.

1. **Map roles, not hues.** Read the [style guide](docs/style-guide.md) and map each of the app's color settings to a Fovea role from [`docs/generated/roles.md`](docs/generated/roles.md). Use a palette entry directly only where the app asks for a hue by name, such as ANSI colors or chart colors.
2. **Write the generator** in `packages/build/src/<app>.ts`. Export pure functions that take a `Variant` and return the file contents as a string, plus an `<app>Outputs()` function that returns `Output` objects with paths under `ports/<app>/`. Include a README generated from the shared install steps in `install.ts`.
3. **Wire it in** by adding `...<app>Outputs()` to `outputs()` in `packages/build/src/index.ts`.
4. **Test it** in `packages/build/test/<app>.test.ts`. At minimum:
   - every key the generator writes is one the app accepts (pin the list from the app's documentation, with the version);
   - every color is a palette color (`allHexes`), with no banned colors;
   - text and background pairs meet the contrast budget, using the audit helpers in `@fovea/palette/audit`;
   - terminal ports use the same 16 ANSI colors as the others;
   - if the app has a validator you can run, call it when it is installed and skip otherwise, as the Ghostty test does.
5. **Generate and commit** with `pnpm build`, then add the port to the README, the website's install page and the changelog.
6. **Record deviations.** If the app can't express part of the design, write a decision record instead of working around it silently.

## Decision records

[`docs/decisions/`](docs/decisions/README.md) explains every point where Fovea departs from, or fills a gap in, its brief: the context, the options, the decision and the consequences. Copy the format of an existing record, take the next number, and add it to the index and to the table at the end of `docs/design.md`.

## Pull requests

- Run `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check:stale` before opening one; CI runs the same, plus the website checks.
- Keep each pull request to one change, and explain the reason as well as the change.
- If an AI agent helped, say so in the commit messages and the pull request description.
- By contributing, you agree to license your work under the [MIT license](LICENSE).

## The website and releases

These steps need maintainer access to the repository.

**The website** deploys to GitHub Pages, at https://natewave.github.io/fovea/, on every push to `main` ([`pages.yml`](.github/workflows/pages.yml)). The repository's Pages source must be set to **GitHub Actions**. The workflow reads the site's address and base path from the Pages settings, so a custom domain needs no code change.

**A release** publishes the VS Code extension:

1. Register a publisher on the Visual Studio Marketplace and Open VSX, and add the `VSCE_PAT` and `OVSX_PAT` repository secrets. Marketplace tokens of the current kind stop working on 2026-12-01 ([decision 015](docs/decisions/015-marketplace-token-retirement.md)).
2. Set `publisher` and `version` in `packages/build/src/project.ts`, date the version in `CHANGELOG.md`, run `pnpm build`, and add the Marketplace install to the README (`docs.test.ts` fails until you do). The READMEs and the website switch to the marketplace instructions as soon as the publisher is set, so push the tag straight after this commit.
3. Push a tag such as `v0.1.0`. [`release.yml`](.github/workflows/release.yml) runs every check again, attaches `fovea.vsix` to a draft GitHub release, and publishes it to Open VSX and the Visual Studio Marketplace. Review the draft release, then publish it.
