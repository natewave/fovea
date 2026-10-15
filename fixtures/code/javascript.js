// Toggle the site theme and remember the choice.
const STORAGE_KEY = "fovea-theme";
const themes = ["day", "dusk", "night"];

export function applyTheme(name) {
  if (!themes.includes(name)) {
    throw new RangeError(`Unknown theme: ${name}`);
  }
  document.documentElement.dataset.theme = name;
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch {
    // Storage can be disabled; the theme still applies to this page.
  }
}

const saved = localStorage.getItem(STORAGE_KEY);
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(saved ?? (prefersDark ? "dusk" : "day"));

document.querySelectorAll("[data-theme-button]").forEach((button) => {
  button.addEventListener("click", () => applyTheme(button.dataset.themeButton));
});
