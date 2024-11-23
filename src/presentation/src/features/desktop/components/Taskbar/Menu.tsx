import { createMemo, createSignal, onMount, Show } from "solid-js";
import { CryptoExtensions } from "~/core/acore-ts/crypto/CryptoExtensions";
import type { Window } from "~/domain/models/Window";
import { Container } from "~/presentation/Container";
import type { DropdownItem } from "~/presentation/src/shared/components/ui/Dropdown";
import Dropdown from "~/presentation/src/shared/components/ui/Dropdown";

export default function Menu() {
  const windowsService = createMemo(() => Container.instance.windowsService);
  const categoriesService = createMemo(() => Container.instance.categoriesService);
  const appsService = createMemo(() => Container.instance.appsService);
  const [menuItems, setMenuItems] = createSignal<DropdownItem[]>([]);

  onMount(() => {
    prepareMenuItems();
  });

  async function prepareMenuItems() {
    const categories = await categoriesService().getAll();
    const items: DropdownItem[] = [];

    for (const category of categories) {
      const categoryMenuHeader: DropdownItem = {
        text: category.name,
        items: [],
      };

      const apps = await appsService().getAll((app) => app.categoryId === category.id);
      categoryMenuHeader.items!.push(
        ...apps.map(
          (app) =>
            ({
              text: app.name,
              href: app.path,
              onClick: () => {
                windowsService().add({
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
