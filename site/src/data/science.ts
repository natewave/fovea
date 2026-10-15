import type { EvidenceLabel } from "../lib/research.ts";
import type { SourceKey } from "./sources.ts";

/**
 * The Science page in plain language. Each statement restates a row of docs/research.md and cites
 * the same sources; wording stays calibrated ("studies suggest", "designed to").
 */
export interface Principle {
  readonly id: string;
  readonly title: string;
  /** One line for the home page card. */
  readonly summary: string;
  readonly evidence: readonly EvidenceLabel[];
  readonly finding: string;
  readonly inFovea: string;
  readonly caveat: string;
  readonly sources: readonly SourceKey[];
}

export const principles: readonly Principle[] = [
  {
    id: "lightness-carries-detail",
    title: "Lightness and hue",
    summary:
      "The center of the eye resolves fine detail through lightness, so every text color clears a lightness-contrast floor.",
    evidence: [],
    finding:
      "The very center of the fovea, about 25 arcminutes across, lacks working blue-sensitive cones. Patterns that differ only in color stop being resolvable at around 11–12 cycles per degree, while we stay sensitive to lightness patterns at finer scales.",
    inFovea:
      "Every text color has to pass a lightness-contrast floor against its background, whatever its hue. Meaning never rests on hue alone: errors are also underlined, diff lines carry + and − markers, and status colors differ in lightness.",
    caveat:
      "These are measurements of the visual system, not of people reading code. They explain why lightness matters; they don't show that any particular theme reads better.",
    sources: ["williams1981", "curcio1991", "mullen1985"],
  },
  {
    id: "polarity",
    title: "Dark text on a light background reads best",
    summary:
      "In controlled studies, dark-on-light text was read more accurately and faster, so Day is a first-class variant.",
    evidence: [],
    finding:
      "In lab studies, people proofread dark-on-light text more accurately and faster than light-on-dark, and the gap grew as text got smaller. The advantage was largest in a dark room, persisted under office lighting, and replicated online and in VR headsets. When overall screen brightness was equalized, it disappeared.",
    inFovea:
      "Day is described as the most legible variant in general, not only for bright rooms. Because code is small text, the dark variants keep body text well above the contrast floors.",
    caveat:
      "Effects are moderate and come from proofreading and glance tasks, not long coding sessions. Comfort is a separate question with mixed results (see the myths below).",
    sources: [
      "piepenbrock2014",
      "piepenbrock2014hf",
      "buchner2009",
      "buchnerBaumgartner2007",
      "dobres2017",
      "palmen2023",
      "luzsa2026",
    ],
  },
  {
    id: "contrast-band",
    title: "Contrast band",
    summary:
      "Text contrast is held inside a budget: always above the accessibility floor, never pure black on pure white.",
    evidence: [],
    finding:
      "WCAG 2.2 requires at least 4.5:1 for text and 3:1 for interface components. Larger pupils, as in dark rooms and with dark screens, lower the eye's optical quality.",
    inFovea:
      "Code, body text and labels reach at least 4.5:1 in every variant, and plain text at least 7:1. Secondary details such as line numbers and inactive tabs get at least 3:1. Body text also sits inside a perceptual-contrast band computed at build time, and no variant uses pure black or pure white.",
    caveat:
      'Avoiding pure white and pure black, and capping text contrast, are design hypotheses. The "halation" they are meant to prevent has never been tested directly, and one large online study found no sign of it.',
    sources: ["wcag22", "kobashi2013", "palmen2023"],
  },
  {
    id: "restrained-syntax",
    title: "Restrained syntax color",
    summary:
      "Studies suggest highlighting helps a little, and people track about five colors at a glance, so Fovea colors fewer things.",
    evidence: [],
    finding:
      "Small studies found highlighted code solved slightly faster, with the benefit shrinking with experience. A study of 390 novices found no evidence that highlighting improved comprehension. People find about five colors at a glance reliably, and up to seven when the colors fall in clearly different categories.",
    inFovea:
      "At most six syntax hues plus a red reserved for errors. Punctuation and comments are quiet, and keywords keep a calm but distinct color so a misspelled keyword still stands out.",
    caveat: 'All the studies are small or short. "No evidence of a gain" is not proof of no gain.',
    sources: ["sarkar2015", "hannebauer2018", "beelders2016", "healey1996", "tonsky2025"],
  },
  {
    id: "spectral-extremes",
    title: "No saturated blue or red text",
    summary:
      "The eye can't focus deep blue and deep red at once, so text colors avoid the ends of the spectrum.",
    evidence: ["Mechanism", "Experiment"],
    finding:
      "The eye's focus differs by about 2 diopters between the blue and red ends of the spectrum. On black, pure blue text produced the largest focusing lag and was rated hardest to read; in dim light, red text on black was rated the most fatiguing.",
    inFovea:
      "Blues and violets are light and low in chroma. Red is reserved for errors and lightened when used as text. Saturated reds and blues are never paired, and a test warns when opposing syntax hues are both strongly saturated.",
    caveat: "Neither study matched the colors' lightness, and one had only 10 people per color.",
    sources: ["thibos1992", "ramasubramanian2026", "fan2024", "roorda2023"],
  },
  {
    id: "color-vision",
    title: "Readable with any kind of color vision",
    summary:
      "Up to about 8% of men have red–green color-vision deficiency, so every meaning also differs in lightness.",
    evidence: ["Expert opinion", "Mechanism"],
    finding:
      "Up to about 8% of men and 0.5% of women of European ancestry have congenital red–green color-vision deficiency. Machado et al.'s model simulates red–green deficiency; Brettel et al.'s model is the established choice for tritanopia.",
    inFovea:
      "Every pair of meanings that must be told apart, such as error and warning or added and removed, is checked under simulated protanopia, deuteranopia and tritanopia, and must also differ in lightness. The palette page has a simulation toggle.",
    caveat:
      "Simulation models are validated on small samples, and tritan participants are rarely included.",
    sources: ["simunovic2010", "machado2009", "brettel1997"],
  },
  {
    id: "night-light",
    title: "Less light at night, without blue-light promises",
    summary:
      "Night emits less light than Dusk. That is its honest benefit; the brightness setting and room light matter more.",
    evidence: ["Expert opinion", "Experiment"],
    finding:
      "Consensus guidance limits evening light at the eye by both its intensity and its spectrum. In one lab study of display light, screen brightness and spectrum both mattered, and the spectrum made a significant difference only at the brightest setting. Unfiltered evening smartphone reading lowered melatonin in another.",
    inFovea:
      "Night has the darkest background, and its blues, violets and teals are its least saturated hues. It is never amber or sepia: its near-white text stays between about 4500 K and 6500 K like the other variants, because shifting the display's color temperature is the operating system's job.",
    caveat:
      "No study has tested a dark color theme on sleep. Screen brightness and room lighting matter more than any hue choice.",
    sources: ["brown2022", "schollhorn2023", "hohn2024"],
  },
  {
    id: "warm-paper",
    title: "A warm paper, not a stark white",
    summary:
      "Black text on warm tints was read faster than on cool ones, so Day uses a subtly warm paper.",
    evidence: ["Experiment", "Expert opinion"],
    finding:
      "In an online study of 341 readers, black text on warm tints was read faster than on cool tints, by readers with and without dyslexia. Dyslexia guidance recommends dark text on a light background that is not white.",
    inFovea:
      "Day's paper is subtly warm. Near-white neutrals stay between about 4500 K and 6500 K with no green or magenta cast.",
    caveat:
      "White was never tested against warm tints, so the evidence supports warm over cool, not warm over white.",
    sources: ["rello2017", "bda", "xie2025"],
  },
];

