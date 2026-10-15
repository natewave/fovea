export type Align = "left" | "right";

/** A fenced code block. */
export const fence = (lang: string, body: string): string => `\`\`\`${lang}\n${body}\n\`\`\``;

const pad = (text: string, width: number, align: Align): string =>
  align === "right" ? text.padStart(width) : text.padEnd(width);

const rule = (width: number, align: Align): string =>
  align === "right" ? `${"-".repeat(width - 1)}:` : "-".repeat(width);

/** A Markdown table with padded columns, so the source reads as a table too. */
export const formatTable = (
  headers: readonly string[],
  rows: readonly (readonly string[])[],
  align: readonly Align[] = headers.map(() => "left"),
): string => {
  const widths = headers.map((h, i) =>
    Math.max(3, h.length, ...rows.map((row) => (row[i] ?? "").length)),
  );
  const line = (cells: readonly string[]): string =>
    `| ${widths.map((w, i) => pad(cells[i] ?? "", w, align[i] ?? "left")).join(" | ")} |`;
  return [
    line(headers),
    `| ${widths.map((w, i) => rule(w, align[i] ?? "left")).join(" | ")} |`,
    ...rows.map(line),
  ].join("\n");
};
