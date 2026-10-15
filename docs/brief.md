# Fovea — build an evidence-based color scheme (VS Code + Ghostty + website)

You are starting a new open-source project in this directory. It is empty apart from this brief; if this file is here, move it to `docs/brief.md` and keep it. Work through the phases in §7, stop at the checkpoint, and finish with the report in §9. Look things up on the web (VS Code theme keys, Ghostty options, Astro and GitHub Pages actions, papers) rather than relying on memory.

## 1. The project

**Fovea** is a color scheme in the spirit of Solarized, Nord, Catppuccin and Tokyo Night. It has a named palette with a strong identity, a few variants, ports to specific apps, a style guide for porters, and a polished website.

What makes it different: **every color decision traces back to vision science or accessibility research, is enforced by automated tests, and is honest about what a color theme can and cannot do for eye health.**

The name is the thesis. The fovea is the small central pit of the retina that gives us sharp vision. Its very center has no blue-sensitive (S) cones, so fine detail like text is resolved by *lightness* contrast, not by hue. Fovea therefore designs lightness first and hue second. Its visual hierarchy is "sharp at the center, calm at the periphery": the text you are reading gets the most contrast, and the surrounding UI stays quiet.

**v1 deliverables**

1. A single source-of-truth palette, designed in OKLCH, and a generator that builds every port from it.
2. A VS Code extension containing every variant. It is also published to Open VSX, which is where Cursor, VSCodium and Windsurf get extensions.
3. Ghostty themes for every variant.
4. A showcase and documentation website, deployed to GitHub Pages.
5. A test suite that enforces the design rules: contrast, color-vision deficiency (CVD), gamut, and consistency across ports.
6. Docs:
   - README
   - research dossier
   - design and method notes
   - porter's style guide
   - contributing guide
   - changelog
   - MIT license

## 2. Ground rules

- **Evidence honesty.**
  - Never claim that Fovea prevents eye damage, cures eye strain, or improves sleep. Use calibrated language ("designed to", "studies suggest").
  - Every factual claim on the website must link to a source you actually opened.
  - Never cite from memory. If you can't verify a source, drop the claim.
- **Verify this brief.** §3 was compiled quickly. Check each row against its source and correct anything that is wrong. Search for newer work (2025–2026) before relying on it.
- **One source of truth.** Palette values live only in the palette package. All port files are generated and never hand-edited. CI fails if generated files are stale.
- **Hard rules:**
  - No pure `#000000` or `#ffffff` in any theme.
  - Never encode meaning with hue alone.
  - Every color stays inside sRGB.
- **Code style.**
  - TypeScript strict, no `any`.
  - Small pure functions and immutable data, with side effects only at the CLI and I/O edges.
  - Deterministic output.
- **Ask before anything public or irreversible.**
  - Don't create remote repos, push, publish to marketplaces, or open upstream PRs.
  - Prepare everything and list what I need to do.
  - Run `git init` and commit at the end of each phase.
- **Record deviations.** If part of this brief proves infeasible or wrong, don't silently work around it.
  - Write `docs/decisions/NNN-<title>.md` with the context, the options, and the decision.
  - List it in the final report.

## 3. Research brief (verify, then build on it)

