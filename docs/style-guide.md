# Style guide

This guide is for anyone porting Fovea to a new app or changing an existing port. [design.md](design.md) explains why the palette looks the way it does; this page explains how to apply it so a new port looks and behaves like the others.

## Sources of truth

Never copy hex values by hand. Every port is generated from the palette in `packages/palette`, so a tuned color reaches every port in one build.

| File | What it holds |
|---|---|
| [`ports/palette/fovea.json`](../ports/palette/fovea.json) | Every variant: neutrals, accent tones, syntax colors, ANSI colors, overlays (translucent and composited) and roles, as hex |
| [`ports/palette/fovea.css`](../ports/palette/fovea.css) | The same values as `--fovea-*` custom properties, switched by `data-theme` or by the system's light or dark preference |
| [`docs/generated/roles.md`](generated/roles.md) | Every role, the palette entry it points to, and its value in each variant |

A port inside this repository is a generator in `packages/build` plus tests; [CONTRIBUTING](../CONTRIBUTING.md#adding-a-port) lists the steps.

## Map to roles, not hues

Roles carry meaning: `error`, `surface.popup`, `syntax.string`. Map each color the app exposes to the role that matches its meaning, and the port stays correct when the palette is tuned or a variant is added.

### Surfaces

There are three elevations and one fill. The periphery sits one step below the reading surface, and popups one step above it.

| Role | Use it for |
|---|---|
| `surface.chrome` | Side bars, panels, title, status and activity bars, inactive tabs, terminal panels inside an editor |
| `surface.editor` | The reading surface: editor, active tab, terminal background, document body |
| `surface.popup` | Menus, hovers, suggestion lists, dialogs, notifications, command palettes |
| `surface.hover` | Hovered and pressed rows, inactive selections in lists |
| `border` | Dividers between areas |
| `border.strong` | Outlines that identify a control (inputs, checkboxes, secondary buttons); these meet 3:1 |

Avoid large areas of saturated color. Status bars, title bars and activity bars stay neutral in every variant, apart from a pale yellow status bar while debugging; Fovea keeps hue for small marks.

### Text

| Role | Use it for |
|---|---|
| `text.strong` | Headings, the active item, emphasis that needs weight |
| `text` | Body text and code |
| `text.subtle` | Secondary text, descriptions, comments |
| `text.muted` | Placeholders, line numbers, inactive tabs, hints |
| `text.faint` | Disabled controls and decoration only; never information the reader needs |

### Interaction and status

- `cursor` (yellow) is the brightest mark in each variant; give it to the text cursor only.
- `accent` (yellow) marks the active place: the active tab's top border, the active view indicator, badges.
- `focus` (blue) draws focus rings, and `link` (blue) colors links.
- `action.bg` fills primary buttons and toggled options; text on it uses `text`.
- Diagnostics each have three tones: a text tone (`error`), a mark tone for squiggles, gutter bars and icons (`error.mark`), and a background tint (`error.bg`). Warnings, info and hints follow the same pattern.
- Version control uses `added`, `removed`, `modified`, `renamed`, `untracked`, `conflict` and `ignored`, with `.mark` tones for gutters. Success and additions are teal, not green: red against teal stays distinguishable for most people with red–green color-vision deficiency ([design.md](design.md#color-vision-deficiency)).

### Overlays

Selections, find results, the current line and diff tints are translucent overlay roles (`#rrggbbaa`), drawn over the text's background so that the text keeps its color. Apps differ:

- If the app blends colors (VS Code, browsers), use the translucent value. VS Code requires several of these to be translucent so they don't hide other decorations.
- If the app needs an opaque color (most terminals), use the overlay's composited `surface` from `fovea.json`.
- If the app lets you set the text color on a selection, prefer leaving it unset so text keeps its syntax color. Where the app requires one, use `text`.

Every syntax color and the body text are checked on every overlay, including overlays stacked on the current line, so any combination above is safe.

### Where ports use hues directly

A port uses a raw palette entry (such as `teal.tint` or `ansi.1`) only where the app asks for a color by hue rather than by meaning. In the VS Code port:

- the 16 terminal ANSI colors, which come from the palette's `ansi` list;
- chart series (`charts.red`, `charts.blue` and so on), which use the matching family's `fg` tone;
- the two sides of a merge conflict, teal for the current change and violet for the incoming one;
- the source-control graph's lanes, which use `dim` tones in five families;
- tinted hover and debugging backgrounds, which use a family's `tint` tones.

Everything else in the port goes through a role. Keep that ratio in new ports.

## Rules every port follows

- **No pure black or white.** `#000000` and `#ffffff` never appear in a generated file; the tests scan every output.
- **sRGB only.** Fovea has no wide-gamut variant. Where the app has a color-space setting (Ghostty's `window-colorspace`), the port's README recommends sRGB.
- **Meaning never depends on hue alone.** Pair color with a second cue: an icon, a squiggle or underline, a `+` or `−` sign, a position, or a lightness difference. Pairs that carry meaning, such as error and success, removed and added, or warning and error, are checked under simulated color-vision deficiency ([design.md](design.md#color-vision-deficiency)).
- **Contrast meets the budget.** Body text, quiet text, syntax colors, UI components and marks each have a floor in [`budget.ts`](../packages/palette/src/budget.ts), measured both as perceptual contrast (Lc) and as a WCAG ratio. A port's tests check every text color against the surfaces it appears on, after compositing any overlay.
- **No italics by default.** Fovea uses no italics in code or the interface, following the British Dyslexia Association's advice ([research.md](research.md#evidence-table)). Italic text appears only where the author wrote emphasis, such as `*emphasis*` in Markdown. Underline marks links and invalid code; strikethrough marks deprecated symbols. Bold marks headings and strong emphasis.
- **Generated files are never edited by hand.** CI regenerates every file and fails if anything differs.

## Terminals

A terminal port maps:

| Terminal color | Role or entry |
|---|---|
| Background | `surface.editor` |
| Foreground | `text` |
| Cursor | `cursor`, with `surface.editor` for the text under it |
| Selection | the `overlay.selection` surface, with `text` on it |
| Search matches | the `overlay.find.other` surface; the current match uses `overlay.find` |
| Split dividers | `border` |
| ANSI 0–15 | the palette's `ansi` list, unchanged |

The ANSI colors must be identical in every port; the tests compare VS Code's integrated terminal, Ghostty and the iTerm2-Color-Schemes files. ANSI 0 stays the darkest color and 15 the lightest, as programs expect, so text a program prints in "white" is faint in Day, as in any light terminal theme ([design.md](design.md#ansi-colors)).

Leave automatic contrast adjustment off, since Fovea's terminal colors already meet the budget. Ghostty's `minimum-contrast` defaults to 1, which changes nothing; Ghostty's built-in documentation notes that higher values make text more likely to become black or white (`ghostty +show-config --default --docs`). The iTerm2-Color-Schemes files set `wcag_adjust: false` so the collection's generator keeps Fovea's values.

## User options

Some changes are better left to users than built into a port. Document them in the port's README:

- **Italic comments.** In VS Code, a rule that sets only a font style keeps Fovea's colors:

  ```json
  {
    "editor.tokenColorCustomizations": {
      "[Fovea*]": {
        "textMateRules": [
          {
            "scope": ["comment", "punctuation.definition.comment"],
            "settings": { "fontStyle": "italic" }
          }
        ]
      }
    }
  }
  ```

- **Bracket pair colors.** Brackets are punctuation, so Fovea draws every nesting level in `syntax.punctuation` rather than adding six more hues. Setting each `editorBracketHighlight.foregroundN` to `"default"` inside a `[Fovea*]` block of `workbench.colorCustomizations` brings back VS Code's own bracket colors, which aren't Fovea colors and aren't part of the contrast checks.
- **Following the system.** Pair Day with Dusk (or Night) so the app switches with the operating system's light and dark setting. VS Code reads `window.autoDetectColorScheme` with `workbench.preferredLightColorTheme` and `workbench.preferredDarkColorTheme` ([VS Code docs](https://code.visualstudio.com/docs/configure/themes#_automatically-switch-based-on-os-color-scheme)); Ghostty reads `theme = light:Fovea Day,dark:Fovea Dusk`.

## Choosing a variant

The variant descriptions come from [decision 005](decisions/005-variant-guidance.md). Use them wherever a port lists its variants:

- **Day:** ink on warm paper. The most legible variant for long reading, and the natural match for bright rooms and daylight.
- **Dusk:** soft light on warm graphite, for dim rooms, evenings and anyone who prefers dark mode.
- **Night:** Dusk dimmed for dark rooms and late hours: the least light that still meets body-text minimums.

Don't claim more than this. No variant prevents eye strain or improves sleep; [research.md](research.md) explains what the evidence does and doesn't support.
