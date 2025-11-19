import { navigate } from "astro:transitions/client";
import { createSignal, onMount, Show } from "solid-js";
import { Locales, locales } from "@domain/data/Translations";
import Container from "@presentation/Container";
import Button from "@shared/components/ui/Button";

export default function ChangeLocale() {
  const i18n = Container.instance.i18n;

  const [currentLanguage, setCurrentLocale] = createSignal<string | undefined>();

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

    const currentUrl = new URL(window.location.href);
    const navigateUrl = i18n.getLocaleUrl(currentUrl, nextLocale, locales[0]);
    navigate(navigateUrl.toString());

    localStorage.setItem("locale", nextLocale);
    setCurrentLocale(nextLocale as Locales);
  }

  function onChanged() {
    const currentLanguageIndex = locales.indexOf(currentLanguage() as Locales);
    const nextLanguageIndex = (currentLanguageIndex + 1) % locales.length;
    const nextLocale = locales[nextLanguageIndex];
    saveLocale(nextLocale);
  }

  return (
    <Show when={currentLanguage()}>
      <Button ref={initLocale} onClick={onChanged} variant="text" ariaLabel={`Change Locale: ${currentLanguage()}`}>
        {currentLanguage()!.toUpperCase()}
      </Button>
    </Show>
  );
}
