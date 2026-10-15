import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { variants } from "@fovea/palette";
import { describe, expect, it } from "vitest";
import {
  ghosttyConfigNote,
  ghosttySteps,
  ghosttyThemeLine,
  marketplaceCommand,
  nightSetting,
  recommendedSettings,
  settingsJson,
  vscodeSourceSteps,
} from "../src/install.ts";
import { isPlaceholder, project } from "../src/project.ts";

const ROOT = fileURLToPath(new URL("../../../", import.meta.url));

const SKIP_DIRS = new Set(["node_modules", "dist", ".astro", ".scratch", "corpus", "code"]);

const markdownFiles = (dir: string): readonly string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return SKIP_DIRS.has(name) ? [] : markdownFiles(path);
    return name.endsWith(".md") ? [path] : [];
  });

const FILES: readonly string[] = [
  ...["README.md", "CONTRIBUTING.md", "CHANGELOG.md"].map((f) => join(ROOT, f)),
  ...["docs", "ports", "fixtures", "packages"].flatMap((d) => markdownFiles(join(ROOT, d))),
  join(ROOT, "fixtures/corpus/README.md"),
];

/** GitHub's heading anchors: lowercase, punctuation dropped, spaces as hyphens, repeats numbered. */
const slug = (heading: string): string =>
  heading
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s/g, "-");

const withoutCode = (text: string): string =>
  text.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");

const anchors = (file: string): ReadonlySet<string> => {
  const seen = new Map<string, number>();
  return new Set(
    withoutCode(readFileSync(file, "utf8"))
      .split("\n")
      .filter((line) => /^#{1,6} /.test(line))
      .map((line) => {
        const base = slug(line.replace(/^#+ /, ""));
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        return count === 0 ? base : `${base}-${count}`;
      }),
  );
};

/** Relative link targets in Markdown links and HTML `href`/`src` attributes. */
const links = (file: string): readonly string[] => {
  const text = withoutCode(readFileSync(file, "utf8"));
  return [
    ...[...text.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((m) => m[1] ?? ""),
    ...[...text.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1] ?? ""),
  ].filter((href) => !/^([a-z]+:|\/\/)/i.test(href));
};

describe("Markdown docs", () => {
  it("cover the expected files", () => {
    expect(FILES.length).toBeGreaterThan(25);
  });

  it("link only to files and anchors that exist", () => {
    const broken = FILES.flatMap((file) =>
      links(file).flatMap((href) => {
        const [path = "", anchor] = href.split("#");
        const target = path === "" ? file : resolve(dirname(file), decodeURIComponent(path));
        const from = relative(ROOT, file);
        if (!existsSync(target)) return [`${from} -> ${href} (no such file)`];
        if (
          anchor !== undefined &&
          anchor !== "" &&
          target.endsWith(".md") &&
          !anchors(target).has(anchor)
        ) {
          return [`${from} -> ${href} (no such heading)`];
        }
        return [];
      }),
    );
    expect(broken).toEqual([]);
  });
});

describe("README", () => {
  const readme = readFileSync(join(ROOT, "README.md"), "utf8");

  it("shows the install steps and settings exactly as install.ts defines them", () => {
    const blocks = [
      vscodeSourceSteps.join("\n"),
      ghosttySteps.join("\n"),
      ghosttyThemeLine,
      settingsJson(recommendedSettings),
      settingsJson(nightSetting),
      ghosttyConfigNote,
    ];
    for (const block of blocks)
      expect(readme, "update README.md to match install.ts").toContain(block);
  });

  it("offers the Marketplace install only once the extension has a publisher", () => {
    expect(readme.includes(marketplaceCommand), "update README.md's install section").toBe(
      !isPlaceholder(project.publisher),
    );
    expect(readme).not.toContain("PLACEHOLDER");
  });

  it("describes each variant as the palette does", () => {
    for (const v of variants) expect(readme).toContain(v.description);
  });

  it("links to the project's website", () => {
    expect(readme, "update README.md to match project.ts").toContain(project.homepage);
  });

  it("shows the generated previews", () => {
    for (const v of variants) expect(readme).toContain(`docs/assets/preview-${v.id}.svg`);
  });
});
