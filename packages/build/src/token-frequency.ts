import { hexToOklch } from "@fovea/colorlab";
import {
  type Family,
  families,
  QUIET_SYNTAX,
  ROLE_NAMES,
  type ScopeRule,
  SYNTAX_KEYS,
  type SyntaxKey,
  type SyntaxRole,
  scopeRules,
  syntaxFamily,
  variants,
} from "@fovea/palette";
import {
  type BundledLanguage,
  createHighlighter,
  type ThemedToken,
  type ThemeRegistrationRaw,
} from "shiki";
import { formatTable } from "./markdown.ts";
import type { Sample, SampleSet } from "./samples.ts";

export const SYNTAX_ROLES: readonly SyntaxRole[] = ROLE_NAMES.filter((r): r is SyntaxRole =>
  r.startsWith("syntax."),
);

const byRole = <T>(f: (role: SyntaxRole) => T): Readonly<Record<SyntaxRole, T>> =>
  // fromEntries loses the key type; SYNTAX_ROLES lists every key exactly once.
  Object.fromEntries(SYNTAX_ROLES.map((r) => [r, f(r)])) as Record<SyntaxRole, T>;

const PROBE = "fovea-probe";

/** A unique color per role, so a token's color identifies its role. */
const probeColor = (role: SyntaxRole): string =>
  `#${(SYNTAX_ROLES.indexOf(role) + 1).toString(16).padStart(6, "0")}`;

const PROBE_ROLES: ReadonlyMap<string, SyntaxRole> = new Map(
  SYNTAX_ROLES.map((r) => [probeColor(r), r]),
);

/** The role a probe-theme token color stands for. */
export const roleOfProbeColor = (color: string | undefined): SyntaxRole | undefined =>
  PROBE_ROLES.get(color?.toLowerCase() ?? "");

/**
 * A theme built from the scope rules with one color per role. Shiki applies it with the same
 * TextMate matching as VS Code, so every token's color names the role a Fovea theme gives it.
 */
export const probeTheme = (rules: readonly ScopeRule[] = scopeRules): ThemeRegistrationRaw => ({
  name: PROBE,
  type: "dark",
  settings: [
    { settings: { foreground: probeColor("syntax.plain") } },
    ...rules.map((rule) => ({
      name: rule.name,
      scope: [...rule.scope],
      settings: {
        ...(rule.role === undefined ? {} : { foreground: probeColor(rule.role) }),
        ...(rule.fontStyle === undefined ? {} : { fontStyle: rule.fontStyle.join(" ") }),
      },
    })),
  ],
});

export interface Tally {
  readonly tokens: number;
  readonly chars: number;
}

export type RoleTally = Readonly<Record<SyntaxRole, Tally>>;

const ZERO: Tally = { tokens: 0, chars: 0 };

const addTally = (a: Tally, b: Tally): Tally => ({
  tokens: a.tokens + b.tokens,
  chars: a.chars + b.chars,
});

export const sumTallies = (tallies: readonly RoleTally[]): RoleTally =>
  byRole((r) => tallies.reduce((sum, t) => addTally(sum, t[r]), ZERO));

/** Counts tokens and non-whitespace characters per role; whitespace-only tokens don't count. */
export const tallyTokens = <T extends { readonly content: string }>(
  lines: readonly (readonly T[])[],
  roleOf: (token: T) => SyntaxRole,
): RoleTally => {
  const counted = lines
    .flat()
    .map((token) => ({ role: roleOf(token), chars: token.content.replace(/\s/g, "").length }))
    .filter((t) => t.chars > 0);
  return byRole((r) =>
    counted
      .filter((t) => t.role === r)
      .reduce((sum, t) => addTally(sum, { tokens: 1, chars: t.chars }), ZERO),
  );
};

/** A token with the role and font style (Shiki's bit flags) a Fovea theme gives it. */
export interface RoleToken {
  readonly content: string;
  readonly role: SyntaxRole;
  readonly fontStyle: number;
}

export type RoleLines = readonly (readonly RoleToken[])[];

export interface Snippet {
  readonly id: string;
  readonly lang: BundledLanguage;
  readonly code: string;
}

const toRoleToken = (token: ThemedToken): RoleToken => {
  const role = roleOfProbeColor(token.color);
  if (role === undefined) throw new Error(`Token "${token.content}" has no probe color`);
  return { content: token.content, role, fontStyle: token.fontStyle ?? 0 };
};

