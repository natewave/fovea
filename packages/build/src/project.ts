/**
 * Facts about the project that generated files repeat: the extension manifest, the install steps
 * in READMEs and on the website, and the packaging script all read them from here.
 *
 * The publisher is a PLACEHOLDER until an ID is registered on the Visual Studio Marketplace and
 * Open VSX. Until then, the READMEs and the website offer only the install from source.
 */
export const project = {
  name: "Fovea",
  version: "0.1.0",
  description:
    "A color scheme informed by vision research: three variants built from one OKLCH palette, " +
    "each checked against a contrast budget.",
  license: "MIT",
  publisher: "PLACEHOLDER-publisher",
  repository: "https://github.com/natewave/fovea",
  /** The GitHub Pages site. */
  homepage: "https://natewave.github.io/fovea/",
  /** The VS Code extension's `name`. With the publisher it forms the extension ID. */
  extensionName: "fovea",
  /** Where `pnpm package:vscode` writes the extension, relative to the repository root. */
  vsixPath: "dist/vscode/fovea.vsix",
  /** Oldest VS Code the themes target. Cursor, Windsurf and VSCodium all run newer builds. */
  vscodeEngine: "^1.85.0",
} as const;

export const extensionId = `${project.publisher}.${project.extensionName}`;

/** A file in the repository's default branch, by absolute URL (as the Marketplace requires). */
export const rawUrl = (path: string): string => `${project.repository}/raw/HEAD/${path}`;

export const releasesUrl = `${project.repository}/releases`;

/** The clone directory is the repository's name. */
export const repoName = project.repository.split("/").at(-1) ?? project.extensionName;

export const isPlaceholder = (value: string): boolean => value.includes("PLACEHOLDER");
