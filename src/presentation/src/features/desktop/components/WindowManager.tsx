import { createSignal, onCleanup, onMount } from "solid-js";
import CryptoExtensions from "~/core/acore-ts/crypto/CryptoExtensions";
import WindowModel from "~/domain/models/Window";
import Container from "~/presentation/Container";
import ScreenHelper from "~/presentation/src/shared/utils/ScreenHelper";
import Key from "~/core/acore-solidjs/ui/components/Key";
import Window from "./Window";

export default function WindowManager() {
  const windowService = Container.instance.windowsService;
  const appsService = Container.instance.appsService;
  const [windows, setWindows] = createSignal<WindowModel[]>([]);
  const i18n = Container.instance.i18n;

  onMount(async () => {
    await openInitialApp();
    subscribeToResizeEvents();
    localStorage.setItem("boot_time", new Date().toISOString());
  });

  onCleanup(() => {
    unsubscribeFromResizeEvents();
  });

  async function openInitialApp() {
    let appPath = window.location.pathname;
    if (appPath.startsWith("/")) appPath = appPath.slice(1);
    if (i18n.locales.some((lang) => appPath.startsWith(`${lang}/`))) appPath = appPath.split("/").slice(1).join("/");

    const app = await appsService.get((app) => app.path === appPath);
    if (!app) return;

    const openedAppWindow = await windowService.get((window) => window.appId === app.id);
    if (openedAppWindow) {
      windowService.active(openedAppWindow);
      return;
    }

    await windowService.add({
      id: CryptoExtensions.generateNanoId(),
      title: app.name,
      appId: app.id,
      isMaximized: ScreenHelper.isMobile(),
    } as WindowModel);

    windowService.subscribe((windows) => {
      setWindows(windows);
    });
  }

  let checkMobileScreenTimeout: NodeJS.Timeout | null = null;
  function subscribeToResizeEvents() {
    window.addEventListener("resize", handleResize);
  }

  function unsubscribeFromResizeEvents() {
    window.removeEventListener("resize", handleResize);
  }

  function handleResize() {
    if (checkMobileScreenTimeout) clearTimeout(checkMobileScreenTimeout);

    checkMobileScreenTimeout = setTimeout(async () => {
      const windows = await windowService.getAll();
      for (const window of windows) window.isMaximized = ScreenHelper.isMobile();
      windowService.bulkUpdate(windows);

      checkMobileScreenTimeout = null;
    }, 300);
  }

  return (
    <Key each={windows()} by={(item) => item.id}>
      {(item) => <Window window={item()} />}
    </Key>
  );
}
