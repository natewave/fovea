import { defineConfig, devices } from "@playwright/test";

/** Serves the built site with `astro preview`, under the same base path the build used. */
const BASE = `/${(process.env.BASE_PATH ?? "/").replace(/^\/+|\/+$/g, "")}/`.replace("//", "/");
const PORT = 4321;
const URL = `http://localhost:${PORT}${BASE}`;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: process.env.CI !== undefined,
  retries: process.env.CI === undefined ? 0 : 1,
  reporter: process.env.CI === undefined ? "list" : "github",
  use: { baseURL: URL, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `pnpm exec astro preview --port ${PORT}`,
    url: URL,
    reuseExistingServer: process.env.CI === undefined,
  },
});
