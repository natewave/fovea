import { readdirSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import type { BundledLanguage } from "shiki";

export interface Language {
  /** Shiki's grammar id. */
  readonly id: BundledLanguage;
  readonly name: string;
}

const BY_EXTENSION: Readonly<Record<string, Language>> = {
  ".c": { id: "c", name: "C" },
  ".cpp": { id: "cpp", name: "C++" },
  ".cs": { id: "csharp", name: "C#" },
  ".css": { id: "css", name: "CSS" },
  ".diff": { id: "diff", name: "Diff" },
  ".go": { id: "go", name: "Go" },
  ".html": { id: "html", name: "HTML" },
  ".java": { id: "java", name: "Java" },
  ".js": { id: "javascript", name: "JavaScript" },
  ".json": { id: "json", name: "JSON" },
  ".kt": { id: "kotlin", name: "Kotlin" },
  ".md": { id: "markdown", name: "Markdown" },
  ".php": { id: "php", name: "PHP" },
  ".py": { id: "python", name: "Python" },
  ".rb": { id: "ruby", name: "Ruby" },
  ".rs": { id: "rust", name: "Rust" },
  ".scala": { id: "scala", name: "Scala" },
  ".sh": { id: "shellscript", name: "Shell" },
  ".sql": { id: "sql", name: "SQL" },
  ".swift": { id: "swift", name: "Swift" },
  ".toml": { id: "toml", name: "TOML" },
  ".ts": { id: "typescript", name: "TypeScript" },
  ".yaml": { id: "yaml", name: "YAML" },
};

const DOCKERFILE: Language = { id: "docker", name: "Dockerfile" };

/** Licence and provenance files that sit next to the corpus samples. */
const NOT_CODE = /^(README|LICENSE|COPYING|NOTICE)/;

export const languageOf = (path: string): Language | undefined => {
  const name = basename(path);
  if (NOT_CODE.test(name)) return undefined;
  return name === "Dockerfile" ? DOCKERFILE : BY_EXTENSION[extname(name)];
};

/** `fixtures` are Fovea's own samples; `corpus` is unmodified open-source code. */
export type SampleSet = "fixtures" | "corpus";

export interface Sample {
  /** Path relative to the repository root, with forward slashes. */
  readonly path: string;
  readonly set: SampleSet;
  readonly language: Language;
  readonly code: string;
}

export const SAMPLE_DIRS: Readonly<Record<SampleSet, string>> = {
  fixtures: "fixtures/code",
  corpus: "fixtures/corpus",
};

const samplesIn = (root: string, set: SampleSet): readonly Sample[] =>
  readdirSync(join(root, SAMPLE_DIRS[set]), { recursive: true, encoding: "utf8" })
    .map((file) => `${SAMPLE_DIRS[set]}/${file.replaceAll("\\", "/")}`)
    .sort()
    .flatMap((path) => {
      const language = languageOf(path);
      return language
        ? [{ path, set, language, code: readFileSync(join(root, path), "utf8") }]
        : [];
    });

/** Every code sample, in a stable order. */
export const loadSamples = (root: string): readonly Sample[] => [
  ...samplesIn(root, "fixtures"),
  ...samplesIn(root, "corpus"),
];

export const TERMINAL_DIR = "fixtures/terminal";

export interface TerminalSample {
  /** File name without the extension, such as `git-status`. */
  readonly name: string;
  /** The transcript with real escape characters. */
  readonly text: string;
}

/** The terminal transcripts, which write the escape character as `\e`. */
export const loadTerminalSamples = (root: string): readonly TerminalSample[] =>
  readdirSync(join(root, TERMINAL_DIR), { encoding: "utf8" })
    .filter((file) => extname(file) === ".txt")
    .sort()
    .map((file) => ({
      name: basename(file, ".txt"),
      text: readFileSync(join(root, TERMINAL_DIR, file), "utf8").replaceAll("\\e", "\u001b"),
    }));
