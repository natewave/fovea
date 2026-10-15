/**
 * Screenshots every section of the palette report (run `pnpm report` first). Uses the installed
 * Google Chrome, so no browser download is needed.
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const REPORT = join(ROOT, "dist/report");
const OUT = join(REPORT, "screenshots");

const VARIANTS = ["day", "dusk", "night"] as const;
const SECTIONS = [
  "overview",
  "neutrals",
  "syntax",
  "accents",
  "ansi",
  "overlays",
  "contrast",
  "code",
  "editor",
  "terminal",
  "cvd",
] as const;

const url = (page: string): string => pathToFileURL(join(REPORT, `${page}.html`)).href;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto(url("index"));
    await page.screenshot({ path: join(OUT, `index-${scheme}.png`), fullPage: true });
  }
  await page.setViewportSize({ width: 1376, height: 1000 });
  for (const variant of VARIANTS) {
    await page.goto(url(variant));
    for (const section of SECTIONS) {
      await page
        .locator(`#${section}`)
        .screenshot({ path: join(OUT, `${variant}-${section}.png`) });
    }
  }
  console.log(`Wrote ${2 + VARIANTS.length * SECTIONS.length} screenshots to ${OUT}.`);
} finally {
  await browser.close();
}