export interface Myth {
  readonly myth: string;
  readonly answer: string;
  readonly detail: string;
  readonly sources: readonly SourceKey[];
}

export const myths: readonly Myth[] = [
  {
    myth: "Blue-light glasses prevent eye strain.",
    answer: "The best evidence says they may not help.",
    detail:
      'A Cochrane review of 17 trials found there may be no difference in computer eye strain with blue-light-filtering lenses (low-certainty evidence), and the effect on sleep is unknown. A 2025 meta-analysis of 3 small trials found no significant effect on sleep. Many clear "blue-light" lenses filter too little to affect the body clock; the amber glasses used in sleep trials are a different product.',
    sources: ["cochrane2023", "lunaRangel2025", "glickman2025"],
  },
  {
    myth: "Dark mode is always healthier.",
    answer: "The evidence points both ways.",
    detail:
      "Some studies found dark mode less fatiguing, one only in bright rooms, and another found light mode more comfortable. Legibility studies favor dark text on a light background, with the largest dark-mode penalty in a dark room. The TFOS report notes limited evidence on how dark modes affect eye health, comfort and vision.",
    sources: ["xie2025", "pathari2024", "lin2024", "piepenbrock2014", "dobres2017", "tfos2023"],
  },
  {
    myth: "Night Shift fixes sleep.",
    answer: "Night modes may help a little; they don't fix sleep.",
    detail:
      "What matters is how much melanopic light reaches the eye, which depends on brightness as much as color. Phone night modes that kept luminance and color temperature low preserved evening melatonin in a lab study, while modes that dimmed gradually still delivered a lot of light early in the evening. The American Academy of Ophthalmology's advice is to avoid screens two to three hours before bed, and says night modes can help too.",
    sources: ["mao2025", "schollhorn2023", "brown2022", "aaoGlasses"],
  },
];

export interface Limit {
  readonly title: string;
  readonly text: string;
  readonly sources: readonly SourceKey[];
}

export const limits: readonly Limit[] = [
  {
    title: "It can't correct your vision",
    text: "Uncorrected or under-corrected vision makes screen symptoms considerably worse; as little as 0.5–1 diopter of uncorrected astigmatism can matter.",
    sources: ["tfos2023"],
  },
  {
    title: "It can't make you blink",
    text: "Blink rates drop sharply during concentrated screen work, and more blinks are incomplete. Mental effort drives this as much as the screen.",
    sources: ["tfos2023", "manna2026"],
  },
  {
    title: "It can't set your brightness",
    text: "The light reaching your eyes depends on the display's brightness and the room's lighting more than on any color choice.",
    sources: ["brown2022", "schollhorn2023", "aaoComputer"],
  },
  {
    title: "It can't prevent eye damage or improve sleep",
    text: "No study has tested a dark color theme on sleep, and Fovea makes no medical claims.",
    sources: ["cochrane2023"],
  },
];
