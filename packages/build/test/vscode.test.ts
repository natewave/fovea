import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync, crc32 as zlibCrc32 } from "node:zlib";
import { apcaLc, type Hex, isHex, parseHexAlpha, wcagContrast } from "@fovea/colorlab";
import { budget, palette, resolveRef, roles, variants } from "@fovea/palette";
import { allHexes, tokenColors } from "@fovea/palette/audit";
import {
  type BundledLanguage,
  createHighlighter,
  type Highlighter,
  type ThemedToken,
  type ThemeRegistrationRaw,
} from "shiki";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { crc32, iconPng, loadSamples, project } from "../src/index.ts";
import {
  type ColorSpec,
  codeSurfaceChecks,
  coverage,
  extensionManifest,
  isTranslucent,
  loadColorReference,
  NONE,
  opacityRule,
  referenceKeys,
  resolveWorkbenchColors,
  themeContributions,
  themeFileName,
  uiChecks,
  uiTheme,
  type VscodeTheme,
  vscodeTheme,
  workbenchColors,
} from "../src/vscode/index.ts";

const ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const reference = loadColorReference(ROOT);
const keyOrder = referenceKeys(reference);
const themes: readonly VscodeTheme[] = variants.map((v) => vscodeTheme(v, keyOrder));
const VSCODE_ANSI = ["Black", "Red", "Green", "Yellow", "Blue", "Magenta", "Cyan", "White"].flatMap(
  (n, _, all) => (n === "Black" ? [...all, ...all.map((m) => `Bright${m}`)] : []),
);
/** Shiki's font-style bit for italics (TextMate's FontStyle.Italic). */
const ITALIC = 1;

/** Shiki's raw theme shape for a generated VS Code theme. */
const shikiTheme = (t: VscodeTheme): ThemeRegistrationRaw => ({
  name: t.name,
  type: t.type,
  colors: { ...t.colors },
  settings: t.tokenColors.map((r) => ({
    name: r.name,
    scope: [...r.scope],
    settings: { ...r.settings },
  })),
});
const descriptions = new Map(
  reference.sections.flatMap((s) => s.keys.map((k) => [k.key, k.description] as const)),
);

describe("VS Code color reference coverage", () => {
  const c = coverage(reference);

  it("pins a reference with a version and every key", () => {
    expect(reference.vscodeVersion).toMatch(/^\d+\.\d+$/);
    expect(keyOrder.length).toBe(reference.keyCount);
  });

  it("sets or deliberately defaults every key", () => {
    expect(c.missing).toEqual([]);
  });

  it("uses only keys in the reference", () => {
    expect(c.unknown).toEqual([]);
  });

  it("never both sets and defaults a key", () => {
    expect(c.conflicting).toEqual([]);
  });
});

