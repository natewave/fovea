import { fileURLToPath } from "node:url";
import { variants } from "@fovea/palette";
import { contrastChecks } from "@fovea/palette/audit";
import { beforeAll, describe, expect, it } from "vitest";
import {
  loadSamples,
  loadTerminalSamples,
  type TextOutput,
  tokenizeSnippets,
} from "../src/index.ts";
import { diffHunks, reportData, reportPages, reportSnippets } from "../src/report/index.ts";

const ROOT = fileURLToPath(new URL("../../../", import.meta.url));

describe("diffHunks", () => {
  it("strips the prefix from hunk lines and records each line's kind", () => {
    const diff = ["--- a/x", "+++ b/x", "@@ -1,3 +1,3 @@ head", " same", "-old", "+new", ""].join(
      "\n",
    );
    expect(diffHunks(diff)).toEqual({ code: "same\nold\nnew", kinds: [" ", "-", "+"] });
  });
});

describe("palette report", () => {
  let pages: readonly TextOutput[];

  const build = async (): Promise<readonly TextOutput[]> => {
    const samples = loadSamples(ROOT);
    const tokens = await tokenizeSnippets(reportSnippets(samples));
    return reportPages(reportData(samples, tokens, loadTerminalSamples(ROOT)));
  };

  beforeAll(async () => {
    pages = await build();
  });

  const page = (name: string): string => {
    const found = pages.find((p) => p.path === `dist/report/${name}.html`);
    if (found === undefined) throw new Error(`No ${name} page`);
    return found.contents;
  };

  it("writes an index and one page per variant", () => {
    expect(pages.map((p) => p.path)).toEqual([
      "dist/report/index.html",
      ...variants.map((v) => `dist/report/${v.id}.html`),
    ]);
  });

  it("is deterministic", async () => {
    expect(await build()).toEqual(pages);
  });

  it.each(variants.map((v) => v.id))("has every section on the %s page", (id) => {
    const html = page(id);
    for (const section of [
      "overview",
      "neutrals",
      "syntax",
      "accents",
      "ansi",
      "overlays",
      "contrast",
      "code",
      "editor",
      "terminal",
      "cvd",
    ]) {
      expect(html).toContain(`<section id="${section}"`);
    }
  });

  it.each(variants)("renders no failing contrast cell for $name, whose audit passes", (v) => {
    expect(contrastChecks(v).every((c) => c.pass)).toBe(true);
    expect(page(v.id)).not.toContain('<td class="fail"');
  });

  it("makes no external requests", () => {
    for (const p of pages) {
      const css = p.contents.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "";
      expect(p.contents).not.toMatch(/\b(?:src|href)="(?:https?:)?\/\//);
      expect(css).not.toContain("url(");
      expect(css).not.toContain("@import");
      expect(p.contents).not.toMatch(/<(?:script|link|img|iframe)\b/);
    }
  });

  it("never writes an absent value into markup", () => {
    for (const p of pages) {
      expect(p.contents).not.toMatch(/="[^"]*(?:undefined|NaN|\[object)/);
    }
  });
});
