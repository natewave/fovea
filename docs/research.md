# Fovea research dossier

This dossier checks every claim in the research table of the [project brief](brief.md) (§3) against its source, adds newer work from 2024–2026, and records what each finding means for Fovea. It was compiled on 14 October 2026.

**Method.** Five verification passes covered display polarity and comfort; color vision; contrast standards and licensing; eye strain, sleep and syntax highlighting; and engineering facts. Every source below was opened during verification, through the publisher's page, PubMed Central, an author-hosted copy, or an official metadata API. Where only the abstract could be read, the row says so. Nothing is cited from memory. The full verification notes, with every URL fetched, verbatim quotes and access problems, are in [`research/verification/`](research/verification/).

**Evidence labels** match the ones the website uses:

- **Systematic review:** a structured review of many studies, with or without meta-analysis.
- **Experiment:** a study that measured people under controlled conditions. Small or uncontrolled studies are flagged.
- **Mechanism:** optics, anatomy, physiology or a computational model. It explains *why* something might happen without showing that it does.
- **Expert opinion:** consensus reports, standards, guidelines, practitioner writing.

"n" is the number of participants analyzed.

## Verdicts on the brief's research table

| Row | Topic | Verdict | Main correction |
|---|---|---|---|
| 1 | Positive polarity advantage | Partly accurate | Light mode is read more accurately *and* faster. The sharper retinal image was inferred, not measured. The advantage is largest in dark rooms and persisted under office light; it lost significance in only one glance-reading study, at 4,750 lux. |
| 2 | Comfort can favor dark mode | Partly accurate | Comfort results are mixed. One key study was checkable only at abstract level, flicker fusion is not a validated fatigue measure, and other studies favor light mode or find no difference. |
| 3 | Pupils, astigmatism, halation | Partly accurate | Larger pupils lower optical quality with and without astigmatism; "especially in astigmatic eyes" was not tested. Palmén et al. 2023 do not support the optics claim. Halation is untested. |
| 4 | Colored text and chromatic aberration | Partly accurate | The study results are quoted correctly, but colors were not luminance-matched. Chromostereopsis comes mainly from *transverse* chromatic aberration, not longitudinal. |
| 5 | No S cones in the central fovea | Accurate, with a precision fix | The ~20–25′ zone is a diameter. A missing step (luminance carries fine detail) is supported by Mullen 1985. |
| 6 | Standards and APCA | Mostly accurate | ISO/IEC 40500:2025 is the October 2023 text of WCAG 2.2. APCA's levels carry font-size conditions, and Lc 15 applies only to non-semantic non-text. APCA's licence and trademark terms need a decision. |
| 7 | Blue light and sleep | Partly accurate | Cochrane says filtering lenses *may* not help eye strain (low certainty), and the brief's author list is wrong. The 2025 meta-analysis is tiny. Melanopic light depends on spectrum as well as intensity. |
| 8 | Digital eye strain | Mostly accurate | The screen-versus-room brightness item rests on weaker, mostly cross-sectional evidence. The 20-20-20 study is small and uncontrolled. |
| 9 | CVD prevalence and simulation | Partly accurate | Prevalence is correct. Machado 2009 is widely used but does not model tritanopia; Brettel 1997 is the valid choice there. |
| 10 | Warm background tints | Accurate, but over-applied | Warm beat cool; white was never tested, so "warm, not white" goes beyond this study. |
| 11 | Syntax highlighting | Accurate | Say "no evidence of a comprehension gain" rather than "no gain". People find about five colors at a glance reliably, up to seven if carefully chosen. |
| 12 | Low-vision typefaces, italics | Accurate, with nuance | The OFL covers the Google Fonts and Fontsource releases; the Braille Institute's own download has a separate EULA. Dyslexia guidance advises against italics *and* underlining. |
| — | Benchmark table | One row wrong | Tokyo Night scores Lc 59 and 8.1:1, not 74 and 10.6:1. "Tokyo Night Day" is from a different project than the VS Code theme. |

## Evidence table

Newer work (published 2024–2026) is marked **(new)**.

### 1. Display polarity and legibility

