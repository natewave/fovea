import { readFileSync } from "node:fs";
import { join } from "node:path";

/** VS Code's theme color reference, pinned by scripts/update-vscode-color-keys.ts. */
export const COLOR_REFERENCE_PATH = "fixtures/vscode/theme-color-keys.json";

export interface ColorKeyInfo {
  readonly key: string;
  readonly description: string;
}

export interface ColorReferenceSection {
  readonly name: string;
  readonly keys: readonly ColorKeyInfo[];
}

export interface ColorReference {
  readonly source: string;
  readonly commit: string;
  readonly vscodeVersion: string;
  readonly keyCount: number;
  readonly sections: readonly ColorReferenceSection[];
}

const isColorReference = (value: unknown): value is ColorReference =>
  typeof value === "object" &&
  value !== null &&
  "sections" in value &&
  Array.isArray(value.sections) &&
  "vscodeVersion" in value &&
  typeof value.vscodeVersion === "string";

export const loadColorReference = (root: string): ColorReference => {
  const parsed: unknown = JSON.parse(readFileSync(join(root, COLOR_REFERENCE_PATH), "utf8"));
  if (!isColorReference(parsed))
    throw new Error(`${COLOR_REFERENCE_PATH} is not a color reference`);
  return parsed;
};

export const referenceKeys = (reference: ColorReference): readonly string[] =>
  reference.sections.flatMap((s) => s.keys.map((k) => k.key));

export type OpacityRule = "translucent" | "opaque";

/** What the reference requires of a key's alpha, from the wording of its description. */
export const opacityRule = (description: string): OpacityRule | undefined => {
  if (/must not be opaque|should have transparency/i.test(description)) return "translucent";
  if (/should be opaque|^opaque /i.test(description)) return "opaque";
  return undefined;
};
