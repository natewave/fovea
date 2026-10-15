# Group A verification: display polarity, comfort, and optics

Verified 2026-10-14 for the Fovea research brief (rows 1–3, plus newer work). Every fact below comes from a page fetched in this session; URLs are listed per source. "Full text" means I read the paper body (publisher page, PMC, or an author-hosted copy). "Abstract only" means I could not open the body. "Via search" means the web-search tool fetched that exact URL and I read the saved page text.

## Summary

| Row | Verdict | Main correction |
|---|---|---|
| 1. Positive polarity advantage | PARTLY ACCURATE | Light mode is read more accurately *and* faster. The smaller pupil was measured; the sharper retinal image was inferred, not measured. "Disappears under bright light" rests on one glance-reading study at 4,750 lux; ordinary office light (≤550 lux) did not remove the advantage. |
| 2. Comfort can favor dark mode | PARTLY ACCURATE | The numbers match both abstracts. But Xie et al. could only be checked at abstract level, the flicker-fusion "benefit" relies on a contested reading of that measure, the dry-eye difference is borderline (p = 0.048), and other studies find no comfort difference or favor light mode. |
| 3. Pupils, astigmatism, halation | PARTLY ACCURATE | Kobashi et al. show larger pupils reduce optical quality with *and* without astigmatism; "especially in astigmatic eyes" was not tested. Palmén et al. do not support the optics claim at all. No direct test of dark mode with astigmatism was found. |

**The flagged DOI is correct.** doi:10.1145/3544548.3581552 resolves to Palmén, Gilbert & Crossland, "How bold can we be? The impact of adjusting font grade on readability in light and dark polarities," CHI '23, so the brief's authors, year, venue and DOI all match. The problem is how the brief uses it. The paper measures reading *speed* in an uncontrolled online setting, never mentions astigmatism, and reports no evidence of halation.

---

## Row 1: Positive polarity advantage

> Brief: "Dark text on a light background is read more accurately than light on dark (the 'positive polarity advantage'). The brighter screen constricts the pupil and sharpens the retinal image. The dark-mode penalty is largest in dark rooms; in some studies it disappears under bright light."

### 1a. Piepenbrock, Mayr & Buchner 2014: pupil size (*Ergonomics*)

1. **Citation.** Piepenbrock C, Mayr S, Buchner A. (2014). Smaller pupil size and better proofreading performance with positive than with negative polarity displays. *Ergonomics* 57(11):1670–1677. doi:10.1080/00140139.2014.948496. PMID 25135324.
   Fetched:
   - https://api.crossref.org/works/10.1080/00140139.2014.948496
   - https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=25135324&rettype=abstract&retmode=text
   - Author preprint, full text (via search): https://www.psychologie.hhu.de/fileadmin/redaktion/Oeffentliche_Medien/Fakultaeten/Mathematisch-Naturwissenschaftliche_Fakultaet/Psychologie/AAP/Publikationen/in_press/Piepenbrock-in_press-Smaller_pupil_size_and_better.pdf
   - https://pubmed.ncbi.nlm.nih.gov/25135324/ returned HTTP 403.
2. **Study type.** Lab experiment, within-subject, with eye-tracked pupil size.
3. **Sample.** 35 analyzed (26 women), aged 20–30; 9 excluded. Normal or corrected vision.
4. **Key results.**
   - Setup: a dark room (0.1 lx with the monitor off). Light reaching the eye was 118.4 lx with dark-on-light and 2.7 lx with light-on-dark. White was 328.8 cd/m²; text was 10-pt Helvetica.
   - Pupil diameter was 2.09 mm vs 3.65 mm (t(34) = −17.49, dz = 2.96).
   - Proofreading accuracy was better with dark-on-light (dz = 0.77), and reading rate was higher (dz = 0.68). Accuracy and reading rate both rose as pupil size fell (mixed model).
   - 82% preferred dark-on-light (n = 34), yet 78% reported more glare with it (n = 27).
   - The authors are explicit about limits: "Image quality was not measured directly," and "given that we only measured but did not manipulate pupil size, the present experiment does not allow drawing conclusions about causal effects."
5. **Verdict.** Supports "read more accurately" and "brighter screen → smaller pupil." "Sharpens the retinal image" is the authors' hypothesis, not a measurement. Because it was run only in a dark room, it says nothing about room lighting.
6. **Evidence label:** experiment.

### 1b. Piepenbrock, Mayr & Buchner 2014: character size (*Human Factors*)

1. **Citation.** Piepenbrock C, Mayr S, Buchner A. (2014). Positive display polarity is particularly advantageous for small character sizes: implications for display design. *Human Factors* 56(5):942–951. doi:10.1177/0018720813515509. PMID 25141597. It was published online in 2013, which is why Dobres et al. cite it as "2013a."
   Fetched:
   - https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=25141597&rettype=abstract&retmode=text
   - https://api.semanticscholar.org/graph/v1/paper/DOI:10.1177/0018720813515509?fields=title,authors,year,venue,abstract,externalIds,publicationDate,journal
   - Author preprint, full text (via search): https://www.psychologie.hhu.de/fileadmin/redaktion/Oeffentliche_Medien/Fakultaeten/Mathematisch-Naturwissenschaftliche_Fakultaet/Psychologie/AAP/Publikationen/in_press/Piepenbrock_Mayr_Buchner_inpress_.pdf
