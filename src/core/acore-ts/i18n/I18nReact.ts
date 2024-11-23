import type { I18nBase } from "./abstraction/I18nBase";
import { I18nReactBase } from "./abstraction/I18nReactBase";

export class i18nReact extends I18nReactBase {
  useTranslate(i18n: I18nBase, locale: string): (key: string) => string {
    return (key: string): string => i18n.translate(locale, key);
  }
}
