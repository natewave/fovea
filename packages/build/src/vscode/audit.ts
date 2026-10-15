import { apcaLc, flatten, type Hex, wcagContrast } from "@fovea/colorlab";
import { type Band, budget, type Variant } from "@fovea/palette";
import { type BudgetRow, meets, tokenColors } from "@fovea/palette/audit";

/** Theme keys from the bottom layer up; translucent layers are flattened onto the ones below. */
export type Stack = readonly string[];

export interface UiPair {
  readonly label: string;
  readonly text: string;
  readonly on: Stack;
  readonly row: Exclude<BudgetRow, "ansiBrightBlackDark">;
}

const pair = (label: string, text: string, on: Stack | string, row: UiPair["row"]): UiPair => ({
  label,
  text,
  on: typeof on === "string" ? [on] : on,
  row,
});

/** Text and marks in the workbench, each with the surface VS Code paints it on. */
export const uiPairs: readonly UiPair[] = [
  pair("Editor text", "editor.foreground", "editor.background", "primaryText"),
  pair("Active line number", "editorLineNumber.activeForeground", "editor.background", "active"),
  pair("Line numbers", "editorLineNumber.foreground", "editor.background", "secondary"),
  pair("Cursor", "editorCursor.foreground", "editor.background", "cursor"),
  pair(
    "Inlay hints",
    "editorInlayHint.foreground",
    ["editor.background", "editorInlayHint.background"],
    "secondary",
  ),
  pair("Ghost text", "editorGhostText.foreground", "editor.background", "secondary"),
  pair("Code lens", "editorCodeLens.foreground", "editor.background", "secondary"),
  pair("Git blame", "git.blame.editorDecorationForeground", "editor.background", "secondary"),
  pair("Folded text", "editor.foldPlaceholderForeground", "editor.background", "secondary"),
  pair("Placeholder", "editor.placeholder.foreground", "editor.background", "placeholder"),
  pair("Error squiggle", "editorError.foreground", "editor.background", "uiComponent"),
  pair("Warning squiggle", "editorWarning.foreground", "editor.background", "uiComponent"),
  pair("Info squiggle", "editorInfo.foreground", "editor.background", "uiComponent"),
  pair("Gutter: added", "editorGutter.addedBackground", "editorGutter.background", "uiComponent"),
  pair(
    "Gutter: modified",
    "editorGutter.modifiedBackground",
    "editorGutter.background",
    "uiComponent",
  ),
  pair(
    "Gutter: deleted",
    "editorGutter.deletedBackground",
    "editorGutter.background",
    "uiComponent",
  ),
  pair("Bracket match", "editorBracketMatch.border", "editor.background", "uiComponent"),
  pair(
    "Find match border",
    "editor.findMatchBorder",
    ["editor.background", "editor.findMatchBackground"],
    "uiComponent",
  ),
  pair("Indent guides", "editorIndentGuide.background1", "editor.background", "decorative"),
  pair("Whitespace", "editorWhitespace.foreground", "editor.background", "decorative"),
  pair("Rulers", "editorRuler.foreground", "editor.background", "decorative"),
  pair("Active tab title", "tab.activeForeground", "tab.activeBackground", "active"),
  pair("Inactive tab title", "tab.inactiveForeground", "tab.inactiveBackground", "secondary"),
  pair("Active tab line", "tab.activeBorderTop", "tab.inactiveBackground", "uiComponent"),
  pair("Breadcrumbs", "breadcrumb.foreground", "breadcrumb.background", "secondary"),
  pair("Side Bar text", "sideBar.foreground", "sideBar.background", "uiText"),
  pair("Descriptions", "descriptionForeground", "sideBar.background", "secondary"),
  pair(
    "Selected item",
    "list.activeSelectionForeground",
    ["sideBar.background", "list.activeSelectionBackground"],
    "active",
  ),
  pair(
    "Selected item, list unfocused",
    "list.inactiveSelectionForeground",
    ["sideBar.background", "list.inactiveSelectionBackground"],
    "active",
  ),
  pair(
    "Hovered item",
    "list.hoverForeground",
    ["sideBar.background", "list.hoverBackground"],
    "uiText",
  ),
  pair("Filter matches", "list.highlightForeground", "sideBar.background", "semanticText"),
  pair("Git: added", "gitDecoration.addedResourceForeground", "sideBar.background", "semanticText"),
  pair(
    "Git: modified",
    "gitDecoration.modifiedResourceForeground",
    "sideBar.background",
    "semanticText",
  ),
  pair(
    "Git: deleted",
    "gitDecoration.deletedResourceForeground",
    "sideBar.background",
    "semanticText",
  ),
  pair(
    "Git: renamed",
    "gitDecoration.renamedResourceForeground",
    "sideBar.background",
    "semanticText",
  ),
  pair(
    "Git: conflict",
    "gitDecoration.conflictingResourceForeground",
    "sideBar.background",
    "semanticText",
  ),
  pair(
    "Git: ignored",
    "gitDecoration.ignoredResourceForeground",
    "sideBar.background",
    "placeholder",
  ),
  pair("Activity Bar icon", "activityBar.foreground", "activityBar.background", "uiComponent"),
  pair(
    "Activity Bar icon, inactive",
    "activityBar.inactiveForeground",
    "activityBar.background",
    "uiComponent",
  ),
  pair(
    "Activity Bar indicator",
    "activityBar.activeBorder",
    "activityBar.background",
    "uiComponent",
  ),
  pair("Badge", "activityBarBadge.foreground", "activityBarBadge.background", "semanticText"),
  pair(
    "Warning badge",
    "activityWarningBadge.foreground",
    "activityWarningBadge.background",
    "semanticText",
  ),
  pair(
    "Error badge",
    "activityErrorBadge.foreground",
    "activityErrorBadge.background",
    "semanticText",
  ),
  pair("Count badge", "badge.foreground", "badge.background", "uiText"),
  pair("Status Bar", "statusBar.foreground", "statusBar.background", "uiText"),
  pair(
    "Status Bar, debugging",
    "statusBar.debuggingForeground",
    "statusBar.debuggingBackground",
    "uiText",
  ),
  pair(
    "Status Bar error item",
    "statusBarItem.errorForeground",
    "statusBarItem.errorBackground",
    "semanticText",
  ),
  pair(
    "Status Bar warning item",
    "statusBarItem.warningForeground",
    "statusBarItem.warningBackground",
    "semanticText",
  ),
  pair("Title Bar", "titleBar.activeForeground", "titleBar.activeBackground", "uiText"),
  pair(
    "Title Bar, window inactive",
    "titleBar.inactiveForeground",
    "titleBar.inactiveBackground",
    "secondary",
  ),
  pair("Panel title", "panelTitle.activeForeground", "panel.background", "active"),
  pair("Panel title, inactive", "panelTitle.inactiveForeground", "panel.background", "secondary"),
  pair("Focus outline on chrome", "focusBorder", "sideBar.background", "uiComponent"),
  pair("Focus outline on editor", "focusBorder", "editor.background", "uiComponent"),
  pair("Input text", "input.foreground", "input.background", "primaryText"),
  pair("Input placeholder", "input.placeholderForeground", "input.background", "placeholder"),
  pair("Input border", "input.border", "sideBar.background", "uiComponent"),
  pair("Primary button", "button.foreground", "button.background", "uiText"),
  pair("Primary button border", "button.border", "sideBar.background", "uiComponent"),
  pair("Secondary button", "button.secondaryForeground", "button.secondaryBackground", "uiText"),
  pair("Secondary button border", "button.secondaryBorder", "sideBar.background", "uiComponent"),
  pair("Menu", "menu.foreground", "menu.background", "primaryText"),
  pair(
    "Menu, selected item",
    "menu.selectionForeground",
    ["menu.background", "menu.selectionBackground"],
    "active",
  ),
  pair("Quick input", "quickInput.foreground", "quickInput.background", "primaryText"),
  pair(
    "Quick input, focused item",
    "quickInputList.focusForeground",
    ["quickInput.background", "quickInputList.focusBackground"],
    "active",
  ),
  pair(
    "Suggestions",
    "editorSuggestWidget.foreground",
    "editorSuggestWidget.background",
    "primaryText",
  ),
  pair(
    "Suggestions, selected",
    "editorSuggestWidget.selectedForeground",
    ["editorSuggestWidget.background", "editorSuggestWidget.selectedBackground"],
    "active",
  ),
  pair(
    "Suggestion matches",
    "editorSuggestWidget.highlightForeground",
    "editorSuggestWidget.background",
    "semanticText",
  ),
  pair("Hover", "editorHoverWidget.foreground", "editorHoverWidget.background", "primaryText"),
  pair("Notifications", "notifications.foreground", "notifications.background", "primaryText"),
  pair("Peek title", "peekViewTitleLabel.foreground", "peekViewTitle.background", "primaryText"),
  pair("Terminal text", "terminal.foreground", "terminal.background", "primaryText"),
  pair(
    "Validation: error",
    "inputValidation.errorForeground",
    "inputValidation.errorBackground",
    "uiText",
  ),
  pair(
    "Validation: warning",
    "inputValidation.warningForeground",
    "inputValidation.warningBackground",
    "uiText",
  ),
  pair(
    "Validation: info",
    "inputValidation.infoForeground",
    "inputValidation.infoBackground",
    "uiText",
  ),
  pair("Banner", "banner.foreground", "banner.background", "uiText"),
  pair(
    "Exception label",
    "debugView.exceptionLabelForeground",
    "debugView.exceptionLabelBackground",
    "semanticText",
  ),
  pair(
    "Test failure badge",
    "testing.message.error.badgeForeground",
    "testing.message.error.badgeBackground",
    "semanticText",
  ),
  pair(
    "Slash command",
    "chat.slashCommandForeground",
    "chat.slashCommandBackground",
    "semanticText",
  ),
  pair(
    "Keybinding label",
    "keybindingLabel.foreground",
    ["editorHoverWidget.background", "keybindingLabel.background"],
    "uiText",
  ),
];

