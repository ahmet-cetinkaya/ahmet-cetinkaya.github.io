import { navigate } from "astro:transitions/client";
import { createSignal, onMount } from "solid-js";
import { Locales, locales } from "~/domain/data/Translations";
import { Container } from "~/presentation/Container";
import Button from "~/presentation/src/shared/components/ui/Button";

export default function ChangeLocale() {
  const i18n = Container.instance.i18n;

  const [currentLanguage, setCurrentLocale] = createSignal(locales[0]);

  onMount(() => {
    requestAnimationFrame(() => initLocale());
  });

  function initLocale() {
    if (localStorage.getItem("locale")) {
      const storedLocale = localStorage.getItem("locale");
      if (storedLocale) saveLocale(storedLocale);
      return;
    }

    let browserLocale = i18n.getBrowserLocale();
    if (browserLocale.includes("-")) browserLocale = browserLocale.substring(0, browserLocale.indexOf("-"));
    saveLocale(browserLocale);
  }

  function saveLocale(nextLocale: string) {
    i18n.currentLocale.set(nextLocale);
    setCurrentLocale(nextLocale as Locales);

    const currentUrl = new URL(window.location.href);
    const navigateUrl = i18n.getLocaleUrl(currentUrl, nextLocale, locales[0]);
    navigate(navigateUrl.toString());

    localStorage.setItem("locale", nextLocale);
  }

  function onChanged() {
    const currentLanguageIndex = locales.indexOf(currentLanguage());
    const nextLanguageIndex = (currentLanguageIndex + 1) % locales.length;
    const nextLocale = locales[nextLanguageIndex];
    saveLocale(nextLocale);
  }

  return <Button ref={initLocale} onClick={onChanged} label={currentLanguage().toUpperCase()} variant="text" />;
}
