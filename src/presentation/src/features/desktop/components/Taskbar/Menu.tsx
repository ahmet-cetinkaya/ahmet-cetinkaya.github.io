import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { CryptoExtensions } from "~/core/acore-ts/crypto/CryptoExtensions";
import type { Window } from "~/domain/models/Window";
import { Container } from "~/presentation/Container";
import type { DropdownItem } from "~/presentation/src/shared/components/ui/Dropdown";
import Dropdown from "~/presentation/src/shared/components/ui/Dropdown";
import useI18n from "~/presentation/src/shared/utils/i18n-translate";

export default function Menu() {
  const windowsService = Container.instance.windowsService;
  const categoriesService = Container.instance.categoriesService;
  const appsService = Container.instance.appsService;
  const i18n = Container.instance.i18n;

  const [menuItems, setMenuItems] = createSignal<DropdownItem[]>([]);
  const translate = useI18n();

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
        text: translate(category.name),
        items: [],
      };

      const apps = await appsService.getAll((app) => app.categoryId === category.id);
      categoryMenuHeader.items!.push(
        ...apps.map(
          (app) =>
            ({
              text: translate(app.name),
              href: app.path,
              onClick: () => {
                windowsService.add({
                  id: CryptoExtensions.generateNanoId(),
                  appId: app.id,
                  title: app.name,
                } as Window);
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
        A{/* <img src={AhmetCetinkayaLogo.src} class="h-5 w-5" alt="Menu" /> */}
      </Dropdown>
    </Show>
  );
}
