/**
 * Every source the site cites. Each URL appears in docs/research.md or its verification notes, where
 * the opened page and the quoted wording are recorded; a test checks this.
 */
export interface Source {
  readonly label: string;
  readonly url: string;
}

const doi = (id: string): string => `https://doi.org/${id}`;

export const sources = {
  piepenbrock2014: {
    label: "Piepenbrock, Mayr & Buchner 2014, Ergonomics",
    url: doi("10.1080/00140139.2014.948496"),
  },
  piepenbrock2014hf: {
    label: "Piepenbrock, Mayr & Buchner 2014, Human Factors",
    url: doi("10.1177/0018720813515509"),
  },
  buchner2009: {
    label: "Buchner, Mayr & Brandt 2009, Ergonomics",
    url: doi("10.1080/00140130802641635"),
  },
  buchnerBaumgartner2007: {
    label: "Buchner & Baumgartner 2007, Ergonomics (abstract)",
    url: doi("10.1080/00140130701306413"),
  },
  dobres2017: {
    label: "Dobres, Chahine & Reimer 2017, Applied Ergonomics",
    url: doi("10.1016/j.apergo.2016.11.001"),
  },
  palmen2023: {
    label: "Palmén, Gilbert & Crossland 2023, CHI",
    url: doi("10.1145/3544548.3581552"),
  },
  luzsa2026: { label: "Luzsa & Mayr 2026, Ergonomics", url: doi("10.1080/00140139.2025.2457470") },
  xie2025: {
    label: "Xie, Yu & Chen 2025, Int J Hum–Comput Interact (abstract)",
    url: doi("10.1080/10447318.2024.2305982"),
  },
  lin2024: {
    label: "Lin, Ji & Lin 2024, Ergonomics (abstract)",
    url: doi("10.1080/00140139.2024.2339439"),
  },
  pathari2024: {
    label: "Pathari et al. 2024, ACHI",
    url: "https://personales.upv.es/thinkmind/dl/conferences/achi/achi_2024/achi_2024_3_150_20069.pdf",
  },
  kobashi2013: { label: "Kobashi et al. 2013, BioMed Res Int", url: doi("10.1155/2013/124327") },
  ramasubramanian2026: {
    label: "Ramasubramanian et al. 2026, Br Ir Orthopt J",
    url: doi("10.22599/bioj.515"),
  },
  fan2024: { label: "Fan, Xie, Dong & Wang 2024, Sensors", url: doi("10.3390/s24113516") },
  thibos1992: {
    label: "Thibos, Ye, Zhang & Bradley 1992, Appl Opt",
    url: doi("10.1364/AO.31.003594"),
  },
  roorda2023: { label: "Roorda et al. 2023, J Vis", url: doi("10.1167/jov.23.2.3") },
  williams1981: {
    label: "Williams, MacLeod & Hayhoe 1981, Vision Res",
    url: doi("10.1016/0042-6989(81)90241-8"),
  },
  curcio1991: { label: "Curcio et al. 1991, J Comp Neurol", url: doi("10.1002/cne.903120411") },
  mullen1985: { label: "Mullen 1985, J Physiol", url: doi("10.1113/jphysiol.1985.sp015591") },
  wcag22: { label: "W3C, WCAG 2.2", url: "https://www.w3.org/TR/WCAG22/" },
  cochrane2023: {
    label: "Singh et al. 2023, Cochrane review",
    url: doi("10.1002/14651858.CD013244.pub2"),
  },
  lunaRangel2025: {
    label: "Luna-Rangel et al. 2025, Front Neurol",
    url: doi("10.3389/fneur.2025.1699303"),
  },
  brown2022: { label: "Brown et al. 2022, PLOS Biology", url: doi("10.1371/journal.pbio.3001571") },
  schollhorn2023: {
    label: "Schöllhorn et al. 2023, Commun Biol",
    url: doi("10.1038/s42003-023-04598-4"),
  },
  mao2025: {
    label: "Mao et al. 2025, Displays (abstract)",
    url: doi("10.1016/j.displa.2025.103027"),
  },
  hohn2024: { label: "Höhn et al. 2024, Brain Commun", url: doi("10.1093/braincomms/fcae173") },
  glickman2025: {
    label: "Glickman et al. 2025, Transl Vis Sci Technol",
    url: doi("10.1167/tvst.14.7.25"),
  },
  tfos2023: {
    label: "Wolffsohn et al. 2023, TFOS Lifestyle report",
    url: doi("10.1016/j.jtos.2023.04.004"),
  },
  manna2026: { label: "Manna 2026, Clin Optom", url: doi("10.2147/OPTO.S586750") },
  talens2023: {
    label: "Talens-Estarelles et al. 2023, Cont Lens Anterior Eye",
    url: doi("10.1016/j.clae.2022.101744"),
  },
  hfes100: {
    label: "ANSI/HFES 100-2007 (hosted copy)",
    url: "https://www.trescoconsoles.com/wp-content/uploads/2023/11/ANSI_HFES_100-200727E2.pdf",
  },
  aaoComputer: {
    label: "American Academy of Ophthalmology: computers and eye strain",
    url: "https://www.aao.org/eye-health/tips-prevention/computer-usage",
  },
  aaoBlueLight: {
    label: "American Academy of Ophthalmology: blue light",
    url: "https://www.aao.org/eye-health/tips-prevention/should-you-be-worried-about-blue-light",
  },
  aaoGlasses: {
    label: "American Academy of Ophthalmology: blue-light glasses",
    url: "https://www.aao.org/eye-health/tips-prevention/are-computer-glasses-worth-it",
  },
  aoa: {
    label: "American Optometric Association: computer vision syndrome",
    url: "https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome",
  },
  osha: {
    label: "OSHA eTool: monitors",
    url: "https://www.osha.gov/etools/computer-workstations/components/monitors",
  },
  simunovic2010: { label: "Simunovic 2010, Eye", url: doi("10.1038/eye.2009.251") },
  machado2009: {
    label: "Machado, Oliveira & Fernandes 2009, IEEE TVCG",
    url: doi("10.1109/TVCG.2009.113"),
  },
  brettel1997: {
    label: "Brettel, Viénot & Mollon 1997, JOSA A",
    url: doi("10.1364/JOSAA.14.002647"),
  },
  rello2017: { label: "Rello & Bigham 2017, ASSETS", url: doi("10.1145/3132525.3132546") },
  bda: {
    label: "British Dyslexia Association, Dyslexia Style Guide",
    url: "https://www.bdadyslexia.org.uk/resources",
  },
  sarkar2015: {
    label: "Sarkar 2015, PPIG",
    url: "https://ppig.org/papers/2015-ppig-26th-sarkar1/",
  },
  hannebauer2018: {
    label: "Hannebauer, Hesenius & Gruhn 2018, Empir Softw Eng (abstract)",
    url: doi("10.1007/s10664-017-9579-0"),
  },
  beelders2016: {
    label: "Beelders & du Plessis 2016, J Eye Mov Res",
    url: doi("10.16910/jemr.9.1.1"),
  },
  healey1996: { label: "Healey 1996, IEEE Visualization", url: doi("10.1109/VISUAL.1996.568118") },
  tonsky2025: {
    label: "Tonsky 2025, blog post",
    url: "https://tonsky.me/blog/syntax-highlighting/",
  },
} as const satisfies Record<string, Source>;

export type SourceKey = keyof typeof sources;
