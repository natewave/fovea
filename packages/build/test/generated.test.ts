import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";
import { type Output, outputBytes, outputs } from "../src/index.ts";
import { loadInputs } from "../src/inputs.ts";

/**
 * Generated files are never edited by hand: each one on disk must equal what `pnpm build` writes
 * now. `pnpm check:stale` checks the same thing through git in CI.
 */
const ROOT = fileURLToPath(new URL("../../../", import.meta.url));

describe("generated files on disk", () => {
  let generated: readonly Output[] = [];

  beforeAll(async () => {
    generated = await outputs(await loadInputs(ROOT));
  });

  it("are all present and up to date (run `pnpm build` if this fails)", () => {
    const stale = generated
      .filter((o) => {
        const onDisk = (() => {
          try {
            return readFileSync(join(ROOT, o.path));
          } catch {
            return undefined;
          }
        })();
        return onDisk === undefined || !Buffer.from(outputBytes(o)).equals(onDisk);
      })
      .map((o) => o.path);
    expect(stale).toEqual([]);
  });
});
