# Design

How Fovea's colors are made, and why each parameter has the value it has. It covers the method, the three variants, the contrast budget, hue and chroma, syntax highlighting, color-vision deficiency, overlays, ANSI colors and UI roles.

- **Where the numbers live.** The specs are in [`packages/palette/src/variants/`](../packages/palette/src/variants/), the thresholds in [`budget.ts`](../packages/palette/src/budget.ts), the solver in [`solve.ts`](../packages/palette/src/solve.ts) and the TextMate mapping in [`scopes.ts`](../packages/palette/src/scopes.ts).
- **Measured values** quoted here were computed from the shipped palette on 14 October 2026. The tests recheck every threshold on each build; if this page and the tests ever disagree, trust the tests.
- **Evidence** for each choice is in [research.md](research.md). Places where Fovea departs from the [brief](brief.md) are in the [decision records](decisions/README.md).

## Principles

1. **Lightness carries legibility.** The center of the fovea has no working blue cones, and color-only patterns stop being resolvable at about 11–12 cycles per degree ([research.md §5](research.md#5-the-fovea-and-luminance-contrast)). Every legibility guarantee in Fovea is therefore a lightness-contrast floor. Hue is a secondary cue.
2. **Restraint.** Studies find that syntax highlighting helps only a little ([§11](research.md#11-syntax-highlighting)). Fovea uses six syntax hues plus a reserved red, and leaves function calls, variables, properties and operators in the text color.
3. **Red is an alarm.** It marks errors, invalid code and deletions, and nothing else.
4. **Meaning never rests on hue alone.** Paired meanings (error and success, removed and added) differ in lightness as well as hue, and are checked under color-vision-deficiency (CVD) simulation. Ports add a cue that doesn't depend on color, such as a shape, a position or an underline, wherever the editor allows.
5. **Calm, not clinical.** Warm near-whites, no pure black or white, no neon. Day is ink on warm paper, Dusk is soft light on warm graphite, and Night is Dusk dimmed.

Fovea makes no health claims: nothing here says it prevents eye damage, cures eye strain or improves sleep. Night's honest advantage is that it emits less light ([§7](research.md#7-light-the-body-clock-and-blue-light)).

## Method

### Specs, not hex codes

Every color is written as an OKLCH spec in one of three forms, and a solver turns it into an 8-bit sRGB hex code.

| Form | Meaning | Used for |
|---|---|---|
| `{ l, c, h }` | A fixed OKLCH lightness | Surfaces and background tints |
| `{ lc, c, h }` | An APCA contrast target against a surface: the background, unless `on` names another one | Text, marks, borders and ANSI colors |
| `{ dl, c, h, alpha }` | A translucent color whose composite lands `dl` lighter (or, if negative, darker) than the background | Selection, find matches, diff tints and the current line |

`c` is a chroma cap, not a promise. When sRGB can't reach it at the required lightness and hue, the solver lowers chroma and keeps both lightness and hue. Gamut mapping never shifts hue or clips channels, which `gamut.test.ts` checks.

### Solving contrast targets

`solveLc` turns an `{ lc, c, h }` spec into a hex code in two steps:

1. **Bisection.** It halves the lightness interval 48 times until the APCA contrast against the surface matches the target. At each candidate lightness, chroma is clamped to the sRGB boundary for that lightness and hue.
2. **Rounding.** Rounding to 8-bit sRGB can lose a fraction of a point of contrast. The solver then nudges lightness in steps of 0.0005, up to 200 times, until the rounded hex itself meets the target.

APCA values come from Color.js's implementation of APCA 0.0.98G-4g ([decision 001](decisions/001-apca-via-colorjs.md)). APCA is by Andrew Somers and Myndex Research; Fovea is not affiliated with or endorsed by them, and its Lc values are design targets, not a compliance claim. Outside these method docs, Fovea calls the numbers "perceptual contrast (Lc)". They are the absolute Lc of text against the surface it sits on. WCAG 2.2 contrast ratios are computed alongside and checked as floors. Fovea's code text is 12–15 px, smaller than several of APCA's reference sizes, so the Lc targets are approximate for code ([research.md, "Contested or unknown"](research.md#contested-or-unknown)).

### Overlays

VS Code paints highlights over other decorations and asks that they not be opaque. `solveOverlay` therefore solves a translucent color whose composite over the background lands at the designed lightness, chroma and hue. When that color would fall outside sRGB, alpha rises from the spec's value in steps of 0.05, up to 0.8. If that still isn't enough, the target's chroma is reduced while lightness and hue are kept, so token contrast doesn't change. Diff text tints are solved over the diff line tint they sit on.

### Determinism

The same specs always produce the same hex codes. Generated files (`ports/palette/fovea.json`, `ports/palette/fovea.css` and the reports in `docs/generated/`) are written by `pnpm build`. CI fails if any of them is out of date.

## Variants

| | Day | Dusk | Night |
|---|---|---|---|
| Polarity | Light | Dark | Dark |
| Background | `#f9f4ec`, OKLCH 0.970 0.012 80 | `#1e1b18`, OKLCH 0.225 0.008 70 | `#13100d`, OKLCH 0.175 0.007 62 |
| Body text | `#28241e`, Lc 96.1, 14.1:1 | `#e6e1db`, Lc 87.4, 13.2:1 | `#d9d0c8`, Lc 78.4, 12.5:1 |
| Neutral hue | 80° | 70° | 62° |
| White point | Background: 6044 K, Duv +0.0033 | Text: 6083 K, Duv +0.0029 | Text: 5829 K, Duv +0.0019 |
| Chroma cap | 0.15 | 0.12 | 0.10 |
| Modelled emitted light | 80.5% | 7.4% | 6.3% |

What each variant is recommended for is in [decision 005](decisions/005-variant-guidance.md).

**Neutral ramps.** Each variant has 11 neutrals: four surfaces (`bg.sunken`, `bg`, `bg.raised`, `bg.overlay`), two borders and five text tones (`fg.faint`, `fg.muted`, `fg.subtle`, `fg`, `fg.strong`). Surfaces are fixed lightnesses; borders and text are contrast targets. Each ramp shares one hue, stays below chroma 0.02, and runs monotonically in lightness from the surfaces to the strongest text (`neutrals.test.ts`). In every variant, sunken surfaces are darker than the background and raised ones lighter; the hover fill is lighter than the background in the dark variants and darker in Day.

**White points.** The brief asks for warm-neutral whites between about 4500 K and 6500 K, with no green or magenta cast. Fovea tests the near-white of each variant, which is Day's background and the dark variants' text. Correlated color temperature (CCT) uses McCamy's approximation, and the cast is tested as |Duv| ≤ 0.006, the tolerance ANSI C78.377 uses for white lamps ([research.md §13](research.md#13-white-point)). Night sits warmest, as the brief allows, without turning amber.

**Emitted light.** The figure in the table is a model, not a measurement. It is the average relative luminance of a typical layout, as a share of a full-white screen:

- the editor is 88% background and 12% ink, where ink is the mean of body text and the six syntax accents;
- the sidebars and panels are 92% `bg.sunken` and 8% `fg.muted`;
- the editor weighs 65% and the chrome 35%.

Night emits about 15% less light than Dusk, mostly because its text is dimmer. That difference is modest: the screen's brightness setting and the room's lighting matter more than any choice of hue ([§7](research.md#7-light-the-body-clock-and-blue-light)).

**Changes from the brief's starting points.** The brief invited changes as long as the tests pass.

- Day's neutral hue moved from 85° to 80°: at 85° the paper's Duv was +0.0039, a faint green cast.
- The brief's foreground hues differed from the background hues (Day 70° on 85°, Dusk 80° on 70°, Night 75° on 65°). Each ramp now shares one hue, as §4.2 of the brief requires, and Night's is the warmest.
- Text is solved from contrast targets instead of fixed lightnesses: Day Lc 96 (the brief's starting point gave 95), Dusk Lc 87 (86) and Night Lc 78 (78).

## Contrast budget

All thresholds live in [`budget.ts`](../packages/palette/src/budget.ts), and the tests read them from there. Values are absolute APCA Lc against the surface an element sits on, plus a WCAG 2.2 floor. The APCA levels used below come from APCA's own guidance: Lc 90 preferred and 75 minimum for body text, 60 for other content text, 45 for large text and fine icons, 30 for any other text, and 15 for non-semantic marks such as dividers ([research.md §6](research.md#6-contrast-standards-and-apca)).

| Row | Day | Dusk | Night | WCAG 2.2 | Why |
|---|---|---|---|---|---|
| Primary text | ≥ 90 | 85–92 | 75–82 | 7:1 | Day aims at APCA's preferred level for body text. The dark variants have an upper bound because bright text in a large, dark-adapted pupil may blur into a glow (halation). That is a plausible hypothesis, not a demonstrated effect ([§3](research.md#3-pupils-optics-and-halation)). Night sits lowest to emit less light; its floor is APCA's body-text minimum. 7:1 is WCAG's AAA level for text. |
| Syntax token colors | ≥ 75 | ≥ 75 | ≥ 75 | 4.5:1 | Code is read like body text, so it gets APCA's body-text minimum and WCAG's AA level. |
| Comments, doc comments, punctuation | 60–75 | 60–75 | 60–75 | 4.5:1 | Comments carry meaning, so they stay at APCA's content-text level. The upper bound keeps them below the token tier, so they recede. |
| Token colors on overlays | ≥ 60 | ≥ 60 | ≥ 60 | 4.5:1 | Selections, find highlights and diff tints must never make code unreadable. |
| Active line number, active tab title | ≥ 75 | ≥ 75 | ≥ 75 | 4.5:1 | They mark where you are, and they are read as text. |
| Secondary UI text, line numbers, inlay hints, ghost text | ≥ 45 | ≥ 45 | ≥ 45 | 3:1 | Glanced at rather than read continuously; APCA's level for large text. See the note below the table. |
| Text in accent colors (error, warning and info messages, links) | ≥ 60 | ≥ 60 | ≥ 60 | 4.5:1 | Added by Fovea: messages in accent colors are content text. |
| Workbench labels: side bar, status bar, title bar, button labels | ≥ 60 | ≥ 60 | ≥ 60 | 4.5:1 | Added by Fovea: labels are content text that is scanned rather than read, so they take APCA's content-text level. They use the subtle text tone, which keeps the periphery a step quieter than the editor. |
| Strong accent text | ≥ 75 | ≥ 75 | ≥ 75 | 4.5:1 | Added by Fovea: the strong tone is used where accent text has to read like body text. |
| Placeholder and disabled text | ≥ 30 | ≥ 30 | ≥ 30 | — | APCA's level for text that doesn't need to be read fluently. WCAG exempts inactive controls. |
| Cursor | ≥ 60 | ≥ 60 | ≥ 60 | 3:1 | The cursor is the most important mark on screen. 3:1 is WCAG's non-text contrast (SC 1.4.11). |
| Focus outlines, input borders, squiggles | ≥ 45 | ≥ 45 | ≥ 45 | 3:1 | Same WCAG criterion; APCA's level for fine marks. |
| Decorative marks: indent guides, rulers, whitespace, dividers | 15–30 | 15–30 | 15–30 | — | Visible but quiet. The upper bound keeps them from competing with text. |
| ANSI colors used as text | ≥ 60, aim 75 for red, green, yellow and blue | same | same | 4.5:1 | Terminal programs print ANSI colors as text. The four most common status colors aim for body-text contrast; dark red is exempt ([decision 008](decisions/008-ansi-red-dark-variants.md)). |
| ANSI 8 (bright black) | — | 45–60 | 45–60 | 3:1 | Used for dim text such as shell autosuggestions: clearly dimmer than normal output, still readable. |

**Secondary text and WCAG.** The brief sets 3:1, WCAG's level for large text, as the floor for secondary UI text. WCAG 2.2 asks for 4.5:1 for text at normal size, and line numbers, inlay hints and ghost text are normal-size text. Day's secondary tone (`fg.muted`) measures 3.1–3.5:1 across its surfaces, so Fovea doesn't claim WCAG AA for those elements in Day. In Dusk and Night the same tone measures 6.0–7.2:1. Raising Day's tone to 4.5:1 on all three surfaces would take it to `#706b63` (Lc 70.1), within 5 Lc of comments (Lc 74.8), and flatten the hierarchy between them; the maintainer reviewed this trade-off and kept the hierarchy. Placeholder text is similar: WCAG exempts disabled controls but not placeholders, which measure 2.0–2.3:1 in Day and 4.2–5.0:1 in the dark variants.

The remaining rows aren't contrast floors:

| Row | Value | Why |
|---|---|---|
| Syntax tier spread | 3 Lc | Accents in one tier have equal emphasis, so no hue is louder by accident. The tests take the strict reading of the brief's "±3 Lc": the highest and lowest accent in the tier differ by at most 3. Measured: 0.34 Lc in Day and 0.37 in Dusk and Night. |
| Syntax separation | ΔE_OK ≥ 0.08 | Syntax colors must be told apart at a glance in normal vision. Night needed a higher chroma cap to reach it ([decision 003](decisions/003-night-chroma-cap.md)). |
| Semantic pairs under CVD simulation | worst-case ΔE_OK ≥ 0.10, lightness gap ≥ 0.03 | See [Color-vision deficiency](#color-vision-deficiency). Day's diff background tints use 0.06 ([decision 004](decisions/004-day-diff-tints.md)). |
| ANSI bright vs normal | ΔE_OK ≥ 0.04 | Programs that use both would otherwise lose information. |
| ANSI 7 chroma | ≤ 0.02 | ANSI 7 is "white", which terminals render as a light gray. |
| Chroma cap | 0.15 / 0.12 / 0.10 | Moderate chroma, never neon. The cap drops from Day to Night. |
| Neutral chroma | ≤ 0.02 | Neutrals read as neutral. |
| White point | 4500–6500 K, \|Duv\| ≤ 0.006 | Warm-neutral whites with no cast; see [Variants](#variants). |
| Chromostereopsis | warn when roughly opposite syntax hues both exceed chroma 0.12 | Saturated red next to saturated blue can appear at different depths ([§4](research.md#4-colored-text-chromatic-aberration-and-chromostereopsis)). No variant triggers the warning. |
| Banned colors | `#000000`, `#ffffff` | Pure black and pure white give the harshest contrast, and avoiding them is one of the halation guards, a design hypothesis ([§3](research.md#3-pupils-optics-and-halation)). Checked in every color, overlays included. |

## Hue families

| Family | Name | Hue | Band | Syntax | UI roles |
|---|---|--:|--:|---|---|
| red | Ember | 27° | ±14° | invalid, deleted | error, removed, test failed |
| orange | Clay | 60° | ±12° | constants | — |
| yellow | Macula | 108° | ±17° | definitions | cursor, accent, warning |
| green | Fern | 155° | ±17° | strings | renamed |
| teal | Lagoon | 210° | ±15° | types, inserted | success, added, untracked, test passed |
| blue | Cornflower | 250° | ±12° | — | link, info, modified, focus |
| violet | Iris | 280° | ±12° | keywords | — |
| pink | Heather | 335° | ±18° | escapes | conflict |

A role keeps its family in every variant, so switching variants never changes meaning; only lightness and chroma adapt. The bands don't overlap, so every tone belongs to exactly one family (`identity.test.ts`).

**How the syntax hues were spaced.** A branch-and-bound search tried every combination of hues, in 5° steps, inside a band for each syntax class: keywords 270–305°, types 185–225°, strings 130–165°, definitions 85–110°, constants 40–65° and escapes 330–365°. Each candidate color was solved at its tier's contrast and chroma cap in all three variants, and the search kept the combination that maximized the smallest ΔE_OK between any two syntax colors across the variants. It returned keywords 280°, types 210°, strings 155°, definitions 110°, constants 60° and escapes 335°. Finer runs later settled definitions at 108°.

**Where red sits.** Red was placed afterwards. Leaning it toward coral separates error from success under CVD simulation, but brings invalid code closer to the orange constants. Measured with the shipped lightness targets:

| Red hue | Dusk: invalid vs constant | Dusk: error vs success, worst CVD case | Night: invalid vs constant | Night: error vs success, worst CVD case |
|--:|--:|--:|--:|--:|
| 20° | 0.058 | 0.117 | 0.062 | 0.107 |
| 27° | 0.049 | 0.128 | 0.054 | 0.116 |
| 35° | 0.038 | 0.140 | 0.041 | 0.126 |

Fovea uses 27°, where every red–teal pair clears the 0.10 bar with the lightness offsets described under [Color-vision deficiency](#color-vision-deficiency). The cost is that invalid code sits close to constants in the dark variants (ΔE_OK 0.049 in Dusk and 0.054 in Night). That is why invalid code is also underlined, and why the 0.08 syntax rule leaves red out. In Day the two are 0.114 apart.

**Hue adjustments inside a family.**

- **Day's definitions** sit 12° below the yellow base hue, at 96°. At reading contrast on paper, lemon turns olive; a gold in the same family still reads as yellow.
- **Warnings** use the same kind of gold: the yellow family's UI tones sit 14° below the base hue.
- **The diff pair** leans apart: inserted text sits 8° toward cyan, deleted text 5° toward coral. That keeps them apart under deuteranopia, where they rely on the blue–yellow axis.

## Chroma

**Caps.** Day 0.15, Dusk 0.12 and Night 0.10 ([decision 003](decisions/003-night-chroma-cap.md)). Within that, the blue and violet families get less chroma than the cap allows (Day 0.13, Dusk 0.09, Night 0.07), because saturated blue text was rated hardest to read ([§4](research.md#4-colored-text-chromatic-aberration-and-chromostereopsis)). Night restrains its blues and cyans most.

**What sRGB allows.** The brief predicted pastel accents on dark backgrounds. The table shows the highest chroma each family's hue can reach inside sRGB at Lc 75, the syntax floor:

| Family (hue) | Day | Dusk | Night |
|---|--:|--:|--:|
| red (27°) | 0.200 | 0.077 | 0.080 |
| orange (60°) | 0.116 | 0.097 | 0.101 |
| yellow (108°) | 0.104 | 0.182 | 0.181 |
| green (155°) | 0.115 | 0.203 | 0.203 |
| teal (210°) | 0.082 | 0.144 | 0.143 |
| blue (250°) | 0.138 | 0.078 | 0.081 |
| violet (280°) | 0.283 | 0.074 | 0.077 |
| pink (335°) | 0.222 | 0.108 | 0.114 |

On the dark backgrounds, the brief's estimate of 0.06–0.08 holds for red and blue, and for violet too; pink reaches about 0.11 and orange about 0.10. Yellow, green and teal can be both light and saturated. On Day's paper the limits flip: teal, yellow, green and orange are the constrained hues, which is why Day's definitions, at Lc 88, reach only 0.075.

**Two tiers.** Keywords and types are the two most frequent highlighted classes, so they use a lower chroma (Day 0.09, Dusk 0.08, Night 0.075) and the colors seen most often are the calmest. Strings, definitions, constants and escapes use the variant's cap, or less where sRGB stops them. Shipped values per variant are in the [frequency report](generated/token-frequency.md#accent-roles-most-frequent-first).

## Syntax

The mapping follows §4.6 of the brief. Each class has one color, and the TextMate rules that implement it are in [`scopes.ts`](../packages/palette/src/scopes.ts).

| Class | Color | What it covers |
|---|---|---|
| plain | text color | Variables, parameters, properties, function and method calls, operators, argument labels, interpolated code |
| punctuation | `fg.subtle` | Brackets, delimiters, separators, type-annotation colons, Markdown setext underlines |
| comment | `fg.subtle` | Comments, doc comments and their tags, Python docstrings |
| keyword | violet, quiet | Keywords, storage modifiers, word operators (`new`, `typeof`, `and`), `this` and `self`, decorators, diff headers, markup tags |
| string | green | Strings and their quotes, character literals, inline code in Markdown |
| escape | pink | Escapes, format placeholders, interpolation delimiters, regular expressions |
| constant | orange | Numbers, booleans, `null`, built-in and enum constants, units |
| definition | yellow, stronger tier | Function, class and type names where they are declared, Markdown headings (bold) |
| type | teal, quiet | Type references and built-in types, keys in JSON, YAML, TOML and CSS, attribute names, links (underlined) |
| invalid | red, underlined | Invalid code. Deprecated code isn't an error: it keeps the text color (deprecated markup tags keep the keyword color) and is struck through |
| inserted, deleted | teal / red | Added and removed lines in diffs |

Some choices need a word of explanation:

- **Calls stay plain; declarations get yellow.** A function is colored where it is defined, not wherever it is used, so the yellow marks structure instead of covering the screen.
- **Only real constants are orange.** TypeScript scopes every `const`-declared name as a constant; those stay plain, while enum members and literals are orange.
- **Keys are types, not strings.** In data files the keys give the structure, and values are usually strings, so keys and values need different colors.
- **Escapes get their own hue**, pink, instead of a variant of the string green ([decision 010](decisions/010-escape-hue.md)).

**Tiers.** Keywords, strings, escapes, constants and types share one contrast (Day Lc 78, Dusk 77, Night 76). Definitions sit a deliberate step higher (Day 88, Dusk 84, Night 82). In Day that means darker, and in the dark variants lighter. Invalid code and the diff pair have their own targets (see [Color-vision deficiency](#color-vision-deficiency)).

**Hues follow frequency.** [`docs/generated/token-frequency.md`](generated/token-frequency.md) tokenizes 24 fixtures and 8 files of real open-source code with Shiki and this mapping, and counts how much text each class covers. In the corpus, the order of the six accent classes by characters is keyword, string, type, definition, constant and escape. The quiet tier goes to the two most frequent by tokens (keywords and types); green, yellow and orange go to the three saturated classes that cover the most text (strings, definitions and constants); and pink goes to the rarest (escapes). The counting method is in [decision 009](decisions/009-frequency-by-characters.md), and `token-frequency.test.ts` fails the build if either property stops holding.

**Separation.** The closest syntax pair in normal vision is string/type at ΔE_OK 0.092 in Day, keyword/escape at 0.084 in Dusk and constant/definition at 0.083 in Night, all above the 0.08 bar. Under CVD simulation, several pairs merge, because the six accents share one lightness by design: in Day, 6 of the 15 pairs fall below ΔE_OK 0.05 for at least one simulated deficiency, and in Dusk and Night 9 and 10 do. The brief asks for these to be reported, not failed. Syntax color is a convenience: every token still clears the text floors, so what a reader with CVD loses is the category cue, not legibility.

**No italics.** Italic text is reserved for emphasis the author wrote in Markdown, following dyslexia guidance ([§12](research.md#12-typography)). Underline marks links and invalid code, where it is the cue that doesn't depend on hue. Users who want italic comments or keywords can add them through `editor.tokenColorCustomizations`; the [style guide](style-guide.md) shows how.

**Precedence.** In VS Code and Shiki, each scope on a token is matched separately. The rule that matches more of the scope's dot-separated parts wins (`string.regexp` beats `string`), and parent selectors such as `string variable` only break ties. A rule for an enclosing scope colors an inner scope only when no rule matches the inner one. The rules in `scopes.ts` are written with this in mind, and `token-frequency.test.ts` pins the behavior with snippets: calls versus definitions, interpolation in TypeScript and shell strings, JSDoc tags, decorators, built-in types in Go, C# and Rust, keys in JSON, YAML and CSS, Markdown structure, diff lines, and invalid and deprecated code.

**Known limitations.** Each of these comes from how a grammar scopes code, and none can be fixed from the theme without breaking another language:

- C# method declarations stay plain: the grammar scopes them the same way as calls, and calls are far more common.
- In TypeScript, only a decorator's `@` gets the keyword color; coloring the whole decorator would also color its arguments.
- Python's `@property` gets the type color, because `property` is a built-in class.
- Go package qualifiers and the name in `package main` get the type color.
- SQL's `IF` in `CREATE TABLE IF NOT EXISTS` gets the definition color, from a grammar bug.
- Scala's grammar leaves annotations such as `@main` unscoped.
- Swift's `$0` gets the keyword color.
- YAML scopes the key `on:` as a boolean, so it gets the constant color.
- Shell arguments and options stay plain.
- In Markdown setext headings, only the underline is scoped, so the heading text stays plain.
- Fenced code in Markdown is highlighted only when the editor has that language's grammar.

Semantic highlighting, which the VS Code port adds, fixes some of these where a language server provides it.

## Color-vision deficiency

**Simulation.** Each check simulates protanopia and deuteranopia with the Machado et al. 2009 matrices at full severity in linear RGB, and tritanopia with Brettel et al. 1997 ([decision 002](decisions/002-cvd-simulation.md)). Machado's tritan matrix, which approximates tritanomaly, runs as a fourth simulation, and "worst case" below means the smallest difference across all four. The difference is measured as ΔE in OKLab (ΔE_OK).

**Semantic pairs.** These 13 pairs must keep a worst-case ΔE_OK of at least 0.10 across the simulations, and must also differ in lightness by at least 0.03:

- error vs success;
- diff removed vs added, for text, line tints, text tints and gutter marks;
- git deleted vs added, and deleted vs untracked;
- test failed vs passed;
- ANSI red vs green, normal (1/2) and bright (9/10);
- warning vs error, for text and for marks;
- find match vs selection.

The worst case over all pairs is ΔE_OK 0.103 in Dusk and 0.104 in Night. In Day, every pair clears 0.10 except the diff background tints: separating them further would darken the removed-line tint enough to push comments on those lines under the overlay floor. They use a bar of 0.06 and reach 0.064 ([decision 004](decisions/004-day-diff-tints.md)).

**Red is the darker one.** At equal lightness, red and green collapse almost completely for red–green dichromats. Fovea pairs red with teal instead, and makes red the darker of the two in every variant. The offset has to go that way: people with protan CVD see red as darker, so a red that was lighter would cancel out. That is why success, added and passed tests are teal, not green, and why the diff pair has these targets:

| | Day | Dusk | Night |
|---|--:|--:|--:|
| Inserted (teal) | Lc 76 | Lc 86 | Lc 85 |
| Deleted (red) | Lc 88 | Lc 75 | Lc 75 |

In Day, a higher Lc means darker ink; in the dark variants, a lower Lc means darker text. Diff line tints follow the same rule: added lines are lighter than the background, and removed lines darker.

**Other cues.** Ports carry a cue for each meaning that doesn't depend on color: diff `+` and `−` markers, squiggle and icon shapes, the strikethrough on deprecated code and the underline on invalid code.

## Overlays

| Overlay | Hue | Notes |
|---|---|---|
| Current line | neutral | A slight lightness step, no hue |
| Selection, word highlight | a blue-gray (250°); in Day a cyan-gray (205°) | Low chroma and translucent; the inactive selection is weaker |
| Find match | amber (75°) | Darker than the background in every variant, and so different from the selection in lightness as well as hue; the pair passes the CVD check |
| Other find matches | amber (80°) | A weaker version of the find match |
| Diff lines and text | teal (210–215°) and red (30–32°) | Added lighter, removed darker; the text tint sits over the line tint |

Every syntax color, and the body text, is checked on every overlay, including overlays stacked on the current line. The lowest result is Lc 60.6 (4.5:1) in Day, for a find match on the current line, Lc 61.7 (6.5:1) in Dusk and Lc 62.4 (7.6:1) in Night, both for added-text tints. No overlay goes above alpha 0.8.

## ANSI colors

The 16 ANSI colors follow the families: 1 red, 2 green, 3 yellow, 4 blue, 5 magenta (pink family), 6 cyan (teal family), and 9–14 their bright versions.

- **Grays.** ANSI 0 is the darkest color and 15 the lightest in both polarities, as programs expect; Day doesn't invert them. ANSI 7 is a light gray and 8 a mid gray. In Day, 0 and 8 are the gray text colors. Programs that print in "white" assume a dark terminal, so that text is faint in Day, as it is in any light terminal theme.
- **Text floors.** The colors programs print as text (1–6 and 9–14, plus 7 and 15 in the dark variants or 0 and 8 in Day) need Lc 60 and 4.5:1, and red, green, yellow and blue aim for Lc 75. In Dusk and Night, ANSI red sits at Lc 60 so that it stays darker than green ([decision 008](decisions/008-ansi-red-dark-variants.md)).
- **Hues.** ANSI tones stay inside their families' bands, offset from the syntax hues where terminal convention expects it: a gold yellow (−13°), a magenta rather than pink (−15°) and a cyan rather than teal (−10°). In the dark variants, red leans 12° toward coral and green 15° toward teal, which moves the pair apart on the blue–yellow axis that red–green dichromats keep. In Dusk that lifts the pair's worst case under deuteranopia from ΔE_OK 0.094 to 0.104, over the 0.10 bar.
- **Brights** are lighter than their normal tones in every variant, and differ from them by at least ΔE_OK 0.04.

## UI roles

Ports use semantic roles from [`roles.ts`](../packages/palette/src/roles.ts), and the mapping is the same in every variant. A port uses a palette entry directly only where the app asks for a hue by name, such as terminal colors, chart series or the two sides of a merge; the [style guide](style-guide.md#where-ports-use-hues-directly) lists those uses.

- **Text:** `text.strong` down to `text.faint`.
- **Surfaces:** at most three elevations (chrome, editor and popups) plus a neutral hover fill. There are no large saturated areas.
- **Interaction:** the cursor and the accent color are yellow, links and focus rings blue.
- **Diagnostics:** error, warning, info and hint, each with a text tone, a mark tone for squiggles, gutters and icons, and a background tint.
- **Version control and tests:** added, removed, modified, renamed, untracked, conflict and ignored; passed, failed and skipped.
- **Overlays and syntax:** as described above.

The ports follow the brief's "sharp center, calm periphery": the editor text and the cursor get the highest contrast, while sidebars, the activity bar, the status bar and the minimap stay quiet. How each port applies the roles is in the [style guide](style-guide.md).

## Verification

`pnpm test` runs these checks on every variant:

| Test file | What it checks |
|---|---|
| `packages/palette/test/contrast.test.ts` | Every row of the contrast budget, every token on every overlay, the syntax tier spread and the ANSI aim |
| `packages/palette/test/cvd.test.ts` | The 13 semantic pairs under CVD simulation, syntax separation in normal vision, plus syntax pairs under CVD simulation and chromostereopsis risks (both reported, not failed) |
| `packages/palette/test/identity.test.ts` | Hue families and bands, ANSI meanings, the definition tier, determinism |
| `packages/palette/test/neutrals.test.ts` | Ramp order, neutral chroma, one hue per ramp, white points, emitted light |
| `packages/palette/test/gamut.test.ts` | No pure black or white, translucent overlays, gamut mapping by chroma only, chroma caps |
| `packages/palette/test/scopes.test.ts` | Scope rules: no duplicate selectors, italics only for author-written emphasis |
| `packages/build/test/token-frequency.test.ts` | Pinned scope mappings and the frequency properties the hue allocation relies on |
| `packages/build/test/palette-exports.test.ts` | The generated files: deterministic, unique paths, and free of banned colors |
| `packages/build/test/generated.test.ts` | Every generated file on disk matches what the build produces now |
| `packages/build/test/vscode.test.ts` | Workbench key coverage, opacity rules, palette-only colors, ANSI, semantic tokens, the UI and code-surface audits, Shiki rendering of every fixture, the manifest and the icon |
| `packages/build/test/terminals.test.ts` | Ghostty keys and values, the iTerm2 YAML, identical ANSI colors across ports, terminal text contrast, and `ghostty +validate-config` when Ghostty is installed |
| `packages/build/test/ansi.test.ts` | The escape-code parser behind the terminal previews |
| `packages/build/test/png.test.ts` | The PNG encoder: Node's zlib decompresses its output back to the exact pixels, and flat color compresses to a few percent of its raw size |
| `packages/build/test/report.test.ts` | The palette report pages |
| `packages/build/test/docs.test.ts` | Relative links and anchors in the Markdown docs; the README's install steps, settings, variant descriptions and website address match the build's sources, and it offers the Marketplace install only once a publisher is set |
| `packages/colorlab/test/*.test.ts` | The color math against published reference values ([research.md](research.md#reference-data-used-by-the-tests)) |

`pnpm site:build && pnpm site:test` checks the built website: only palette colors in every stylesheet, style attribute and SVG; only `--fovea-*` properties that `fovea.css` defines; internal links, assets and anchors under the base path; no third-party requests; external links only to sources recorded in the research notes; no placeholder values on any page; landmarks, titles and descriptions on every page. In CI, `pnpm site:e2e` runs axe (WCAG 2.2 A and AA) on every page in every variant, plus the variant switcher, the color-vision preview and keyboard checks.

## Decisions

| No. | Decision |
|---|---|
| [001](decisions/001-apca-via-colorjs.md) | APCA through Color.js; public material says "perceptual contrast (Lc)" |
| [002](decisions/002-cvd-simulation.md) | CVD simulation: Machado for red–green, Brettel for tritanopia |
| [003](decisions/003-night-chroma-cap.md) | Night's chroma cap is 0.10, not 0.09 |
| [004](decisions/004-day-diff-tints.md) | Day's diff background tints use a lower CVD bar |
| [005](decisions/005-variant-guidance.md) | What each variant is recommended for |
| [006](decisions/006-typescript-6.md) | TypeScript 6.0.3, not 7 |
| [007](decisions/007-git-history.md) | The maintainer manages the git history |
| [008](decisions/008-ansi-red-dark-variants.md) | ANSI red stays below the Lc 75 aim in the dark variants |
| [009](decisions/009-frequency-by-characters.md) | Syntax hues follow character counts, not token counts |
| [010](decisions/010-escape-hue.md) | Escapes get their own hue |
| [011](decisions/011-generated-previews.md) | Generated previews instead of screenshots |
| [012](decisions/012-vsce-through-dlx.md) | vsce and ovsx run through `pnpm dlx` |
| [013](decisions/013-ghostty-1-3.md) | The Ghostty themes require Ghostty 1.3 |
| [014](decisions/014-website-scope.md) | What the website does and doesn't simulate |
| [015](decisions/015-marketplace-token-retirement.md) | Marketplace publishing keeps `VSCE_PAT`, which stops working on 1 December 2026 |
| [016](decisions/016-home-page-principle-cards.md) | The home page leaves the principles to the science page |
