import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { apcaLc, isHex, wcagContrast } from "@fovea/colorlab";
import { budget, variants } from "@fovea/palette";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parse } from "yaml";
import {
  ghosttyEntries,
  ghosttyTheme,
  ghosttyThemePath,
  itermYaml,
  pullRequest,
  terminalColors,
  terminalTextPairs,
  wcagAdjustments,
} from "../src/index.ts";
import { loadColorReference, referenceKeys, vscodeTheme } from "../src/vscode/index.ts";

const ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const keyOrder = referenceKeys(loadColorReference(ROOT));

/** Color keys Ghostty 1.3 accepts in a theme file (from `ghostty +show-config --default --docs`). */
const GHOSTTY_KEYS = new Set([
  "palette",
  "background",
  "foreground",
  "cursor-color",
  "cursor-text",
  "selection-background",
  "selection-foreground",
  "search-background",
  "search-foreground",
  "search-selected-background",
  "search-selected-foreground",
  "split-divider-color",
]);

/** Keys iTerm2-Color-Schemes' gen.py reads from a YAML theme. */
const ITERM_KEYS = new Set([
  "name",
  "author",
  "variant",
  "wcag_adjust",
  ...Array.from({ length: 16 }, (_, i) => `color_${String(i + 1).padStart(2, "0")}`),
  "background",
  "foreground",
  "cursor",
  "cursor_text",
  "selection",
  "selection_text",
]);

const VSCODE_ANSI = ["Black", "Red", "Green", "Yellow", "Blue", "Magenta", "Cyan", "White"].flatMap(
  (n, _, all) => (n === "Black" ? [...all, ...all.map((m) => `Bright${m}`)] : []),
);

/** Parses Ghostty's `key = value` syntax, skipping comments and blank lines. */
const parseGhostty = (text: string): readonly (readonly [string, string])[] =>
  text
    .split("\n")
    .filter((line) => line.trim() !== "" && !line.startsWith("#"))
    .map((line) => {
      const at = line.indexOf(" = ");
      return [line.slice(0, at), line.slice(at + 3)] as const;
    });

const ghosttyPalette = (text: string): readonly string[] =>
  parseGhostty(text)
    .filter(([key]) => key === "palette")
    .map(([, value]) => value.split("="))
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, hex]) => hex ?? "");

describe.each(variants)("$name in terminals", (v) => {
  const ghostty = ghosttyTheme(v);
  const yaml = parse(itermYaml(v)) as Record<string, unknown>;

  it("uses only Ghostty color keys, each once except the palette", () => {
    const entries = parseGhostty(ghostty);
    expect(entries.length).toBe(ghosttyEntries(v).length);
    for (const [key] of entries) expect(GHOSTTY_KEYS.has(key), key).toBe(true);
    const singles = entries.map(([key]) => key).filter((key) => key !== "palette");
    expect(new Set(singles).size).toBe(singles.length);
  });

  it("writes Ghostty values as opaque #rrggbb and the palette as N=#rrggbb for 0–15", () => {
    for (const [key, value] of parseGhostty(ghostty)) {
      if (key === "palette") expect(value, key).toMatch(/^(?:[0-9]|1[0-5])=#[0-9a-f]{6}$/);
      else expect(value, key).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("uses only iTerm2-Color-Schemes keys, named after the file, without auto-adjustment", () => {
    for (const key of Object.keys(yaml)) expect(ITERM_KEYS.has(key), key).toBe(true);
    expect(yaml.name).toBe(v.name);
    expect(yaml.variant).toBe(v.polarity);
    expect(yaml.wcag_adjust).toBe(false);
    for (const [key, value] of Object.entries(yaml)) {
      if (ITERM_KEYS.has(key) && !["name", "author", "variant", "wcag_adjust"].includes(key)) {
        expect(isHex(String(value)) && String(value).length === 7, key).toBe(true);
      }
    }
  });

  it("has the same ANSI colors in VS Code, Ghostty and iTerm2-Color-Schemes", () => {
    const colors = vscodeTheme(v, keyOrder).colors;
    const vscode = VSCODE_ANSI.map((name) => colors[`terminal.ansi${name}`]);
    const iterm = Array.from(
      { length: 16 },
      (_, i) => yaml[`color_${String(i + 1).padStart(2, "0")}`],
    );
    expect(vscode).toEqual(v.ansi);
    expect(ghosttyPalette(ghostty)).toEqual(v.ansi);
    expect(iterm).toEqual(v.ansi);
  });

  it("agrees between Ghostty and iTerm2-Color-Schemes on every shared color", () => {
    const g = Object.fromEntries(parseGhostty(ghostty).filter(([key]) => key !== "palette"));
    expect([yaml.background, yaml.foreground, yaml.cursor, yaml.cursor_text]).toEqual([
      g.background,
      g.foreground,
      g["cursor-color"],
      g["cursor-text"],
    ]);
    expect([yaml.selection, yaml.selection_text]).toEqual([
      g["selection-background"],
      g["selection-foreground"],
    ]);
  });

  it("keeps text readable on the background, cursor, selection and search matches", () => {
    const failures = terminalTextPairs(terminalColors(v)).filter(
      (p) => apcaLc({ text: p.text, surface: p.on }) < 60 || wcagContrast(p.text, p.on) < 4.5,
    );
    expect(failures.map((f) => f.label)).toEqual([]);
  });

  it("meets the body-text budget for the foreground", () => {
    const c = terminalColors(v);
    const band = budget.primaryText[v.id];
    expect(Math.abs(apcaLc({ text: c.foreground, surface: c.background }))).toBeGreaterThanOrEqual(
      band.min,
    );
    expect(wcagContrast(c.foreground, c.background)).toBeGreaterThanOrEqual(band.wcag ?? 0);
  });
});

describe("iTerm2-Color-Schemes pull request", () => {
  it("discloses AI involvement, as the project's AGENTS.md asks", () => {
    expect(pullRequest()).toMatch(/## AI disclosure\n\n.*AI coding agent/);
  });

  it("lists every color the collection's generator would otherwise adjust", () => {
    for (const a of variants.flatMap(wcagAdjustments)) {
      expect(pullRequest()).toContain(`${a.variant}, ${a.color}: ${a.ratio.toFixed(2)}:1`);
    }
  });
});

const GHOSTTY = [
  process.env.GHOSTTY_BIN,
  "/Applications/Ghostty.app/Contents/MacOS/ghostty",
  "/usr/bin/ghostty",
].find((path): path is string => path !== undefined && existsSync(path));

describe.skipIf(GHOSTTY === undefined)("Ghostty's own validator", () => {
  let home = "";

  beforeAll(() => {
    home = mkdtempSync(join(tmpdir(), "fovea-ghostty-"));
  });

  afterAll(() => rmSync(home, { recursive: true, force: true }));

  it.each(variants)("accepts $name", (v) => {
    const env = {
      ...process.env,
      HOME: home,
      XDG_CONFIG_HOME: join(home, ".config"),
      XDG_STATE_HOME: join(home, ".local/state"),
      XDG_CACHE_HOME: join(home, ".cache"),
    };
    const file = join(ROOT, ghosttyThemePath(v));
    expect(() =>
      execFileSync(GHOSTTY ?? "ghostty", ["+validate-config", `--config-file=${file}`], {
        env,
        stdio: "pipe",
      }),
    ).not.toThrow();
  });
});