2. **Study type.** Lab experiment. Polarity varied between participants; character size (8/10/12/14 pt, i.e. 0.22°–0.34°) varied within.
3. **Sample.** 160 analyzed (165 recruited, 119 women; 5 excluded), aged 18–44 (mean 23.6).
4. **Key results.**
   - Setup: a dark room (<0.1 lx); light at the eye was 116 lx (dark-on-light) vs 4 lx (light-on-dark).
   - Proofreading showed a polarity effect, F(1,158) = 9.34, p = .003, η² = .056.
   - Polarity interacted with the linear size trend, F(1,158) = 8.92, p = .003: "the positive polarity advantage linearly increased with decreasing character size."
   - The polarity effect on reading rate "just missed" significance (p = .055).
   - Pupils were not measured.
5. **Verdict.** Supports "read more accurately," especially for small text. Supports the brightness explanation only indirectly. Silent on room lighting.
6. **Evidence label:** experiment.

### 1c. Piepenbrock, Mayr, Mund & Buchner 2013: younger and older adults (*Ergonomics*)

1. **Citation.** Piepenbrock C, Mayr S, Mund I, Buchner A. (2013). Positive display polarity is advantageous for both younger and older adults. *Ergonomics* 56(7):1116–1124. doi:10.1080/00140139.2013.790485. PMID 23654206.
   Fetched:
   - https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=23654206&rettype=abstract&retmode=text
   - https://api.semanticscholar.org/graph/v1/paper/DOI:10.1080/00140139.2013.790485?fields=title,authors,year,venue,abstract,externalIds,publicationDate,journal
   - Author PDF, full text (via search): https://www.psychologie.hhu.de/fileadmin/redaktion/Oeffentliche_Medien/Fakultaeten/Mathematisch-Naturwissenschaftliche_Fakultaet/Psychologie/AAP/Publikationen/2013/Piepenbrock-2013-Positive_display_polarity_is_.pdf
2. **Study type.** Lab experiment; polarity and age group both varied between participants.
3. **Sample.** 85 older and 84 younger adults.
4. **Key results.**
   - Light at the eye during proofreading was 117 lx vs 3 lx.
   - Visual acuity was better with dark-on-light for both younger (d = 2.17) and older adults (d = 0.58).
   - Proofreading showed a polarity effect, F(1,165) = 9.92, p < .01, η² = 0.06, with no interaction with age.
   - Reading rate showed no polarity effect (p = 0.69).
   - Self-reported eyestrain and headache showed essentially no polarity effects (1 of 18 tests significant).
5. **Verdict.** Supports "read more accurately" across ages, with a smaller advantage in older eyes. No pupil or ambient-light test.
6. **Evidence label:** experiment.

**Which Piepenbrock paper supports which part of Row 1?**
- **Accuracy advantage:** all three papers.
- **Brighter screen shrinks the pupil:** only the 2014 *Ergonomics* paper, which measured it.
- **Sharper retinal image:** none; this is inferred from the optics literature.
- **Room lighting:** none; all three were run in dark rooms.

### 1d. Dobres, Chahine & Reimer 2017 (*Applied Ergonomics*)

1. **Citation.** Dobres J, Chahine N, Reimer B. (2017). Effects of ambient illumination, contrast polarity, and letter size on text legibility under glance-like reading. *Applied Ergonomics* 60:68–73. doi:10.1016/j.apergo.2016.11.001. PMID 28166901.
   Fetched:
   - Author PDF, full text (via search): https://jdobr.es/pdf/Dobres-etal-2017-Ambient.pdf
   - https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=28166901&rettype=abstract&retmode=text
2. **Study type.** Lab experiment, within-subject. Participants made a word/non-word decision on single Italian words, with display time adjusted adaptively. This measures glance legibility, not sustained reading.
3. **Sample.** 34 analyzed out of 50 recruited (13 women, mean age 36.2; 21 men, mean age 39.0). Fiat Chrysler employees in Turin, with normal or corrected vision.
4. **Key results.**
   - Ambient light was near 0 lux vs 4,750 lux ("slightly overcast daylight"). The monitor was set to about 225 cd/m² in the dark condition and 300 cd/m² in the bright one.
   - Display-time thresholds (ms; lower = more legible; "3 mm" and "4 mm" are capital-letter heights):

     | Ambient | Polarity | 3 mm | 4 mm |
     |---|---|---|---|
     | ~0 lux | Light-on-dark | 122.3 | 106.9 |
     | ~0 lux | Dark-on-light | 84.1 | 83.3 |
     | 4,750 lux | Light-on-dark | 88.7 | 92.2 |
     | 4,750 lux | Dark-on-light | 86.0 | 77.5 |

   - Lighting and polarity interacted, F(1,33) = 14.18, p < 0.001.
   - In the dark room, the polarity effect was large: F(1,33) = 49.60, p < 0.001.
   - In bright light it was not significant: F(1,33) = 0.19, p = 0.665. Light mode was still "nominally" better.
   - The authors propose calling it a "negative polarity disadvantage."
   - Limitation: the bright sessions always came first, so session order was not counterbalanced.
5. **Verdict.** Supports "penalty largest in dark rooms" and "disappeared under bright light," but only in this one study, at daylight-level light, for glance reading. The brief should say "in one study, at 4,750 lux" rather than "in some studies."
6. **Evidence label:** experiment.

### 1e. Palmén, Gilbert & Crossland 2023 (CHI '23): the flagged DOI

