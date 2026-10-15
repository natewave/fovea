import { role, type Variant } from "@fovea/palette";
import { project } from "../project.ts";
import { themeFileName, uiTheme } from "./theme.ts";

export const THEMES_DIR = "themes";

export interface ThemeContribution {
  readonly label: string;
  readonly uiTheme: "vs" | "vs-dark";
  readonly path: string;
}

export const themeContributions = (variants: readonly Variant[]): readonly ThemeContribution[] =>
  variants.map((v) => ({
    label: v.name,
    uiTheme: uiTheme(v),
    path: `./${THEMES_DIR}/${themeFileName(v)}`,
  }));

/**
 * The extension's `package.json`. `private` keeps pnpm from ever publishing it to npm; the
 * Marketplace and Open VSX ignore the field.
 */
export const extensionManifest = (variants: readonly Variant[], banner: Variant): object => ({
  name: project.extensionName,
  displayName: project.name,
  description: project.description,
  version: project.version,
  publisher: project.publisher,
  license: project.license,
  private: true,
  icon: "icon.png",
  galleryBanner: { color: role(banner, "surface.chrome"), theme: banner.polarity },
  homepage: project.homepage,
  repository: { type: "git", url: `${project.repository}.git` },
  bugs: { url: `${project.repository}/issues` },
  engines: { vscode: project.vscodeEngine },
  categories: ["Themes"],
  keywords: [
    "theme",
    "color theme",
    "light theme",
    "dark theme",
    "warm",
    "accessibility",
    "contrast",
    "low light",
  ],
  contributes: { themes: themeContributions(variants) },
});

export const manifestJson = (manifest: object): string => `${JSON.stringify(manifest, null, 2)}\n`;
