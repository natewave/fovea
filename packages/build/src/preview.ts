import { flatten, type Hex } from "@fovea/colorlab";
import { role, type Variant } from "@fovea/palette";
import { encodePng } from "./png.ts";
import { type Layer, rect, render } from "./raster.ts";
import type { RoleLines, RoleToken } from "./token-frequency.ts";

/** Shiki's font style bit flags. */
const ITALIC = 1;
const BOLD = 2;
const UNDERLINE = 4;
const STRIKETHROUGH = 8;

const xml = (text: string): string =>
  text.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c,
  );

const tspan = (v: Variant, t: RoleToken): string => {
  const attrs = [
    `fill="${role(v, t.role)}"`,
    t.fontStyle & BOLD ? `font-weight="600"` : "",
    t.fontStyle & ITALIC ? `font-style="italic"` : "",
    t.fontStyle & UNDERLINE ? `text-decoration="underline"` : "",
    t.fontStyle & STRIKETHROUGH ? `text-decoration="line-through"` : "",
  ].filter((a) => a !== "");
  return `<tspan ${attrs.join(" ")}>${xml(t.content)}</tspan>`;
};

export interface CodeSvgOptions {
  readonly title: string;
  readonly firstLine: number;
  readonly activeLine: number;
  readonly width?: number;
}

const FONT = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";
const UI_FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";

/**
 * Code in an editor frame as SVG text, colored by a variant's roles. The viewer's browser draws the
 * glyphs, so this stands in for a screenshot without needing one.
 */
export const codeSvg = (v: Variant, lines: RoleLines, opts: CodeSvgOptions): string => {
  const width = opts.width ?? 760;
  const bar = 34;
  const pad = 14;
  const lineHeight = 20;
  const gutter = 52;
  const height = bar + pad * 2 + lines.length * lineHeight;
  const top = bar + pad;
  const active = opts.activeLine - opts.firstLine;
  const rows = lines.map((tokens, i) => {
    const y = top + i * lineHeight + 14;
    const number = opts.firstLine + i;
    const numberColor = role(v, i === active ? "text" : "text.muted");
    return [
      `<text x="${gutter - 14}" y="${y}" text-anchor="end" fill="${numberColor}">${number}</text>`,
      `<text x="${gutter}" y="${y}" xml:space="preserve">${tokens.map((t) => tspan(v, t)).join("")}</text>`,
    ].join("");
  });
  const lineBg = flatten(v.overlay["line.current"].color, v.neutral.bg);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title">`,
    `<title id="title">${xml(`${v.name}: ${opts.title}`)}</title>`,
    `<rect width="${width}" height="${height}" rx="10" fill="${role(v, "surface.editor")}"/>`,
    `<path d="M0 10a10 10 0 0 1 10-10h${width - 20}a10 10 0 0 1 10 10v${bar - 10}h-${width}z" fill="${role(v, "surface.chrome")}"/>`,
    `<rect y="${bar - 1}" width="${width}" height="1" fill="${role(v, "border")}"/>`,
    `<text x="${pad}" y="22" font-family="${UI_FONT}" font-size="13" fill="${role(v, "text.subtle")}">${xml(opts.title)} · ${xml(v.name)}</text>`,
    active >= 0 && active < lines.length
      ? `<rect y="${top + active * lineHeight}" width="${width}" height="${lineHeight}" fill="${lineBg}"/>`
      : "",
    `<g font-family="${FONT}" font-size="13">`,
    ...rows,
    "</g>",
    "</svg>\n",
  ].join("");
};

/** Runs of non-space characters in a token, as column offsets. */
const words = (content: string, column: number): readonly (readonly [number, number])[] =>
  [...content.matchAll(/\S+/g)].map((m) => [column + (m.index ?? 0), m[0].length] as const);

/**
 * An editor window drawn without text: each word is a rounded bar in its token color, like a
 * minimap. PNG, because the Marketplace doesn't allow SVG images in READMEs.
 */
export const previewPng = (
  v: Variant,
  lines: RoleLines,
  width = 1200,
  height = 720,
): Uint8Array => {
  const ch = 9;
  const lh = 24;
  const barH = 10;
  const title = 40;
  const tabs = 40;
  const status = 30;
  const side = 240;
  const gutter = side + 64;
  const codeX = gutter + 24;
  const codeTop = title + tabs + 16;
  const visible = lines.slice(0, Math.floor((height - status - codeTop - 8) / lh));
  const activeLine = 4;
  const r = (k: Parameters<typeof role>[1]): Hex => role(v, k);
  const pill = (x: number, y: number, w: number, color: Hex): Layer => ({
    shape: rect(x, y + (lh - barH) / 2, w, barH, barH / 2),
    color,
  });
  const tree: readonly (readonly [number, number])[] = [
    [0, 9],
    [1, 6],
    [2, 11],
    [2, 8],
    [2, 13],
    [1, 7],
    [2, 10],
    [2, 9],
    [0, 12],
    [0, 8],
  ];
  const selectedRow = 3;
  const sideTop = title + 16;
  const code = visible.flatMap((tokens, i) => {
    const y = codeTop + i * lh;
    const cells = tokens.reduce<{ readonly column: number; readonly bars: readonly Layer[] }>(
      (acc, t) => ({
        column: acc.column + t.content.length,
        bars: [
          ...acc.bars,
          ...words(t.content, acc.column).map(([col, len]) =>
            pill(codeX + col * ch, y, len * ch - 3, role(v, t.role)),
          ),
        ],
      }),
      { column: 0, bars: [] },
    );
    const digits = String(i + 1).length;
    return [
      pill(
        gutter - 12 - digits * ch,
        y,
        digits * ch - 3,
        r(i === activeLine ? "text" : "text.muted"),
      ),
      ...cells.bars,
    ];
  });
  const layers: readonly Layer[] = [
    { shape: rect(0, 0, width, height), color: r("surface.chrome") },
    ...[0, 1, 2].map((i) => ({ shape: rect(18 + i * 20, 15, 10, 10, 5), color: r("text.faint") })),
    { shape: rect(width / 2 - 90, 15, 180, 10, 5), color: r("text.muted") },
    ...tree.flatMap(([depth, len], i) => [
      ...(i === selectedRow
        ? [{ shape: rect(0, sideTop + i * lh, side, lh), color: r("surface.hover") }]
        : []),
      pill(
        20 + depth * 16,
        sideTop + i * lh,
        len * ch,
        r(i === selectedRow ? "text" : "text.subtle"),
      ),
    ]),
    { shape: rect(side, title, 1, height - title - status), color: r("border") },
    {
      shape: rect(side + 1, title + tabs, width - side - 1, height - title - tabs - status),
      color: r("surface.editor"),
    },
    { shape: rect(side + 1, title, 180, tabs), color: r("surface.editor") },
    { shape: rect(side + 1, title, 180, 2), color: r("accent") },
    pill(side + 24, title + (tabs - lh) / 2, 13 * ch, r("text")),
    pill(side + 205, title + (tabs - lh) / 2, 11 * ch, r("text.muted")),
    {
      shape: rect(side + 1, codeTop + activeLine * lh, width - side - 1, lh),
      color: flatten(v.overlay["line.current"].color, v.neutral.bg),
    },
    ...code,
    { shape: rect(0, height - status, width, 1), color: r("border") },
    pill(16, height - status + 3, 10 * ch, r("text.subtle")),
    pill(width - 16 - 14 * ch, height - status + 3, 14 * ch, r("text.subtle")),
  ];
  return encodePng(width, height, render(width, height, layers, 3));
};
