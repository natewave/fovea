import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Checks that the external links on the built website still answer. Publishers often refuse
 * automated requests, so 401, 403, 429 and 999 count as warnings; missing pages, server errors
 * and network failures fail the run. The scheduled Links workflow runs this after
 * `pnpm site:build`; it never blocks a pull request.
 */
const DIST = fileURLToPath(new URL("../site/dist/", import.meta.url));
const CONCURRENCY = 8;
const TIMEOUT_MS = 20_000;
const WARN_STATUSES: ReadonlySet<number> = new Set([401, 403, 429, 999]);

const walk = (dir: string): readonly string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const externalLinks = (): readonly string[] => [
  ...new Set(
    walk(DIST)
      .filter((f) => f.endsWith(".html"))
      .flatMap((f) => [
        ...readFileSync(f, "utf8").matchAll(/<a\b[^>]*\shref="(https?:\/\/[^"]+)"/g),
      ])
      .map((m) => (m[1] ?? "").replaceAll("&amp;", "&"))
      .filter((url) => !url.includes("PLACEHOLDER")),
  ),
];

interface Result {
  readonly url: string;
  readonly status: number | "error";
  readonly detail: string;
}

const check = async (url: string): Promise<Result> => {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "user-agent": "Mozilla/5.0 (compatible; fovea-link-check)" },
    });
    await response.body?.cancel();
    return { url, status: response.status, detail: response.statusText };
  } catch (error) {
    return { url, status: "error", detail: error instanceof Error ? error.message : String(error) };
  }
};

const chunks = <T>(items: readonly T[], size: number): readonly (readonly T[])[] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, (i + 1) * size),
  );

const checkAll = async (urls: readonly string[]): Promise<readonly Result[]> => {
  const batches = chunks(urls, CONCURRENCY);
  const results: Result[][] = [];
  for (const batch of batches) results.push(await Promise.all(batch.map(check)));
  return results.flat();
};

const isWarning = (r: Result): boolean =>
  typeof r.status === "number" && WARN_STATUSES.has(r.status);
const isFailure = (r: Result): boolean => r.status === "error" || r.status >= 400;

const urls = externalLinks();
const results = await checkAll(urls);
const warnings = results.filter(isWarning);
const failures = results.filter((r) => isFailure(r) && !isWarning(r));

for (const r of warnings) console.warn(`warn ${r.status} ${r.url}`);
for (const r of failures) console.error(`FAIL ${r.status} ${r.url} ${r.detail}`);
console.log(
  `${urls.length} links: ${failures.length} broken, ${warnings.length} refused automated requests`,
);
process.exitCode = failures.length > 0 ? 1 : 0;
