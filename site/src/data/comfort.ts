import type { SourceKey } from "./sources.ts";

/**
 * The screen comfort guide. Wording follows the "suggested wording" in
 * docs/research/verification/d-strain-sleep-syntax.md, which quotes each source.
 */
export interface Tip {
  readonly id: string;
  readonly title: string;
  readonly advice: readonly string[];
  readonly evidence: string;
  readonly sources: readonly SourceKey[];
}

export const tips: readonly Tip[] = [
  {
    id: "breaks",
    title: "Take 20-20-20 breaks",
    advice: [
      "Every 20 minutes, look at something about 6 m (20 ft) away for 20 seconds.",
      "Eye-care bodies recommend it, alongside longer rests after a couple of hours of continuous screen work.",
    ],
    evidence:
      "The evidence that it works is limited: in one small study without a control group, reminders reduced symptoms over two weeks, and the gain was gone a week after they stopped. It costs nothing.",
    sources: ["aoa", "aaoBlueLight", "osha", "talens2023", "tfos2023"],
  },
  {
    id: "blinking",
    title: "Blink on purpose",
    advice: [
      "When concentrating on a screen we often blink only a third to a half as often as at rest, and more of those blinks are incomplete.",
      "Mental effort seems to drive this as much as the screen itself. Blink on purpose now and then, and take breaks.",
    ],
    evidence:
      "Blink rates in the studies vary: from about 15 a minute normally to 5–7 at a computer in one summary, and from 18.4 to 3.6 in one study.",
    sources: ["tfos2023", "aaoComputer", "manna2026"],
  },
  {
    id: "brightness",
    title: "Match screen brightness to the room",
    advice: [
      "Don't use a bright screen in a dark room. Keep some room light on and set screen brightness to roughly match your surroundings.",
      "With a dark theme, the room can be somewhat brighter than the screen, but keep bright lamps and windows out of direct view.",
    ],
    evidence:
      "This rests on ergonomics standards and clinical guidance. In two cross-sectional studies, matching brightness to the room lowered how many people reported strain but not how severe it was.",
    sources: ["aaoComputer", "hfes100", "tfos2023"],
  },
  {
    id: "distance",
    title: "Sit at arm's length, with text big enough to read",
    advice: [
      "Sit about an arm's length away (roughly 50–75 cm) with the screen slightly below eye level.",
      "Make text big enough to read without leaning in; ergonomics standards suggest letters about 4–5 mm tall at 60 cm.",
    ],
    evidence:
      "Recommended distances vary between sources, from about 50 to 100 cm, and studies of viewing distance and dry-eye symptoms disagree.",
    sources: ["aaoComputer", "osha", "hfes100", "tfos2023"],
  },
  {
    id: "glasses",
    title: "Keep glasses up to date for screen distance",
    advice: [
      "If you're over about 40 or wear glasses, ask an optometrist about glasses set for your screen distance (about 50–75 cm).",
      "Reading or distance glasses may not focus well there. Computer glasses are not the same as blue-light glasses.",
    ],
    evidence:
      "Uncorrected or under-corrected vision makes screen symptoms considerably worse. Evidence for specific computer-glasses designs is low quality.",
    sources: ["aoa", "aaoComputer", "osha", "tfos2023"],
  },
];