/**
 * Backgrounds that code sits on, besides the palette overlays the palette audit already covers.
 * Every token color must keep the token-on-highlight floor on each of them.
 */
export const codeSurfaces: readonly Stack[] = [
  ["editor.background", "editor.findRangeHighlightBackground"],
  ["editor.background", "editor.rangeHighlightBackground"],
  ["editor.background", "editor.symbolHighlightBackground"],
  ["editor.background", "editor.hoverHighlightBackground"],
  ["editor.background", "editor.linkedEditingBackground"],
  ["editor.background", "editor.foldBackground"],
  ["editor.background", "editor.snippetTabstopHighlightBackground"],
  ["editor.background", "editor.stackFrameHighlightBackground"],
  ["editor.background", "editor.focusedStackFrameHighlightBackground"],
  ["editor.background", "editorCommentsWidget.rangeBackground"],
  ["editor.background", "editorCommentsWidget.rangeActiveBackground"],
  ["editor.background", "editorStickyScrollHover.background"],
  ["editor.background", "peekViewEditor.matchHighlightBackground"],
  ["editor.background", "merge.currentHeaderBackground"],
  ["editor.background", "merge.currentContentBackground"],
  ["editor.background", "merge.incomingHeaderBackground"],
  ["editor.background", "merge.incomingContentBackground"],
  ["editor.background", "merge.commonHeaderBackground"],
  ["editor.background", "merge.commonContentBackground"],
  ["editor.background", "mergeEditor.change.background"],
  ["editor.background", "mergeEditor.change.background", "mergeEditor.change.word.background"],
  ["editor.background", "mergeEditor.changeBase.background"],
  [
    "editor.background",
    "mergeEditor.changeBase.background",
    "mergeEditor.changeBase.word.background",
  ],
  ["editor.background", "mergeEditor.conflict.input1.background"],
  ["editor.background", "mergeEditor.conflict.input2.background"],
  ["editor.background", "inlineEdit.originalBackground"],
  ["editor.background", "inlineEdit.modifiedBackground"],
  [
    "editor.background",
    "inlineEdit.originalChangedLineBackground",
    "inlineEdit.originalChangedTextBackground",
  ],
  [
    "editor.background",
    "inlineEdit.modifiedChangedLineBackground",
    "inlineEdit.modifiedChangedTextBackground",
  ],
  ["editor.background", "testing.message.error.lineBackground"],
  ["editor.background", "testing.message.info.lineBackground"],
  ["editor.background", "testing.coveredBackground"],
  ["editor.background", "testing.uncoveredBackground"],
  ["editor.background", "testing.uncoveredBackground", "testing.uncoveredBranchBackground"],
  ["inlineChatInput.background", "inlineChatDiff.inserted"],
  ["inlineChatInput.background", "inlineChatDiff.removed"],
  ["editorHoverWidget.background", "textCodeBlock.background"],
];

