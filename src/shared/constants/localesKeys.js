const localeIndexData = require('../assets/data/locales/en/index.json');
const localeAboutData = require('../assets/data/locales/en/about.json');
const localePortfolioData = require('../assets/data/locales/en/portfolio.json');
const localeRedirectData = require('../assets/data/locales/en/redirect.json');

const locales = {
  get index() {
    const newLocaleObject = { ...localeIndexData };
    Object.keys(newLocaleObject).forEach((key) => {
      newLocaleObject[key] = key;
    });
    return Object.freeze(newLocaleObject);
  },

  get about() {
    const newLocaleObject = { ...localeAboutData };
    Object.keys(newLocaleObject).forEach((key) => {
      newLocaleObject[key] = key;
    });
    return Object.freeze(newLocaleObject);
  },

  get portfolio() {
    const newLocaleObject = { ...localePortfolioData };
    Object.keys(newLocaleObject).forEach((key) => {
      newLocaleObject[key] = key;
    });
    return Object.freeze(newLocaleObject);
  },

  get redirect() {
    const newLocaleObject = { ...localeRedirectData };
    Object.keys(newLocaleObject).forEach((key) => {
      newLocaleObject[key] = key;
    });
    return Object.freeze(newLocaleObject);
  },
};

export default locales;
