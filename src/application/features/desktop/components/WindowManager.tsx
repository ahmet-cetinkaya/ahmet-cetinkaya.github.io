import { createMemo, createSignal, For, onMount, Show } from 'solid-js';
import { Container } from '~/container';
import { CryptoExtensions } from '~/core/acore-ts/crypto/CryptoExtensions';
import type { Window as WindowModel } from '~/domain/models/Window';
import Window from './Window';

export default function WindowManager() {
  const windowService = createMemo(() => Container.WindowsService);
  const appsService = createMemo(() => Container.AppsService);
  const [windows, setWindows] = createSignal<WindowModel[]>([]);

  onMount(() => {
    windowService().subscribe((windows) => {
      setWindows(windows);
    });

    const appPath = window.location.pathname;
    if (appPath) openApp(appPath);
  });

  async function openApp(appPath: string) {
    const app = await appsService().get((app) => app.path === appPath);
    console.log(app);
    if (!app) return;

    const openedAppWindow = await windowService().get((window) => window.appId === app.id);
    if (openedAppWindow) {
      windowService().active(openedAppWindow);
      return;
    }

    windowService().add({
      id: CryptoExtensions.generateNanoId(),
      title: app.name,
      appId: app.id,
    } as WindowModel);
  }

  return (
    <For each={windows()}>
      {(window) => (
        <Show when={!window.isMinimized}>
          <Window window={window}>{window.content}</Window>
        </Show>
      )}
    </For>
  );
}
