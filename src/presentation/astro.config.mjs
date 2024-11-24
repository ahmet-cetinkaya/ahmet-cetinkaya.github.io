// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

import solidJs from "@astrojs/solid-js";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap(), solidJs(), tailwind()],
});
