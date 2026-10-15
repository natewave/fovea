import { flatten, type Hex } from "@fovea/colorlab";
import { role, type Variant } from "@fovea/palette";
import type { AnsiLines, AnsiSpan } from "../ansi.ts";
import type { RoleLines } from "../token-frequency.ts";
import { esc, style, type View } from "./html.ts";

/** Shiki's font style bit flags. */
const ITALIC = 1;
const BOLD = 2;
const UNDERLINE = 4;
const STRIKETHROUGH = 8;

/**
 * A decorated range in one line. `bg` may be translucent (`#rrggbbaa`): it is composited over the
 * line's background, as VS Code paints highlights over the current-line and diff tints.
 */
export interface Mark {
  readonly line: number;
  readonly from: number;
  readonly to: number;
  readonly bg?: Hex;
  readonly squiggle?: Hex;
}

/** Text the editor shows that is not in the file, such as inlay hints and ghost text. */
export interface Insert {
  readonly line: number;
  readonly at: number;
  readonly text: string;
  readonly color: Hex;
}

export interface GutterMark {
  readonly text: string;
  readonly color: Hex;
}

export interface CodeView {
  readonly view: View;
  /** Number of the first line; line numbers are hidden when absent. */
  readonly firstLine?: number;
  readonly activeLine?: number;
  /** Line backgrounds, composited over the editor background. */
  readonly lineBg?: ReadonlyMap<number, Hex>;
  readonly gutter?: ReadonlyMap<number, GutterMark>;
  readonly marks?: readonly Mark[];
  readonly inserts?: readonly Insert[];
  readonly cursor?: { readonly line: number; readonly at: number };
}

interface Cell {
  readonly ch: string;
  readonly color: Hex;
  readonly font: number;
  readonly bg: Hex | undefined;
  readonly squiggle: Hex | undefined;
  readonly cursor: boolean;
}

const cell = (ch: string, color: Hex, font: number): Cell => ({
  ch,
  color,
  font,
  bg: undefined,
  squiggle: undefined,
  cursor: false,
});

const sameRun = (a: Cell, b: Cell): boolean =>
  a.color === b.color &&
  a.font === b.font &&
  a.bg === b.bg &&
  a.squiggle === b.squiggle &&
  !b.cursor;

const runs = (cells: readonly Cell[]): readonly (readonly Cell[])[] => {
  const starts = cells.flatMap((c, i) => {
    const prev = cells[i - 1];
    return prev === undefined || !sameRun(prev, c) ? [i] : [];
  });
  return starts.map((start, k) => cells.slice(start, starts[k + 1] ?? cells.length));
};

const decoration = (font: number, squiggle: Hex | undefined, view: View): string | undefined => {
  if (squiggle !== undefined) return `underline wavy ${view(squiggle)} 1px`;
  const lines = [font & UNDERLINE ? "underline" : "", font & STRIKETHROUGH ? "line-through" : ""];
  const value = lines.filter((l) => l !== "").join(" ");
  return value === "" ? undefined : value;
};

const runHtml = (run: readonly Cell[], view: View, cursor: Hex): string => {
  const [head] = run;
  if (head === undefined) return "";
  const css = style({
    color: view(head.color),
    background: head.bg === undefined ? undefined : view(head.bg),
    "font-style": head.font & ITALIC ? "italic" : undefined,
    "font-weight": head.font & BOLD ? "600" : undefined,
    "text-decoration": decoration(head.font, head.squiggle, view),
    "box-shadow": head.cursor ? `inset 2px 0 0 ${view(cursor)}` : undefined,
  });
  return `<span style="${css}">${esc(run.map((c) => c.ch).join(""))}</span>`;
};

const withMarks = (cells: readonly Cell[], marks: readonly Mark[], surface: Hex): readonly Cell[] =>
  cells.map((c, i) => {
    const covering = marks.filter((m) => i >= m.from && i < m.to);
    const bg = covering.reduce<Hex | undefined>(
      (under, m) => (m.bg === undefined ? under : flatten(m.bg, under ?? surface)),
      c.bg,
    );
    const squiggle = covering.reduce<Hex | undefined>((s, m) => m.squiggle ?? s, c.squiggle);
    return { ...c, bg, squiggle };
  });

