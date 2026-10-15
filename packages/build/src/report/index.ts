import { apcaLc, wcagContrast } from "@fovea/colorlab";
import { CONTRAST_LABEL, palette, type Variant, variants } from "@fovea/palette";
import { contrastChecks, emittedLight, semanticChecks, syntaxPairs } from "@fovea/palette/audit";
import { parseAnsi } from "../ansi.ts";
import type { TextOutput } from "../output.ts";
import type { Sample, TerminalSample } from "../samples.ts";
import type { RoleLines, Snippet } from "../token-frequency.ts";
import { renderCode, renderTerminal } from "./code.ts";
import { STYLES, themeVars } from "./css.ts";
import { esc, fixed, passMark, viewFor } from "./html.ts";
import {
  type CodePreview,
  code,
  cvd,
  type DiffKind,
  editor,
  type ReportData,
  terminal,
} from "./previews.ts";
import { accents, ansi, contrast, neutrals, overlays, overview, syntax } from "./sections.ts";

export type { ReportData } from "./previews.ts";

export const REPORT_DIR = "dist/report";

const TYPESCRIPT = "fixtures/code/typescript.ts";
const DIFF = "fixtures/code/diff.diff";
const DIFF_CODE = "report:diff";

/** Fixture languages in display order; any others follow alphabetically. */
const CODE_ORDER: readonly string[] = [
  "typescript",
  "javascript",
  "python",
  "rust",
  "go",
  "java",
  "csharp",
  "kotlin",
  "swift",
  "scala",
  "cpp",
  "c",
  "ruby",
  "php",
  "shellscript",
  "sql",
  "html",
  "css",
  "json",
  "yaml",
  "toml",
  "markdown",
  "docker",
  "diff",
];

const TERMINAL_ORDER: readonly string[] = [
  "prompt",
  "git-status",
  "git-diff",
  "git-log",
  "test-run",
  "ls",
  "compiler-error",
];

const rank = (order: readonly string[], key: string): number => {
  const i = order.indexOf(key);
  return i < 0 ? order.length : i;
};

const isDiffKind = (ch: string): ch is DiffKind => ch === " " || ch === "+" || ch === "-";

/** The code lines of a unified diff's hunks, without their +/−/space prefix. */
export const diffHunks = (
  diff: string,
): { readonly code: string; readonly kinds: readonly DiffKind[] } => {
  const body = diff
    .split("\n")
    .slice(diff.split("\n").findIndex((l) => l.startsWith("@@")))
    .filter((l) => !l.startsWith("@@") && l !== "");
  const kinds = body.map((l) => l.charAt(0)).filter(isDiffKind);
  return { code: body.map((l) => l.slice(1)).join("\n"), kinds };
};

const fixtures = (samples: readonly Sample[]): readonly Sample[] =>
  samples
    .filter((s) => s.set === "fixtures")
    .toSorted(
      (a, b) =>
        rank(CODE_ORDER, a.language.id) - rank(CODE_ORDER, b.language.id) ||
        a.path.localeCompare(b.path),
    );

const sampleCode = (samples: readonly Sample[], path: string): string => {
  const sample = samples.find((s) => s.path === path);
  if (sample === undefined) throw new Error(`The report needs ${path}`);
  return sample.code;
};

/** The code the report shows, for the caller to tokenize. */
export const reportSnippets = (samples: readonly Sample[]): readonly Snippet[] => [
  ...fixtures(samples).map((s) => ({ id: s.path, lang: s.language.id, code: s.code })),
  { id: DIFF_CODE, lang: "typescript", code: diffHunks(sampleCode(samples, DIFF)).code },
];

export const reportData = (
  samples: readonly Sample[],
  tokens: ReadonlyMap<string, RoleLines>,
  terminalSamples: readonly TerminalSample[],
): ReportData => {
  const lines = (id: string): RoleLines => {
    const found = tokens.get(id);
    if (found === undefined) throw new Error(`No tokens for ${id}`);
    return found;
  };
  const code: readonly CodePreview[] = fixtures(samples).map((s) => ({
    name: s.language.name,
    path: s.path,
    lines: lines(s.path),
  }));
  return {
    code,
    typescript: lines(TYPESCRIPT),
    diff: { lines: lines(DIFF_CODE), kinds: diffHunks(sampleCode(samples, DIFF)).kinds },
    terminal: terminalSamples
      .toSorted((a, b) => rank(TERMINAL_ORDER, a.name) - rank(TERMINAL_ORDER, b.name))
      .map((t) => ({ name: t.name, lines: parseAnsi(t.text) })),
  };
};

const SECTIONS: readonly (readonly [string, string])[] = [
  ["neutrals", "Neutrals"],
  ["syntax", "Syntax"],
  ["accents", "Accents"],
  ["ansi", "ANSI"],
  ["overlays", "Overlays"],
  ["contrast", "Contrast"],
  ["code", "Code"],
  ["editor", "Editor"],
  ["terminal", "Terminal"],
  ["cvd", "CVD"],
];

