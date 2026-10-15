import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { GHOSTTY_CONFIG_DOCS } from "@fovea/build/install";
import { project } from "@fovea/build/project";
import { variants } from "@fovea/palette";
import { allHexes } from "@fovea/palette/audit";
import { describe, expect, it } from "vitest";
import { sources } from "../src/data/sources.ts";
import {
  attribute,
  attributeValues,
  COLOR_FUNCTION,
  declarations,
  definedProperties,
  distFile,
  hexesIn,
  identifiers,
  ids,
  isColorProperty,
  NAMED_COLORS,
  normalizeHex,
  pages,
  styleBlocks,
  stylesheets,
  svgFiles,
  tags,
  urlsIn,
  usedProperties,
} from "./dist.ts";

/**
 * Checks the built site. Run after `astro build`, with the same BASE_PATH the build used:
 * `BASE_PATH=/fovea/ pnpm --filter @fovea/site build && BASE_PATH=/fovea/ pnpm --filter @fovea/site test`.
 */
const SITE = fileURLToPath(new URL("../", import.meta.url));
const ROOT = join(SITE, "..");
const DIST = join(SITE, "dist");
const BASE = `/${(process.env.BASE_PATH ?? "/").replace(/^\/+|\/+$/g, "")}/`.replace("//", "/");

if (!existsSync(join(DIST, "index.html"))) {
  throw new Error("site/dist is missing: run `pnpm --filter @fovea/site build` first");
}

const PAGES = pages(DIST);
const CSS = stylesheets(DIST);
const PALETTE_CSS = readFileSync(join(ROOT, "ports/palette/fovea.css"), "utf8");

/** Every color the palette ships, including overlay colors with their alpha. */
const PALETTE: ReadonlySet<string> = new Set(
  variants.flatMap((v) => allHexes(v)).map(normalizeHex),
);

/** Minifiers write the `transparent` keyword as `#0000`. */
const TRANSPARENT = "#00000000";

/** A palette color, or a palette color with an alpha channel (as Shiki writes theme fades). */
const isPaletteHex = (hex: string): boolean =>
  hex === TRANSPARENT || PALETTE.has(hex) || (hex.length === 9 && PALETTE.has(hex.slice(0, 7)));

const KEYWORDS: ReadonlySet<string> = new Set([
  "transparent",
  "currentcolor",
  "inherit",
  "initial",
  "unset",
  "none",
]);

/** Problems with one CSS declaration's color, if any. */
const colorProblems = (where: string, property: string, value: string): readonly string[] => {
  if (!isColorProperty(property)) return [];
  const hexes = hexesIn(value)
    .filter((h) => !isPaletteHex(h))
    .map((h) => `${where}: ${property}: ${value} uses ${h}, which is not a palette color`);
  const fn = COLOR_FUNCTION.test(value)
    ? [`${where}: ${property}: ${value} uses a color function`]
    : [];
  const named = identifiers(value)
    .filter((t) => NAMED_COLORS.has(t) && !KEYWORDS.has(t))
    .map((t) => `${where}: ${property}: ${value} uses the named color ${t}`);
  return [...hexes, ...fn, ...named];
};

const cssSources = (): readonly { readonly where: string; readonly css: string }[] => [
  ...CSS.map((s) => ({ where: s.file, css: s.css })),
  ...PAGES.flatMap((p) => styleBlocks(p.html).map((css) => ({ where: `${p.file} <style>`, css }))),
  ...PAGES.flatMap((p) =>
    attributeValues(p.html, "style").map((css) => ({
      where: `${p.file} style=""`,
      css: `;${css}`,
    })),
  ),
];