const withInserts = (cells: readonly Cell[], inserts: readonly Insert[]): readonly Cell[] =>
  [...inserts]
    .sort((a, b) => b.at - a.at)
    .reduce<readonly Cell[]>(
      (acc, ins) => [
        ...acc.slice(0, ins.at),
        ...ins.text.split("").map((ch) => cell(ch, ins.color, 0)),
        ...acc.slice(ins.at),
      ],
      cells,
    );

const withCursor = (cells: readonly Cell[], at: number | undefined, plain: Hex): readonly Cell[] =>
  at === undefined
    ? cells
    : [
        ...cells.slice(0, at),
        { ...(cells[at] ?? cell(" ", plain, 0)), cursor: true },
        ...cells.slice(at + 1),
      ];

const gutterHtml = (mark: GutterMark | undefined, view: View): string =>
  mark === undefined
    ? `<span class="gut"></span>`
    : `<span class="gut" style="color:${view(mark.color)}">${esc(mark.text)}</span>`;

/** Renders tokenized code as lines, with an editor's decorations, in a variant's colors. */
export const renderCode = (lines: RoleLines, v: Variant, opts: CodeView): string => {
  const { view } = opts;
  const plain = role(v, "syntax.plain");
  const width = String((opts.firstLine ?? 1) + lines.length - 1).length;
  return lines
    .map((tokens, i) => {
      const lineBg = opts.lineBg?.get(i);
      const surface = lineBg === undefined ? v.neutral.bg : flatten(lineBg, v.neutral.bg);
      const base = tokens.flatMap((t) =>
        t.content.split("").map((ch) => cell(ch, role(v, t.role), t.fontStyle)),
      );
      const cells = withCursor(
        withInserts(
          withMarks(
            base,
            (opts.marks ?? []).filter((m) => m.line === i),
            surface,
          ),
          (opts.inserts ?? []).filter((ins) => ins.line === i),
        ),
        opts.cursor?.line === i ? opts.cursor.at : undefined,
        plain,
      );
      const text = runs(cells)
        .map((r) => runHtml(r, view, role(v, "cursor")))
        .join("");
      const gutter = opts.gutter === undefined ? "" : gutterHtml(opts.gutter.get(i), view);
      const numberColor = role(v, i === opts.activeLine ? "text" : "text.muted");
      const number =
        opts.firstLine === undefined
          ? ""
          : `<span class="no" style="color:${view(numberColor)}">${String(opts.firstLine + i).padStart(width)}</span>`;
      const lineStyle = lineBg === undefined ? "" : ` style="background:${view(surface)}"`;
      return `<div class="ln"${lineStyle}>${gutter}${number}<span class="tx">${text}</span></div>`;
    })
    .join("");
};

const ansiSpanHtml = (span: AnsiSpan, v: Variant, view: View): string => {
  const { fg, bg, bold, faint, italic, underline, inverse } = span.style;
  const color = (index: number | null, fallback: Hex): Hex =>
    index === null ? fallback : (v.ansi[index] ?? fallback);
  const foreground = color(fg, v.neutral.fg);
  const background = bg === null ? undefined : color(bg, v.neutral.bg);
  const [text, back] = inverse
    ? [background ?? v.neutral.bg, foreground]
    : [foreground, background];
  const css = style({
    color: view(text),
    background: back === undefined ? undefined : view(back),
    "font-weight": bold ? "600" : undefined,
    "font-style": italic ? "italic" : undefined,
    "text-decoration": underline ? "underline" : undefined,
    opacity: faint ? "0.5" : undefined,
  });
  return `<span style="${css}">${esc(span.text)}</span>`;
};

/** Renders terminal output with a variant's ANSI colors and default foreground. */
export const renderTerminal = (lines: AnsiLines, v: Variant, view: View): string =>
  lines
    .map(
      (spans) =>
        `<div class="ln"><span class="tx">${spans.map((s) => ansiSpanHtml(s, v, view)).join("")}</span></div>`,
    )
    .join("");
