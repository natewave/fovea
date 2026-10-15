# 006. TypeScript 6.0.3, not 7

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

The brief asks for strict TypeScript. On 2026-10-14, npm's `latest` tag for `typescript` was 7.0.2, the native build. Its package exports only a version module and `unstable/*` entry points, so tools that load the TypeScript compiler API in-process may not work with it. Astro 7.3.8, which the site will use, lists `typescript ^6.0.3` in its own devDependencies, and Biome's docs state support for TypeScript 5.9. Compatibility with TypeScript 7 could not be verified ([notes](../research/verification/e-engineering.md)).

## Options

1. TypeScript 7.0.2, and fix tools as they break.
2. TypeScript 6.0.3, the line that the site's tooling is built against.

## Decision

Option 2. The workspace pins `typescript` 6.0.3 and runs with `strict`, `noUncheckedIndexedAccess` and `erasableSyntaxOnly`. Node runs the `.ts` sources directly through type stripping, so nothing is compiled for local scripts.

## Consequences

Moving to TypeScript 7 later should only need a version bump once Astro's tooling supports it. `erasableSyntaxOnly` keeps the code free of TypeScript-only runtime syntax, which helps that move.