describe.each(variants.map((v, i) => [v.name, v, themes[i]] as const))("%s", (_, v, theme) => {
  if (theme === undefined) throw new Error("missing theme");
  const colors = theme.colors;
  const entries = Object.entries(colors);

  it("is a light or dark theme matching its polarity", () => {
    expect(theme.type).toBe(v.polarity);
    expect(theme.name).toBe(v.name);
    expect(theme.semanticHighlighting).toBe(true);
  });

  it("writes every color as #rrggbb or #rrggbbaa, never pure black or white", () => {
    for (const [key, hex] of entries) {
      expect(isHex(hex) && (hex.length === 7 || hex.length === 9), key).toBe(true);
      expect(budget.banned, key).not.toContain(hex.slice(0, 7).toLowerCase());
    }
  });

  it("takes every color from the palette", () => {
    const known = new Set(allHexes(v).map((h) => h.slice(0, 7)));
    for (const [key, hex] of entries) {
      expect(known.has(hex.slice(0, 7) as Hex), `${key}: ${hex}`).toBe(true);
    }
  });

  it("adds transparency only through overlay roles, fades and 'none'", () => {
    const overlays = new Set(
      Object.values(roles)
        .filter((ref) => ref.startsWith("overlay."))
        .map((ref) => resolveRef(v, ref)),
    );
    const forPolarity = (spec: ColorSpec | undefined): ColorSpec | undefined =>
      typeof spec === "object" && "light" in spec
        ? forPolarity(v.polarity === "light" ? spec.light : spec.dark)
        : spec;
    for (const [key, hex] of entries.filter(([, h]) => isTranslucent(h))) {
      const spec = forPolarity(workbenchColors[key]);
      const documented =
        overlays.has(hex) || spec === NONE || (typeof spec === "object" && "fade" in spec);
      expect(documented, key).toBe(true);
    }
  });

  it("follows the reference's opacity requirements", () => {
    for (const [key, hex] of entries) {
      const rule = opacityRule(descriptions.get(key) ?? "");
      if (rule === "translucent")
        expect(isTranslucent(hex), `${key} must be translucent`).toBe(true);
      if (rule === "opaque") expect(isTranslucent(hex), `${key} must be opaque`).toBe(false);
    }
  });

  it("uses the palette's ANSI colors in the integrated terminal", () => {
    expect(Object.keys(colors).filter((k) => k.startsWith("terminal.ansi"))).toHaveLength(16);
    expect(VSCODE_ANSI.map((name) => colors[`terminal.ansi${name}`])).toEqual(v.ansi);
  });

  it("styles the standard semantic token types", () => {
    for (const type of ["class", "function", "variable", "parameter", "property", "type"]) {
      expect(theme.semanticTokenColors[type], type).toBeDefined();
    }
    expect(theme.semanticTokenColors["*.deprecated"]).toEqual({ strikethrough: true });
  });

  it("meets the contrast budget for workbench text and marks", () => {
    const failures = uiChecks(v, colors).filter((c) => !c.pass);
    expect(
      failures.map((f) => `${f.pair.label}: Lc ${f.lc.toFixed(1)}, ${f.wcag.toFixed(2)}:1`),
    ).toEqual([]);
  });

  it("keeps every token color readable on every highlight background", () => {
    const failures = codeSurfaceChecks(v, colors).filter((c) => !c.pass);
    expect(failures.map((f) => `${f.stack.join(" + ")}: ${f.weakest}`)).toEqual([]);
  });

  it("matches the colors the build resolves", () => {
    expect(colors).toEqual(resolveWorkbenchColors(v, keyOrder));
  });
});

describe("extension manifest", () => {
  const manifest = extensionManifest(variants, palette.dusk) as {
    readonly engines: { readonly vscode: string };
    readonly categories: readonly string[];
    readonly publisher: string;
    readonly contributes: { readonly themes: readonly unknown[] };
  };

  it("contributes every variant with the right base theme", () => {
    expect(themeContributions(variants)).toEqual(
      variants.map((v) => ({
        label: v.name,
        uiTheme: v.polarity === "light" ? "vs" : "vs-dark",
        path: `./themes/${themeFileName(v)}`,
      })),
    );
    expect(variants.map(uiTheme)).toEqual(["vs", "vs-dark", "vs-dark"]);
  });

  it("points at theme files that the build has written", () => {
    for (const t of themeContributions(variants)) {
      expect(existsSync(join(ROOT, "ports/vscode", t.path)), t.path).toBe(true);
    }
  });

  it("targets an old engine so forks of VS Code can install it", () => {
    expect(manifest.engines.vscode).toBe(project.vscodeEngine);
    expect(manifest.categories).toEqual(["Themes"]);
  });

  it("keeps the publisher as a marked placeholder until it is chosen", () => {
    expect(manifest.publisher).toBe(project.publisher);
  });
});

