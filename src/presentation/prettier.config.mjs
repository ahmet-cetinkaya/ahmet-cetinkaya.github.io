export default {
  semi: true,
  trailingComma: "all",
  arrowParens: "always",
  printWidth: 120,
  tabWidth: 2,
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
  plugins: ["prettier-plugin-astro", "prettier-plugin-organize-attributes", "prettier-plugin-tailwindcss"],
  attributeGroups: [
    "^(id|key|ref)$",
    "^class$",
    "^data-",
    "^aria-",
    "^role$",
    "^type$",
    "^tabIndex$",
    "^style$",
    "^on[A-Z]",
    "^children$",
  ],
};