/** Tokenizes each snippet with the probe theme, keyed by snippet id. */
export const tokenizeSnippets = async (
  snippets: readonly Snippet[],
): Promise<ReadonlyMap<string, RoleLines>> => {
  const langs = [...new Set(snippets.map((s) => s.lang))].sort();
  const theme = probeTheme();
  const highlighter = await createHighlighter({ themes: [theme], langs });
  try {
    return new Map(
      snippets.map((s) => [
        s.id,
        highlighter
          .codeToTokensBase(s.code, { lang: s.lang, theme })
          .map((line) => line.map(toRoleToken)),
      ]),
    );
  } finally {
    highlighter.dispose();
  }
};

export interface SampleTally {
  readonly sample: Sample;
  readonly tally: RoleTally;
}

/** Tokenizes every sample with the probe theme and tallies the roles it gets. */
export const tallySamples = async (samples: readonly Sample[]): Promise<readonly SampleTally[]> => {
  const tokens = await tokenizeSnippets(
    samples.map((s) => ({ id: s.path, lang: s.language.id, code: s.code })),
  );
  return samples.map((sample) => ({
    sample,
    tally: tallyTokens(tokens.get(sample.path) ?? [], (t) => t.role),
  }));
};

/** Roles that carry a syntax hue, as opposed to plain text, punctuation, comments and diffs. */
export const ACCENT_ROLES: readonly SyntaxRole[] = [
  "syntax.keyword",
  "syntax.string",
  "syntax.escape",
  "syntax.constant",
  "syntax.definition",
  "syntax.type",
];

const keyOf = (role: SyntaxRole): SyntaxKey | undefined =>
  SYNTAX_KEYS.find((k) => `syntax.${k}` === role);

const label = (role: SyntaxRole): string => role.slice("syntax.".length);

/** The hue family a syntax role is painted in; plain text, punctuation and comments have none. */
export const familyOf = (role: SyntaxRole): Family | undefined => {
  const key = keyOf(role);
  return key === undefined ? undefined : syntaxFamily[key];
};

const hueName = (role: SyntaxRole): string => {
  const family = familyOf(role);
  return family === undefined ? "neutral" : `${families[family].name} (${family})`;
};

const chromas = (role: SyntaxRole): string => {
  const key = keyOf(role);
  if (key === undefined) return "–";
  return variants.map((v) => hexToOklch(v.syntax[key]).c.toFixed(3)).join(" / ");
};

const share = (part: number, whole: number): string =>
  part === 0 || whole === 0 ? "–" : `${((100 * part) / whole).toFixed(1)}%`;

const total = (t: RoleTally, roles: readonly SyntaxRole[], field: keyof Tally): number =>
  roles.reduce((sum, r) => sum + t[r][field], 0);

export const isQuiet = (role: SyntaxRole): boolean => {
  const key = keyOf(role);
  return key !== undefined && QUIET_SYNTAX.includes(key);
};

/** Accent roles, most frequent first by the given measure. */
export const accentRanking = (tally: RoleTally, by: keyof Tally): readonly SyntaxRole[] =>
  [...ACCENT_ROLES].sort((a, b) => tally[b][by] - tally[a][by]);

const LANGUAGE_COLUMNS: readonly {
  readonly title: string;
  readonly roles: readonly SyntaxRole[];
}[] = [
  ...SYNTAX_ROLES.filter((r) => !["syntax.inserted", "syntax.deleted"].includes(r)).map((r) => ({
    title: label(r),
    roles: [r],
  })),
  { title: "diff", roles: ["syntax.inserted", "syntax.deleted"] },
];

