import { createSignal, onMount } from "solid-js";
import type { TranslationKey } from "@domain/data/Translations";
import Container from "@presentation/Container";
import type II18n from "@packages/acore-ts/i18n/abstraction/II18n";

function resolveLocale(i18n: II18n, url: URL | null): string {
  const currentUrl =
    url || (typeof window !== "undefined" ? new URL(window.location.href) : new URL("http://localhost"));
  let locale = i18n.getLocaleFromUrl(currentUrl, i18n.locales[0]);
  if (!i18n.locales.includes(locale)) locale = i18n.locales[0];
  return locale;
}

function useLocale(url: URL | null = null) {
  const { i18n } = Container.instance;
  const [locale, setLocale] = createSignal(resolveLocale(i18n, url));

  onMount(() => {
    i18n.currentLocale.subscribe((locale) => setLocale(locale));
  });

  return { i18n, locale };
}

export function useI18n(url: URL | null = null) {
  const { i18n, locale } = useLocale(url);
  return (key: TranslationKey) => i18n.translate(locale(), key);
}

export function useCurrentLocale(url: URL | null = null) {
  const { locale } = useLocale(url);
  return locale;
}

export function useI18nStatic(url: URL | null = null) {
  const { i18n } = Container.instance;
  const locale = resolveLocale(i18n, url);

  return (key: TranslationKey) => i18n.translate(locale, key);
}
