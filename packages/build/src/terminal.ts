import type { Hex } from "@fovea/colorlab";
import { role, type Variant } from "@fovea/palette";

/**
 * The colors every terminal port sets, as listed in docs/style-guide.md ("Terminals"). Terminals
 * can't blend, so the overlays use their composited surfaces, and text on them uses `text`.
 */
export interface TerminalColors {
  readonly background: Hex;
  readonly foreground: Hex;
  readonly cursor: Hex;
  readonly cursorText: Hex;
  readonly selection: Hex;
  readonly selectionText: Hex;
  /** Search matches other than the current one. */
  readonly match: Hex;
  readonly matchText: Hex;
  readonly currentMatch: Hex;
  readonly currentMatchText: Hex;
  readonly divider: Hex;
  readonly ansi: readonly Hex[];
}

export const terminalColors = (v: Variant): TerminalColors => ({
  background: role(v, "surface.editor"),
  foreground: role(v, "text"),
  cursor: role(v, "cursor"),
  cursorText: role(v, "surface.editor"),
  selection: v.overlay.selection.surface,
  selectionText: role(v, "text"),
  match: v.overlay["find.other"].surface,
  matchText: role(v, "text"),
  currentMatch: v.overlay["find.match"].surface,
  currentMatchText: role(v, "text"),
  divider: role(v, "border"),
  ansi: v.ansi,
});

/** Text-on-background pairs a terminal port draws, for the contrast tests. */
export const terminalTextPairs = (
  c: TerminalColors,
): readonly { readonly label: string; readonly text: Hex; readonly on: Hex }[] => [
  { label: "foreground on background", text: c.foreground, on: c.background },
  { label: "cursor text on cursor", text: c.cursorText, on: c.cursor },
  { label: "selected text on selection", text: c.selectionText, on: c.selection },
  { label: "match text on match", text: c.matchText, on: c.match },
  { label: "current match text on current match", text: c.currentMatchText, on: c.currentMatch },
];
