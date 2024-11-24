import { navigate } from "astro:transitions/client";
import { createSignal, onMount } from "solid-js";
import { languages } from "~/domain/data/Translations";
import { Container } from "~/presentation/Container";
import Button from "~/presentation/src/shared/components/ui/Button";

export default function ChangeLocale() {
  const i18n = Container.instance.i18n;

  const [currentLanguage, setCurrentLocale] = createSignal(languages[0]);

  onMount(() => {
    initLocale();
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
    setCurrentLocale(nextLocale);

    const currentUrl = new URL(window.location.href);
    const navigateUrl = i18n.getLocaleUrl(currentUrl, nextLocale, languages[0]);
    navigate(navigateUrl.toString());

    localStorage.setItem("locale", nextLocale);
  }

  function onChanged() {
    const currentLanguageIndex = languages.indexOf(currentLanguage());
    const nextLanguageIndex = (currentLanguageIndex + 1) % languages.length;
    const nextLocale = languages[nextLanguageIndex];
    saveLocale(nextLocale);
  }

  return <Button onClick={onChanged} label={currentLanguage().toUpperCase()} variant="text" />;
}
