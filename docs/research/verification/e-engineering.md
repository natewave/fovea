# Fovea — Group E: verified engineering facts

Collected on 2026-10-14 from pages fetched that day. Every fact carries the URL it was read from.

- **UNVERIFIED** means I could not confirm the point from a fetched page.
- **Inference** means a conclusion I drew from the cited facts that no single source states outright.
- "Local install" means I read a file on this machine, not a web page.

---

## Top findings that change the plan

1. **Publishing to the VS Marketplace with a PAT has a hard deadline.** The VS Code publishing guide says: "On December 1, 2026, global Personal Access Tokens (PATs) in Azure DevOps are retired. To keep publishing extensions, use secure automated publishing with Microsoft Entra ID instead of PATs." ([publishing-extension.md](https://raw.githubusercontent.com/microsoft/vscode-docs/main/api/working-with-extensions/publishing-extension.md)). The Azure DevOps blog adds: "December 1, 2026 – All existing global PATs will be fully decommissioned. Tokens will stop working after this date." ([devblogs](https://devblogs.microsoft.com/devops/retirement-of-global-personal-access-tokens-in-azure-devops/)).
   - The same guide tells you to create the Marketplace PAT with Organization = "All accessible organizations". The blog defines global PATs as tokens that "authenticate across all accessible organizations".
   - *Inference:* a `VSCE_PAT` created the documented way stops working on 2026-12-01, about seven weeks from now.
   - Documented replacement: `vsce publish --azure-credential` (Entra ID, documented for Azure Pipelines).
   - Undocumented replacement: `vsce publish --oidc`, GitHub Actions trusted publishing. It ships in vsce 4.0.0 but is hidden from `--help` and absent from the official docs. Whether the Marketplace side is generally available is **UNVERIFIED**. Details in section 1f.
2. **VS Code now ships a new stable release every week**, starting with 1.111 on 2026-03-09. The latest stable is **1.141.1** (2026-10-13), and a "release 1.142" docs commit landed today (section 1b).
3. **The Open VSX namespace `fovea` already exists.** It is unverified and has no extensions. Neither marketplace shows an extension named "Fovea", though a full Marketplace search is **UNVERIFIED** (section 1g).
4. **vsce only understands npm and yarn v1.** In a pnpm workspace, package with `--no-dependencies`. The ovsx README says exactly this for pnpm (section 1f).
5. **iTerm2-Color-Schemes rewrites low-contrast colors when it generates themes** (WCAG threshold 1.75:1), unless the YAML sets `wcag_adjust: false`. This would silently alter Fovea's palette (section 3).
6. **Node 24 is Active LTS today but enters Maintenance on 2026-10-20.** Node 26 becomes Active LTS on 2026-10-28 (section 5a).
7. **`typescript@latest` is 7.0.2**, a native build that ships per-platform binaries. Astro 7.3.8 itself dev-depends on `typescript ^6.0.3`, and Biome documents support for TypeScript 5.9. Whether the tooling works with TS 7 is **UNVERIFIED** (section 5).
8. **The forks set the floor for `engines.vscode`:** Windsurf (now Devin Desktop) is on VS Code 1.126, Cursor on 1.128.0, and VSCodium on 1.140.0 (section 1h).

---

## 1. VS Code themes

### 1a. Theme Color reference

**Source and commits**

- Raw markdown: https://raw.githubusercontent.com/microsoft/vscode-docs/main/api/references/theme-color.md. Its front matter has `DateApproved: 10/14/2026`.
- Latest commits that touch the file, from https://api.github.com/repos/microsoft/vscode-docs/commits?path=api/references/theme-color.md&per_page=3:

| SHA | Date (UTC) | Message |
|---|---|---|
| `f7ee5a5c642aee433e093d8d10a9c056770c77e3` | 2026-10-14T08:21:52Z | VS Code release 1.142 (#10469) |
| `4fe6b03408632f2e9338a970d26afa480e4a022d` | 2026-10-06T23:17:08Z | VS Code release 1.141 (#10431) |
| `8889b0542cb2144fb53f5f53bd19c1395e2d9fa1` | 2026-09-29T22:54:27Z | VS Code release 1.140 (#10404) |

**Line format**

Every key sits on its own top-level bullet: `` - `<key>`: <description> ``. For example:
  - `` - `editor.background`: Editor background color. ``
  - `` - `focusBorder`: Overall border color for focused elements. This color is only used if not overridden by a component. ``
- Some keys have no dot, such as `foreground`, `focusBorder`, `contrastBorder`, and `errorForeground`.

**Parsing it with a script** (I tested this on the raw file)

- Strip the YAML front matter first. It contains comment lines like `# DO NOT TOUCH — Managed by doc writer` that look like Markdown headings.
- Section regex: `^## (.+)$`.
- Key regex: ``^- `([A-Za-z0-9_.\-]+)`: (.*)$``. It matched **971 keys, all unique**.
- There are no indented key bullets and no other key formats.
- Only four other bullets exist in the file. They form a prose list under "Keybinding label colors", for example "- The Command Palette".

**Color format rules** (same file)

- Accepted forms are `#RGB`, `#RGBA`, `#RRGGBB`, and `#RRGGBBAA`. Alpha defaults to `ff`.
- "Some colors should not be opaque in order to not cover other annotations." Individual key descriptions say which ones.

**Sections:** 60 `##` headings, 58 of which contain keys. "Color formats" and "Extension colors" are prose only. Key counts per section, in file order:

Contrast colors 2 · Base colors 10 · Window border 2 · Modern UI colors 29 · Text colors 9 · Action colors 7 · Button control 23 · Dropdown control 4 · Input control 17 · Scrollbar control 5 · Badge 2 · Progress bar 1 · Lists and trees 32 · Activity Bar 20 · Profiles 3 · Side Bar 14 · Minimap 16 · Editor Groups & Tabs 42 · Editor colors 171 · Diff editor colors 21 · Chat colors 15 · Agent sessions colors 32 · Inline Chat colors 10 · Panel Chat colors 2 · Editor widget colors 35 · Peek view colors 16 · Merge conflicts colors 25 · Panel colors 20 · Status Bar colors 35 · Title Bar colors 5 · Menu Bar colors 10 · Command Center colors 9 · Notification colors 11 · Banner colors 3 · Extensions colors 16 · Quick picker colors 8 · Keybinding label colors 4 · Keyboard shortcut table colors 2 · Integrated Terminal colors 61 · Debug colors 18 · Testing colors 32 · Welcome page colors 8 · Git colors 11 · Source Control Graph colors 13 · Settings Editor colors 21 · Breadcrumbs colors 5 · Snippets colors 4 · Symbol Icons colors 33 · Debug Icons colors 20 · Notebook colors 24 · Chart colors 11 · Ports colors 1 · Comments View colors 2 · Action Bar colors 1 · Simple Find Widget colors 1 · Gauge colors 7 · Markdown 5 · Agent Session colors 5. The sum is 971.

**Notable details**

- There are two similarly named sections: "Agent sessions colors" (32 keys) and "Agent Session colors" (5 keys).
- "Modern UI colors" (29 keys) applies "when the modern UI is enabled". Examples are `surface.background`, `modernTab.activeBackground`, and `modernUI.shellBackground`.
- The 16 terminal ANSI keys are `terminal.ansiBlack`, `terminal.ansiRed`, `terminal.ansiGreen`, `terminal.ansiYellow`, `terminal.ansiBlue`, `terminal.ansiMagenta`, `terminal.ansiCyan`, `terminal.ansiWhite`, and the matching `terminal.ansiBright*` keys. Related terminal keys include `terminal.background`, `terminal.foreground`, `terminal.selectionBackground`, `terminal.selectionForeground`, `terminalCursor.background`, and `terminalCursor.foreground`.
- `terminal.findMatchBackground` "must not be opaque so as not to hide underlying terminal content."

### 1b. VS Code version and release cadence

**Latest stable**

- The latest stable is **1.141.1**. GitHub `releases/latest` lists tag `1.141.1`, published 2026-10-13T21:53:53Z, from branch `release/1.141` ([API](https://api.github.com/repos/microsoft/vscode/releases/latest)).
- The updates page reads "Visual Studio Code 1.141 — Released October 7, 2026 Stable … Downloads for 1.141.1 … Update 1.141.1: The update addresses these security issues." ([updates](https://code.visualstudio.com/updates)).
- GitHub shows 1.141.0 published 2026-10-07T11:01:16Z ([releases list](https://api.github.com/repos/microsoft/vscode/releases?per_page=15)).

**1.142**

- https://code.visualstudio.com/updates/v1_142 is titled "Visual Studio Code 1.142 (Insiders)" and was last updated October 12, 2026.
- The vscode-docs commit "VS Code release 1.142 (#10469)" landed 2026-10-14T08:21:52Z, as shown in the table above.
- Whether 1.142 stable is out today is **UNVERIFIED**. It was not on GitHub releases when I fetched them.

**Cadence: yes, weekly since March 2026**

- Issue #300108 says: "Every month since Summer 2025, we shipped one Stable release … **Starting March 9, 2026, we'll ship a new Stable release every week.** Endgame will now be folded into our weekly activities." ([issue](https://github.com/microsoft/vscode/issues/300108)).
- The 1.111.0 release, published 2026-03-09, says: "Welcome to the 1.111 release of Visual Studio Code, **the first of our weekly Stable releases**!" ([release](https://api.github.com/repos/microsoft/vscode/releases/tags/1.111.0)).
- The release list confirms one minor version per week. For example: 1.132.0 on 08-05, 1.133.0 on 08-12, 1.134.0 on 08-19, …, 1.139.0 on 09-23, 1.140.0 on 09-30, 1.141.0 on 10-07 ([releases list](https://api.github.com/repos/microsoft/vscode/releases?per_page=15)).
- Release dates from a third-party table: 1.126.0 on 2026-06-23, 1.128.0 on 2026-07-07, 1.140.0 on 2026-09-30 ([ewanharris/vscode-versions](https://raw.githubusercontent.com/ewanharris/vscode-versions/main/README.md)).

### 1c. Semantic Highlight Guide

Source: https://raw.githubusercontent.com/microsoft/vscode-docs/main/api/language-extensions/semantic-highlight-guide.md (rendered at https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide).

**Standard token types: exactly 23, in the docs' order**

| ID | Description (verbatim) |
|---|---|
| `namespace` | For identifiers that declare or reference a namespace, module, or package. |
| `class` | For identifiers that declare or reference a class type. |
| `enum` | For identifiers that declare or reference an enumeration type. |
| `interface` | For identifiers that declare or reference an interface type. |
| `struct` | For identifiers that declare or reference a struct type. |
| `typeParameter` | For identifiers that declare or reference a type parameter. |
| `type` | For identifiers that declare or reference a type that is not covered above. |
| `parameter` | For identifiers that declare or reference a function or method parameters. |
| `variable` | For identifiers that declare or reference a local or global variable. |
| `property` | For identifiers that declare or reference a member property, member field, or member variable. |
| `enumMember` | For identifiers that declare or reference an enumeration property, constant, or member. |
| `decorator` | For identifiers that declare or reference decorators and annotations. |
| `event` | For identifiers that declare an event property. |
| `function` | For identifiers that declare a function. |
| `method` | For identifiers that declare a member function or method. |
| `macro` | For identifiers that declare a macro. |
| `label` | For identifiers that declare a label. |
| `comment` | For tokens that represent a comment. |
| `string` | For tokens that represent a string literal. |
| `keyword` | For tokens that represent a language keyword. |
| `number` | For tokens that represent a number literal. |
| `regexp` | For tokens that represent a regular expression literal. |
| `operator` | For tokens that represent an operator. |

**Standard token modifiers: exactly 10**

| ID | Description (verbatim) |
|---|---|
| `declaration` | For declarations of symbols. |
| `definition` | For definitions of symbols, for example, in header files. |
| `readonly` | For readonly variables and member fields (constants). |
| `static` | For class members (static members). |
| `deprecated` | For symbols that should no longer be used. |
| `abstract` | For types and member functions that are abstract. |
| `async` | For functions that are marked async. |
| `modification` | For variable references where the variable is assigned to. |
| `documentation` | For occurrences of symbols in documentation. |
| `defaultLibrary` | For symbols that are part of the standard library. |

**Theme syntax**

- `"semanticHighlighting": true` marks a theme as ready for semantic tokens. It "is false by default, but we encourage all themes to enable it." It only takes effect when `editor.semanticHighlighting.enabled` is `configuredByTheme`, which is the default. The setting's other values are `true` and `false`, which force highlighting on or off for every theme.
- `"semanticTokenColors": { "<selector>": <style> }`. Selector form, quoted from the docs: `(*|tokenType)(.tokenModifier)*(:tokenLanguage)?`.
  - Docs examples: `"variable.readonly:java": "#ff0011"`, `"*.declaration": { "bold": true }`, and `"class:java": { "foreground": "#0f0", "italic": true }`. `function:typescript` follows the same form.
- A style can be a string (the foreground color), `{ foreground, bold, italic, underline }`, or `{ foreground, fontStyle }`. Colors use the Theme Color formats, and "Transparency is not supported."
- When no rule matches, or the theme has no `semanticTokenColors` but has semantic highlighting enabled, VS Code maps the token to a TextMate scope and matches it against `tokenColors`.
- Subtypes inherit: a style for `type` also applies to custom subtypes declared with `superType: "type"`.

**Fallback scope map: the docs table, verbatim**

| Semantic selector | Fallback TextMate scope |
|---|---|
| `namespace` | `entity.name.namespace` |
| `type` | `entity.name.type` |
| `type.defaultLibrary` | `support.type` |
| `struct` | `storage.type.struct` |
| `class` | `entity.name.type.class` |
| `class.defaultLibrary` | `support.class` |
| `interface` | `entity.name.type.interface` |
| `enum` | `entity.name.type.enum` |
| `function` | `entity.name.function` |
| `function.defaultLibrary` | `support.function` |
| `method` | `entity.name.function.member` |
| `macro` | `entity.name.function.preprocessor` |
| `variable` | `variable.other.readwrite`, `entity.name.variable` |
| `variable.readonly` | `variable.other.constant` |
| `variable.readonly.defaultLibrary` | `support.constant` |
| `parameter` | `variable.parameter` |
| `property` | `variable.other.property` |
| `property.readonly` | `variable.other.constant.property` |
| `enumMember` | `variable.other.enummember` |
| `event` | `variable.other.event` |

**How the VS Code source differs from the docs**

Source: [tokenClassificationRegistry.ts](https://raw.githubusercontent.com/microsoft/vscode/main/src/vs/platform/theme/common/tokenClassificationRegistry.ts), `main` branch.

Use the source for a precise fallback map. Differences:

- Types the docs table leaves out:
  - `comment` → `comment`
  - `string` → `string`
  - `keyword` → `keyword.control`
  - `number` → `constant.numeric`
  - `regexp` → `constant.regexp`
  - `operator` → `keyword.operator`
  - `typeParameter` → `entity.name.type.parameter`
  - `decorator` → `entity.name.decorator`, then `entity.name.function`
  - `label` has no scope
- **`struct` maps to `entity.name.type.struct` in the source, but the docs say `storage.type.struct`.**
- Second probe scopes: `type` also tries `support.type`, `class` tries `support.class`, and both `function` and `method` try `support.function`.
- Extra `defaultLibrary` defaults:
  - `interface.defaultLibrary` → `support.class`
  - `variable.defaultLibrary` → `support.variable`, then `support.other.variable`
  - `property.defaultLibrary` → `support.variable.property`
  - `property.defaultLibrary.readonly` → `support.constant.property`
  - `member.defaultLibrary` → `support.function`
- There is a deprecated type `member` ("Deprecated use `method` instead").
- The style schema also accepts a boolean `strikethrough`, and "the presence of 'fontStyle' overrides" the `bold`, `italic`, `underline`, and `strikethrough` booleans.
- This file registers only 8 modifiers: `declaration`, `documentation`, `static`, `abstract`, `deprecated`, `modification`, `async`, `readonly`. Where `definition` and `defaultLibrary` get registered is **UNVERIFIED**, though `defaultLibrary` is used in the default selectors above.

### 1d. Color theme guide, `contributes.themes`, and `fontStyle`

**Color theme guide** ([color-theme.md](https://raw.githubusercontent.com/microsoft/vscode-docs/main/api/extension-guides/color-theme.md); rendered at https://code.visualstudio.com/api/extension-guides/color-theme)

- Workbench colors go under `colors`. Syntax colors go under `tokenColors`, which can be an inline array or a path to a `.tmTheme` file, e.g. `"tokenColors": "./Diner.tmTheme"`.
- The example theme file uses `"type": "dark"`.
- Tip: "Give your color definition file the `-color-theme.json` suffix and you will get hovers, code completion, color decorators, and color pickers when editing."
- Tip: "include the word 'theme' in the extension description and set the `Category` to `Themes` in your `package.json`."
- This page does not list the `uiTheme` values or the `fontStyle` values. The two sources below do.

**`contributes.themes`**

From [contribution-points.md](https://raw.githubusercontent.com/microsoft/vscode-docs/main/api/references/contribution-points.md):

```json
{ "contributes": { "themes": [ { "label": "Monokai", "uiTheme": "vs-dark", "path": "./themes/monokai-color-theme.json" } ] } }
```

The schema in VS Code's [themeExtensionPoints.ts](https://raw.githubusercontent.com/microsoft/vscode/main/src/vs/workbench/services/themes/common/themeExtensionPoints.ts) adds:

- `uiTheme` is one of `vs`, `vs-dark`, `hc-black`, `hc-light`. Quoted: "`vs` is the light color theme, `vs-dark` is the dark color theme. `hc-black` is the dark high contrast theme, `hc-light` is the light high contrast theme."
- `path` and `uiTheme` are required. `id` ("Id of the color theme as used in the user settings") and `label` are optional.
- A path outside the extension folder triggers a warning.

**`tokenColors` settings**

From [colorThemeSchema.ts](https://raw.githubusercontent.com/microsoft/vscode/main/src/vs/workbench/services/themes/common/colorThemeSchema.ts):

- `fontStyle`: "Font style of the rule: 'italic', 'bold', 'underline', 'strikethrough' or a combination. **The empty string unsets inherited settings.**"
  - Validation pattern: `^(\s*\b(italic|bold|underline|strikethrough))*\s*$`.
  - The editor snippet `""` is labelled "None (clear inherited style)".
- `foreground` is a hex color. `background` is deprecated: "Token background colors are currently not supported."
- The schema on `main` also lists `fontFamily` (string), `fontSize` (multiplier), and `lineHeight` (multiplier) per token rule. The VS Code version that introduced these is **UNVERIFIED**.
- Top-level theme-file properties in the schema: `colors`, `tokenColors` (array, or a string path to a tmTheme), `semanticHighlighting` (boolean), and `semanticTokenColors`.

### 1e. Extension manifest rules

Sources:

- [extension-manifest.md](https://raw.githubusercontent.com/microsoft/vscode-docs/main/api/references/extension-manifest.md), rendered at https://code.visualstudio.com/api/references/extension-manifest
- [publishing-extension.md](https://raw.githubusercontent.com/microsoft/vscode-docs/main/api/working-with-extensions/publishing-extension.md)
- vsce source: [package.ts](https://raw.githubusercontent.com/microsoft/vscode-vsce/main/src/package.ts) and [validation.ts](https://raw.githubusercontent.com/microsoft/vscode-vsce/main/src/validation.ts)

**`name`**

- Required. "should be all lowercase with no spaces. The name must be unique to the Marketplace."
- vsce's check is `/^[a-z0-9][a-z0-9\-]*$/i`. Note the `i` flag: vsce itself accepts uppercase.
- From the publishing guide: "Once an extension is removed, its extension name is permanently reserved and cannot be reused, even by the original publisher."

**`displayName`**

- Manifest: "The display name must be unique to the Marketplace."
- Publishing FAQ: the "ERROR The extension 'name' already exists in the Marketplace" rule "applies for the display name of an extension" as well.

**`publisher`**

- Required in the manifest. Publisher **ID**: "the **unique** identifier for your publisher in Marketplace … ID cannot be changed once created". Publisher **Name**: "the **unique** name of your publisher that will be displayed in Marketplace".
- vsce uses the same regex as for `name`. It rejects the publisher `vscode-samples`.
- `vsce publish` requires `publisher`. `vsce package` does not; the source says "allow users to package an extension without a publisher for testing reasons" ([package.ts](https://raw.githubusercontent.com/microsoft/vscode-vsce/main/src/package.ts), [publish.ts](https://raw.githubusercontent.com/microsoft/vscode-vsce/main/src/publish.ts)).

**`engines.vscode`**

- Required. The manifest doc says "Cannot be `*`." However, vsce's validator regex `^\*$|^(\^|>=)?((\d+)|x)\.((\d+)|x)\.((\d+)|x)(\-.*)?$` accepts `*`. The docs and the code disagree.
- `^1.8.0` means 1.8.0 and later. `1.8.0` without a caret means only that version.
- Pre-release publishing needs `>= 1.63.0`.
- If `@types/vscode` is a devDependency, it must not be newer (major.minor) than `engines.vscode`.

**`categories`**

- Allowed values: `Programming Languages, Snippets, Linters, Themes, Debuggers, Formatters, Keymaps, SCM Providers, Other, Extension Packs, Language Packs, Data Science, Machine Learning, Visualization, Notebooks, Education, Testing`.

**`keywords`**

- "This list is currently limited to 30 keywords." Exceeding it causes "You exceeded the number of allowed tags of 30".

**`galleryBanner`**

- `{ "color": "#C80000", "theme": "dark" }`. "The `theme` attribute refers to the font to be used in the banner - `dark` or `light`."

**`icon`**

- "The path to the icon of at least 128x128 pixels (256x256 for Retina screens)."
- Publishing guide: use "a PNG file of at least 128x128px".
- vsce rejects SVG icons: "SVGs can't be used as icons".

**README and CHANGELOG images** (publishing guide plus vsce code)

- "Image URLs in `README.md` and `CHANGELOG.md` need to resolve to `https` URLs."
- Images "may not be SVGs unless they are from trusted badge providers".
- vsce also rejects SVG data URLs and inline `<svg>` tags.
- Relative links are rewritten against a public GitHub `repository`, using `main` by default. Override with `--githubBranch`, `--baseContentUrl`, or `--baseImagesUrl`.

**Approved badge hosts**

api.travis-ci.com, app.fossa.io, badge.buildkite.com, badge.fury.io, badgen.net, badges.frapsoft.com, badges.gitter.im, cdn.travis-ci.com, ci.appveyor.com, circleci.com, cla.opensource.microsoft.com, codacy.com, codeclimate.com, codecov.io, coveralls.io, david-dm.org, deepscan.io, dev.azure.com, docs.rs, flat.badgen.net, github.com (from Workflows only), gitlab.com, godoc.org, goreportcard.com, img.shields.io, isitmaintained.com, marketplace.visualstudio.com, nodesecurity.io, opencollective.com, snyk.io, travis-ci.com, visualstudio.com, vsmarketplacebadges.dev.

**Other fields**

- `markdown`: `github` (default) or `standard`.
- `pricing`: `Free` (default) or `Trial`.
- `preview`: boolean.
- `qna`: `marketplace`, a URL, or `false`.
- `sponsor.url`.
- `license`: if a LICENSE file exists, use "SEE LICENSE IN <file>".
- vsce has a `--skip-license` flag ("Allow packaging without license file").

### 1f. Publishing tools: vsce, ovsx, and Open VSX

**@vscode/vsce: 4.0.0**

- Version facts:
  - npm `latest` is **4.0.0** ([registry](https://registry.npmjs.org/@vscode/vsce/latest)).
  - GitHub release v4.0.0 was published 2026-09-14 ([releases](https://api.github.com/repos/microsoft/vscode-vsce/releases?per_page=6)).
  - Prereleases `4.0.1-0` through `4.0.1-3` followed, the last on 2026-10-03.
  - Requires **Node ≥ 22**: package.json has `"engines":{"node":">= 22"}`, and the README says "Node.js at least `22.x.x`".
- 4.0.0 changelog items include "#1308: Raise Node.js baseline to 22", "#1291: auth: support OIDC trusted publishing", and "#1297: Hide OIDC option from publish help". Release 4.0.1-1 added "#1337: oidc: align token exchange with the Marketplace contract".
- Supported package managers, from the [README](https://raw.githubusercontent.com/microsoft/vscode-vsce/main/README.md): "`npm >=6`" and "`yarn >=1 <2`". The publishing guide also says "You can either use npm or yarn v1".
- CLI facts from [main.ts](https://raw.githubusercontent.com/microsoft/vscode-vsce/main/src/main.ts):
  - `vsce package [version]` (alias `pack`).
    - Output and dependencies: `-o, --out`, `--no-dependencies` ("Disable dependency detection via npm or yarn"), `--follow-symlinks`.
    - Release options: `--pre-release`, `--target`.
    - README link handling: `--githubBranch`, `--baseContentUrl`, `--baseImagesUrl`, `--no-rewrite-relative-links`.
    - Validation overrides: `--allow-missing-repository`, `--skip-license`.
  - `vsce publish [version]`.
    - `-p, --pat <token>`, which "defaults to VSCE_PAT environment variable".
    - `--azure-credential` ("Use Microsoft Entra ID for authentication").
    - `--oidc`, which is hidden and cannot be combined with `--pat` or `--azure-credential`.
    - `-i, --packagePath <paths...>` publishes already-built VSIX files.
    - `--skip-duplicate` and `--no-dependencies`.
  - Other commands: `login <publisher>`, `verify-pat`, `show <extensionid>`, `search <text>`, `unpublish`.
- Docs examples:
  - Local: `vsce package` then `vsce publish`.
  - CI: "By storing the PAT as a `VSCE_PAT` secret variable, `vsce` will be able to use it", with `env: VSCE_PAT: ${{ secrets.VSCE_PAT }}` ([continuous-integration.md](https://raw.githubusercontent.com/microsoft/vscode-docs/main/api/working-with-extensions/continuous-integration.md)).
  - Publishing from a git repo with a `[version]` argument "will also create a version commit and tag".
- Trusted publishing, from the vsce README:
  - "`vsce publish --oidc` publishes from GitHub Actions without storing a Personal Access Token. Configure a trusted publishing policy for the repository and workflow on the Visual Studio Marketplace, then grant the workflow permission to request an OIDC token". That means `permissions: id-token: write`.
  - The resulting session token is valid for up to 15 minutes, and vsce "does not fall back to a PAT".
  - The official publishing guide does not mention `--oidc`; it only documents Entra ID through Azure Pipelines. Whether the Marketplace trusted-publishing UI is generally available is **UNVERIFIED**.
- PAT creation, per the publishing guide: Organization **All accessible organizations**, Scopes **Marketplace → Manage**. See finding 1: these are global PATs, which are retired on 2026-12-01.

**ovsx: 1.2.0**

- npm `latest` is **1.2.0** ([registry](https://registry.npmjs.org/ovsx/latest)). The registry metadata was updated 2026-09-10. It depends on `@vscode/vsce ^3.7.1`.
- Commands from the README (same URL) and the [Open VSX wiki](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions), edited Feb 26, 2026; the repo is now `eclipse-openvsx/openvsx`:
  - `npx ovsx create-namespace <name> -p <token>`. Per the wiki, the name must match `publisher`.
  - `npx ovsx publish <file> -p <token>` publishes an existing `.vsix`.
  - `npx ovsx publish -p <token>` packages with vsce, then publishes.
  - Tokens: "pass the token via the `--pat` (or `-p`) argument, or put it into an environment variable named `OVSX_PAT`."
  - Other commands: `login` and `logout`, `unpublish`, `get`, and `verify <extension.vsix>`.
  - Options and environment variables: `--registryUrl` / `OVSX_REGISTRY_URL`, `OVSX_TIMEOUT`, `OVSX_STORE=file`.
- **pnpm, from the ovsx README:** vsce "knows how to do that for two package managers only - npm, and yarn v1 via `--yarn` - and will not be adding more. For anything else, pnpm included, there are two options":
  - "`ovsx publish --no-dependencies` … the right answer for a bundled extension". A theme with no runtime dependencies fits this case.
  - "`ovsx publish --follow-symlinks`".
- Trusted publishing on Open VSX: `npx ovsx publish --trusted-publishing` with `permissions: id-token: write`.
  - It requires "a trusted publisher that a namespace owner registered".
  - Other options: `--idToken` / `OVSX_ID_TOKEN` and `--oidcAudience` / `OVSX_OIDC_AUDIENCE`.
  - An explicit `--pat` takes precedence.
- Namespaces: "Creating a namespace does _not_ automatically give you the exclusive publishing rights. Initially, everyone will be able to publish an extension with the new namespace. If you want exclusive publishing rights, you can claim ownership of a namespace." (README).
- Open VSX account steps, from the wiki:
  1. Create an eclipse.org account with your GitHub username.
  2. Log in to open-vsx.org with GitHub.
  3. Link your Eclipse account and sign the Publisher Agreement.
  4. Generate an access token under Settings → Access Tokens.
  5. Create the namespace.
  6. Publish.
- Open VSX may scan at publish time for "Secret detection", "Blocklist check", and "**Namespace similarity — Prevents typosquatting by detecting names too similar to existing extensions.**" (wiki).
- Cursor's extension panel is fed from Open VSX. Quote: "Cursor uses the Open VSX extension registry for third-party extensions", proxied through `marketplace.cursorapi.com` with malware scanning ([Cursor help](https://cursor.com/help/customization/extensions)).
- Getting a Cursor verified badge, from the same page: "Add a link to your OpenVSX listing on your public website … This must be a website with its own domain name; a GitHub readme is not supported", and "use the same extension ID on OpenVSX as you do elsewhere". Whether a `*.github.io` domain qualifies is **UNVERIFIED**.

### 1g. Name availability: "Fovea"

**Open VSX: no extension; the namespace already exists**

- `https://open-vsx.org/api/-/search?query=fovea&size=50` returned `{"extensions":[],"offset":0,"totalSize":0}`. Zero matches.
- `https://open-vsx.org/api/-/search?query=fovea-theme` returned `totalSize: 2487`. The 18 first-page results are generic theme extensions with no "fovea" in any name or displayName: Gruvbox Theme, Material Icon Theme, One Dark Pro, Vira Theme, Mayukai Theme, Eva Theme, HearthCode Theme, LazyVscode Theme, GitHub Theme, Maple Theme, FullstacksJS Theme, Bearded Theme, Tapetum Theme, BlueForest Theme, Lynx Theme Pro, R3BL Theme, Flux Theme, Halcyon Theme.
- **Namespace `fovea` exists.** `https://open-vsx.org/api/fovea` returned `{"extensions":{},"name":"fovea","verified":false}`. As a control, a random namespace (`https://open-vsx.org/api/zzqx-nonexistent-namespace-8812`) returned 404. Someone created the namespace, it is unclaimed, and it is empty.
  - *Inference:* using `publisher: "fovea"` would mean publishing into an existing, unowned namespace, which you would want to claim. Open VSX's namespace-similarity scan could also matter.
  - The ownership-claim procedure was not fetched: **UNVERIFIED**.
- `https://open-vsx.org/api/-/search?query=fovea-studio&size=10` returned no "fovea" matches; the hits were generic "* Studio" extensions.

**VS Marketplace: nothing found, but the search is incomplete**

- The search page `https://marketplace.visualstudio.com/search?term=fovea&target=VSCode&...` renders client-side; the fetch returned only the page title. The gallery query API is POST-only and the sandbox blocked it.
  - **Full Marketplace name check: UNVERIFIED.** To finish it, run `npx @vscode/vsce search fovea --json` locally; `search` is a real vsce command in main.ts.
- Web searches for `site:marketplace.visualstudio.com fovea` and `"fovea" VS Code theme extension` returned no Marketplace extension named Fovea. Results were unrelated focus-mode extensions.
- `https://marketplace.visualstudio.com/publishers/fovea` returned **404**, while the control `…/publishers/GitHub` returned 200. No publisher with ID `fovea` was visible.
- `https://marketplace.visualstudio.com/items?itemName=oaslananka.fovea-studio` returned 404.

**Other uses of the name found along the way**

- **"fovea-studio" VS Code extension (unpublished).** It belongs to the `oaslananka/fovea` monorepo (edge-AI / YOLO tooling). The page says "PyPI, VS Code Marketplace, and Open VSX publication remain explicitly maintainer-gated" and shows `Fovea: Start Local Server` commands ([libraries.io](https://libraries.io/pypi/fovea-mcp), release 2.0.0, Apr 25, 2026).
  - `https://api.github.com/repos/oaslananka/fovea` now returns 404.
  - The same author's Open VSX namespace lists `fovuxstudiokit`, `kicadstudiokit`, `orbit-vsx`, and `toon-tools-vsx`, with no fovea entries ([API](https://open-vsx.org/api/oaslananka)).
  - A search snippet showed a Marketplace page "Fovux Studio" (`Oaslananka.fovux-studio`), but fetching it returned 404.
  - *Inference:* that project was renamed from Fovea to Fovux.
- **"Fovea — Stunningly simple colour testing"** (fovea-app.com): a colour-blindness simulator and WCAG contrast tester. It sits close to this project's domain. I saw it only in a search snippet; fetching the site directly returned 502, so details are **UNVERIFIED**.
- npm packages `pi-fovea` and `@monotykamary/fovea` (AI repo-mapping tools, [npm](https://www.npmjs.com/package/pi-fovea)), `dsh-fovea`, and the `hellofovea/fovea-memory-mcp` GitHub repo. None are VS Code extensions.
- "Fovea Studio", a one-person lighting-design company in Oslo (search snippets only).
- Closest conceptual neighbour on Open VSX: **Tapetum Theme** (`tuguidragos.tapetum`), another eye-anatomy name, described as "Palettes placed by hand, every colour measured on the surface it sits on."

### 1h. VS Code base versions in Cursor, Windsurf, and VSCodium

| Editor | Build | Reported VS Code base | Source |
|---|---|---|---|
| Cursor | 3.24.12 (stable, 2026-10-09) | `vscodeVersion: 1.128.0` (About dialog: "VS Code Extension API: 1.128.0") | Local install `/Applications/Cursor.app/Contents/Resources/app/product.json`; [forum post](https://forum.cursor.com/t/design-mode-messages-cannot-be-sent/174390) showing the same version, commit, and date |
| Windsurf (now "Devin Desktop") | v3.10.48 (Sept 29, 2026) | VS Code **1.126**: "Updated the base IDE to VS Code 1.126" in v3.6.21 (July 29, 2026); no later base bump in the changelog | [Devin Desktop changelog](https://docs.devin.ai/desktop/changelog). [releases.sh](https://releases.sh/windsurf/releases) says "Windsurf is now Devin Desktop, from Cognition" |
| VSCodium | 1.140.06880 (2026-10-13) | 1.140.0 ("update vscode to 1.140.0") | [API](https://api.github.com/repos/VSCodium/vscodium/releases/latest) |
| VS Code | 1.141.1 (2026-10-13) | (reference) | see 1b |

- Cursor's `product.json` gallery is `https://marketplace.cursorapi.com/_apis/public/gallery` (local install).
- The publishing guide says `engines.vscode` "ensure[s] the extension only gets installed for clients that contain the API you depend on".
- *Inference:* `"engines": { "vscode": "^1.126.0" }` or lower keeps the extension installable in all three. A themes-only extension uses no runtime API. If you also publish pre-releases, the floor is `>= 1.63.0`. VS Code 1.126.0 was released 2026-06-23 ([vscode-versions](https://raw.githubusercontent.com/ewanharris/vscode-versions/main/README.md)).

---

## 2. Ghostty

### 2a. Color-related config options

Source: https://ghostty.org/docs/config/reference. I used [Config.zig](https://raw.githubusercontent.com/ghostty-org/ghostty/main/src/config/Config.zig) on `main` for default values and to check since-versions.

The reference groups paired options under a single heading. For example, `selection-foreground` is documented under `selection-background`.

| Option | Value format (from docs) | Since | Notes |
|---|---|---|---|
| `background` | hex `#RRGGBB` or `RRGGBB`, or a named X11 color | not stated | default `#282C34` (Config.zig) |
| `foreground` | same as `background` | not stated | default `#FFFFFF` (Config.zig) |
| `cursor-color` | hex or X11; also `cell-foreground` or `cell-background` | special values since 1.2.0 | "If this is not set, a default will be chosen." |
| `cursor-text` | hex or X11; "Since version 1.2.0" also `cell-foreground` or `cell-background` | — | |
| `selection-background`, `selection-foreground` | hex or X11; "Since version 1.2.0" also `cell-foreground` or `cell-background` | — | unset means "the inverted window background and foreground" |
| `palette` | `N=COLOR`, where N is 0–255 (decimal, or `0b`, `0o`, `0x` prefixed) and COLOR is `#AABBCC`, `AABBCC`, or X11 | not stated | "For most themes, you only need to set the first 16 colors (0–15)" |
| `palette-generate` | boolean, default `false` | **1.3.0** | Generates indices 16–255 (the 6×6×6 cube and 24-step gray ramp) from the base 16. "Colors that have been explicitly set via `palette` are never overwritten." |
| `palette-harmonious` | boolean, default off | **1.3.0** | Inverts the generated palette order for light/dark friendliness. No effect unless `palette-generate` is on. |
| `search-background`, `search-foreground` | hex, X11, `cell-foreground`, or `cell-background` | not stated | Non-focused search matches. Default "black text on a golden yellow background" (`#FFE082` in Config.zig). |
| `search-selected-background`, `search-selected-foreground` | same as above | not stated | The focused match. Default "black text on a soft peach background" (`#F2A57E`). |
| `split-divider-color` | hex or X11 | **1.1.0** | |
| `unfocused-split-fill` | hex or X11 | not stated | "This will default to the background color." |
| `unfocused-split-opacity` | number, clamped to 0.15–1 | not stated | default 0.7 (Config.zig); 1 disables the dimming |
| `bold-color` | a color, or `bright` | **1.2.0** | replaces the deprecated `bold-is-bright` |
| `minimum-contrast` | number from 1 to 21 | not stated | default `1` (Config.zig) |
| `alpha-blending` | `native`, `linear`, or `linear-corrected` | **1.1.0** | default `native` on macOS, `linear-corrected` elsewhere |
| `window-colorspace` | `srgb` (default) or `display-p3` | not stated | "currently only supported on macOS" |
| `theme` | built-in name, custom name, absolute path, or `light:NAME,dark:NAME` | not stated | quotes below |

The search options carry no "Available since" tag in the docs or in Config.zig. Scrollback search itself is new in 1.3.0 according to the release notes. *Inference:* the search colors arrived with 1.3.0.

Other color-adjacent options in the same reference:

- `window-theme`: `auto`, `system`, `light`, `dark`, or `ghostty`. `ghostty` is Linux only.
- `window-titlebar-background` and `window-titlebar-foreground`: GTK only, and only when `window-theme = ghostty`.
- `window-padding-color`: `background`, `extend`, or `extend-always`.
- Opacity: `background-opacity`, `background-opacity-cells` (since 1.2.0), `faint-opacity` (since 1.2.0), `cursor-opacity`.
- `osc-color-report-format`: `none`, `8-bit`, or `16-bit` (default `16-bit`).
- `macos-icon-ghost-color` and `macos-icon-screen-color` exist; I did not read their details.

**`theme`, quoted from the reference**

- On directories: "The first directory is the `themes` subdirectory of your Ghostty configuration directory. This is `$XDG_CONFIG_HOME/ghostty/themes` or `~/.config/ghostty/themes`."
  - The second is the resources directory: `Ghostty.app/Contents/Resources/ghostty/themes` on macOS, `share/ghostty/themes` on Linux.
  - Lookup "is case sensitive on systems with case-sensitive filesystems. It is an error for a theme name to include path separators unless it is an absolute pathname."
- On trust: "A theme file is simply another Ghostty configuration file. They share the same syntax and same configuration options. A theme can set any valid configuration option so please do not use a theme file from an untrusted source. **The built-in themes are audited to only set safe configuration options.**"
- On restrictions and overrides: "A theme file cannot set `theme` or `config-file`. … they will be silently ignored." Also: "Any additional colors specified via background, foreground, palette, etc. will override the colors specified in the theme."
- On light/dark pairs: "To specify a different theme for light and dark mode, use the following syntax: `light:theme-name,dark:theme-name`. For example: `light:Rose Pine Dawn,dark:Rose Pine`. Whitespace around all values are trimmed and order of light and dark does not matter. Both light and dark must be specified in this form. In this form, the theme used will be based on the current desktop environment theme."
  - Known bug: "macOS: titlebar tabs style is not updated when switching themes."

**`minimum-contrast`, quoted:** "The minimum contrast ratio between the foreground and background colors. The contrast ratio is a value between 1 and 21. A value of 1 allows for no contrast (e.g. black on black). This value is the contrast ratio as defined by the WCAG 2.0 specification. If you want to avoid invisible text (same color as background), a value of 1.1 is a good value. If you want to avoid text that is difficult to read, a value of 3 or higher is a good value. The higher the value, the more likely that text will become black or white. This value does not apply to Emoji or images."

**`alpha-blending`, quoted:** "What color space to use when performing alpha blending. This affects the appearance of text and of any images with transparency. Additionally, custom shaders will receive colors in the configured space. On macOS the default is `native`, on all other platforms the default is `linear-corrected`." The three values:
  - `native`: "Perform alpha blending in the native color space for the OS. On macOS this corresponds to Display P3, and on Linux it's sRGB."
  - `linear`: "Perform alpha blending in linear space. This will eliminate the darkening artifacts around the edges of text that are very visible when certain color combinations are used (e.g. red / green), but makes dark text look much thinner than normal and light text much thicker. This is also sometimes known as 'gamma correction'."
  - `linear-corrected`: "Same as `linear`, but with a correction step applied for text that makes it look nearly or completely identical to `native`, but without any of the darkening artifacts."
  - "Available since: 1.1.0"

### 2b. Ghostty releases

- **Latest release: 1.3.1, released March 13, 2026.** 1.3.0 was released March 9, 2026; before that came 1.2.3 (Oct 23, 2025) and 1.2.0 (Sept 15, 2025) ([release notes](https://ghostty.org/docs/install/release-notes)).
- GitHub releases for ghostty-org/ghostty only contain the rolling `tip` ("Nightly") build ([API](https://api.github.com/repos/ghostty-org/ghostty/releases?per_page=8)).
- `main` is at version `1.3.2-dev` ([build.zig.zon](https://raw.githubusercontent.com/ghostty-org/ghostty/main/build.zig.zon)).
- What 1.3 added for colors:
  - `palette-generate` and `palette-harmonious`, both marked "Available since: 1.3.0" in the reference.
  - Scrollback search, which uses the `search-*` colors ([1.3.0 notes](https://ghostty.org/docs/install/release-notes/1-3-0)).
  - Smaller items in the 1.3.0 notes: "macOS: Right-click tabs to set a tab color"; "IME preedit text is now rendered with underlines instead of inverted colors"; custom-shader uniforms that include the "color scheme"; and "GTK: If 4.2 is available, use media queries and `prefers-color-scheme` in CSS".
  - The 1.3.0 notes page does not mention `palette-generate` by name. I grepped for "palette", "256", and "generat".

### 2c. Theme file docs

Source: https://ghostty.org/docs/features/theme.

- Built-in themes: "The built-in themes are sourced from iterm2-color-schemes and updated in the Ghostty repository on the main branch weekly. If you want to contribute a new theme, please contribute it to iterm2-color-schemes and it will be automatically picked up by Ghostty."
  - The "audited to only set safe configuration options" sentence is in the config reference under `theme` (2a), not on this page.
- List themes with `ghostty +list-themes`. Light/dark example: `theme = dark:Catppuccin Frappe,light:Catppuccin Latte`.
- Format: "Themes are no different than any other configuration file in Ghostty; they just happen to typically only set color options."
  - The page says a custom theme should set `background`, `foreground`, `cursor-color`, `selection-foreground`, `selection-background`, and `palette`. Its example also sets `cursor-text`.
  - Load order: "Themes are loaded first and any conflicting options in the user configuration will override the theme."
  - Lookup by name searches `$XDG_CONFIG_HOME/ghostty/themes`, then `$PREFIX/share/ghostty/themes`.
- How themes reach Ghostty: `build.zig.zon` pins `.iterm2_themes = .{ .url = "https://deps.files.ghostty.org/ghostty-themes-release-20261005-151109-31756e7.tgz", … }`. That tarball is a mirror of an iTerm2-Color-Schemes release asset (see section 3).

---

## 3. iTerm2-Color-Schemes

**Repository and contribution docs**

- Repo: https://github.com/mbadolato/iTerm2-Color-Schemes. Default branch `master`, 27,255 stars, homepage terminalthemes.com, license "Other" ([API](https://api.github.com/repos/mbadolato/iTerm2-Color-Schemes)).
- There is **no `CONTRIBUTING.md`**; `…/master/CONTRIBUTING.md` returned 404. The contribution rules live in four places:
  - the README "Contribute" section ([README](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/README.md))
  - [AGENTS.md](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/AGENTS.md)
  - [yaml/README.md](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/yaml/README.md)
  - the [PR template](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/.github/pull_request_template.md)

**Where new themes go**

- Put new themes in `yaml/` as `yaml/Your Theme Name.yml`. AGENTS.md: "**Prefer YAML** unless the theme is being exported directly from iTerm2."
- Naming: "Use the display name as the filename — spaces are fine; do not slugify or use underscores."
- "YAML `name:` must match the filename if set."
- The PR template says "Be sure to submit in either .itermcolors or .yml format."
- Edit sources, not outputs: "do **not** hand-edit files in generated format directories."
- **AGENTS.md requires AI disclosure:** "Note AI agent involvement in commit messages and PR descriptions."

**YAML keys**

yaml/README.md describes the format as "an extension of the YAML format used by Gogh". It lists these optional extra keys: `badge`, `bold` (defaults to `foreground`), `cursor_guide` (defaults to `cursor`), `cursor_text` (defaults to `foreground`), `link`, `selection_text` (defaults to `background`), `selection` (defaults to `foreground`), `tab`, `underline`.

The generator, [tools/gen.py](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/tools/gen.py), is the authoritative list:

- **Metadata keys:** `name`, `author`, `variant`, and **`wcag_adjust`** (not documented in yaml/README.md).
- **Color keys:** `color_01` … `color_16`, mapped to ANSI 0–15, plus `background`, `foreground`, `cursor`, `cursor_text`, `cursor_guide`, `selection`, `selection_text`, `bold`, `link`, `tab`, `underline`, `badge`. Unknown keys print a warning.
- **Value format:** a quoted hex string such as `"#1e1e2e"`. It is parsed as RRGGBB after stripping `#`.
- **Fallbacks in code:** cursor guide ← cursor; **cursor text ← background**; selected text ← background; selection ← foreground; bold ← foreground.
  - **The code's cursor-text fallback (background) contradicts yaml/README.md (foreground).** Set `cursor_text` explicitly.
- *Inference:* `cursor` is effectively required. The YAML reader copies `Cursor Color` into `Cursor Guide Color` without checking that it exists.

**WCAG auto-adjust (on by default)**

- Threshold is 1.75:1. Each of these is checked against `background`: `foreground`, ANSI 1–14 (not 0 or 15), and `cursor`. `cursor_text` is checked against `cursor`, and `selection_text` against `selection`.
- A failing color is stepped toward white on dark backgrounds or toward black on light ones.
- Opt out with `wcag_adjust: false`. The code comment says: "Set `wcag_adjust: false` in the YAML when authored palette fidelity must win".
- The README says: "Failing checks are OK — `gen.py` may adjust colors during generation to meet the minimum contrast threshold (1.75:1)."

**Light and dark variants**

- Nothing special is required. Each variant is its own file, for example `Catppuccin Mocha.yml` with `variant: "dark"` and [`Catppuccin Latte.yml`](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/yaml/Catppuccin%20Latte.yml) with `variant: "light"`.
- If `variant` is missing, gen.py sets `Dark` or `Light` from the background luminance: `0.2126*r + 0.7152*g + 0.0722*b < 127` on 0–255 values means dark.
- The README screenshot gallery is split into "Dark Themes" and "Light Themes".

**Example source YAML**, copied verbatim from [yaml/Catppuccin Mocha.yml](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/yaml/Catppuccin%20Mocha.yml):

```yaml
name: "Catppuccin Mocha"
author: "Catppuccin (https://github.com/catppuccin/)"
variant: "dark"

color_01: "#45475a"
color_02: "#f38ba8"
color_03: "#a6e3a1"
color_04: "#f9e2af"
color_05: "#89b4fa"
color_06: "#f5c2e7"
color_07: "#94e2d5"
color_08: "#bac2de"

color_09: "#585b70"
color_10: "#f7aec2"
color_11: "#c2ecbf"
color_12: "#fcd682"
color_13: "#aeccfc"
color_14: "#f398da"
color_15: "#b1eae1"
color_16: "#a6adc8"

background: "#1e1e2e"
foreground: "#cdd6f4"
cursor: "#f5e0dc"
cursor_text: "#1e1e2e"
selection: "#f5e0dc"
selection_text: "#1e1e2e"
```

**The generated Ghostty file** for the same theme, from [ghostty/Catppuccin Mocha](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/ghostty/Catppuccin%20Mocha). It has no file extension. It is produced by the Jinja2 template [tools/templates/ghostty](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/tools/templates/ghostty), which emits `palette = 0..15`, `background`, `foreground`, `cursor-color`, an optional `cursor-text`, `selection-background`, and `selection-foreground`:

```ini
palette = 0=#45475a
palette = 1=#f38ba8
palette = 2=#a6e3a1
palette = 3=#f9e2af
palette = 4=#89b4fa
palette = 5=#f5c2e7
palette = 6=#94e2d5
palette = 7=#bac2de
palette = 8=#585b70
palette = 9=#f7aec2
palette = 10=#c2ecbf
palette = 11=#fcd682
palette = 12=#aeccfc
palette = 13=#f398da
palette = 14=#b1eae1
palette = 15=#a6adc8
background = #1e1e2e
foreground = #cdd6f4
cursor-color = #f5e0dc
cursor-text = #1e1e2e
selection-background = #f5e0dc
selection-foreground = #1e1e2e
```

**Generator and tools**

- From AGENTS.md and the README:
  - `cd tools && python gen.py` (everything), `python gen.py -s "Name"` (one scheme), `python gen.py -t ghostty` (one template).
  - `./generate-all.sh` runs everything in Docker; `./generate-all-nodocker.sh` is the macOS full pipeline.
  - Converters: `tools/ghostty_to_yaml.py` and `tools/kitty_to_yaml.py`, which read stdin and write YAML.
  - `tools/wcag_check.py -s "Name"`; for YAML themes, generate first.
  - Screenshots: `python3 -m screenshot_gen`.
  - Python 3.10, from `.python-version`.
- The [tools/ listing](https://api.github.com/repos/mbadolato/iTerm2-Color-Schemes/contents/tools) also includes `genMD.py`, `generate_screenshots_readme.py`, `preview_theme.py`, and `templates/`.
- CI: [.github/workflows/generate-all.yml](https://api.github.com/repos/mbadolato/iTerm2-Color-Schemes/contents/.github/workflows) regenerates themes on pushes to `master` that touch `schemes/`, `yaml/`, or `screenshots/README.md` (per AGENTS.md).
- Releases: [create-release.yml](https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/.github/workflows/create-release.yml) runs on `cron: "0 15 * * 1"`, every Monday at 15:00 UTC. It publishes per-format archives including `ghostty-themes.tgz`.
  - The latest release is `release-20261012-151317-d3e95e4`, published 2026-10-12 ([API](https://api.github.com/repos/mbadolato/iTerm2-Color-Schemes/releases/latest)).
  - Ghostty `main` currently pins the 2026-10-05 release (section 2c).
  - *Inference:* a theme merged upstream reaches Ghostty `main` within about one to two weekly cycles, and reaches Ghostty users only in the next tagged Ghostty release.

---

## 4. Astro and GitHub Pages

### 4a. Astro

- npm `latest` is **7.3.8**, registry updated 2026-10-08 ([registry](https://registry.npmjs.org/astro/latest)). Its dependencies include `vite ^8.3.1` and `shiki ^4.4.3`; its devDependencies include `typescript ^6.0.3`.
- GitHub Pages guide ([docs](https://docs.astro.build/en/guides/deploy/github/)):
  - **Workflow.** The guide's `.github/workflows/deploy.yml` uses `actions/checkout@v7`, then `withastro/action@v6` in the build job, then `actions/deploy-pages@v5` in a deploy job with `environment: github-pages`. Permissions are `contents: read`, `pages: write`, `id-token: write`.
    - `withastro/action` inputs: `path`, `node-version` ("Defaults to 24"), `package-manager` ("Automatically detected based on your lockfile", so commit `pnpm-lock.yaml`), and `build-cmd`.
  - **`site`:** `https://<username>.github.io`, or `https://<random>.pages.github.io/` for private organization pages.
  - **`base`:** "usually required". Set it to the repository name with a leading slash, e.g. `/my-repo`. Skip it if the repo is `<username>.github.io`. "When this value is configured, all of your internal page links must be prefixed with your `base` value".
  - **Custom domain:** add `public/CNAME`, set `site` to the domain, and "Do not set a value for `base`, and remove one if it exists".
  - In repo settings, choose Pages → Source: **GitHub Actions**.
- `withastro/action` latest is **v6.1.3** (2026-09-14). It moved to `actions/setup-node` v7 ([API](https://api.github.com/repos/withastro/action/releases/latest)).

### 4b. GitHub Actions versions

**`actions/configure-pages`** ([action.yml](https://raw.githubusercontent.com/actions/configure-pages/main/action.yml)) runs on `node24`.

- Inputs:
  - `static_site_generator`: "nuxt", "next", "gatsby", or "sveltekit". **No Astro.**
  - `generator_config_file`.
  - `token`, default `${{ github.token }}`.
  - `enablement`, default `'false'`. It needs a token other than `GITHUB_TOKEN`.
- Outputs, verbatim:
  - `base_url`: "GitHub Pages site full base URL. Examples: "https://octocat.github.io/my-repo", "https://octocat.github.io", "https://www.example.com""
  - `origin`: "GitHub Pages site origin. Examples: "https://octocat.github.io", "https://www.example.com""
  - `host`: "GitHub Pages site host. Examples: "octocat.github.io", "www.example.com""
  - `base_path`: "GitHub Pages site full base path. Examples: "/my-repo" or """

Latest releases, from each repo's `releases/latest` API (`https://api.github.com/repos/<owner>/<repo>/releases/latest`):

| Action | Latest | Published | Major to pin | Notes from the release |
|---|---|---|---|---|
| actions/configure-pages | v6.0.0 | 2026-03-25 | `@v6` | "upgrade to node 24" |
| actions/upload-pages-artifact | v5.0.0 | 2026-04-10 | `@v5` | "Update upload-artifact action to version 7"; adds an `include-hidden-files` input |
| actions/deploy-pages | v5.0.1 | 2026-09-01 | `@v5` | backoff and jitter in deployment polling |
| actions/checkout | v7.0.1 | 2026-07-20 | `@v7` | |
| actions/setup-node | v7.1.0 | 2026-10-08 | `@v7` | immutable release; docs mention a "V7 ESM migration and NODE_AUTH_TOKEN behavior change" |
| actions/upload-artifact | v7.0.2 | 2026-10-07 | `@v7` | |
| pnpm/action-setup | v6.1.0 | 2026-09-05 | `@v6` | "feat: support pnpm v12" |
| withastro/action | v6.1.3 | 2026-09-14 | `@v6` | |

### 4c. lychee-action

- **lycheeverse/lychee-action v2.9.0**, published 2026-07-09 ([API](https://api.github.com/repos/lycheeverse/lychee-action/releases/latest)). Pin `lycheeverse/lychee-action@v2`, or `@v2.9.0` exactly.
- It bumps the default lychee to `v0.24.2`. lychee 0.24 adds line and column numbers, `sitemap.xml` inputs, JUnit output, multiple config files, and explicit timeouts.
- The action now installs into `$RUNNER_TEMP/lychee/bin`.

---

## 5. Tooling

### 5a. Node.js

- Release schedule ([schedule.json](https://raw.githubusercontent.com/nodejs/Release/main/schedule.json)):
  - **v24 "Krypton":** LTS since 2025-10-28, **Maintenance from 2026-10-20**, end of life 2028-04-30.
  - **v26:** started 2026-05-05, **LTS from 2026-10-28**, Maintenance from 2027-10-20, end of life 2029-04-30.
  - **v22 "Jod":** Maintenance since 2025-10-21, end of life 2027-04-30.
  - **v20:** end of life 2026-04-30.
- **On 2026-10-14 the Active LTS line is v24 (Krypton).** It becomes Maintenance LTS in 6 days, and v26 becomes Active LTS in 14 days.
- Latest patch versions ([dist index](https://nodejs.org/dist/index.json)):
  - **v24.21.0**, 2026-09-07, `lts: "Krypton"`, npm 11.19.0
  - **v26.11.1**, 2026-10-07, Current, npm 11.20.0
  - v22.23.3, 2026-09-23, Jod
- The [releases page](https://nodejs.org/en/about/previous-releases) shows v26 "Current", v24 and v22 "LTS", and v20 "EOL". It adds: "Starting with Node.js 27, the release cycle will be annual and every major version will move to LTS status after its six-month Current phase (and six additional months of Alpha phase)."

### 5b. pnpm

- **pnpm 12.11.2** is npm `latest` ([registry](https://registry.npmjs.org/pnpm/latest)). It was published 2026-10-09, decoded from the registry's upload timestamp, via the GitHub Actions trusted publisher.
- `engines.node` is `>=18.*`. The package installs these binaries: `pnpm`, `pnpx`, `pn`, `pnx`.
- `pnpm/action-setup` added pnpm v12 support in v6.1.0.

### 5c. Biome

- **@biomejs/biome 2.5.15** is npm `latest`, registry updated 2026-09-30 ([registry](https://registry.npmjs.org/@biomejs/biome/latest)).
- **Astro support is experimental (🟡), for both formatting and linting** ([language support](https://biomejs.dev/internals/language-support/)):
  - The table marks Astro's Parsing, Formatting, and Linting as 🟡 "Experimental", and Plugin Support as 🚫 "Not started". Vue and Svelte are the same.
  - History: "Since version `v2.3.0`, Biome supports Vue, Svelte and Astro file out of the box … format and lint the HTML, CSS and JavaScript parts". v2.4.0 brought better language-specific syntax, and v2.5.0 improved cross-language lint rules, "but may flag some false positives".
  - **How to enable:** "Since full support is still experimental, it must be enabled explicitly. The formatter is still experimental, so it must also be enabled explicitly." In `biome.json`:

    ```json
    { "html": { "experimentalFullSupportEnabled": true, "formatter": { "enabled": true } } }
    ```

  - Without full support, the docs advise an `overrides` entry for `**/*.astro` that turns off `style.useConst`, `style.useImportType`, `correctness.noUnusedVariables`, and `correctness.noUnusedImports`.
- The same page says "Biome supports TypeScript version 5.9." Compare that with typescript `latest` 7.0.2 below.

### 5d. Package versions (npm `latest`, fetched 2026-10-14)

| Package | Latest | Date / notes | Source |
|---|---|---|---|
| typescript | **7.0.2** | Published 2026-07-08 (decoded upload timestamp). Native build with `@typescript/typescript-<platform>` binaries. `exports["."]` is `./lib/version.cjs`, plus `./unstable/*` entry points. Other tags: `rc` 7.0.1-rc, `next` 7.1.0-dev.20261014.1, `beta` 6.0.0-beta ([dist-tags](https://registry.npmjs.org/-/package/typescript/dist-tags)). | https://registry.npmjs.org/typescript/latest |
| vitest | **5.0.4** | Updated 2026-10-12. Peer `vite ^6.4.0 \|\| ^7.0.0 \|\| ^8.0.0`. | https://registry.npmjs.org/vitest/latest |
| @playwright/test | **1.64.0** | Published 2026-10-07 (decoded). `engines.node >=20`. | https://registry.npmjs.org/@playwright/test/latest |
| @axe-core/playwright | **4.13.0** | Published 2026-08-11 (decoded). Depends on `axe-core ~4.13.0`. Peer `playwright-core >= 1.0.0`. License MPL-2.0. | https://registry.npmjs.org/@axe-core/playwright/latest |
| shiki | **4.5.0** | Updated 2026-10-01. | https://registry.npmjs.org/shiki/latest |
| colorjs.io | **0.7.1** | Updated 2026-07-24. | https://registry.npmjs.org/colorjs.io/latest |
| culori | **4.0.2** | Updated 2026-04-03. | https://registry.npmjs.org/culori/latest |
| tsx | **4.23.15** | Updated 2026-09-20. Depends on `esbuild ~0.28.0`. | https://registry.npmjs.org/tsx/latest |
| @fontsource/atkinson-hyperlegible-next | **5.3.0** | 2026-07-19. Weights 200–800, italic and normal, latin and latin-ext. OFL-1.1. Font version v7. | https://registry.npmjs.org/@fontsource/atkinson-hyperlegible-next/latest |
| @fontsource/atkinson-hyperlegible-mono | **5.3.0** | 2026-07-19. Weights 200–800, italic and normal, latin and latin-ext. OFL-1.1. Font version v8. | https://registry.npmjs.org/@fontsource/atkinson-hyperlegible-mono/latest |
| @vscode/vsce | 4.0.0 | 2026-09-14. Node ≥ 22. | https://registry.npmjs.org/@vscode/vsce/latest |
| ovsx | 1.2.0 | Registry updated 2026-09-10. | https://registry.npmjs.org/ovsx/latest |
| astro | 7.3.8 | Registry updated 2026-10-08. | https://registry.npmjs.org/astro/latest |
| @biomejs/biome | 2.5.15 | Registry updated 2026-09-30. | https://registry.npmjs.org/@biomejs/biome/latest |
| pnpm | 12.11.2 | 2026-10-09. | https://registry.npmjs.org/pnpm/latest |

Note on TypeScript 7: it is `latest`, but its manifest exposes only a version module and `unstable/*` APIs as package exports. Whether `@astrojs/check` and similar tools work with TS 7 is **UNVERIFIED**. Astro itself pins `typescript ^6.0.3` in its devDependencies.

---

## UNVERIFIED and open items

1. Whether a VS Marketplace extension or displayName "Fovea" exists. The search page renders client-side and the gallery API was blocked. Run `npx @vscode/vsce search fovea --json` locally.
2. Who created the Open VSX namespace `fovea`, and how to claim it (the ownership-claim procedure was not fetched).
3. Whether the VS Marketplace "trusted publishing policy" behind `vsce publish --oidc` is generally available. The flag exists but is hidden, and the official docs do not mention it. Also unverified: whether `--azure-credential` works from GitHub Actions (the docs only show Azure Pipelines).
4. Whether VS Code 1.142 stable was released today. A docs commit exists, but there was no GitHub release at fetch time.
5. Since-versions for Ghostty's `search-*`, `unfocused-split-*`, `minimum-contrast`, `window-colorspace`, `background`/`foreground`, and `palette`. The docs and Config.zig give none.
6. Where VS Code registers the `definition` and `defaultLibrary` semantic modifiers; they are not in the core registry file.
7. Which VS Code version introduced the `fontFamily`, `fontSize`, and `lineHeight` token-rule settings.
8. Whether a `*.github.io` site satisfies Cursor's "website with its own domain name" rule for publisher verification.
9. Details of fovea-app.com ("Fovea — Stunningly simple colour testing"). The direct fetch returned 502; I saw it only in a search snippet.
10. Compatibility of Biome, `@astrojs/check`, and similar tools with TypeScript 7.0.2.