const nav = (current: string): string => {
  const pages: readonly (readonly [string, string])[] = [
    ["index", "Overview"],
    ...variants.map((v): readonly [string, string] => [v.id, v.name.replace("Fovea ", "")]),
  ];
  const links = pages
    .map(
      ([id, name]) =>
        `<a href="${id}.html"${id === current ? ' aria-current="page"' : ""}>${esc(name)}</a>`,
    )
    .join("");
  const anchors =
    current === "index"
      ? ""
      : SECTIONS.map(([id, name]) => `<a href="#${id}">${name}</a>`).join("");
  return `<nav class="topnav"><span class="brand">Fovea palette report</span>${links}<span class="sep"></span>${anchors}</nav>`;
};

const page = (
  title: string,
  rootStyle: string,
  body: string,
  mainClass = "",
): string => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<style>${rootStyle}${STYLES}</style>
</head>
<body>
<main${mainClass === "" ? "" : ` class="${mainClass}"`}>
${body}
</main>
</body>
</html>
`;

const variantPage = (v: Variant, data: ReportData): string =>
  page(
    `${v.name} · Fovea palette report`,
    `:root{${themeVars(v)}}`,
    [
      nav(v.id),
      overview(v),
      neutrals(v),
      syntax(v),
      accents(v),
      ansi(v),
      overlays(v),
      contrast(v),
      code(v, data),
      editor(v, data),
      terminal(v, data),
      cvd(v, data),
    ].join("\n"),
  );

const summaryRow = (v: Variant): string => {
  const checks = contrastChecks(v);
  const semantic = semanticChecks(v);
  const closest = Math.min(...syntaxPairs(v).map((p) => p.normal));
  const { bg, fg } = v.neutral;
  return `<tr><th><a href="${v.id}.html">${esc(v.name)}</a></th><td><code>${bg}</code></td><td><code>${fg}</code></td><td class="num">${fixed(
    apcaLc({ text: fg, surface: bg }),
  )}</td><td class="num">${fixed(wcagContrast(fg, bg), 1)}:1</td><td class="num">${fixed(
    emittedLight(v) * 100,
  )}%</td><td class="num">${fixed(closest, 3)}</td><td>${passMark(
    checks.every((c) => c.pass),
  )}${checks.filter((c) => c.pass).length} / ${checks.length}</td><td>${passMark(
    semantic.every((c) => c.pass),
  )}${semantic.filter((c) => c.pass).length} / ${semantic.length}</td></tr>`;
};

const card = (v: Variant, data: ReportData): string => {
  const view = viewFor("normal");
  const excerpt = renderCode(data.typescript.slice(11, 26), v, { view, firstLine: 12 });
  const status = data.terminal.find((t) => t.name === "git-status");
  const withoutHints = (status?.lines ?? []).filter(
    (line) => !line.some((s) => s.text.includes("(use ")),
  );
  const shell = renderTerminal(withoutHints, v, view);
  return `<article class="card" style="${themeVars(v)}">
<h2><a href="${v.id}.html">${esc(v.name)}</a></h2>
<p>${esc(v.description)}</p>
<figure class="panel"><div class="code" style="background:${v.neutral.bg}">${excerpt}</div></figure>
<figure class="panel terminal"><div class="code" style="background:${v.neutral.bg};color:${v.neutral.fg}">${shell}</div></figure>
</article>`;
};

const indexPage = (data: ReportData): string =>
  page(
    "Fovea palette report",
    `:root{${themeVars(palette.day)}}@media (prefers-color-scheme:dark){:root{${themeVars(palette.dusk)}}}`,
    `${nav("index")}
<section class="hero">
<h1>Fovea palette report</h1>
<p class="desc">An internal page generated from the palette package by <code>pnpm report</code>. Every number is computed from the same audit functions the tests assert on. Contrast is shown as ${CONTRAST_LABEL} next to the WCAG 2.2 ratio; docs/design.md describes the method.</p>
</section>
<section id="summary"><table class="table"><thead><tr><th>Variant</th><th>Background</th><th>Text</th><th class="num">Text Lc</th><th class="num">WCAG</th><th class="num">Emitted light</th><th class="num">Closest accents ΔE<sub>OK</sub></th><th>Contrast checks</th><th>CVD pairs</th></tr></thead><tbody>${variants
      .map(summaryRow)
      .join("")}</tbody></table></section>
<section id="side-by-side"><div class="cards">${variants.map((v) => card(v, data)).join("")}</div></section>`,
    "wide-page",
  );

/** The report pages, written to the gitignored `dist/report`. */
export const reportPages = (data: ReportData): readonly TextOutput[] => [
  { path: `${REPORT_DIR}/index.html`, contents: indexPage(data) },
  ...variants.map((v) => ({ path: `${REPORT_DIR}/${v.id}.html`, contents: variantPage(v, data) })),
];
