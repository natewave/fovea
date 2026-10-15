import { readFileSync } from "node:fs";
import { join } from "node:path";
import { themeFileName } from "@fovea/build/vscode/theme";
import { variants } from "@fovea/palette";
import {
  type BundledLanguage,
  createHighlighter,
  type Highlighter,
  type ThemeRegistrationRaw,
} from "shiki";
import { repoRoot } from "./paths.ts";

interface ThemeFile {
  readonly name: string;
  readonly type: "light" | "dark";
  readonly colors: Readonly<Record<string, string>>;
  readonly tokenColors: readonly {
    readonly name?: string;
    readonly scope: readonly string[];
    readonly settings: Readonly<Record<string, string>>;
  }[];
}

/** The VS Code themes the build generated, exactly as the extension ships them. */
const generatedTheme = (file: string): ThemeRegistrationRaw => {
  const theme = JSON.parse(
    readFileSync(join(repoRoot(), "ports/vscode/themes", file), "utf8"),
  ) as ThemeFile;
  return {
    name: theme.name,
    type: theme.type,
    colors: { ...theme.colors },
    settings: theme.tokenColors.map((rule) => ({
      ...(rule.name === undefined ? {} : { name: rule.name }),
      scope: [...rule.scope],
      settings: { ...rule.settings },
    })),
  };
};

/** Shiki writes each token's color per variant as `--shiki-day`, `--shiki-dusk`, `--shiki-night`. */
const THEMES = Object.fromEntries(variants.map((v) => [v.id, v.name]));

let highlighter: Promise<Highlighter> | undefined;

const load = (langs: readonly BundledLanguage[]): Promise<Highlighter> => {
  highlighter ??= createHighlighter({
    themes: variants.map((v) => generatedTheme(themeFileName(v))),
    langs: [...langs],
  });
  return highlighter;
};

export const LANGS: readonly BundledLanguage[] = [
  "typescript",
  "python",
  "rust",
  "go",
  "scala",
  "markdown",
  "json",
  "shellscript",
  "diff",
];

/** Highlighted HTML that follows the page's variant through CSS variables. */
export const highlight = async (code: string, lang: BundledLanguage): Promise<string> => {
  const h = await load(LANGS);
  if (!h.getLoadedLanguages().includes(lang)) await h.loadLanguage(lang);
  return h.codeToHtml(code.replace(/\n$/, ""), {
    lang,
    themes: THEMES,
    defaultColor: false,
  });
};
