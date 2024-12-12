import { createMemo, createSignal, For, onCleanup, onMount, Show, type JSX, createEffect } from "solid-js";
import CryptoExtensions from "~/core/acore-ts/crypto/CryptoExtensions";
import WindowModel from "~/domain/models/Window";
import Container from "~/presentation/Container";
import AppContent from "~/presentation/src/features/desktop/components/AppContent";
import Window from "./Window";
import ScreenHelper from "~/presentation/src/shared/utils/ScreenHelper";
import { navigate } from "astro:transitions/client";

export default function WindowManager() {
  const windowService = createMemo(() => Container.instance.windowsService);
  const appsService = createMemo(() => Container.instance.appsService);
  const [windows, setWindows] = createSignal<WindowModel[]>([]);
  const i18n = Container.instance.i18n;

  onMount(async () => {
    await openInitialApp();
    checkMobileScreen();
  });

  createEffect(() => {
    checkMobileScreen();
  });

  async function openInitialApp() {
    windowService().subscribe((windows) => {
      setWindows(windows);
    });

    let appPath = window.location.pathname;
    if (appPath.startsWith("/")) appPath = appPath.slice(1);
    if (i18n.locales.some((lang) => appPath.startsWith(`${lang}/`))) appPath = appPath.split("/").slice(1).join("/");

    const app = await appsService().get((app) => app.path === appPath);
    if (!app) {
      navigate("/");
      return;
    }

    const openedAppWindow = await windowService().get((window) => window.appId === app.id);
    if (openedAppWindow) {
      windowService().active(openedAppWindow);
      return;
    }

    windowService().add({
      id: CryptoExtensions.generateNanoId(),
      title: app.name,
      appId: app.id,
      content: <AppContent appId={app.id} />,
      isMaximized: ScreenHelper.isMobile(),
    } as WindowModel);
  }

  let checkMobileScreenTimeout: NodeJS.Timeout | null = null;
  function checkMobileScreen() {
    const handleResize = () => {
      if (checkMobileScreenTimeout) clearTimeout(checkMobileScreenTimeout);

      checkMobileScreenTimeout = setTimeout(async () => {
        const windows = await windowService().getAll();
        for (const window of windows) window.isMaximized = ScreenHelper.isMobile();
        windowService().bulkUpdate(windows);

        checkMobileScreenTimeout = null;
      }, 300);
    };

    window.addEventListener("resize", handleResize);
    onCleanup(() => window.removeEventListener("resize", handleResize));
  }

  return (
    <For each={windows()}>
      {(window) => (
        <Show when={!window.isMinimized}>
          <Window window={window}>{window.content as JSX.Element}</Window>
        </Show>
      )}
    </For>
  );
}
