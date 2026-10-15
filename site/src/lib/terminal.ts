import { type AnsiSpan, type AnsiStyle, parseAnsi } from "@fovea/build/ansi";

const escapeHtml = (text: string): string =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const fgOf = (s: AnsiStyle): string | undefined => {
  const index = s.inverse ? s.bg : s.fg;
  if (index !== null) return `var(--fovea-ansi-${index})`;
  return s.inverse ? "var(--fovea-surface-editor)" : undefined;
};

const bgOf = (s: AnsiStyle): string | undefined => {
  const index = s.inverse ? s.fg : s.bg;
  if (index !== null) return `var(--fovea-ansi-${index})`;
  return s.inverse ? "var(--fovea-text)" : undefined;
};

const styleOf = (s: AnsiStyle): string =>
  [
    fgOf(s) === undefined ? "" : `color:${fgOf(s)}`,
    bgOf(s) === undefined ? "" : `background-color:${bgOf(s)}`,
    s.bold ? "font-weight:700" : "",
    s.faint ? "opacity:0.7" : "",
    s.underline ? "text-decoration:underline" : "",
  ]
    .filter((d) => d !== "")
    .join(";");

const span = (s: AnsiSpan): string => {
  const style = styleOf(s.style);
  const text = escapeHtml(s.text);
  return style === "" ? text : `<span style="${style}">${text}</span>`;
};

/**
 * A transcript as HTML. Colors are the page's ANSI custom properties, so the mock re-themes with
 * the variant. Italic is dropped, as everywhere in Fovea.
 */
export const terminalHtml = (text: string): string =>
  parseAnsi(text.replace(/\n$/, ""))
    .map((line) => line.map(span).join(""))
    .join("\n");
