import type { Role } from "./roles.ts";

/** The roles a TextMate scope can take. */
export type SyntaxRole = Extract<Role, `syntax.${string}`>;

export type FontStyle = "bold" | "italic" | "underline" | "strikethrough";

/**
 * One TextMate theme rule. `role` sets the foreground; `fontStyle` adds styles. A rule without a
 * role takes the color of the rule for a shorter form of the same selector (`invalid` for
 * `invalid.deprecated`) or, if there is none, keeps the color of the enclosing scopes.
 */
export interface ScopeRule {
  readonly name: string;
  readonly scope: readonly string[];
  readonly role?: SyntaxRole;
  readonly fontStyle?: readonly FontStyle[];
}

/**
 * TextMate scopes to syntax roles, shared by the VS Code themes and the Shiki renderings on the
 * website. It follows docs/design.md, "Syntax": calls, variables, properties and operators stay
 * plain; keywords and types are quiet; definitions, strings and constants carry the accents.
 *
 * Precedence follows vscode-textmate: for each scope, the rule whose last selector part matches
 * the most dot-separated segments wins, and parent selectors only break ties between equally
 * deep matches. That is why some exceptions repeat a deep selector (`string.regexp
 * punctuation.definition.string`) instead of relying on the parent alone.
 */
export const scopeRules: readonly ScopeRule[] = [
  // Plain text. These reset the color inside strings, so interpolated code reads as code.
  {
    name: "Interpolated and embedded code",
    scope: [
      "meta.embedded",
      "meta.template.expression",
      "meta.interpolation",
      "string variable",
      "string meta.parameter-expansion",
      "string meta.scope.subshell",
    ],
    role: "syntax.plain",
  },
  {
    name: "Operators",
    scope: [
      "keyword.operator",
      "keyword.control.ternary",
      "storage.type.function.arrow",
      "storage.type.variable.ruby",
      "storage.modifier.reference",
      "storage.modifier.pointer",
    ],
    role: "syntax.plain",
  },
  {
    name: "Function and method calls",
    scope: [
      "meta.function-call entity.name.function",
      "meta.function.call entity.name.function",
      "meta.method-call entity.name.function",
      "entity.name.function.call",
      "entity.name.function.member",
      "entity.name.function.support",
      "entity.name.function.macro",
      "support.function",
    ],
    role: "syntax.plain",
  },
  {
    // C# scopes calls and declarations alike; calls are far more common, so both stay plain.
    name: "C# method names",
    scope: ["entity.name.function.cs"],
    role: "syntax.plain",
  },
  {
    name: "Argument labels",
    scope: [
      "variable.parameter entity.name.function",
      "meta.parameter-clause entity.name.function",
    ],
    role: "syntax.plain",
  },
  {
    // TypeScript scopes every const-declared name this way, not just named constants.
    name: "Variables declared constant",
    scope: ["variable.other.constant", "constant.other.caps"],
    role: "syntax.plain",
  },
  {
    name: "Names that are not types",
    scope: [
      "entity.name.type.namespace",
      "storage.modifier.import.java",
      "storage.modifier.package.java",
    ],
    role: "syntax.plain",
  },
  {
    name: "Shell arguments and options",
    scope: ["string.unquoted.argument", "constant.other.option"],
    role: "syntax.plain",
  },

  // Muted neutral.
  {
    name: "Punctuation",
    scope: [
      "punctuation",
      "meta.brace",
      "meta.bracket.scala",
      "meta.colon.scala",
      "keyword.operator.type.annotation",
      "keyword.operator.key-value",
    ],
    role: "syntax.punctuation",
  },
  {
    // The grammar can't look back at the heading text, so this scope only ever covers the
    // `---` or `===` underline (and a `---` rule that follows a paragraph).
    name: "Setext heading underlines",
    scope: ["markup.heading.setext"],
    role: "syntax.punctuation",
  },

  // Comments.
  {
    name: "Comments",
    scope: [
      "comment",
      "punctuation.definition.comment",
      "comment keyword",
      "comment storage.type",
      "comment storage.modifier",
      "comment entity.name.type",
      "comment support.class",
      "comment support.type",
      "comment variable",
      "comment punctuation",
    ],
    role: "syntax.comment",
  },
  {
    name: "Python docstrings",
    scope: ["string.quoted.docstring", "string.quoted.docstring punctuation.definition.string"],
    role: "syntax.comment",
  },

  // Keywords.
  {
    name: "Keywords",
    scope: [
      "keyword",
      "storage.type",
      "storage.modifier",
      "keyword punctuation",
      "variable.language",
      "variable.parameter.function.language.special.self",
      "variable.parameter.function.language.special.cls",
    ],
    role: "syntax.keyword",
  },
  {
    name: "Word operators",
    scope: [
      "keyword.operator.new",
      "keyword.operator.expression",
      "keyword.operator.logical.python",
      "keyword.operator.word",
      "keyword.operator.wordlike",
      "keyword.operator.sizeof",
      "keyword.operator.alignof",
      "keyword.operator.typeid",
      "keyword.operator.cast",
      "keyword.operator.delete",
      "keyword.operator.instanceof",
    ],
    role: "syntax.keyword",
  },
  {
    // `meta.decorator` would also paint the arguments, so TypeScript only colors the `@`.
    name: "Decorators, annotations and attributes",
    scope: [
      "punctuation.decorator",
      "entity.name.function.decorator",
      "punctuation.definition.decorator",
      "storage.type.annotation",
      "punctuation.definition.annotation",
      "meta.attribute.rust",
    ],
    role: "syntax.keyword",
  },
  {
    name: "Diff headers",
    scope: [
      "meta.diff.header",
      "meta.diff.index",
      "meta.diff.range",
      "meta.diff.header punctuation",
      "meta.diff.range punctuation",
    ],
    role: "syntax.keyword",
  },
  {
    name: "Markup tags",
    scope: ["entity.name.tag"],
    role: "syntax.keyword",
  },

  // Strings.
  {
    name: "Strings",
    scope: [
      "string",
      "punctuation.definition.string",
      "string storage.type.string",
      "keyword.interpolation.scala",
      "constant.character.literal",
      "markup.inline.raw",
      "markup.inline.raw punctuation",
    ],
    role: "syntax.string",
  },

  // Escapes, regular expressions and interpolation delimiters.
  {
    name: "Escapes and placeholders",
    scope: [
      "constant.character.escape",
      "constant.character.format.placeholder",
      "constant.other.placeholder",
      "constant.character.entity",
      "storage.type.format",
      "meta.interpolation.rust",
      "variable.string-escape.kotlin",
    ],
    role: "syntax.escape",
  },
  {
    name: "Interpolation delimiters",
    scope: [
      "punctuation.definition.template-expression",
      "punctuation.definition.interpolation",
      "punctuation.section.embedded",
      "string punctuation.definition.variable",
      "string punctuation.definition.variable variable",
      "string punctuation.definition.subshell",
    ],
    role: "syntax.escape",
  },
  {
    name: "Regular expressions",
    scope: [
      "string.regexp",
      "string.regexp punctuation",
      "string.regexp punctuation.definition.string",
      "string.regexp keyword",
      "string.regexp keyword.operator",
      "string.regexp constant",
      "string.regexp support",
      "string.regexp entity.name.tag",
      "string.regexp storage.type.string",
    ],
    role: "syntax.escape",
  },

  // Constants.
  {
    name: "Numbers, booleans, constants and enum members",
    scope: [
      "constant",
      "support.constant",
      "variable.other.enummember",
      "entity.name.variable.enum-member",
      "keyword.other.unit",
      "constant.language.symbol punctuation",
    ],
    role: "syntax.constant",
  },

  // Definitions.
  {
    name: "Function definitions",
    scope: ["entity.name.function"],
    role: "syntax.definition",
  },
  {
    name: "Type definitions",
    scope: [
      "entity.name.type.class",
      "entity.name.type.interface",
      "entity.name.type.enum",
      "entity.name.type.alias",
      "entity.name.type.struct",
      "entity.name.type.trait",
      "entity.name.type.protocol",
      "entity.name.type.record",
      "entity.name.type.module",
      "entity.name.type.object",
      "entity.name.class.declaration",
    ],
    role: "syntax.definition",
  },
  {
    name: "Sections",
    scope: ["entity.name.section"],
    role: "syntax.definition",
  },

  // Types.
  {
    name: "Types and type references",
    scope: [
      "entity.name.type",
      "entity.name.class",
      "entity.other.inherited-class",
      "entity.name.type.class.extension",
      "support.type",
      "support.class",
      "storage.type.primitive",
      "storage.type.built-in",
      "keyword.type",
      "keyword.other.type.php",
      "storage.type.java",
      "storage.type.generic.java",
      "storage.type.object.array.java",
      "storage.type.sql",
      "variable.other.constant.ruby",
    ],
    role: "syntax.type",
  },
  {
    name: "Go built-in types",
    scope: [
      "storage.type.boolean.go",
      "storage.type.byte.go",
      "storage.type.error.go",
      "storage.type.numeric.go",
      "storage.type.rune.go",
      "storage.type.string.go",
      "storage.type.uintptr.go",
    ],
    role: "syntax.type",
  },
  {
    name: "Go's type keyword",
    scope: ["keyword.type.go"],
    role: "syntax.keyword",
  },
  {
    name: "Keys in data and style languages",
    scope: [
      "support.type.property-name",
      "punctuation.support.type.property-name",
      "entity.name.tag.yaml",
      "variable.other.key.toml",
      "variable.css",
      "entity.other.attribute-name",
      "entity.other.attribute-name punctuation",
    ],
    role: "syntax.type",
  },

  // Invalid and deprecated.
  {
    name: "Invalid code",
    scope: ["invalid"],
    role: "syntax.invalid",
    fontStyle: ["underline"],
  },
  // Deprecated code is not an error: without a color of its own it would inherit red from `invalid`.
  {
    name: "Deprecated code",
    scope: ["invalid.deprecated"],
    role: "syntax.plain",
    fontStyle: ["strikethrough"],
  },
  {
    name: "Deprecated markup tags",
    scope: ["entity.name.tag invalid.deprecated"],
    role: "syntax.keyword",
    fontStyle: ["strikethrough"],
  },

  // Markup.
  {
    name: "Headings",
    scope: ["markup.heading"],
    role: "syntax.definition",
    fontStyle: ["bold"],
  },
  {
    name: "Links",
    scope: ["markup.underline.link", "string.other.link"],
    role: "syntax.type",
    fontStyle: ["underline"],
  },
  { name: "Bold", scope: ["markup.bold"], fontStyle: ["bold"] },
  { name: "Italic", scope: ["markup.italic"], fontStyle: ["italic"] },
  { name: "Strikethrough", scope: ["markup.strikethrough"], fontStyle: ["strikethrough"] },
  {
    name: "Inserted",
    scope: ["markup.inserted", "markup.inserted punctuation"],
    role: "syntax.inserted",
  },
  {
    name: "Deleted",
    scope: ["markup.deleted", "markup.deleted punctuation"],
    role: "syntax.deleted",
  },
];
