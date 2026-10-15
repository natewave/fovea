import { fileURLToPath } from "node:url";
import { type SyntaxRole, scopeRules } from "@fovea/palette";
import { type BundledLanguage, createHighlighter } from "shiki";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  ACCENT_ROLES,
  accentRanking,
  familyOf,
  frequencyReport,
  isQuiet,
  loadSamples,
  probeTheme,
  roleOfProbeColor,
  type SampleTally,
  sumTallies,
  tallySamples,
  tallyTokens,
} from "../src/index.ts";

const ROOT = fileURLToPath(new URL("../../../", import.meta.url));

const LANGS: readonly BundledLanguage[] = [
  "csharp",
  "css",
  "diff",
  "go",
  "html",
  "json",
  "markdown",
  "python",
  "rust",
  "shellscript",
  "swift",
  "typescript",
  "yaml",
];

type Highlighter = Awaited<ReturnType<typeof createHighlighter>>;

interface Token {
  readonly text: string;
  readonly role: SyntaxRole | undefined;
  readonly fontStyle: number;
}

const BOLD = 2;
const UNDERLINE = 4;
const STRIKETHROUGH = 8;

describe("scope mapping, applied by Shiki", () => {
  const theme = probeTheme();
  let highlighter: Highlighter;

  beforeAll(async () => {
    highlighter = await createHighlighter({ themes: [theme], langs: [...LANGS] });
  });

  afterAll(() => highlighter.dispose());

  const tokens = (code: string, lang: BundledLanguage): readonly Token[] =>
    highlighter
      .codeToTokensBase(code, { lang, theme })
      .flat()
      .filter((t) => t.content.trim() !== "")
      .map((t) => ({
        text: t.content.trim(),
        role: roleOfProbeColor(t.color),
        fontStyle: t.fontStyle ?? 0,
      }));

  /** The role of the first occurrence of `text`, or undefined if it spans more than one role. */
  const roleOf = (code: string, lang: BundledLanguage, text: string): SyntaxRole | undefined => {
    const start = code.indexOf(text);
    const end = start + text.length;
    const roles = new Set(
      highlighter
        .codeToTokensBase(code, { lang, theme })
        .flat()
        .filter((t) => t.offset < end && t.offset + t.content.length > start)
        .map((t) => roleOfProbeColor(t.color)),
    );
    return start >= 0 && roles.size === 1 ? [...roles][0] : undefined;
  };

  it("keeps calls plain and colors definitions", () => {
    const code = "function parse() { return render(); }";
    expect(roleOf(code, "typescript", "parse")).toBe("syntax.definition");
    expect(roleOf(code, "typescript", "render")).toBe("syntax.plain");
  });

  it("keeps const-declared names plain but colors enum members", () => {
    expect(roleOf("const limit = 1;", "typescript", "limit")).toBe("syntax.plain");
    expect(roleOf("enum E { Member }", "typescript", "Member")).toBe("syntax.constant");
  });

  it("paints whole regular expressions, delimiters included, as escapes", () => {
    const regex = tokens("const r = /^a+$/g;", "typescript").filter((t) => t.text.includes("a+"));
    expect(regex.map((t) => t.role)).toEqual(["syntax.escape"]);
  });

  it("marks interpolation delimiters and keeps the code inside plain", () => {
    // biome-ignore lint/suspicious/noTemplateCurlyInString: the snippet is TypeScript source.
    const code = "const s = `a ${b} c`;";
    expect(roleOf(code, "typescript", "${")).toBe("syntax.escape");
    expect(roleOf(code, "typescript", "b")).toBe("syntax.plain");
    expect(roleOf('echo "$HOME/x"', "shellscript", "$")).toBe("syntax.escape");
    expect(roleOf('echo "$HOME/x"', "shellscript", "HOME")).toBe("syntax.plain");
  });

  it("keeps doc-comment tags and docstrings in the comment color", () => {
    expect(roleOf("/** @param x the value */", "typescript", "@param")).toBe("syntax.comment");
    expect(roleOf('def f():\n    """Docs."""', "python", "Docs.")).toBe("syntax.comment");
  });

  it("colors only the @ of a TypeScript decorator", () => {
    const code = "class A { @Input() name = 1; }";
    expect(roleOf(code, "typescript", "@")).toBe("syntax.keyword");
    expect(roleOf(code, "typescript", "Input")).toBe("syntax.plain");
  });

  it("treats built-in types as types in every grammar", () => {
    expect(roleOf("var s string", "go", "string")).toBe("syntax.type");
    expect(roleOf("string s;", "csharp", "string")).toBe("syntax.type");
    expect(roleOf("let n: u8 = 1;", "rust", "u8")).toBe("syntax.type");
  });

  it("gives keys in JSON, YAML and CSS the type color", () => {
    const json = tokens('{ "key": "value" }', "json");
    expect(json.filter((t) => t.role === "syntax.type").map((t) => t.text)).toEqual(['"key"']);
    expect(roleOf("name: Fovea", "yaml", "name")).toBe("syntax.type");
    expect(roleOf("a { margin: 1rem; }", "css", "margin")).toBe("syntax.type");
    expect(roleOf("a { margin: 1rem; }", "css", "1rem")).toBe("syntax.constant");
  });

  it("keeps argument labels plain", () => {
    expect(roleOf("func add(_ name: String) {}", "swift", "add")).toBe("syntax.definition");
    expect(roleOf("func add(_ name: String) {}", "swift", "name")).toBe("syntax.plain");
  });

  it("styles Markdown headings, links and code", () => {
    const heading = tokens("# Title", "markdown").find((t) => t.text === "Title");
    expect(heading).toEqual({ text: "Title", role: "syntax.definition", fontStyle: BOLD });
    const link = tokens("[docs](https://example.org)", "markdown").find((t) => t.text === "docs");
    expect(link).toEqual({ text: "docs", role: "syntax.type", fontStyle: UNDERLINE });
    expect(roleOf("Use `code` here.", "markdown", "`code`")).toBe("syntax.string");
    expect(roleOf("Text\n\n---\n", "markdown", "---")).toBe("syntax.punctuation");
  });

  it("uses the semantic pair for diff lines, markers included", () => {
    const code = "@@ -1 +1 @@\n-old\n+new\n";
    expect(roleOf(code, "diff", "-old")).toBe("syntax.deleted");
    expect(roleOf(code, "diff", "+new")).toBe("syntax.inserted");
    expect(roleOf(code, "diff", "@@ -1 +1 @@")).toBe("syntax.keyword");
  });

  it("underlines invalid code in red, and strikes through deprecated code without the red", () => {
    const invalid = tokens('{ "a" 1 }', "json").find((t) => t.text === "1");
    expect(invalid).toEqual({ text: "1", role: "syntax.invalid", fontStyle: UNDERLINE });
    const backticks = tokens("x = `y`", "python").find((t) => t.text === "`y`");
    expect(backticks).toEqual({ text: "`y`", role: "syntax.plain", fontStyle: STRIKETHROUGH });
    const tag = tokens("<center>old</center>", "html").find((t) => t.text === "center");
    expect(tag).toEqual({ text: "center", role: "syntax.keyword", fontStyle: STRIKETHROUGH });
  });
});