const colorOf = (colors: Readonly<Record<string, Hex>>, key: string): Hex => {
  const hex = colors[key];
  if (hex === undefined) throw new Error(`The theme doesn't set ${key}`);
  return hex;
};

/** A stack of keys flattened into the opaque color VS Code shows. */
export const surfaceOf = (colors: Readonly<Record<string, Hex>>, stack: Stack): Hex => {
  const [bottom, ...layers] = stack;
  if (bottom === undefined) throw new Error("Empty surface stack");
  return layers.reduce<Hex>(
    (under, key) => flatten(colorOf(colors, key), under),
    colorOf(colors, bottom),
  );
};

export interface UiCheck {
  readonly pair: UiPair;
  readonly text: Hex;
  readonly surface: Hex;
  readonly lc: number;
  readonly wcag: number;
  readonly band: Band;
  readonly pass: boolean;
}

export const uiChecks = (v: Variant, colors: Readonly<Record<string, Hex>>): readonly UiCheck[] =>
  uiPairs.map((p) => {
    const surface = surfaceOf(colors, p.on);
    const text = flatten(colorOf(colors, p.text), surface);
    const lc = apcaLc({ text, surface });
    const wcag = wcagContrast(text, surface);
    const band = budget[p.row][v.id];
    return { pair: p, text, surface, lc, wcag, band, pass: meets(lc, wcag, band) };
  });

export interface CodeSurfaceCheck {
  readonly stack: Stack;
  readonly surface: Hex;
  /** The token color with the lowest contrast on this surface. */
  readonly weakest: string;
  readonly lc: number;
  readonly wcag: number;
  readonly pass: boolean;
}

export const codeSurfaceChecks = (
  v: Variant,
  colors: Readonly<Record<string, Hex>>,
): readonly CodeSurfaceCheck[] =>
  codeSurfaces.map((stack) => {
    const surface = surfaceOf(colors, stack);
    const measured = tokenColors(v)
      .map(([label, text]) => ({
        label,
        lc: apcaLc({ text, surface }),
        wcag: wcagContrast(text, surface),
      }))
      .toSorted((a, b) => a.lc - b.lc);
    const lowestWcag = Math.min(...measured.map((m) => m.wcag));
    const weakest = measured[0] ?? { label: "", lc: 0, wcag: 0 };
    const band = budget.onOverlay[v.id];
    return {
      stack,
      surface,
      weakest: weakest.label,
      lc: weakest.lc,
      wcag: lowestWcag,
      pass: measured.every((m) => meets(m.lc, m.wcag, band)),
    };
  });