1. **Citation.** Palmén H, Gilbert M, Crossland D. (2023). How bold can we be? The impact of adjusting font grade on readability in light and dark polarities. In *Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems (CHI '23)*, Hamburg, pp. 1–11. ACM. doi:10.1145/3544548.3581552. The authors are at Google LLC; the paper is CC BY 4.0.
   Fetched:
   - https://api.crossref.org/works/10.1145/3544548.3581552
   - https://api.semanticscholar.org/graph/v1/paper/DOI:10.1145/3544548.3581552?fields=title,authors,year,venue,abstract,externalIds
   - Full text (via search): https://dl.acm.org/doi/fullHtml/10.1145/3544548.3581552. A direct fetch of this URL and of https://dl.acm.org/doi/10.1145/3544548.3581552 timed out.
   - Crossref search of 2023 ACM records on dark/light polarity and readability: https://api.crossref.org/works?query.bibliographic=dark+mode+light+mode+polarity+readability&filter=prefix:10.1145,from-pub-date:2023-01-01,until-pub-date:2023-12-31&rows=15&select=DOI,title,author,container-title
   - Crossref search for CHI 2023 low-vision/polarity papers: https://api.crossref.org/works?query.bibliographic=low+vision+dark+mode+contrast+polarity+reading&filter=prefix:10.1145,from-pub-date:2023-04-01,until-pub-date:2023-05-31&rows=10&select=DOI,title,container-title
2. **Study type.** Two online, unmoderated experiments. Room light and screen brightness were not controlled.
3. **Sample.** 459 analyzed in total.
   - Study 1: 126 Mechanical Turk workers (184 recruited) read word pairs on a desktop in 16 px Roboto Flex.
   - Study 2: 333 US panel members (410 screened) read paragraphs on Android phones in 14 px, using #FFFFFF and #121212.
4. **Key results.**
   - "Dark text on a light background (Light Mode) is read reliably faster than its polar opposite (Dark Mode)."
   - Study 1: mode effect p = 0.004, ηp² = 0.075; for example, 1.93 s vs 2.06 s per word pair (d = 0.16).
   - Study 2: F = 12.8, p < 0.01, ηp² = 0.038.
   - Changing font grade (stroke weight) did not help dark mode.
   - Readers judged clarity equal (41% light, 42% dark, 17% neither); preference split 33/33/34.
   - On halation, the authors say it "does not appear to have been directly studied" and that "We did not uncover a performance effect or a subjective assessment that indicated any effect on fluency attributable to halation."
   - No pupil measurement; astigmatism is never mentioned.
   - The authors add: "We have not unraveled the extent to which the impact of LM on increased fluency was attributable to increased luminance."
5. **Verdict.** The brief's citation is correct. The paper supports a small light-mode **speed** advantage, even with a near-black #121212 background. It does not support "more accurately" (accuracy wasn't the outcome), the pupil mechanism, or the room-lighting claim. The two Crossref searches found no other CHI 2023 paper on dark mode or polarity. The low-vision query surfaced unrelated accessibility papers; I didn't open them.
6. **Evidence label:** experiment.

### Supporting sources found while checking Row 1

**Buchner, Mayr & Brandt 2009.** The advantage of positive text-background polarity is due to high display luminance. *Ergonomics* 52(7):882–886. doi:10.1080/00140130802641635.
- Fetched (author PDF, full text, via search): https://www.psychologie.hhu.de/fileadmin/redaktion/Oeffentliche_Medien/Fakultaeten/Mathematisch-Naturwissenschaftliche_Fakultaet/Psychologie/AAP/Publikationen/2009/Buchner_Mayr_Brandt__2009_.pdf
- Lab experiment, n = 124, in a 5 lx room. When overall screen brightness was equalized between polarities, the polarity effect disappeared (F(1,120) = 0.04, p = 0.85), while brighter screens improved proofreading.
- In the authors' words: "Display polarity per se does not affect readability."
- **Evidence label:** experiment.

**Buchner & Baumgartner 2007.** Text–background polarity affects performance irrespective of ambient illumination and colour contrast. *Ergonomics* 50(7):1036–1063. doi:10.1080/00140130701306413.
- Fetched: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=17510822&rettype=abstract&retmode=text
- A series of experiments. The positive polarity advantage "was independent of ambient lighting (darkness vs. typical office illumination)." Buchner 2009 and Dobres 2017 give those levels as 5 lx and 550 lx.
- Self-reported eyestrain, fatigue and headache did not vary with polarity. Sample sizes are not in the abstract.
- **Evidence label:** experiment.

### Row 1 verdict: PARTLY ACCURATE

- **"Read more accurately":** accurate; add "and faster."
- **"Constricts the pupil":** accurate (measured).
- **"Sharpens the retinal image":** inferred, not measured. Overall screen brightness, not polarity itself, drives the effect.
- **"Largest in dark rooms":** supported by Dobres 2017.
- **"Disappears under bright light":** shown in one study at daylight-level 4,750 lux. Under ordinary office light (≤550 lux) the advantage persisted.

**Suggested wording:** "Dark text on a light background is read more accurately and faster than light text on dark (the 'positive polarity advantage'), and the gap grows as text gets smaller. The brighter screen shrinks the pupil, which is thought to sharpen the retinal image; when overall screen brightness is equalized, the advantage disappears. The dark-mode penalty is largest in a dark room. It persisted under ordinary office lighting, and in one study it was no longer significant in daylight-level light (4,750 lux)."

**Implication check (my inference):** the brief recommends Day "for long reading in bright rooms." The cited evidence points the other way on lighting: light mode's legibility edge is largest in dark rooms, still present under office light, and smallest in very bright light.

---

## Row 2: Comfort can favor dark mode

> Brief: "Comfort can favor dark mode. Dark mode produced lower visual fatigue at both 450 lux and 3 lux. Very warm screen temperatures (2800 K) caused the most fatigue, and 4500 K did best in the dark. A one-hour tablet trial (n=30) found no difference in subjective fatigue, but dark mode scored better on critical flicker frequency and dry-eye symptoms."

### 2a. Xie, Yu & Chen 2025 (*IJHCI*)

