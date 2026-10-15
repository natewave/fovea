/**
 * Progressive enhancement: the variant switcher, copy buttons and the color-vision preview. Each
 * control starts hidden and appears only when it can work.
 */
const THEME_KEY = "fovea-theme";
const VARIANTS = ["day", "dusk", "night"] as const;
type Variant = (typeof VARIANTS)[number];
type ThemeChoice = Variant | "auto";

const isVariant = (value: string | null | undefined): value is Variant =>
  VARIANTS.some((v) => v === value);

const savedTheme = (): ThemeChoice => {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return isVariant(value) ? value : "auto";
  } catch {
    return "auto";
  }
};

const saveTheme = (choice: ThemeChoice): void => {
  try {
    if (choice === "auto") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, choice);
  } catch {
    // Storage can be unavailable (private modes); the choice then lasts for this page only.
  }
};

const applyTheme = (choice: ThemeChoice): void => {
  const root = document.documentElement;
  if (choice === "auto") delete root.dataset.theme;
  else root.dataset.theme = choice;
};

const announce = (message: string): void => {
  const region = document.getElementById("announcer");
  if (region !== null) region.textContent = message;
};

const themeInputs = (): readonly HTMLInputElement[] => [
  ...document.querySelectorAll<HTMLInputElement>('[data-theme-switcher] input[type="radio"]'),
];

/** Every switcher on the page shows the same choice. */
const showTheme = (choice: ThemeChoice): void => {
  for (const input of themeInputs()) input.checked = input.value === choice;
};

const setUpThemeSwitchers = (): void => {
  showTheme(savedTheme());
  for (const input of themeInputs()) {
    input.addEventListener("change", () => {
      if (!input.checked) return;
      const choice: ThemeChoice = isVariant(input.value) ? input.value : "auto";
      applyTheme(choice);
      saveTheme(choice);
      showTheme(choice);
    });
  }
  for (const switcher of document.querySelectorAll<HTMLElement>("[data-theme-switcher]")) {
    switcher.hidden = false;
  }
};

/** Color values render as text; with a clipboard they become buttons that copy themselves. */
const upgradeCopyableValues = (): void => {
  for (const code of document.querySelectorAll<HTMLElement>("code[data-copy]")) {
    const button = document.createElement("button");
    for (const attribute of code.attributes) button.setAttribute(attribute.name, attribute.value);
    const text = (code.textContent ?? "").trim();
    button.type = "button";
    button.textContent = text;
    button.title = "Copy";
    button.setAttribute("aria-label", `Copy ${text}`);
    code.replaceWith(button);
  }
};

const setUpCopyButtons = (): void => {
  if (navigator.clipboard === undefined) return;
  upgradeCopyableValues();
  for (const button of document.querySelectorAll<HTMLButtonElement>("button[data-copy]")) {
    const original = button.textContent ?? "Copy";
    const isValue = button.classList.contains("value");
    button.addEventListener("click", () => {
      const text = button.dataset.copy ?? "";
      navigator.clipboard.writeText(text).then(
        () => {
          announce(`Copied ${button.dataset.copyLabel ?? text}`);
          if (isValue) return;
          button.textContent = "Copied";
          window.setTimeout(() => {
            button.textContent = original;
          }, 1500);
        },
        () => announce("Copying failed. Select the text and copy it instead."),
      );
    });
    button.hidden = false;
  }
};

const setUpCvdPreview = (): void => {
  for (const control of document.querySelectorAll<HTMLElement>("[data-cvd-control]")) {
    for (const input of control.querySelectorAll<HTMLInputElement>('input[name="fovea-cvd"]')) {
      input.addEventListener("change", () => {
        if (!input.checked) return;
        const root = document.documentElement;
        if (input.value === "none") delete root.dataset.cvd;
        else root.dataset.cvd = input.value;
      });
    }
    control.hidden = false;
  }
};

setUpThemeSwitchers();
setUpCopyButtons();
setUpCvdPreview();
