import { palette, variants } from "@fovea/palette";
import { assetOutputs, previewSnippet } from "./assets.ts";
import { ghosttyOutputs } from "./ghostty.ts";
import { itermOutputs } from "./iterm.ts";
import type { Output } from "./output.ts";
import { paletteCss } from "./palette-css.ts";
import { paletteJson } from "./palette-json.ts";
import { rolesReport } from "./roles-doc.ts";
import type { Sample } from "./samples.ts";
import { frequencyReport, tallySamples, tokenizeSnippets } from "./token-frequency.ts";
import { vscodeOutputs } from "./vscode/index.ts";
import type { ColorReference } from "./vscode/reference.ts";

export * from "./ansi.ts";
export * from "./assets.ts";
export * from "./ghostty.ts";
export * from "./identity.ts";
export * from "./install.ts";
export * from "./iterm.ts";
export * from "./markdown.ts";
export * from "./output.ts";
export * from "./palette-css.ts";
export * from "./palette-json.ts";
export * from "./png.ts";
export * from "./preview.ts";
export * from "./project.ts";
export * from "./roles-doc.ts";
export * from "./samples.ts";
export * from "./terminal.ts";
export * from "./token-frequency.ts";

/** What the generators read besides the palette. */
export interface Inputs {
  readonly samples: readonly Sample[];
  readonly colorReference: ColorReference;
  /** The repository's LICENSE, copied into each port. */
  readonly license: string;
  /** The repository's CHANGELOG.md, copied into the extension. */
  readonly changelog: string;
}

/** Every generated file. Deterministic: the same palette and inputs always give the same bytes. */
export const outputs = async (inputs: Inputs): Promise<readonly Output[]> => {
  const snippet = previewSnippet(inputs.samples);
  const [tallies, tokens] = await Promise.all([
    tallySamples(inputs.samples),
    tokenizeSnippets([snippet]),
  ]);
  return [
    { path: "ports/palette/fovea.json", contents: paletteJson(variants) },
    { path: "ports/palette/fovea.css", contents: paletteCss(palette) },
    { path: "docs/generated/token-frequency.md", contents: frequencyReport(tallies) },
    { path: "docs/generated/roles.md", contents: rolesReport() },
    ...vscodeOutputs({
      reference: inputs.colorReference,
      license: inputs.license,
      changelog: inputs.changelog,
    }),
    ...ghosttyOutputs(),
    ...itermOutputs(),
    ...assetOutputs(tokens.get(snippet.id) ?? []),
  ];
};
