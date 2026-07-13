// @ts-check
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import compressor from "astro-compressor";
import path from "path";

// https://astro.build/config
export default defineConfig({
  site: "https://ahmetcetinkaya.me/",
  integrations: [sitemap(), solidJs(), compressor()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve("./src"),
        "@packages": path.resolve("../../packages"),
        "@domain": path.resolve("../../src/core/domain"),
        "@application": path.resolve("../../src/core/application"),
        "@presentation": path.resolve("."),
        "@presentation/src": path.resolve("./src"),
        "@presentation/Container": path.resolve("./Container.ts"),
        "@shared": path.resolve("./src/shared"),
      },
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".astro"],
    },
    optimizeDeps: {
      include: [
        "three",
        "three/examples/jsm/controls/OrbitControls.js",
        "three/examples/jsm/loaders/DRACOLoader.js",
        "three/examples/jsm/loaders/GLTFLoader.js",
      ],
      force: true,
    },
    build: {
      // Enable better tree-shaking and optimization
      target: "esnext",
      minify: "esbuild",
      cssMinify: true,
      // Increase chunk size warning limit to accommodate Three.js core (630KB is normal for Three.js)
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        external: [],
        output: {
          manualChunks: (id) => {
            // Split Three.js core and examples separately
            if (id.includes("node_modules/three") && !id.includes("examples/jsm")) return "three-core";

            // Split Three.js controls
            if (id.includes("three/examples/jsm/controls")) return "three-controls";

            // Split Three.js loaders
            if (id.includes("three/examples/jsm/loaders")) return "three-loaders";

            // Split 3D model components individually
            if (id.includes("ThreeDimensionalModel/Computer3DModel")) return "3d-model-computer";
            if (id.includes("ThreeDimensionalModel/Terminal3DModel")) return "3d-model-terminal";
            if (id.includes("ThreeDimensionalModel/Doom3DModel")) return "3d-model-doom";
            if (id.includes("ThreeDimensionalModel/Folder3DModel")) return "3d-model-folder";
            if (id.includes("ThreeDimensionalModel/Envelope3DModel")) return "3d-model-envelope";

            // Split WindowManager
            if (id.includes("WindowManager")) return "window-management";

            // Split SolidJS vendor
            if (id.includes("solid-js") && !id.includes("/packages/")) return "solid-js-vendor";

            // Let CodeMirror language grammars fall through to Rollup's automatic
            // dynamic-import splitting so each is fetched lazily by the text editor.
            // A manualChunks assignment would override that and force them eager.
            if (id.includes("@codemirror/lang-") || id.includes("@codemirror/legacy-modes")) return undefined;

            // Default vendor chunk for other node_modules
            if (id.includes("node_modules")) return "vendor";

            return undefined;
          },
        },
      },
    },
  },
});
