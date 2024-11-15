import { createMemo, createSignal, onMount, Show } from 'solid-js';
import Dropdown, { type DropdownItem } from '~/application/shared/components/ui/Dropdown';
// import Image from '~/application/shared/components/ui/Image.astro';
import { Container } from '~/container';
import AhmetCetinkayaLogo from '~/content/assets/images/ahmet-cetinkaya-logo.svg';
import { CryptoExtensions } from '~/core/acore-ts/crypto/CryptoExtensions';
import type { Window } from '~/domain/models/Window';

export default function Menu() {
  const windowsService = createMemo(() => Container.WindowsService);
  const categoriesService = createMemo(() => Container.CategoriesService);
  const appsService = createMemo(() => Container.AppsService);
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
        <img src={AhmetCetinkayaLogo.src} class="h-5 w-5" alt="Menu" />
      </Dropdown>
    </Show>
  );
}
