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
  redirects: {
    donate: "https://www.buymeacoffee.com/ahmetcetinkaya",
    email: "mailto:contact@ahmetcetinkaya.me",
    github: "https://github.com/ahmet-cetinkaya",
    instagram: "https://www.instagram.com/ahmetcetinkaya.raw/",
    itchio: "https://ahmetcetinkaya.itch.io/",
    linkedin: "https://linkedin.com/in/ahmet-cetinkaya",
    mastodon: "https://mastodon.social/@ahmetcetinkaya",
    x: "https://twitter.com/ahmetctnky_dev",
  },
});
