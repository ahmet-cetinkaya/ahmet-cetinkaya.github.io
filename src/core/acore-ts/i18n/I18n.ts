import type { I18nBase } from './abstraction/I18nBase';

export class I18n implements I18nBase {
  protected translations: Record<string, Record<string, string>> = {};

  getLocaleFromUrl(url: URL, defaultLocale: string): string {
    const [, locale] = url.pathname.split('/');

    return locale || defaultLocale;
  }

  getLocaleUrl(url: URL, locale: string, defaultLocale: string): URL {
    const currentLocale = this.getLocaleFromUrl(url, defaultLocale);
    if (currentLocale === locale) return url;

    const newUrl = new URL(url instanceof URL ? url.href : url);
    if (currentLocale !== defaultLocale) newUrl.pathname = newUrl.pathname.replace(`/${currentLocale}`, '');
    if (locale !== defaultLocale) newUrl.pathname = `/${locale}${newUrl.pathname}`;

    return newUrl;
  }

  getBrowserLocale(): string {
    const locale = navigator.language;
    return locale;
  }

  registerTranslations(language: string, translations: Record<string, string>): void {
    this.translations[language] = translations;
  }

  translate(locale: string, key: string): string {
    const translation: string = this.translations[locale]?.[key];
    if (!translation) throw new Error(`Translation not found for key: ${key} in locale: ${locale}`);

    return translation;
  }
}
