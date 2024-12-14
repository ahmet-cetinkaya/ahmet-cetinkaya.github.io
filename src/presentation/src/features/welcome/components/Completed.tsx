import { createResource, Show } from "solid-js";
import type IAppsService from "~/application/features/app/services/abstraction/IAppsService";
import type IWindowsService from "~/application/features/desktop/services/abstraction/IWindowsService";
import CryptoExtensions from "~/core/acore-ts/crypto/CryptoExtensions";
import { Apps } from "~/domain/data/Apps";
import Icons from "~/domain/data/Icons";
import { TranslationKeys } from "~/domain/data/Translations";
import Window from "~/domain/models/Window";
import Container from "~/presentation/Container";
import AppShortcut from "~/presentation/src/shared/components/AppShortcut";
import Icon from "~/presentation/src/shared/components/Icon";
import Model from "~/presentation/src/shared/components/ThreeDimensionalModels/ThreeDimensionModel";
import Title from "~/presentation/src/shared/components/ui/Title";
import { useI18n } from "~/presentation/src/shared/utils/i18nTranslate";
import AppContent from "~/presentation/src/features/desktop/components/AppContent";
import ScreenHelper from "~/presentation/src/shared/utils/ScreenHelper";

export default function Completed() {
  const appsService: IAppsService = Container.instance.appsService;
  const windowsService: IWindowsService = Container.instance.windowsService;
  const translate = useI18n();

  const [contactApp] = createResource(getContactApp);

  async function getContactApp() {
    const app = await appsService.get((x) => x.id === Apps.email);
    if (!app) throw new Error("Contact app not found");
    return app;
  }

  function onContactClick() {
    if (!contactApp()) return;

    const window = new Window(
      CryptoExtensions.generateNanoId(),
      contactApp()!.id,
      contactApp()!.name,
      0,
      false,
      ScreenHelper.isMobile(),
      <AppContent appId={contactApp()!.id} />,
    );
    windowsService.add(window);
  }

  return (
    <div class="flex h-full flex-col items-center justify-center">
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
            href={contactApp()!.path}
            onClick={onContactClick}
            icon={<Model model={contactApp()!.icon} />}
            class="mt-2 size-32"
          />
        </Show>
      </span>
    </div>
  );
}
