# 001. APCA through Color.js, and how Fovea names it

- **Status:** Accepted. The maintainer chose option 3 on 2026-10-14.
- **Date:** 2026-10-14

## Context

The brief makes APCA the design target and WCAG 2.2 the normative floor. It asks that APCA be used at build time only, never vendored or modified, and that any number labeled "APCA" match the reference algorithm, version 0.0.98G-4g. It also asks for the licence decision to be recorded.

Verification ([notes](../research/verification/c-standards-licensing.md)) found:

- **The reference package does not cover this use.** `apca-w3` (npm 0.1.9, "Limited W3 License") is licensed "for use in WCAG accessibility guidelines for web content only", and lists "uses which are not specific to web-based content" as prohibited. On a plain reading, scoring an editor and terminal theme falls outside that grant. The licence also forbids modification, requires keeping the code current, and brings in `colorparsley`, which npm lists as AGPL v3.
- **Color.js has an independent implementation.** Color.js (`colorjs.io`, MIT) implements APCA 0.0.98G-4g itself. Called as `contrastAPCA(background, text)`, it reproduces all eight published reference values exactly. Myndex, APCA's publisher, lists Color.js among "Code Libraries & Systems with APCA".
- **The name is a trademark.** Myndex's terms say only `apca-w3` counts as "APCA code" without written certification, and that "Trademarks are not included as part of any open-source license". Their lowest named tier, "APCA™ Contrast Value", may use the term "APCA Lc Value", but "MAY NOT present any example using the tested colors" and may make no reference to WCAG 3.
- **The legal question is open.** The sources don't settle whether Myndex's terms reach an independent MIT implementation. Nothing here is legal advice.

## Options

1. **Use `apca-w3`.** Rejected: its licence excludes non-web use, and it depends on an AGPL package.
2. **Use Color.js, label the numbers "APCA Lc", with attribution and a no-affiliation note.** This matches the brief. The risk: the palette page shows swatches next to the values, which Myndex's lowest tier forbids, if those terms apply.
3. **Use Color.js, label the numbers generically** ("perceptual contrast (Lc)"), and name APCA only in the method docs. Less trademark exposure, but less recognizable to readers.
4. **Ask Myndex for written permission.** The terms invite contact at info@readtech.org. Only the maintainer can do this.
5. **Drop APCA and use WCAG 2.2 alone.** Rejected: WCAG 2 overrates dark themes (see the benchmark in [`research.md`](../research.md)), which is the problem APCA is there to fix.

## Decision

Option 3, chosen by the maintainer:

- APCA values come only from Color.js 0.7.1 at build time. No APCA code is vendored, copied or modified, and the site ships precomputed numbers.
- colorlab tests all eight published reference pairs, so the method docs can name the algorithm accurately.
- Public material (the website, the READMEs, the Marketplace listing and generated tables) labels the numbers "perceptual contrast (Lc)", taken from one constant, `CONTRAST_LABEL` in the palette package. It never labels them "APCA".
- APCA is named only in the method docs: [`design.md`](../design.md), [`research.md`](../research.md), these decision records and code comments. Where it is named, the text says the values were computed with Color.js's implementation of APCA 0.0.98G-4g, that APCA is by Andrew Somers and Myndex Research, that Fovea is not affiliated with or endorsed by them, and that the values are design targets, not a compliance claim.
- Fovea never says "APCA compliant", "certified" or "compatible", never uses APCA logos, and never claims WCAG 3 conformance. WCAG 2.2 ratios always appear next to Lc values.

## Consequences

- Readers who know APCA see "Lc" and can follow the link to the method docs; readers who don't get a plain description.
- No page of the website names APCA: every page says "perceptual contrast (Lc)", and a site test fails if one names APCA outside a code sample. Until 2026-10-15 the site also had a Research page generated from `research.md`, treated as method documentation, which named APCA with the attribution and non-affiliation text above. The maintainer removed that page from the site; the dossier stays in the repository, and the site links to it on GitHub.
- If APCA's reference constants change, Color.js and Fovea's tests must follow.
