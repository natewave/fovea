import { deltaEOK, type Hex } from "@fovea/colorlab";
import { type OverlayKey, resolveSurface, role, semanticPairs, type Variant } from "@fovea/palette";
import { SYNTAX_ACCENTS, semanticChecks } from "@fovea/palette/audit";
import type { AnsiLines } from "../ansi.ts";
import type { RoleLines } from "../token-frequency.ts";
import { type GutterMark, type Insert, type Mark, renderCode, renderTerminal } from "./code.ts";
import {
  esc,
  fixed,
  LOOK_NAMES,
  LOOKS,
  type Look,
  passMark,
  section,
  style,
  type View,
  viewFor,
} from "./html.ts";

export interface CodePreview {
  readonly name: string;
  readonly path: string;
  readonly lines: RoleLines;
}

export type DiffKind = " " | "+" | "-";

export interface TerminalPreview {
  readonly name: string;
  readonly lines: AnsiLines;
}

/** Everything the report shows besides the palette itself. */
export interface ReportData {
  /** Fixture previews, in display order. */
  readonly code: readonly CodePreview[];
  /** `fixtures/code/typescript.ts`, decorated in the editor preview. */
  readonly typescript: RoleLines;
  /** The code of a diff hunk, tokenized as TypeScript, with each line's kind. */
  readonly diff: { readonly lines: RoleLines; readonly kinds: readonly DiffKind[] };
  readonly terminal: readonly TerminalPreview[];
}

const PREVIEW_LINES = 26;
const normal = viewFor("normal");

const dropTrailingEmpty = (lines: RoleLines): RoleLines =>
  lines.at(-1)?.every((t) => t.content.trim() === "")
    ? dropTrailingEmpty(lines.slice(0, -1))
    : lines;

const panel = (
  title: string,
  meta: string,
  body: string,
  view: View,
  v: Variant,
  cls = "",
): string =>
  `<figure class="panel${cls}"><figcaption class="panel-title"><span>${esc(title)}</span><span>${esc(
    meta,
  )}</span></figcaption><div class="code" style="${style({
    background: view(v.neutral.bg),
    color: view(v.neutral.fg),
  })}">${body}</div></figure>`;

export const code = (v: Variant, data: ReportData): string =>
  section(
    "code",
    "Code",
    `Every fixture, tokenized by Shiki with the TextMate scope rules a Fovea theme uses. The first ${PREVIEW_LINES} lines are shown.`,
    `<div class="grid2">${data.code
      .map((c) =>
        panel(
          c.name,
          c.path,
          renderCode(dropTrailingEmpty(c.lines.slice(0, PREVIEW_LINES)), v, {
            view: normal,
            firstLine: 1,
          }),
          normal,
          v,
        ),
      )
      .join("")}</div>`,
  );

const textOf = (line: RoleLines[number] | undefined): string =>
  (line ?? []).map((t) => t.content).join("");

const nthIndex = (text: string, needle: string, nth: number): number =>
  Array.from({ length: nth + 1 }).reduce<number>(
    (at, _, i) => (at < 0 ? at : text.indexOf(needle, i === 0 ? 0 : at + 1)),
    0,
  );

/** The range of `needle` in a line; the previews decorate known fixture text. */
const locate = (lines: RoleLines, line: number, needle: string, nth = 0) => {
  const text = textOf(lines[line]);
  const from = nthIndex(text, needle, nth);
  if (from < 0) throw new Error(`Report preview: "${needle}" is not in line "${text}"`);
  return { line, from, to: from + needle.length };
};

const EDITOR_FIRST = 31;
const EDITOR_LAST = 50;

