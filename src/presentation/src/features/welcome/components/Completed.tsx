import { createSignal, onMount, Show } from "solid-js";
import type { IAppsService } from "~/application/features/app/services/abstraction/IAppsService";
import { Apps } from "~/domain/data/Apps";
import { Icons } from "~/domain/data/Icons";
import { TranslationKeys } from "~/domain/data/Translations";
import type { App } from "~/domain/models/App";
import { Container } from "~/presentation/Container";
import AppShortcut from "~/presentation/src/shared/components/AppShortcut";
import Icon from "~/presentation/src/shared/components/Icon";
import Model from "~/presentation/src/shared/components/threeDimensionalModels/Model";
import useI18n from "~/presentation/src/shared/utils/i18nTranslate";

export default function Completed() {
  const appsService: IAppsService = Container.instance.appsService;
  const translate = useI18n();

  const [contactApp, setContactApp] = createSignal<App | undefined>(undefined);

  onMount(() => {
    getContactApp();
  });

  async function getContactApp() {
    const app = await appsService.get((x) => x.id === Apps.contact);
    if (!app) throw new Error("Contact app not found");
    setContactApp(app);
  }

  return (
    <div class="flex h-full flex-col items-center justify-center">
      <Icon icon={Icons.check} class="size-32" />
      <h1 class="mt-4 text-lg font-semibold">{translate(TranslationKeys.apps_welcome_completed)}</h1>
      <p>{translate(TranslationKeys.apps_welcome_completed_text)}</p>

      <span class="mt-4 flex flex-col items-center justify-center">
        <p>{translate(TranslationKeys.apps_welcome_if_you_want_to_contact_me)}</p>

        <Show when={contactApp()}>
          <AppShortcut
            href={contactApp()!.path}
            label={contactApp()!.name}
            icon={<Model model={contactApp()!.icon} />}
            class="mt-2 size-32"
          />
        </Show>
      </span>
    </div>
  );
}
