import { palette, type Variant, variants } from "@fovea/palette";
import { iconPng } from "../identity.ts";
import type { Output } from "../output.ts";
import { resolveWorkbenchColors } from "./colors.ts";
import { coverageReport } from "./coverage.ts";
import { extensionManifest, manifestJson, THEMES_DIR } from "./manifest.ts";
import { extensionReadme } from "./readme.ts";
import { type ColorReference, referenceKeys } from "./reference.ts";
import { themeFileName, themeJson, vscodeTheme } from "./theme.ts";

export * from "./audit.ts";
export * from "./colors.ts";
export * from "./coverage.ts";
export * from "./manifest.ts";
export * from "./readme.ts";
export * from "./reference.ts";
export * from "./theme.ts";

export const VSCODE_DIR = "ports/vscode";

/** The variant whose colors the icon and the Marketplace banner use. */
export const BRAND_VARIANT: Variant = palette.dusk;

export interface VscodeInputs {
  readonly reference: ColorReference;
  readonly license: string;
  readonly changelog: string;
}

/** The extension's files, and the coverage report that documents its color mapping. */
export const vscodeOutputs = ({
  reference,
  license,
  changelog,
}: VscodeInputs): readonly Output[] => {
  const keyOrder = referenceKeys(reference);
  return [
    ...variants.map((v) => ({
      path: `${VSCODE_DIR}/${THEMES_DIR}/${themeFileName(v)}`,
      contents: themeJson(vscodeTheme(v, keyOrder)),
    })),
    {
      path: `${VSCODE_DIR}/package.json`,
      contents: manifestJson(extensionManifest(variants, BRAND_VARIANT)),
    },
    { path: `${VSCODE_DIR}/README.md`, contents: extensionReadme(variants) },
    { path: `${VSCODE_DIR}/CHANGELOG.md`, contents: changelog },
    { path: `${VSCODE_DIR}/LICENSE`, contents: license },
    { path: `${VSCODE_DIR}/icon.png`, contents: iconPng(BRAND_VARIANT) },
    {
      path: "docs/generated/vscode-coverage.md",
      contents: coverageReport(reference, variants, (v) => resolveWorkbenchColors(v, keyOrder)),
    },
  ];
};