| # | Finding | Sources | Implication for Fovea |
|---|---|---|---|
| 1 | Dark text on a light background is read more accurately than light on dark (the "positive polarity advantage"). The brighter screen constricts the pupil and sharpens the retinal image. The dark-mode penalty is largest in dark rooms; in some studies it disappears under bright light. | Piepenbrock, Mayr & Buchner 2014 (*Ergonomics*); Dobres, Chahine & Reimer 2017 (*Applied Ergonomics*); Palmén, Gilbert & Crossland 2023 (CHI '23, doi:10.1145/3544548.3581552) | Day is a first-class variant and the recommended choice for long reading in bright rooms. Dark variants must make up for the penalty with enough text contrast. |
| 2 | Comfort can favor dark mode. Dark mode produced lower visual fatigue at both 450 lux and 3 lux. Very warm screen temperatures (2800 K) caused the most fatigue, and 4500 K did best in the dark. A one-hour tablet trial (n=30) found no difference in subjective fatigue, but dark mode scored better on critical flicker frequency and dry-eye symptoms. | Xie, Yu & Chen 2025 (*Int J Hum–Comput Interact* 41(2)); Sengsoon & Intaruk 2025 (*IJERPH*) | Ship one variant per lighting condition and let users choose. Night is warm-neutral, never amber or sepia. |
| 3 | Larger pupils lower optical quality, especially in astigmatic eyes. This is the plausible mechanism behind "halation" (glowing text) in dark mode, but I found no study that tests dark mode and astigmatism directly. | Double-pass optics study, PMC3706062; Palmén et al. 2023 | Dark variants use no pure white text and no pure black backgrounds, and cap primary-text contrast. Present this evidence as mechanistic and limited. |
| 4 | On black, saturated blue text produced the largest accommodative lag (0.61 D) and was rated hardest to read; yellow was rated easiest (n=30). Under low light with light-on-dark text, red caused the most fatigue and yellow the least. The eye's longitudinal chromatic aberration (about 2 D across the visible spectrum) focuses red and blue at different depths, which produces chromostereopsis. | Ramasubramanian et al. 2026 (*Br Ir Orthopt J*, doi:10.22599/bioj.515); Fan et al. 2024 (*Sensors* 24:3516); Thibos et al. 1990 (cited in the former) | No saturated blue or deep-red text. Give the most frequent tokens mid-spectrum hues. Never place saturated red next to saturated blue. |
| 5 | The central ~20–25 arcmin of the fovea has no S (blue) cones. Fine spatial detail is resolved by L and M cones, which means by luminance contrast. | Williams, MacLeod & Hayhoe 1981 (*Vision Research*); Curcio et al. 1991 (*J Comp Neurol*) | Lightness carries legibility and hue is secondary, so every text color must clear a luminance-contrast floor. This is also where the name comes from. |
| 6 | **Standards.** WCAG 2.2 (also published as ISO/IEC 40500:2025) is the normative test: 4.5:1 for text, 3:1 for large text and UI components. The WCAG 3 Working Draft (10 Sept 2026) still says its contrast algorithm is "yet to be determined".<br>**APCA** is a candidate method, still in beta. It is perceptually uniform and aware of polarity, and it shows that WCAG 2 overstates contrast for dark colors. Its levels: Lc 90 is preferred for body text and 75 is the minimum; 60 for other content text; 45 for large text; 30 for text that only needs to be spot-readable; 15 for non-text. | w3.org/TR/WCAG22; w3.org/TR/wcag-3.0; git.apcacontrast.com/documentation/APCA_in_a_Nutshell | WCAG 2.2 is the hard floor and APCA sets the design targets (§4.3). |
| 7 | **Blue light and sleep.** Blue-light-filtering lenses probably don't reduce computer eye strain, and their effect on sleep is inconclusive. A 2025 meta-analysis found no significant effect on sleep measured by actigraphy.<br>Evening light still matters for circadian timing. The consensus target is ≤ 10 lux melanopic EDI (a measure of how strongly light drives the body clock) at the eye during the 3 hours before bed, and that depends mostly on how much light reaches the eye. Melanopsin, the pigment involved, is most sensitive around 480–490 nm (cyan-blue). | Singh, Downie & Anderson 2023 (Cochrane CD013244.pub2); PubMed 41341515 (2025); Brown et al. 2022 (*PLOS Biol*, doi:10.1371/journal.pbio.3001571) | No blue-light marketing. Night's honest benefit is that it emits less light and has fewer large cyan or blue areas. Tell users that screen brightness and room lighting matter far more than hue. |
| 8 | Digital eye strain has many causes: reduced and incomplete blinking, uncorrected refractive error, binocular vision problems, cognitive load, glare, and a mismatch between screen and room brightness. Software reminders to take 20-20-20 breaks reduced symptoms over 2 weeks, but the gains faded a week after the reminders stopped. | TFOS Lifestyle report 2023 (*Ocular Surface*, PubMed 37062428); Manna 2026 (*Clin Optom*, doi:10.2147/OPTO.S586750); Talens-Estarelles et al. 2023 (*Cont Lens Anterior Eye*, PubMed 35963776) | A theme can only address glare and contrast. The website's comfort guide covers the rest. |
| 9 | About 8% of men and 0.5% of women of European ancestry have congenital red-green CVD; deuteranomaly alone affects about 4.6% of men. Machado et al. 2009 is the standard simulation model. | Simunovic 2010 (*Eye*, doi:10.1038/eye.2009.251); Machado, Oliveira & Fernandes 2009 (*IEEE TVCG* 15(6)) | See §4.5. |
| 10 | Warm background tints (peach, orange, yellow) gave faster on-screen reading than cool tints, for readers with and without dyslexia (n=341). | Rello & Bigham 2017 (ASSETS, doi:10.1145/3132525.3132546) | Day uses a subtly warm "paper" background, not cool or pure white. |
| 11 | **Syntax highlighting** helps, but only modestly:<br>• Tasks were finished faster, with the benefit shrinking as experience grew (n=10, eye tracking).<br>• There was no comprehension gain for 390 novices.<br>• Reading behavior showed no significant effect.<br>Practitioners argue for highlighting fewer, rarer classes; others point out that coloring keywords helps catch typos. People can tell apart only a handful of colors at a glance. | Sarkar 2015 (PPIG); Hannebauer et al. 2018 (*Empir Softw Eng*); Beelders & du Plessis (*J Eye Mov Res* 9(1)); Tonsky 2025 (tonsky.me/blog/syntax-highlighting) and its Hacker News thread; Healey 1996 (verify) | Highlight with restraint: at most 6 syntax hues, red reserved for errors, and hues assigned by measured token frequency (§4.6). |
| 12 | Typefaces built for low vision exist: Atkinson Hyperlegible Next and Mono, from the Braille Institute, under the OFL license. Dyslexia style guidance advises against italics in running text. | brailleinstitute.org/freefont; British Dyslexia Association style guide (verify) | The site uses Atkinson Hyperlegible, and the themes use no italics by default. |

**Benchmark for context.** The table shows each theme's default text on its own background. The APCA values come from the reference algorithm.

| Theme | APCA Lc | WCAG 2 |
|---|---|---|
| Solarized Dark | 40 | 4.8:1 |
| Solarized Light | 66 | 4.1:1 |
| Tokyo Night Day | 62 | 4.5:1 |
| Tokyo Night | 74 | 10.6:1 |
| VS Code Dark Modern | 74 | 10.3:1 |
| Catppuccin Latte | 79 | 7.1:1 |
| Catppuccin Mocha | 80 | 11.3:1 |
| Nord | 80 | 9.3:1 |
| GitHub Dark | 95 | 16.0:1 |

Note that WCAG 2 rates the dark themes highly, but APCA does not.

## 4. Design specification

### 4.1 Variants

| Variant | Polarity | Intended for | VS Code `uiTheme` |
|---|---|---|---|
| **Fovea Day** | light | Bright rooms and daylight; best legibility for long reading | `vs` |
| **Fovea Dusk** | dark | Dim rooms, evenings, and people who prefer dark mode | `vs-dark` |
| **Fovea Night** | dark | Dark rooms and the hours before sleep. Emits the least light that still meets body-text minimums; lowest chroma; blues and cyans the most restrained | `vs-dark` |

**Stretch goal**, once everything else is done: high-contrast variants for low vision (`hc-light` and `hc-black`). Raise every text role by 15 Lc over §4.3, and require WCAG 7:1 for all text.

**Character.** Day is ink on warm paper. Dusk is soft light on warm graphite. Night is Dusk dimmed, with nothing glaring. Fovea should feel calm, distinctive and beautiful, not clinical. Compliance is the floor, not the goal.

**Starting points.** I checked these against the APCA reference algorithm. Change them freely as long as the tests pass.

| Variant | Background | Foreground | APCA Lc | WCAG 2 |
|---|---|---|---|---|
| Day | `oklch(0.970 0.012 85)` ≈ `#f9f5ec` | `oklch(0.29 0.012 70)` ≈ `#2f2a25` | 95 | 13.1:1 |
| Dusk | `oklch(0.225 0.008 70)` ≈ `#1e1b18` | `oklch(0.905 0.010 80)` ≈ `#e3dfd8` | −86 | 12.9:1 |
| Night | `oklch(0.175 0.007 65)` ≈ `#13100d` | `oklch(0.86 0.012 75)` ≈ `#d6d0c9` | −78 | 12.4:1 |

### 4.2 Palette architecture

- **Neutral ramp.** Each variant has ~9–11 steps from the sunken background to the strongest text, with semantic names such as `bg.sunken`, `bg`, `bg.raised`, `bg.overlay`, `border`, `fg.faint`, `fg.muted`, `fg` and `fg.strong`. The ramp is monotonic in OKLCH lightness, shares one hue, and keeps chroma ≤ 0.02.
- **Accents.** Use 7–8 hue families: red, orange, yellow, green, teal/cyan, blue, violet and pink. Each family has the tones it needs: a text tone, background-tint tones, and an ANSI bright tone.
- **Hue identity.** A role keeps its hue family in every variant, so switching variants never changes meaning. Only lightness and chroma adapt.
- **Semantic roles.** Roles map onto palette entries: error, warning, info, hint, success/added, removed, modified, conflict, link, focus, selection, find match, and so on. Ports consume roles, never raw hues.
- **Exports:**
  - a typed TS module
  - `fovea.json` (OKLCH, hex and roles for each variant)
  - `fovea.css` (custom properties under `[data-theme]`, with `prefers-color-scheme` defaults)

### 4.3 Contrast budget (enforced by tests)

Assume code text at 13–15 px and regular weight. Values are absolute APCA Lc against the surface each element sits on, and the WCAG 2.2 floor must also pass. Keep every threshold in a single config file that the tests read.

| Role | Day | Dusk | Night | WCAG 2.2 floor |
|---|---|---|---|---|
| Primary text | ≥ 90 | 85–92 | 75–82 | 7:1 |
| Syntax token colors (except comments and punctuation) | ≥ 75 | ≥ 75 | ≥ 75 | 4.5:1 |
| Comments, doc comments, punctuation | 60–75 | 60–75 | 60–75 | 4.5:1 |
| Token colors on overlays: selection, find and word highlight, diff line backgrounds, current line | ≥ 60 | ≥ 60 | ≥ 60 | 4.5:1 |
| Active line number, active tab title | ≥ 75 | ≥ 75 | ≥ 75 | 4.5:1 |
| Secondary UI text, line numbers, inlay hints, inline suggestions (ghost text) | ≥ 45 | ≥ 45 | ≥ 45 | 3:1 |
| Placeholder and disabled text | ≥ 30 | ≥ 30 | ≥ 30 | — |
| Cursor (≥ 60); focus outlines, input borders, squiggles (≥ 45) | as listed | as listed | as listed | 3:1 (SC 1.4.11) |
| Decorative non-text: indent guides, rulers, whitespace, dividers | 15–30 | 15–30 | 15–30 | — |
| ANSI colors used as text: 1–6, 9–14, plus 7/15 (dark variants) or 0/8 (light) | ≥ 60; aim for ≥ 75 on red, green, yellow, blue | same | same | 4.5:1 |
| ANSI 8 (bright black) in dark variants, used for dim text and shell autosuggestions | — | 45–60 | 45–60 | 3:1 |

- The upper bound on primary text in the dark variants guards against halation.
- APCA is the design target and WCAG 2.2 is the normative floor; report both everywhere.
- **Expect pastel accents in dark variants.** My feasibility check showed that reaching Lc 75 on a dark background pushes accents toward pastels: at the lightness required, red, blue and pink can only reach about 0.06–0.08 chroma inside sRGB. That is the price of legible colored text on dark backgrounds. Handle it by:
  - using fewer hues;
  - giving the hues that can be both light and saturated (yellow, green, teal and orange) to the most frequent tokens.

### 4.4 Hue and chroma strategy

- **Lightness first.** Hue is a secondary cue; every legibility guarantee comes from lightness contrast.
- **Hues weighted by frequency.**
  - Tokenize the fixtures with Shiki, plus a small corpus of real open-source code if licensing allows, and count how often each highlighted class appears.
  - Give the most comfortable, legible mid-spectrum hues (yellow, green, orange) to the most frequent classes.
  - Commit the frequency report.
- **Red is an alarm.** Reserve red for errors, deletions and invalid code, never for ordinary syntax.
- **No saturated blue or violet text.**
  - Lighten and desaturate blues and violets until they pass contrast.
  - Never put a saturated red and a saturated blue side by side as neighboring token colors, because that triggers chromostereopsis.
  - The tests should warn when two syntax colors with roughly opposite hues both exceed OKLCH chroma 0.12.
- **Equal emphasis by default.** Accents in the same tier sit within ±3 Lc of each other, so no hue is accidentally louder. Emphasis is a deliberate lightness choice.
- **Moderate chroma, never neon.** Starting caps: Day ≤ 0.15, Dusk ≤ 0.12, Night ≤ 0.09.
- **Warm-neutral whites.** This applies to the near-white neutrals: Day's background and the dark variants' foregrounds.
  - Their correlated color temperature (CCT) equivalent sits between ~4500 K and ~6500 K, with no green or magenta cast; McCamy's approximation is fine.
  - Never sepia or amber (see §3, row 2).
  - Night may lean warmer within that band and reduces blue and cyan chroma further.
- **Day background.** A subtly warm "paper" with low chroma, so contrast stays high.

### 4.5 Color-vision deficiency

- **Simulation.** Simulate protanopia, deuteranopia and tritanopia at full severity using the Machado et al. 2009 matrices, applied in linear RGB. Measure the resulting difference as ΔE in OKLab (ΔE_OK).
- **Semantic pairs.** Each pair must keep a worst-case ΔE_OK ≥ 0.10 under every simulation and must also differ in lightness:
  - error vs success
  - diff removed vs added (text and background tints)
  - git deleted vs added or untracked
  - test failed vs passed
  - ANSI red vs green (1/2 and 9/10)
  - warning vs error
  - find match vs selection
- **What my feasibility check found:**
  - At equal lightness, red and green collapse to a worst-case ΔE_OK of about 0.005.
  - Blue/orange pairs survive at about 0.19–0.22.
  - Red/teal survives at about 0.13–0.15 when red is the darker of the two.
  - The offset has to go that way because people with protan CVD see red as darker; an offset in the other direction cancels out.
- **Syntax accents.**
  - Every pair needs ΔE_OK ≥ 0.08 in normal vision. If 8 hues can't meet that at the required contrast, use fewer.
  - Report syntax pairs that collapse under CVD simulation, but don't fail the build on them.

### 4.6 Syntax highlighting

Restraint is a design choice (§3, row 11). Use this default mapping, and refine it only with documented reasons:

- **Plain text color:** variables, parameters, properties, function calls, operators.
- **Muted neutral:** punctuation, brackets, delimiters.
- **Keywords:** one quiet, low-chroma color. It must stand apart from plain text, so a misspelled keyword looks wrong, but it should not be loud.
- **Strings:** one accent. Escapes, regex and interpolation get a related accent.
- **Numbers, booleans, constants, enum members:** one accent.
- **Definitions:** function, class and type names where they are declared get accent colors. Use the semantic `declaration` modifier where it is available.
- **Types and type references:** one low-chroma accent.
- **Comments:** readable (see §4.3) and not italic.
- **Invalid code:** red. **Deprecated code:** strikethrough.
- **Markup:**
  - headings: accent and bold
  - links: accent and underline
  - inline code
  - emphasis the user wrote: italic is fine here
  - diff files: use the semantic pair
- **Limits:** at most 6 syntax hues, plus the reserved red.
- **Semantic highlighting.**
  - Set `"semanticHighlighting": true` and define `semanticTokenColors` for the standard token types and modifiers.
  - TextMate rules must give equivalent results for languages that have no semantic tokens.
  - Check TS/JS, Python, Rust, Go, Java, Scala (Metals), C/C++, C#, Ruby, PHP, Swift, Kotlin, HTML, CSS, JSON, YAML, TOML, Markdown, shell, SQL, Dockerfile and diff.
- **Font styles.** No italics by default. Document how users can opt in through `editor.tokenColorCustomizations`.

### 4.7 VS Code UI chrome

- **Sharp center, calm periphery.**
  - The editor text and the cursor have the highest contrast.
  - Sidebars, the activity bar, the status bar and the minimap stay quiet.
  - Use at most ~3 surface elevations and no large saturated areas (for example, no bright blue status bar).
  - Keep badges small.
- **Overlays:**
  - selection
  - find matches: distinct from the selection by lightness plus a border
  - word highlight
  - bracket match: a border, not a fill
  - current line: very subtle
  - diff and merge editors: tints that keep every token readable and stay CVD-safe
- **Integrated terminal.** The `terminal.ansi*` colors must be identical to the Ghostty palette.
- **Coverage.**
  - Cover the current official theme color reference: editor, workbench, diff, merge, notebook, testing, debug, chat and inline chat, source control, charts, and so on.
  - Pin the list of keys as a fixture, noting which VS Code version it comes from.
  - Generate a coverage report showing which keys are set and which deliberately fall back to defaults.

### 4.8 Terminal palette (ANSI 16)

- Keep the ANSI meanings: 0 is the darkest, 7 is a light gray, 15 is the lightest, and each bright color is clearly distinct from its normal counterpart.
- ANSI blue must be readable on the terminal background. Directory listings are the classic place this fails.
- Bright black (8) must be readable enough for shell autosuggestions and dim output.

## 5. Engineering

### 5.1 Stack

- **Tooling:** TypeScript, the current Node LTS, pnpm workspaces, Vitest, ESLint with Prettier (or Biome), and Playwright.
- **Color math:**
  - Color.js (`colorjs.io`) covers OKLCH, CSS Color 4 gamut mapping, ΔE_OK, and both WCAG 2.1 and APCA contrast.
  - For CVD simulation, implement the Machado 2009 matrices from the paper, or use `culori`'s `filterDeficiency*` functions.
  - Watch the argument order: libraries disagree on whether text or background comes first.
- **APCA licensing.**
  - The reference `apca-w3` package ships under a "Limited W3 License". It is not an open-source license, and it covers web content only.
  - Check the license of whatever you use, and record the decision.
  - Use APCA at build time only. Precompute any values the site shows, and never vendor or modify APCA code.
  - If you label numbers as "APCA", the implementation must match the current reference algorithm (0.0.98G-4g). Test it against APCA's published reference pairs: `#888` text on `#fff` gives Lc 63.06, and `#fff` text on `#888` gives Lc −68.54.
- **Site:**
  - Astro with static output.
  - Shiki, fed the generated VS Code themes.
  - Vanilla TS for interactivity.
  - Fonts self-hosted through Fontsource.

### 5.2 Suggested repository layout

```
fovea/
├─ packages/palette/            # source of truth: variants (OKLCH), roles, contrast-budget config
├─ packages/colorlab/           # pure color math: conversions, gamut, contrast, CVD, ΔE, CCT
├─ packages/build/              # generators and CLI for every output in §5.3
├─ ports/vscode/                # extension: package.json, README, icon, generated themes/
├─ ports/ghostty/               # generated theme files + README
├─ ports/iterm2-color-schemes/  # generated YAML staged for an upstream PR
├─ site/                        # Astro website
├─ fixtures/                    # code samples per language + terminal output samples
├─ docs/                        # brief.md, research.md, design.md, style-guide.md, decisions/
└─ .github/workflows/           # ci.yml, pages.yml, release.yml
```

### 5.3 Generated outputs

All outputs must be deterministic: stable key order and no timestamps.

- `ports/vscode/themes/fovea-{day,dusk,night}-color-theme.json`
- `ports/ghostty/themes/Fovea {Day,Dusk,Night}`
- `fovea.json` and `fovea.css`
- YAML for iTerm2-Color-Schemes. That repository is the upstream source of Ghostty's built-in themes, and YAML is its preferred format for new themes.
- SVG palette strips and markdown tables for the README and docs.

### 5.4 VS Code port

- **`package.json`:**
  - `contributes.themes` with label, `uiTheme` and path
  - categories `["Themes"]`, plus keywords, icon, gallery banner, repository and license
  - `engines.vscode` set deliberately low (e.g. `^1.85.0`), because forks such as Cursor lag behind upstream VS Code and hide extensions that require a newer engine
  - check that the name is free on both registries, falling back to `fovea-theme`
  - leave `publisher` as a clearly marked placeholder
- **Distribution:**
  - Publish to the Visual Studio Marketplace and to Open VSX (where Cursor, VSCodium and Windsurf install from).
  - CI packages a `.vsix` artifact with `@vscode/vsce`.
  - `release.yml` publishes on `v*` tags, and only when the `VSCE_PAT` and `OVSX_PAT` secrets exist.
- **Docs:**
  - A marketplace README with screenshots linked by absolute URL.
  - Recommended settings: `window.autoDetectColorScheme`, together with `workbench.preferredLightColorTheme` and `preferredDarkColorTheme`.
  - The italics opt-in.

### 5.5 Ghostty port

- **Allowed keys.** Theme files set only color options:
  - `background`, `foreground`
  - `cursor-color`, `cursor-text`
  - `selection-background`, `selection-foreground`
  - `palette = 0..15`
  - newer color keys where they help (`search-*`, `split-divider-color`, `unfocused-split-fill`)

  Check every key against https://ghostty.org/docs/config/reference (Ghostty 1.3 at the time of writing). Don't set fonts, opacity or window options; Ghostty's built-in themes are audited to set only safe options.
- **Validation.**
  - If Ghostty is installed, run `ghostty +validate-config --config-file=<theme>` on each file.
  - In all cases, also run a parser test against a pinned list of allowed keys.
- **Docs:**
  - **Install:** copy the files into `~/.config/ghostty/themes/`, then set `theme = light:Fovea Day,dark:Fovea Dusk`.
  - **Color space:** keep `window-colorspace = srgb`, the default. The palette is validated in sRGB, and `display-p3` would reinterpret the values as more saturated.
  - **Optional settings:**
    - `minimum-contrast` sets a WCAG-ratio floor that rescues apps printing low-contrast colors.
    - `alpha-blending = linear-corrected` removes dark fringes around colored text.
  - **Extended palette:** mention Ghostty 1.3's `palette-generate` as the way to derive colors 16–255, instead of shipping them.

### 5.6 Tests (all run in CI)

1. **colorlab**
   - conversions against published reference values: Ottosson's OKLab test values, APCA's reference pairs, known WCAG pairs
   - gamut mapping
   - the CVD matrices
2. **palette**
   - every row of the contrast budget for every variant, including tokens on overlays
   - the CVD semantic pairs and the accent ΔE checks
   - every color inside sRGB, and no pure black or white
   - a monotonic neutral ramp and the neutral CCT band
   - Night emits less light than Dusk, using the metric in §6.2
3. **ports**
   - The VS Code JSON is valid and uses only known keys.
   - Every color comes from the palette: no stray hex values, and alpha only through documented overlay roles.
   - Shiki tokenizes every fixture with each generated theme, and every token meets its floor.
   - ANSI colors match between VS Code and Ghostty.
   - Ghostty files parse and use only allowed keys.
   - Snapshot tests cover all generated files.
4. **site**
   - It builds with a non-root `base`.
   - Playwright smoke tests pass.
   - axe-core runs on every page in every variant.
   - Internal links resolve.
   - A scheduled job checks external citation links; it does not block merges.
5. **CI also runs:**
   - lint
   - typecheck
   - `pnpm build && git diff --exit-code`, so generated files can't go stale

## 6. Website (GitHub Pages)

### 6.1 Pages

1. **Home**
   - The thesis in one paragraph.
   - An interactive hero: an editor mock and a terminal mock that re-theme the whole site when you switch variants.
   - Install buttons.
   - 3–4 principle cards that link to the science page.
2. **Palette**
   - Swatches per variant, grouped by role: neutrals, accents, semantic, ANSI 16.
   - Each swatch shows hex, OKLCH and RGB, with copy buttons.
   - Contrast badges (APCA Lc and WCAG ratio, precomputed at build time) and a contrast matrix.
   - A CVD simulation toggle.
   - Nice to have: a neutral, data-only comparison with the themes in the §3 benchmark.
3. **Science ("Why these colors")**
   - Each principle in plain language, with its evidence and links.
   - An evidence-strength label for each: systematic review, experiment, mechanism, or expert opinion.
   - How Fovea applies each principle, and the caveats.
   - A "What a color theme can't do" section.
   - A "Myths" section covering blue-light glasses, "dark mode is always healthier", and "Night Shift fixes sleep".
4. **Install**
   - VS Code: Marketplace, Open VSX/Cursor, or a manual VSIX.
   - Ghostty: manual install and automatic light/dark switching.
   - Recommended settings, each with the reason behind it.
   - "Port Fovea to your app": the palette JSON and CSS, the style guide, and how to contribute.
5. **Screen comfort guide** (things beyond the theme), citing the §3 sources:
   - 20-20-20 breaks and blinking
   - matching screen brightness to the room, and avoiding a bright screen in a dark room
   - viewing distance and font size
   - up-to-date glasses for screen distance
   - a clear note: "not medical advice; see an eye-care professional"
6. **404**

### 6.2 Requirements

- **Dogfooding.**
  - The site itself is themed with Fovea.
  - Code samples are rendered by Shiki using the generated VS Code themes: TS, Python, Rust, Go, Scala, Markdown, JSON, shell and diff.
  - The terminal mock shows realistic output: git status, diff and log; a test run with passes and failures; `ls`; and a compiler error.
- **CVD simulation.** Use SVG `feColorMatrix` filters with the Machado matrices; SVG filters work in linearRGB by default, which matches the matrices. Add a grayscale view too.
- **Emitted-light metric** (nice to have).
  - Render the same editor mock in each variant with Playwright, and compute the mean relative luminance of the pixels.
  - State the measured difference, for example "Night emits N% less light than Day at the same brightness".
  - Add the caveat that display brightness and room lighting matter far more.
- **Variant selection.**
  - Default from `prefers-color-scheme`: light maps to Day, dark to Dusk.
  - A manual override, persisted in `localStorage`, with no flash of the wrong theme on load.
  - Honor `prefers-reduced-motion`.
  - Map `prefers-contrast: more` to the high-contrast variants, if they exist.
- **Typography.** Use Atkinson Hyperlegible Next for prose and Atkinson Hyperlegible Mono for code, self-hosted.
- **Quality.**
  - WCAG 2.2 AA at minimum: semantic HTML, keyboard navigation, visible focus, a skip link, and alt text.
  - Lighthouse on mobile: Accessibility 100; Performance, Best Practices and SEO ≥ 95.
  - No analytics, cookies or third-party requests.
- **Deploy.**
  - `pages.yml` uses `actions/configure-pages`, `actions/upload-pages-artifact` and `actions/deploy-pages`, with the Pages source set to GitHub Actions.
  - Derive Astro's `site` and `base` from configure-pages' outputs, so the site works at `https://<user>.github.io/<repo>/` or on a custom domain without code changes.
  - Every internal link and asset must respect `base`.
- **Identity.**
  - A simple SVG logo: a circle with a central pit.
  - The favicon, Open Graph image and VS Code icon are all derived from that logo.
  - The visual metaphor is "sharp center, calm periphery".
  - No effects that hurt readability: no blurred text, no parallax.

## 7. Process and checkpoint

0. **Research verification.** Produce `docs/research.md`, an evidence table with one row per claim.
   - Each row gives the source (with DOI or URL), study type, sample size, key result, evidence strength, and the implication for Fovea.
   - Add a "contested / unknown" section.
   - Include any newer work you find.
1. **Scaffold.** Set up the monorepo, tooling and a CI skeleton, and run `git init`.
2. **colorlab.** Build the color-math package and its tests.
3. **Palette.**
   - Write `docs/design.md`: the method and the parameters, with the reason for each.
   - Generate the palette and iterate until the tests pass.
   - Build an internal palette report page with swatches, contrast matrices, CVD previews and Shiki previews.
   - If you can view images, review Playwright screenshots of the report. Aim for beautiful, not merely compliant.
   - **Checkpoint:** summarize the palette and the report. If you are running interactively, wait for my OK before building ports; if unattended, proceed.
4. **VS Code port**, plus `docs/style-guide.md` (the mapping from roles to palette colors, for future porters).
5. **Ghostty port**, plus the staged iTerm2-Color-Schemes YAML.
6. **Website.**
7. **Docs and release.**
   - README with screenshots.
   - CONTRIBUTING, including "how to add a port".
   - CHANGELOG and LICENSE (MIT).
   - `release.yml`.
8. **Final QA from a clean clone.**
   - `pnpm install && pnpm build && pnpm test` passes.
   - The site builds with a non-root base.
   - The `.vsix` packages, and installs if the `code` CLI is available (use a throwaway `--extensions-dir`).

## 8. Definition of done

- [ ] All three variants are generated from one source, every test passes, and no generated file is stale.
- [ ] The VS Code `.vsix` builds, the Ghostty themes validate, and the ANSI colors match across ports.
- [ ] The site builds, passes the accessibility checks, and deploys through the Pages workflow. Every science claim links to a verified source.
- [ ] `docs/research.md`, `docs/design.md`, `docs/style-guide.md` and the decision records exist.
- [ ] Nothing has been published, pushed or submitted upstream.

## 9. Final report (when you're done)

- **What you built**, and how to run, build, test and preview it.
- **The palette** for each variant (role, hex, OKLCH) and how it scored against the contrast budget.
- **Deviations** from this brief, with links to the decision records.
- **My to-do list:**
  - Create the GitHub repo and push.
  - Under Settings → Pages, set the source to "GitHub Actions".
  - Set the publisher IDs and add the `VSCE_PAT` and `OVSX_PAT` secrets.
  - Optionally, open the upstream iTerm2-Color-Schemes PR.
- **Suggested next ports:** Neovim, Zed, JetBrains, iTerm2, kitty, WezTerm, Alacritty, Windows Terminal, tmux, bat/delta, fzf.

## 10. Non-goals for v1

- Ports to apps other than VS Code and Ghostty.
- Wide-gamut (P3) variants.
- Switching variants by time of day; the operating system already does that.
- Changing the display's white point; that is what Night Shift and f.lux are for.
- Any medical claim.
