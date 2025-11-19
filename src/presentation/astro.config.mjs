// @ts-check
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import compressor from "astro-compressor";
import path from "path";

// https://astro.build/config
export default defineConfig({
  site: "https://ahmetcetinkaya.me/",
  integrations: [sitemap(), solidJs(), tailwind(), compressor()],
  vite: {
    resolve: {
      alias: {
        "@": path.resolve("./src"),
        "@packages": path.resolve("../../packages"),
        "@domain": path.resolve("../../src/domain"),
        "@application": path.resolve("../../src/application"),
        "@presentation": path.resolve("."),
        "@shared": path.resolve("./src/shared"),
        "solid-js/web": path.resolve("./node_modules/solid-js/web"),
        "solid-js": path.resolve("./node_modules/solid-js"),
        "three/examples/jsm/controls/OrbitControls": path.resolve(
          "./node_modules/three/examples/jsm/controls/OrbitControls.js",
        ),
        "three/examples/jsm/loaders/DRACOLoader": path.resolve(
          "./node_modules/three/examples/jsm/loaders/DRACOLoader.js",
        ),
        "three/examples/jsm/loaders/GLTFLoader": path.resolve(
          "./node_modules/three/examples/jsm/loaders/GLTFLoader.js",
        ),
      },
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".astro"],
    },
    optimizeDeps: {
      include: [
        "three",
        "three/examples/jsm/controls/OrbitControls",
        "three/examples/jsm/loaders/DRACOLoader",
        "three/examples/jsm/loaders/GLTFLoader",
      ],
      force: true,
    },
    build: {
      rollupOptions: {
        external: [],
      },
    },
  },
});
