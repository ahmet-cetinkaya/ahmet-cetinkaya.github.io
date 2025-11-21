import { createResource, createSignal, onCleanup, onMount, Show } from "solid-js";
import CryptoExtensions from "@packages/acore-ts/crypto/CryptoExtensions";
import { Apps } from "@domain/data/Apps";
import Icons from "@domain/data/Icons";
import { Locales, TranslationKeys } from "@domain/data/Translations";
import Window from "@domain/models/Window";
import Container from "@presentation/Container";
import AppShortcut from "@shared/components/AppShortcut";
import Icon from "@shared/components/Icon";
import ThreeDimensionalModel from "@shared/components/ThreeDimensionalModel";
import Title from "@shared/components/ui/Title";
import { useI18n } from "@shared/utils/i18nTranslate";
import ScreenHelper from "@shared/utils/ScreenHelper";

export default function Completed() {
  const { appsService, windowsService, i18n } = Container.instance;
  const translate = useI18n();

  const [contactApp] = createResource(getContactApp);
  const [currentLocale, setCurrentLocale] = createSignal<string>(Locales.en);

  onMount(() => {
    i18n.currentLocale.subscribe(setCurrentLocale);
  });

  onCleanup(() => {
    i18n.currentLocale.unsubscribe(setCurrentLocale);
  });

  async function getContactApp() {
    const app = await appsService.get((x) => x.id === Apps.email);
    if (!app) throw new Error("Contact app not found");
    return app;
  }

  async function onContactClick() {
    if (!contactApp()) return;

    const window = new Window(
      CryptoExtensions.generateNanoId(),
      contactApp()!.id,
      contactApp()!.name,
      undefined,
      undefined,
      ScreenHelper.isMobile(),
    );
    requestAnimationFrame(() => windowsService.add(window));
  }

  return (
    <div class="flex h-full flex-col items-center justify-center px-8 py-4">
      <Icon icon={Icons.check} class="size-32" />
      <Title>{translate(TranslationKeys.apps_welcome_completed)}</Title>
      <Title level={2} class="text-lg">
        {translate(TranslationKeys.apps_welcome_completed_text)}
      </Title>

      <span class="mt-4 flex flex-col items-center justify-center">
        <p>{translate(TranslationKeys.apps_welcome_if_you_want_to_contact_me)}</p>

        <Show when={contactApp()}>
          <AppShortcut
            label={contactApp()!.name}
            href={`${currentLocale() === Locales.en ? "" : `/${currentLocale()}`}/${contactApp()!.path}`}
            onClick={onContactClick}
            icon={<ThreeDimensionalModel model={contactApp()!.icon} />}
            class="mt-2 size-32"
          />
        </Show>
      </span>
    </div>
  );
}
