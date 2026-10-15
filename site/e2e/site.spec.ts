import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

/** Every page in every variant must pass axe's WCAG 2.2 A and AA rules, including color contrast. */
const PAGES = ["", "palette/", "science/", "install/", "comfort/", "404.html"] as const;
const VARIANTS = ["day", "dusk", "night"] as const;

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const surface = (page: Page): Promise<string> =>
  page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--fovea-surface-editor").trim(),
  );

for (const path of PAGES) {
  for (const variant of VARIANTS) {
    test(`${path === "" ? "home" : path} in ${variant} passes axe`, async ({ page }) => {
      await page.addInitScript((v) => localStorage.setItem("fovea-theme", v), variant);
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("data-theme", variant);
      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(results.violations).toEqual([]);
    });
  }
}

test.describe("variant selection", () => {
  test("follows a light system appearance with Day", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("");
    const auto = await surface(page);
    await page.evaluate(() => {
      document.documentElement.dataset.theme = "day";
    });
    expect(auto).toBe(await surface(page));
  });

  test("follows a dark system appearance with Dusk", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /./);
    const auto = await surface(page);
    await page.evaluate(() => {
      document.documentElement.dataset.theme = "dusk";
    });
    expect(auto).toBe(await surface(page));
  });

  test("remembers a manual choice and applies it before the page paints", async ({ page }) => {
    await page.goto("");
    await page.getByRole("radio", { name: "Night" }).first().check();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "night");

    await page.addInitScript(() => {
      const observer = new MutationObserver(() => {
        if (document.body === null) return;
        Reflect.set(window, "themeAtBody", document.documentElement.dataset.theme ?? "none");
        observer.disconnect();
      });
      observer.observe(document, { childList: true, subtree: true });
    });
    await page.goto("palette/");
    expect(await page.evaluate(() => Reflect.get(window, "themeAtBody"))).toBe("night");
    await expect(page.getByRole("radio", { name: "Night" }).first()).toBeChecked();
  });

  test("returns to the system appearance with Auto", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("fovea-theme", "night"));
    await page.goto("");
    await page.getByRole("radio", { name: "Auto" }).first().check();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /./);
    expect(await page.evaluate(() => localStorage.getItem("fovea-theme"))).toBeNull();
  });
});

test.describe("interaction", () => {
  test("starts keyboard navigation at the skip link", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "No keyboard on the mobile profile");
    await page.goto("");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("simulates color vision on the palette page", async ({ page }) => {
    await page.goto("palette/");
    await page.getByRole("radio", { name: "Deuteranopia" }).check();
    await expect(page.locator("html")).toHaveAttribute("data-cvd", "deutan");
    const filter = await page
      .locator("section.panel")
      .first()
      .evaluate((el) => getComputedStyle(el).filter);
    expect(filter).toContain("url");
    await page.getByRole("radio", { name: "Grayscale" }).check();
    await expect(page.locator("html")).toHaveAttribute("data-cvd", "gray");
    await page.getByRole("radio", { name: "Typical" }).check();
    await expect(page.locator("html")).not.toHaveAttribute("data-cvd", /./);
  });

  test("copies a color value", async ({ page, context }, info) => {
    test.skip(info.project.name === "mobile", "Clipboard permissions are desktop-only");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("palette/");
    const button = page.locator("button.value").first();
    const value = (await button.textContent())?.trim() ?? "";
    await button.click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(value);
    await expect(page.locator("#announcer")).toHaveText(`Copied ${value}`);
  });

  test("turns off smooth scrolling for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("");
    const behavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    );
    expect(behavior).toBe("auto");
  });
});
