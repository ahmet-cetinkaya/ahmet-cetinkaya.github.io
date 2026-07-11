import { navigate } from "astro:transitions/client";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
import type { Apps } from "@domain/data/Apps";
import Icons from "@domain/data/Icons";
import { Locales, TranslationKeys } from "@domain/data/Translations";
import Container from "@presentation/Container";
import Icon from "@shared/components/Icon";
import type { BaseDropdownItem } from "@packages/acore-solidjs/ui/components/Dropdown";
import Dropdown from "@packages/acore-solidjs/ui/components/Dropdown";
import { useI18n } from "@shared/utils/i18nTranslate";
import appCommands from "@shared/constants/AppCommands";
import ScreenHelper from "@shared/utils/ScreenHelper";

export default function Menu() {
  const { categoriesService, appsService, i18n } = Container.instance;
  const translate = useI18n();

  const [menuItems, setMenuItems] = createSignal<BaseDropdownItem[]>([]);

  onMount(() => {
    prepareMenuItems();
    i18n.currentLocale.subscribe(() => prepareMenuItems());
  });

  onCleanup(() => {
    i18n.currentLocale.unsubscribe(() => prepareMenuItems());
  });

  async function prepareMenuItems() {
    const items: BaseDropdownItem[] = [];

    const categories = await categoriesService.getAll();
    for (const category of categories) {
      const categoryMenuHeader: BaseDropdownItem = {
        text: translate(category.name),
        items: [],
      };

      const apps = await appsService.getAll((app) => app.categoryId === category.id);

      categoryMenuHeader.items!.push(
        ...apps.map(
          (app) =>
            ({
              text: translate(app.name),
              icon: app.icon,
              onClick: () => onAppClick(app.id),
            }) as BaseDropdownItem,
        ),
      );

      if (categoryMenuHeader.items!.length > 0) items.push(categoryMenuHeader);
    }

    const systemMenuHeader: BaseDropdownItem = {
      text: translate(TranslationKeys.system_power),
      items: [
        {
          text: translate(TranslationKeys.system_reboot),
          icon: Icons.reboot,
          onClick: () => onPowerOptionClick("reboot"),
        },
        {
          text: translate(TranslationKeys.system_shut_down),
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
    const localePathPrefix = currentLocale === Locales.tr ? "/tr" : "";
    switch (command) {
      case "reboot":
        navigate(`${localePathPrefix}/reboot`);
        break;
      case "shutdown":
        navigate(`${localePathPrefix}/shutdown`);
        break;
    }
  }

  return (
    <Show when={menuItems().length > 0}>
      <Dropdown
        id="menuDropdown"
        menuItems={menuItems()}
        ariaLabel={translate(TranslationKeys.common_menu)}
        renderIcon={(icon) => <Icon icon={icon as Icons} class="text-base" preserveFill={true} />}
        styles={{
          wrapper: "inline-block text-left",
          button:
            "rounded-lg px-4 py-1 text-primary-500 shadow-primary bg-surface-400 hover:bg-surface-300 transition-colors duration-200 ease-in-out",
          menu: "absolute left-0 z-50 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 bg-surface-500 shadow-secondary",
          menuContainer: "py-1",
          categoryHeader: "border-b border-surface-300 px-4 py-2 text-xs text-gray-300",
          menuItem:
            "block px-4 py-2 text-sm w-full text-start border-none shadow-none cursor-pointer rounded transition-colors duration-200 ease-in-out text-gray-200 hover:bg-surface-300 hover:text-white",
          menuItemText: "",
        }}
      >
        <Icon icon={Icons.ahmetcetinkaya} class="text-sm" />
      </Dropdown>
    </Show>
  );
}
