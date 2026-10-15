#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadSamples,
  loadTerminalSamples,
  type Output,
  outputBytes,
  outputs,
  tokenizeSnippets,
} from "./index.ts";
import { loadInputs } from "./inputs.ts";
import { REPORT_DIR, reportData, reportPages, reportSnippets } from "./report/index.ts";

const ROOT = fileURLToPath(new URL("../../../", import.meta.url));

const current = (o: Output): Promise<Uint8Array | undefined> =>
  readFile(join(ROOT, o.path)).catch(() => undefined);

const write = async (o: Output): Promise<void> => {
  const path = join(ROOT, o.path);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, outputBytes(o));
};

const sameBytes = (a: Uint8Array | undefined, b: Uint8Array): boolean =>
  a !== undefined && Buffer.from(a).equals(Buffer.from(b));

const staleOutputs = async (all: readonly Output[]): Promise<readonly Output[]> => {
  const checked = await Promise.all(
    all.map(async (o) => ({ o, stale: !sameBytes(await current(o), outputBytes(o)) })),
  );
  return checked.filter((c) => c.stale).map((c) => c.o);
};

const build = async (): Promise<number> => {
  const all = await outputs(await loadInputs(ROOT));
  const stale = await staleOutputs(all);
  await Promise.all(stale.map(write));
  console.log(`Wrote ${stale.length} of ${all.length} generated files.`);
  return 0;
};

const check = async (): Promise<number> => {
  const all = await outputs(await loadInputs(ROOT));
  const stale = await staleOutputs(all);
  for (const o of stale) console.error(`stale: ${o.path}`);
  console.log(
    stale.length === 0
      ? `All ${all.length} generated files are up to date.`
      : `${stale.length} of ${all.length} generated files are stale. Run pnpm build.`,
  );
  return stale.length === 0 ? 0 : 1;
};

const report = async (): Promise<number> => {
  const samples = loadSamples(ROOT);
  const tokens = await tokenizeSnippets(reportSnippets(samples));
  const pages = reportPages(reportData(samples, tokens, loadTerminalSamples(ROOT)));
  await Promise.all(pages.map(write));
  console.log(`Wrote ${pages.length} pages to ${REPORT_DIR}/.`);
  return 0;
};

const run = (command: string): Promise<number> => {
  switch (command) {
    case "build":
      return build();
    case "check":
      return check();
    case "report":
      return report();
    default:
      console.error(`Unknown command "${command}". Use "build", "check" or "report".`);
      return Promise.resolve(2);
  }
};

process.exitCode = await run(process.argv[2] ?? "build");
