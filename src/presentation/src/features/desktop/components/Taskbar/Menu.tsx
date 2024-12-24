import { navigate } from "astro:transitions/client";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
import type { Apps } from "~/domain/data/Apps";
import Icons from "~/domain/data/Icons";
import { Locales, TranslationKeys } from "~/domain/data/Translations";
import Container from "~/presentation/Container";
import Icon from "~/presentation/src/shared/components/Icon";
import type { DropdownItem } from "~/presentation/src/shared/components/ui/Dropdown";
import Dropdown from "~/presentation/src/shared/components/ui/Dropdown";
import appCommands from "~/presentation/src/shared/constants/AppCommands";
import { useI18n } from "~/presentation/src/shared/utils/i18nTranslate";
import ScreenHelper from "~/presentation/src/shared/utils/ScreenHelper";

export default function Menu() {
  const categoriesService = Container.instance.categoriesService;
  const appsService = Container.instance.appsService;
  const i18n = Container.instance.i18n;
  const translate = useI18n();

  const [menuItems, setMenuItems] = createSignal<DropdownItem[]>([]);

  onMount(() => {
    prepareMenuItems();
    i18n.currentLocale.subscribe(() => prepareMenuItems());
  });

  onCleanup(() => {
    i18n.currentLocale.unsubscribe(() => prepareMenuItems());
  });

  async function prepareMenuItems() {
    const items: DropdownItem[] = [];

    const categories = await categoriesService.getAll();
    for (const category of categories) {
      const categoryMenuHeader: DropdownItem = {
        text: category.name,
        items: [],
      };

      const apps = await appsService.getAll((app) => app.categoryId === category.id);
      categoryMenuHeader.items!.push(
        ...apps.map(
          (app) =>
            ({
              text: app.name,
              icon: app.icon,
              href: app.path,
              onClick: () => onAppClick(app.id),
            }) as DropdownItem,
        ),
      );

      if (categoryMenuHeader.items!.length > 0) items.push(categoryMenuHeader);
    }

    const systemMenuHeader: DropdownItem = {
      text: TranslationKeys.system_power,
      items: [
        {
          text: TranslationKeys.system_reboot,
          icon: Icons.reboot,
          onClick: () => onPowerOptionClick("reboot"),
        },
        {
          text: TranslationKeys.system_shut_down,
          icon: Icons.shutDown,
          onClick: () => onPowerOptionClick("shutdown"),
        },
      ],
    };
    items.push(systemMenuHeader);

    setMenuItems(items);
  }

  function onAppClick(appId: Apps) {
    const appCommand = appCommands[appId];
    if (!appCommand) throw new Error(`No command found for app with id: ${appId}`);

    const appCommandArgs = [];
    if (ScreenHelper.isMobile()) appCommandArgs.push("--maximized");

    appCommand().execute(...appCommandArgs);
  }

  function onPowerOptionClick(command: string) {
    const currentLocale = i18n.currentLocale.get();
    const pathPrefix = currentLocale === Locales.tr ? "/tr" : "";
    switch (command) {
      case "reboot":
        navigate(`${pathPrefix}/reboot`);
        break;
      case "shutdown":
        navigate(`${pathPrefix}/shutdown`);
        break;
    }
  }

  return (
    <Show when={menuItems().length > 0}>
      <Dropdown menuItems={menuItems()} ariaLabel={translate(TranslationKeys.common_menu)}>
        <Icon icon={Icons.ahmetcetinkaya} class="size-4" />
      </Dropdown>
    </Show>
  );
}
