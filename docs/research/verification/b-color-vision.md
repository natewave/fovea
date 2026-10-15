# Group B verification: chromatic aberration, foveal anatomy, color-vision deficiency, background tints, typography, and color-science reference data

Verified 2026-10-14 for the Fovea research brief (rows 4, 5, 9, 10 and 12, plus reference data). Every fact below comes from a page fetched in this session, and URLs are listed per source. The labels mean:

- **Full text:** I read the paper body (publisher page, PMC, or an author-hosted copy).
- **Abstract only:** I could not open the body.
- **Via search:** the web-search tool fetched that exact URL and I read the saved page text.
- **Computed:** arithmetic I did myself, such as unit conversions or evaluating a published formula.

**Access notes.** pubmed.ncbi.nlm.nih.gov and pmc.ncbi.nlm.nih.gov returned HTTP 403 to the fetcher, so PubMed abstracts come from NCBI E-utilities (`eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=…&rettype=abstract&retmode=text`), which serves the same records. dl.acm.org and en.wikipedia.org/wiki/Color_temperature timed out.

## Summary

| Row | Verdict | Main correction |
|---|---|---|
| 4. Colored text on black; LCA | PARTLY ACCURATE | The study results are quoted correctly, but neither study matched the colors' luminance, and Fan et al. had only 10 people per color. "About 2 D" of LCA holds: about 2.1 D over 400–700 nm from the Thibos 1992 model. I could not read that figure in Thibos 1990 itself. The causal claim is wrong: chromostereopsis comes mainly from *transverse* chromatic aberration that differs between the two eyes, not from LCA, and its direction varies between people. |
| 5. No S cones in the central fovea | ACCURATE (sentence 1); PARTLY ACCURATE (sentence 2) | The zone is a *diameter*: about 25′ with no functioning S cones (Williams 1981) and about 100 µm ≈ 0.35° ≈ 21′ with none stained (Curcio 1991). L and M cones also carry red–green color signals, so "which means luminance contrast" skips a step. Mullen 1985 supports that step: color-only acuity is about 11–12 c/deg. |
| 9. CVD prevalence; Machado model | ACCURATE (prevalence); PARTLY ACCURATE (Machado) | The numbers match Simunovic 2010 Table 1. Machado 2009 is widely used, but its authors "restrain our model from trying to model tritanopia", so its "tritan 1.0" matrix is tritanomaly. A 2021 review recommends Brettel 1997 for tritan simulation. The project page doesn't say whether to apply the matrices to linear or gamma-encoded RGB. culori applies them to gamma-encoded sRGB; colorspacious to linear sRGB. |
| 10. Warm background tints | ACCURATE, with caveats | 341 took part (89 with dyslexia), and 17 were dropped for failing comprehension. No white or off-white background was tested, and no standardized effect sizes are reported. |
| 12. Atkinson Hyperlegible; italics | ACCURATE, with nuance | All four Fontsource packages exist (v5.3.0, OFL-1.1, weights 200–800, upright and italic). The OFL applies to the Google Fonts releases; the Braille Institute's own download is under its own EULA. The BDA 2023 guide says to avoid italics (and underlining) generally, not only in running text. |

**Formula warning.** Wikipedia's McCamy formula currently has a sign error: its definition of n gives 4664 K for D65. Use n = (x − 0.3320)/(y − 0.1858) with the polynomial as printed.

---

## Row 4: Colored text on black, and chromatic aberration

> Brief: "On black, saturated blue text produced the largest accommodative lag (0.61 D) and was rated hardest to read; yellow was rated easiest (n=30). Under low light with light-on-dark text, red caused the most fatigue and yellow the least. The eye's longitudinal chromatic aberration (about 2 D across the visible spectrum) focuses red and blue at different depths, which produces chromostereopsis."

### 4a. Ramasubramanian et al. 2026 (*British and Irish Orthoptic Journal*)

1. **Citation.** Ramasubramanian VS, Madhavan KJ, Ali SAH, Jeyaraj JR, Selvakumar S. (2026). Effect of chromostereoscopic stimulus on accommodative response and subjective perception. *British and Irish Orthoptic Journal* 22(1):73–83. doi:10.22599/bioj.515. PMID 41797875; PMCID PMC12962248. Published 2026-03-04, open access (CC BY).
   Fetched:
   - https://api.crossref.org/works/10.22599/bioj.515
   - https://api.semanticscholar.org/graph/v1/paper/DOI:10.22599/bioj.515?fields=title,authors,year,venue,abstract,externalIds
   - Full text: https://www.bioj-online.com/articles/10.22599/bioj.515
   - https://pmc.ncbi.nlm.nih.gov/articles/PMC12962248/ returned HTTP 403.
2. **Study type.** Prospective, cross-sectional lab experiment, within-subject. The order of the 7 conditions was randomized for each participant.
3. **Sample.** 30 young, healthy adults (mean age 19.83 ± 1.18 years), all university students, with best-corrected acuity of 6/6 or better.
4. **Key results.**
   - **Setup.** An Apple iPad (7th generation) at 50 cm (a 2.00 D focusing demand). Focus was measured in the right eye with an N-vision K 5001 open-field autorefractor while viewing with both eyes. The room was about 250 lux. Text was Arial N8 (0.75° character height). Each condition was 5 minutes of reading, followed by a 5-minute washout.
   - **Stimuli.** Pure primaries on black: red (255,0,0), green (0,255,0), blue (0,0,255) and yellow (255,255,0). There were also two mixed-color conditions and a black-on-white baseline. The authors say these were "non-isoluminant" by design and that they "did not perform spectroradiometric measurements".
   - **Main effect.** Color affected focusing lag: F(4.36, 126.35) = 17.43, p < .001, partial η² = 0.38.
   - **Mean lag ± SD, in dioptres.** Red 0.18 ± 0.51; black-on-white 0.35 ± 0.56; mixed line 0.35 ± 0.54; mixed word 0.35 ± 0.56; yellow 0.36 ± 0.55; green 0.44 ± 0.58; blue 0.61 ± 0.60. Blue's lag was significantly larger than every other condition (p ≤ .003).
   - **Ratings.** Blue was "most difficult to read" for 73.33% of participants and "farthest" for 76.67%. "Yellow was perceived as the easiest to read (53.33%)", with red second (26.67%). Red was chosen as "closest" by 46.67%.
   - **Authors' explanation.** They attribute blue's lag to its "lower effective luminance", which makes it "a poor or inadequate stimulus" for focusing.
   - **The LCA statement.** The introduction says "this LCA amounts to approximately 2.00 D across the visible spectrum (400–700 nm) (Thibos et al., 1990)". For display primaries, that gives "approximately 1.25 D to 1.50 D between the red and blue focal planes". It also says "Typically, due to LCA, red objects appear closer".
5. **Verdict.** Sentence 1 is ACCURATE. Two additions are worth making:
   - The colors were full-intensity primaries, not luminance-matched, so blue's large lag cannot be separated from its low luminance.
   - Yellow's lag (0.36 D) was the same as the black-on-white baseline (0.35 D).
6. **Evidence label:** experiment.

### 4b. Fan et al. 2024 (*Sensors*)

