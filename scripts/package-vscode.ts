/**
 * Packages the VS Code extension into `dist/vscode/fovea.vsix` with `@vscode/vsce`. Run through
 * `pnpm package:vscode`, which regenerates the extension's files first.
 *
 * vsce runs through `pnpm dlx` at a pinned version rather than as a dev dependency, so installing
 * the workspace doesn't pull in its publishing dependencies. Set `VSCE_BIN` to use a local vsce.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isPlaceholder, project } from "../packages/build/src/project.ts";

export const VSCE = "@vscode/vsce@4.0.0";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const out = join(ROOT, project.vsixPath);

if (isPlaceholder(project.publisher)) {
  console.warn(
    `Packaging with the placeholder publisher "${project.publisher}". The package installs ` +
      "locally, but set the real publisher in packages/build/src/project.ts before publishing.",
  );
}

const args = ["package", "--no-dependencies", "--out", out];
const [command, commandArgs] =
  process.env.VSCE_BIN === undefined
    ? ["pnpm", ["dlx", VSCE, ...args]]
    : [process.env.VSCE_BIN, args];

mkdirSync(dirname(out), { recursive: true });
execFileSync(command, commandArgs, {
  cwd: join(ROOT, "ports/vscode"),
  stdio: "inherit",
  shell: process.platform === "win32",
});
