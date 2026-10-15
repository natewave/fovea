/**
 * Terminal text styled with SGR escape sequences. Colors stay palette indices (0–15), so the same
 * transcript renders with any variant's ANSI colors.
 */
export interface AnsiStyle {
  readonly fg: number | null;
  readonly bg: number | null;
  readonly bold: boolean;
  readonly faint: boolean;
  readonly italic: boolean;
  readonly underline: boolean;
  readonly inverse: boolean;
}

export interface AnsiSpan {
  readonly text: string;
  readonly style: AnsiStyle;
}

export type AnsiLines = readonly (readonly AnsiSpan[])[];

export const PLAIN_STYLE: AnsiStyle = {
  fg: null,
  bg: null,
  bold: false,
  faint: false,
  italic: false,
  underline: false,
  inverse: false,
};

const applyCode = (style: AnsiStyle, code: number): AnsiStyle => {
  if (code >= 30 && code <= 37) return { ...style, fg: code - 30 };
  if (code >= 90 && code <= 97) return { ...style, fg: code - 90 + 8 };
  if (code >= 40 && code <= 47) return { ...style, bg: code - 40 };
  if (code >= 100 && code <= 107) return { ...style, bg: code - 100 + 8 };
  switch (code) {
    case 0:
      return PLAIN_STYLE;
    case 1:
      return { ...style, bold: true };
    case 2:
      return { ...style, faint: true };
    case 3:
      return { ...style, italic: true };
    case 4:
      return { ...style, underline: true };
    case 7:
      return { ...style, inverse: true };
    case 22:
      return { ...style, bold: false, faint: false };
    case 23:
      return { ...style, italic: false };
    case 24:
      return { ...style, underline: false };
    case 27:
      return { ...style, inverse: false };
    case 39:
      return { ...style, fg: null };
    case 49:
      return { ...style, bg: null };
    default:
      return style;
  }
};

/** Applies SGR parameters in order. 256-color and truecolor parameters are skipped whole. */
const applyParams = (style: AnsiStyle, params: readonly number[]): AnsiStyle => {
  const [code, ...rest] = params;
  if (code === undefined) return style;
  if (code === 38 || code === 48) {
    const skip = rest[0] === 5 ? 2 : rest[0] === 2 ? 4 : 1;
    return applyParams(style, rest.slice(skip));
  }
  return applyParams(applyCode(style, code), rest);
};

const toLines = (spans: readonly AnsiSpan[]): AnsiLines =>
  spans.reduce<AnsiLines>(
    (lines, span) => {
      const [first = "", ...more] = span.text.split("\n");
      const last = lines.at(-1) ?? [];
      const joined = first === "" ? last : [...last, { text: first, style: span.style }];
      return [
        ...lines.slice(0, -1),
        joined,
        ...more.map((text) => (text === "" ? [] : [{ text, style: span.style }])),
      ];
    },
    [[]],
  );

/** Splits terminal output into lines of styled spans. SGR state carries across lines. */
export const parseAnsi = (input: string): AnsiLines => {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: SGR sequences start with ESC
  const parts = input.split(/\u001b\[([0-9;]*)m/);
  const { spans } = parts.reduce<{
    readonly style: AnsiStyle;
    readonly spans: readonly AnsiSpan[];
  }>(
    (acc, part, i) =>
      i % 2 === 1
        ? { style: applyParams(acc.style, part.split(";").map(Number)), spans: acc.spans }
        : {
            style: acc.style,
            spans: part === "" ? acc.spans : [...acc.spans, { text: part, style: acc.style }],
          },
    { style: PLAIN_STYLE, spans: [] },
  );
  const lines = toLines(spans);
  return lines.at(-1)?.length === 0 ? lines.slice(0, -1) : lines;
};