1. **Citation.** Fan Q, Xie J, Dong Z, Wang Y. (2024). The effect of ambient illumination and text color on visual fatigue under negative polarity. *Sensors* 24(11):3516. doi:10.3390/s24113516. The brief's "Sensors 24:3516" is correct (issue 11).
   Fetched:
   - Full text (via search): https://www.mdpi.com/1424-8220/24/11/3516
   - Also via search: https://pdfs.semanticscholar.org/06c8/60f3c74443aa8b1a0774e92a2bc5492a3780.pdf
2. **Study type.** Lab experiment with a mixed design. Text color varied between subjects (5 groups). Ambient light varied within subjects, one level per day over 3 days, counterbalanced.
3. **Sample.** 50 people (27 men, 23 women), aged 20–32 (mean 27, SD 4). Most were affiliated with Northeastern University; the rest were "online car drivers". All had normal or corrected vision and passed a color-blindness test. **That leaves 10 people per text color.**
4. **Key results.**
   - **Setup.** Black background; screen luminance 28 cd/m² (5% of maximum); ambient light at 0, 5 or 10 lux. Participants read a Chinese novel aloud for about 20 minutes (20-pt bold text), then did a symbol-recognition task.
   - **Measures.**
     - "Pupil accommodation" from an eye tracker. This is pupil-size change, not lens focusing.
     - Blink rate.
     - A symbol-recognition score.
     - A 10-item, 7-point questionnaire on which "a lower index reflect[s] higher levels of visual fatigue".
   - **Colors.** All colors had the same HSB saturation and brightness, so their luminance differed. Contrast against black (Table 1):

     | Color | RGB | Contrast |
     |---|---|---|
     | White | (242,242,242) | 19.60 |
     | Yellow | (158,138,47) | 6.13 |
     | Green | (60,158,47) | 6.12 |
     | Blue | (47,88,158) | 3.01 |
     | Red | (158,53,47) | 3.00 |

   - **Effects of text color.**
     - Pupil measure: F(4,145) = 360.687, η² = 0.914.
     - Blink rate: F(4,145) = 209.201, η² = 0.861.
     - Symbol-recognition score: F(4,145) = 117.999, η² = 0.257.
   - **Effects of ambient light.** Light affected the pupil measure (η² = 0.202) and blink rate (η² = 0.141), but not the symbol-recognition score or the fatigue questionnaire.
   - **Ranking.** Fatigue ranked "red text > green text > blue text > white text > yellow text". On the questionnaire, yellow and white scored best and red worst.
   - **Statistical concern.** The reported degrees of freedom (4, 145) imply the 150 sessions were analysed as independent observations, although each person contributed three. This is my inference from the reported values.
5. **Verdict.** ACCURATE as a summary of the paper. Two additions:
   - The sample was n = 50, with 10 per color.
   - Red and blue had about half the luminance contrast of yellow and green (3.0:1 vs 6.1:1), so "red is fatiguing" is partly a low-contrast effect. Green had the same contrast as yellow but still ranked second-worst, so contrast isn't the whole story.
6. **Evidence label:** experiment.

### 4c. Thibos et al. 1990 (*Vision Research*): the paper the brief cites for "about 2 D"

1. **Citation.** Thibos LN, Bradley A, Still DL, Zhang X, Howarth PA. (1990). Theory and measurement of ocular chromatic aberration. *Vision Research* 30(1):33–49. doi:10.1016/0042-6989(90)90126-6. PMID 2321365.
   Fetched:
   - https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=2321365,20725330,3716229&rettype=abstract&retmode=text
   - https://api.semanticscholar.org/graph/v1/paper/DOI:10.1016/0042-6989(90)90126-6?fields=title,authors,year,venue,abstract,externalIds (the publisher hides the abstract)
   - Via search: https://www.academia.edu/60918426/Theory_and_measurement_of_ocular_chromatic_aberration (abstract only; the full PDF requires sign-up)
   - https://pubmed.ncbi.nlm.nih.gov/2321365/ returned HTTP 403.
2. **Study type.** Lab measurement plus an optical model.
3. **Sample.** The abstract describes five subjects: the pupil was "closely centered" for two and displaced temporally for three.
4. **Key results.**
   - Transverse chromatic aberration (TCA) was measured with a two-color vernier viewed through a displaced pinhole. LCA was measured by best focus.
   - Both "were closely predicted by a simple, reduced-eye optical-model for which transverse and longitudinal chromatic aberration are directly proportional". The proportionality constant is how far the pinhole sits from the visual axis.
   - **The abstract gives no LCA magnitude.** Academia.edu shows a "Key takeaways" bullet saying "approximately 2 D over the visible spectrum", but the page labels it AI-generated, so I didn't count it.
5. **Verdict.** UNVERIFIED for the 2 D figure *from this paper*. The figure itself is supported by 4d and 4e, and the citation details (authors, year, journal, pages, DOI) are correct.
6. **Evidence label:** mechanism.

### 4d. Thibos, Ye, Zhang & Bradley 1992 (*Applied Optics*): "The chromatic eye"

1. **Citation.** Thibos LN, Ye M, Zhang X, Bradley A. (1992). The chromatic eye: a new reduced-eye model of ocular chromatic aberration in humans. *Applied Optics* 31(19):3594–3600. doi:10.1364/AO.31.003594. PMID 20725330.
   Fetched:
   - Abstract: https://opg.optica.org/ao/abstract.cfm?uri=ao-31-19-3594
   - The same E-utilities URL as 4c.
   - Secondary source, full text (via search): Fernandez-Alonso M, Finch AP, Love GD, Read JCA (2024), *Journal of Vision* 24(2):11, doi:10.1167/jov.24.2.11. https://eprints.whiterose.ac.uk/id/eprint/214496/1/Ocular%20accommodation%20and%20wavelength%20The%20effect%20of%20longitudinal%20chromatic%20aberration%20on%20the%20stimulus%E2%80%93response%20curve.pdf
   - Secondary source, full text (via search): Cholewiak et al. (2018), *Journal of Vision*, "Creating correct blur and its effect on accommodation". https://pmc.ncbi.nlm.nih.gov/articles/PMC6126933/
2. **Study type.** Measurement (two-color vernier) plus an optical model.
3. **Sample.** Not stated in the abstract.
4. **Key results.**
   - The abstract gives no number. It says new measurements of chromatic focus "were used to redefine the variation of refractive index of the reduced eye over the visible spectrum".
   - Fernandez-Alonso et al. 2024, citing this model, write: "The total defocus across the entire visible spectrum is approximately 2 diopters (D)." They give the model as D(λ) = p − q/(λ − c), with λ in µm and the Marimont & Wandell (1994) values p = 1.7312, q = 0.63346, c = 0.21410 (580 nm in focus).
   - Computed from that formula: D(400 nm) = −1.676 D and D(700 nm) = +0.428 D, so **the span over 400–700 nm is 2.10 D**. The span is 1.66 D over 420–660 nm and 1.09 D over 450–610 nm.
   - Cholewiak et al. 2018 use the same model with 520 nm in focus, but write "From 400-700 nm, the difference is ~2.5 D". Their own equation gives 2.10 D over that range, so I wouldn't use the 2.5 D figure.