| Claim | Source | Study type | n | Key result | Evidence | Implication for Fovea |
|---|---|---|---|---|---|---|
| Dark text on a light background is proofread more accurately and faster, and the brighter screen shrinks the pupil. | Piepenbrock, Mayr & Buchner 2014, *Ergonomics* 57(11):1670–1677, [doi:10.1080/00140139.2014.948496](https://doi.org/10.1080/00140139.2014.948496) | Lab experiment, within-subject, dark room | 35 | Accuracy dz = 0.77, reading rate dz = 0.68; pupils 2.09 vs 3.65 mm. The authors say image quality "was not measured directly". | Experiment | Day is a first-class variant and the most legible one. |
| The advantage grows as text gets smaller. | Piepenbrock, Mayr & Buchner 2014, *Human Factors* 56(5):942–951, [doi:10.1177/0018720813515509](https://doi.org/10.1177/0018720813515509) | Lab experiment, dark room | 160 | Polarity effect F(1,158) = 9.34, p = .003; the advantage rose linearly as characters shrank from 14 to 8 pt. | Experiment | Code is small text, so the dark variants need high text contrast. |
| The advantage holds for younger and older adults. | Piepenbrock, Mayr, Mund & Buchner 2013, *Ergonomics* 56(7):1116–1124, [doi:10.1080/00140139.2013.790485](https://doi.org/10.1080/00140139.2013.790485) | Lab experiment | 169 | Proofreading η² = 0.06 with no age interaction; acuity better with dark-on-light; no polarity effect on reported eyestrain. | Experiment | Same guidance for all ages. |
| Overall screen luminance, not polarity itself, drives the effect. | Buchner, Mayr & Brandt 2009, *Ergonomics* 52(7):882–886, [doi:10.1080/00140130802641635](https://doi.org/10.1080/00140130802641635) | Lab experiment, 5 lx room | 124 | With mean screen luminance equalized, the polarity effect vanished (p = 0.85); brighter screens improved proofreading. | Experiment | Night's lower light output costs some legibility, so Night must still meet the body-text floors. |
| The advantage persists under office lighting. | Buchner & Baumgartner 2007, *Ergonomics* 50(7):1036–1063, [doi:10.1080/00140130701306413](https://doi.org/10.1080/00140130701306413) (abstract only) | Series of lab experiments | not in abstract | The advantage "was independent of ambient lighting (darkness vs. typical office illumination)"; no polarity effect on reported strain. | Experiment | Day is the most legible choice in typical rooms, not only bright ones. |
| The dark-mode penalty is largest in a dark room; in daylight-level light it was not significant. | Dobres, Chahine & Reimer 2017, *Applied Ergonomics* 60:68–73, [doi:10.1016/j.apergo.2016.11.001](https://doi.org/10.1016/j.apergo.2016.11.001) | Lab experiment, glance reading of single words | 34 | Lighting × polarity F(1,33) = 14.18. Large effect at ~0 lux; none at 4,750 lux (p = 0.665). Session order was not counterbalanced. | Experiment | The dark variants carry their largest penalty in dark rooms; the comfort guide advises keeping some room light on. |
| Light mode is read faster even against a near-black (#121212) dark mode; bolder fonts did not close the gap; no sign of halation. | Palmén, Gilbert & Crossland 2023, CHI '23, [doi:10.1145/3544548.3581552](https://doi.org/10.1145/3544548.3581552) | Two online experiments, uncontrolled lighting | 459 | Study 1: 1.93 vs 2.06 s per word pair (d = 0.16). Study 2: F = 12.8, p < 0.01. Clarity and preference split evenly. | Experiment | Heavier weights won't rescue dark mode; halation is treated as untested. |
| The polarity effect replicates in VR and mixed reality. **(new)** | Luzsa & Mayr 2026, *Ergonomics* 69(2):221–235, [doi:10.1080/00140139.2025.2457470](https://doi.org/10.1080/00140139.2025.2457470) | Two lab experiments in a headset | 27 + 37 | Light mode found 8% more errors (d = 0.68) and identified letters faster; pupils 3.58 vs 7.07 mm. | Experiment | The legibility advantage is robust across display types. |
| Dark mode was read aloud faster on a laptop. **(new)** | Muhamad & Mokhtar 2024, *J Health Sci Med Res* 42(6):e20241095, [doi:10.31584/jhsmr.20241095](https://doi.org/10.31584/jhsmr.20241095) | Within-subject experiment, 200 lux | 30 | 136 vs 128 words per minute; errors did not differ. Its participant description is word-for-word identical to another paper's, a reliability red flag. | Experiment (low reliability) | Recorded as contrary evidence and given little weight. |
| Polarity mattered little after multifocal lens implants. **(new)** | Somkijrungroj et al. 2026, *Clin Ophthalmol* 20:617151, [doi:10.2147/OPTH.S617151](https://doi.org/10.2147/OPTH.S617151) | Observational cohort | 26 | Black-on-white acuity was better only at 40 cm one month after surgery; differences were "not considered clinically meaningful". | Experiment (observational) | No change. |

### 2. Comfort and fatigue

| Claim | Source | Study type | n | Key result | Evidence | Implication for Fovea |
|---|---|---|---|---|---|---|
| Dark mode was rated less fatiguing at 450 and 3 lux; a 2800 K screen white was worst, and 4500 K best in the dark. | Xie, Yu & Chen 2025, *Int J Hum–Comput Interact* 41(2):821–833, [doi:10.1080/10447318.2024.2305982](https://doi.org/10.1080/10447318.2024.2305982) (abstract only) | Lab experiment, 2 × 2 × 3 design | 36 | At 450 lux, lowest fatigue with dark mode and with 4500 K or 6500 K; at 3 lux, with dark mode and 4500 K. | Experiment | Offer dark variants. Keep near-white neutrals between 4500 K and 6500 K; Night is never amber or sepia. |
| One hour on a tablet: no difference in reported fatigue, small differences in flicker fusion and dry-eye scores. | Sengsoon & Intaruk 2025, *IJERPH* 22(4):609, [doi:10.3390/ijerph22040609](https://doi.org/10.3390/ijerph22040609) | Crossover experiment, not blinded | 30 (young women; astigmatism excluded) | Fatigue p = 0.305; flicker fusion p = 0.001; dry eye p = 0.048, uncorrected for multiple tests. | Experiment | No comfort claim for either mode. |
| Critical flicker fusion does not track visual-fatigue symptoms. | Singh, Downie & Anderson 2023, *Ophthalmic Physiol Opt* 43(2):176–182, [doi:10.1111/opo.13073](https://doi.org/10.1111/opo.13073) | Post-hoc analysis of a randomized trial | 120 | Symptoms rose; flicker fusion did not change (−0.7 Hz); r = −0.13. | Experiment | Flicker-fusion results are not cited as comfort evidence. |
| Light mode reduced fatigue on a desktop head-up display at 300 lx. **(new)** | Lin, Ji & Lin 2024, *Ergonomics* 67(11):1491–1503, [doi:10.1080/00140139.2024.2339439](https://doi.org/10.1080/00140139.2024.2339439) (abstract only) | Lab experiment | 36 | "A positive polarity advantage was found over negative in visual fatigue and discomfort (p < .05)." | Experiment | Comfort evidence points both ways. |
| Dark mode reduced phone eye fatigue in a bright room but not a dim one. **(new)** | Pathari, Nielsen, Andersen & Marentakis 2024, *ACHI 2024*, pp. 150–154, [PDF](https://personales.upv.es/thinkmind/dl/conferences/achi/achi_2024/achi_2024_3_150_20069.pdf) | Mixed-design experiment | about 16 | Mode × room light F(1,14) = 7.13, p = 0.016. Auto-brightness was on, a confound. | Experiment (small) | Comfort evidence points both ways. |
| A dark dashboard theme improved accuracy only at medium difficulty and lowered perceived workload. **(new)** | Ettling, Steinmann & Bektaş 2025, *ETRA '25*, [doi:10.1145/3715669.3725879](https://doi.org/10.1145/3715669.3725879) | Within-subject experiment | 15 | Accuracy p = 0.016 at medium difficulty; no difference on easy or hard tasks. | Experiment (small) | Dark interfaces are not uniformly worse for non-reading work. |

### 3. Pupils, optics and halation

| Claim | Source | Study type | n | Key result | Evidence | Implication for Fovea |
|---|---|---|---|---|---|---|
| Larger pupils lower the eye's optical quality, with and without astigmatism. | Kobashi et al. 2013, *BioMed Res Int* 2013:124327, [doi:10.1155/2013/124327](https://doi.org/10.1155/2013/124327) (PMC3706062) | Optics study with artificial pupils and lens-induced astigmatism | 22 eyes | MTF cut-off from a 2 mm to a 6 mm pupil: 48.4 → 32.2 c/deg without astigmatism, 27.2 → 12.6 with 3 D. No interaction was tested. | Mechanism | Dark modes enlarge the pupil. Avoiding pure white and pure black and capping text contrast are design hypotheses, not proven fixes. |
| Correcting the eye's aberrations improved dark-on-light acuity more than light-on-dark. | Marcos, Sawides, Gambra & Dorronsoro 2008, *J Vis* 8(13):1, [doi:10.1167/8.13.1](https://doi.org/10.1167/8.13.1) (abstract only) | Adaptive-optics experiment | 7 | Acuity gain ×1.29 for black-on-white vs ×1.13 for white-on-black. | Mechanism | The idea that astigmatism makes dark mode worse is untested and partly contradicted. |
| No study tests dark mode in astigmatic readers or measures halation directly. | Literature searches covering 2015–2026 (queries in the [verification notes](research/verification/a-polarity-comfort-optics.md)) | Search | — | Nothing found; several polarity studies excluded astigmatism or capped it at 1 D. | — | Halation is presented as a hypothesis (see *Contested or unknown*). |

### 4. Colored text, chromatic aberration and chromostereopsis

| Claim | Source | Study type | n | Key result | Evidence | Implication for Fovea |
|---|---|---|---|---|---|---|
| On black, pure blue text produced the largest focusing lag and was rated hardest to read; yellow was rated easiest. **(new)** | Ramasubramanian et al. 2026, *Br Ir Orthopt J* 22(1):73–83, [doi:10.22599/bioj.515](https://doi.org/10.22599/bioj.515) | Within-subject lab experiment | 30 | Lag 0.61 D for blue vs 0.35 D for black-on-white; blue hardest for 73%, yellow easiest for 53%. Full-intensity primaries, not luminance-matched. | Experiment | No saturated blue or violet text: blues are light and low in chroma. |
| In dim light, red text on black was the most fatiguing and yellow the least. | Fan, Xie, Dong & Wang 2024, *Sensors* 24(11):3516, [doi:10.3390/s24113516](https://doi.org/10.3390/s24113516) | Mixed-design experiment | 50 (10 per color) | Fatigue ranked red > green > blue > white > yellow. Red and blue had half the contrast of yellow and green (3.0 vs 6.1:1). | Experiment | Red is reserved for alarms and lightened when used as text. |
| Longitudinal chromatic aberration spans about 2 D across the visible spectrum. | Thibos, Ye, Zhang & Bradley 1992, *Appl Opt* 31(19):3594–3600, [doi:10.1364/AO.31.003594](https://doi.org/10.1364/AO.31.003594); Howarth & Bradley 1986, *Vision Res* 26(2):361–366, [doi:10.1016/0042-6989(86)90034-9](https://doi.org/10.1016/0042-6989(86)90034-9) | Optical model; lab measurement | model; 20 | About 2.1 D over 400–700 nm from the model; 1.82 D (SD 0.15) over 420–660 nm measured. | Mechanism | Saturated red and blue can't both be in focus; text colors avoid the spectral extremes. |
| Chromostereopsis comes mainly from transverse chromatic aberration that differs between the eyes, and its direction varies between people. | Roorda et al. 2023, *J Vis* 23(2):3, [doi:10.1167/jov.23.2.3](https://doi.org/10.1167/jov.23.2.3); Ye, Bradley, Thibos & Zhang 1991, *Vision Res* 31(10):1787–1796, [doi:10.1016/0042-6989(91)90026-2](https://doi.org/10.1016/0042-6989(91)90026-2); Simonet & Campbell 1990, *Ophthalmic Physiol Opt* 10(3):271–279, [doi:10.1111/j.1475-1313.1990.tb00863.x](https://doi.org/10.1111/j.1475-1313.1990.tb00863.x) | Experiments | Simonet & Campbell: 30 | "The primary cause of chromostereopsis is the TCA of the eyes" (Roorda). Roughly equal numbers saw each depth direction (Simonet & Campbell). | Experiment | Saturated reds stay away from saturated blues; tests warn when roughly opposite syntax hues both exceed chroma 0.12. |

### 5. The fovea and luminance contrast

| Claim | Source | Study type | n | Key result | Evidence | Implication for Fovea |
|---|---|---|---|---|---|---|
| The central ~25′ (diameter) of the fovea lacks functioning S (blue) cones. | Williams, MacLeod & Hayhoe 1981, *Vision Res* 21(9):1341–1356, [doi:10.1016/0042-6989(81)90241-8](https://doi.org/10.1016/0042-6989(81)90241-8) | Psychophysics | not in abstract | "An area roughly 25′ in diameter in the central fovea lacks functioning blue-sensitive cones." | Experiment | The thesis behind the name: lightness carries fine detail. |
| S cones are missing from a zone about 100 µm (≈21′) across. | Curcio et al. 1991, *J Comp Neurol* 312(4):610–624, [doi:10.1002/cne.903120411](https://doi.org/10.1002/cne.903120411) | Anatomy, antibody staining | 7 retinas from 6 donors | Blue cones are 7% of cones within 4 mm of the center and absent from a 0.35° zone near peak cone density. | Mechanism | Same. |
| Color-only patterns stop being resolvable at 11–12 cycles per degree; sensitivity to luminance patterns is higher above 0.5 c/deg. | Mullen 1985, *J Physiol* 359:381–400, [doi:10.1113/jphysiol.1985.sp015591](https://doi.org/10.1113/jphysiol.1985.sp015591) | Psychophysics with aberrations corrected | not in abstract | Red–green and blue–yellow acuity limits are both about 11–12 c/deg. | Experiment | Every text color must clear a luminance-contrast floor; hue never carries legibility. |

### 6. Contrast standards and APCA

APCA is by Andrew Somers and Myndex Research. Fovea computes Lc with Color.js's implementation of APCA 0.0.98G-4g, is not affiliated with or endorsed by them, and uses the values as design targets, not as a compliance claim. Outside the method docs, Fovea calls them "perceptual contrast (Lc)" ([decision 001](decisions/001-apca-via-colorjs.md)).

| Claim | Source | Study type | n | Key result | Evidence | Implication for Fovea |
|---|---|---|---|---|---|---|
| WCAG 2.2 requires 4.5:1 for text, 3:1 for large text and for UI components and graphics, and 7:1 for text at AAA. | W3C, *WCAG 2.2*, Recommendation of 12 December 2024, <https://www.w3.org/TR/WCAG22/> (SC 1.4.3, 1.4.6, 1.4.11) | Standard | — | "Large scale" means at least 18 pt, or 14 pt bold. | Expert opinion (standard) | WCAG 2.2 is the hard floor in every row of the contrast budget. |
| ISO/IEC 40500:2025 is the October 2023 text of WCAG 2.2; an edition with the December 2024 text is expected as ISO/IEC 40500:2026. | <https://www.iso.org/standard/91029.html>; <https://www.w3.org/WAI/standards-guidelines/wcag/> | Standard | — | ISO marks 40500:2025 "to be revised". | Expert opinion (standard) | Fovea cites WCAG 2.2 itself. |
| WCAG can be applied to software through WCAG2ICT. | <https://www.w3.org/WAI/standards-guidelines/wcag/> | Guidance | — | "WCAG can also be applied to non-web information and communications technologies (ICT) such as native apps, software, and documents." | Expert opinion | Applying WCAG floors to an editor theme is legitimate. |
| WCAG 3's contrast method is undecided. | W3C, *WCAG 3.0* Working Draft, 10 September 2026, <https://www.w3.org/TR/wcag-3.0/> | Draft standard | — | "The contrast algorithm used in WCAG 3 is yet to be determined." The draft does not mention APCA. | Expert opinion | Fovea never claims WCAG 3 conformance. |
| APCA sets levels by use: Lc 90 preferred and 75 minimum for body text; 60 for other content text; 45 for large text and fine icons; 30 for any other text and solid icons; 15 for non-semantic non-text such as dividers. | *APCA in a Nutshell*, <https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell>; apca-w3 README, <https://github.com/Myndex/apca-w3> | Method documentation; public beta, base algorithm 0.0.98G-4g | — | Each level carries minimum font sizes and weights, and APCA's own documents disagree on some of them. | Expert opinion | APCA sets Fovea's design targets ([decision 001](decisions/001-apca-via-colorjs.md)). |
| APCA publishes reference values to test implementations. | SAPC-APCA documentation, <https://raw.githubusercontent.com/Myndex/SAPC-APCA/HEAD/documentation/README.md> | Reference data | — | `#888` text on `#fff` is Lc 63.056469930209424; `#fff` on `#888` is −68.54146436644962; six more pairs. | — | colorlab reproduces all eight through Color.js. |
| APCA's luminance step deviates from the sRGB standard by up to 2.5% in mid-tones. | w3c/silver issue #643 (open), <https://github.com/w3c/silver/issues/643> | Expert critique | — | APCA uses a simple 2.4 power law instead of the piecewise sRGB curve. | Expert opinion | APCA stays a design target; WCAG 2.2 stays the normative floor. |

### 7. Light, the body clock and "blue light"

| Claim | Source | Study type | n | Key result | Evidence | Implication for Fovea |
|---|---|---|---|---|---|---|
| Blue-light-filtering spectacle lenses may not reduce computer eye strain; whether they help sleep is unknown. | Singh, Keller, Busija, McMillan, Makrai, Lawrenson, Hull & Downie 2023, Cochrane Database Syst Rev CD013244.pub2, [doi:10.1002/14651858.CD013244.pub2](https://doi.org/10.1002/14651858.CD013244.pub2) | Cochrane systematic review | 17 RCTs (5–156 participants each) | Eye strain: "There may be no difference" (low certainty). Sleep: very low certainty, indeterminate. | Systematic review | No blue-light marketing anywhere. |
| Blue-blocking glasses showed no significant effect on sleep measured with wrist monitors. **(new)** | Luna-Rangel et al. 2025, *Front Neurol* 16:1699303, [doi:10.3389/fneur.2025.1699303](https://doi.org/10.3389/fneur.2025.1699303) | Systematic review and meta-analysis | 3 RCTs, 49 people | Sleep-onset latency −4.9 min (95% CI −20.2 to 10.5); total sleep +8.8 min (95% CI −35.3 to 52.8). | Systematic review (small) | Same. |
| Evening light should stay at or below 10 lux melanopic EDI at the eye from at least 3 hours before bedtime; that depends on both intensity and spectrum. | Brown et al. 2022, *PLOS Biol* 20(3):e3001571, [doi:10.1371/journal.pbio.3001571](https://doi.org/10.1371/journal.pbio.3001571) | International expert consensus built on lab dose–response data | — | Recommends light "depleted in short wavelengths" in the evening; common warm-white LEDs at about 30 lux can meet the target. | Expert opinion | Night's honest benefit is that it emits less light. Screen brightness and room lighting matter more than any hue choice. |
| Melanopsin is most sensitive near 480 nm, and the eye-level melanopic curve peaks near 490 nm. | Brown et al. 2022 (Fig. 1); Schlangen & Price 2021, *Front Neurol* 12:624861, [doi:10.3389/fneur.2021.624861](https://doi.org/10.3389/fneur.2021.624861) | Standard data; review | — | Sensitivity spans roughly 420–560 nm. | Mechanism | Night restrains large blue and cyan areas; its blues and cyans have the lowest chroma. |
| Low-melanopic display light shortened sleep latency and reduced melatonin suppression, dose-dependently. | Schöllhorn et al. 2023, *Commun Biol* 6:228, [doi:10.1038/s42003-023-04598-4](https://doi.org/10.1038/s42003-023-04598-4) | Lab experiment | 72 men | About 50% longer sleep latency at ~150 vs ~5 lux melanopic EDI; spectrum made a significant difference only at the brightest level (284 cd/m²). | Experiment | Brightness and spectrum both matter; a darker theme lowers the light reaching the eye. |
| Phone night modes with constant low luminance and low color temperature preserved evening melatonin. **(new)** | Mao et al. 2025, *Displays* 88:103027, [doi:10.1016/j.displa.2025.103027](https://doi.org/10.1016/j.displa.2025.103027) (abstract only; co-funded by a phone maker) | Lab experiment | not stated | Melatonin tracked melanopic EDI at the eye (R² 0.78–0.90). | Experiment | Same. Changing the display's white point is the operating system's job, not Fovea's. |
| Evening smartphone reading without a filter suppressed melatonin in young men. **(new)** | Höhn et al. 2024, *Brain Commun* 6(3):fcae173, [doi:10.1093/braincomms/fcae173](https://doi.org/10.1093/braincomms/fcae173) | Within-subject experiment with sleep recording | 68 (male) | Melatonin was attenuated after unfiltered reading; adults showed less deep sleep early in the night; sleepiness was unaffected. | Experiment | Supports "evening screen light matters", not any theme-specific claim. |
| Many "blue-blocking" glasses filter too little to matter for the body clock. **(new)** | Glickman et al. 2025, *Transl Vis Sci Technol* 14(7):25, [doi:10.1167/tvst.14.7.25](https://doi.org/10.1167/tvst.14.7.25) | Optical measurements and narrative review | 26 products | Only products with melanopic daylight filtering density ≥ 1 justify the label. Some authors have ties to f.lux. | Mechanism | The myths section separates clear "blue-light" computer lenses from the amber glasses used in sleep trials. |

### 8. Digital eye strain

| Claim | Source | Study type | n | Key result | Evidence | Implication for Fovea |
|---|---|---|---|---|---|---|
| Digital eye strain has many causes: reduced and incomplete blinking, uncorrected refractive error, binocular vision problems, cognitive load and glare. | Wolffsohn et al. 2023, TFOS Lifestyle report, *Ocul Surf* 28:213–252, [doi:10.1016/j.jtos.2023.04.004](https://doi.org/10.1016/j.jtos.2023.04.004) | Expert consensus with a systematic review of treatments | — | In one study blinking fell from 18.4 to 3.6 per minute. Matching screen brightness to the room lowered prevalence but not severity, in two cross-sectional studies. | Expert opinion | A theme can address only glare and contrast; the comfort guide covers the rest. |
| An integrative review groups the mechanisms into six domains. **(new)** | Manna 2026, *Clin Optom* 18:1–23, [doi:10.2147/OPTO.S586750](https://doi.org/10.2147/OPTO.S586750) | Single-author integrative review | 128 studies | Cognitive load cuts blink rate by about 25%; incomplete blinks were 14.5% on screens vs 5% on paper. | Systematic review (narrative) | Comfort guide. |
| 20-20-20 reminders reduced symptoms over 2 weeks; the gain was not maintained a week after they stopped. | Talens-Estarelles et al. 2023, *Cont Lens Anterior Eye* 46(2):101744, [doi:10.1016/j.clae.2022.101744](https://doi.org/10.1016/j.clae.2022.101744) | Single-group before–after study | 29 | Symptom score 11 → 8 (p = 0.001); not maintained one week later (p > 0.05); no control group. | Experiment (small, uncontrolled) | The comfort guide recommends breaks and says the evidence is limited. |
| With dark-on-light screens, performance is best when the surroundings roughly match the screen's brightness; with light-on-dark screens, when the surroundings are brighter. | ANSI/HFES 100-2007, *Human Factors Engineering of Computer Workstations* (read from a [hosted copy](https://www.trescoconsoles.com/wp-content/uploads/2023/11/ANSI_HFES_100-200727E2.pdf)) | Standard | — | For light-on-dark screens, the best background luminance is about 5 times the average screen luminance. | Expert opinion (standard) | Day suits bright rooms; with the dark variants, keep some room light on. |
| Eye-care bodies recommend 20-20-20 breaks and matching screen brightness to the room. | American Academy of Ophthalmology, <https://www.aao.org/eye-health/tips-prevention/computer-usage>; American Optometric Association, <https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome> | Clinical guidance | — | AAO: "Adjust your screen brightness to match the level of light around you." | Expert opinion | Comfort guide. The AOA page is not cited for blue light, where it contradicts Cochrane and the AAO. |

### 9. Color-vision deficiency

| Claim | Source | Study type | n | Key result | Evidence | Implication for Fovea |
|---|---|---|---|---|---|---|
| Up to about 8% of men and 0.5% of women of European ancestry have congenital red–green CVD; deuteranomaly alone affects about 4.6% of men. | Simunovic 2010, *Eye* 24(5):747–755, [doi:10.1038/eye.2009.251](https://doi.org/10.1038/eye.2009.251) | Narrative review | — | Protanomaly 1.08%, deuteranomaly 4.63%, protanopia 1.01%, deuteranopia 1.27%; tritan defects up to 1 in 500. | Expert opinion | Every semantic pair is checked under simulation and must also differ in lightness. |
| Machado et al.'s model simulates red–green deficiency at any severity; its tritan matrix approximates tritanomaly, and the authors do not model tritanopia. | Machado, Oliveira & Fernandes 2009, *IEEE TVCG* 15(6):1291–1298, [doi:10.1109/TVCG.2009.113](https://doi.org/10.1109/TVCG.2009.113); matrices from the [authors' project page](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html) | Computational model with a small validation | 13 with CVD, 17 controls, no tritans | "We … restrain our model from trying to model tritanopia." The page does not say whether to linearize RGB first. | Mechanism | Machado for protanopia and deuteranopia, applied in linear RGB ([decision 002](decisions/002-cvd-simulation.md)). |
| Brettel 1997 is the valid choice for simulating tritanopia. | Brettel, Viénot & Mollon 1997, *JOSA A* 14(10):2647, [doi:10.1364/JOSAA.14.002647](https://doi.org/10.1364/JOSAA.14.002647); DaltonLens review (updated Nov 2021), <https://daltonlens.org/opensource-cvd-simulation/>; constants from [libDaltonLens](https://github.com/DaltonLens/libDaltonLens) (public domain) | Model; practitioner review | — | "For tritanopia the Brettel 1997 approach is still the most solid and basically only valid choice." | Mechanism | Every semantic pair is also checked under Brettel tritanopia ([decision 002](decisions/002-cvd-simulation.md)). |
| culori applies the Machado matrices to gamma-encoded sRGB and snaps severity to 0.1 steps. | culori source, <https://github.com/Evercoder/culori/blob/main/src/deficiency.js> | Source code | — | It multiplies gamma-encoded values; its interpolation branch never runs. | — | colorlab implements the matrices itself, in linear RGB. |
| SVG filter primitives work in linear RGB by default. | MDN, `color-interpolation-filters`, <https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/color-interpolation-filters> | Documentation | — | The initial value is `linearRGB`; CSS filter functions use sRGB. | — | The site's CVD preview uses SVG `feColorMatrix` filters. |

### 10. Background color

| Claim | Source | Study type | n | Key result | Evidence | Implication for Fovea |
|---|---|---|---|---|---|---|
| Black text on warm tints (peach, orange, yellow) was read faster than on cool tints, by readers with and without dyslexia. White was not tested. | Rello & Bigham 2017, *ASSETS '17*, [doi:10.1145/3132525.3132546](https://doi.org/10.1145/3132525.3132546) | Online within-subject experiment | 341 (89 with dyslexia) | Dyslexia group: 14.85 s on peach vs 21.57 s on blue-grey per paragraph. No standardized effect sizes. | Experiment | Day uses a subtly warm paper. The study supports warm over cool, not warm over white. |
| Dyslexia guidance recommends dark text on a light background that is not white, such as cream. | British Dyslexia Association, *Dyslexia Style Guide* (2023), via <https://www.bdadyslexia.org.uk/resources> | Guideline | — | "Use dark coloured text on a light (not white) background." | Expert opinion | Same. |

### 11. Syntax highlighting

| Claim | Source | Study type | n | Key result | Evidence | Implication for Fovea |
|---|---|---|---|---|---|---|
| Highlighted code was solved faster, and the benefit shrank with experience. | Sarkar 2015, *PPIG 2015*, <https://ppig.org/papers/2015-ppig-26th-sarkar1/> | Within-subject eye-tracking experiment | 10 | Median 8.4 s faster (p = 0.047) on short tasks. | Experiment (very small) | Highlighting helps a little, so restraint costs little. |
| There was no evidence that highlighting improved novices' comprehension. | Hannebauer, Hesenius & Gruhn 2018, *Empir Softw Eng* 23(5):2795–2828, [doi:10.1007/s10664-017-9579-0](https://doi.org/10.1007/s10664-017-9579-0) (abstract only) | Within-subject experiment | 390 | "The data provided no evidence that syntax highlighting improves novices' ability to comprehend source code." | Experiment | Same. |
| Reading behavior showed no significant difference. | Beelders & du Plessis 2016, *J Eye Mov Res* 9(1), [doi:10.16910/jemr.9.1.1](https://doi.org/10.16910/jemr.9.1.1) | Between-groups eye-tracking experiment | 34 | Trends favored color; statistical power was 0.06–0.63. | Experiment (small) | Same. |
| Scope (background) highlighting changed gaze but not correctness or speed. | Park et al. 2023, *ICER '23*, [doi:10.1145/3568813.3600133](https://doi.org/10.1145/3568813.3600133) | Eye-tracking experiment | not checked | "No difference … in terms of correctness, or speed to produce correct answers." | Experiment | No scope-background tints. |
| Practitioners argue for coloring fewer, rarer token classes. | Tonsky 2025, <https://tonsky.me/blog/syntax-highlighting/> | Blog post | — | "If everything is highlighted, nothing is highlighted." | Expert opinion | At most six syntax hues plus reserved red; punctuation muted. |
| Others reply that keyword color helps catch typos. | Hacker News discussion of the post, <https://news.ycombinator.com/item?id=45596960> | Practitioner discussion | 141 comments | A misspelled keyword shows up as plain text. | Expert opinion (anecdotal) | Keywords keep a quiet but distinct color. |
| People find about five colors at a glance reliably, and up to seven if they fall in different color categories. | Healey 1996, *IEEE Visualization '96*, [doi:10.1109/VISUAL.1996.568118](https://doi.org/10.1109/VISUAL.1996.568118); numbers verified in [Healey's 1996 PhD thesis](https://www.cs.ubc.ca/labs/imager/th/1996/Healey1996/Healey1996.pdf) | Visual-search experiments | 38 | Three and five colors were found rapidly and accurately; results for seven and nine were mixed. | Experiment | Six syntax hues plus red is at the upper end, so the hues are kept in distinct color categories. |

### 12. Typography

| Claim | Source | Study type | n | Key result | Evidence | Implication for Fovea |
|---|---|---|---|---|---|---|
| Atkinson Hyperlegible Next and Mono are designed for low-vision readers. | Braille Institute, <https://www.brailleinstitute.org/freefont> | Designer's page | — | No legibility study is cited. | Expert opinion | The site uses them for prose and code. |
| The Google Fonts and Fontsource releases are under the SIL Open Font License 1.1. | [Google Fonts licence page](https://fonts.google.com/specimen/Atkinson+Hyperlegible+Next/license); [OFL.txt](https://raw.githubusercontent.com/googlefonts/atkinson-hyperlegible-next/main/OFL.txt); npm `@fontsource/atkinson-hyperlegible-next` and `@fontsource/atkinson-hyperlegible-mono` 5.3.0 | Licence | — | The Braille Institute's own download comes with its own EULA. | — | Self-hosted from Fontsource, crediting the OFL release. |
| Dyslexia guidance advises against italics and underlining, and suggests bold for emphasis. | British Dyslexia Association, *Dyslexia Style Guide* (2023) | Guideline | — | "Avoid underlining and italics as this can make the text appear to run together and cause crowding." | Expert opinion | No italics by default. Underline is kept only for links and invalid code, where it is the cue that doesn't depend on hue. |

### 13. White point

| Claim | Source | Study type | n | Key result | Evidence | Implication for Fovea |
|---|---|---|---|---|---|---|
| White lamps are held within ±0.006 Duv of a target that rises to +0.003 at 6500 K, about a 7-step MacAdam ellipse. | ANSI C78.377-2008 (read from a [hosted copy](https://ptacts.uspto.gov/ptacts/public-informations/petitions/1553636/download-documents?artifactId=uT6ZhRErO6Ggr0AebIdnW7bjhgs_wpt-_GXHf5vg37F2KTPDAteY72g)); Ohno 2014, *LEUKOS* 10(1):47–55, [doi:10.1080/15502724.2014.839020](https://doi.org/10.1080/15502724.2014.839020) | Standard | — | Duv is positive above the Planckian locus (yellowish) and negative below (pinkish). D65 has Duv ≈ +0.003. | Expert opinion (standard) | "No green or magenta cast" is tested as \|Duv\| ≤ 0.006. |

## Benchmark: default text on its own background

Recomputed with colorlab (Color.js APCA 0.0.98G-4g and WCAG 2.2). Colors were read from each theme's official source; see the [standards verification notes](research/verification/c-standards-licensing.md) for URLs.

| Theme | Text | Background | APCA Lc | WCAG 2 | Brief said |
|---|---|---|---|---|---|
| Solarized Dark | `#839496` | `#002b36` | −39.5 | 4.75:1 | 40, 4.8:1 |
| Solarized Light | `#657b83` | `#fdf6e3` | 65.7 | 4.13:1 | 66, 4.1:1 |
| Tokyo Night Day (folke/tokyonight.nvim) | `#3760bf` | `#e1e2e7` | 61.9 | 4.52:1 | 62, 4.5:1 |
| Tokyo Night | `#a9b1d6` | `#1a1b26` | −59.3 | 8.10:1 | **74, 10.6:1** |
| VS Code Dark Modern | `#cccccc` | `#1f1f1f` | −73.7 | 10.26:1 | 74, 10.3:1 |
| Catppuccin Latte | `#4c4f69` | `#eff1f5` | 79.3 | 7.06:1 | 79, 7.1:1 |
| Catppuccin Mocha | `#cdd6f4` | `#1e1e2e` | −80.0 | 11.34:1 | 80, 11.3:1 |
| Nord | `#d8dee9` | `#2e3440` | −80.3 | 9.25:1 | 80, 9.3:1 |
| GitHub Dark Default | `#e6edf3` | `#0d1117` | −95.0 | 16.02:1 | 95, 16.0:1 |

Negative Lc means light text on a dark background. The Tokyo Night VS Code theme (enkia, now the tokyo-night organization) ships Night, Storm and Light, but no Day; the Day row comes from folke's Neovim theme. The brief's conclusion stands: WCAG 2 rates dark themes far higher than APCA does.

## Reference data used by the tests

- **OKLab.** Björn Ottosson's matrices and the four XYZ → OKLab reference rows, from <https://bottosson.github.io/posts/oklab/> (matrices updated 2021-01-25).
- **APCA.** All eight published reference pairs (see §6), reproduced through Color.js 0.7.1, which takes the background first.
- **WCAG 2.2.** Relative luminance with the 0.04045 threshold, from the Recommendation's definitions.
- **Machado 2009.** The three severity-1.0 matrices, digit for digit from the authors' project page, cross-checked against culori.
- **Brettel 1997.** libDaltonLens's precomputed tritanopia constants (Smith & Pokorny 1975 cone fundamentals, sRGB white as the neutral axis). The tests check that each row of the difference between the two projections is parallel to the separation-plane normal, which catches any mistyped constant.
- **McCamy 1992** CCT, *Color Res Appl* 17(2):142–144, [doi:10.1002/col.5080170211](https://doi.org/10.1002/col.5080170211), in the form n = (x − 0.3320)/(0.1858 − y) with a positive polynomial. D65 gives about 6504 K. The version printed on Wikipedia mixes two sign conventions and gives 4664 K for D65; don't copy it.
- **Krystek 1985** Planckian locus in CIE 1960 (u, v), *Color Res Appl* 10(1):38–40, [doi:10.1002/col.5080100109](https://doi.org/10.1002/col.5080100109), valid for 1000–15000 K. It is used for Duv, with the sign convention of ANSI C78.377.

## Corrections to the brief

1. **Row 1.** Light mode is read more accurately *and* faster, and the gap grows as text gets smaller. The brighter screen shrinks the pupil; the sharper retinal image is the authors' hypothesis. When overall screen brightness is equalized, the advantage disappears. The penalty is largest in a dark room and persisted under office lighting; it was no longer significant in one glance-reading study at 4,750 lux. **In Fovea:** Day is described as the most legible variant in general, not only for bright rooms ([decision 005](decisions/005-variant-guidance.md)).
2. **Row 2.** Comfort results are mixed. Xie et al. could be checked only at abstract level. Flicker fusion is not a validated fatigue measure, the dry-eye difference was borderline (p = 0.048), and other studies favor light mode or find no difference.
3. **Row 3.** "Especially in astigmatic eyes" was not tested: larger pupils cost optical quality with and without astigmatism. Palmén et al. measured reading speed online, never mention astigmatism, and found no sign of halation. **In Fovea:** the halation guards (no pure white or black, capped text contrast) are presented as design hypotheses.
4. **Row 4.** Neither study matched the colors' luminance, and Fan et al. had 10 people per color. "About 2 D" is right, but the Thibos 1990 abstract gives no figure; Thibos et al. 1992 and Howarth & Bradley 1986 do. Chromostereopsis comes mainly from interocular differences in *transverse* chromatic aberration. The design rules are unchanged.
5. **Row 5.** The ~20–25′ zone is a diameter, and Williams et al. describe *functioning* S cones. L and M cones also carry red–green color signals; Mullen 1985 supports the step to "luminance carries fine detail".
6. **Row 6.** ISO/IEC 40500:2025 is the October 2023 text, not the current December 2024 one. APCA's levels carry font-size and weight conditions; Lc 15 applies only to non-semantic non-text, solid icons need Lc 30, and fine icons Lc 45. "Candidate for WCAG 3" is APCA's own description; the W3C draft names no method. The reference package's licence covers web content only, and the APCA name is a trademark ([decision 001](decisions/001-apca-via-colorjs.md)).
7. **Row 7.** Cochrane's wording is "may not" (low certainty), not "probably don't". The authors are Singh, Keller, Busija, McMillan, Makrai, Lawrenson, Hull and Downie; "Singh, Downie & Anderson 2023" is a different paper, on flicker fusion. The 2025 meta-analysis pooled 3 trials and 49 people. Melanopic EDI depends on spectrum as well as intensity.
8. **Row 8.** TFOS's "brightness" mechanism compares screens with paper. Matching the screen to the room rests on cross-sectional data, where it lowered prevalence but not severity. The 20-20-20 study had 29 people and no control group.
9. **Row 9 and §4.5.** 8% is the upper bound for European men. Machado 2009 is widely used but is not *the* standard, and its authors do not model tritanopia. **In Fovea:** semantic pairs are also checked under Brettel 1997 tritanopia ([decision 002](decisions/002-cvd-simulation.md)).
10. **Row 10.** Rello & Bigham never tested white, so they don't support "warm, not white". The BDA guide does recommend it, as expert opinion.
11. **Row 11.** Hannebauer et al. found "no evidence" of a comprehension gain, which is not proof of no gain. Beelders & du Plessis were underpowered. Healey's result is about five colors reliably, up to seven if they fall in distinct color categories.
12. **Row 12.** The OFL covers the Google Fonts and Fontsource releases. The names carry ® marks, so modified builds must not use the Atkinson name. The BDA guide advises against italics in general, and against underlining too.
13. **Benchmark.** Tokyo Night is Lc 59 and 8.1:1. "Tokyo Night Day" comes from folke's tokyonight.nvim, not the VS Code theme.

## Contested or unknown

- **Is dark mode more comfortable?** Unresolved. One study favors dark mode in both bright and dark rooms (Xie et al.), one only in bright rooms (Pathari et al.), one favors light mode (Lin et al.), and others find no difference in reported strain (Buchner & Baumgartner; Piepenbrock et al. 2013; Sengsoon & Intaruk).
- **Halation.** Plausible from optics, but never tested directly. Two small acuity studies found light-on-dark letters, if anything, *less* affected by blur or aberrations. No study shows that avoiding pure white or pure black, or capping text contrast, helps.
- **Warm versus white backgrounds.** Untested. Warm beat cool in one large online study.
- **APCA's future.** WCAG 3 has not chosen a contrast method; an open W3C issue questions APCA's luminance step; APCA's own documents give inconsistent font sizes. Code is set at 12–15 px, below several of APCA's reference sizes, so the Lc targets are approximate for code.
- **Simulation accuracy.** CVD models are validated on small samples. Machado et al. had no tritan participants, and tritanopes are rarely included in any validation.
- **Flicker fusion as a fatigue measure.** Disputed in direction and validity.
- **Size of the syntax-highlighting benefit.** All studies are small or short, and none found was a peer-reviewed 2024–2026 experiment on token coloring. One 2025 undergraduate thesis found faster fixes with highlighting but no faster error finding (not peer reviewed).
- **Dark themes and sleep.** No 2024–2026 study tested dark mode itself on melatonin or sleep. Any effect would run through the amount and spectrum of light reaching the eye.

## Newer work found (2024–2026)

Beyond the 2025–2026 sources already in the brief (Xie et al. 2025; Sengsoon & Intaruk 2025; Ramasubramanian et al. 2026; Luna-Rangel et al. 2025; Manna 2026), verification found:

- **Polarity:** Luzsa & Mayr 2026 (replication in VR and mixed reality); Muhamad & Mokhtar 2024 (contrary, low reliability); Somkijrungroj et al. 2026 (lens-implant patients).
- **Comfort:** Lin et al. 2024 (light mode more comfortable); Pathari et al. 2024 (dark mode helps only in bright rooms); Ettling et al. 2025 (dark dashboards).
- **Light and sleep:** Höhn et al. 2024 (smartphone light and melatonin); Mao et al. 2025 (night modes and melanopic EDI); Glickman et al. 2025 (filter strength of "blue-blocking" glasses).
- **Standards:** the WCAG 3 Working Draft of 10 September 2026; ISO/IEC 40500:2025.
- **Just outside the window but directly relevant:** Roorda et al. 2023 (cause of chromostereopsis); Schöllhorn et al. 2023 (melanopic display light and sleep latency); Park et al. 2023 (scope highlighting).
