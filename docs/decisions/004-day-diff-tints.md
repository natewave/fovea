# 004. Day's diff background tints use a lower CVD bar

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

The brief (§4.5) requires every semantic pair, including the diff removed/added background tints, to keep a worst-case ΔE_OK of at least 0.10 under CVD simulation and to differ in lightness. It also requires every token color to keep Lc ≥ 60 and 4.5:1 on any overlay, diff backgrounds included (§4.3).

On Day's light paper the two rules collide. To separate under deuteranopia, the removed tint has to be noticeably darker than the added one, and a darker tint pulls the quietest tokens (comments, at Lc 60–75 on plain paper) under the overlay floor. A search over opaque tint pairs (removed hues 17–45, added hues 170–260, every lightness and chroma step inside sRGB), keeping every token at Lc ≥ 60 and 4.5:1, found a best case of 0.094. That is below 0.10 before the real constraints are added: VS Code's theme reference says some colors "should not be opaque in order to not cover other annotations", so Fovea's diff tints are translucent, and word-level tints stack on line tints.

## Options

1. **Darken the tints anyway.** Comments on removed lines would fall below the token floor.
2. **Raise comment contrast everywhere in Day.** Comments would leave the quiet tier (Lc 60–75) and compete with code.
3. **Lower the bar for Day's diff tints only,** and rely on cues that don't depend on color.

## Decision

Option 3. Day's diff tint pair must reach ΔE_OK 0.06 (`diffTintCvdDeltaE.day` in `budget.ts`). Dusk and Night keep 0.10. The shipped Day tints reach 0.064 (line) and 0.068 (word), and differ in lightness by 0.061 and 0.053.

## Consequences

Removed and added lines in Day stay distinguishable through cues that hold up under CVD:

- the diff text colors and gutter markers, which pass the full 0.10 bar (0.160 and 0.168);
- lightness order: added is always lighter than removed;
- the `+` and `−` indicators that VS Code's diff editor draws beside changed lines. The `diffEditor.renderIndicators` setting shows them by default, but VS Code's agents window turns them off by default ([settings schema](https://github.com/microsoft/vscode/blob/main/src/vs/editor/common/config/editorConfigurationSchema.ts), [diff editor defaults](https://github.com/microsoft/vscode/blob/main/src/vs/editor/common/config/diffEditor.ts)). Users who review diffs there can turn the setting back on.
