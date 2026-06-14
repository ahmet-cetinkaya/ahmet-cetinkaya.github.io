import { TranslationKeys } from "@domain/data/Translations";
import type { useI18n } from "./i18nTranslate";

/**
 * Create a translate function that supports {{param}} replacement patterns
 */
export function createTranslateWithParams(translate: ReturnType<typeof useI18n>) {
  return (key: TranslationKeys, params: Record<string, string> = {}): string => {
    const translation = translate(key);
    let result = translation;

    Object.entries(params).forEach(([paramName, paramValue]) => {
      const pattern = new RegExp(`{{${paramName}}}`, "g");
      result = result.replace(pattern, paramValue);
    });

    return result;
  };
}
