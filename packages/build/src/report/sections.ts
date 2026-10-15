import { apcaLc, type Hex, hexToOklch, wcagContrast } from "@fovea/colorlab";
import {
  type Band,
  budget,
  CONTRAST_LABEL,
  FAMILIES,
  families,
  type NeutralKey,
  neutralNames,
  OVERLAY_KEYS,
  role,
  SYNTAX_KEYS,
  type SyntaxKey,
  syntaxFamily,
  type Variant,
} from "@fovea/palette";
import {
  ANSI_NAMES,
  ansiChecks,
  ansiTextIndices,
  type BudgetRow,
  chromostereopsisWarnings,
  contrastChecks,
  emittedLight,
  rampOrder,
  semanticChecks,
  syntaxPairs,
  tierCheck,
  tokenColors,
  tokenSurfaces,
  whitePoints,
} from "@fovea/palette/audit";
import { esc, fixed, passMark, section, style } from "./html.ts";

const lcOf = (text: Hex, surface: Hex): number => apcaLc({ text, surface });

const contrastText = (text: Hex, surface: Hex): string =>
  `Lc ${fixed(lcOf(text, surface))} · ${fixed(wcagContrast(text, surface), 2)}:1`;

const oklchText = (hex: Hex): string => {
  const { l, c, h } = hexToOklch(hex);
  return `L ${fixed(l, 3)} C ${fixed(c, 3)} h ${Number.isFinite(h) ? Math.round(h) : "–"}`;
};

const bandText = (band: Band): string => {
  const lc = band.max === undefined ? `Lc ≥ ${band.min}` : `Lc ${band.min}–${band.max}`;
  return band.wcag === undefined ? lc : `${lc} · ≥ ${band.wcag}:1`;
};

const dot = (hex: Hex): string => `<span class="dot" style="background:${hex}"></span>`;

