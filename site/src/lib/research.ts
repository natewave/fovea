import { readFileSync } from "node:fs";
import { join } from "node:path";
import { project } from "@fovea/build/project";
import { linkedUrls, plainText } from "./markdown.ts";
import { repoRoot } from "./paths.ts";

/**
 * Reads docs/research.md, so whatever the site shows from the dossier, such as the palette page's
 * benchmark, is exactly what was verified.
 */
export const RESEARCH_PATH = "docs/research.md";

export const researchSource = (root: string = repoRoot()): string =>
  readFileSync(join(root, RESEARCH_PATH), "utf8");

/** A section of the dossier on GitHub, by its heading's anchor. */
export const dossierUrl = (anchor: string): string =>
  `${project.repository}/blob/HEAD/${RESEARCH_PATH}#${anchor}`;

/** The text between a `## ` heading and the next one. */
export const section = (source: string, heading: string): string => {
  const start = source.indexOf(`\n## ${heading}\n`);
  if (start < 0) throw new Error(`docs/research.md has no "${heading}" section`);
  const body = source.slice(start + heading.length + 5);
  const end = body.indexOf("\n## ");
  return end < 0 ? body : body.slice(0, end);
};

/** Splits a Markdown table row on unescaped pipes. */
export const cells = (row: string): readonly string[] =>
  row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim().replaceAll("\\|", "|"));

/** The body rows of every table in a block of Markdown. */
export const tableRows = (block: string): readonly (readonly string[])[] =>
  block
    .split("\n")
    .filter((line) => line.startsWith("|"))
    .filter((line) => !/^\|[\s:|-]+\|$/.test(line))
    .filter((line) => !/^\|\s*(Claim|Row|Theme)\s*\|/.test(line))
    .map(cells);

const paragraphs = (block: string): readonly string[] =>
  block
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p !== "" && !p.startsWith("|") && !p.startsWith("#"));

export type EvidenceLabel = "Systematic review" | "Experiment" | "Mechanism" | "Expert opinion";

export const EVIDENCE_LABELS: readonly EvidenceLabel[] = [
  "Systematic review",
  "Experiment",
  "Mechanism",
  "Expert opinion",
];

export interface Evidence {
  readonly label: EvidenceLabel | undefined;
  /** Such as "small" or "low reliability". */
  readonly qualifier: string | undefined;
}

export const parseEvidence = (cell: string): Evidence => {
  const label = EVIDENCE_LABELS.find((l) => cell.startsWith(l));
  const qualifier = /\(([^)]+)\)/.exec(cell)?.[1];
  return { label, qualifier };
};

export interface Finding {
  readonly claim: string;
  readonly source: string;
  readonly studyType: string;
  readonly n: string;
  readonly result: string;
  readonly evidence: Evidence;
  readonly implication: string;
  readonly isNew: boolean;
}

export interface Topic {
  readonly number: number;
  readonly title: string;
  readonly id: string;
  readonly intro: readonly string[];
  readonly findings: readonly Finding[];
}

const slug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const topics = (source: string): readonly Topic[] =>
  section(source, "Evidence table")
    .split("\n### ")
    .slice(1)
    .map((block) => {
      const [heading = "", ...rest] = block.split("\n");
      const match = /^(\d+)\.\s+(.*)$/.exec(heading);
      const title = match?.[2] ?? heading;
      const body = rest.join("\n");
      return {
        number: Number(match?.[1] ?? 0),
        title,
        id: slug(title),
        intro: paragraphs(body),
        findings: tableRows(body).map(
          ([
            claim = "",
            src = "",
            studyType = "",
            n = "",
            result = "",
            evidence = "",
            implication = "",
          ]) => ({
            claim: claim.replace(/\s*\*\*\(new\)\*\*/, ""),
            source: src,
            studyType,
            n,
            result,
            evidence: parseEvidence(evidence),
            implication,
            isNew: claim.includes("**(new)**"),
          }),
        ),
      };
    });

export interface Verdict {
  readonly row: string;
  readonly topic: string;
  readonly verdict: string;
  readonly correction: string;
}

export const verdicts = (source: string): readonly Verdict[] =>
  tableRows(section(source, "Verdicts on the brief's research table")).map(
    ([row = "", topic = "", verdict = "", correction = ""]) => ({
      row,
      topic,
      verdict,
      correction,
    }),
  );

/** The bullets of a section, such as "Contested or unknown". */
export const bullets = (source: string, heading: string): readonly string[] =>
  section(source, heading)
    .split("\n")
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2));

export const methodParagraph = (source: string): string =>
  source
    .split("\n")
    .find((line) => line.startsWith("**Method.**"))
    ?.replace("**Method.** ", "") ?? "";

export interface BenchmarkRow {
  readonly theme: string;
  readonly text: string;
  readonly background: string;
  readonly lc: string;
  readonly wcag: string;
}

export const benchmark = (source: string): readonly BenchmarkRow[] =>
  tableRows(section(source, "Benchmark: default text on its own background")).map(
    ([theme = "", text = "", background = "", lc = "", wcag = ""]) => ({
      theme,
      text: plainText(text),
      background: plainText(background),
      lc,
      wcag,
    }),
  );

export interface Stats {
  readonly findings: number;
  readonly sources: number;
  readonly newer: number;
  readonly byLabel: Readonly<Record<EvidenceLabel, number>>;
}

export const stats = (all: readonly Topic[]): Stats => {
  const findings = all.flatMap((t) => t.findings);
  return {
    findings: findings.length,
    sources: new Set(findings.flatMap((f) => linkedUrls(f.source))).size,
    newer: findings.filter((f) => f.isNew).length,
    byLabel: Object.fromEntries(
      EVIDENCE_LABELS.map((l) => [l, findings.filter((f) => f.evidence.label === l).length]),
    ) as Record<EvidenceLabel, number>,
  };
};
