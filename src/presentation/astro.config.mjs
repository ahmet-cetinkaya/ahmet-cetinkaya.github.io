// @ts-check
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import compressor from "astro-compressor";

// https://astro.build/config
export default defineConfig({
  site: "https://ahmetcetinkaya.me/",
  integrations: [sitemap(), solidJs(), tailwind(), compressor()],
});
