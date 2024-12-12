import pluginJs from "@eslint/js";
import globals from "globals";
import tsEslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-empty-interface": "off",
    },
  },
];
