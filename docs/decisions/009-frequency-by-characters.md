# 009. Syntax hues follow character counts, not token counts

- **Status:** Accepted
- **Date:** 2026-10-14

## Context

The brief (§4.4) asks to "count how often each highlighted class appears" in the fixtures and a corpus of real code, and to "give the most comfortable, legible mid-spectrum hues (yellow, green, orange) to the most frequent classes". §4.6 already fixes two classes as quiet, low-chroma colors: keywords and types.

"How often" can be counted two ways, and the [frequency report](../generated/token-frequency.md) shows both:

- **Tokens:** runs of text that get one style.
- **Characters:** non-whitespace characters, meaning how much text a color covers.

Both measures agree on the top of the list: keywords and types are the most frequent highlighted classes, and strings are the most frequent of the rest. They disagree on what comes next. Shares of the corpus's highlighted text when the report was first generated:

| Class | Tokens | Characters |
|---|--:|--:|
| constant | 11.6% | 5.6% |
| escape | 7.2% | 2.4% |
| definition | 5.6% | 11.5% |

Escapes are short (`\n`, `${`, `}`, `$`), so they are frequent as tokens but cover little text. Definitions are whole names, so the opposite holds.

## Options

1. **Rank by tokens.** Strings, constants and escapes would get green, yellow and orange, and definitions would get the remaining hue, pink.
2. **Rank by characters.** Strings, definitions and constants get green, yellow and orange, and escapes get pink.
3. **Blend the two measures.** Any weighting would be arbitrary, and with these numbers it would still need a tie-break between definitions and escapes.

## Decision

Option 2. The reasons behind the brief's rule are about optics: saturated colors at the ends of the spectrum are harder to focus on and rated harder to read ([research.md §4](../research.md#4-colored-text-chromatic-aberration-and-chromostereopsis)). Those effects grow with the amount of text in a color, which is what characters measure. A pink `${` covers far less of the screen than a yellow function name.

## Consequences

- The report ranks accent classes by characters and shows token shares next to them.
- `packages/build/test/token-frequency.test.ts` checks both facts the mapping relies on: the two most frequent classes by tokens are the quiet ones, and the three saturated classes with the most corpus characters use green, yellow and orange. If a change to the corpus or the scope mapping breaks either property, the build fails and the allocation has to be revisited.
- Corpus files that are mostly embedded data are left out, because one long data string would dominate the character counts ([`fixtures/corpus/README.md`](../../fixtures/corpus/README.md)).
