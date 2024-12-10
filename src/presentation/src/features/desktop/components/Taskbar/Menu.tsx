import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { CryptoExtensions } from "~/core/acore-ts/crypto/CryptoExtensions";
import { Icons } from "~/domain/data/Icons";
import { Window } from "~/domain/models/Window";
import { Container } from "~/presentation/Container";
import Icon from "~/presentation/src/shared/components/Icon";
import type { DropdownItem } from "~/presentation/src/shared/components/ui/Dropdown";
import Dropdown from "~/presentation/src/shared/components/ui/Dropdown";
import openAppContent from "~/presentation/src/shared/utils/openAppContent";
import { ScreenHelper } from "~/presentation/src/shared/utils/ScreenHelper";

export default function Menu() {
  const windowsService = Container.instance.windowsService;
  const categoriesService = Container.instance.categoriesService;
  const appsService = Container.instance.appsService;
  const i18n = Container.instance.i18n;

  const [menuItems, setMenuItems] = createSignal<DropdownItem[]>([]);

  onMount(() => {
    prepareMenuItems();
    i18n.currentLocale.subscribe(() => prepareMenuItems());
  });

  onCleanup(() => {
    i18n.currentLocale.unsubscribe(() => prepareMenuItems());
  });

  async function prepareMenuItems() {
    const categories = await categoriesService.getAll();
    const items: DropdownItem[] = [];

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
              onClick: () => {
                const window = new Window(
                  CryptoExtensions.generateNanoId(),
                  app.id,
                  app.name,
                  undefined,
                  false,
                  ScreenHelper.isMobile(),
                  openAppContent(app.id),
                );
                windowsService.add(window);
              },
            }) as DropdownItem,
        ),
      );

      if (categoryMenuHeader.items!.length > 0) items.push(categoryMenuHeader);
    }

    setMenuItems(items);
  }

  return (
    <Show when={menuItems().length > 0}>
      <Dropdown menuItems={menuItems()}>
        <Icon icon={Icons.ahmetcetinkaya} class="size-4" />
      </Dropdown>
    </Show>
  );
}