5. **Verdict.** This is the right citation for "about 2 D": about 2.1 D across 400–700 nm.
6. **Evidence label:** mechanism.

### 4e. Howarth & Bradley 1986 (*Vision Research*): an independent measurement

1. **Citation.** Howarth PA, Bradley A. (1986). The longitudinal chromatic aberration of the human eye, and its correction. *Vision Research* 26(2):361–366. doi:10.1016/0042-6989(86)90034-9. PMID 3716229. Ramasubramanian et al. cite it for the direction of LCA.
   Fetched:
   - The same E-utilities URL as 4c.
   - https://api.semanticscholar.org/graph/v1/paper/DOI:10.1016/0042-6989(86)90034-9?fields=title,authors,year,venue,abstract,externalIds
2. **Study type.** Lab experiment: the far point was measured with a Badal optometer at nine wavelengths.
3. **Sample.** 20 subjects.
4. **Key results.** "We found an average aberration of 1.82 D (SD 0.15 D)" between 420 and 660 nm, consistent with the earlier estimate of about 1.75 D. With either commercial achromatizing lens, no subject had more than 0.48 D of residual aberration.
5. **Verdict.** Supports "about 2 D" (1.82 D over the narrower 420–660 nm range). It also shows the variation between people is small (SD 0.15 D).
6. **Evidence label:** experiment.

### 4f. What actually causes chromostereopsis

Fetched:
- https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=36729421,18271777,8184561,1767497,2309454&rettype=abstract&retmode=text
- https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=2216476,7280992&rettype=abstract&retmode=text

Four sources:

- **Roorda A, Cholewiak SA, Bhargava S, Ivzan NH, LaRocca F, Nankivil D, Banks MS. (2023).** The visual benefits of correcting longitudinal and transverse chromatic aberration. *Journal of Vision* 23(2):3. doi:10.1167/jov.23.2.3. PMID 36729421.
  - An experiment using a binocular system that corrects LCA and TCA separately. The sample size isn't in the abstract.
  - Conclusion: "we found that the primary cause of chromostereopsis is the TCA of the eyes." Also: "TCA at the fovea was variable between individuals".
  - Label: experiment.
- **Ye M, Bradley A, Thibos LN, Zhang XX. (1991).** Interocular differences in transverse chromatic aberration determine chromostereopsis for small pupils. *Vision Research* 31(10):1787–1796. doi:10.1016/0042-6989(91)90026-2. PMID 1767497.
  - "Chromostereopsis with small pupils can be precisely accounted for by the interocular difference in monocular transverse chromatic aberration."
  - Label: experiment.
- **Simonet P, Campbell MCW. (1990).** Effect of illuminance on the directions of chromostereopsis and transverse chromatic aberration observed with natural pupils. *Ophthalmic and Physiological Optics* 10(3):271–279. doi:10.1111/j.1475-1313.1990.tb00863.x. PMID 2216476.
  - 30 subjects at 10 and 1000 lux: "approximately equal numbers of subjects perceived positive and negative chromostereopsis". Raising the illumination reversed the direction for 16 subjects.
  - Label: experiment.
- **Vos JJ. (2008).** Depth in colour, a history of a chapter in physiologie optique amusante. *Clinical and Experimental Optometry* 91(2):139–147. PMID 18271777.
  - A historical review. Brücke's explanation via chromatic aberration ("usually indicated as transverse chromatic aberration") plus the fovea's off-axis position "still forms the basis of present-day understanding". It is complemented by an off-centre Stiles–Crawford effect.
  - Label: expert opinion.

### Row 4 verdict: PARTLY ACCURATE

Both study results are reported correctly. "About 2 D" is right for LCA across 400–700 nm: about 2.1 D from Thibos 1992, and 1.82 D over 420–660 nm in Howarth & Bradley 1986. Two things are wrong or missing:

- **The mechanism.** LCA puts red and blue in focus at different distances, which causes blur and a focusing conflict. It is not the main cause of chromostereopsis. Chromostereopsis comes mainly from transverse chromatic aberration that differs between the two eyes. That difference creates a small binocular disparity between colors. Its direction varies between people, and with lighting and pupil size.
- **The confounds.** Neither study luminance-matched its colors, and Fan et al. had only 10 people per color.

**Suggested wording:**

> On black, pure blue text (RGB 0,0,255) produced the largest focusing lag (0.61 D, vs 0.35 D for black-on-white) and was rated hardest to read; yellow was rated easiest (n=30). In dim light (0–10 lux), colored text on black ranked red as most fatiguing and yellow as least (n=50, 10 per color; the colors were not luminance-matched). The eye's longitudinal chromatic aberration (about 2 D from 400 to 700 nm) means saturated red and blue can't be in focus at the same time. A related effect, transverse chromatic aberration, is the main cause of chromostereopsis: red and blue appear at different depths, in a direction that varies between people.

The brief's design rule still stands on these findings: no saturated blue or deep-red text, and no saturated red next to saturated blue.

---

## Row 5: No S cones in the central fovea

> Brief: "The central ~20–25 arcmin of the fovea has no S (blue) cones. Fine spatial detail is resolved by L and M cones, which means by luminance contrast."

### 5a. Williams, MacLeod & Hayhoe 1981 (*Vision Research*): "Foveal tritanopia"

1. **Citation.** Williams DR, MacLeod DIA, Hayhoe MM. (1981). Foveal tritanopia. *Vision Research* 21(9):1341–1356. doi:10.1016/0042-6989(81)90241-8. PMID 6976039. A companion paper by the same authors is "Punctate sensitivity of the blue-sensitive mechanism", *Vision Research* 21(9):1357–1375, PMID 7314519.
   Fetched:
   - Abstract: https://www.sciencedirect.com/science/article/pii/0042698981902418
   - https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=1722224,7314519,7314516,6976039&rettype=abstract&retmode=text (PubMed has no abstract for this paper)
   - https://api.semanticscholar.org/graph/v1/paper/DOI:10.1016/0042-6989(81)90241-8?fields=title,authors,year,venue,abstract,externalIds,tldr
2. **Study type.** Psychophysical experiment (sensitivity and color discrimination).
3. **Sample.** Not stated in the abstract (UNVERIFIED).
4. **Key results.**
   - "Measurements of sensitivity and color discrimination suggest that an area roughly 25′ in diameter in the central fovea lacks functioning blue-sensitive cones."
   - Screening by macular pigment and Troxler fading "are shown to be unable to account for the results".
   - The remaining blue-cone color discrimination in that area "may be mediated by light scattered onto surrounding B cones".
5. **Verdict.** Supports "about 25 arcmin", as a diameter, and refers to *functioning* S cones.
6. **Evidence label:** experiment.

### 5b. Curcio et al. 1991 (*Journal of Comparative Neurology*)

1. **Citation.** Curcio CA, Allen KA, Sloan KR, Lerea CL, Hurley JB, Klock IB, Milam AH. (1991). Distribution and morphology of human cone photoreceptors stained with anti-blue opsin. *Journal of Comparative Neurology* 312(4):610–624. doi:10.1002/cne.903120411. PMID 1722224.
   Fetched: the same E-utilities URL as 5a.
