import Store from "../store/Store";
import type II18n from "./abstraction/II18n";

export default class I18n implements II18n {
  translations: Record<string, Record<string, string>> = {};
  get locales(): string[] {
    const firstValue = Object.keys(this.translations)[0];
    if (!firstValue) return [];
    return Object.keys(this.translations[Object.keys(this.translations)[0]]);
  }
  currentLocale = new Store<string>("");

  getLocaleFromUrl(url: URL, defaultLocale: string): string {
    let [, locale] = url.pathname.split("/");
    if (!this.locales.includes(locale)) locale = this.locales[0];

    return locale || defaultLocale;
  }

  getLocaleUrl(url: URL, locale: string, defaultLocale: string): URL {
    const currentLocale = this.getLocaleFromUrl(url, defaultLocale);
    if (currentLocale === locale) return url;

    const newUrl = new URL(url instanceof URL ? url.href : url);
    if (currentLocale !== defaultLocale) newUrl.pathname = newUrl.pathname.replace(`/${currentLocale}`, "");
    if (locale !== defaultLocale) newUrl.pathname = `/${locale}${newUrl.pathname}`;

    return newUrl;
  }

  getBrowserLocale(): string {
    const locale = navigator.language;
    return locale;
  }

  translate(locale: string, key: string): string {
    const translation: string = this.translations[key]?.[locale];
    if (!translation) throw new Error(`Translation not found for key: ${key} in locale: ${locale}`);

    return translation;
  }
}
