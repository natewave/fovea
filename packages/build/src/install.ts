import { palette } from "@fovea/palette";
import { extensionId, project, repoName } from "./project.ts";

/**
 * Install steps and settings, shared by the Marketplace README, the Ghostty README, the root README
 * (a test checks it) and the website, so the copies can't drift. Each command was checked against
 * the tool's own documentation or `--help` output; docs/style-guide.md links the sources.
 */

export const themeNames = {
  day: palette.day.name,
  dusk: palette.dusk.name,
  night: palette.night.name,
} as const;

/** Editors that install a `.vsix` with `<cli> --install-extension <file>`. */
export const editorClis: readonly { readonly app: string; readonly cli: string }[] = [
  { app: "VS Code", cli: "code" },
  { app: "Cursor", cli: "cursor" },
  { app: "VSCodium", cli: "codium" },
];

export const marketplaceCommand = `code --install-extension ${extensionId}`;

export const cloneSteps: readonly string[] = [
  `git clone ${project.repository}.git`,
  `cd ${repoName}`,
];

/** Build the extension from source and install it. */
export const vscodeSourceSteps: readonly string[] = [
  ...cloneSteps,
  "pnpm install",
  "pnpm package:vscode",
  `code --install-extension ${project.vsixPath}`,
];

/** Follow the operating system's light or dark appearance. */
export const recommendedSettings = {
  "window.autoDetectColorScheme": true,
  "workbench.preferredLightColorTheme": themeNames.day,
  "workbench.preferredDarkColorTheme": themeNames.dusk,
} as const;

export const nightSetting = { "workbench.preferredDarkColorTheme": themeNames.night } as const;

/** Italic comments, for those who want them. A rule with only `fontStyle` keeps the colors. */
export const italicSettings = {
  "editor.tokenColorCustomizations": {
    "[Fovea*]": {
      textMateRules: [
        {
          scope: ["comment", "punctuation.definition.comment"],
          settings: { fontStyle: "italic" },
        },
      ],
    },
  },
} as const;

/** VS Code's own colors for bracket pairs, which Fovea keeps neutral. */
export const bracketColorSettings = {
  "workbench.colorCustomizations": {
    "[Fovea*]": Object.fromEntries(
      Array.from({ length: 6 }, (_, i) => [`editorBracketHighlight.foreground${i + 1}`, "default"]),
    ),
  },
} as const;

export const GHOSTTY_THEME_DIR = "~/.config/ghostty/themes";

export const ghosttyThemeFiles: readonly string[] = [
  themeNames.day,
  themeNames.dusk,
  themeNames.night,
];

/** Copy the Ghostty themes from a clone of the repository. */
export const ghosttySteps: readonly string[] = [
  ...cloneSteps,
  `mkdir -p ${GHOSTTY_THEME_DIR}`,
  `cp ports/ghostty/themes/* ${GHOSTTY_THEME_DIR}/`,
];

/** The config line that follows the system appearance. */
export const ghosttyThemeLine = `theme = light:${themeNames.day},dark:${themeNames.dusk}`;

export const ghosttyNightLine = `theme = light:${themeNames.day},dark:${themeNames.night}`;

export const GHOSTTY_CONFIG_DOCS = "https://ghostty.org/docs/config";

/** Markdown. Ghostty loads its macOS-only config files after the XDG ones, so their values win. */
export const ghosttyConfigNote =
  "Reload the config (`cmd+shift+,` on macOS, `ctrl+shift+,` on Linux) or restart Ghostty. " +
  "On macOS, Ghostty reads `~/Library/Application Support/com.mitchellh.ghostty/` after " +
  `\`~/.config/ghostty/\`, so a \`theme\` line there wins ([configuration docs](${GHOSTTY_CONFIG_DOCS})).`;

/** Pretty JSON for settings snippets, without the outer braces' file context. */
export const settingsJson = (settings: object): string => JSON.stringify(settings, null, 2);