/** The committed frequency report, as Markdown. */
export const frequencyReport = (tallies: readonly SampleTally[]): string => {
  const inSet = (set: SampleSet): readonly SampleTally[] =>
    tallies.filter((t) => t.sample.set === set);
  const sets = { corpus: inSet("corpus"), fixtures: inSet("fixtures") };
  const sum = {
    corpus: sumTallies(sets.corpus.map((t) => t.tally)),
    fixtures: sumTallies(sets.fixtures.map((t) => t.tally)),
  };
  const languageCount = (set: readonly SampleTally[]): number =>
    new Set(set.map((t) => t.sample.language.id)).size;

  const allRows = SYNTAX_ROLES.map((r) => [
    label(r),
    hueName(r),
    share(sum.corpus[r].tokens, total(sum.corpus, SYNTAX_ROLES, "tokens")),
    share(sum.corpus[r].chars, total(sum.corpus, SYNTAX_ROLES, "chars")),
    share(sum.fixtures[r].tokens, total(sum.fixtures, SYNTAX_ROLES, "tokens")),
    share(sum.fixtures[r].chars, total(sum.fixtures, SYNTAX_ROLES, "chars")),
  ]);

  const accentTokens = total(sum.corpus, ACCENT_ROLES, "tokens");
  const accentChars = total(sum.corpus, ACCENT_ROLES, "chars");
  const rankRows = accentRanking(sum.corpus, "chars").map((r, i) => [
    String(i + 1),
    label(r),
    hueName(r),
    isQuiet(r) ? "quiet" : "saturated",
    chromas(r),
    share(sum.corpus[r].chars, accentChars),
    share(sum.corpus[r].tokens, accentTokens),
  ]);
  const order = (by: keyof Tally): string =>
    accentRanking(sum.corpus, by)
      .map((r) => label(r))
      .join(", ");

  const languages = [...new Set(tallies.map((t) => t.sample.language.name))].sort();
  const languageRows = languages.map((name) => {
    const files = tallies.filter((t) => t.sample.language.name === name);
    const tally = sumTallies(files.map((t) => t.tally));
    const chars = total(tally, SYNTAX_ROLES, "chars");
    return [
      name,
      String(files.length),
      String(chars),
      ...LANGUAGE_COLUMNS.map((c) => share(total(tally, c.roles, "chars"), chars)),
    ];
  });

  return [
    "<!-- Generated by `pnpm build` from packages/build/src/token-frequency.ts. Do not edit. -->",
    "",
    "# Syntax token frequency",
    "",
    "How often each syntax role appears when [Shiki](https://shiki.style) tokenizes Fovea's code",
    "samples with the TextMate mapping in",
    "[`packages/palette/src/scopes.ts`](../../packages/palette/src/scopes.ts). Hues follow these",
    'counts: the most frequent accents get the most legible hues (see `docs/design.md`, "Syntax").',
    "",
    `- **Corpus:** ${sets.corpus.length} files of unmodified open-source code in`,
    `  ${languageCount(sets.corpus)} languages ([\`fixtures/corpus/\`](../../fixtures/corpus/README.md)).`,
    "  This is the better guide to real code.",
    `- **Fixtures:** ${sets.fixtures.length} files Fovea wrote to exercise each grammar, in`,
    `  ${languageCount(sets.fixtures)} languages ([\`fixtures/code/\`](../../fixtures/code/)). They pack`,
    "  many constructs into little code, so they overstate rare roles.",
    "",
    "A token is a run of text that gets one style, so neighbouring plain text merges into one",
    "token. Characters count everything except whitespace.",
    "",
    "## All roles",
    "",
    formatTable(
      ["Role", "Hue", "Corpus tokens", "Corpus characters", "Fixture tokens", "Fixture characters"],
      allRows,
      ["left", "left", "right", "right", "right", "right"],
    ),
    "",
    "## Accent roles, most frequent first",
    "",
    "Shares of the corpus characters and tokens that carry a syntax hue, ranked by characters:",
    "how much text each hue covers. Chroma is OKLCH chroma in",
    `${variants.map((v) => v.name).join(" / ")}.`,
    "",
    formatTable(["Rank", "Role", "Hue", "Tier", "Chroma", "Characters", "Tokens"], rankRows, [
      "right",
      "left",
      "left",
      "left",
      "left",
      "right",
      "right",
    ]),
    "",
    `- By characters: ${order("chars")}.`,
    `- By tokens: ${order("tokens")}.`,
    "",
    "## By language",
    "",
    "Share of each language's non-whitespace characters, fixtures and corpus combined.",
    "",
    formatTable(
      ["Language", "Files", "Characters", ...LANGUAGE_COLUMNS.map((c) => c.title)],
      languageRows,
      ["left", "right", "right", ...LANGUAGE_COLUMNS.map(() => "right" as const)],
    ),
    "",
  ].join("\n");
};
