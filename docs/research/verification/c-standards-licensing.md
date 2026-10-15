# Group C: standards, licensing and benchmark data (verified 2026-10-14)

**How this was checked.** Every fact below comes from a page fetched in this session with WebFetch; the URLs are listed with each item and again in full at the end. The shell's network access was blocked (curl returned `CONNECT tunnel failed, response 403`), so nothing was downloaded with curl. Two offline Node.js checks re-ran code copied from fetched sources and are labelled **[offline check]**. Quotes are verbatim. On the APCA pages, the superscript "Lᶜ" comes through the fetcher as "L c" and is written here as "Lc".

---

## TL;DR: verdict on the brief's Row 6

| Claim in the brief | Verdict |
|---|---|
| WCAG 2.2 is the normative test: 4.5:1 text, 3:1 large text and UI components | **Confirmed** (SC 1.4.3 and SC 1.4.11; large text = 18 pt, or 14 pt bold). |
| "also published as ISO/IEC 40500:2025" | **Confirmed, with a nuance.** ISO/IEC 40500:2025 is *the October 2023 version* of WCAG 2.2. The current W3C text is the 12 December 2024 update. ISO marks 40500:2025 as "to be revised", and W3C expects "ISO/IEC 40500:2026 by late 2026". |
| WCAG 3 Working Draft (10 Sept 2026) says the contrast algorithm is "yet to be determined" | **Confirmed verbatim:** "The contrast algorithm used in WCAG 3 is yet to be determined." 10 Sept 2026 is the latest TR publication. The Editor's Draft of 07 Oct 2026 has the same wording. **Neither draft mentions APCA.** |
| APCA is a candidate method, still in beta | **Confirmed, but only as APCA's own claim** ("APCA is the candidate contrast method for the future WCAG 3"; "currently in public beta"). The W3C draft itself names no method. |
| Perceptually uniform, polarity-aware, shows WCAG 2 overstates contrast for dark colors | **Confirmed as statements by the APCA authors** ("perceptually uniform"; "APCA is polarity aware"; WCAG 2.x "overstates contrast for dark colors"). These are claims, not independent findings. Note also the open W3C issue (w3c/silver #643) criticising APCA's luminance step. |
| Levels: 90 preferred / 75 minimum body; 60 other content text; 45 large text; 30 spot-readable; 15 non-text | **Mostly confirmed, but simplified.** Lc 15 applies only to "non-semantic non-text" (such as dividers). Semantic non-text such as solid icons needs Lc 30, and fine-detail icons need Lc 45. Each level also carries font size and weight minimums. |
| Algorithm 0.0.98G-4g; #888 on #fff = Lc 63.06; #fff on #888 = Lc −68.54 | **Confirmed:** 63.056469930209424 and −68.54146436644962 (text first, background second). |

**Licensing bottom line (Part 2).**
- **apca-w3:** the license as written covers only web content ("for use with WCAG accessibility guidelines for web-delivered and web-based content only, and not for any other use"). It also explicitly excludes "uses which are not specific to web-based content". A build script that scores a VS Code or Ghostty theme falls outside that grant on the plain text. Other terms: no alteration, a duty to keep current, trademark limits on the name "APCA", "Patent(s) pending", and a runtime dependency (`colorparsley`) that npm lists as **AGPL v3**.
- **Color.js:** MIT-licensed with its own APCA 0.0.98G-4g implementation. It takes **background first**: `contrastAPCA(background, foreground)` and `background.contrast(text, "APCA")`.
- **culori:** MIT. Its CVD filters apply Machado 2009 matrices to **gamma-encoded** sRGB, not linear RGB.
- None of this is legal advice. The sources do not settle whether Myndex's terms reach an independent reimplementation such as Color.js's.

**Suggested rewrite of Row 6 (evidence-aligned):**
> WCAG 2.2 is the normative test. It is a W3C Recommendation, last updated 12 December 2024, and its October 2023 text is also ISO/IEC 40500:2025. It requires 4.5:1 for text, and 3:1 for large-scale text (at least 18 pt, or 14 pt bold) and for UI components and graphical objects (SC 1.4.11). The WCAG 3 Working Draft (10 September 2026) still says "The contrast algorithm used in WCAG 3 is yet to be determined" and names no method. APCA's authors describe it as "the candidate contrast method for WCAG 3" and as "currently in public beta" (base algorithm 0.0.98G-4g, apca-w3 0.1.9). They call it perceptually uniform and polarity-aware, and state that WCAG 2 "overstates contrast for dark colors". APCA's simple levels are:
> - Lc 90 preferred, and Lc 75 minimum, for body text.
> - Lc 60 minimum for other content text.
> - Lc 45 for larger, heavier text (36px/400 or 24px/700) and for fine-detail icons.
> - Lc 30 absolute minimum for any other text, including "spot readable" text, and for solid semantic icons.
> - Lc 15 absolute minimum for non-semantic non-text, such as dividers.

---

## PART 1: Standards

### 1. WCAG 2.2 (https://www.w3.org/TR/WCAG22/)

**Fetched:** https://www.w3.org/TR/WCAG22/

- Document status line: **"W3C Recommendation 12 December 2024"**.

**SC 1.4.3 Contrast (Minimum), (Level AA):**
> The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for the following:
> **Large Text**: Large-scale text and images of large-scale text have a contrast ratio of at least 3:1;
> **Incidental**: Text or images of text that are part of an inactive user interface component, that are pure decoration, that are not visible to anyone, or that are part of a picture that contains significant other visual content, have no contrast requirement.
> **Logotypes**: Text that is part of a logo or brand name has no contrast requirement.

**SC 1.4.6 Contrast (Enhanced), (Level AAA):**
> The visual presentation of text and images of text has a contrast ratio of at least 7:1, except for the following:
> **Large Text**: Large-scale text and images of large-scale text have a contrast ratio of at least 4.5:1;
> *(The Incidental and Logotypes exceptions are identical to 1.4.3.)*

**SC 1.4.11 Non-text Contrast, (Level AA):**
> The visual presentation of the following have a contrast ratio of at least 3:1 against adjacent color(s):
> **User Interface Components**: Visual information required to identify user interface components and states, except for inactive components or where the appearance of the component is determined by the user agent and not modified by the author;
> **Graphical Objects**: Parts of graphics required to understand the content, except when a particular presentation of graphics is essential to the information being conveyed.

**Definition of "large scale (text)":**
> with at least 18 point or 14 point bold or font size that would yield equivalent size for Chinese, Japanese and Korean (CJK) fonts

The definition's Note 3 (excerpt):
> For many mainstream body text fonts, 14 and 18 point is roughly equivalent to 1.2 and 1.5 em or to 120% or 150% of the default size for body text (assuming that the body font is 100%), but authors would need to check this for the particular fonts in use.

**Definition of "contrast ratio":**
> (L1 + 0.05) / (L2 + 0.05), where
> - L1 is the relative luminance of the lighter of the colors, and
> - L2 is the relative luminance of the darker of the colors.
>
> Note 1: Contrast ratios can range from 1 to 21 (commonly written 1:1 to 21:1).
> Note 3: For the purpose of Success Criteria 1.4.3 and 1.4.6, contrast is measured with respect to the specified background over which the text is rendered in normal usage. If no background color is specified, then white is assumed.

**Definition of "relative luminance". The threshold constant is 0.04045:**
> the relative brightness of any point in a colorspace, normalized to 0 for darkest black and 1 for lightest white
>
> Note 1: For the sRGB colorspace, the relative luminance of a color is defined as L = 0.2126 * R + 0.7152 * G + 0.0722 * B where R, G and B are defined as:
> - if RsRGB <= 0.04045 then R = RsRGB/12.92 else R = ((RsRGB+0.055)/1.055) ^ 2.4
> - if GsRGB <= 0.04045 then G = GsRGB/12.92 else G = ((GsRGB+0.055)/1.055) ^ 2.4
> - if BsRGB <= 0.04045 then B = BsRGB/12.92 else B = ((BsRGB+0.055)/1.055) ^ 2.4
>
> and RsRGB, GsRGB, and BsRGB are defined as: RsRGB = R8bit/255, GsRGB = G8bit/255, BsRGB = B8bit/255
>
> Note 2: **Before May 2021 the value of 0.04045 in the definition was different (0.03928). It was taken from an older version of the specification and has been updated. It has no practical effect on the calculations in the context of these guidelines.**

Relevant context for a code-editor theme, from https://www.w3.org/WAI/standards-guidelines/wcag/ (fetched):
> WCAG can also be applied to non-web information and communications technologies (ICT) such as native apps, software, and documents, as described in WCAG2ICT.

### 2. ISO/IEC 40500:2025 = WCAG 2.2

**Fetched:** https://www.iso.org/standard/91029.html · https://www.w3.org/press-releases/2025/wcag22-iso-pas/ · https://www.w3.org/WAI/standards-guidelines/wcag/

The ISO page (https://www.iso.org/standard/91029.html) shows:
- Title: "ISO/IEC 40500:2025 - Information technology — W3C Web Content Accessibility Guidelines (WCAG) 2.2"
- "Reference number ISO/IEC 40500:2025", "Edition 2 2025-09", "Published (Edition 2, 2025)"
- "Expected to be replaced by ISO/IEC DIS 40500 within the coming months."
- "Publication date: 2025-09". The life cycle shows "60.60 2025-09-24 International Standard published" and "90.92 2026-02-05 International Standard to be revised". Number of pages: 72. Technical committee: ISO/IEC JTC 1. The previous edition, ISO/IEC 40500:2012, is listed as "Withdrawn".

The W3C press release (21 October 2025) says:
> W3C standard Web Content Accessibility Guidelines (WCAG) 2.2 has been approved by the International Organization for Standardization (ISO) - International Electrotechnical Commission (IEC) Joint Technical Committee (JTC 1) - Information technology as ISO/IEC 40500:2025.
>
> WCAG 2.2 was processed through JTC 1 as a Publicly Available Specification (PAS). ISO/IEC 40500:2025 is available free from the ISO website.
>
> **ISO/IEC 40500:2025 is the October 2023 version of WCAG 2.2.** W3C is working to get ISO/IEC 40500 and EN 301 549 updated with the latest version of WCAG 2.2.

The WAI WCAG 2 Overview says:
> WCAG 2.2 was published on 5 October 2023, and an update was published on 12 December 2024.
>
> WCAG 2.2 is an approved International Organization for Standardization (ISO) standard: ISO/IEC 40500:2025, and is available free from ISO. ISO/IEC 40500:2025 is exactly the same as the October 2023 version of WCAG 2.2. **We expect the December 2024 version of WCAG 2.2 to be available as ISO/IEC 40500:2026 by late 2026.**
>
> The 2026 version of EN 301 549 uses WCAG 2.2.

### 3. WCAG 3.0 Working Draft

**Fetched:** https://www.w3.org/TR/wcag-3.0/ · https://www.w3.org/standards/history/wcag-3.0/ · https://w3c.github.io/wcag3/guidelines/ (Editor's Draft)

- TR status line: **"W3C Working Draft 10 September 2026"**.
- Status section:
  > This is an update to W3C Accessibility Guidelines (WCAG) 3.0. It includes all requirements that have reached the developing status.
  >
  > Publication as a Working Draft does not imply endorsement by W3C and its Members.
  >
  > This is a draft document and may be updated, replaced, or obsoleted by other documents at any time. It is inappropriate to cite this document as other than a work in progress.

**Text contrast sufficient (minimum)** [status: Developing], core requirement:
> The default visual presentation of text meets @@[contrast measure to be determined].

Its editor's note:
> **The contrast algorithm used in WCAG 3 is yet to be determined.** For this draft, the requirement assumes the algorithm will include a size/weight factor. If the algorithm does not include size/weight, it will need to be added to this requirement text.
>
> A separate requirement may be needed if red/green color vision deficiency (CVD) is not accounted for within the contrast algorithm.

**Text contrast sufficient (enhanced)** [Developing]:
> The default visual presentation of text meets @@[contrast measure to be determined, at a higher level than the core requirement for Text contrast sufficient (minimum)].

It carries the same editor's note: "The contrast algorithm used in WCAG 3 is yet to be determined. …"

**Graphical object contrast sufficient** [Developing]:
> Parts of graphical objects required to understand the content meet a minimum contrast ratio test

Glossary entry "contrast ratio test" [Exploratory]:
> meeting a sufficient level of contrast between two colors using the relationship of hue, saturation, and lightness values
>
> Editor's note: The contrast algorithm used in WCAG 3 is yet to be determined.

**APCA is not mentioned.** A text search for "APCA" returned no matches in either the 10 Sept 2026 Working Draft or the 07 Oct 2026 Editor's Draft.

**Is there a newer draft?** The publication history page lists the most recent TR versions as: **10 September 2026 (Working Draft)**, 3 March 2026, 4 September 2025, 12 December 2024, 28 May 2024, 16 May 2024, 24 July 2023, 7 December 2021, 8 June 2021, and 21 January 2021 (First Public Working Draft). There is no TR publication after 10 Sept 2026.

The Editor's Draft (not a TR publication) is dated **"W3C Editor's Draft 07 October 2026"**. It keeps the same "yet to be determined" wording, and adds this note under "Single flash":
> This provision relies on the color contrast algorithm in WCAG 2. When the algorithm is updated for WCAG 3, the contrast metric will also be updated.

### 4. APCA: levels, version, test values, beta and candidate status

**Fetched:**
- https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/APCA_in_a_Nutshell.md
- https://raw.githubusercontent.com/Myndex/apca-w3/HEAD/README.md
- https://registry.npmjs.org/apca-w3/latest
- https://raw.githubusercontent.com/Myndex/apca-w3/HEAD/package.json
- https://raw.githubusercontent.com/Myndex/apca-w3/HEAD/src/apca-w3.js
- https://raw.githubusercontent.com/Myndex/apca-w3/HEAD/test/index.js
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/README.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/APCA-W3-LaTeX.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/ImportantChangeNotices.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/minimum_compliance.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/APCA_FAQ.md
- https://github.com/w3c/silver/issues/643

#### 4a. Lc level table, verbatim from "APCA in a Nutshell" (rendered page and raw markdown agree)

Intro:
> These general levels are appropriate for use by themselves, without the need to reference a lookup table. APCA reports contrast as an Lc value (lightness contrast) from Lc 0 to Lc 105+. For accessibility, consider Lc 15 the point of invisibility for many users, and Lc 90 as preferred for body text.

> - **Lc 90** • Preferred level for fluent text and columns of body text with a font no smaller than 18px/weight 300 or 14px/weight 400 (normal), or non-body text with a font no smaller than 12px/400. Also a recommended minimum for extremely thin fonts with a minimum of 24px at weight 200. Lc 90 is a suggested maximum for very large and bold fonts (greater than 36px bold), and large areas of color. Small fonts do not have a maximum.
> - **Lc 75** • The minimum level for columns of body text with a font no smaller than 24px/300 weight, 18px/400, 16px/500 and 14px/700. This level may be used with non-body text with a font no smaller than 15px/400. Also, Lc 75 should be considered a minimum for larger for any larger text where readability is important.
> - **Lc 60** • The minimum level recommended for content text that is not body, column, or block text. In other words, text you want people to read. The minimums: no smaller than 48px/200, 36px/300, 24px normal weight (400), 21px/500, 18px/600, 16px/700 (bold). These values based on the reference font Helvetica. To use these sizes as body text, add Lc 15.
> - **Lc 45** • The minimum for larger, heavier text (36px normal weight or 24px bold) such as headlines, and large text that should be fluently readable but is not body text. This is also the minimum for pictograms with fine details, or smaller outline icons.
> - **Lc 30** • The absolute minimum for any text not listed above, including text considered as "spot readable". This includes placeholder text and disabled element text, and some non-content like a copyright bug. This is also the minimum for large/solid semantic & understandable non-text elements such as "mostly solid" icons or pictograms. Generally no less than 5.5px solid in its smallest dimension.
> - **Lc 15** • The absolute minimum for any non-semantic non-text that needs to be discernible, and is no less than 5px (solid) in its smallest dimension. This may include dividers, and in some cases large buttons or thick focus-visible outlines, but does not include fine details which have a higher minimum. Designers should treat anything below this level as invisible, as it will not be visible for many users. This minimum level should be avoided for any items important to the use, understanding, or interaction of the site.
>
> These define the basic minimum levels, what you might think of as AA in the old WCAG 2. For the equivelent to AAA, simply increase the contrast values by Lc 15.

The same page:
> The APCA-RC Bronze Simple Mode has a set of threshold levels related to use cases — for instance, Lc 90 is preferred and Lc 75 is the minimum for body text.

The short labels that the compliance document requires tools to show (minimum_compliance.md):
> - Lc 90: Preferred Body Text
> - Lc 75: Minimum Body Text
> - Lc 60: Minimum Fluent text
> - Lc 45: Minimum Large text
> - Lc 30: Minimum Any text
> - Lc 15: Invisibility point

**Inconsistency between APCA documents.** minimum_compliance.md gives "Fluent Text Minimum Reference Font Sizes at Normal Weight (Arial 400)" as "Lc 90: 14px, Lc 75: 16px, Lc 60: 24px, Lc 45: 42px". Its Lc 75 = 16px and Lc 45 = 42px differ from the Nutshell figures (Lc 75 body text = 18px/400; Lc 45 = 36px/400). This matters for code editors, which usually run at 12–14px.

#### 4b. Perceptual uniformity, polarity, and "WCAG 2 overstates dark contrast" (APCA authors' statements)

From the Nutshell page:
> APCA is the candidate contrast method for the future WCAG 3, and is also developing as the APCA Readability Criterion, an independent standard hosted by Inclusive Reading Technologies.
>
> … a contrast value of Lc 60 represents the same perceived readability contrast. This is absolutely not the case with WCAG 2.x, which overstates contrast for dark colors to the point that 4.5:1 can be functionally unreadable when one of the colors in a pair is near black. As a result, WCAG 2.x contrast cannot be used for guidance designing "dark mode".
>
> The APCA contrast value is perceptually uniform, and pivots near the point where the CS curve flattens due to contrast constancy.

From SAPC-APCA documentation/README.md:
> - APCA uses modern vision science and is perceptually uniform.
> - Unlike WCAG_2, APCA is polarity aware, so the BG and TEXT colors must be sent to the correct inputs for accurate contrast prediciton.

From the apca-w3.js source header:
> The two inputs are TEXT color and BACKGROUND color in that order.
> … Negative values mean light text and a dark background, positive values mean dark text and a light background.
> ***** IMPORTANT: Do Not Mix Up Text and Background inputs. *****
> **************** APCA is polarity sensitive! *****************

**A critique to be aware of.** https://github.com/w3c/silver/issues/643, "APCA Luminance calculation non-standard, up to 2.5% deviation", was opened by svgeesus (Chris Lilley) on 2022-06-16. It was shown as open, last updated 2026-05-01. It says:
> APCA incorrectly approximates the sRGB transfer function with a simple power law. … However APCA appears to simply copy the exponent of 2.4 from the full sRGB equation, without taking into account the effects of offset and scaling. This introduces a significant error of up to 2.5% in the mid-tones.

(The fetcher's metadata for this page also showed "Number: #226", which may mean the issue was moved. The URL fetched was /issues/643.)

#### 4c. Version strings

- apca-w3 README: **"Current Algorithm Version: 0.0.98G-4g (February 15, 2021) (w3)"**, and "This is the base algorithm version. … These added features do not impact the base algorithm which is stable and undergoing public beta validation."
- apca-w3 README: **"Current Library Version: 0.1.9 (w3) (98G4g) _beta_"**. The version history lists "0.1.9 - July 3, 2022".
- npm `apca-w3` latest: **0.1.9**, license "Limited W3 License"; registry "Updated: 2022-07-04". Earlier versions on npm include `0.0.98-g-4g-w3`, `0.0.98-g-4g.2` … `0.0.98-g-4g.4b`.
- apca-w3.js header: "Beta 0.1.9 W3 • contrast function only", "Revision date: July 3, 2022", and "For Evaluations, refer to this as: SAPC-8, 0.0.98G-series constant 4g".
- minimum_compliance.md: "Current Base Algorithm" refers to **"APCA Contrast Prediction Equation 0.0.98G-4g-base-W3"**.
- ImportantChangeNotices.md header: "SAPC/APCA BASE ALGORITHM CURRENT VERSION: 0.0.98G-4g-lut3 Constants: 4g".
- apca-w3 LICENSE.md: "Current base reference algorithm is 0.0.98G-4g WITH an output clamp at approximately ±Lc10 (for reference, this is the underlying algorithm for apca-w3 versions 0.1.9)".
- Published W3 constants (apca-w3 README, "0.0.98G - W3 constants (W3 license only)"):
  ```
  exponents =  { mainTRC: 2.4,    normBG: 0.56,    normTXT: 0.57,  revTXT: 0.62,  revBG: 0.65, };
  colorSpace = { sRco: 0.2126729, sGco: 0.7151522, sBco: 0.0721750, };
  clamps =     { blkThrs: 0.022,  blkClmp: 1.414,  loClip: 0.1,  deltaYmin: 0.0005, };
  scalers =    { scaleBoW: 1.14,  loBoWoffset: 0.027,
                 scaleWoB: 1.14,  loWoBoffset: 0.027, };
  ```
- APCA_FAQ.md: "For beta version 0.98G-4g, the range is -108 to +106, with positive numbers for dark text on a light background, and negative numbers for light text on a dark background."

#### 4d. Published reference test values

From SAPC-APCA documentation/README.md, verbatim:
```text
Test Values for APCA W3 using the G series constants, normal and reverse float values for each color pair.
First number is TEXT second number is BACKGROUND.

    TEXT vs BKGND •  EXPECTED RESULT for APCA W3 to 0.1.9 (G-constants)

    #888 vs #fff  •  63.056469930209424
    #fff vs #888  • -68.54146436644962

    #000 vs #aaa  •  58.146262578561334
    #aaa vs #000  • -56.24113336839742

    #123 vs #def  •  91.66830811481631
    #def vs #123  • -93.06770049484275

    #123 vs #444  •   8.32326136957393
    #444 vs #123  •  -7.526878460278154
```

The same values appear in apca-w3 `test/index.js` (`calcAPCA(text, bg)`). That file also has `'#0006'` on `'#fff'` = `54.62184067441377`.
```js
let color = ['#000', '#888', '#FFF', '#000', '#aaa', '#123', '#def', '#123', '#444', '#0006','#fff'];
let contrastResult = [0, 63.056469930209424, -68.54146436644962, 58.146262578561334, -56.24113336839742, 91.66830811481631, -93.06770049484275, 8.32326136957393, -7.526878460278154,54.62184067441377,54.62184067441377 ];
```
So **#888 text on #fff = Lc 63.056469930209424 (≈ 63.06)** and **#fff text on #888 = Lc −68.54146436644962 (≈ −68.54)**. Both match the brief.

**[offline check]** I re-implemented apca-w3's `sRGBtoY` + `APCAcontrast` and Color.js's `contrastAPCA`, both copied from the fetched sources. Both reproduce all 8 published values bit for bit when Color.js is called as `contrastAPCA(background, text)`. Swapping the arguments gives the opposite pair's value (for example, 63.056… becomes −68.541…).

#### 4e. Beta and WCAG 3 candidate status, in APCA's own words

minimum_compliance.md:
> **WCAG 3 Compliant: _Does not exist yet._** Until WCAG 3 is an official recommendation there is no such thing.
>
> ### Regarding WCAG 3.0
> The only suitable language at this time is: _"APCA™ is the candidate contrast method for WCAG 3, and is currently in public beta. WCAG 3 is still in development and subject to changes prior to adoption."_

apca-w3 README disclaimer:
> **Disclaimer:** _APCA is being evaluated as a replacement for WCAG 2 contrast math for future standards and guidelines, however, standards that will be incorporating APCA are still developmental. … It is up to the end user to determine suitability of purpose for their region and conformance requirements._

SAPC-APCA documentation/README.md:
> This apca-w3 repo includes the basic APCA code, which returns a perceptually uniform contrast value, and supporting functions, as a public beta for non-commercial use and testing only.

---

## PART 2: Licensing

### (a) npm `apca-w3` (Myndex/apca-w3)

**Fetched:**
- https://registry.npmjs.org/apca-w3/latest
- https://raw.githubusercontent.com/Myndex/apca-w3/HEAD/package.json
- https://raw.githubusercontent.com/Myndex/apca-w3/HEAD/LICENSE.md
- https://raw.githubusercontent.com/Myndex/apca-w3/HEAD/src/apca-w3.js
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/minimum_compliance.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/LICENSE.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/LICENSE.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/ImportantChangeNotices.md
- https://registry.npmjs.org/colorparsley/latest
- https://github.com/Myndex/apca-w3/discussions/11

**License name.** package.json and npm both say `"license": "Limited W3 License"`. The LICENSE.md heading is **"W3 License for Compliant Code Only"**. The file opens:
> Code and documentation in this repository is copyright © 2019-2023 by Andrew Somers and/or Myndex™. All Rights Reserved.
>
> Patent(s) pending.

**Use is restricted to web content and WCAG work:**
> Files in this repository are licensed to the W3/AGWG under their cooperative agreement for use with WCAG accessibility guidelines for web-delivered and web-based content only, and not for any other use. Certain limitations do apply.

> **apca-w3** is an embodiment of certain supra-threshold contrast prediction technologies and it is licensed to the W3 on a limited basis for use in WCAG accessibility guidelines for web content only. **apca-w3** may be used for predicting contrast for web content used for that specific purpose without royalty.
>
> Said license excludes other use cases not related to web content. Prohibited uses include medical, clinical evaluation, human safety related, aerospace, transportation, military applications, and uses which are not specific to web-based content presented on self-illuminated displays or devices.

> Commercial use is prohibited without a written and signed commercial license agreement, except as provided by the W3 cooperative agreement for web content only.
>
> Non-commercial use is permitted only for predicting contrast for web content, no other use case is authorized.

**Non-web use (for example, a build script scoring a code-editor theme).** No clause in the license text grants this. The text limits use to "web-delivered and web-based content only, and not for any other use", and lists "uses which are not specific to web-based content" among prohibited uses. On a plain reading, a VS Code or Ghostty theme build script is outside the grant.

One possible ambiguity: minimum_compliance.md, which calls itself "an extension of the licensing agreement", lists a level called **"Generic Perceptual Contrast: covers use of the algorithm in nonstandard applications and/or without brand identification."** It also has a "Use _Without_ Identification" clause:
> Unidentified use of the APCA algorithm or math is permitted:
> - Use subject to the restrictions listed in _MINIMUM APCA CONFORMANCE_, provided:
>   - code used is as provided at the apca–w3 repository,
>   - code is unmodified except as needed for porting to a given language and/or use case.
>   - that there is **_no use_** of the term "APCA" or protected terms or trademarks, and
>   - **no implied endorsement by Myndex™ nor Accessible Reading Technologies™ (ART)**
>   - is only identified generically as _"perceptual contrast"_
>   - for professional use only, Myndex and/or ART™ accept no liability whatsoever for any use or misuse of any code or related technologies.

Whether this overrides the LICENSE.md web-only restriction is **not stated**. The safe route is written permission; the document invites contact at "info@readtech.org".

**Modification is restricted, and staying current is required:**
> _**NO ALTERATION; KEEP CURRENT**_
> Any **apca-w3** files in this repository may be used or incorporated only in tools for web-based content or web related content in support of the WCAG accessibility guidelines, and such use must be without modification to the essential elements of the code or specific approved constants, except as required to port to a given language.
> - Developers incorporating this code into their applications, widgets, or other tools, have a duty to ensure that the most recent version of this code is used in their current or any future release.

> Code or implementations found to be non-compliant with APCA, meaning they are incorrect in operation or methodology as defined for APCA contrast, including but not limited to the indication of polarity, and use of the current approved constants, **shall be deemed in breech of license and a copyright violation.**

**Redistribution.** This is a modified W3C Software and Document Notice, "SUBJECT TO THE ABOVE LISTED LIMITATIONS AND EXCLUSIONS":
> Permission to copy this work without modification, except as needed for integration to a specific language or environment, for any purpose other than those specifically excluded, and thereafter without fee or royalty is hereby granted, provided that you include the following on ALL copies of the work or portions thereof, including modifications: The full text of this NOTICE …; Any pre-existing intellectual property disclaimers, notices, or terms and conditions. …; Notice of any changes or modifications …

**Fallback license, revocation, and audit:**
> Any files, or use cases of files, not under the W3 cooperative agreement are licensed under the AGPU v3 License, subject to limitations as cited in the disclaimers.

("AGPU" is sic. ImportantChangeNotices.md says separately: "SAPC is the research name and SAPC is licensed under AGPL v3. APCA is the release name in the new Working Draft of Silver/WCAG 3, and licensed to the W3 per their collaborative agreements.")

> As some code herein is early beta, and there is a clear interest to prevent obsolete versions from propagating, license for use is revoked when any such asset is removed from this repository.

> _**RIGHT TO AUDIT CODE**_ Any integration of APCA, SAPC, or SACAM which is in a commercial app or behind a paywall, free access must be provided to Myndex Research, or their assigns, on request …

**Use of the name and trademark "APCA":**
> Use of the terms "SAPC", "SACAM", "APCA", "Advanced Perceptual Contrast Algorithm", "Accessible Perceptual Contrast Algorithm", to describe any contrast method, app, or device, is only permitted for code that is correctly implemented, maintained, and up to date, per the APCA integration compliance page.

> _**USE OF THE APCA LOGO AND TRADEMARK**_ Use of the APCA logo as shown at this repo to describe any contrast app, use, or method, or the "Powered by APCA" logo, and/or any related official logos or trademarks, **are prohibited without written consent** from Myndex™ Technologies, Myndex™ Research, Andrew Somers, and/or the authorized agents or assigns.

From minimum_compliance.md, "Use of Trademarks":
> The terms "APCA", "SAPC", "SACAM", "Advanced Perceptual Contrast Algorithm", "Accessible Perceptual Contrast Algorithm", "APCA™ Contrast", "APCA™ Compatible", "APCA™ Compliant", "APCA™ Certified", are trademarks of Myndex Research and Andrew Somers, All Rights Reserved, use by limited permission only. **Trademarks are not included as part of any open-source license**, permission to use only per the limited restrictions listed in this document.
>
> **Permission to use revokable at any time for non-compliance per this document or future versions thereof …**

The lowest named tier, "APCA™ Contrast Value", forbids showing the tested colors. This matters if Fovea's docs would show swatches next to "APCA Lc" numbers:
> - **MAY NOT** present any example using the tested colors, nor present any font examples.
> - May use the term "APCA Lc Value" but MUST NOT use terms such as "APCA compliant"
>   - May be identified as _"perceptual contrast based on APCA but not APCA compliant"_
> - NO linking to any WCAG 3 document at all (neither current nor expired), and no reference of any kind to WCAG 3 nor WCAG 3 compatibility nor WCAG 3 compliance _whatsoever_.

All levels also require this disclaimer wherever the math is shown:
> "APCA is a method for predicting text contrast on self-illuminated displays for web-based content. Some use-cases are prohibited by license, including the following: use in medical, clinical evaluation, human safety related, aerospace, transportation, automotive, military applications, are strictly prohibited without a specific license in writing granting such use."

**Dependency.** apca-w3 depends on `colorparsley ^0.1.8`, and `src/apca-w3.js` imports it at module top level (`import { colorParsley } from 'colorparsley';`). npm lists `colorparsley` 0.1.8 with **License: AGPL v3**. The apca-w3 LICENSE.md pulls it in by reference:
> Any dependencies created by and provided by Myndex Research or Andrew Somers as part of the apca-w3 package @ npm, or this repository, are hereby included by reference within this license, including but not limited to the Color Parsley package, when these dependencies are used with APCA–W3.

Myndex added that clause after a user wrote "colorparsley has an AGPL licence, which would force us to open source our whole app" (Discussion #11, Apr 2023). Myndex replied: "APCA – W3 does not require Color Parsley it is added as a convenience."

**The main SAPC-APCA repository is stricter still.** Its LICENSE.md says: "For THIS repo only: _**Registered Beta Testers OR Personal use only is permitted**_ unless authorized in writing". documentation/LICENSE.md adds a time-limited term:
> ### Fixed Term Licensing
> Due to the current developmental nature of this project, existing licenses shall expire December 31st 2022, however, at the discretion of Myndex Technologies, such licenses may be extended on an as needed basis. A permanent form of license shall be made available at the time of the first official release.

### (b) Color.js (npm `colorjs.io`, GitHub color-js/color.js)

**Fetched:**
- https://registry.npmjs.org/colorjs.io/latest
- https://raw.githubusercontent.com/color-js/color.js/HEAD/package.json
- https://api.github.com/repos/color-js/color.js/releases/latest
- https://raw.githubusercontent.com/color-js/color.js/HEAD/LICENSE
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/contrast/APCA.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/contrast.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/contrast/WCAG21.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/luminance.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/spaces/srgb.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/spaces/srgb-linear.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/deltaE/deltaEOK.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/deltaE/index.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/toGamut.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/defaults.js
- https://colorjs.io/docs/contrast
- https://colorjs.io/docs/gamut-mapping
- https://colorjs.io/docs/color-difference
- https://github.com/color-js/color.js/discussions/494

**License: MIT.** "MIT License / Copyright (c) 2021 Lea Verou, Chris Lilley" (LICENSE); `"license": "MIT"` (package.json and npm).

**Latest version: 0.7.1.** npm latest is 0.7.1 (registry updated 2026-07-24). The GitHub latest release is `v0.7.1`, published 2026-07-24T16:32:08Z.

**APCA implementation (`src/contrast/APCA.js`).**
- Header, which is all the provenance it gives:
  ```js
  // APCA 0.0.98G
  // https://github.com/Myndex/apca-w3
  // see also https://github.com/w3c/silver/issues/643
  ```
  It also cites "https://github.com/w3c/silver/issues/645" next to the scalers and "https://github.com/LeaVerou/color.js/issues/208" next to the noise gate. **There is no statement of permission or license from Myndex, and no APCA license text, in the file.**
- Constants: `normBG = 0.56, normTXT = 0.57, revTXT = 0.62, revBG = 0.65`, `blkThrs = 0.022, blkClmp = 1.414, loClip = 0.1, deltaYmin = 0.0005`, `scaleBoW = 1.14, loBoWoffset = 0.027, scaleWoB = 1.14, loWoBoffset = 0.027`. Linearization uses `Math.pow(abs, 2.4)` (sign-preserving), and the coefficients are `0.2126729, 0.7151522, 0.072175`. **These match the apca-w3 0.0.98G-4g W3 constants.**
- Comments in the code: "Myndex as-published, assumes sRGB inputs"; "Calculates "screen luminance" with non-standard simple gamma EOTF"; "weights should be from CSS Color 4, not the ones here which are via Myndex and copied from Lindbloom"; "Should these be clamped to in-gamut values?"
- Differences from apca-w3 that I found by reading both sources:
  - Color.js converts any color space to sRGB first.
  - It does not clamp out-of-gamut values, while apca-w3 returns 0 when Y is outside `[0.0, 1.1]`.
  - It uses a sign-preserving power function for negative channel values.
  - **[offline check]** For in-gamut hex inputs, the results match the published test values exactly.
- **Argument order: background first.**
  ```js
  /**
   * Not symmetric, requires a foreground (text) color, and a background color
   * @param {import("../types.js").ColorTypes} background
   * @param {import("../types.js").ColorTypes} foreground
   */
  export default function contrastAPCA (background, foreground) {
  ```
  The generic dispatcher (`src/contrast.js`) is `export default function contrast (background, foreground, o)`, and it calls `contrastAlgorithms[a](background, foreground, rest)`. So `Color.contrast(bg, fg, "APCA")` and `bg.contrast(fg, "APCA")` are correct. This is the **opposite order to apca-w3's** `APCAcontrast(textY, bgY)` and `calcAPCA(text, bg)`.
- From the Color.js docs (https://colorjs.io/docs/contrast):
  > Color.js implements (APCA version 0.0.98G-4g). Colors are converted to sRGB internally as a first stage, so any colors can be used with this function.
  >
  > The APCA formula requires the text color and the foreground color to be distinguished. Swapping them gives a somewhat different, and incorrect, result.
  ```js
  let text = new Color("p3", [0.9, 0.8, 0.1]);
  let background = new Color("slategrey");
  let contrast = background.contrast(text, "APCA");
  let wrongContrast = text.contrast(background, "APCA");
  ```
  (The docs say "text color and the foreground color"; the code shows they mean background.) The docs also say: "APCA is being evaluated for use in version 3 of the W3C Web Content Accessibility Guidelines (WCAG)."
- **Licensing caveat about APCA in the Color.js docs: none found.** The Contrast page, which documents APCA, and the npm README contain no licensing or trademark note about APCA. Only these pages were checked, not every docs page.

**WCAG 2 contrast function: `contrastWCAG21(color1, color2)`.** Usage: `color1.contrastWCAG21(color2)` or `color1.contrast(color2, "WCAG21")`, case-insensitive.
```js
// WCAG 2.0 contrast https://www.w3.org/TR/WCAG20-TECHS/G18.html
// Simple contrast, with fixed 5% viewing flare contribution
// Symmetric, does not matter which is foreground and which is background
export default function contrastWCAG21 (color1, color2) { … return (Y1 + 0.05) / (Y2 + 0.05); }
```
Luminance is `getLuminance(color) = get(color, [xyz_d65, "y"])`. The sRGB decoding in `srgb.js` uses `if (abs <= 0.04045) { return val / 12.92; }`, the same threshold as WCAG 2.2. The XYZ Y row is `0.21263900587151027, 0.715168678767756, 0.07219231536073371`, against WCAG's rounded `0.2126 / 0.7152 / 0.0722`.

**`deltaEOK`** (`src/deltaE/deltaEOK.js`): Euclidean distance in OKLab, with L on a 0–1 scale.
```js
export default function (color, sample) { … let [L1, a1, b1] = oklab.from(color); let [L2, a2, b2] = oklab.from(sample); … return Math.sqrt(ΔL ** 2 + Δa ** 2 + Δb ** 2); }
```
It is exported from `src/deltaE/index.js` as `deltaEOK`; `deltaEOK2`, `deltaEHCT` and `deltaEHelmlab` are also available. The docs give the naming pattern: "Each DeltaE algorithm comes with its own method (e.g. `color1.deltaECMC(color2)`), as well as a parameterized syntax (e.g. `color1.deltaE(color2, "CMC")`)". So the calls are `color1.deltaEOK(color2)` or `color1.deltaE(color2, "OK")`. The default `deltaE` method is `"76"` (`defaults.js`).

**`toGamut({ method: "css" })`.** Signature: `toGamut(color, { method = defaults.gamut_mapping, space = undefined, deltaEMethod = "", jnd = 2, blackWhiteClamp = undefined } = {})`. It mutates and returns the color. `defaults.js` sets `gamut_mapping: "css"`, so "css" is the default.

`method === "css"` calls `toGamutCSS(color, { space })`. This is the CSS Color 4 binary search on OKLCh chroma, with `const JND = 0.02; const ε = 0.0001;` and the clipped-versus-current difference measured with **`deltaEOK`**. If L ≥ 1 it returns white, and if L ≤ 0 it returns black. The other methods are `"raytrace"`, `"clip"`, presets `"hct"` and `"hct-tonal"`, or any coordinate such as `"lch.c"`.

The docs (gamut-mapping page) say: "The default method is `"css"`, which uses the binary search algorithm from CSS Color Module Level 4. The mapping is done in the Oklch space, and works by finding a chroma value where there is minimal difference between the mapped color and a clipped version. This difference is called the just noticeable difference, and is calculated in deltaEOK." A later paragraph on the same page still describes "deltaE2000 … less than 2", which is stale compared with the code.

### (c) culori

**Fetched:**
- https://registry.npmjs.org/culori/latest
- https://api.github.com/repos/Evercoder/culori/releases/latest
- https://raw.githubusercontent.com/Evercoder/culori/HEAD/LICENSE
- https://raw.githubusercontent.com/Evercoder/culori/HEAD/src/deficiency.js
- https://raw.githubusercontent.com/Evercoder/culori/HEAD/src/wcag.js
- https://raw.githubusercontent.com/Evercoder/culori/HEAD/src/lrgb/convertRgbToLrgb.js
- https://culorijs.org/api/
- https://culorijs.org/color-spaces/
- https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
- http://colorspace.r-forge.r-project.org/reference/simulate_cvd.html

**License: MIT** ("MIT License / Copyright (c) 2018 Dan Burzo"). **Latest version: 4.0.2.** npm latest is 4.0.2, and the GitHub latest release is `v4.0.2`, published 2025-06-27T16:01:11Z.

**`filterDeficiencyProt` / `filterDeficiencyDeuter` / `filterDeficiencyTrit`:**
- Signatures (docs): `filterDeficiencyProt(severity = 1) → function (color)`, and the same for Deuter and Trit.
- Docs:
  > Simulate protanomaly and protanopia. The `severity` parameter is in the interval `[0, 1]`, where `0` corresponds to normal vision and `1` (the default value) corresponds to protanopia.
  >
  > Based on the work of Machado, Oliveira and Fernandes (2009), using precomputed matrices provided by the authors. References thanks to the `colorspace` package for R.
- Source comment: "Color vision deficiency (CVD) simulation based on: G. M. Machado, M. M. Oliveira and L. A. F. Fernandes, "A Physiologically-based Model for Simulation of Color Vision Deficiency" in IEEE Transactions on Visualization and Computer Graphics, vol. 15, no. 6, pp. 1291-1298, Nov.-Dec. 2009, doi: 10.1109/TVCG.2009.113. Functions use precomputed matrices from: https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html".
- **Matrices:** 11 per type, for severity 0.0 to 1.0 in steps of 0.1. They are identical to Machado et al. Table 1 on the authors' page. For example, Protanomaly 1.0 is `0.152286 1.052583 -0.204868 0.114503 0.786281 0.099216 -0.003882 -0.048116 1.051998` in both.
- **Color space: gamma-encoded sRGB.** The code is `let rgb = converter('rgb'); … let { r, g, b } = rgb(c);`, and the 3×3 matrix multiplies those values. The result is converted back with `converter(c.mode)(ret)`, and there is no clamping. culori's color-spaces page defines `rgb` as "The sRGB color space" and `lrgb` as "The linear-light form of the sRGB color space". So the matrices are **not** applied in linear light.
  - R `colorspace` docs, culori's cited reference: "Up to version 2.0-3 of the package, the CVD transformations had been applied directly to the gamma-corrected sRGB coordinates … following the illustrations of Machado et al. (2009). However, the paper implicitly relies on a linear RGB space (see page 1294, column 1) … starting from version 2.1-0 of the package, a new argument `linear = TRUE` has been added … For most colors the difference between the two strategies is negligible but for some highly-saturated colors it becomes more noticable, e.g., for red, purple, or orange."
- **Severity handling.** The code is:
  ```js
  let tt = Math.max(0, Math.min(1, t)); let i = Math.round(tt / 0.1); let w = Math.round(tt % 0.1);
  … if (w > 0 && i < lut.length - 1) { /* lerp to lut[i+1] */ }
  ```
  `tt % 0.1` is always below 0.1, so `w` is always 0 and the interpolation branch never runs. Severity is therefore **snapped to the nearest tabulated 0.1 matrix**. **[offline check]** The maximum `w` over severities 0 to 1 in steps of 0.001 is 0; 0.873 maps to the 0.9 matrix. The Machado page itself recommends interpolating, for example 0.873 between 0.8 and 0.9 with weight 0.73.
- Related: `wcagLuminance` and `wcagContrast` (`src/wcag.js`) convert to `lrgb`, where `convertRgbToLrgb` uses `abs <= 0.04045`, and then compute `0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b` and `(max + 0.05) / (min + 0.05)`.

### (d) What Myndex and the APCA authors say about third-party implementations and the APCA name

**Fetched:** https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/thirdpartytools.md · minimum_compliance.md · documentation/README.md · https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/README.md · apca-w3 README (all URLs listed above)

- **Color.js is on Myndex's own list.** thirdpartytools.md, under "Code Libraries & Systems with APCA": "**Color.js** – Comprehensive JS color library by Lea Verou and Chris Lilly." It also lists SASS-APCA, a Deno TypeScript library, an R library, and others.
- The same page carries a caveat about listed tools:
  > Take note that some of these tools are works in progress, and not all of them have been fully analyzed for accuracy or conformance to APCA standards. We will be starting qualification testing in the near future. When in doubt, check values with the canonical APCA tool.
- On browser DevTools (Chrome and Edge): "Available as an experimental feature, note that some versions maybe using obsolete constants and therefore may give incorrect results."
- **Only apca-w3 counts as "APCA code".** From minimum_compliance.md:
  > "APCA" and "APCA code" refers to the npm package `npm i apca-w3` and the specific GitHub repo: /Myndex/apca-w3 — **no other fork or package qualifies unless certified in writing by Myndex Research.**
- documentation/README.md: "THIS REPOSITORY, and apca-w3 ARE THE ONLY CANONICAL SOURCES OF APPROVED APCA CODE."
- apca-w3 README: "code here is the only code that should be used for any development purposes."
- Trademark terms are quoted in Part 2(a) above. The key line: "Trademarks are not included as part of any open-source license".
- Only "APCA™ Certified" apps may use the "Powered by APCA" or "APCA™" logos.

---

## PART 3: Benchmark theme colors (default editor text on editor background)

| Theme | Editor text (foreground) | Editor background | Official source fetched | Notes |
|---|---|---|---|---|
| **Solarized Dark** | `#839496` (base0) | `#002b36` (base03) | https://ethanschoonover.com/solarized/ | "the normal relationship for background and body text is `base03:base0` (please note that body text is not `base00`)" |
| **Solarized Light** | `#657b83` (base00) | `#fdf6e3` (base3) | https://ethanschoonover.com/solarized/ | "The values in this example are simply inverted in the case of a light background." The page's SCSS `html, .light { @include rebase($base3,…,$base00,…) }` gives `background-color: $base3; color: $base00`. |
| **Tokyo Night** | `#a9b1d6` | `#1a1b26` | https://raw.githubusercontent.com/tokyo-night/tokyo-night-vscode-theme/master/themes/tokyo-night-color-theme.json | The repo moved from enkia to the tokyo-night org (the GitHub API redirected). package.json: publisher "enkia", v1.1.2, MIT. |
| **Tokyo Night Day** | **not in the enkia VS Code theme** | — | https://api.github.com/repos/enkia/tokyo-night-vscode-theme/contents/themes, https://raw.githubusercontent.com/tokyo-night/tokyo-night-vscode-theme/master/package.json | The repo ships only "Tokyo Night", "Tokyo Night Storm" and **"Tokyo Night Light"**. See the next two rows. |
| Tokyo Night **Light** (enkia) | `#343b59` | `#e6e7ed` | https://raw.githubusercontent.com/tokyo-night/tokyo-night-vscode-theme/master/themes/tokyo-night-light-color-theme.json | The JSON says `"type": "dark"`, but package.json registers it as `uiTheme: "vs"`. |
| Tokyo Night **Day** (folke/tokyonight.nvim, Ghostty extra) | `#3760bf` | `#e1e2e7` | https://raw.githubusercontent.com/folke/tokyonight.nvim/main/extras/ghostty/tokyonight_day | Taken from folke's generated Ghostty theme (`foreground = #3760bf`, `background = #e1e2e7`). This is a different project from enkia's. |
| **VS Code Dark Modern** | `#CCCCCC` | `#1F1F1F` | https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-defaults/themes/dark_modern.json | Set directly in dark_modern.json, which has `"include": "./dark_plus.json"`. dark_plus.json has no `colors` block and includes `./dark_vs.json`, which sets `editor.foreground "#D4D4D4"` and `editor.background "#1E1E1E"`; Dark Modern overrides both. Some dark_vs `tokenColors` (such as `keyword.operator`, `meta.embedded` and `meta.template.expression`) still render `#D4D4D4`. |
| **Catppuccin Latte** | `#4c4f69` (text) | `#eff1f5` (base) | https://raw.githubusercontent.com/catppuccin/palette/HEAD/palette.json | palette.json `"version": "1.8.0"`. |
| **Catppuccin Mocha** | `#cdd6f4` (text) | `#1e1e2e` (base) | same | For reference: Frappé is `#c6d0f5` on `#303446`, and Macchiato is `#cad3f5` on `#24273a`. |
| **Nord** | `#d8dee9` (nord4) | `#2e3440` (nord0) | https://raw.githubusercontent.com/nordtheme/visual-studio-code/HEAD/themes/nord-color-theme.json | Names confirmed in https://raw.githubusercontent.com/nordtheme/nord/HEAD/src/nord.css (`--nord0: #2e3440`, `--nord4: #d8dee9`). The Nord docs say nord6 is for "plain text" syntax in dark designs, but the VS Code port's `editor.foreground` is nord4. |
| **GitHub Dark Default** | `#e6edf3` | `#0d1117` | https://raw.githubusercontent.com/primer/github-vscode-theme/main/src/theme.js, https://raw.githubusercontent.com/primer/github-vscode-theme/main/src/colors.js, https://unpkg.com/@primer/primitives@7.10.0/dist/json/colors/dark.json | The theme JSON is generated at build time and not committed. See the derivation below. |
| (classic) GitHub Dark | `#e1e4e8` | `#24292e` | https://unpkg.com/tm-themes/themes/github-dark.json (secondary) | A separate classic theme in the same extension. Included only to avoid confusing it with "GitHub Dark Default". |

**GitHub Dark Default derivation.**
- `src/theme.js` maps `"editor.foreground" : color.fg.default` and `"editor.background" : color.canvas.default`.
- `src/colors.js`, case `"dark"`, overrides `darkColors.fg.default = "#e6edf3";` ("Temp override until Primitives are updated").
- The extension pins `"@primer/primitives": "7.10.0"` (package.json; extension v6.3.5). That version's `dark.json` has `"canvas": { "default": "#0d1117", … }` and an un-overridden `"fg": { "default": "#c9d1d9", … }`.
- **Cross-check against a published build.** Shiki's `tm-themes` copy (https://unpkg.com/tm-themes/themes/github-dark-default.json, a secondary source) shows `"editor.background": "#0d1117"` and `"editor.foreground": "#e6edf3"`.
- I tried to read the published file directly from Open VSX (https://open-vsx.org/api/GitHub/github-vscode-theme/latest shows v6.3.5). Both `…/6.3.5/file/themes/dark-default.json` and `…/6.3.5/file/extension/themes/dark-default.json` returned **404**. So the published VSIX JSON itself is **UNVERIFIED (not fetched)**; the values rest on the source derivation plus the secondary copy.

---

## UNVERIFIED items and caveats

1. **Published "GitHub Dark Default" JSON inside the VSIX:** not fetchable (Open VSX returned 404 for files inside the package). The values come from the source derivation and match Shiki's `tm-themes` copy.
2. **"Tokyo Night Day" in enkia/tokyo-night-vscode-theme:** does not exist. The repo has Night, Storm and Light only. The "Day" values given come from folke/tokyonight.nvim, a different project.
3. **Legal effect of Myndex's terms on Color.js's independent MIT implementation:** the sources do not settle this. The verifiable facts are:
   - Color.js is MIT and cites apca-w3 as its source.
   - Myndex lists Color.js among "Code Libraries & Systems with APCA".
   - Myndex says no package other than apca-w3 "qualifies" as "APCA code" without written certification.
   - Trademark terms apply to using the *name* "APCA" regardless of code license.
4. **Whether minimum_compliance.md's "Generic Perceptual Contrast … nonstandard applications" level overrides LICENSE.md's web-only restriction:** not stated. Ask info@readtech.org in writing if apca-w3 or the "APCA" name will be used.
5. **Color.js docs licensing caveat:** none found on the Contrast docs page or the npm README. Other docs pages were not checked.
6. **The two [offline check] items** are local re-runs of code copied from fetched sources, not runs of the published npm packages.

---

## Full list of URLs fetched in this session

**Standards**
- https://www.w3.org/TR/WCAG22/
- https://www.w3.org/press-releases/2025/wcag22-iso-pas/
- https://www.iso.org/standard/91029.html
- https://www.w3.org/WAI/standards-guidelines/wcag/
- https://www.w3.org/TR/wcag-3.0/
- https://www.w3.org/standards/history/wcag-3.0/
- https://w3c.github.io/wcag3/guidelines/

**APCA**
- https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell
- https://registry.npmjs.org/apca-w3/latest
- https://raw.githubusercontent.com/Myndex/apca-w3/HEAD/README.md
- https://raw.githubusercontent.com/Myndex/apca-w3/HEAD/LICENSE.md
- https://raw.githubusercontent.com/Myndex/apca-w3/HEAD/package.json
- https://raw.githubusercontent.com/Myndex/apca-w3/HEAD/src/apca-w3.js
- https://raw.githubusercontent.com/Myndex/apca-w3/HEAD/test/index.js
- https://api.github.com/repos/Myndex/apca-w3/git/trees/HEAD?recursive=1
- https://api.github.com/repos/Myndex/SAPC-APCA/git/trees/HEAD?recursive=1
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/README.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/LICENSE.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/LICENSE.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/README.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/APCA_in_a_Nutshell.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/APCA-W3-LaTeX.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/APCA_FAQ.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/ImportantChangeNotices.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/minimum_compliance.md
- https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/thirdpartytools.md
- https://registry.npmjs.org/colorparsley/latest
- https://github.com/Myndex/apca-w3/discussions/11
- https://github.com/w3c/silver/issues/643

**Color.js**
- https://registry.npmjs.org/colorjs.io/latest
- https://api.github.com/repos/color-js/color.js/releases/latest
- https://raw.githubusercontent.com/color-js/color.js/HEAD/package.json
- https://raw.githubusercontent.com/color-js/color.js/HEAD/LICENSE
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/contrast/APCA.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/contrast.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/contrast/WCAG21.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/luminance.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/spaces/srgb.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/spaces/srgb-linear.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/deltaE/deltaEOK.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/deltaE/index.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/toGamut.js
- https://raw.githubusercontent.com/color-js/color.js/HEAD/src/defaults.js
- https://colorjs.io/docs/contrast
- https://colorjs.io/docs/gamut-mapping
- https://colorjs.io/docs/color-difference
- https://github.com/color-js/color.js/discussions/494

**culori and CVD**
- https://registry.npmjs.org/culori/latest
- https://api.github.com/repos/Evercoder/culori/releases/latest
- https://raw.githubusercontent.com/Evercoder/culori/HEAD/LICENSE
- https://raw.githubusercontent.com/Evercoder/culori/HEAD/src/deficiency.js
- https://raw.githubusercontent.com/Evercoder/culori/HEAD/src/wcag.js
- https://raw.githubusercontent.com/Evercoder/culori/HEAD/src/lrgb/convertRgbToLrgb.js
- https://culorijs.org/api/
- https://culorijs.org/color-spaces/
- https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
- http://colorspace.r-forge.r-project.org/reference/simulate_cvd.html

**Themes**
- https://ethanschoonover.com/solarized/
- https://api.github.com/repos/enkia/tokyo-night-vscode-theme/contents/themes
- https://raw.githubusercontent.com/tokyo-night/tokyo-night-vscode-theme/master/package.json
- https://raw.githubusercontent.com/tokyo-night/tokyo-night-vscode-theme/master/themes/tokyo-night-color-theme.json
- https://raw.githubusercontent.com/tokyo-night/tokyo-night-vscode-theme/master/themes/tokyo-night-light-color-theme.json
- https://raw.githubusercontent.com/folke/tokyonight.nvim/main/extras/ghostty/tokyonight_day
- https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-defaults/themes/dark_modern.json
- https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-defaults/themes/dark_plus.json
- https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-defaults/themes/dark_vs.json
- https://raw.githubusercontent.com/catppuccin/palette/HEAD/palette.json
- https://raw.githubusercontent.com/nordtheme/visual-studio-code/HEAD/themes/nord-color-theme.json
- https://www.nordtheme.com/docs/colors-and-palettes
- https://raw.githubusercontent.com/nordtheme/nord/HEAD/src/nord.css
- https://api.github.com/repos/primer/github-vscode-theme/contents/
- https://api.github.com/repos/primer/github-vscode-theme/contents/src
- https://api.github.com/repos/primer/github-vscode-theme/contents/src/classic
- https://raw.githubusercontent.com/primer/github-vscode-theme/main/package.json
- https://raw.githubusercontent.com/primer/github-vscode-theme/main/src/index.js
- https://raw.githubusercontent.com/primer/github-vscode-theme/main/src/colors.js
- https://raw.githubusercontent.com/primer/github-vscode-theme/main/src/theme.js
- https://unpkg.com/@primer/primitives@7.10.0/dist/json/colors/dark.json
- https://open-vsx.org/api/GitHub/github-vscode-theme/latest
- https://open-vsx.org/api/GitHub/github-vscode-theme/6.3.5/file/themes/dark-default.json (404)
- https://open-vsx.org/api/GitHub/github-vscode-theme/6.3.5/file/extension/themes/dark-default.json (404)
- https://unpkg.com/tm-themes/themes/github-dark-default.json (secondary)
- https://unpkg.com/tm-themes/themes/github-dark.json (secondary)

**Web searches used only to find URLs, not as evidence.** Queries: "ISO/IEC 40500:2025 WCAG 2.2 W3C announcement"; "color.js APCA license Myndex issue github color-js"; "culori filterDeficiencyProt linear rgb Machado matrices gamma issue Evercoder". Every fact above was re-read from the directly fetched page.
