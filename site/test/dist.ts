import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/** Helpers for checking the built site. The HTML is Astro's own output, so patterns suffice. */

export const walk = (dir: string): readonly string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

export interface Page {
  /** Path relative to dist, such as `palette/index.html`. */
  readonly file: string;
  readonly html: string;
}

export const pages = (dist: string): readonly Page[] =>
  walk(dist)
    .filter((f) => f.endsWith(".html"))
    .map((f) => ({ file: relative(dist, f), html: readFileSync(f, "utf8") }));

export const stylesheets = (
  dist: string,
): readonly { readonly file: string; readonly css: string }[] =>
  walk(dist)
    .filter((f) => f.endsWith(".css"))
    .map((f) => ({ file: relative(dist, f), css: readFileSync(f, "utf8") }));

export const svgFiles = (
  dist: string,
): readonly { readonly file: string; readonly svg: string }[] =>
  walk(dist)
    .filter((f) => f.endsWith(".svg"))
    .map((f) => ({ file: relative(dist, f), svg: readFileSync(f, "utf8") }));

const decode = (value: string): string =>
  value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'");

/** Values of an attribute on any element. */
export const attributeValues = (html: string, name: string): readonly string[] =>
  [...html.matchAll(new RegExp(`\\s${name}="([^"]*)"`, "g"))].map((m) => decode(m[1] ?? ""));

/** Opening tags of an element, with their attributes. */
export const tags = (html: string, element: string): readonly string[] =>
  [...html.matchAll(new RegExp(`<${element}\\b[^>]*>`, "g"))].map((m) => m[0]);

export const attribute = (tag: string, name: string): string | undefined => {
  const match = new RegExp(`\\s${name}="([^"]*)"`).exec(tag);
  return match?.[1] === undefined ? undefined : decode(match[1]);
};

/** Text of every `<style>` element. */
export const styleBlocks = (html: string): readonly string[] =>
  [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1] ?? "");

/** Declarations as [property, value], from a stylesheet or a style attribute. */
export const declarations = (css: string): readonly (readonly [string, string])[] =>
  [
    ...css
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .matchAll(/(?:^|[{;])\s*(--[\w-]+|[a-z-]+)\s*:\s*([^;{}]+)/g),
  ].map((m) => [m[1] ?? "", (m[2] ?? "").trim()] as const);

/** `#rgb`, `#rgba`, `#rrggbb` and `#rrggbbaa`, lowercased and expanded to full length. */
export const normalizeHex = (hex: string): string => {
  const h = hex.toLowerCase().slice(1);
  return h.length === 3 || h.length === 4 ? `#${[...h].map((c) => c + c).join("")}` : `#${h}`;
};

export const hexesIn = (value: string): readonly string[] =>
  [...value.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => normalizeHex(m[0]));

/** Every CSS named color, plus the system colors a page could reach for. */
export const NAMED_COLORS: ReadonlySet<string> = new Set(
  (
    "aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown " +
    "burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan " +
    "darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid " +
    "darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet " +
    "deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro " +
    "ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki " +
    "lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow " +
    "lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray " +
    "lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine " +
    "mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen " +
    "mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace " +
    "olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred " +
    "papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue " +
    "saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey " +
    "snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow " +
    "yellowgreen canvas canvastext linktext visitedtext activetext buttonface buttontext buttonborder " +
    "field fieldtext highlight highlighttext selecteditem selecteditemtext mark marktext graytext accentcolor " +
    "accentcolortext"
  ).split(" "),
);

/** Properties whose values can hold a color. Custom properties are checked too. */
export const isColorProperty = (property: string): boolean =>
  property.startsWith("--") ||
  /^(color|background(-color|-image)?|border(-[a-z]+)*|outline(-color)?|fill|stroke|box-shadow|text-shadow|text-decoration(-color)?|caret-color|accent-color|column-rule(-color)?|stop-color|flood-color|lighting-color|scrollbar-color|filter)$/.test(
    property,
  );

export const COLOR_FUNCTION =
  /\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\(/i;

/** Identifiers in a CSS value, outside strings and `var()` names. */
export const identifiers = (value: string): readonly string[] =>
  value
    .replace(/"[^"]*"|'[^']*'/g, " ")
    .replace(/var\(\s*--[\w-]+/g, " ")
    .replace(/url\([^)]*\)/g, " ")
    .toLowerCase()
    .split(/[^a-z-]+/)
    .filter((t) => t !== "");

/** Custom properties a stylesheet defines. */
export const definedProperties = (css: string): ReadonlySet<string> =>
  new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1] ?? ""));

export const usedProperties = (text: string, prefix: string): readonly string[] =>
  [...text.matchAll(new RegExp(`var\\(\\s*(${prefix}[\\w-]*)`, "g"))].map((m) => m[1] ?? "");

/** Resolves a site path (already stripped of the base) to a file in dist. */
export const distFile = (dist: string, path: string): string | undefined => {
  const clean = decodeURIComponent(path.split(/[?#]/)[0] ?? "");
  const candidates =
    clean === "" || clean.endsWith("/") ? [join(dist, clean, "index.html")] : [join(dist, clean)];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
};

export const ids = (html: string): ReadonlySet<string> => new Set(attributeValues(html, "id"));

/** Absolute http(s) URLs that a Markdown or text file mentions. */
export const urlsIn = (text: string): readonly string[] =>
  [...text.matchAll(/https?:\/\/[^\s<>()"'`\]]+(?:\([^\s()]*\)[^\s<>()"'`\]]*)*/g)].map((m) =>
    (m[0] ?? "").replace(/[.,;:]+$/, ""),
  );