2. **Study type.** Anatomy (antibody staining of donor retinas).
3. **Sample.** 7 whole retinas from 6 female donors.
4. **Key results.**
   - "7% of cones within 4 mm of the foveal center are labeled by antiblue opsin."
   - "Foveal blue cones are sparse, irregularly spaced, and missing in a zone about 100 microns (0.35 degrees) in diameter near the site of peak cone density." Computed: 0.35° = **21 arcmin**.
   - Blue-cone density peaks (above 2,000 cells/mm²) in a ring at 0.1–0.3 mm from the center.
   - "Blue cone spacing may limit resolution of the blue channel out to 20-30 degrees eccentricity."
   - The authors say the findings "are consistent with psychophysical reports of foveal tritanopia".
5. **Verdict.** Supports "about 20 arcmin" (21′, as a diameter).
6. **Evidence label:** mechanism (anatomy).

### 5c. Supporting source: Mullen 1985 (*Journal of Physiology*) on color-only vs luminance detail

1. **Citation.** Mullen KT. (1985). The contrast sensitivity of human colour vision to red-green and blue-yellow chromatic gratings. *Journal of Physiology* 359:381–400. doi:10.1113/jphysiol.1985.sp015591. PMID 3999044; PMCID PMC1193381.
   Fetched: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=3999044&rettype=abstract&retmode=text
2. **Study type.** Psychophysical experiment, with chromatic aberrations corrected.
3. **Sample.** Not stated in the abstract.
4. **Key results.**
   - Red–green and blue–yellow sensitivity both fall off steadily from coarse to fine patterns.
   - "The limiting acuities based on red-green and blue-yellow colour discriminations are similar at 11 or 12 cycles/deg."
   - "Above 0.5 cycles/deg, contrast sensitivity is greater to monochromatic than to chromatic gratings."
5. **Verdict.** Supports the brief's inference that fine detail is carried mainly by luminance contrast.
6. **Evidence label:** experiment.

### Row 5 verdict

- **Sentence 1 is ACCURATE**, read as a diameter. Williams 1981 (psychophysics) found about 25′ with no *functioning* S cones. Curcio 1991 (anatomy) found about 21′ (100 µm) with no stained S cones.
- **Sentence 2 is PARTLY ACCURATE.** L and M cones do resolve fine detail, but they also carry the red–green color signal, so "which means luminance contrast" skips a step. That step is supported: color-only patterns stop being resolvable at about 11–12 c/deg, and sensitivity to luminance is higher at all but the coarsest scales.

**Suggested wording:**

> The central ~20–25 arcmin (diameter) of the fovea has no functioning S (blue) cones, and S cones are sparse everywhere, so the blue–yellow signal carries little fine detail. Fine detail is carried mainly by luminance contrast: color-only patterns stop being resolvable at about 11–12 cycles per degree.

---

## Row 9: Color-vision deficiency prevalence and simulation

> Brief: "About 8% of men and 0.5% of women of European ancestry have congenital red-green CVD; deuteranomaly alone affects about 4.6% of men. Machado et al. 2009 is the standard simulation model."

### 9a. Simunovic 2010 (*Eye*)

1. **Citation.** Simunovic MP. (2010). Colour vision deficiency. *Eye* 24(5):747–755. doi:10.1038/eye.2009.251. PMID 19927164. Published online 2009-11-20. The brief's citation is correct.
   Fetched:
   - Abstract: https://www.nature.com/articles/eye2009251
   - Table 1: https://www.nature.com/articles/eye2009251/tables/1
   - https://api.crossref.org/works/10.1038/eye.2009.251
   - https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=19927164&retmode=json
   - Full text via search, from a third-party copy: https://exa.ai/library/publication/73ynxs9nvjg
2. **Study type.** Narrative review.
3. **Sample.** Not applicable. Table 1's prevalence figures cite Sharpe, Stockman, Jägle & Nathans (1999) in *Color Vision* (Cambridge University Press).
4. **Key results.**
   - Abstract: "Congenital colour vision deficiency affects as many as 8% of males and 0.5% of females".
   - The red–green section says these deficiencies "are the most prevalent, affecting between 2 and 8% of males and about 0.5% of females (the highest rates occur in Europeans and the lowest in Africans)".
   - Table 1. Its footnote says: "Prevalence refers to European populations and—in the case of X-linked recessive conditions—the prevalence in males."

     | Type | Prevalence |
     |---|---|
     | Protanomaly | 1.08% |
     | Deuteranomaly | 4.63% |
     | Protanopia | 1.01% |
     | Deuteranopia | 1.27% |
     | Tritanopia (including tritanomaly) | up to 1 in 500 (autosomal dominant) |

   - Computed: the four red–green types sum to 7.99%.
5. **Verdict.** ACCURATE. Two nuances: the 0.5% figure for women is stated generally, not specifically for Europeans; and 8% is the European upper bound, not a worldwide figure.
6. **Evidence label:** expert opinion (a review of prevalence surveys).

### 9b. Machado, Oliveira & Fernandes 2009 (*IEEE TVCG*)

1. **Citation.** Machado GM, Oliveira MM, Fernandes LAF. (2009). A physiologically-based model for simulation of color vision deficiency. *IEEE Transactions on Visualization and Computer Graphics* 15(6):1291–1298 (Nov/Dec 2009). doi:10.1109/TVCG.2009.113. PMID 19834201. The brief's citation is correct.
   Fetched:
   - Project page: https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
   - Paper, full text: https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/Machado_Oliveira_Fernandes_CVD_Vis2009_final.pdf
   - https://api.semanticscholar.org/graph/v1/paper/DOI:10.1109/TVCG.2009.113?fields=title,authors,year,venue,abstract,externalIds,publicationVenue
   - http://hdl.handle.net/10183/27630 returned HTTP 404.
2. **Study type.** Computational model with a small validation experiment.
3. **Sample.** Validation used a computerized Farnsworth–Munsell 100-Hue test on CRT monitors calibrated to "Gamma 2.2 and White Point 6500K".
   - 17 men with normal color vision.
   - 13 men with CVD: 4 protanomalous, 4 protanopes, 3 deuteranomalous and 2 deuteranopes.
   - **There were no tritan participants.**
4. **Key results.**
   - **How the model works.** It shifts the cones' spectral sensitivities (Smith & Pokorny cone fundamentals) and feeds them into the Ingling & Tsou opponent-color stage. The RGB-to-opponent matrix comes from "projecting the spectral power distributions ϕR(λ), ϕG(λ), and ϕB(λ) of the RGB primaries" onto the opponent functions. It is normalized so that grays from (0,0,0) to (1,1,1) map to themselves.
   - **Tuning.** For dichromacy, a 0.96 scaling factor "was used to improve the matching" with Brettel et al.'s model.
   - **Tritan limits, in the authors' words.**
     - "Our model is not intended to handle tritanopia (which is expected to affect about 0.003% of the population…)".
     - "We simulate tritanomaly based on the shift paradigm only (Eq. 19) as an approximation to the actual phenomenon and restrain our model from trying to model tritanopia."
     - The paper also calls tritan defects "believed to be acquired". Simunovic's Table 1 instead lists tritanopia as autosomal dominant (inherited) and up to 1 in 500.
   - **Errata.** The project page says Eqs. 17–18 in the printed paper contain a typo, but "the images shown in the paper and the matrices provided as supplementary material are correct".