describe("Shiki with the generated themes", () => {
  const samples = loadSamples(ROOT).filter((s) => s.set === "fixtures");
  const shikiThemes = new Map(themes.map((t) => [t.name, shikiTheme(t)]));
  let highlighter: Highlighter;

  const tokens = (code: string, lang: BundledLanguage, name: string): readonly ThemedToken[] => {
    const theme = shikiThemes.get(name);
    if (theme === undefined) throw new Error(`No theme ${name}`);
    return highlighter.codeToTokensBase(code, { lang, theme }).flat();
  };

  beforeAll(async () => {
    highlighter = await createHighlighter({
      themes: [...shikiThemes.values()],
      langs: [...new Set(samples.map((s) => s.language.id))],
    });
  }, 60_000);

  afterAll(() => highlighter.dispose());

  it("colors every token of every fixture with an audited color that meets its floor", () => {
    const problems = variants.flatMap((v) => {
      const audited = new Set<string>(tokenColors(v).map(([, hex]) => hex.toLowerCase()));
      const floor = budget.quiet[v.id];
      return samples.flatMap((s) =>
        tokens(s.code, s.language.id, v.name)
          .filter((t) => t.content.trim() !== "")
          .flatMap((t) => {
            const color = (t.color ?? "").toLowerCase();
            const ok =
              isHex(color) &&
              audited.has(color) &&
              apcaLc({ text: color, surface: v.neutral.bg }) >= floor.min &&
              wcagContrast(color, v.neutral.bg) >= (floor.wcag ?? 0);
            return ok ? [] : [`${v.id} ${s.path} "${t.content}" ${color}`];
          }),
      );
    });
    expect(problems.slice(0, 10)).toEqual([]);
  });

  it("uses italics only where the author wrote emphasis", () => {
    const italic = samples.filter((s) =>
      tokens(s.code, s.language.id, palette.dusk.name).some(
        (t) => ((t.fontStyle ?? 0) & ITALIC) !== 0,
      ),
    );
    expect(italic.map((s) => s.language.id)).toEqual(["markdown"]);
  });
});

describe("icon.png", () => {
  const png = iconPng(palette.dusk);
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);

  it("is a 128 × 128 RGBA PNG", () => {
    expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    expect(new TextDecoder().decode(png.subarray(12, 16))).toBe("IHDR");
    expect([view.getUint32(16), view.getUint32(20), png[24], png[25]]).toEqual([128, 128, 8, 6]);
  });

  it("has valid chunk checksums and a zlib stream that inflates to every scanline", () => {
    const chunks: { type: string; data: Uint8Array }[] = [];
    for (let at = 8; at < png.length; ) {
      const length = view.getUint32(at);
      const typed = png.subarray(at + 4, at + 8 + length);
      expect(view.getUint32(at + 8 + length)).toBe(zlibCrc32(typed));
      expect(crc32(typed)).toBe(zlibCrc32(typed));
      chunks.push({
        type: new TextDecoder().decode(typed.subarray(0, 4)),
        data: typed.subarray(4),
      });
      at += 12 + length;
    }
    expect(chunks.map((c) => c.type)).toEqual(["IHDR", "IDAT", "IEND"]);
    const idat = chunks[1]?.data ?? new Uint8Array();
    expect(inflateSync(idat).length).toBe(128 * (1 + 128 * 4));
  });

  it("is the file the extension ships", () => {
    expect(new Uint8Array(readFileSync(join(ROOT, "ports/vscode/icon.png")))).toEqual(png);
  });
});

describe("theme files on disk", () => {
  it.each(variants)("$name parses as the generated theme", (v) => {
    const file = JSON.parse(
      readFileSync(join(ROOT, "ports/vscode/themes", themeFileName(v)), "utf8"),
    ) as VscodeTheme;
    expect(file).toEqual(JSON.parse(JSON.stringify(vscodeTheme(v, keyOrder))));
    expect(parseHexAlpha(file.colors["editor.background"] ?? "#0000").alpha).toBe(1);
  });
});
