import { createMemo, createSignal, For, onMount, Show } from "solid-js";
import { CryptoExtensions } from "~/core/acore-ts/crypto/CryptoExtensions";
import type { Window as WindowModel } from "~/domain/models/Window";
import { Container } from "~/presentation/Container";
import Window from "./Window";

export default function WindowManager() {
  const windowService = createMemo(() => Container.instance.windowsService);
  const appsService = createMemo(() => Container.instance.appsService);
  const [windows, setWindows] = createSignal<WindowModel[]>([]);
  const i18n = Container.instance.i18n;

  onMount(() => {
    windowService().subscribe((windows) => {
      setWindows(windows);
    });

    let appPath = window.location.pathname;
    if (appPath === "/") return;
    if (appPath.startsWith("/")) {
      appPath = appPath.slice(1);
    }
    if (i18n.locales.some((lang) => appPath.startsWith(`${lang}/`))) {
      appPath = appPath.split("/").slice(1).join("/");
    }

    console.debug("🚀 ~ onMount ~ appPath:", appPath);

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
