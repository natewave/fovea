import { defineConfig } from "astro/config";

/**
 * The Pages workflow passes the origin and base path that actions/configure-pages reports, so the
 * site works at https://<user>.github.io/<repo>/ or on a custom domain without code changes.
 */
const site = process.env.SITE_URL || "https://natewave.github.io";
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  // Astro 7 strips whitespace between inline elements by default; prose needs HTML's rules.
  compressHTML: true,
  build: { format: "directory" },
  devToolbar: { enabled: false },
});
