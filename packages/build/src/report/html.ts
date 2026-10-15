import {
  formatHex,
  type Hex,
  linearToSrgb,
  relativeLuminance,
  simulateCvdHex,
} from "@fovea/colorlab";

const ENTITIES: Readonly<Record<string, string>> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

export const esc = (text: string): string => text.replace(/[&<>"]/g, (c) => ENTITIES[c] ?? c);

export const fixed = (n: number, digits = 1): string => n.toFixed(digits);

/** How a color is seen: as is, through a dichromacy simulation, or as luminance only. */
export type Look = "normal" | "protanopia" | "deuteranopia" | "tritanopia" | "grayscale";

export const LOOKS: readonly Look[] = [
  "normal",
  "protanopia",
  "deuteranopia",
  "tritanopia",
  "grayscale",
];

export const LOOK_NAMES: Readonly<Record<Look, string>> = {
  normal: "Typical color vision",
  protanopia: "Protanopia",
  deuteranopia: "Deuteranopia",
  tritanopia: "Tritanopia",
  grayscale: "Grayscale",
};

/** Maps every displayed color, so a whole preview can be shown through one look. */
export type View = (hex: Hex) => Hex;

const grayscale = (hex: Hex): Hex => {
  const v = linearToSrgb(relativeLuminance(hex));
  return formatHex({ r: v, g: v, b: v });
};

export const viewFor = (look: Look): View => {
  switch (look) {
    case "normal":
      return (hex) => hex;
    case "grayscale":
      return grayscale;
    default:
      return (hex) => simulateCvdHex(hex, look);
  }
};

/** Inline CSS from property/value pairs, skipping absent values. */
export const style = (props: Readonly<Record<string, string | undefined>>): string =>
  Object.entries(props)
    .flatMap(([k, v]) => (v === undefined ? [] : [`${k}:${v}`]))
    .join(";");

/** A report section. `lede` is trusted HTML. */
export const section = (id: string, title: string, lede: string, body: string): string =>
  `<section id="${id}"><header class="section-head"><h2>${esc(title)}</h2>${
    lede === "" ? "" : `<p>${lede}</p>`
  }</header>${body}</section>`;

/** A pass/fail glyph, so results never rely on color alone. */
export const passMark = (pass: boolean): string =>
  pass
    ? `<span class="mark ok" title="pass">✓</span>`
    : `<span class="mark bad" title="fail">✕</span>`;