1. **Citation.** Xie X, Yu S, Chen D. (2025). Effects of screen color mode and color temperature on visual fatigue under different ambient illuminations. *International Journal of Human–Computer Interaction* 41(2):821–833. doi:10.1080/10447318.2024.2305982. Published online 30 Jan 2024; issue dated 17 Jan 2025. Northwestern Polytechnical University, Xi'an.
   Fetched:
   - https://api.crossref.org/works/10.1080/10447318.2024.2305982
   - https://api.semanticscholar.org/graph/v1/paper/DOI:10.1080/10447318.2024.2305982?fields=title,authors,year,venue,abstract,externalIds,openAccessPdf,tldr (open-access status: CLOSED)
   - https://www.ingentaconnect.com/content/10.1080/10447318.2024.2305982 (abstract, via search)
   - https://www.tandfonline.com/doi/full/10.1080/10447318.2024.2305982 and https://www.tandfonline.com/doi/abs/10.1080/10447318.2024.2305982 both timed out.
   - **Abstract only.**
2. **Study type.** Lab experiment with a 2 × 2 × 3 design (display mode × room light × screen color temperature).
3. **Sample.** 36 participants; demographics not in the abstract.
4. **Key results.**
   - Conditions: room light 450 lux vs 3 lux; light vs dark mode; screen white point 2800 K, 4500 K or 6500 K.
   - Measures: blink rate and pupil diameter from eye tracking, plus subjective fatigue and preference ratings (the abstract calls the rating scale a "Richter scale").
   - Abstract: "At 450 lux, lower visual fatigue was found in the dark mode, 4500 K and 6500 K. At 3 lux, the visual fatigue was lower in the dark mode and 4500 K color temperature. Whether at daytime or night, the 2800 K color temperature resulted in the highest visual fatigue."
   - Not available from the abstract: task, duration, effect sizes, and which measures drove the conclusions.
5. **Verdict.** ACCURATE against the abstract: authors, journal, volume/issue and findings all match. Add that n = 36, that this is abstract-level verification only, and that at 450 lux 6500 K did as well as 4500 K.
6. **Evidence label:** experiment.

### 2b. Sengsoon & Intaruk 2025 (*IJERPH*)

1. **Citation.** Sengsoon P, Intaruk R. (2025). Immediate effects of light mode and dark mode features on visual fatigue in tablet users. *International Journal of Environmental Research and Public Health* 22(4):609. doi:10.3390/ijerph22040609. PMID 40283833. Walailak University, Thailand; CC BY.
   Fetched:
   - https://www.mdpi.com/1660-4601/22/4/609 (full text, via search)
   - Full-text PDF mirror, read in full: https://www.wisdomlib.org/uploads/journals/mdpi-ijerph/2025-volume-22-issue-4--1660-4601-22-4-609-.pdf
   - PubMed record: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=42519904,42741702,41455733,41389698,40696033,40283833,39918051,39270564,38921075,38894307,38629123,38217359
2. **Study type.** Crossover experiment with block-randomized mode order and pre/post measurements; not blinded.
3. **Sample.** 30 women aged 18–25 with 20/20 vision. Myopia, hyperopia, **astigmatism**, strabismus and other conditions were exclusion criteria.
4. **Key results.**
   - Setup: iPad (7th–9th generation) at 100% brightness. Room light was 300–500 lux according to the Methods (the Discussion says 450–500 lux).
   - Each mode: 1 hour (30 min of a game plus 30 min reading a novel), with at least 30 min of rest between modes. Analysis used Wilcoxon tests with no correction for multiple comparisons.
   - CFF is critical flicker frequency, the fastest flicker a person can still see.

     | Outcome | Light: post-use (change) | Dark: post-use (change) | p, between modes |
     |---|---|---|---|
     | Visual-fatigue score | 18.37 ± 6.96 (+7.07) | 18.87 ± 7.01 (+6.27) | 0.305 |
     | CFF (Hz) | 41.35 ± 1.55 (+4.04) | 40.59 ± 1.85 (+3.16) | 0.001 |
     | Dry-eye score | 24.40 ± 7.69 (+7.60) | 22.73 ± 6.37 (+6.40) | 0.048 |

   - All three measures worsened after use in both modes (p < 0.001).
   - The authors treat a *higher* CFF as a sign of strain ("When eye strain occurs, the test yields a critical flicker frequency of 40 Hz or higher"). On that reading, the smaller rise in dark mode counts as "better."
5. **Verdict.** PARTLY ACCURATE. The facts match: n = 30, one hour per mode, no subjective difference, and significant CFF and dry-eye differences. But there are three caveats:
   - "Better CFF" depends on the authors' reading of which direction signals strain. Misawa & Shigeta 1986 treated a CFF *decrease* as the fatigue sign, and Singh et al. 2023 found CFF "is not a useful surrogate for symptoms of visual fatigue" (both below).
   - The dry-eye difference has p = 0.048 with no multiple-comparison correction, and both differences are small.
   - The sample was young women only, astigmatism was excluded, and only office lighting was tested.
6. **Evidence label:** experiment.

### Context sources for Row 2

**Singh, Downie & Anderson 2023.** Is critical flicker-fusion frequency a valid measure of visual fatigue? A post-hoc analysis of a double-masked randomised controlled trial. *Ophthalmic and Physiological Optics* 43(2):176–182. doi:10.1111/opo.13073. PMID 36416367.
- Fetched: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=36416367&rettype=abstract&retmode=text
- Secondary analysis of trial data from 120 adults with computer vision syndrome doing a 2-hour task. Symptoms rose (mean +92 units) but CFF did not change (−0.7 Hz, 95% CI −1.7 to 0.3).
- CFF was not correlated with symptoms (r = −0.13 post-task; r = −0.18 for change).
- **Evidence label:** experiment.

