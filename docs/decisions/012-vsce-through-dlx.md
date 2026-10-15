# 012. vsce and ovsx run through `pnpm dlx`

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

Packaging and publishing the extension need `@vscode/vsce`, and publishing to Open VSX needs `ovsx`. As dev dependencies of the workspace, both pull dozens of packages into every install, including ones that create `.idea` directories (`tunnel`, `iconv-lite`). The sandbox where Fovea was built refuses to create any directory named `.idea`, so `pnpm install` failed for the whole workspace once they were added.

## Options

1. Keep them as dev dependencies and install them outside the sandbox.
2. Run pinned versions through `pnpm dlx` only when packaging or publishing.
3. Vendor a packaging script that writes the VSIX zip directly.

## Decision

Option 2. `pnpm package:vscode` runs `pnpm dlx @vscode/vsce@4.0.0 package`, and `release.yml` runs the same version to publish and `ovsx@1.2.0` for Open VSX. The `VSCE_BIN` environment variable can point the packaging script at another vsce binary.

## Consequences

- `pnpm install` stays small and works in restricted environments.
- Packaging needs network access the first time, to fetch vsce.
- The versions are pinned in `scripts/package-vscode.ts` and `release.yml` instead of the lockfile, so updating them is a manual edit.
