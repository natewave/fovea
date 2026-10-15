/**
 * Pins VS Code's theme color reference as a fixture, so the theme's coverage is checked against
 * a known list. Run deliberately when targeting a newer VS Code:
 *
 *   node scripts/update-vscode-color-keys.ts <vscode-docs commit> <VS Code version>
 *
 * The commit is one that touched api/references/theme-color.md, for example a "VS Code release"
 * commit on https://github.com/microsoft/vscode-docs/commits/main/api/references/theme-color.md.
 */
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const OUT = join(ROOT, "fixtures/vscode/theme-color-keys.json");

interface ColorKey {
  readonly key: string;
  readonly description: string;
}

interface ColorSection {
  readonly name: string;
  readonly keys: readonly ColorKey[];
}

const withoutFrontMatter = (markdown: string): string =>
  markdown.startsWith("---\n") ? markdown.slice(markdown.indexOf("\n---\n", 4) + 5) : markdown;

/** Sections in file order, each with its `` - `key`: description `` bullets. */
const parseThemeColors = (markdown: string): readonly ColorSection[] =>
  withoutFrontMatter(markdown)
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const [heading = "", ...lines] = chunk.split("\n");
      const keys = lines.flatMap((line) => {
        const m = /^- `([A-Za-z0-9_.-]+)`: (.*)$/.exec(line);
        return m?.[1] === undefined ? [] : [{ key: m[1], description: (m[2] ?? "").trim() }];
      });
      return { name: heading.trim(), keys };
    })
    .filter((s) => s.keys.length > 0);

const [commit, version] = process.argv.slice(2);
if (commit === undefined || version === undefined) {
  console.error("Usage: node scripts/update-vscode-color-keys.ts <commit> <vscode-version>");
  process.exitCode = 2;
} else {
  const source = `https://raw.githubusercontent.com/microsoft/vscode-docs/${commit}/api/references/theme-color.md`;
  const response = await fetch(source);
  if (!response.ok) throw new Error(`${source}: HTTP ${response.status}`);
  const sections = parseThemeColors(await response.text());
  const keys = sections.flatMap((s) => s.keys.map((k) => k.key));
  if (new Set(keys).size !== keys.length) throw new Error("Duplicate keys in the reference");
  const fixture = { source, commit, vscodeVersion: version, keyCount: keys.length, sections };
  await writeFile(OUT, `${JSON.stringify(fixture, null, 2)}\n`);
  console.log(`Wrote ${keys.length} keys in ${sections.length} sections to ${OUT}.`);
}
