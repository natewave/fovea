import type { Hex } from "@fovea/colorlab";
import {
  ACCENT_TONES,
  FAMILIES,
  NEUTRAL_KEYS,
  ROLE_NAMES,
  resolveRef,
  roles,
  type Variant,
  type VariantId,
} from "@fovea/palette";

export type CssProperty = readonly [name: string, value: Hex];

export const cssName = (key: string): string => `--fovea-${key.replaceAll(".", "-")}`;

/**
 * Custom properties for one variant: the raw neutrals, accent tones and ANSI colors, then every
 * semantic role. Syntax and overlay entries are reached through their roles. A role whose name
 * matches a raw entry (such as `border`) maps to the same color, so it is listed once.
 */
export const cssProperties = (v: Variant): readonly CssProperty[] => {
  const raw: readonly CssProperty[] = [
    ...NEUTRAL_KEYS.map((k): CssProperty => [cssName(k), v.neutral[k]]),
    ...FAMILIES.flatMap((f) =>
      ACCENT_TONES.map((t): CssProperty => [cssName(`${f}.${t}`), v.accent[f][t]]),
    ),
    ...v.ansi.map((hex, i): CssProperty => [cssName(`ansi.${i}`), hex]),
  ];
  const taken = new Set(raw.map(([name]) => name));
  const fromRoles = ROLE_NAMES.map(
    (r): CssProperty => [cssName(r), resolveRef(v, roles[r])],
  ).filter(([name]) => !taken.has(name));
  return [...raw, ...fromRoles];
};

const block = (selector: string, v: Variant, indent = ""): string => {
  const lines = [
    `color-scheme: ${v.polarity};`,
    ...cssProperties(v).map(([name, value]) => `${name}: ${value};`),
  ];
  const body = lines.map((line) => `${indent}  ${line}`).join("\n");
  return `${indent}${selector} {\n${body}\n${indent}}\n`;
};

/**
 * `fovea.css`: custom properties under `[data-theme]`. Without a `data-theme` attribute, light
 * systems get Day and dark systems get Dusk.
 */
export const paletteCss = (p: Readonly<Record<VariantId, Variant>>): string =>
  [
    "/* Fovea palette. Generated from packages/palette by packages/build; do not edit. */\n",
    block(':root,\n[data-theme="day"]', p.day),
    `@media (prefers-color-scheme: dark) {\n${block(":root:not([data-theme])", p.dusk, "  ")}}\n`,
    block('[data-theme="dusk"]', p.dusk),
    block('[data-theme="night"]', p.night),
  ].join("\n");
