import { FAMILIES, families, NEUTRAL_KEYS, palette, type Variant, variants } from "@fovea/palette";
import { iconPng, logoColors, logoSvg, ogImagePng } from "./identity.ts";
import type { Output } from "./output.ts";
import { codeSvg, previewPng } from "./preview.ts";
import type { Sample } from "./samples.ts";
import type { RoleLines, Snippet } from "./token-frequency.ts";

/** The code the README and Marketplace previews show: lines of Fovea's TypeScript fixture. */
export const PREVIEW = {
  path: "fixtures/code/typescript.ts",
  /** First and last line shown in the SVG previews, 1-based. */
  from: 3,
  to: 30,
  /** The line drawn as the current line. */
  active: 12,
} as const;

export const previewSnippet = (samples: readonly Sample[]): Snippet => {
  const sample = samples.find((s) => s.path === PREVIEW.path);
  if (sample === undefined) throw new Error(`${PREVIEW.path} is missing`);
  return { id: PREVIEW.path, lang: sample.language.id, code: sample.code };
};

const xml = (text: string): string => text.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

/** A strip of a variant's neutral ramp and accent text tones, labelled with hex values. */
export const paletteStripSvg = (v: Variant): string => {
  const size = 56;
  const gap = 6;
  const label = 18;
  const rows: readonly (readonly (readonly [string, string])[])[] = [
    NEUTRAL_KEYS.map((k) => [k, v.neutral[k]] as const),
    FAMILIES.map((f) => [families[f].name.toLowerCase(), v.accent[f].fg] as const),
  ];
  const width = NEUTRAL_KEYS.length * (size + gap) + gap;
  const rowHeight = size + label * 2 + gap;
  const height = rows.length * rowHeight + gap;
  const cells = rows.flatMap((row, r) =>
    row.map(([name, hex], i) => {
      const x = gap + i * (size + gap);
      const y = gap + r * rowHeight;
      return [
        `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="8" fill="${hex}" stroke="${v.neutral.border}"/>`,
        `<text x="${x + size / 2}" y="${y + size + 14}">${xml(name)}</text>`,
        `<text x="${x + size / 2}" y="${y + size + 30}" fill="${v.neutral["fg.muted"]}">${hex}</text>`,
      ].join("");
    }),
  );
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xml(`${v.name} palette`)}">`,
    `<rect width="${width}" height="${height}" rx="10" fill="${v.neutral["bg.sunken"]}"/>`,
    `<g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="10" text-anchor="middle" fill="${v.neutral["fg.subtle"]}">`,
    ...cells,
    "</g>",
    "</svg>\n",
  ].join("");
};

/** README and docs images, plus the website's logo, favicon and social image. */
export const assetOutputs = (previewLines: RoleLines): readonly Output[] => {
  const shown = previewLines.slice(PREVIEW.from - 1, PREVIEW.to);
  return [
    ...variants.flatMap((v): readonly Output[] => [
      {
        path: `docs/assets/preview-${v.id}.svg`,
        contents: codeSvg(v, shown, {
          title: "typescript.ts",
          firstLine: PREVIEW.from,
          activeLine: PREVIEW.active,
        }),
      },
      { path: `docs/assets/preview-${v.id}.png`, contents: previewPng(v, previewLines) },
      { path: `docs/assets/palette-${v.id}.svg`, contents: paletteStripSvg(v) },
    ]),
    { path: "docs/assets/logo.svg", contents: logoSvg(logoColors(palette.dusk)) },
    { path: "site/public/favicon.svg", contents: logoSvg(logoColors(palette.dusk)) },
    { path: "site/public/apple-touch-icon.png", contents: iconPng(palette.dusk, 180) },
    { path: "site/public/og.png", contents: ogImagePng(palette.dusk) },
  ];
};
