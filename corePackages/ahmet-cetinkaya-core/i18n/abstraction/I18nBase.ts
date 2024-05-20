export abstract class I18nBase {
  abstract getLocaleFromUrl(url: URL, defaultLocale: string): string;
  abstract getLocaleUrl(url: URL, locale: string, defaultLocale: string): URL;
  abstract getBrowserLocale(): string;
  abstract registerTranslations(language: string, translations: Record<string, string>): void;
  abstract translate(locale: string, key: string): string;
}
