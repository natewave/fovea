# Group D verification: blue light & sleep, digital eye strain, syntax highlighting

*Fovea research-brief check, compiled 2026-10-14. Every fact below was read on a page fetched in this session; the URLs are listed for each source. Quotes are verbatim from those pages.*

## Summary

| Row | Verdict | What needs fixing |
|---|---|---|
| 7: Blue light & sleep | PARTLY ACCURATE | Cochrane says filtering lenses *may* not help eye strain (low certainty), not "probably". The brief's Cochrane author list is wrong. The 2025 actigraphy meta-analysis is tiny (3 trials, 49 people). Melanopic EDI depends on the light's colour as well as its amount. |
| 8: Digital eye strain | PARTLY ACCURATE (only one item needs work) | TFOS's "brightness" item compares screens with paper, not the screen with the room. Room-matching advice rests on expert advice plus cross-sectional data. The 20-20-20 study is small and uncontrolled (29 people). |
| 11: Syntax highlighting | ACCURATE (minor precision fixes) | Say "no evidence of a comprehension gain" rather than "no gain". The eye-tracking reading study had only 34 students and was underpowered. Healey's result is about 5 colours reliably, up to 7 if carefully chosen. |

**Access notes.**

- pubmed.ncbi.nlm.nih.gov returned HTTP 403 to the fetch tool, so PubMed records were read through NCBI's official E-utilities API.
- cochranelibrary.com returned HTTP 412. The Cochrane abstract was read via the Semantic Scholar API and its metadata via Crossref.
- doi.org returned HTTP 406 for Elsevier, so the TFOS full text was read from the TFOS-hosted PDF (CC BY).
- Some PDFs were retrieved through the search tool's full-text extraction; these are marked "(via search tool)".
- Healey's 1996 conference PDF couldn't be opened: the fetch tool doesn't read PDFs and the sandbox blocked a direct download. Its key number was verified in Healey's 1996 PhD thesis, which reports the same experiments.

---

## Row 7: Blue light, sleep and evening light

**Claim in brief:** "Blue-light-filtering lenses probably don't reduce computer eye strain, and their effect on sleep is inconclusive. A 2025 meta-analysis found no significant effect on sleep measured by actigraphy. Evening light still matters for circadian timing. The consensus target is <= 10 lux melanopic EDI (a measure of how strongly light drives the body clock) at the eye during the 3 hours before bed, and that depends mostly on how much light reaches the eye. Melanopsin, the pigment involved, is most sensitive around 480–490 nm (cyan-blue)."

**Row verdict: PARTLY ACCURATE.** Suggested wording:

