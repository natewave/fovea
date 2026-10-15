import { PREVIEW } from "@fovea/build/assets";
import { loadSamples, loadTerminalSamples, type Sample } from "@fovea/build/samples";
import { repoRoot } from "./paths.ts";

const fixture = (path: string): Sample => {
  const sample = loadSamples(repoRoot()).find((s) => s.path === path);
  if (sample === undefined) throw new Error(`${path} is missing`);
  return sample;
};

/** The lines of the TypeScript fixture that the README previews show. */
export const heroCode = (): string =>
  fixture(PREVIEW.path)
    .code.split("\n")
    .slice(PREVIEW.from - 1, PREVIEW.to)
    .join("\n");

/** The languages the brief asks the site to show, from the code fixtures. */
export const SHOWCASE: readonly { readonly path: string; readonly title: string }[] = [
  { path: "fixtures/code/typescript.ts", title: "TypeScript" },
  { path: "fixtures/code/python.py", title: "Python" },
  { path: "fixtures/code/rust.rs", title: "Rust" },
  { path: "fixtures/code/go.go", title: "Go" },
  { path: "fixtures/code/scala.scala", title: "Scala" },
  { path: "fixtures/code/markdown.md", title: "Markdown" },
  { path: "fixtures/code/json.json", title: "JSON" },
  { path: "fixtures/code/shell.sh", title: "Shell" },
  { path: "fixtures/code/diff.diff", title: "Diff" },
];

export const showcase = (): readonly (Sample & { readonly title: string })[] =>
  SHOWCASE.map(({ path, title }) => ({ ...fixture(path), title }));

export interface Transcript {
  readonly name: string;
  /** The command on the transcript's first line, without the `$ `. */
  readonly command: string;
  readonly text: string;
}

/** Terminal transcripts in the order the site shows them; each starts with `$ command`. */
export const TERMINAL_ORDER: readonly string[] = [
  "git-status",
  "git-diff",
  "git-log",
  "test-run",
  "ls",
  "compiler-error",
  "prompt",
];

export const transcripts = (): readonly Transcript[] => {
  const all = loadTerminalSamples(repoRoot());
  return TERMINAL_ORDER.map((name) => {
    const text = all.find((t) => t.name === name)?.text;
    if (text === undefined) throw new Error(`fixtures/terminal/${name}.txt is missing`);
    const first = text.split("\n")[0] ?? "";
    return { name, command: first.startsWith("$ ") ? first.slice(2) : "zsh", text };
  });
};

export const transcript = (name: string): Transcript => {
  const found = transcripts().find((t) => t.name === name);
  if (found === undefined) throw new Error(`No transcript named ${name}`);
  return found;
};
