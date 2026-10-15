# 007. The maintainer manages the git history

- **Status:** Accepted. Revised by the maintainer on 2026-10-14.
- **Date:** 2026-10-14

## Context

The brief asks for `git init` in phase 1 and a commit at the end of each phase. In the environment where Fovea was built, the sandbox blocks git: `git init` cannot write `.git/config` or `.git/hooks`.

## Options

1. Stop until git works.
2. Keep working without git, then create one commit per phase, in order, once git is available.
3. Keep working without git, and leave the repository and its history to the maintainer.

## Decision

Option 2 was chosen first. At the phase 3 checkpoint the maintainer chose option 3: they create the repository and the commits themselves.

## Consequences

- No commits are made by the build agent, and no history is reconstructed per phase.
- No remote is created and nothing is pushed.
- `pnpm check:stale` and the CI staleness check use `git diff`, so they work once the maintainer has initialized the repository.
