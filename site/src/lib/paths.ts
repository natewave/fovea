import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

/** A site path under the configured base. `BASE_URL` always ends in a slash. */
export const url = (path = ""): string => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

/** The repository root, found from the working directory so it survives bundling. */
export const repoRoot = (from: string = process.cwd()): string =>
  existsSync(join(from, "pnpm-workspace.yaml"))
    ? from
    : dirname(from) === from
      ? process.cwd()
      : repoRoot(dirname(from));