export const overview = (v: Variant): string => {
  const checks = contrastChecks(v);
  const tier = tierCheck(v);
  const closest = Math.min(...syntaxPairs(v).map((p) => p.normal));
  const semantic = semanticChecks(v);
  const ansi = ansiChecks(v);
  const warnings = chromostereopsisWarnings(v);
  const { bg, fg } = v.neutral;
  const facts: readonly (readonly [string, string])[] = [
    ["Background", `${dot(bg)}<code>${bg}</code>`],
    ["Text", `${dot(fg)}<code>${fg}</code>`],
    ["Text on background", contrastText(fg, bg)],
    ...whitePoints(v).map((w): readonly [string, string] => [
      `White point of ${w.key}`,
      `${Math.round(w.cct)} K · Duv ${w.duv.toFixed(4)}`,
    ]),
    ["Emitted light (layout model)", `${fixed(emittedLight(v) * 100)}% of a white screen`],
    ["Accent chroma cap", `C ${budget.chromaCap[v.id]}`],
  ];
  const status: readonly (readonly [boolean, string])[] = [
    [
      checks.every((c) => c.pass),
      `${checks.filter((c) => c.pass).length} of ${checks.length} contrast checks pass`,
    ],
    [tier.pass, `Accent tier spread ${fixed(tier.spread)} Lc (limit ${budget.tierSpread})`],
    [
      closest >= budget.syntaxDeltaE[v.id],
      `Closest syntax accents ΔE<sub>OK</sub> ${fixed(closest, 3)} (floor ${budget.syntaxDeltaE[v.id]})`,
    ],
    [
      semantic.every((c) => c.pass),
      `${semantic.filter((c) => c.pass).length} of ${semantic.length} semantic pairs survive CVD simulation`,
    ],
    [
      ansi.every((c) => c.pass),
      `${ansi.filter((c) => c.pass).length} of ${ansi.length} ANSI ordering checks pass`,
    ],
    [
      warnings.length === 0,
      warnings.length === 0
        ? "No chromostereopsis warnings"
        : `${warnings.length} chromostereopsis warnings`,
    ],
  ];
  return `<section id="overview" class="hero">
<h1>${esc(v.name)}<span class="pill">${v.polarity}</span></h1>
<p class="desc">${esc(v.description)}</p>
<dl class="facts">${facts.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${val}</dd></div>`).join("")}</dl>
<ul class="status">${status.map(([pass, text]) => `<li>${passMark(pass)}${text}</li>`).join("")}</ul>
</section>`;
};

const NEUTRAL_USE: Readonly<Record<NeutralKey, string>> = {
  "bg.sunken": "sidebars, panels",
  bg: "editor",
  "bg.raised": "popups, menus",
  "bg.overlay": "hover, pressed",
  border: "dividers",
  "border.strong": "input borders",
  "fg.faint": "placeholders",
  "fg.muted": "line numbers, hints",
  "fg.subtle": "comments, punctuation",
  fg: "text",
  "fg.strong": "headings, emphasis",
};

export const neutrals = (v: Variant): string => {
  const inks: readonly Hex[] = [
    v.neutral["fg.strong"],
    v.neutral[v.polarity === "light" ? "bg.raised" : "bg.sunken"],
  ];
  const blocks = rampOrder(v.polarity).map((k) => {
    const hex = v.neutral[k];
    const ink = inks.reduce((best, c) => (lcOf(c, hex) > lcOf(best, hex) ? c : best));
    const { l, c, h } = hexToOklch(hex);
    const onBg = k.startsWith("bg")
      ? ""
      : `<span>Lc ${fixed(lcOf(hex, v.neutral.bg))} on bg</span>`;
    return `<div style="${style({ background: hex, color: ink })}"><b>${k}</b><span class="use">${NEUTRAL_USE[k]}</span><code>${hex}</code><span>L ${fixed(l, 3)}</span><span>C ${fixed(c, 3)} · h ${Math.round(h)}</span>${onBg}</div>`;
  });
  return section(
    "neutrals",
    `Neutrals · ${neutralNames[v.id]}`,
    "One hue for the whole ramp, from the background end to the text end. Surfaces differ by lightness only; every text tone is listed with its contrast on the editor background.",
    `<div class="ramp">${blocks.join("")}</div>`,
  );
};

const SYNTAX_SAMPLES: Readonly<Record<SyntaxKey, string>> = {
  keyword: "const return",
  string: '"utf8"',
  escape: "\\n \\d+",
  constant: "0.37 true",
  definition: "parseHex",
  type: "Oklch",
  invalid: "0xZZ",
  inserted: "+ added",
  deleted: "- removed",
};

interface SyntaxEntry {
  readonly name: string;
  readonly hex: Hex;
  readonly family: string;
  readonly sample: string;
  readonly underline: boolean;
}

const syntaxEntries = (v: Variant): readonly SyntaxEntry[] => [
  { name: "plain", hex: v.neutral.fg, family: "neutral", sample: "value", underline: false },
  {
    name: "comment, punctuation",
    hex: v.neutral["fg.subtle"],
    family: "neutral",
    sample: "// why ( ) ;",
    underline: false,
  },
  ...SYNTAX_KEYS.map((k) => ({
    name: k,
    hex: v.syntax[k],
    family: `${families[syntaxFamily[k]].name} (${syntaxFamily[k]})`,
    sample: SYNTAX_SAMPLES[k],
    underline: k === "invalid",
  })),
];

export const syntax = (v: Variant): string => {
  const chips = syntaxEntries(v).map(
    (e) => `<figure class="chip">
<div class="sample mono" style="${style({
      color: e.hex,
      "text-decoration": e.underline ? "underline" : undefined,
    })}">${esc(e.sample)}</div>
<figcaption><b>${esc(e.name)}</b>${esc(e.family)}<br><code>${e.hex}</code><br>${oklchText(e.hex)}<br>${contrastText(e.hex, v.neutral.bg)}</figcaption>
</figure>`,
  );
  const tier = tierCheck(v);
  const tierList = Object.entries(tier.values)
    .map(([k, lc]) => `${k} ${fixed(lc)}`)
    .join(", ");
  return section(
    "syntax",
    "Syntax",
    `Code uses six accent hues plus a reserved red. Definitions sit a step above the shared accent tier; comments and punctuation sit below plain text. Accent tier: ${tierList} (spread ${fixed(tier.spread)} Lc).`,
    `<div class="chips">${chips.join("")}</div>`,
  );
};

const TONE_HEADINGS: readonly string[] = [
  "fg · text",
  "strong · emphasis",
  "dim · marks",
  "tint · backgrounds",
  "tint.strong",
];

export const accents = (v: Variant): string => {
  const { bg, fg } = v.neutral;
  const meta = (hex: Hex, text: string): string => `<small><code>${hex}</code><br>${text}</small>`;
  const rows = FAMILIES.map((f) => {
    const t = v.accent[f];
    const info = families[f];
    const name = esc(info.name);
    return `<tr>
