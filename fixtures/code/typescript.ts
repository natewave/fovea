import { readFile } from "node:fs/promises";

/** A color in OKLCH: lightness 0–1, chroma, hue in degrees. */
export interface Oklch {
  readonly l: number;
  readonly c: number;
  readonly h: number;
}

export type Polarity = "light" | "dark";

export enum Severity {
  Error = "error",
  Warning = "warning",
  Info = "info",
}

const HEX_PATTERN = /^#([0-9a-f]{6})$/i;
const MAX_CHROMA = 0.37;

export class ContrastError extends Error {
  constructor(
    readonly text: string,
    readonly surface: string,
    readonly lc: number,
  ) {
    super(`Lc ${lc.toFixed(1)} is below the floor for ${text} on ${surface}`);
  }
}

export function parseHex(hex: string): [number, number, number] | undefined {
  const match = HEX_PATTERN.exec(hex);
  if (!match?.[1]) return undefined;
  const value = Number.parseInt(match[1], 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

export const clampChroma = (color: Oklch, max = MAX_CHROMA): Oklch => ({
  ...color,
  c: Math.min(color.c, max),
});

export async function loadTheme<T extends { name: string }>(path: string): Promise<T> {
  const raw = await readFile(path, "utf8");
  const theme = JSON.parse(raw) as T;
  if (theme.name.trim() === "") {
    throw new TypeError(`Theme at ${path} has no name\n`);
  }
  return theme;
}

for (const [name, lc] of Object.entries({ body: 90, comment: 62 })) {
  const severity = lc < 60 ? Severity.Error : Severity.Info;
  console.log(`${name}: Lc ${lc} (${severity})`);
}
