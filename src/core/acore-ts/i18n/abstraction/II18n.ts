import type { Store } from "../../store/Store";

export interface II18n {
  translations: Record<string, Record<string, string>>;
  get locales(): string[];
  currentLocale: Store<string>;

  getLocaleFromUrl(url: URL, defaultLocale: string): string;
  getLocaleUrl(url: URL, locale: string, defaultLocale: string): URL;
  getBrowserLocale(): string;
  translate(locale: string, key: string): string;
}