describe("tallyTokens", () => {
  it("counts tokens and non-whitespace characters per role", () => {
    const roles: Readonly<Record<string, SyntaxRole>> = {
      a: "syntax.keyword",
      b: "syntax.string",
    };
    const tally = tallyTokens(
      [
        [
          { content: "const", offset: 0, color: "a" },
          { content: " ", offset: 5, color: "b" },
          { content: '"a b"', offset: 6, color: "b" },
        ],
      ],
      (t) => roles[t.color ?? ""] ?? "syntax.plain",
    );
    expect(tally["syntax.keyword"]).toEqual({ tokens: 1, chars: 5 });
    expect(tally["syntax.string"]).toEqual({ tokens: 1, chars: 4 });
    expect(tally["syntax.plain"]).toEqual({ tokens: 0, chars: 0 });
  });
});

describe("token frequency over the samples", () => {
  let tallies: readonly SampleTally[];

  beforeAll(async () => {
    tallies = await tallySamples(loadSamples(ROOT));
  }, 60_000);

  it("finds every accent role in both the fixtures and the corpus", () => {
    for (const set of ["fixtures", "corpus"] as const) {
      const sum = sumTallies(tallies.filter((t) => t.sample.set === set).map((t) => t.tally));
      for (const role of ACCENT_ROLES)
        expect(sum[role].tokens, `${set} ${role}`).toBeGreaterThan(0);
    }
  });

  it("gives the quiet colors to the two most frequent accent roles", () => {
    const corpus = sumTallies(tallies.filter((t) => t.sample.set === "corpus").map((t) => t.tally));
    expect(accentRanking(corpus, "tokens").slice(0, 2).every(isQuiet)).toBe(true);
  });

  it("gives green, yellow and orange to the saturated roles that cover the most text", () => {
    const corpus = sumTallies(tallies.filter((t) => t.sample.set === "corpus").map((t) => t.tally));
    const saturated = accentRanking(corpus, "chars").filter((r) => !isQuiet(r));
    expect(new Set(saturated.slice(0, 3).map(familyOf))).toEqual(
      new Set(["green", "yellow", "orange"]),
    );
  });

  it("renders the same report twice", () => {
    expect(frequencyReport(tallies)).toBe(frequencyReport(tallies));
  });

  it("builds the probe theme from every scope rule", () => {
    expect(probeTheme().settings).toHaveLength(scopeRules.length + 1);
  });
});
