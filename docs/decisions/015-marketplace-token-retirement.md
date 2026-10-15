# 015. Marketplace publishing keeps `VSCE_PAT`, which stops working on 1 December 2026

- **Status:** Accepted
- **Date:** 2026-10-15

## Context

The brief asks for a release workflow that publishes on `v*` tags, and only when the `VSCE_PAT` and `OVSX_PAT` secrets exist. The engineering verification found that the Visual Studio Marketplace half of that design has an end date ([engineering notes](../research/verification/e-engineering.md)):

- VS Code's publishing guide says to create the Marketplace token with the organization set to "All accessible organizations", which makes it a global personal access token.
- The same guide says: "On December 1, 2026, global Personal Access Tokens (PATs) in Azure DevOps are retired. To keep publishing extensions, use secure automated publishing with Microsoft Entra ID instead of PATs." The Azure DevOps blog adds that existing global tokens "will stop working after this date".
- The documented replacement, `vsce publish --azure-credential` (Microsoft Entra ID), is documented only for Azure Pipelines. vsce 4.0.0 also has `vsce publish --oidc` for trusted publishing from GitHub Actions, but the flag is hidden from `--help` and missing from the official docs, and whether the Marketplace side is generally available couldn't be verified.
- Open VSX tokens (`OVSX_PAT`) are not affected.

## Options

1. Keep the brief's design: publish with `VSCE_PAT`, and document the deadline.
2. Switch the Marketplace step to Microsoft Entra ID (`azure/login` plus `--azure-credential`). This needs an Azure subscription and a service principal, and running it from GitHub Actions isn't documented.
3. Switch the Marketplace step to trusted publishing (`--oidc`). No stored secret, but it relies on an undocumented flag and a Marketplace feature that couldn't be verified.

## Decision

Option 1. It is what the brief asks for and it works until the deadline, while both alternatives depend on setups that couldn't be verified. `release.yml` keeps the `VSCE_PAT` and `OVSX_PAT` gate, with two changes that limit the damage when the Marketplace step fails:

- Open VSX is published first, so a Marketplace failure doesn't block it.
- A re-run reuses the draft release if it exists, and both publish steps pass `--skip-duplicate`, so after fixing the Marketplace credential the workflow can simply be run again.

## Consequences

- Before 1 December 2026, a token created as the publishing guide describes can publish.
- From 1 December 2026, the Marketplace step fails with a global token. The draft GitHub release and the Open VSX listing are unaffected.
- Before then, switch the Marketplace step to Microsoft Entra ID, or to trusted publishing once the Marketplace documents it, and record that change in a new decision.