<th><b>${name}</b><small>${f} · ${info.hue}°</small></th>
<td><span class="word" style="color:${t.fg}">${name}</span>${meta(t.fg, contrastText(t.fg, bg))}</td>
<td><span class="word" style="color:${t.strong};font-weight:600">${name}</span>${meta(t.strong, contrastText(t.strong, bg))}</td>
<td><span class="word squiggle" style="text-decoration-color:${t.dim}">${name}</span><span class="bar" style="background:${t.dim}"></span>${meta(t.dim, contrastText(t.dim, bg))}</td>
<td><span class="tint" style="background:${t.tint};color:${fg}">${name}</span>${meta(t.tint, `text ${contrastText(fg, t.tint)}`)}</td>
<td><span class="tint" style="background:${t["tint.strong"]};color:${fg}">${name}</span>${meta(t["tint.strong"], `text ${contrastText(fg, t["tint.strong"])}`)}</td>
</tr>`;
  });
  return section(
    "accents",
    "Accent families",
    "Eight hue families, each with five tones: text, emphasized text, non-text marks (squiggles, gutter bars, icons) and two background tints. Text tones are measured on the editor background; tints with plain text on top.",
    `<table class="table accents"><thead><tr><th>Family</th>${TONE_HEADINGS.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>`,
  );
};

export const ansi = (v: Variant): string => {
  const text = ansiTextIndices(v.polarity);
  const chips = v.ansi.map((hex, i) => {
    const name = ANSI_NAMES[i] ?? String(i);
    const note = text.includes(i)
      ? contrastText(hex, v.neutral.bg)
      : `Lc ${fixed(lcOf(hex, v.neutral.bg))} · no text floor`;
    return `<figure class="chip ansi"><div class="fill" style="background:${hex}"></div><div class="sample mono" style="color:${hex}">${esc(name)}</div><figcaption><b>${i}</b><code>${hex}</code><br>${note}</figcaption></figure>`;
  });
  return section(
    "ansi",
    "ANSI colors",
    `The sixteen terminal colors. Colors used as text meet the ANSI text floor on the background; ${
      v.polarity === "dark"
        ? "black is the background end and bright black is held to its own band for dim output"
        : "Day keeps black dark and white light, so programs that print white text get faint text"
    }.`,
    `<div class="chips ansi-grid">${chips.join("")}</div>`,
  );
};

export const overlays = (v: Variant): string => {
  const checks = contrastChecks(v).filter((c) => c.row === "onOverlay");
  const chips = OVERLAY_KEYS.map((k) => {
    const o = v.overlay[k];
    const lowest = checks
      .filter((c) => c.surface === o.surface)
      .reduce<{ readonly lc: number; readonly label: string }>(
        (min, c) => (c.lc < min.lc ? { lc: c.lc, label: c.label } : min),
        { lc: Number.POSITIVE_INFINITY, label: "" },
      );
    const token = lowest.label.split(" on ")[0] ?? "";
    const parts: readonly (readonly [Hex, string])[] = [
      [role(v, "syntax.keyword"), "const "],
      [role(v, "syntax.plain"), "lc = "],
      [role(v, "syntax.string"), '"60"'],
      [role(v, "syntax.comment"), " // ok"],
    ];
    const sample = parts
      .map(([color, text]) => `<span style="color:${color}">${esc(text)}</span>`)
      .join("");
    return `<figure class="chip overlay"><div class="sample mono" style="background:${o.surface}">${sample}</div><figcaption><b>${k}</b><code>${o.color}</code> → <code>${o.surface}</code><br>lowest token Lc ${fixed(lowest.lc)} (${esc(token)})</figcaption></figure>`;
  });
  return section(
    "overlays",
    "Overlays",
    "Translucent highlights, shown flattened onto the editor background (diff text tints onto their line tint). Every token color keeps the on-overlay floor on each of them.",
    `<div class="chips overlays">${chips.join("")}</div>`,
  );
};

type Verdict = "pass" | "fail" | "unchecked";

const verdictOf = (v: Variant) => {
  const checks = contrastChecks(v);
  return (text: Hex, surface: Hex): Verdict => {
    const found = checks.filter((c) => c.text === text && c.surface === surface);
    if (found.length === 0) return "unchecked";
    return found.every((c) => c.pass) ? "pass" : "fail";
  };
};

const matrixCell = (text: Hex, surface: Hex, verdict: Verdict): string =>
  `<td class="${verdict}" style="background:${surface};color:${text}"><b>Ag</b>${fixed(
    lcOf(text, surface),
    0,
  )} · ${fixed(wcagContrast(text, surface), 1)}</td>`;

const matrix = (
  v: Variant,
  columns: readonly (readonly [string, Hex])[],
  rows: readonly (readonly [string, Hex])[],
): string => {
  const verdict = verdictOf(v);
  return `<table class="matrix"><thead><tr><th></th>${columns
    .map(([name]) => `<th>${esc(name)}</th>`)
    .join("")}</tr></thead><tbody>${rows
    .map(
      ([name, surface]) =>
        `<tr><th>${esc(name)}</th>${columns
          .map(([, text]) => matrixCell(text, surface, verdict(text, surface)))
          .join("")}</tr>`,
    )
    .join("")}</tbody></table>`;
};

const ROW_LABELS: Readonly<Record<BudgetRow, string>> = {
  primaryText: "Plain code and body text",
  syntax: "Syntax tokens",
  quiet: "Comments and punctuation",
  onOverlay: "Tokens on highlights",
  active: "Active line number, tab title",
  secondary: "Secondary UI text",
  semanticText: "Accent UI text",
  uiText: "Workbench labels",
  strongText: "Emphasized accent text",
  placeholder: "Placeholder text",
  cursor: "Cursor",
  uiComponent: "UI components",
  decorative: "Decorative lines",
  ansiText: "ANSI text colors",
  ansiBrightBlackDark: "ANSI bright black",
};

const budgetTable = (v: Variant): string => {
  const checks = contrastChecks(v);
  const rows = [...new Set(checks.map((c) => c.row))].map((row) => {
    const cs = checks.filter((c) => c.row === row);
    const lcs = cs.map((c) => c.lc);
    const failures = cs.filter((c) => !c.pass);
    const band = cs[0]?.band;
    return `<tr><td>${ROW_LABELS[row]}</td><td>${band === undefined ? "" : bandText(band)}</td><td class="num">${cs.length}</td><td class="num">${fixed(Math.min(...lcs))}–${fixed(Math.max(...lcs))}</td><td class="num">${fixed(Math.min(...cs.map((c) => c.wcag)), 2)}:1</td><td>${passMark(failures.length === 0)}${
      failures.length === 0 ? "all pass" : esc(failures.map((f) => f.label).join(", "))
    }</td></tr>`;
  });
  return `<table class="table"><thead><tr><th>Budget row</th><th>Band</th><th class="num">Checks</th><th class="num">Lc range</th><th class="num">Lowest WCAG</th><th>Result</th></tr></thead><tbody>${rows.join("")}</tbody></table>`;
};

export const contrast = (v: Variant): string => {
  const tokens = tokenColors(v).map(([label, hex]): readonly [string, Hex] => [
    label.replace("syntax.", "").replace("comment/punctuation", "comment").replace(" text", ""),
    hex,
  ]);
  const surfaces: readonly (readonly [string, Hex])[] = [
    ["bg", v.neutral.bg],
    ...tokenSurfaces(v).map(([name, hex]): readonly [string, Hex] => [
      name.replace(" on line.current", " + line"),
      hex,
    ]),
  ];
  const uiText: readonly (readonly [string, Hex])[] = [
    ["text.strong", role(v, "text.strong")],
    ["text", role(v, "text")],
    ["text.subtle", role(v, "text.subtle")],
    ["text.muted", role(v, "text.muted")],
    ["text.faint", role(v, "text.faint")],
    ...FAMILIES.map((f): readonly [string, Hex] => [`${f}.fg`, v.accent[f].fg]),
  ];
  const uiSurfaces: readonly (readonly [string, Hex])[] = [
    ["bg.sunken", v.neutral["bg.sunken"]],
    ["bg", v.neutral.bg],
    ["bg.raised", v.neutral["bg.raised"]],
  ];
  return section(
    "contrast",
    "Contrast",
    `Each cell shows the ${CONTRAST_LABEL} and the WCAG 2.2 ratio of a text color on a surface. A red outline and ✕ mark a pair that misses its budget row; cells without a budget row have no outline.`,
    `<h3>Token colors on every surface they can sit on</h3>${matrix(v, tokens, surfaces)}
<h3>UI text on surfaces</h3>${matrix(v, uiText, uiSurfaces)}
<h3>Budget rows</h3>${budgetTable(v)}`,
  );
};