> Blue-light-filtering glasses may not reduce computer eye strain (low-certainty evidence from short trials), and whether they help sleep is unknown. A small 2025 meta-analysis (3 trials, 49 adults, about a week each) found no significant effect on sleep measured with wrist activity monitors. Evening light still matters for the body clock. An expert consensus recommends at most 10 lux melanopic EDI at eye level from 3 hours before bedtime. (Melanopic EDI measures how strongly light stimulates the eye's clock-setting melanopsin cells.) That number depends on both how much light reaches your eyes and its colour: dimmer, warmer light gives less. Melanopsin itself is most sensitive near 480 nm, shifting to about 490 nm (cyan-blue) once light has passed through the eye's lens.

### 7a. Cochrane review: blue-light-filtering spectacle lenses

1. **Citation.** Singh S, Keller PR, Busija L, McMillan P, Makrai E, Lawrenson JG, Hull CC, Downie LE (2023). *Blue-light filtering spectacle lenses for visual performance, sleep, and macular health in adults.* Cochrane Database of Systematic Reviews, Issue 8, Art. No. CD013244. DOI [10.1002/14651858.CD013244.pub2](https://doi.org/10.1002/14651858.CD013244.pub2); PMID 37593770; published 18 Aug 2023.
   - **Citation error in brief:** "Singh, Downie & Anderson 2023" is wrong. No author is named Anderson; the eight authors are listed above, with Singh first and Downie last. The title also says "spectacle lenses", not "spectacles".
   - Fetched:
     - `https://api.semanticscholar.org/graph/v1/paper/DOI:10.1002/14651858.CD013244.pub2?fields=title,authors,year,venue,abstract,externalIds` (full abstract)
     - `https://api.crossref.org/works/10.1002/14651858.CD013244.pub2` (authors, issue, date)
     - `https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD013244.pub2/full` (HTTP 412, blocked). The Cochrane abstract-page text (…/abstract) also appeared in a search result and matched.
2. **Study type.** Cochrane systematic review of randomised controlled trials, with GRADE certainty ratings. There was no meta-analysis, "due to lack of available quantitative data, heterogenous study populations, and differences in intervention follow-up periods".
3. **Sample.** 17 RCTs, "sample sizes ranging from five to 156 participants", with follow-up "from less than one day to five weeks". Participants ranged from healthy adults to people with mental-health and sleep disorders. Searches ran to 22 Mar 2022.
4. **Key results.**
   - **Eye strain:** "There may be no difference in subjective visual fatigue scores … at less than one week of follow-up (low-certainty evidence)". One RCT reported a mean difference (MD) of 9.76 units (worse symptoms), 95% CI −33.95 to 53.47; 120 participants.
   - **Critical flicker-fusion:** "little to no difference" (MD −1.13 Hz, 95% CI −3.00 to 0.74; 120 participants; low certainty).
   - **Visual acuity:** "probably little or no effect" (MD 0.00 logMAR, 95% CI −0.02 to 0.02; 156 participants; moderate certainty).
   - **Sleep:** "We do not know if blue-light filtering spectacle lenses are equivalent or superior … with respect to sleep quality (very low-certainty evidence)". Across six RCTs (148 participants), three found an improvement and three found no difference.
   - **Conclusion:** lenses "may not attenuate symptoms of eye strain with computer use, over a short-term follow-up period", and sleep effects were "indeterminate".
   - **Risk of bias:** no study was at low risk of bias in all seven domains; 65% were at high risk of detection bias.
5. **Verdict: PARTLY ACCURATE.** "Probably don't reduce computer eye strain" overstates the certainty. In this review's own wording, "probably" is reserved for the moderate-certainty finding (visual acuity), while the low-certainty eye-strain finding gets "may". "Effect on sleep is inconclusive" is accurate. **Correct wording:** "Blue-light-filtering glasses may not reduce computer eye strain (low-certainty evidence, short trials); their effect on sleep is unknown (very low-certainty evidence)."
6. **Evidence strength:** systematic review.

### 7b. PubMed 41341515: what it actually is

1. **Citation.** Luna-Rangel FA, Gonzalez-Bedolla B, Salazar-Ortega MJ, Torres-Mancilla XM, Martinez-Cadena S (2025). *Efficacy of blue-light blocking glasses on actigraphic sleep outcomes: a systematic review and meta-analysis of randomized controlled crossover trials.* Frontiers in Neurology 16:1699303. DOI [10.3389/fneur.2025.1699303](https://doi.org/10.3389/fneur.2025.1699303); PMID 41341515; PMC12668929; e-published 18 Nov 2025; PROSPERO CRD420251034611.
   - Fetched:
     - `https://pubmed.ncbi.nlm.nih.gov/41341515/` (HTTP 403, blocked)
     - `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=41341515&retmode=xml` (full PubMed record)
     - `https://pmc.ncbi.nlm.nih.gov/articles/PMC12668929/` (full text)
2. **Study type.** Systematic review and meta-analysis of randomised crossover trials.
3. **Sample.** "Three double-blind crossover RCTs (n = 49)":
   - Shechter et al. 2018: 14 adults with chronic insomnia symptoms.
   - Knufinke et al. 2019: 15 recreational athletes.
   - Bigalke et al. 2021: 20 healthy adults.

   All compared amber with clear lenses, worn for 2 h or 3 h before bed (or from 6 pm) over 7–9 nights. The search ran to 31 Mar 2025 and found 19 records.
4. **Key results.**
   - Sleep-onset latency: MD −4.86 min (95% CI −20.23 to 10.52; p = 0.54).
   - Total sleep time: MD +8.75 min (95% CI −35.31 to 52.82; p = 0.70).
   - Sleep efficiency: MD −0.61 (95% CI −7.58 to 6.35; p = 0.86).
   - Wake after sleep onset: MD −1.47 (95% CI −14.94 to 11.99; p = 0.83). Heterogeneity I² = 0%.
   - Conclusion: "BBGs may provide small improvements in sleep, but current evidence from RCTs does not support significant effects."
   - Stated limitations: small samples, interventions of about 1 week, mostly normal sleepers, and "none of the studies reported the actual melanopic light exposure at the eye".
5. **Verdict: ACCURATE**, but it needs a size caveat. With very wide confidence intervals, three small trials can neither confirm nor rule out a modest effect. **Suggested wording:** "A small 2025 meta-analysis (3 trials, 49 adults, about a week each) found no significant effect on sleep measured with wrist activity monitors."
6. **Evidence strength:** systematic review (small).

### 7c. Brown et al. 2022: consensus light-exposure recommendations

1. **Citation.** Brown TM, Brainard GC, Cajochen C, Czeisler CA, Hanifin JP, Lockley SW, Lucas RJ, Münch M, O'Hagan JB, Peirson SN, Price LLA, Roenneberg T, Schlangen LJM, Skene DJ, Spitschan M, Vetter C, Zee PC, Wright KP Jr (2022). *Recommendations for daytime, evening, and nighttime indoor light exposure to best support physiology, sleep, and wakefulness in healthy adults.* PLoS Biology 20(3):e3001571. DOI [10.1371/journal.pbio.3001571](https://doi.org/10.1371/journal.pbio.3001571); published 17 Mar 2022. The brief's citation is correct.
   - Fetched: `https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.3001571` (full text).
2. **Study type.** Expert consensus from the Second International Workshop on Circadian and Neurophysiological Photometry (2019; 18 authors; iterative voting). It is grounded in pooled laboratory dose–response data on melatonin suppression, circadian phase shifting and alertness.
3. **Population.** Not a trial. The recommendations apply to "healthy adults (aged 18 to 55) with regular daytime schedules".
4. **Key content.**
   - **Evening:** "During the evening, starting at least 3 hours before bedtime, the recommended maximum melanopic EDI is 10 lux measured at the eye in the vertical plane approximately 1.2 m height. To help achieve this, where possible, the white light should have a spectrum depleted in short wavelengths close to the peak of the melanopic action spectrum." The Figure 2 legend phrases it as "melanopic EDI <10 lux".
   - **Daytime and sleep:** at least 250 lux melanopic EDI at the eye during the day; at most 1 lux in the sleep environment.
   - **Feasibility:**
     - Evening home illuminance is "commonly reported in the order of 30 lux".
     - "Many commonly used domestic warm white (2,700 to 3,000 K) LEDs already have a melanopic DER sufficiently low (<0.35 …) to meet our target while maintaining an illuminance of approximately 30 lux."
     - One home study found melanopic EDI already at or below 10 lux "in nearly 50% of occasions".
   - **Melanopsin peak:** melanopsin "is maximally sensitive … (λmax ≈ 480 nm before accounting for filtering through the lens and ocular media)". The melanopic action spectrum has "peak sensitivity at 490 nm, following prereceptoral filtering appropriate for a 32-year-old observer" (Fig 1).
   - **Definition:** melanopic EDI is the illuminance of standard D65 daylight that would produce the same melanopsin photon capture.
   - **Conflicts of interest:** several authors have industry ties (lighting companies, f.lux and others), all disclosed in the paper.
5. **Verdict.**
   - "≤10 lux melanopic EDI at the eye during the 3 hours before bed": **ACCURATE.** Strictly, it is a maximum of 10 lux from at least 3 h before bedtime, measured vertically at seated eye height.
   - "Evening light still matters for circadian timing": **ACCURATE.**
   - "(a measure of how strongly light drives the body clock)": an acceptable lay gloss. Strictly, it measures melanopsin stimulation, which the paper says approximates clock responses "under most practically relevant situations".
   - "and that depends mostly on how much light reaches the eye": **PARTLY ACCURATE / not supported.** If the point is that the target is measured at the eye rather than at the lamp or screen, that is correct. But the paper never says intensity matters more than colour: melanopic EDI depends on intensity and spectrum, and the recommendation itself asks for short-wavelength-depleted light. **Correct wording:** "which depends on both how much light reaches the eye and its colour (dimmer and warmer means lower)."
6. **Evidence strength:** expert opinion (international consensus built on lab dose–response data).

### 7d. Melanopic action-spectrum peak (CIE S 026:2018)

1. **Citations and URLs.**
   - **CIE (2018).** *CIE System for Metrology of Optical Radiation for ipRGC-Influenced Responses to Light.* CIE S 026/E:2018. Fetched the product page: `https://www.cie.co.at/publications/cie-system-metrology-optical-radiation-iprgc-influenced-responses-light-0`. The page says only that the melanopsin photoreceptor "has a peak sensitivity in the shorter wavelength part of the visible spectrum". The tabulated spectra are sold with the standard, so no numeric peak could be read from CIE itself.
   - **Brown et al. 2022 (7c), Fig 1.** The melanopic curve has "peak sensitivity at 490 nm" and is "plotted from the tabulated values provided in the CIE S026 standard". The pigment's λmax is ≈480 nm before ocular filtering.
   - **Schlangen LJM, Price LLA (2021).** *The Lighting Environment, Its Metrology, and Non-visual Responses.* Frontiers in Neurology 12:624861. DOI [10.3389/fneur.2021.624861](https://doi.org/10.3389/fneur.2021.624861). Fetched: `https://pmc.ncbi.nlm.nih.gov/articles/PMC7970181/`. Quotes:
     - "melanopsin photoreception occurs efficiently across the short wavelength range of the visible spectrum between 420 and 560 nm, with a peak sensitivity in vivo at ~490 nm"
     - "The CIE standard adopts the same melanopsin action spectrum as the Lucas et al. authors."
   - **Mao et al. 2025 (N3 below):** "the peak sensitivity of melanopsin is at 479 nm … after accounting for lens filtering in a 32-year-old individual, the spectral sensitivity shifts to approximately 490 nm."
2. **Study type.** International standard plus peer-reviewed physiology and metrology reviews.
3. **Sample.** n/a.
4. **Key results.** The pigment peaks at ≈479–480 nm. Measured at the cornea, after lens filtering for a standard 32-year-old observer, the CIE melanopic function peaks at ≈490 nm. Sensitivity is broad (≈420–560 nm).
5. **Verdict: ACCURATE.** "480–490 nm (cyan-blue)" correctly spans the pigment peak and the eye-level CIE curve. Optional precision: "the pigment peaks near 480 nm; at the eye (after the lens) the standard curve peaks near 490 nm."
6. **Evidence strength:** mechanism.

---

## Row 8: Digital eye strain

**Claim in brief:** "Digital eye strain has many causes: reduced and incomplete blinking, uncorrected refractive error, binocular vision problems, cognitive load, glare, and a mismatch between screen and room brightness. Software reminders to take 20-20-20 breaks reduced symptoms over 2 weeks, but the gains faded a week after the reminders stopped."

**Row verdict: PARTLY ACCURATE.** Only the screen-versus-room item needs work. Suggested wording:

> Digital eye strain has many causes: blinking less often and less completely, uncorrected vision problems (even mild astigmatism), trouble with how the two eyes work together, mental effort, and glare. A screen much brighter or dimmer than the room may also contribute, though that evidence is weaker and mostly survey-based. In a small study of 29 people with eye-strain symptoms and no control group, software reminders to take 20-20-20 breaks reduced symptoms over 2 weeks. A week after the reminders stopped, symptoms were no longer clearly better than before.

### 8a. TFOS Lifestyle report: impact of the digital environment

1. **Citation.** Wolffsohn JS, Lingham G, Downie LE, Huntjens B, Inomata T, Jivraj S, Kobia-Acquah E, Muntz A, Mohamed-Noriega K, Plainis S, Read M, Sayegh RR, Singh S, Utheim TP, Craig JP (2023). *TFOS Lifestyle: Impact of the digital environment on the ocular surface.* The Ocular Surface 28:213–252. DOI [10.1016/j.jtos.2023.04.004](https://doi.org/10.1016/j.jtos.2023.04.004); PMID 37062428; e-published 14 Apr 2023; licence CC BY 4.0. The brief's citation is correct.
   - Fetched:
     - `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=37062428,35963776&retmode=text&rettype=abstract` (abstract)
     - `https://www.sciencedirect.com/science/article/pii/S1542012423000307` (abstract only)
     - `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:37062428%20AND%20SRC:MED&resultType=core&format=json` (metadata, licence)
     - Full text: `https://www.tearfilm.org/ckfinder/userfiles/files/Digital%20environment.pdf` (via search tool)
     - `https://doi.org/10.1016/j.jtos.2023.04.004` returned HTTP 406.
2. **Study type.** International expert consensus report from the Tear Film & Ocular Surface Society (TFOS), with an embedded systematic review of management trials.
3. **Sample.** n/a (covers the whole literature).
4. **Key content.**
   - **Mechanisms (abstract):** "mainly reduced blink rate and completeness, partial/uncorrected refractive error and/or underlying binocular vision anomalies, together with the cognitive demand of the task and differences in position, size, brightness and glare compared to an equivalent non-digital task."
   - **Prevalence and diagnosis:** "Digital eye strain prevalence of up to 97% has been reported", a figure inflated by the lack of an agreed definition. Blink rate and critical flicker frequency "are not 'diagnostic' of digital eye strain".
   - **Management:** "patients experiencing digital eye strain should be provided with a full refractive correction for the appropriate working distances. Improving blinking, optimizing the work environment and encouraging regular breaks may help." Also: "Based on current, best evidence, blue-light blocking interventions do not appear to be an effective management strategy."
   - **Blinking (full text):**
     - One study: "3.6 blinks/min when reading on a computer screen as compared to 18.4 blinks/min when at rest".
     - In office workers: "7 blinks/min when reading on a computer screen, compared to 22 blinks/min when relaxed, or 10 blinks/min when reading a book".
     - But when screen and paper were matched for text size, contrast, luminance and viewing angle, 20 min of reading gave "no difference in blink rate between the two media types, … indicating that differences in the cognitive demands may be more important than the medium; however incomplete blinking was higher when reading on digital devices."
     - Blink rate also falls with low resolution, small fonts, low contrast and glare.
   - **Screen versus room (full text):**
     - "…potential benefit of negative polarity, particularly in low ambient light conditions, where it has been suggested that screen brightness should mimic the surrounding light conditions, in order to minimize eye strain".
     - "Adjusting screen brightness in accordance with the ambient light reduced the prevalence of digital eye strain [two cross-sectional studies], but did not influence the severity of symptoms".
   - **Glare:** "One prospective … and three cross-sectional … studies found that reducing glare had a beneficial impact on digital eye strain symptoms".
   - **20/20/20 rule (Section 8.1):** "there has been limited peer-reviewed studies confirming efficacy of the 20/20/20 rule". Of the reminder study (8c): "2 weeks was insufficient to considerably improve binocular vision or dry eye signs and improvements were shortlived."
5. **Verdict on the cause list.**
   - **ACCURATE** for blinking, refractive error, binocular vision, cognitive load and glare.
   - **PARTLY ACCURATE** for "a mismatch between screen and room brightness". TFOS's headline "brightness" item means the screen versus an equivalent paper task. Screen–room matching appears only in the body text, as a suggestion backed by cross-sectional data, where it lowered prevalence but not severity. Either soften the wording (as suggested above) or attribute it to AAO advice (see comfort guide item b).
6. **Evidence strength:** expert opinion (international consensus report; its treatment chapter includes a systematic review).

### 8b. Manna 2026: integrative review

1. **Citation.** Manna P (2026). *From the Ocular Surface to Neurophysiology: An Integrative Review of Digital Eye Strain.* Clinical Optometry 18:1–23. DOI [10.2147/OPTO.S586750](https://doi.org/10.2147/OPTO.S586750); PMID 41804380; PMC12967517; published March 2026. The brief's citation (journal, year, DOI) is correct.
   - Fetched:
     - `https://api.semanticscholar.org/graph/v1/paper/DOI:10.2147/OPTO.S586750?fields=title,authors,year,venue,abstract,externalIds,publicationDate`
     - `https://api.crossref.org/works/10.2147/OPTO.S586750` (volume, pages)
     - `https://pmc.ncbi.nlm.nih.gov/articles/PMC12967517/` (full text)
2. **Study type.** Single-author integrative review: a PRISMA-guided search to 30 Sep 2025, quality appraisal with the Mixed Methods Appraisal Tool (MMAT), and narrative synthesis with no meta-analysis.
3. **Sample.** 128 studies (45 RCTs, 54 non-randomised controlled trials, 28 quantitative descriptive, 1 qualitative), spanning children to people with age-related near-focus loss (presbyopia). The author acknowledges that a single reviewer "cannot rule out the potential for selection or appraisal bias", and that most samples were young healthy adults with short exposures.
4. **Key content.**
   - **Six mechanism domains:** "ocular surface and blink dynamics, accommodation and vergence, musculoskeletal load, device-related optical stress, cognitive load, and neural markers".
   - **Blinking:** "cognitive load reduces the blink rate by approximately 25%–26%, often to 7–10 blinks/min during demanding reading". Fast-paced visual tasks "can suppress the blink rate to approximately 33% of baseline and increase incomplete blinks". Also: "electronic reading increased the incomplete blinks (14.5% vs 5% for print)". In VR headsets, blink rate was ≈10.8 vs 18.0 blinks/min in natural viewing.
   - **Viewing distance:** "symptomatic users adopt closer viewing distances (approximately 30 cm for phones and 56 cm for computers) than asymptomatic users".
   - **Room lighting:** "ambient lighting should be optimized to prevent glare, with guidelines recommending lower ambient illumination (300–500 lux) for modern LED/LCD displays".
   - **Presbyopia:** "low-power additions (+0.75 D) improve reading speed". "VDU-progressive" lenses were rated more suitable for computer work than standard progressives.
   - **Breaks:** supports "micro-break scheduling" and suggests management could move "from fixed schedules (eg every 20 minutes) to objective load monitoring".
5. **Verdict.** Supports the "many causes" framing: blinking, refractive and binocular factors, cognitive load, glare, and device optics. It does not test 20-20-20 itself. The citation is ACCURATE.
6. **Evidence strength:** systematic review (narrative and single-author, so weaker than a meta-analysis).

### 8c. Talens-Estarelles et al. 2023: testing 20-20-20 reminders

1. **Citation.** Talens-Estarelles C, Cerviño A, García-Lázaro S, Fogelton A, Sheppard A, Wolffsohn JS (2023). *The effects of breaks on digital eye strain, dry eye and binocular vision: Testing the 20-20-20 rule.* Contact Lens and Anterior Eye 46(2):101744. DOI [10.1016/j.clae.2022.101744](https://doi.org/10.1016/j.clae.2022.101744); PMID 35963776; e-published 11 Aug 2022. The brief's citation is correct; TFOS cites the e-pub version as "2022;45:101744".
   - Fetched:
     - NCBI E-utilities abstract (URL in 8a)
     - Full text from the Aston repository: `https://publications.aston.ac.uk/id/eprint/44152/1/1_s2.0_S1367048422001990_main.pdf` (via search tool)
     - `https://www.sciencedirect.com/science/article/pii/S1367048422001990` (via search tool)
2. **Study type.** Single-group before–after study: a 2-week run-in with reminders off (software monitoring only), 2 weeks with personalised reminders, then a 1-week online follow-up. There was no control group and no masking ("Cross-over and masking were not possible").
3. **Sample.** 29 symptomatic laptop users completed the study (35 recruited): 9 men and 20 women aged 18–43 (mean 27 ± 7), with self-reported computer use of 7 ± 2 h/day.
4. **Key results.**
   - **Behaviour:** 34 breaks/day with reminders vs 27 without. Continuous work bouts and breaks both got shorter (p = 0.006 and p = 0.015). The paper calls the number of reminder-driven breaks "clinically small (i.e., 3 rule breaks pe[r day])".
   - **Symptoms:** mean ± SD at visit 1 → visit 2 → visit 3 (after 2 weeks of reminders) → visit 4 (1 week after stopping):
     - CVS-Q: 10 ± 4 → 11 ± 4 → 8 ± 4 → 9 ± 4 (p = 0.001).
     - OSDI: 22.88 → 24.64 → 18.95 → 19.96 (p = 0.015).
     - SANDE I severity: 33 → 32 → 26 → 33.
   - **Follow-up:** the improvement "was not maintained one week after discontinuation (p > 0.05)". The discussion adds that week-4 symptoms "were not different from those reported before … yet they were not greater than those observed at visit 3, thus some of the improvement was maintained."
   - **Blinking:** during computer use participants blinked "8–9 blinks/min … vs 16–22 blinks/min when looking in primary gaze". The reminders "had no effects on the blink rate and blink duration … while using the computer".
   - **Clinical signs:** no change in tear-film or ocular-surface signs (p ≥ 0.089). Binocular measures were unchanged except accommodative facility (p = 0.010). OSDI stayed at or above 13, meaning participants were still symptomatic.
   - **Authors' caveat:** "a placebo effect on the results cannot be completely ruled out."
5. **Verdict: ACCURATE** as worded. Add the context that the study was small (29 people), had no comparison group and may include a placebo effect. "Faded" matches the abstract; week-4 scores sat between baseline and the end of the reminder period.
6. **Evidence strength:** experiment (small, uncontrolled).

---

## Row 11: Syntax highlighting

**Claim in brief:** "Syntax highlighting helps, but only modestly: tasks were finished faster, with the benefit shrinking as experience grew (n=10, eye tracking); there was no comprehension gain for 390 novices; reading behavior showed no significant effect. Practitioners argue for highlighting fewer, rarer classes; others point out that coloring keywords helps catch typos. People can tell apart only a handful of colors at a glance."

**Row verdict: ACCURATE (minor precision fixes).** Suggested wording:

> Syntax highlighting seems to help only a little. In a 10-person eye-tracking study, highlighted code was solved about 8 seconds faster, and the benefit shrank with experience. A study of 390 novice students found no evidence that it improved comprehension, and a small eye-tracking study (34 students) found no significant difference in reading patterns. Practitioners argue for colouring fewer, rarer kinds of tokens; others reply that colouring keywords helps you catch typos. Lab experiments suggest people can pick out only about five to seven distinct colours at a glance.

### 11a. Sarkar 2015

1. **Citation.** Sarkar A (2015). *The impact of syntax colouring on program comprehension.* Proceedings of the 26th Annual Workshop of the Psychology of Programming Interest Group (PPIG 2015). University of Cambridge Computer Laboratory. No DOI. The page range is not confirmed; the PDF shows proceedings page markers 54–57.
   - Fetched:
     - `https://advait.org/files/sarkar_2015_syntax_colouring.pdf` (full text, via search tool)
     - `https://ppig.org/files/2015-PPIG-26th-Sarkar1.pdf` (via search tool)
     - PPIG abstract page `https://ppig.org/papers/2015-ppig-26th-sarkar1/` (seen in search results)
2. **Study type.** Controlled, randomised, within-subjects lab experiment with eye tracking.
3. **Sample.** 10 graduate computer-science students with varied Python experience. Three were excluded from the eye-movement analyses because their glasses disrupted tracking. The task was to work out the output of a short Python function in their head, across 3 highlighted/plain task pairs.
4. **Key results.**
   - "Task completion times for highlighted versions of the tasks were significantly lower (WSRT: T = 136, p = 0.047). The difference in medians is 8.4s."
   - Highlighting also brought fewer context switches (median difference 23; T = 13.5, p = 0.045).
   - There was no effect on fixation counts or durations.
   - "programming experience was negatively correlated with time advantage" (trend slope −0.06 on log time advantage). The author notes this "may be a consequence of the brevity of the tasks".
5. **Verdict: ACCURATE.** The sample is tiny and p is barely below 0.05, but "about 8 s faster on short tasks" is a fair lay summary.
6. **Evidence strength:** experiment (very small).

### 11b. Hannebauer, Hesenius & Gruhn 2018

1. **Citation.** Hannebauer C, Hesenius M, Gruhn V (2018). *Does syntax highlighting help programming novices?* Empirical Software Engineering 23(5):2795–2828. DOI [10.1007/s10664-017-9579-0](https://doi.org/10.1007/s10664-017-9579-0); online 28 Feb 2018; also presented as an ICSE 2018 journal-first paper. The brief's citation is correct.
   - Fetched:
     - `https://dl.acm.org/doi/10.1007/s10664-017-9579-0` (abstract, via search tool)
     - `https://api.semanticscholar.org/graph/v1/paper/DOI:10.1007/s10664-017-9579-0?fields=…` (bibliographic data; full text marked closed)
     - `https://conf.researchr.org/details/icse-2018/icse-2018-Journal-first-papers/13/Does-Syntax-Highlighting-Help-Programming-Novices-` (via search tool)
   - The full text was not obtained, so facts below come from the abstract only.
2. **Study type.** Controlled experiment, within-subject: each student got some tasks with highlighting and some without.
3. **Sample.** 390 undergraduates in an introductory Java course.
4. **Key results.**
   - "We measured the correctness with which they solved small coding tasks."
   - "The data provided no evidence that syntax highlighting improves novices' ability to comprehend source code."
   - "One major limitation may be the types of tasks chosen for this experiment."
   - "The results suggest that syntax highlighting squanders a feedback channel from the IDE to the programmer that can be used more effectively."
5. **Verdict: ACCURATE**, with one wording fix: "no evidence of a comprehension gain (task correctness) in 390 novices". Absence of evidence is not proof of no effect, and according to the abstract, speed was not the outcome measured.
6. **Evidence strength:** experiment.

### 11c. Beelders & du Plessis 2016

1. **Citation.** Beelders TR, du Plessis J-PL (2016). *Syntax highlighting as an influencing factor when reading and comprehending source code.* Journal of Eye Movement Research 9(1):1, pp. 1–11. DOI [10.16910/jemr.9.1.1](https://doi.org/10.16910/jemr.9.1.1); published online 18 Dec 2015. The brief's citation is correct (journal year 2016, online in late 2015).
   - Fetched:
     - `https://bop.unibe.ch/JEMR/article/view/2429` (abstract, via search tool)
     - `https://bop.unibe.ch/JEMR/article/download/2429/3623/8674` (full text, via search tool)
     - `https://www.mdpi.com/1995-8692/9/1/1` (via search tool)
2. **Study type.** Randomised between-groups eye-tracking experiment (Tobii TX-300).
3. **Sample.** 34 IT students (mean age 21.7), 17 per group (colour vs black-and-white). They read two C# snippets and wrote down each program's output.
4. **Key results.**
   - "Number of fixations, fixation durations and regressions were all higher for black-and-white code than for colour code but not significantly so." For example, snippet 1 drew 1456.1 vs 974.5 fixations (U = 99.0, p = 0.12).
   - Students rated colour code easier to read and nicer to look at, but not significantly (readability p = 0.07).
   - Post-hoc power was low (0.06–0.63), and the authors suggest repeating the study with a larger sample.
5. **Verdict: ACCURATE** ("no significant effect on reading behaviour"). Add that the study was small and underpowered, and its trends favoured colour.
6. **Evidence strength:** experiment (small).

### 11d. Tonsky 2025: blog post

1. **Citation.** Tonsky (2025). *I am sorry, but everyone is getting syntax highlighting wrong.* tonsky.me, 15 Oct 2025 (date from the blog index). URL: https://tonsky.me/blog/syntax-highlighting/
   - Fetched: `https://tonsky.me/blog/syntax-highlighting/` (full post) and `https://tonsky.me/` (index listing "10/15" under 2025).
2. **Study type.** Practitioner blog: opinion with visual examples.
3. **Sample.** n/a.
4. **Key points.**
   - "If everything is highlighted, nothing is highlighted."
   - "Limit the number of different colors to what you can remember." His Alabaster theme uses four colours: strings, constants, comments and top-level definitions.
   - On what deserves colour: "Something there isn't a lot of." And: "Highlight names and constants. Grey out punctuation. Don't highlight language keywords."
   - "Comments should be highlighted, not hidden away."
   - "Our eyes are way more sensitive to differences in lightness than in color".
   - He argues against bold and italics and against equal-lightness palettes, and suggests coloured backgrounds for light themes.
   - His `retunr` example claims readers don't notice when a keyword's colour changes.
   - One claim is unsourced: "Per statistics, 70% of developers prefer dark themes."
5. **Verdict: ACCURATE** for "practitioners argue for highlighting fewer, rarer classes".
6. **Evidence strength:** expert opinion.

### 11e. Hacker News discussion of the Tonsky post

1. **Citation.** "Getting syntax highlighting wrong", Hacker News item 45596960, submitted by robenkleene on 15 Oct 2025; 216 points, 141 comments. URL: https://news.ycombinator.com/item?id=45596960
   - Fetched:
     - `https://news.ycombinator.com/item?id=45596960`
     - `https://hn.algolia.com/api/v1/items/45596960` (full comment tree)
     - `https://hn.algolia.com/api/v1/search?query=tonsky.me%20syntax%20highlighting&tags=story` (thread lookup)
2. **Study type.** Practitioner discussion (anecdotes).
3. **Sample.** 141 self-selected comments.
4. **Main counterarguments** (comment IDs in brackets):
   - **Keyword colour catches typos** [45597746]: "it's useful to be able to immediately, visually see if you made a typo: if you expected to write a keyword, and it's colored like normal text, you know you messed up." The same commenter points out that under Tonsky's own scheme "'return' and 'retunr' would have identical coloring". Another [45598076] says distinct colours for keywords, variables and functions "helps you find misspellings", and that the person typing notices at once when a word "doesn't highlight as a keyword".
   - **Rebuttal:** typos are the job of "diagnostics. A big red squiggly line", not highlighting [45598010, 45599017].
   - **Keywords as structural anchors** [45597996]: "keywords are the single most important thing to highlight … Keywords sketch the structure of the program". Others want `try`, `await` and `new` highlighted [45597748, 45598052].
   - **Unconscious pattern recognition** (top replies): one reader found the function definition faster in the colourful example. Another wrote: "I don't have a clue what color anything is in my favored highlighting, but my brain does incredible pattern recognition".
   - **Familiarity and alternatives:** familiarity and stability matter most [45598605]. Some suggest shade hierarchies instead of fewer colours [45597993]; others champion semantic highlighting [45606448, 45612708].
   - **Colour-blind commenters split:** type-based colouring caught a bug for one [45597642], while another with ADHD and colour blindness prefers minimal themes [45598047].
5. **Verdict: ACCURATE** for "others point out that coloring keywords helps catch typos". It is fair to add that others say a linter should catch typos instead.
6. **Evidence strength:** expert opinion (anecdotal).

### 11f. Healey 1996: how many colours can be found at a glance

1. **Citation.** Healey CG (1996). *Choosing effective colours for data visualization.* Proceedings IEEE Visualization '96 (San Francisco), pp. 263–270. DOI [10.1109/VISUAL.1996.568118](https://doi.org/10.1109/VISUAL.1996.568118). The brief's citation is correct.
   - Fetched:
     - `https://healey.csc.ncsu.edu/publications/15843-choosing-effective-colours-for-data-visualization` (abstract, pages)
     - `https://api.semanticscholar.org/graph/v1/paper/DOI:10.1109/VISUAL.1996.568118?fields=…` (DOI; an open PDF is listed at csc.ncsu.edu but could not be opened)
   - **Number verified in:** Healey CG (1996). *Effective Visualization of Large Multidimensional Datasets.* PhD thesis, University of British Columbia, September 1996. `https://www.cs.ubc.ca/labs/imager/th/1996/Healey1996/Healey1996.pdf` (full text, via search tool). Chapter 5 reports the same 38-observer colour-selection experiments and cites the Vis '96 paper.
2. **Study type.** Lab visual-search experiments on perception.
3. **Sample.** 38 observers with normal or corrected acuity, screened for colour blindness.
4. **Key results.**
   - **Abstract:** the method maximises "the total number of colours available for use, while still allowing an observer to rapidly and accurately search a display", by controlling "colour distance, linear separation, and colour category".
   - **Thesis:** "detection was rapid and accurate for all colours from both the three-colour and five-colour studies. Results from the seven-colour and nine colour studies were mixed".
   - **7-colour study:** mean error ≈3.3%. Five targets were found at a glance: response times stayed flat as distractors were added (562–829 ms when present). Two greens in the same named colour category had to be searched item by item.
   - **9-colour study:** four of the nine targets had error rates of roughly 10–16%.
   - **Summary:** "This allowed us to chose up to seven isoluminant hues … each could be identified preattentively."
5. **Verdict: ACCURATE.** More precise: "about five colours reliably, and up to seven if they are carefully chosen to fall in different colour categories". These were equal-brightness coloured shapes in data displays, not code.
6. **Evidence strength:** experiment.

---

## Screen comfort guide: authoritative sources (exact quotes)

### (a) The 20-20-20 rule

- **American Optometric Association (AOA), "Computer vision syndrome":** https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome
  - "To help alleviate digital eyestrain, follow the 20-20-20 rule; take a 20-second break to view something 20 feet away every 20 minutes."
  - "Resting the eyes for 15 minutes after two hours of continuous computer use."
- **American Academy of Ophthalmology (AAO), "Should You Be Worried About Blue Light?"** (reviewed by Rahul N Khurana MD, 10 Mar 2021): https://www.aao.org/eye-health/tips-prevention/should-you-be-worried-about-blue-light
  - "The best way to protect your eyes against eye strain is to take regular breaks using the "20-20-20" rule: every 20 minutes, shift your eyes to look at an object at least 20 feet away for at least 20 seconds."
- **AAO, "Are Blue Light-Blocking Glasses Worth It?"** (5 Mar 2021): https://www.aao.org/eye-health/tips-prevention/are-computer-glasses-worth-it
  - Uses the same 20-20-20 wording.
- **OSHA eTool, Monitors:** https://www.osha.gov/etools/computer-workstations/components/monitors
  - "Rest your eyes periodically by focusing on objects that are farther away (for example, a clock on a wall 20 feet away)."
- **Evidence caveat:** TFOS 2023 notes "limited peer-reviewed studies confirming efficacy". The one software trial (8c) found short-lived symptom relief.
- **Suggested wording:** "Every 20 minutes, look at something about 6 m (20 ft) away for 20 seconds. Eye-care bodies recommend it. The evidence that it works is limited, but it costs nothing."

### (b) Match screen brightness to the room; avoid a bright screen in a dark room

- **AAO, "Computers, Digital Devices, and Eye Strain"** (reviewed by James M Huffman MD, 27 Jun 2024): https://www.aao.org/eye-health/tips-prevention/computer-usage
  - "If your screen glows brighter than your surroundings, your eyes have to work harder to see. Adjust your screen brightness to match the level of light around you. Also, try increasing the contrast on your screen to reduce eye strain."
- **AAO, "Are Blue Light-Blocking Glasses Worth It?"** (URL above)
  - "Adjust your room lighting and try increasing the contrast on your screen to reduce eye strain."
  - "The best way to avoid sleep disruption is to avoid using screens two to three hours before bed. Using "dark" or "night" mode on devices in the evening can help, too."
- **TFOS 2023** (8a)
  - Brightness: "it has been suggested that screen brightness should mimic the surrounding light conditions, in order to minimize eye strain". Adjusting brightness to ambient light "reduced the prevalence of digital eye strain … but did not influence the severity of symptoms".
  - Dark mode: "There is limited evidence on how these dark modes impact ocular health, comfort and vision". The report says "positive polarity (black text on a white background) monitor displays typically result in improved legibility", along with stronger pupil constriction, better visual acuity and less visible reflections. Yet "several studies do appear to show a potential benefit of negative polarity, particularly in low ambient light conditions".
- **ANSI/HFES 100-2007, *Human Factors Engineering of Computer Workstations*** (Human Factors and Ergonomics Society)
  - Read from a copy hosted by a console vendor: https://www.trescoconsoles.com/wp-content/uploads/2023/11/ANSI_HFES_100-200727E2.pdf (via search tool). Cite the standard itself, not this copy.
  - Room light sources larger than 5° in the field of view should "Not exceed 10 times the average screen luminance for negative-polarity screens (bright characters on dark background)" and should "Not exceed 3 times the average screen luminance for positive-polarity screens".
  - "For negative-polarity screens, surround luminances that are brighter than the screen average luminance result in the best visual performance … The best visual performance occurs when the background luminance is approximately 5 times the average screen luminance."
  - "For positive-polarity screens, the best visual performance is obtained when the background luminance is approximately equal to the average screen luminance."
- **Suggested wording:** "Don't use a bright screen in a dark room. Keep some room light on and set screen brightness to roughly match your surroundings. With a dark theme, the room can be somewhat brighter than the screen, but keep bright lamps and windows out of direct view."

### (c) Viewing distance and text size

- **AOA** (URL above)
  - "Optimally, the computer screen should be 15 to 20 degrees below eye level (about 4 or 5 inches) as measured from the center of the screen and 20 to 28 inches from the eyes."
  - The same page also says "about 20 to 30 inches" and "Place the computer screen 16 to 30 inches away", so its ranges are inconsistent.
- **AAO**, computer-usage page
  - "When using a computer, you should be sitting about 25 inches (right about at arm's length) from the screen. Also, position the screen so your eye gazes slightly downward".
- **OSHA eTool, Monitors**
  - "Generally, the preferred viewing distance is between 20 and 40 inches (50 and 100 cm) from the eye to the front surface of the computer screen … NOTE: text size may need to be increased for smaller monitors."
  - "Sit at a comfortable distance from the monitor where you can easily read all text with your head and torso in an upright posture".
  - "The center of the computer monitor should normally be located 15 to 20 degrees below horizontal eye level".
- **ANSI/HFES 100-2007, §7.2.6.1**
  - "The minimum character height … shall be 16 arc minutes and should be 22 to 30 arc minutes at the design viewing distance". Elsewhere it equates 16 arcmin to "2.3 mm at 50 cm viewing distance".
  - My own arithmetic, not from the source: 22–30 arcmin at 60 cm is ≈3.8–5.2 mm of character height, as the standard defines it.
- **Evidence caveats:**
  - TFOS: studies of viewing distance and dry-eye symptoms conflict. One suggests an optimum "<51 cm", another "52–75 cm", and a third found "no association".
  - Manna 2026: symptomatic users sit closer (~30 cm for phones, ~56 cm for computers).
- **Suggested wording:** "Sit about an arm's length away (roughly 50–75 cm) with the screen slightly below eye level. Make text big enough to read without leaning in; ergonomics standards suggest letters about 4–5 mm tall at 60 cm."

### (d) Glasses for screen distance and presbyopia

- **AOA**
  - "individuals who do not require the use of eyeglasses for other daily activities may benefit from glasses prescribed specifically for computer use."
  - "Glasses should meet the demand of the job. If glasses are worn for distant vision, reading or both, they may not provide the most efficient vision for viewing a computer screen, which is about 20 to 30 inches from the eyes."
  - "aging changes of the eyes, such as presbyopia, can all contribute to the development of visual symptoms".
- **AAO**, computer-usage page
  - "These prescription glasses allow you to focus your eyes specifically at computer screen distance (intermediate distance, which is about 20-26 inches away from your face)… Be aware that computer glasses for reducing eye strain are not the same as "blue light blocking" glasses."
- **OSHA:** bifocal wearers can "Use a pair of single-vision lenses with a focal length designed for computer work."
- **TFOS 2023, §8.5**
  - "Digital eye strain symptoms are considerably worsened by an uncorrected or under-corrected refractive error", and "As little as 0.50 to 1.00D of uncorrected astigmatism can significantly increase symptoms".
  - A Cochrane review (8 studies, 381 participants) found progressive computer glasses "do not considerably reduce digital eye strain-associated complaints compared to other spectacles". However, "'computer' (intermediate distance focused) glasses alleviated headaches 10% more than single vision distance refractive correction". Evidence quality was "low or very low".
  - "correction of presbyopia did not reduce reported digital eye strain".
- **Caution:** the same AOA page claims blue light from screens "can negatively affect vision over the long term" and that "Special lens tints and coatings can reduce the harmful impact of blue light". This contradicts Cochrane, TFOS and the AAO, which says "there is no scientific evidence that blue light from digital devices causes damage to your eye". Don't cite the AOA page for blue-light claims.
- **Suggested wording:** "If you're over about 40 or wear glasses, ask an optometrist about glasses set for your screen distance (about 50–75 cm). Reading or distance glasses may not focus well there. Computer glasses are not the same as blue-light glasses."

### (e) Blinking drops during screen use

- **TFOS 2023:**
  - 18.4 → 3.6 blinks/min from rest to computer reading.
  - 22 blinks/min relaxed vs 10 reading a book vs 7 reading on a computer.
  - With matched text, screen and paper showed no blink-rate difference, but screens produced more incomplete blinks.
- **AAO**, computer-usage page: "Humans normally blink about 15 times in one minute. However, studies show that we only blink about 5 to 7 times in a minute while using computers and other digital screen devices."
- **Talens-Estarelles 2023:** "8–9 blinks/min when using the computer vs 16–22 blinks/min when looking in primary gaze".
- **Manna 2026:** cognitive load cuts blink rate by ~25–26%, "often to 7–10 blinks/min". Incomplete blinks were 14.5% on screens vs 5% on paper.
- **Suggested wording:** "When concentrating on a screen we often blink only a third to a half as often as at rest, and more of those blinks are incomplete. Mental effort seems to drive this as much as the screen itself. Blink on purpose now and then, and take breaks."

---

## Newer work (2024–2026)

I found no 2024–2026 study testing dark mode (negative polarity) itself on melatonin or sleep, and no peer-reviewed 2024–2026 experiment on syntax highlighting. The closest items follow.

### N1. Höhn et al. 2024: smartphone reading with or without a blue-light filter before bed

1. **Citation.** Höhn C, Hahn MA, Gruber GB, Pletzer B, Cajochen C, Hoedlmoser K (2024). *Effects of evening smartphone use on sleep and declarative memory consolidation in male adolescents and young adults.* Brain Communications 6(3):fcae173. DOI [10.1093/braincomms/fcae173](https://doi.org/10.1093/braincomms/fcae173); PMID 38846535; PMC11154150; published 17 May 2024.
   - Fetched: `https://api.semanticscholar.org/graph/v1/paper/DOI:10.1093/braincomms/fcae173?fields=…` (abstract). The volume and issue were read in the Mao 2025 reference list (`https://exa.ai/library/publication/mzt1dl6scny`).
2. **Study type.** Within-subject lab experiment with overnight sleep recording (polysomnography).
3. **Sample.** 33 male adolescents (15.4 ± 1.0 y) and 35 male young adults (21.5 ± 2.1 y). Each read for 90 min under three conditions: a smartphone with a blue-light filter, a smartphone without one, and a printed book.
4. **Key results.**
   - "subjective sleepiness remained unaffected".
   - There was "a significant melatonin attenuation effect in both age groups immediately after reading on the smartphone without a blue-light filter".
   - Adolescents recovered within 50 min. Adults "still, at bedtime, exhibited significantly reduced melatonin levels" and showed "a reduction in N3 sleep during the first night quarter".
   - Memory consolidation was unaffected.
   - The authors advise "avoiding smartphone use in the last hour before bedtime".
5. **Relevance.** Supports "evening screen light matters" for melatonin, with modest effects on sleep itself. Males only.
6. **Evidence strength:** experiment.

### N2. Glickman et al. 2025: how strong do "blue-blocking" glasses need to be?

1. **Citation.** Glickman GL, Harrison EM, Herf M, Herf L, Brown TM (2025). *Optimizing the Potential Utility of Blue-Blocking Glasses for Sleep and Circadian Health.* Translational Vision Science & Technology 14(7):25. DOI [10.1167/tvst.14.7.25](https://doi.org/10.1167/tvst.14.7.25); PMID 40728371; PMC12315928.
   - Fetched: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=40728371&retmode=text&rettype=abstract`.
2. **Study type.** Optical characterisation of products against a new metric, plus a narrative review of intervention studies.
3. **Sample.** 26 commercially available glasses.
4. **Key results.**
   - The paper introduces a new metric, "melanopic daylight filtering density (mDFD)".
   - "Products varied considerably in mDFD, with only those rated at mDFD ≥1 providing sufficient reductions in melanopic input to justify the 'blue-blocking' label".
   - "At least one relevant sleep or circadian-related outcome improved with blue-blocking interventions in the studies reviewed", and "appropriate timing and usage are critical".
   - **Disclosures:** M. Herf and L. Herf are affiliated with f.lux Software LLC, and G.L. Glickman reports ties to f.lux and lighting companies.
5. **Relevance.** Helps explain the mixed sleep trials: many "blue-light" glasses filter too little to matter for the body clock. The clear "blue-light" computer lenses sold for eye strain are a different product from the amber glasses used in sleep trials.
6. **Evidence strength:** mechanism.

### N3. Mao et al. 2025: phone night modes and evening melatonin

1. **Citation.** Mao J, Huang Y, Zhao M, Zhang F, Li X, Dai Q (2025). *Quantifying the impact of night-shift display modes on evening melatonin production.* Displays 88:103027. DOI [10.1016/j.displa.2025.103027](https://doi.org/10.1016/j.displa.2025.103027); online March 2025 (July 2025 issue).
   - Fetched:
     - `https://www.sciencedirect.com/science/article/abs/pii/S0141938225000642` (abstract, highlights, excerpts)
     - `https://api.crossref.org/works?query.bibliographic=Quantifying+the+impact+of+night-shift+display+modes+on+evening+melatonin+production&rows=2&select=…` (DOI, volume)
     - `https://exa.ai/library/publication/mzt1dl6scny` (affiliations)
2. **Study type.** Lab experiment at Fudan University comparing smartphones in normal mode against four night-shift modes (two static: low colour temperature and low luminance; two that dimmed over time) during the 3 h before bedtime.
3. **Sample.** Not stated in the accessible abstract or preview.
4. **Key results.**
   - "Under modes with constant low luminance and CCTs (leading to low melanopic lux), participants had significantly higher melatonin production than those in the normal mode".
   - The dimming-over-time modes still delivered high melanopic light early in the evening.
   - Melatonin tracked melanopic EDI at every time point (R² = 0.90, 0.79 and 0.78 at 9, 10 and 11 pm).
   - Highlight: "The m-EDI of the emitted light at eye largely determines the impact of display devices on evening melatonin secretion."
   - Proposed threshold: a cumulative melanopic EDI "below 35 lx·h" over the 2 h before bedtime.
   - **Funding and conflicts:** funded by NSFC and Honor Device Co., Ltd. Three of the six authors work at Honor (a phone maker), yet the paper declares "no known competing financial interests".
5. **Relevance.** The closest recent evidence on display modes and the body clock. It supports "less melanopic light at the eye in the evening (dimmer and warmer)". It did not test dark themes (negative polarity) as such.
6. **Evidence strength:** experiment.

### N4. Xie, Yu & Chen 2024: dark vs light mode, colour temperature and room light

1. **Citation.** Xie X, Yu S, Chen D. *Effects of Screen Color Mode and Color Temperature on Visual Fatigue under Different Ambient Illuminations.* International Journal of Human–Computer Interaction 41(2):821–833 (online 30 Jan 2024). DOI [10.1080/10447318.2024.2305982](https://doi.org/10.1080/10447318.2024.2305982).
   - Fetched: `https://api.semanticscholar.org/graph/v1/paper/DOI:10.1080/10447318.2024.2305982?fields=…` (abstract). The volume and pages were read in the Mao 2025 reference list (exa page above).
2. **Study type.** Lab experiment (2 × 2 × 3 design) combining eye tracking and ratings.
3. **Sample.** 36 participants, testing light vs dark mode × screen colour temperature (2800, 4500 or 6500 K) × room light of 450 lux (office) vs 3 lux (dark room).
4. **Key results.** "at 450 lux, lower visual fatigue was found in the dark mode, 4500 K and 6500 K. At 3 lux, the visual fatigue was lower in the dark mode and 4500 K color temperature. Whether at daytime or night, the 2800 K color temperature resulted in the highest visual fatigue."
5. **Relevance.** Dark mode gave lower short-term fatigue in both bright and dark rooms. A very warm screen (2800 K) raised fatigue, which is a trade-off for aggressive night modes. Results come from short lab sessions only.
6. **Evidence strength:** experiment.

### N5. Pathari et al. 2024: dark vs light mode on smartphones

1. **Citation.** Pathari FJ, Nielsen Y, Andersen LI, Marentakis G (2024). *Dark vs. Light Mode on Smartphones: Effects on Eye Fatigue.* ACHI 2024, Seventeenth International Conference on Advances in Computer-Human Interactions (Østfold University College, Norway).
   - Fetched: `https://personales.upv.es/thinkmind/dl/conferences/achi/achi_2024/achi_2024_3_150_20069.pdf` (full text, via search tool).
2. **Study type.** Lab experiment with a mixed design: room light varied between participants, display mode within participants.
3. **Sample.** Not found in the extracted text. The reported F(1, 14) for a two-group design implies about 16 participants (my inference). The phone was a Samsung Galaxy A53 with auto-brightness on, in room light of 460 lux vs 33 lux.
4. **Key results.** "We observed a significant reduction in eye fatigue with the use of dark mode in bright ambient conditions, while this effect was not significant in dim ambient lighting". The interaction was F(1, 14) = 7.13, p = 0.016, and in the bright room dark vs light mode gave p = 0.004.
5. **Relevance.** Disagrees with Xie et al. about dim rooms. Findings on dark-mode comfort are inconsistent and depend on room light and screen brightness, so the myths section should avoid strong claims either way.
6. **Evidence strength:** experiment (small).

### N6. Syntax highlighting, 2024–2026: only a student thesis found

1. **Citation.** Undergraduate thesis, Universitas Brawijaya (Indonesia): *Analisis Efisiensi Pengaruh Penerapan Syntax Highlighting Terhadap Readability Dan Maintainability Kode Program Dalam Proses Development.* Repository eprint 255102: https://repository.ub.ac.id/id/eprint/255102/
   - A direct fetch was blocked by Cloudflare. The abstract was read in the search tool's extraction of that page. The author and deposit date were not visible.
2. **Study type.** Posttest-only controlled experiment; not peer-reviewed.
3. **Sample.** 30 seventh-semester computer-science students (data collected October 2025). They worked on two JavaScript snippets in VS Code, giving 120 timing samples.
4. **Key results.** Time to find an error did not differ (Mann–Whitney p = 0.2311). Time to fix it was significantly shorter with highlighting (p = 0.001536).
5. **Relevance.** Weak: small, unreviewed student work.
   - The nearest peer-reviewed study is Park K, Weill-Tessier P, Brown NCC, Sharif B, Jensen N, Kölling M (2023), *An eye tracking study assessing the impact of background styling in code editors on novice programmers' code understanding*, ICER 2023, DOI [10.1145/3568813.3600133](https://doi.org/10.1145/3568813.3600133). Fetched at https://dl.acm.org/doi/10.1145/3568813.3600133 (via search tool).
   - Park et al. found that scope (background) highlighting made "no difference … in terms of correctness, or speed to produce correct answers", though gaze patterns changed. It dates from 2023 and concerns scope highlighting, not token colour.
6. **Evidence strength:** experiment (very weak).

### Context (2023, outside the window but directly relevant)

**Schöllhorn I, Stefani O, Lucas RJ, Spitschan M, Slawik HC, Cajochen C (2023).** *Melanopic irradiance defines the impact of evening display light on sleep latency, melatonin and alertness.* Communications Biology 6:228. DOI [10.1038/s42003-023-04598-4](https://doi.org/10.1038/s42003-023-04598-4). Fetched: https://www.nature.com/articles/s42003-023-04598-4 (via search tool).

- **Design:** 72 healthy men, starting 4 h before habitual bedtime, at four display luminance levels. Each level was shown with low and high melanopic settings that looked the same.
- **Findings:**
  - "Low melanopic light shortens the time to fall asleep, attenuates evening melatonin suppression … and decreases alertness". The effects were dose-dependent.
  - There was "about a 50% increase in mean sleep latency between … ~5 lx mEDI and … ~150 lx mEDI".
  - The low- vs high-melanopic difference in sleep latency was significant only at the brightest level (284 cd/m²).
- **Relevance:** shows that both screen brightness and spectrum matter, which strongly supports the corrected Row 7 wording.
- **Evidence strength:** experiment.

---

## Could not verify

- **Healey 1996 conference paper (body text):** the PDF couldn't be opened. The colour-count result was verified in the author's 1996 PhD thesis (same experiments), and the conference abstract on the author's page.
- **Hannebauer et al. 2018 full text:** closed access, so only abstract-level facts are reported.
- **CIE S 026 numeric peak from CIE itself:** the data tables are sold with the standard. The 480/490 nm values come from Brown et al. 2022 (plotted from the CIE tables) and Schlangen & Price 2021.
- **Sample sizes for Mao et al. 2025 and Pathari et al. 2024:** not in the accessible text.
- **Cochrane full text:** blocked (HTTP 412). The abstract was read via Semantic Scholar and matches the Cochrane abstract page shown in search results.
