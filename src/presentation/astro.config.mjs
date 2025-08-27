// @ts-check
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import compressor from "astro-compressor";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://ahmetcetinkaya.me/",
  integrations: [sitemap(), solidJs(), tailwind(), compressor()],
  vite: {
    resolve: {
      alias: {
        // Ensure tailwind-merge can be resolved from submodules
        // This provides explicit path resolution for modules that might not be 
        // properly resolved in Vercel's build environment due to the submodule structure
        "tailwind-merge": path.resolve(__dirname, "./node_modules/tailwind-merge"),
      },
    },
    optimizeDeps: {
      // Include tailwind-merge in dependency optimization to ensure it's properly bundled
      include: ["tailwind-merge"],
    },
    build: {
      rollupOptions: {
        // Ensure external dependencies are properly handled
        external: [],
        output: {
          // Configure module resolution for build output
          globals: {},
        },
      },
    },
  },
});
