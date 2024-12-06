import { createSignal, onMount } from "solid-js";
import type { TranslationKey } from "~/domain/data/Translations";
import { Container } from "~/presentation/Container";

export default function useI18n(url: URL | null = null) {
  const i18n = Container.instance.i18n;

  const currentUrl = url || new URL(window.location.href);
  let currentLocale = i18n.getLocaleFromUrl(currentUrl, i18n.locales[0]);
  if (!i18n.locales.includes(currentLocale)) currentLocale = i18n.locales[0];
  const [locale, setLocale] = createSignal(currentLocale);

  onMount(() => {
    subscribeToLangChange();
  });

  function subscribeToLangChange() {
    i18n.currentLocale.subscribe((locale) => {
      setLocale(locale);
    });
  }

  return (key: TranslationKey) => i18n.translate(locale(), key);
}