**Severity 1.0 matrices, copied exactly from Table 1 of the project page.**

- The page labels its columns *Protanomaly*, *Deuteranomaly* and *Tritanomaly*, and says "1.0 represents the highest severity or a case of dichromacy".
- The matrices are row-major and apply as [R_s G_s B_s]ᵀ = Φ·[R G B]ᵀ.
- Each row sums to 1.000000 ± 0.000001 (computed), so grays are preserved.

Protanomaly, severity 1.0 (≈ protanopia):
```
 0.152286   1.052583  -0.204868
 0.114503   0.786281   0.099216
-0.003882  -0.048116   1.051998
```
Deuteranomaly, severity 1.0 (≈ deuteranopia):
```
 0.367322   0.860646  -0.227968
 0.280085   0.672501   0.047413
-0.011820   0.042940   0.968881
```
Tritanomaly, severity 1.0 (the authors' approximation of tritanomaly; **not** a model of tritanopia):
```
 1.255528  -0.076749  -0.178779
-0.078411   0.930809   0.147602
 0.004733   0.691367   0.303900
```

The same numbers appear digit-for-digit in three implementations:
- culori: https://raw.githubusercontent.com/Evercoder/culori/main/src/deficiency.js
- colorspacious: https://raw.githubusercontent.com/njsmith/colorspacious/master/colorspacious/cvd.py
- colour-science: https://raw.githubusercontent.com/colour-science/colour/develop/colour/blindness/machado2009.py. Its documentation warns that the tritanomaly matrices use "a shift value in domain [5, 59] contrary to the domain [0, 20] used for protanomaly and deuteranomaly".

**Which RGB space should the matrices be applied in?**

- **The project page doesn't say.** It describes the input only as "the reference RGB color".
- **The paper doesn't say to linearize either.** Building the matrix from the primaries' spectra is a linear-light operation, so applying it to linear RGB is the physically consistent reading. That's my inference, not the authors' statement.
- **colorspacious applies the matrices in linear sRGB.** Its conversion graph goes `sRGB1+CVD` → `sRGB1-linear+CVD` → matrix → `sRGB1-linear`. Source: https://raw.githubusercontent.com/njsmith/colorspacious/master/colorspacious/conversion.py
- **culori applies them to gamma-encoded sRGB.** Its `filterDeficiencyProt`, `filterDeficiencyDeuter` and `filterDeficiencyTrit` multiply the `rgb` mode. culori's docs define `rgb` as "The sRGB color space" and `lrgb` as "the linear-light form" (https://culorijs.org/color-spaces/). If Fovea uses culori, convert to `lrgb` first, or apply the matrices directly.
- **DaltonLens (November 2021 update)** raises the same doubt (https://daltonlens.org/opensource-cvd-simulation/): "I think one big issue with Machado 2009 is that a proper sRGB decoding was not implemented." It adds: "it's also unclear how they tuned their parameters to match the output of Brettel 1997, did they include sRGB decoding or not?"
- **SVG filters run in linear RGB by default.** MDN says "`color-interpolation-filters` has an initial value of `linearRGB`", so primitives like `feColorMatrix` work in linear RGB. MDN also says it "has no effect on filter functions, which operate in the sRGB color space" (https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/color-interpolation-filters). That supports the brief's §4.5 plan for SVG filters, but not for CSS filter functions.

**Is Machado "the standard"?** DaltonLens's 2021 review says:

- It is popular: "Chromium and Mozilla used to rely on the ColorMatrix (Coblis v1) algorithm but fortunately now rely on the Machado approach."
- For tritanopia, "the Brettel 1997 approach is still the most solid and basically only valid choice."
- For protanopia and deuteranopia, "Viénot 1999, Brettel 1997 and Machado 2009 are solid choices, with a slight advantage for Viénot".
- In reader feedback, "Brettel 1997 and Viénot 1999 are the clear winners (once adapted to sRGB). Machado 2009 consistently ranks lower." The review therefore recommends Machado "for anomalous trichromacy … but not full dichromacy."

5. **Verdict.** PARTLY ACCURATE. Machado 2009 is widely used, and of these models it is the only one that handles anomalous trichromacy from first principles. But it isn't *the* standard, and it explicitly doesn't model tritanopia.
6. **Evidence label:** mechanism (a computational model, validated with 13 men with red–green deficiencies).

### Row 9 verdict

The prevalence figures are ACCURATE. Calling Machado "the standard" is PARTLY ACCURATE.

**Suggested wording:**

> Up to about 8% of men and 0.5% of women of European ancestry have congenital red–green CVD (rates are lower in other populations); deuteranomaly alone affects about 4.6% of European men. Machado et al. 2009 is a widely used simulation model, used in Chrome and Firefox, for red–green deficiencies at any severity. Its authors do not model tritanopia, so tritan checks should use Brettel et al. 1997.

---

## Row 10: Warm background tints

> Brief: "Warm background tints (peach, orange, yellow) gave faster on-screen reading than cool tints, for readers with and without dyslexia (n=341)."

1. **Citation.** Rello L, Bigham JP. (2017). Good background colors for readers: a study of people with and without dyslexia. In *Proceedings of the 19th International ACM SIGACCESS Conference on Computers and Accessibility (ASSETS '17)*, Baltimore, pp. 72–80. doi:10.1145/3132525.3132546. The brief's citation is correct.
   Fetched:
   - https://api.crossref.org/works/10.1145/3132525.3132546
   - https://api.semanticscholar.org/graph/v1/paper/DOI:10.1145/3132525.3132546?fields=title,authors,year,venue,abstract,externalIds,openAccessPdf (abstract hidden)
   - Author copy, full text (via search): https://www.cs.cmu.edu/~jbigham/pubs/pdfs/2017/colors.pdf
   - Also via search: https://www.superarladislexia.org/pdf/2017-Luz%20Rello-Colors-assets.pdf
   - https://dl.acm.org/doi/10.1145/3132525.3132546 timed out.
2. **Study type.** Online, supervised, within-subject experiment. The 10 background colors were counterbalanced across 10 versions of the study, each completed by 33–35 people.
3. **Sample.** 341 people took part. 17 (4.9%) were dropped for failing the comprehension questions, which leaves about 324 analyzed (computed).
   - **Dyslexia group:** 89 (69 women, 20 men) "with dyslexia or at risk of having dyslexia", aged 18–60 (mean 38.4).
   - **Control group:** 252 (195 women), aged 18–60 (mean 37.8).
   - All were native Spanish speakers, and 83% had a college degree or higher.
   - They used their own laptop or desktop with Chrome and a mouse, so screens were not calibrated.
4. **Key results.**
   - **Text.** Black 18-pt Arial, in paragraphs of 55 words.
   - **Backgrounds.** Hex code and contrast against black:

     | Background | Hex | Contrast |
     |---|---|---|
     | Yellow | #F8FD89 | 19.4:1 |
     | Turquoise | #A5F7E1 | 16.99:1 |
     | Blue Grey | #DBE1F1 | 16.05:1 |
     | Green | #A8F29A | 15.83:1 |
     | Orange | #EDDD6E | 15.17:1 |
     | Peach | #EDD1B0 | 14.35:1 |
     | Grey | #D8D3D6 | 14.21:1 |
     | Red | #E0A6AA | 10.2:1 |
     | Blue | #96ADFC | 9.68:1 |
     | Purple | #B987DC | 7.56:1 |

   - **A typo in the paper.** Its RGB triplets are shifted one line against the hex codes (e.g., "Green: RGB(219, 225, 241) #A8F29A"). The hex codes reproduce the stated contrast ratios exactly (computed), so the hex codes are correct.
   - **Mean reading time per paragraph ± SD, in seconds**, with the percentage relative to Peach:

     | Background | Dyslexia | Control |
     |---|---|---|
     | Peach | 14.85 ± 6.29 (100%) | 12.28 ± 5.09 (100%) |
     | Orange | 15.33 ± 6.02 (103%) | 12.32 ± 4.07 (100%) |
     | Yellow | 16.30 ± 6.06 (109%) | 13.43 ± 4.52 (109%) |
     | Purple | 17.21 (115%) | 14.68 (119%) |
     | Red | 17.47 (117%) | 14.97 (121%) |
     | Turquoise | 17.59 (118%) | 14.54 (118%) |
     | Grey | 18.05 (121%) | 16.03 (130%) |
     | Blue | 19.42 (130%) | 16.24 (132%) |
     | Green | 19.42 (130%) | 16.45 (133%) |
     | Blue Grey | 21.57 ± 6.93 (145%) | 18.82 ± 6.00 (153%) |

   - **Another likely typo.** The dyslexia-group median for Orange is printed as 20.19. That is the same as Blue Grey's median and inconsistent with Orange's mean of 15.33.
   - **Statistics.**
     - Friedman χ²(9) = 1154.81 overall, 299.16 in the dyslexia group and 859.37 in the control group, all p < 0.001.
     - Follow-up Wilcoxon tests used a Bonferroni correction.
     - In the dyslexia group, Peach was faster than Blue Grey, Green and Blue (all p < 0.001), Grey (p = 0.002), Turquoise (p = 0.026) and Red (p = 0.035).
     - **No standardized effect sizes are reported.** The only measures of size are the percentages above.
   - **No white or off-white background was tested.** The authors list comparing "Peach, Orange and Yellow" with "white or off-white" as future work. They also say the results for cool colors "do not necessarily mean that such colors need to be avoided".
5. **Verdict.** ACCURATE as stated. However, the brief's design rule ("Day uses a subtly warm paper background, not cool or pure white") goes beyond this evidence. Warm beat cool, but warm was never compared with white. Purple and Red, also warm-ish, landed in the middle of the ranking.
6. **Evidence label:** experiment.

**Suggested wording:**

> In an online study of 341 Spanish-speaking adults (89 with dyslexia), black text on peach, orange or yellow backgrounds was read faster than on blue-grey, blue or green. For readers with dyslexia, a 55-word paragraph took 14.9 s on peach versus 21.6 s on blue-grey. White was not tested.

---

## Row 12: Low-vision typefaces and italics

> Brief: "Typefaces built for low vision exist: Atkinson Hyperlegible Next and Mono, from the Braille Institute, under the OFL license. Dyslexia style guidance advises against italics in running text."

### 12a. The Braille Institute font page

1. **Source.** Braille Institute of America, "Read Easier With Our Family of Hyperlegible® Fonts".
   Fetched: https://www.brailleinstitute.org/freefont
2. **Type.** The designer's own page (expert opinion).
3. **Sample.** Not applicable. The page cites no legibility study.
4. **What it says.**
   - The fonts are "designed to improve legibility and readability for individuals with low vision" and are "free for everyone—from personal use to all commercial applications."
   - There are three versions: Atkinson Hyperlegible® (2019), Atkinson Hyperlegible Next® and Atkinson Hyperlegible Mono®.
   - **Next** is "an enhanced font introduced in 2025". It has seven weights (ExtraLight, Light, Regular, Medium, SemiBold, Bold and ExtraBold), each upright and italic, plus a variable version. It has 370 glyphs per style and covers "over 150 languages".
   - **Mono** is "an entirely new typeface inspired by the Atkinson Hyperlegible font", for "table-based and coding environments". It has 373 glyphs per style and a variable version.
   - **The download requires agreeing to the Braille Institute's "End-User License Agreement".** The page doesn't mention the OFL. The font names carry ® marks.
5. **Verdict.** "Built for low vision" and "from the Braille Institute" are ACCURATE.
6. **Evidence label:** expert opinion.

### 12b. License (OFL) and Fontsource packages

Fetched:
- https://fonts.google.com/specimen/Atkinson+Hyperlegible+Next/license. It says "This Font Software is licensed under the SIL Open Font License, Version 1.1", and "Designed by Braille Institute, Applied Design Works, Elliott Scott, Megan Eiswerth, Letters From Sweden".
- https://raw.githubusercontent.com/googlefonts/atkinson-hyperlegible-next/main/OFL.txt (OFL 1.1, "Copyright 2020-2024 The Atkinson Hyperlegible Next Project Authors")
- https://raw.githubusercontent.com/googlefonts/atkinson-hyperlegible-next-mono/main/OFL.txt (OFL 1.1, "Copyright 2020-2024 The Atkinson Hyperlegible Mono Project Authors")
- https://registry.npmjs.org/@fontsource/atkinson-hyperlegible-next/latest
- https://registry.npmjs.org/@fontsource-variable/atkinson-hyperlegible-next/latest
- https://registry.npmjs.org/@fontsource/atkinson-hyperlegible-mono/latest
- https://registry.npmjs.org/@fontsource-variable/atkinson-hyperlegible-mono/latest

Neither OFL.txt file declares a Reserved Font Name.

All four packages exist. All four share these values:

- Latest version 5.3.0, published 2026-07-19.
- License OFL-1.1.
- Styles normal and italic.
- Subsets latin and latin-ext.

Where they differ:

| Package | Weights | CSS family | Source font version |
|---|---|---|---|
| `@fontsource/atkinson-hyperlegible-next` | 200–800 (7 static) | "Atkinson Hyperlegible Next" | v7 |
| `@fontsource-variable/atkinson-hyperlegible-next` | `wght` axis, 200–800 | "Atkinson Hyperlegible Next Variable" | v7 |
| `@fontsource/atkinson-hyperlegible-mono` | 200–800 (7 static) | "Atkinson Hyperlegible Mono" | v8 |
| `@fontsource-variable/atkinson-hyperlegible-mono` | `wght` axis, 200–800 | "Atkinson Hyperlegible Mono Variable" | v8 |

Import paths, from the READMEs:
- Static packages: `@fontsource/<pkg>/400.css` and `@fontsource/<pkg>/400-italic.css`.
- Variable packages: `@fontsource-variable/<pkg>/wght.css` and `@fontsource-variable/<pkg>/wght-italic.css`.

**Verdict.** "Under the OFL" is ACCURATE for the Google Fonts and Fontsource releases. The Braille Institute's own zip comes with its own EULA, so cite the Google Fonts release (or Fontsource) as the source of the OFL.

### 12c. British Dyslexia Association: *Dyslexia Style Guide*

1. **Source.** British Dyslexia Association, *Dyslexia Style Guide* (2023 edition).
   Fetched:
   - The BDA resources page, which lists "BDA Style Guide" but shows no link: https://www.bdadyslexia.org.uk/resources
   - Full text of the 2023 guide, from a third-party copy that carries the BDA charity footer: https://www.wordwisedyslexia.com/_files/ugd/5e0f03_86eab40dc64d42c1895fe24ea5615f97.pdf
   - The BDA's own copy at https://cdn.bdadyslexia.org.uk/uploads/documents/Advice/style-guide/BDA-Style-Guide-2023.pdf returned HTTP 500.
   - https://www.bdadyslexia.org.uk/advice/employers/creating-a-dyslexia-friendly-workplace/dyslexia-friendly-style-guide returned HTTP 404.
   - I couldn't confirm a working BDA-hosted URL. Cite it as "British Dyslexia Association (2023), *Dyslexia Style Guide*, via bdadyslexia.org.uk/resources".
2. **Type.** Guideline (expert opinion).
3. **Sample.** Not applicable.
4. **What it says.**
   - On italics: "Avoid Underlining and italics as this can make the text appear to run together and cause crowding. Use bold for emphasis."
   - Other items relevant to Fovea:
     - "Use dark coloured text on a light (not white) background."
     - "Consider alternatives to white backgrounds … White can appear too dazzling. Use cream or a soft pastel colour."
     - "Avoid green and red/pink, as these colours are difficult for those who have colour vision deficiencies".
5. **Verdict.** ACCURATE. The guide advises avoiding italics in general, not only in running text.
6. **Evidence label:** expert opinion.

### Row 12 verdict: ACCURATE, with nuance

**Suggested wording:**

> Typefaces designed for low-vision readers exist: Atkinson Hyperlegible Next and Atkinson Hyperlegible Mono, from the Braille Institute. They are free, and the Google Fonts and Fontsource releases are under the SIL Open Font License 1.1. The British Dyslexia Association's style guide advises avoiding italics and underlining, and using bold for emphasis.

---

## Color-science reference data

### (a) OKLab (Björn Ottosson)

**Source.** Björn Ottosson, "A perceptual color space for image processing". Fetched: https://bottosson.github.io/posts/oklab/

- Oklab was introduced in 2020.
- The post says: "The matrices were updated 2021-01-25. The new matrices have been derived using a higher precision sRGB matrix and with exactly matching D65 values."
- The code is public domain, or MIT if preferred.

**XYZ → Oklab.** The post specifies XYZ "with a D65 whitepoint and white as Y=1". The steps are:

1. (l, m, s) = M1 · (X, Y, Z)
2. l′ = l^(1/3), m′ = m^(1/3), s′ = s^(1/3)
3. (L, a, b) = M2 · (l′, m′, s′)

```
M1 = [ +0.8189330101  +0.3618667424  -0.1288597137
       +0.0329845436  +0.9293118715  +0.0361456387
       +0.0482003018  +0.2643662691  +0.6338517070 ]

M2 = [ +0.2104542553  +0.7936177850  -0.0040720468
       +1.9779984951  -2.4285922050  +0.4505937099
       +0.0259040371  +0.7827717662  -0.8086757660 ]
```

**Note:** the post's M1 converts **XYZ** to LMS, not linear sRGB to LMS. For linear sRGB, the post gives a combined matrix in its C++ code, followed by the same M2:

```
linear sRGB → Oklab:
l = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b
m = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b
s = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b
l_ = cbrt(l); m_ = cbrt(m); s_ = cbrt(s)
L = 0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_
a = 1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_
b = 0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_
```

```
Oklab → linear sRGB:
l_ = L + 0.3963377774*a + 0.2158037573*b
m_ = L - 0.1055613458*a - 0.0638541728*b
s_ = L - 0.0894841775*a - 1.2914855480*b
l = l_^3; m = m_^3; s = s_^3
r = +4.0767416621*l - 3.3077115913*m + 0.2309699292*s
g = -1.2684380046*l + 2.6097574011*m - 0.3413193965*s
b = -0.0041960863*l - 0.7034186147*m + 1.7076147010*s
```

**Table of example XYZ and Oklab pairs.** The post says it is "Provided to test Oklab implementations. Computed by transforming the XYZ coordinates to Oklab and rounding to three decimals."

| X | Y | Z | L | a | b |
|---|---|---|---|---|---|
| 0.950 | 1.000 | 1.089 | 1.000 | 0.000 | 0.000 |
| 1.000 | 0.000 | 0.000 | 0.450 | 1.236 | -0.019 |
| 0.000 | 1.000 | 0.000 | 0.922 | -0.671 | 0.263 |
| 0.000 | 0.000 | 1.000 | 0.153 | -1.415 | -0.449 |

Computed: running M1 and M2 (with a sign-preserving cube root) on these four XYZ inputs reproduces all four rows to 3 decimals.

### (b) McCamy 1992 CCT approximation

- **Citation.** McCamy CS. (1992). Correlated color temperature as an explicit function of chromaticity coordinates. *Color Research & Application* 17(2):142–144. doi:10.1002/col.5080170211. An erratum, doi:10.1002/col.5080180222, is cited by Wikipedia; I did not fetch it.
  - The abstract (via Crossref) says it is "derived from the fact that the isotemperature lines for CCTs of principle interest nearly converge toward a point on the chromaticity diagram and the assumption that CCT may be represented by a third‐order polynomial function of the reciprocal of the slope of the line from that point to the chromaticity of the light."
  - Fetched:
    - https://api.crossref.org/works/10.1002/col.5080170211
    - https://en.wikipedia.org/wiki/Correlated_color_temperature
    - https://raw.githubusercontent.com/colour-science/colour/develop/colour/temperature/mccamy1992.py
    - https://en.wikipedia.org/wiki/Color_temperature timed out.
- **Formula, as implemented in colour-science:**

  ```
  n   = (x − 0.3320) / (y − 0.1858)
  CCT = −449·n³ + 3525·n² − 6823.3·n + 5520.33
  ```

  Here (x, y) are CIE 1931 chromaticity coordinates, and (0.3320, 0.1858) is the "epicenter" where the lines of constant CCT nearly meet. The colour-science docstring gives `xy_to_CCT_McCamy1992([0.31270, 0.32900])` = 6505.08 K.
- **Equivalent form:**

  ```
  n   = (x − 0.3320) / (0.1858 − y)
  CCT = 449·n³ + 3525·n² + 6823.3·n + 5520.33
  ```

- **Wikipedia's error.** The Correlated color temperature article prints the negative-sign polynomial with "n = (x − xₑ)/(yₑ − y)", which mixes the two forms. Computed results:

  | Illuminant (x, y) | Correct forms | Wikipedia as printed |
  |---|---|---|
  | D65 (0.31271, 0.32902) | 6504.4 K | 4664 K |
  | A (0.44757, 0.40745) | 2857.3 K | 10100 K |
  | D50 (0.34567, 0.35850) | 5002.1 K | 6083 K |

  Don't copy the Wikipedia version.
- **Range and accuracy (Wikipedia):** "The maximum absolute error for color temperatures ranging from 2856 K (illuminant A) to 6504 K (D65) is under 2 K." The formula is meant for near-daylight colors and isn't valid far from the Planckian locus.

### (c) The Planckian locus in CIE 1960 (u, v): Krystek 1985, and Duv

**Citation.** Krystek M. (1985). An algorithm to calculate correlated colour temperature. *Color Research & Application* 10(1):38–40. doi:10.1002/col.5080100109.
- Crossref gives March 1985 for the print issue; Wikipedia says January 1985.
- The abstract describes "a rational Chebyshev approximation of the Planckian locus in the CIE 1960 UCS diagram and a bisection procedure."
- Fetched: https://api.crossref.org/works/10.1002/col.5080100109 and https://en.wikipedia.org/wiki/Planckian_locus

**Coefficients.** From Wikipedia, citing Krystek; T is in kelvin:

```
ū(T) = (0.860117757 + 1.54118254e-4·T + 1.28641212e-7·T²) / (1 + 8.42420235e-4·T + 7.08145163e-7·T²)
v̄(T) = (0.317398726 + 4.22806245e-5·T + 4.20481691e-8·T²) / (1 − 2.89741816e-5·T + 1.61456053e-7·T²)
```

**Valid range.** "Accurate to within |u − ū| < 8×10⁻⁵ and |v − v̄| < 9×10⁻⁵ for 1000 K < T < 15 000 K."

**Coordinates.** CIE 1960 u = 4x/(−2x + 12y + 3) and v = 6y/(−2x + 12y + 3) (Wikipedia's CCT article). This equals (u′, ⅔v′).

**Duv: definition and sign.**
- ANSI C78.377-2008, full text via search: https://ptacts.uspto.gov/ptacts/public-informations/petitions/1553636/download-documents?artifactId=uT6ZhRErO6Ggr0AebIdnW7bjhgs_wpt-_GXHf5vg37F2KTPDAteY72g
- It says: "'Duv' is defined in this document as the closest distance from the Planckian locus on the (u', 2/3 v') diagram, with + sign for above and - sign for below the Planckian locus."
- It notes that the CIE does not officially define such a distance.
- Wikipedia's CCT article agrees: Δuv is "positive for points above the locus".

**Duv: how positive and negative values look.**
- Source: Ohno Y, Oh S (2016), "Vision experiment II on white light chromaticity for lighting", Proc. CIE Lighting Quality & Energy Efficiency (CIE x042:2016), NIST, 21 subjects. Fetched via search: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=920454
- It describes shifts off the locus as "(yellowish/pinkish shift)", and says "Duv= 0.02 was too yellowish" and "Duv= -0.03 was too pinkish".
- So positive Duv (above the locus) looks yellowish to greenish, and negative Duv (below) looks pinkish to magenta. "Greenish" for positive values appears in secondary sources such as https://metricgate.com/docs/planckian-locus-duv/ (via search); NIST's own word is "yellowish".
- Lights at Duv ≈ −0.015 "appeared the most natural at all correlated color temperatures". The 2013 NIST experiment, with 18 subjects, found the same.

**Ohno 2014.** Ohno Y. (2014). Practical use and calculation of CCT and Duv. *LEUKOS* 10(1):47–55. doi:10.1080/15502724.2014.839020. Published online 2013-10-18.
- Fetched: https://api.crossref.org/works/10.1080/15502724.2014.839020 and https://www.nist.gov/publications/practical-use-and-calculation-cct-and-duv
- The abstract says "Duv is defined in ANSI C78.377 for this purpose". The paper's calculation methods are accurate "within an error of 1 K … from 1000 K to 20000 K in CCT and -0.03 to 0.03 in Duv."
- I did not read the full text.

**The tolerance for "white".** ANSI C78.377-2008, Table 1 gives the target Duv and tolerance for each nominal CCT:

| Nominal CCT | Target Duv |
|---|---|
| 2700, 3000, 3500 K | 0.000 ± 0.006 |
| 4000, 4500 K | 0.001 ± 0.006 |
| 5000, 5700 K | 0.002 ± 0.006 |
| 6500 K | 0.003 ± 0.006 |

- For "flexible" CCTs (2700–6500 K in 100 K steps), the target is Duv = 57700·(1/T)² − 44.6·(1/T) + 0.0085, still ± 0.006.
- The tolerance areas "correspond approximately to those of 7-step MacAdam ellipses."
- The standard says the target Duv rises to 0.003 at 6500 K because "the reference daylight (CIE standard illuminant D65) has a Duv of 0.003." This confirms the sign convention. Computed with Krystek: D65 gives CCT ≈ 6506 K and Duv ≈ +0.0033, and Illuminant A gives Duv ≈ 0.0000.
- Later editions keep ±0.006, per Buildings.com (via search): https://www.buildings.com/building-systems-om/lighting/article/55255412/ansi-evaluates-revisions-to-ssl-chromaticity-standard-magazine
- The 2024 edition adds 1800 K and 2000 K, per the ANSI blog (via search): https://blog.ansi.org/ansi/ansi-c78-377-2024-solid-state-lighting/
- I did not read the 2017 or 2024 text.

**The CIE's limit on CCT.** "The concept of correlated color temperature should not be used if the chromaticity of the test source differs more than Δuv = 5×10⁻² from the Planckian radiator." Source: Wikipedia's CCT article, quoting Schanda (2007).

---

## What this changes in the Fovea brief

1. **Row 4.** Rewrite the chromostereopsis clause: the main cause is transverse chromatic aberration, and its direction varies between people. The design rules don't change.
2. **Row 9 and §4.5.**
   - Machado's "tritan 1.0" matrix is tritanomaly. Simulate tritanopia with Brettel et al. 1997, or label the check "tritanomaly (Machado)".
   - culori's `filterDeficiency*` functions run on gamma-encoded sRGB. To match the brief's "applied in linear RGB", convert to `lrgb` and multiply manually.
   - SVG `feColorMatrix` runs in linear RGB by default; CSS filter functions use sRGB.
3. **Row 10.** Rello & Bigham never tested white, so they don't support "warm, not pure white". The BDA guide does recommend a "light (not white)" background and "cream or a soft pastel colour", but that is expert opinion.
4. **Row 12.** Cite the Google Fonts or Fontsource release as the source of the OFL; the Braille Institute's own download is under its own EULA. The names carry ® marks, so don't ship modified builds under the Atkinson name.
5. **Reference code.**
   - Use McCamy with n = (x − 0.3320)/(y − 0.1858).
   - Use Krystek only within 1000–15000 K.
   - Duv is positive above the locus (yellowish to greenish) and negative below it (pinkish).
   - ANSI's tolerance for white lamps is ±0.006.
