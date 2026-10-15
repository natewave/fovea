import type { Hex } from "@fovea/colorlab";
import { role, type ScopeRule, type SyntaxRole, scopeRules, type Variant } from "@fovea/palette";
import { resolveWorkbenchColors } from "./colors.ts";

export interface TokenColorRule {
  readonly name: string;
  readonly scope: readonly string[];
  readonly settings: { readonly foreground?: Hex; readonly fontStyle?: string };
}

/** TextMate rules: the scope mapping shared with the website's Shiki renderings. */
export const tokenColorRules = (
  v: Variant,
  rules: readonly ScopeRule[] = scopeRules,
): readonly TokenColorRule[] =>
  rules.map((rule) => ({
    name: rule.name,
    scope: rule.scope,
    settings: {
      ...(rule.role === undefined ? {} : { foreground: role(v, rule.role) }),
      ...(rule.fontStyle === undefined ? {} : { fontStyle: rule.fontStyle.join(" ") }),
    },
  }));

export interface SemanticRule {
  readonly selector: string;
  readonly role?: SyntaxRole;
  readonly strikethrough?: true;
}

/**
 * Styles for VS Code's standard semantic token types and modifiers, matching the TextMate mapping:
 * names take the definition color where they are declared and stay plain or type-colored where
 * they are used. Without explicit rules VS Code falls back to TextMate scopes that themes use for
 * declarations (`entity.name.function`, `entity.name.type.class`), which would color every call
 * and every class reference as a definition.
 */
export const semanticRules: readonly SemanticRule[] = [
  { selector: "namespace", role: "syntax.plain" },
  { selector: "class", role: "syntax.type" },
  { selector: "class.declaration", role: "syntax.definition" },
  { selector: "enum", role: "syntax.type" },
  { selector: "enum.declaration", role: "syntax.definition" },
  { selector: "interface", role: "syntax.type" },
  { selector: "interface.declaration", role: "syntax.definition" },
  { selector: "struct", role: "syntax.type" },
  { selector: "struct.declaration", role: "syntax.definition" },
  { selector: "type", role: "syntax.type" },
  { selector: "type.declaration", role: "syntax.definition" },
  { selector: "typeParameter", role: "syntax.type" },
  { selector: "parameter", role: "syntax.plain" },
  { selector: "variable", role: "syntax.plain" },
  { selector: "property", role: "syntax.plain" },
  { selector: "enumMember", role: "syntax.constant" },
  { selector: "decorator", role: "syntax.keyword" },
  { selector: "event", role: "syntax.plain" },
  { selector: "function", role: "syntax.plain" },
  { selector: "function.declaration", role: "syntax.definition" },
  { selector: "method", role: "syntax.plain" },
  { selector: "method.declaration", role: "syntax.definition" },
  { selector: "macro", role: "syntax.plain" },
  { selector: "macro.declaration", role: "syntax.definition" },
  { selector: "label", role: "syntax.plain" },
  { selector: "comment", role: "syntax.comment" },
  { selector: "string", role: "syntax.string" },
  { selector: "keyword", role: "syntax.keyword" },
  { selector: "number", role: "syntax.constant" },
  { selector: "regexp", role: "syntax.escape" },
  { selector: "operator", role: "syntax.plain" },
  // Deprecated names keep their color and gain a strikethrough, like `invalid.deprecated`.
  { selector: "*.deprecated", strikethrough: true },
];

export type SemanticStyle = Hex | { readonly foreground?: Hex; readonly strikethrough?: boolean };

export const semanticTokenColors = (v: Variant): Readonly<Record<string, SemanticStyle>> =>
  Object.fromEntries(
    semanticRules.map((rule): [string, SemanticStyle] => {
      const foreground = rule.role === undefined ? undefined : role(v, rule.role);
      return [
        rule.selector,
        rule.strikethrough === undefined && foreground !== undefined
          ? foreground
          : {
              ...(foreground === undefined ? {} : { foreground }),
              ...(rule.strikethrough === undefined ? {} : { strikethrough: true }),
            },
      ];
    }),
  );

export interface VscodeTheme {
  readonly $schema: string;
  readonly name: string;
  readonly type: "light" | "dark";
  readonly semanticHighlighting: true;
  readonly colors: Readonly<Record<string, Hex>>;
  readonly tokenColors: readonly TokenColorRule[];
  readonly semanticTokenColors: Readonly<Record<string, SemanticStyle>>;
}

/** A complete color theme. `keyOrder` is the reference's key order, so diffs stay readable. */
export const vscodeTheme = (v: Variant, keyOrder: readonly string[]): VscodeTheme => ({
  $schema: "vscode://schemas/color-theme",
  name: v.name,
  type: v.polarity,
  semanticHighlighting: true,
  colors: resolveWorkbenchColors(v, keyOrder),
  tokenColors: tokenColorRules(v),
  semanticTokenColors: semanticTokenColors(v),
});

export const uiTheme = (v: Variant): "vs" | "vs-dark" =>
  v.polarity === "light" ? "vs" : "vs-dark";

export const themeFileName = (v: Variant): string => `fovea-${v.id}-color-theme.json`;

export const themeJson = (theme: VscodeTheme): string => `${JSON.stringify(theme, null, 2)}\n`;
