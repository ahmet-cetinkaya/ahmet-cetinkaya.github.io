import astroConfig from './prettierastro.config.mjs';

export default {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  printWidth: 120,
  tabWidth: 2,
  overrides: [...astroConfig.overrides],
  plugins: [
    ...astroConfig.plugins,
    'prettier-plugin-organize-imports',
    'prettier-plugin-organize-attributes',
    'prettier-plugin-tailwindcss',
    'prettier-plugin-packagejson',
  ],

  // prettier-plugin-organize-attributes
  attributeGroups: [...astroConfig.attributeGroups],
};