**Misawa & Shigeta 1986.** [An experimental study of work load on VDT performance. Part 1: effects of polarity of screen and color of display]. *Sangyo Igaku* 28(6):420–427 (in Japanese). doi:10.1539/joh1959.28.420. PMID 3586385.
- Fetched: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=42668777,25083837,19146331,3586385,7453066&rettype=abstract&retmode=text
- 8 men, CRT screens, 2 hours per condition: "A larger decreased in C.F.F. and greater complaints of subjective fatigue were demonstrated in subjects using negative screen."
- An old CRT study, cited here only for which direction of CFF change signals fatigue.
- **Evidence label:** experiment.

Also relevant (details in Row 1 and Newer work):
- Buchner & Baumgartner 2007 and Piepenbrock et al. 2013 found no polarity difference in self-reported eyestrain.
- Pathari et al. 2024 found dark mode reduced fatigue only in a bright room.
- Lin et al. 2024 found light mode reduced fatigue on a desktop head-up display.

### Row 2 verdict: PARTLY ACCURATE

**Suggested wording:** "Comfort results are mixed. In one lab study (n = 36), dark mode was rated less fatiguing at both 450 and 3 lux; a very warm 2800 K white point was worst, and 4500 K was best in the dark. A one-hour tablet crossover (n = 30 young women) found no difference in reported fatigue. Dark mode showed slightly lower post-use flicker-fusion values and dry-eye scores, but flicker fusion is not a validated fatigue measure and the dry-eye difference was borderline. Other studies found no comfort difference between modes, or less fatigue with light mode."

---

## Row 3: Pupil size, astigmatism and halation

> Brief: "Larger pupils lower optical quality, especially in astigmatic eyes. This is the plausible mechanism behind 'halation' (glowing text) in dark mode, but no study tests dark mode and astigmatism directly."

### 3a. PMC3706062: Kobashi et al. 2013

1. **Citation.** Kobashi H, Kamiya K, Yanome K, Igarashi A, Shimizu K. (2013). Effect of pupil size on optical quality parameters in astigmatic eyes using a double-pass instrument. *BioMed Research International* 2013:124327. doi:10.1155/2013/124327. PMID 23865038; PMCID PMC3706062. Kitasato University.
   Fetched:
   - https://pmc.ncbi.nlm.nih.gov/articles/PMC3706062/ (full text)
   - https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids=PMC3706062&format=json
   - https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pmc&id=3706062&retmode=json
