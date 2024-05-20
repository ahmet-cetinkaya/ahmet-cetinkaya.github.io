import type { I18nBase } from './I18nBase';

export abstract class I18nReactBase {
  abstract useTranslate(i18n: I18nBase, locale: string): (key: string) => string;
}
