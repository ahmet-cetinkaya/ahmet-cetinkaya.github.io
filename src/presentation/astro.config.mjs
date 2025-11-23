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
        "@domain": path.resolve("../../src/core/domain"),
        "@application": path.resolve("../../src/core/application"),
        "@presentation": path.resolve("."),
        "@presentation/src": path.resolve("./src"),
        "@presentation/Container": path.resolve("./Container.ts"),
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
            if (id.includes("node_modules/three") && !id.includes("examples/jsm")) {
              return "three-core";
            }

            // Split Three.js controls
            if (id.includes("three/examples/jsm/controls")) {
              return "three-controls";
            }

            // Split Three.js loaders
            if (id.includes("three/examples/jsm/loaders")) {
              return "three-loaders";
            }

            // Split 3D model components individually
            if (id.includes("ThreeDimensionalModel/Computer3DModel")) {
              return "3d-model-computer";
            }
            if (id.includes("ThreeDimensionalModel/Terminal3DModel")) {
              return "3d-model-terminal";
            }
            if (id.includes("ThreeDimensionalModel/Doom3DModel")) {
              return "3d-model-doom";
            }
            if (id.includes("ThreeDimensionalModel/Folder3DModel")) {
              return "3d-model-folder";
            }
            if (id.includes("ThreeDimensionalModel/Envelope3DModel")) {
              return "3d-model-envelope";
            }

            // Split acore packages
            if (id.includes("/packages/acore-")) {
              return "shared-utils";
            }

            // Split WindowManager
            if (id.includes("WindowManager")) {
              return "window-management";
            }

            // Split SolidJS vendor
            if (id.includes("solid-js") && !id.includes("/packages/")) {
              return "solid-js-vendor";
            }

            // Default vendor chunk for other node_modules
            if (id.includes("node_modules")) {
              return "vendor";
            }

            return undefined;
          },
        },
      },
    },
  },
});