2. **Study type.** Optics/mechanism study. A double-pass instrument (OQAS) measured how sharply each eye images a point of light.
3. **Sample.** 22 eyes of 22 healthy volunteers (12 women), aged 27.1 ± 2.8, with natural astigmatism of 0.25 D or less.
4. **Key results.**
   - Method: pupils were dilated with drops and refraction fully corrected. The authors then induced 0, 1, 2 and 3 D of with-the-rule astigmatism with lenses and used artificial pupils of 2, 4 and 6 mm (780 nm light, room about 25 lux).
   - Image sharpness was measured two ways: MTF cut-off (finest detail the eye's optics pass) and Strehl ratio (overall image quality relative to a perfect eye).
   - Both measures fell with more astigmatism and with larger pupils, at every astigmatism level (P < 0.001). Post-hoc tests were reported only for 2 vs 6 mm and 4 vs 6 mm.
   - Table 2, mean MTF cut-off (cycles/degree) at 2 mm → 6 mm: 0 D 48.4 → 32.2; 1 D 38.7 → 21.4; 2 D 29.8 → 16.0; 3 D 27.2 → 12.6.
   - Strehl ratio at 2 mm → 6 mm: 0 D 0.30 → 0.17; 3 D 0.13 → 0.08.
   - My calculation from Table 2: going from a 2 mm to a 6 mm pupil cut MTF by 33% without astigmatism vs 45–54% with it, while Strehl fell by about 40% at every level.
   - The authors conclude: "Eyes with larger pupils had lower optical quality even when they were astigmatic."
5. **Verdict.** PARTLY ACCURATE.
   - Supported: "larger pupils lower optical quality," and astigmatism lowers it further.
   - Not tested: "especially in astigmatic eyes." There was no interaction test, and Strehl losses were proportionally similar with and without astigmatism.
   - Out of scope: no displays, text, polarity or halation; artificial pupils and lens-induced astigmatism only.
   - The real dark-vs-light desk pupils in Piepenbrock 2014 (2.09 vs 3.65 mm) fall in the 2–4 mm range, which this study did not compare statistically.
6. **Evidence label:** mechanism.

### 3b. Palmén et al. 2023 as a Row 3 source

This is the same paper as 1e. It does not measure pupils or optical quality and never mentions astigmatism. It says halation "does not appear to have been directly studied" and found no performance or self-reported-clarity evidence of it.

**Verdict for this use: WRONG.** Cite it only for: "halation is discussed in design writing but untested; one large online study found no sign of it."

### 3c. Search for direct tests of dark mode with astigmatism or halation (2015–2026)

Searches run:
1. Web: `dark mode astigmatism reading study negative polarity text legibility astigmatic participants`
2. Web: `halation light text on dark background astigmatism experiment visual acuity contrast polarity`
3. Web: `astigmatism "white-on-black" OR "reversed contrast" text reading speed legibility study 2020 2021 2022 2023 2024 2025 induced astigmatism polarity`
4. PubMed: `astigmatism[tiab] AND (polarity OR "dark mode" OR "negative contrast" OR "reverse contrast" OR "white on black" OR "light on dark")[tiab]` returned 5 records, none a 2015–2026 polarity test in astigmatic eyes. URL: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax=50&term=astigmatism[tiab]+AND+(polarity[tiab]+OR+%22dark+mode%22[tiab]+OR+%22negative+contrast%22[tiab]+OR+%22reverse+contrast%22[tiab]+OR+%22white+on+black%22[tiab]+OR+%22light+on+dark%22[tiab])
5. PubMed: `halation[tiab] AND (text OR display OR screen OR reading OR astigmatism)[tiab]` returned 1 record, on ear-speculum imaging (irrelevant). URL: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax=100&term=halation[tiab]+AND+(text[tiab]+OR+display[tiab]+OR+screen[tiab]+OR+reading[tiab]+OR+astigmatism[tiab])
6. PubMed: `"dark mode"[tiab] AND (screen OR display OR reading OR fatigue OR eye OR visual OR pupil)[tiab] AND 2024:2026[dp]` returned 5 records, none on astigmatism. URL: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax=100&term=%22dark+mode%22[tiab]+AND+(screen[tiab]+OR+display[tiab]+OR+reading[tiab]+OR+fatigue[tiab]+OR+eye[tiab]+OR+visual[tiab]+OR+pupil[tiab])+AND+2024:2026[dp]
7. PubMed: polarity terms combined with reading, legibility, fatigue, pupil or text, 2024–2026, returned 11 records, none on astigmatism. URL: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax=100&term=((%22display+polarity%22[tiab]+OR+%22contrast+polarity%22[tiab]+OR+%22text+polarity%22[tiab]+OR+%22negative+polarity%22[tiab]+OR+%22positive+polarity%22[tiab]+OR+%22light+mode%22[tiab])+AND+(reading[tiab]+OR+legibility[tiab]+OR+fatigue[tiab]+OR+pupil[tiab]+OR+text[tiab]))+AND+2024:2026[dp]
8. Semantic Scholar search API was rate-limited (HTTP 429), so that search was not completed.

**Result:** I found no 2015–2026 study that tests dark mode or light-on-dark text in astigmatic readers (natural or lens-induced), or that measures halation directly. Several polarity studies explicitly excluded astigmatism (Sengsoon & Intaruk 2025) or capped it at 1.00 D or less (Bernal-Molina et al. 2018; Muhamad & Mokhtar 2024; Ikaunieks et al. 2017).

**Closest related evidence (none is a direct test):**

- **Marcos, Sawides, Gambra & Dorronsoro 2008.** Influence of adaptive-optics ocular aberration correction on visual acuity at different luminances and contrast polarities. *Journal of Vision* 8(13):1. doi:10.1167/8.13.1. PMID 19146331. Fetched via the Misawa efetch URL above.
  - n = 7. Correcting astigmatism plus higher-order aberrations improved black-on-white acuity by a factor of 1.29 and white-on-black acuity by 1.13, with no benefit for white-on-black at high luminances.
  - The authors suggest "a role of ocular aberrations in the differences in visual performance between contrast polarities."
  - In this study the eye's optical flaws cost more acuity for dark-on-light letters than for light-on-dark ones. That does not fit a simple "astigmatism makes dark mode worse" story, although it measured acuity, not reading, and predates 2015.
  - **Evidence label:** mechanism.
- **Ikaunieks, Petrova, Panke & Krūmiņa 2017.** Visual acuity in myopes with standard and reversed contrast optotypes. *Proceedings of the Latvian Academy of Sciences, Section B* (2017).
  - Fetched: full text on a third-party mirror, https://exa.ai/library/publication/k3thh06vkhw. The publisher page and DOI were not opened.
  - 23 uncorrected nearsighted adults (astigmatism ≤1.00 D) plus controls. Acuity was better with white-on-black letters by 0.15 ± 0.02 logMAR (p < 0.001); with correction the gap shrank to about 0.04 logMAR.
  - This concerns defocus blur, not astigmatism.
  - **Evidence label:** mechanism.
- **Bernal-Molina, Esteve-Taboada, Ferrer-Blasco & Montés-Micó 2018/2019.** Influence of contrast polarity on the accommodative response. *Journal of Optometry* 12(1):38–43. doi:10.1016/j.optom.2018.03.002. PMID 29627300; PMC6318541.
  - Fetched: https://pmc.ncbi.nlm.nih.gov/articles/PMC6318541/ (via search) and https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=42049856,41564014,41541932,39270564,29627300&rettype=abstract&retmode=text
  - 18 adults (astigmatism ≤1.00 D). Pupils were significantly larger with white-on-black text, but the eye's focusing response did not change.
  - **Evidence label:** mechanism.
- **Rosenfield, Hue, Huang & Bababekova 2012.** The effects of induced oblique astigmatism on symptoms and reading performance while viewing a computer screen. *Ophthalmic and Physiological Optics* 32(2):142–148. doi:10.1111/j.1475-1313.2011.00887.x.
  - Fetched: https://api.crossref.org/works/10.1111/j.1475-1313.2011.00887.x
  - 12 participants. Adding 1–2 D of astigmatism raised symptom scores (medians 2.0, 6.5 and 40.0; p < 0.0001) without changing reading rate or errors. Polarity was not varied.
  - **Evidence label:** experiment.
- **Subjective blur reports:** in Luzsa & Mayr 2026 (VR), "more problems with blurriness were mentioned in negative polarity," while glare was reported more with positive polarity. Piepenbrock 2014 reported more glare with positive polarity, and its participants said focusing on words was harder with negative polarity. This fits a halation-like complaint but is not tied to astigmatism.

### Row 3 verdict: PARTLY ACCURATE

- **"Larger pupils lower optical quality":** accurate (mechanism study).
- **"Especially in astigmatic eyes":** overstated. The effect appears with and without astigmatism; the combination is worst.
- **"Plausible mechanism behind halation":** an untested hypothesis, and two small acuity studies point the other way.
- **"No study tests dark mode and astigmatism directly":** accurate as of these searches.
- **Palmén et al.:** does not support the optics claim.

**Suggested wording:** "Larger pupils reduce the eye's optical quality, and uncorrected astigmatism reduces it further; a large pupil combined with astigmatism gives the blurriest retinal image (lab optics study, 22 eyes). Dark mode enlarges the pupil, so it is plausible that astigmatic readers see light text as smeared or glowing ('halation'). This has not been tested. No study we found compares dark and light mode in astigmatic readers, one large reading study found no measurable halation effect, and two small acuity studies found light-on-dark letters were, if anything, less affected by blur or aberrations than dark-on-light letters."

**Implication check (my inference):** no study I verified shows that avoiding pure white, avoiding pure black, or capping text contrast reduces halation or improves dark-mode reading. Palmén's dark mode already used a near-black #121212 background and was still read more slowly. Present these choices as design hypotheses.

---

## Newer work (2024–2026)

### N1. Luzsa & Mayr 2026: VR and mixed reality (*Ergonomics*)

1. **Citation.** Luzsa R, Mayr S. (2026). The polarity effect in virtual and video see-through mixed reality: better proofreading performance and faster optotype identification with positive display polarity. *Ergonomics* 69(2):221–235. doi:10.1080/00140139.2025.2457470. PMID 39918051. Published online 7 Feb 2025; CC BY.
   Fetched:
   - https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=39918051,42741702,38629123&rettype=abstract&retmode=text
   - https://api.semanticscholar.org/graph/v1/paper/DOI:10.1080/00140139.2025.2457470?fields=title,authors,year,venue,abstract,externalIds,openAccessPdf,journal
   - Full text (via search): https://www.tandfonline.com/doi/full/10.1080/00140139.2025.2457470
2. **Study type.** Two within-subject lab experiments using a Varjo XR-3 headset (39 pixels per degree).
3. **Sample.** Study 1 (VR): 27 participants (20 women), aged 20–39. Study 2 (mixed reality): 37 participants (27 women), aged 19–37.
4. **Key results.**
   - Study 1: with dark-on-light, participants found 8% more errors (d = 0.68) and read 7% more words. They identified test letters faster (834 vs 872 ms, d = 0.41).
   - Study 1 pupils were 3.58 vs 7.07 mm (d = 5.25).
   - Study 1 preferences were split (15 preferred light-on-dark, 12 dark-on-light). Glare was reported more with dark-on-light, blur more with light-on-dark.
   - Study 2: dark-on-light was better for errors found (ηp² = 0.23), words read (ηp² = 0.30), test letters identified, and reaction time (732 vs 762 ms).
   - Study 2: the brightness of the real-world background (2.5 vs 82.5 cd/m²) had no effect and did not interact with polarity. The abstract reports that users preferred dark-on-light for reading in mixed reality.
5. **Relevance.** Replicates both the light-mode advantage and the pupil difference on a new kind of display.
6. **Evidence label:** experiment.

### N2. Lin, Ji & Lin 2024: desktop head-up display (*Ergonomics*)

1. **Citation.** Lin C, Ji Z, Lin Y. (2024). Optimum display luminance and contrast polarity of desktop head-up display under office lighting level based on visual ergonomic study. *Ergonomics* 67(11):1491–1503. doi:10.1080/00140139.2024.2339439. PMID 38629123. Fudan University.
   Fetched: the PubMed efetch URL in N1. **Abstract only.**
2. **Study type.** Lab experiment.
3. **Sample.** 36 participants in the polarity part; 21 in the luminance part.
4. **Key results.** At 300 lx: "A positive polarity advantage was found over negative in visual fatigue and discomfort (p < .05)." The best display luminance was 153 cd/m².
5. **Relevance.** A 2024 study in which light mode was *more* comfortable, which runs against Row 2. Note this is a specialized display viewed from a long distance.
6. **Evidence label:** experiment.

### N3. Pathari, Nielsen, Andersen & Marentakis 2024: smartphones (ACHI 2024)

1. **Citation.** Pathari FJ, Nielsen Y, Andersen LI, Marentakis G. (2024). Dark vs. light mode on smartphones: effects on eye fatigue. *Proceedings of ACHI 2024* (IARIA), Barcelona, pp. 150–154. Østfold University College.
   Fetched:
   - https://personales.upv.es/thinkmind/dl/conferences/achi/achi_2024/achi_2024_3_150_20069.pdf (full text, via search)
   - https://www.thinkmind.org/library/ACHI/ACHI_2024/achi_2024_3_150_20069.html (via search)
2. **Study type.** Mixed-design experiment (room light varied between participants, display mode within); conference paper.
3. **Sample.** 18 IT students (11 men), aged 20–50, with 9 per lighting group. The reported F(1,14) implies 16 analyzed.
4. **Key results.**
   - Room light was 460 lx vs 33 lx. The phone (Samsung Galaxy A53) had auto-brightness on, so screen output differed by mode and by room. Each mode involved about 15 minutes of tasks.
   - Mode and room light interacted, F(1,14) = 7.13, p = 0.016, η² = 0.039.
   - Dark mode lowered eye fatigue in the bright room (p = 0.004) but not in the dim room, where 5 of 9 participants reported less fatigue with light mode.
5. **Relevance.** Small, short, and confounded by auto-brightness. It disagrees with Xie et al. on *where* dark mode helps.
6. **Evidence label:** experiment.

### N4. Ettling, Steinmann & Bektaş 2025: dashboards (ETRA '25)

1. **Citation.** Ettling TJ, Steinmann D, Bektaş K. (2025). An eye tracking study on the effects of dark and light themes on user performance and workload. *ETRA '25: Proceedings of the 2025 Symposium on Eye Tracking Research and Applications*, Article 86, pp. 1–9. ACM. doi:10.1145/3715669.3725879. University of St. Gallen.
   Fetched: https://dl.acm.org/doi/10.1145/3715669.3725879 (full text, via search)
2. **Study type.** Within-subject lab experiment with a Tobii eye tracker and a 27-inch monitor.
3. **Sample.** 17 recruited; 15 analyzed (13 for pupil data), aged 18–38. 10 of the 17 said they normally prefer dark themes.
4. **Key results.**
   - Room light was 114 lux.
   - The dark theme improved accuracy (p = 0.016), confidence and fixation count only at medium task difficulty; easy and hard tasks showed no difference.
   - Perceived mental demand (NASA-TLX workload questionnaire) was lower with the dark theme.
   - Pupils dilated more, relative to baseline, with the dark theme at every difficulty level; the authors attribute part of this to the dim room.
5. **Relevance.** Not a text-reading task. It shows a dark interface is not uniformly worse for non-reading work.
6. **Evidence label:** experiment.

### N5. Muhamad & Mokhtar 2024: laptop reading aloud (*JHSMR*)

1. **Citation.** Muhamad N, Mokhtar N. (2024). The effect of display polarity on reading speed and reading error among young adults. *Journal of Health Science and Medical Research* 42(6):e20241095. doi:10.31584/jhsmr.20241095. Universiti Teknologi MARA, Malaysia.
   Fetched:
   - https://api.crossref.org/works/10.31584/jhsmr.20241095
   - Full text on a third-party mirror (via search): https://exa.ai/library/publication/czlg2b5xbpl
2. **Study type.** Within-subject experiment (the authors call it cross-sectional).
3. **Sample.** 30 undergraduates (23 women), aged 20–25, with astigmatism of 1.00 D or less.
4. **Key results.**
   - Room light was 200 lux; a 15.6-inch laptop at 100% brightness; two 15-minute blocks of reading aloud.
   - Dark mode was faster: 136.27 vs 128.42 words per minute (Z = −2.355, p < 0.05).
   - Errors did not differ (p = 0.193 and 0.113).
5. **Relevance.** Contradicts the positive polarity advantage for reading speed. Treat with caution: the sentence describing participants' refraction ("mean spherical equivalent refractive error was −0.16 ± 1.30 D, with astigmatism limited to ≤1.00 D") is word-for-word identical to the one in Bernal-Molina et al. 2018, a different 18-person study. That is a reliability red flag.
6. **Evidence label:** experiment.

### N6. Somkijrungroj et al. 2026: multifocal lens implants (*Clinical Ophthalmology*)

1. **Citation.** Somkijrungroj T, Surawatsatien N, Supawatjariyakul W, Wiriyabanditkul T, Pothikamjorn T. (2026). Digital visual acuity and reading performance with positive and negative display polarities after bilateral diffractive multifocal intraocular lens implantation: a longitudinal observational study. *Clinical Ophthalmology* 20:617151. doi:10.2147/OPTH.S617151. PMID 42741702. Chulalongkorn University.
   Fetched:
   - The PubMed efetch URL in N1.
   - Full-text PDF (via search): https://www.tandfonline.com/doi/pdf/10.2147/OPTH.S617151
2. **Study type.** Non-randomized observational cohort, comparing polarities within each patient on an iPad reading test (MNREAD).
3. **Sample.** 26 patients with multifocal lens implants in both eyes.
4. **Key results.**
   - Acuity on screen was "consistently better" with black-on-white, but significantly so only at 40 cm one month after surgery (p = 0.013).
   - There was no significant difference at 60 cm (p = 0.055) or at three months.
   - The authors judged the differences "not considered clinically meaningful."
5. **Relevance.** A special population whose lens optics are prone to halos; polarity mattered little by three months.
6. **Evidence label:** experiment. The design is observational; "experiment" is the closest of the four labels.

### Also found, not counted

- **Ingrassia, Swiatczak & Schaeffel 2024.** Two different visual stimuli that cause axial eye shortening have no additive effect. *Vision Research* 224:108485. doi:10.1016/j.visres.2024.108485.
  - Fetched via the Bernal-Molina efetch URL in 3c.
  - 22 people without refractive error: 30 minutes of reading light-on-dark text shortened the eye slightly; standard polarity did not.
  - This is about myopia physiology, not reading performance or comfort.
- **Sethi & Ziat 2023** (*Ergonomics* 66(12):1814–1828; doi:10.1080/00140139.2022.2160879; just before the 2024 window).
  - Fetched: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=36533999&rettype=abstract&retmode=text
  - Eye tracking showed higher cognitive load with dark mode for older adults in bright rooms and for younger adults in dim rooms.
- **Fan et al. 2024** (*Sensors* 24:3516; room light and text color under light-on-dark display) is covered by the Row 4 group.

---

## Method notes and limits

- **Access workarounds.** PubMed web pages returned HTTP 403, so PubMed records came from the NCBI E-utilities API. Taylor & Francis and ACM pages often timed out on direct fetch; where marked "via search," the full text came from the same URL through the search tool.
- **Abstract only:** Xie, Yu & Chen 2025; Lin, Ji & Lin 2024; Buchner & Baumgartner 2007; Singh et al. 2023; Marcos et al. 2008; Misawa & Shigeta 1986; Sethi & Ziat 2023; Ingrassia et al. 2024.
- **Full text read on third-party mirrors** (publisher page not opened):
  - Sengsoon & Intaruk 2025 (wisdomlib PDF; the MDPI page was also retrieved)
  - Muhamad & Mokhtar 2024 (exa.ai)
  - Ikaunieks et al. 2017 (exa.ai; DOI not verified)
- **Semantic Scholar:** the paper-lookup endpoint worked, but the search endpoint was rate-limited.