describe("site colors", () => {
  it("uses only palette colors in stylesheets, style elements and style attributes", () => {
    const problems = cssSources().flatMap(({ where, css }) =>
      declarations(css).flatMap(([property, value]) => colorProblems(where, property, value)),
    );
    expect(problems).toEqual([]);
  });

  it("uses only palette colors in SVG paint attributes", () => {
    const allowed = (value: string): boolean =>
      KEYWORDS.has(value.toLowerCase()) ||
      /^var\(--fovea-[\w-]+(,\s*currentColor)?\)$/.test(value) ||
      /^url\(#[\w-]+\)$/.test(value) ||
      (/^#[0-9a-fA-F]{3,8}$/.test(value) && isPaletteHex(normalizeHex(value)));
    const sourcesOf = [
      ...PAGES.map((p) => ({ where: p.file, text: p.html })),
      ...svgFiles(DIST).map((s) => ({ where: s.file, text: s.svg })),
    ];
    const problems = sourcesOf.flatMap(({ where, text }) =>
      ["fill", "stroke", "stop-color", "flood-color", "lighting-color"].flatMap((name) =>
        attributeValues(text, name)
          .filter((v) => !allowed(v))
          .map((v) => `${where}: ${name}="${v}"`),
      ),
    );
    expect(problems).toEqual([]);
  });

  it("references only Fovea properties that fovea.css defines", () => {
    const defined = definedProperties(PALETTE_CSS);
    const texts = [...CSS.map((s) => s.css), ...PAGES.map((p) => p.html)];
    const missing = [...new Set(texts.flatMap((t) => usedProperties(t, "--fovea-")))].filter(
      (p) => !defined.has(p),
    );
    expect(missing).toEqual([]);
  });

  it("sets theme-color from the palette", () => {
    const values = PAGES.flatMap((p) =>
      tags(p.html, "meta")
        .filter((t) => attribute(t, "name") === "theme-color")
        .map((t) => attribute(t, "content") ?? ""),
    );
    expect(values.length).toBeGreaterThan(0);
    for (const v of values) expect(isPaletteHex(normalizeHex(v)), v).toBe(true);
  });

  it("renders code with the generated themes for every variant", () => {
    const palette = PAGES.find((p) => p.file === "palette/index.html");
    expect(palette).toBeDefined();
    const styles = attributeValues(palette?.html ?? "", "style").filter((s) =>
      s.includes("--shiki-"),
    );
    expect(styles.length).toBeGreaterThan(500);
    for (const s of styles) {
      expect(s).toMatch(/--shiki-day:#/);
      expect(s).toMatch(/--shiki-dusk:#/);
      expect(s).toMatch(/--shiki-night:#/);
    }
  });

  it("never sets italic text", () => {
    const italic = cssSources().flatMap(({ where, css }) =>
      declarations(css)
        .filter(([property, value]) => property === "font-style" && value.includes("italic"))
        .map(([property, value]) => `${where}: ${property}: ${value}`),
    );
    expect(italic).toEqual([]);
  });
});

describe("site pages", () => {
  const EXPECTED = [
    "index.html",
    "404.html",
    "palette/index.html",
    "science/index.html",
    "install/index.html",
    "comfort/index.html",
  ];

  it("builds every page in the brief", () => {
    expect(PAGES.map((p) => p.file).sort()).toEqual([...EXPECTED].sort());
  });

  it.each(EXPECTED)(
    "%s has a language, title, description, landmarks, a skip link and one h1",
    (file) => {
      const html = PAGES.find((p) => p.file === file)?.html ?? "";
      expect(html).toMatch(/<html lang="en"/);
      expect(html).toMatch(/<title>[^<]{5,}<\/title>/);
      const description = tags(html, "meta").find((t) => attribute(t, "name") === "description");
      expect(attribute(description ?? "", "content")?.length ?? 0).toBeGreaterThan(50);
      expect(html).toMatch(/<main id="main"/);
      expect(html).toMatch(/<header\b/);
      expect(html).toMatch(/<footer\b/);
      expect(html).toMatch(/<a class="skip-link" href="#main"/);
      expect(html.match(/<h1\b/g)?.length).toBe(1);
    },
  );

  it("gives every image alternative text", () => {
    const missing = PAGES.flatMap((p) =>
      tags(p.html, "img")
        .filter((t) => attribute(t, "alt") === undefined)
        .map((t) => `${p.file}: ${t}`),
    );
    expect(missing).toEqual([]);
  });

  it("uses unique ids on each page", () => {
    const duplicates = PAGES.flatMap((p) => {
      const all = attributeValues(p.html, "id");
      return all.filter((id, i) => all.indexOf(id) !== i).map((id) => `${p.file}: #${id}`);
    });
    expect(duplicates).toEqual([]);
  });

  it("names the medical disclaimer on the comfort guide", () => {
    const html = PAGES.find((p) => p.file === "comfort/index.html")?.html ?? "";
    expect(html).toContain("Not medical advice.");
    expect(html).toContain("see an eye-care professional");
  });

  it("shows the manual git clone install steps", () => {
    const html = PAGES.find((p) => p.file === "install/index.html")?.html ?? "";
    expect(html).toContain("git clone");
    expect(html).toContain("pnpm package:vscode");
    expect(html).toContain("--install-extension");
  });

  it("labels contrast generically outside code samples", () => {
    const prose = (html: string): string => html.replace(/<pre\b[\s\S]*?<\/pre>/g, "");
    const naming = PAGES.filter((p) => /APCA/.test(prose(p.html)));
    expect(naming.map((p) => p.file)).toEqual([]);
  });

  it("makes no health promises", () => {
    const text = PAGES.map((p) => p.html.replace(/<[^>]+>/g, " ")).join("\n");
    for (const phrase of [
      /prevents? eye (damage|strain)/i,
      /cures?\b/i,
      /improves? (your )?sleep/i,
      /reduces? eye strain/i,
    ]) {
      const hits = [...text.matchAll(new RegExp(`.{0,60}${phrase.source}.{0,60}`, "gi"))]
        .map((m) => m[0])
        .filter((s) => !/\b(doesn't|don't|can't|no|not|never|isn't|without)\b/i.test(s));
      expect(hits, String(phrase)).toEqual([]);
    }
  });
});

describe("site links", () => {
  const internal = (href: string): boolean => !/^([a-z]+:|\/\/|#)/i.test(href);

  it("keeps every internal link and asset under the base path", () => {
    const outside = PAGES.flatMap((p) =>
      [...attributeValues(p.html, "href"), ...attributeValues(p.html, "src")]
        .filter(internal)
        .filter((href) => !href.startsWith(BASE))
        .map((href) => `${p.file}: ${href}`),
    );
    expect(outside).toEqual([]);
  });

  it("resolves every internal link, asset and anchor", () => {
    const byFile = new Map(PAGES.map((p) => [p.file, p.html]));
    const broken = PAGES.flatMap((p) =>
      [...attributeValues(p.html, "href"), ...attributeValues(p.html, "src")]
        .filter((href) => internal(href) || href.startsWith("#"))
        .flatMap((href) => {
          const [path = "", hash] = href.split("#");
          if (path === "")
            return hash === undefined || ids(p.html).has(hash) ? [] : [`${p.file}: ${href}`];
          const file = distFile(DIST, path.slice(BASE.length));
          if (file === undefined) return [`${p.file}: ${href}`];
          const target = byFile.get(file.slice(DIST.length + 1));
          return hash === undefined || hash === "" || target === undefined || ids(target).has(hash)
            ? []
            : [`${p.file}: ${href} (no #${hash})`];
        }),
    );
    expect(broken).toEqual([]);
  });

  it("resolves url() references in stylesheets", () => {
    const broken = CSS.flatMap((s) =>
      [...s.css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)]
        .map((m) => m[1] ?? "")
        .filter((u) => !u.startsWith("#") && !u.startsWith("data:"))
        .filter((u) =>
          u.startsWith(BASE)
            ? distFile(DIST, u.slice(BASE.length)) === undefined
            : !existsSync(join(DIST, s.file, "..", u)),
        )
        .map((u) => `${s.file}: ${u}`),
    );
    expect(broken).toEqual([]);
  });

  it("makes no third-party requests", () => {
    const requests = PAGES.flatMap((p) => [
      ...attributeValues(p.html, "src"),
      ...tags(p.html, "link")
        .filter((t) => attribute(t, "rel") !== "canonical")
        .map((t) => attribute(t, "href") ?? ""),
    ]).filter((u) => /^(https?:)?\/\//.test(u));
    const fromCss = CSS.flatMap((s) =>
      [...s.css.matchAll(/(?:url\(|@import\s+)["']?((?:https?:)?\/\/[^"')\s]+)/g)].map((m) => m[1]),
    );
    const scripts = readdirSync(join(DIST, "_astro"))
      .filter((f) => f.endsWith(".js"))
      .map((f) => readFileSync(join(DIST, "_astro", f), "utf8"));
    expect([...requests, ...fromCss]).toEqual([]);
    for (const js of scripts) {
      expect(js).not.toMatch(/fetch\(|XMLHttpRequest|sendBeacon|document\.cookie/);
    }
  });

  it("links only to sources recorded in the research notes, the repository or the marketplaces", () => {
    const verificationDir = join(ROOT, "docs/research/verification");
    const notes = [
      readFileSync(join(ROOT, "docs/research.md"), "utf8"),
      ...readdirSync(verificationDir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => readFileSync(join(verificationDir, f), "utf8")),
    ];
    const recorded = new Set(notes.flatMap(urlsIn));
    const prefixes = [
      `${project.repository}/`,
      `${project.repository}.git`,
      "https://marketplace.visualstudio.com/items?itemName=",
      "https://open-vsx.org/extension/",
      GHOSTTY_CONFIG_DOCS,
    ];
    const external = PAGES.flatMap((p) =>
      tags(p.html, "a")
        .map((t) => attribute(t, "href") ?? "")
        .filter((href) => /^https?:\/\//.test(href))
        .map((href) => ({ file: p.file, href })),
    );
    const unrecorded = external
      .filter(
        ({ href }) => href !== project.repository && !prefixes.some((pre) => href.startsWith(pre)),
      )
      .filter(({ href }) => !recorded.has(href))
      .map(({ file, href }) => `${file}: ${href}`);
    expect(external.length).toBeGreaterThan(50);
    expect(unrecorded).toEqual([]);
  });

  it("shows no placeholder values, such as the unregistered publisher", () => {
    const pagesWithPlaceholders = PAGES.filter((p) => p.html.includes("PLACEHOLDER")).map(
      (p) => p.file,
    );
    expect(pagesWithPlaceholders).toEqual([]);
  });

  it("cites every source in the registry from the research notes", () => {
    const research = readFileSync(join(ROOT, "docs/research.md"), "utf8");
    const comfort = readFileSync(
      join(ROOT, "docs/research/verification/d-strain-sleep-syntax.md"),
      "utf8",
    );
    const missing = Object.entries(sources)
      .filter(([, s]) => !research.includes(s.url) && !comfort.includes(s.url))
      .map(([key, s]) => `${key}: ${s.url}`);
    expect(missing).toEqual([]);
  });
});
