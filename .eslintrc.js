module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parser: 'babel-eslint',
  plugins: ['react'],
  rules: {
    'react/prop-types': 0,
  },
};