/** VS Code's editor, mocked: highlights, diagnostics, hints and chrome over the TypeScript fixture. */
const editorMock = (v: Variant, data: ReportData): string => {
  const lines = data.typescript.slice(EDITOR_FIRST - 1, EDITOR_LAST);
  const at = (fileLine: number, needle: string, nth = 0) =>
    locate(lines, fileLine - EDITOR_FIRST, needle, nth);
  const overlay = (k: OverlayKey): Hex => v.overlay[k].color;
  const cursorLine = 33 - EDITOR_FIRST;
  const cursor = { line: cursorLine, at: at(33, "match").to };
  const marks: readonly Mark[] = [
    { ...at(31, "hex"), bg: overlay("find.other") },
    { ...at(32, "hex"), bg: overlay("find.match") },
    { ...at(32, "match"), bg: overlay("word.strong") },
    { ...at(33, "match"), bg: overlay("word") },
    { ...at(34, "match"), bg: overlay("word") },
    { ...at(35, "(value >> 16) & 0xff"), bg: overlay("selection") },
    { ...at(38, "MAX_CHROMA"), squiggle: role(v, "info.mark") },
    { ...at(45, "raw"), squiggle: role(v, "error.mark") },
    { ...at(47, "TypeError"), squiggle: role(v, "warning.mark") },
  ];
  const muted = role(v, "text.muted");
  const inserts: readonly Insert[] = [
    { line: 34 - EDITOR_FIRST, at: at(34, "value").to, text: ": number", color: muted },
    { line: 44 - EDITOR_FIRST, at: at(44, "raw").to, text: ": string", color: muted },
    {
      line: 37 - EDITOR_FIRST,
      at: 0,
      text: "export const toHex = (rgb: readonly number[]): string =>",
      color: muted,
    },
  ];
  const bar = (r: "modified.mark" | "added.mark"): GutterMark => ({ text: "▎", color: role(v, r) });
  const gutter = new Map<number, GutterMark>([
    [38 - EDITOR_FIRST, bar("modified.mark")],
    [39 - EDITOR_FIRST, bar("modified.mark")],
    [40 - EDITOR_FIRST, bar("modified.mark")],
    [44 - EDITOR_FIRST, bar("added.mark")],
    [45 - EDITOR_FIRST, bar("added.mark")],
  ]);
  const body = renderCode(lines, v, {
    view: normal,
    firstLine: EDITOR_FIRST,
    activeLine: cursorLine,
    lineBg: new Map([[cursorLine, overlay("line.current")]]),
    gutter,
    marks,
    inserts,
    cursor,
  });
  const n = v.neutral;
  const tabs = (
    [
      ["typescript.ts", true],
      ["contrast.ts", false],
      ["README.md", false],
    ] as const
  )
    .map(
      ([name, active]) =>
        `<span class="tab" style="${style({
          background: active ? n.bg : undefined,
          color: role(v, active ? "text" : "text.muted"),
          "border-color": n.border,
          "box-shadow": active ? `inset 0 2px 0 ${role(v, "accent")}` : undefined,
        })}">${name}</span>`,
    )
    .join("");
  const find = `<div class="find" style="${style({
    background: n["bg.raised"],
    color: role(v, "text.subtle"),
    "border-color": n.border,
  })}"><span class="input" style="${style({
    background: n.bg,
    color: role(v, "text"),
    "box-shadow": `inset 0 0 0 1px ${role(v, "focus")}`,
  })}">hex</span><span style="color:${muted}">1 of 2</span><span>↑</span><span>↓</span><span>✕</span></div>`;
  const status = `<div class="statusbar" style="${style({
    background: n["bg.sunken"],
    color: muted,
    "border-color": n.border,
  })}"><span>main</span><span style="color:${role(v, "error")}">✕ 1</span><span style="color:${role(
    v,
    "warning",
  )}">⚠ 1</span><span style="color:${role(v, "info")}">ⓘ 1</span><span class="spacer"></span><span>Ln 33, Col ${
    cursor.at + 1
  }</span><span>Spaces: 2</span><span>UTF-8</span><span>TypeScript</span></div>`;
  return `<div class="editor" style="${style({ background: n.bg, "border-color": n.border })}">
<div class="tabs" style="${style({ background: n["bg.sunken"], "border-color": n.border })}">${tabs}</div>
<div class="editor-body">${find}<div class="code">${body}</div></div>${status}</div>`;
};

const DIFF_TEXT_TINTS: Readonly<Record<string, readonly string[]>> = {
  "lc >= band.min && (band.max === undefined || lc <= band.max);": [
    "lc >= band.min && (band.max === undefined || lc <= band.max);",
  ],
  "return `Lc ${band.min}+`;": ["+"],
  "export const meets = (lc: number, wcag: number, band: Band): boolean =>": ["wcag: number, "],
  "Math.abs(lc) >= band.min &&": ["Math.abs(lc)"],
  "(band.max === undefined || Math.abs(lc) <= band.max) &&": ["Math.abs(lc)"],
  "wcag >= (band.wcag ?? 1);": ["wcag >= (band.wcag ?? 1);"],
  // biome-ignore lint/suspicious/noTemplateCurlyInString: the diffed source contains this text
  "return `Lc ${band.min}${upper}`;": ["${upper}"],
};

/** VS Code's inline diff, mocked: line tints, changed-text tints and gutter markers. */
export const diffMock = (v: Variant, data: ReportData, view: View): string => {
  const { lines, kinds } = data.diff;
  const tint = (kind: DiffKind, part: "line" | "text"): Hex | undefined =>
    kind === "+"
      ? v.overlay[`diff.added.${part}`].color
      : kind === "-"
        ? v.overlay[`diff.removed.${part}`].color
        : undefined;
  const lineBg = new Map(
    kinds.flatMap((k, i) => {
      const bg = tint(k, "line");
      return bg === undefined ? [] : [[i, bg] as const];
    }),
  );
  const gutter = new Map(
    kinds.flatMap((k, i): readonly (readonly [number, GutterMark])[] =>
      k === "+"
        ? [[i, { text: "+", color: role(v, "added.mark") }]]
        : k === "-"
          ? [[i, { text: "−", color: role(v, "removed.mark") }]]
          : [],
    ),
  );
  const marks = kinds.flatMap((k, i): readonly Mark[] => {
    const bg = tint(k, "text");
    const parts = DIFF_TEXT_TINTS[textOf(lines[i]).trim()] ?? [];
    return bg === undefined ? [] : parts.map((p) => ({ ...locate(lines, i, p), bg }));
  });
  return renderCode(lines, v, { view, lineBg, gutter, marks });
};

