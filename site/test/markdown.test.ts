import { project } from "@fovea/build/project";
import { describe, expect, it } from "vitest";
import { inlineMarkdown, linkedUrls, plainText } from "../src/lib/markdown.ts";
import { cells, parseEvidence, researchSource, stats, topics } from "../src/lib/research.ts";

describe("inlineMarkdown", () => {
  it("keeps parentheses inside DOI links", () => {
    expect(inlineMarkdown("[doi](https://doi.org/10.1016/0042-6989(86)90034-9)")).toBe(
      '<a href="https://doi.org/10.1016/0042-6989(86)90034-9">doi</a>',
    );
  });

  it("renders autolinks, code, bold and emphasis, and escapes HTML", () => {
    expect(inlineMarkdown("<https://www.w3.org/TR/WCAG22/>")).toBe(
      '<a href="https://www.w3.org/TR/WCAG22/">https://www.w3.org/TR/WCAG22/</a>',
    );
    expect(inlineMarkdown("`#888` on **white** in *Ergonomics* <b>")).toBe(
      "<code>#888</code> on <strong>white</strong> in <em>Ergonomics</em> &lt;b&gt;",
    );
  });

  it("points relative links at the repository's docs", () => {
    expect(inlineMarkdown("[decision 001](decisions/001-apca-via-colorjs.md)")).toBe(
      `<a href="${project.repository}/blob/HEAD/docs/decisions/001-apca-via-colorjs.md">decision 001</a>`,
    );
  });

  it("lists linked URLs and strips markup for plain text", () => {
    const md = "[a](https://example.org/a) and <https://example.org/b> and [c](local.md)";
    expect(linkedUrls(md)).toEqual(["https://example.org/a", "https://example.org/b"]);
    expect(plainText("**bold** `code` [link](https://x.org)")).toBe("bold code link");
  });
});

describe("research parser", () => {
  it("splits table cells on unescaped pipes only", () => {
    expect(cells("| a | \\|Duv\\| ≤ 0.006 | c |")).toEqual(["a", "|Duv| ≤ 0.006", "c"]);
  });

  it("reads evidence labels and qualifiers", () => {
    expect(parseEvidence("Experiment (small, uncontrolled)")).toEqual({
      label: "Experiment",
      qualifier: "small, uncontrolled",
    });
    expect(parseEvidence("—")).toEqual({ label: undefined, qualifier: undefined });
  });

  it("reads all thirteen topics with seven fields per finding", () => {
    const all = topics(researchSource());
    expect(all.map((t) => t.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    for (const t of all) {
      expect(t.findings.length).toBeGreaterThan(0);
      for (const f of t.findings) {
        expect(f.claim).not.toBe("");
        expect(f.source).not.toBe("");
        expect(f.implication).not.toBe("");
      }
    }
    expect(stats(all).newer).toBeGreaterThan(5);
  });
});
