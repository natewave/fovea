import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Inputs } from "./index.ts";
import { loadSamples } from "./samples.ts";
import { loadColorReference } from "./vscode/reference.ts";

/** Everything the generators read from the repository. */
export const loadInputs = async (root: string): Promise<Inputs> => ({
  samples: loadSamples(root),
  colorReference: loadColorReference(root),
  license: await readFile(join(root, "LICENSE"), "utf8"),
  changelog: await readFile(join(root, "CHANGELOG.md"), "utf8"),
});