export const editor = (v: Variant, data: ReportData): string =>
  section(
    "editor",
    "Editor",
    "A mock of VS Code built from the palette roles: current line, selection, word and find highlights, error, warning and info squiggles, inlay hints, ghost text, gutter change bars and an inline diff.",
    `${editorMock(v, data)}<h3>Inline diff</h3>${panel(
      "src/contrast.ts",
      "inline diff",
      diffMock(v, data, normal),
      normal,
      v,
    )}`,
  );

const lineWidth = (lines: AnsiLines): number =>
  Math.max(...lines.map((l) => l.reduce((n, s) => n + s.text.length, 0)));

const terminalPanel = (t: TerminalPreview, v: Variant, view: View): string =>
  panel(
    t.name,
    "",
    renderTerminal(t.lines, v, view),
    view,
    v,
    ` terminal${lineWidth(t.lines) > 72 ? " wide" : ""}`,
  );

export const terminal = (v: Variant, data: ReportData): string =>
  section(
    "terminal",
    "Terminal",
    "Transcripts of common tools in their default colors (fixtures/terminal), rendered with this variant's sixteen ANSI colors.",
    `<div class="grid2">${data.terminal.map((t) => terminalPanel(t, v, normal)).join("")}</div>`,
  );

const pairTable = (v: Variant): string => {
  const checks = semanticChecks(v);
  const rows = semanticPairs.map((p, i) => {
    const a = resolveSurface(v, p.a);
    const b = resolveSurface(v, p.b);
    const check = checks[i];
    const cells = LOOKS.map((look) => {
      const view = viewFor(look);
      return `<td><span class="pair"><i style="background:${view(a)}"></i><i style="background:${view(
        b,
      )}"></i></span><small>${fixed(deltaEOK(view(a), view(b)), 3)}</small></td>`;
    }).join("");
    const result =
      check === undefined
        ? ""
        : `${passMark(check.pass)}${fixed(check.worstCvd, 3)} ≥ ${check.threshold} · ΔL ${fixed(check.dl, 3)}`;
    return `<tr><th>${esc(p.label)}</th>${cells}<td>${result}</td></tr>`;
  });
  return `<table class="table pairs"><thead><tr><th>Pair</th>${LOOKS.map(
    (l) => `<th>${LOOK_NAMES[l]}</th>`,
  ).join(
    "",
  )}<th>Worst simulated ΔE<sub>OK</sub></th></tr></thead><tbody>${rows.join("")}</tbody></table>`;
};

const accentStrip = (v: Variant, look: Look): string => {
  const view = viewFor(look);
  const words = [...SYNTAX_ACCENTS, "invalid" as const]
    .map((k) => `<span style="color:${view(v.syntax[k])}">${k}</span>`)
    .join("");
  return `<div class="strip mono" style="${style({
    background: view(v.neutral.bg),
    color: view(v.neutral.fg),
  })}"><span class="strip-label" style="color:${view(v.neutral["fg.muted"])}">${LOOK_NAMES[look]}</span>${words}</div>`;
};

const lookRow = (v: Variant, data: ReportData, look: Look): string => {
  const view = viewFor(look);
  const excerpt = renderCode(data.typescript.slice(30, 41), v, { view, firstLine: 31 });
  const tests = data.terminal.find((t) => t.name === "test-run");
  const terminalHtml = tests === undefined ? "" : renderTerminal(tests.lines.slice(1, 6), v, view);
  return `<h3>${LOOK_NAMES[look]}</h3><div class="look">${panel(
    "typescript.ts",
    "",
    excerpt,
    view,
    v,
  )}<div class="stack">${panel("inline diff", "", diffMock(v, data, view), view, v)}${panel(
    "test run",
    "",
    terminalHtml,
    view,
    v,
  )}</div></div>`;
};

export const cvd = (v: Variant, data: ReportData): string =>
  section(
    "cvd",
    "Color-vision deficiency",
    "Every color below passes through a simulation: Machado et al. (2009) at full severity for protanopia and deuteranopia, Brettel et al. (1997) for tritanopia, and relative luminance for grayscale. The numbers are ΔE<sub>OK</sub> between the two colors as simulated. The pass criterion also covers Machado's tritanomaly approximation, which is not previewed.",
    `<h3>Semantic pairs</h3>${pairTable(v)}<h3>Syntax accents</h3><div class="strips">${LOOKS.map(
      (l) => accentStrip(v, l),
    ).join("")}</div>${LOOKS.map((l) => lookRow(v, data, l)).join("")}`,
  );
