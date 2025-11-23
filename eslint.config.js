import pluginJs from "@eslint/js";
import solid from "eslint-plugin-solid/configs/typescript";
import globals from "globals";
import tsEslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // General JavaScript/TypeScript rules
      "no-console": "warn",
      "no-debugger": "error",
      "no-alert": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "prefer-const": "error",
      "no-var": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      "object-shorthand": "error",
      "prefer-destructuring": [
        "error",
        {
          array: false,
          object: true,
        },
      ],
    },
  },
  {
    files: ["src/presentation/**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: tsEslint.parser,
      parserOptions: {
        project: "src/presentation/tsconfig.json",
      },
    },
    rules: {
      // Override any specific rules if needed
      "no-console": "warn", // Keep console warnings for browser code
    },
  },
  {
    files: ["src/core/**/*.{ts,tsx}", "scripts/**/*.{js,ts}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Node.js specific rules - allow console in build scripts
      "no-console": "off",
    },
  },
  {
    ignores: [
      "**/*.astro",
      "src/presentation/public/home",
      "src/presentation/dist",
      "src/presentation/.astro",
      "dist/**",
      "node_modules/**",
      "src/presentation/node_modules/**",
      "*.min.js",
      "*.d.ts",
    ],
  },
];
