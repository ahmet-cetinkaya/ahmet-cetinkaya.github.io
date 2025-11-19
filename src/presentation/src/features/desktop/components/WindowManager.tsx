import { createSignal, onCleanup, onMount } from "solid-js";
import Container from "@presentation/Container";
import Key from "@packages/acore-solidjs/ui/components/Key";
import Window from "@presentation/src/features/desktop/components/Window";
import WindowModel from "@domain/models/Window";
import ScreenHelper from "@shared/utils/ScreenHelper";
import appCommands from "@shared/constants/AppCommands";
import type { Apps } from "@domain/data/Apps";
import { parseAppPathFromLocation } from "@shared/utils/parseAppPathFromLocation";

export default function WindowManager() {
  const windowService = Container.instance.windowsService;
  const appsService = Container.instance.appsService;
  const [windows, setWindows] = createSignal<WindowModel[]>([]);

  onMount(async () => {
    localStorage.setItem("boot_time", new Date().toISOString());
    await openInitialApp();
    windowService.subscribe((windows) => setWindows(windows));
    window.addEventListener("resize", handleResize);
  });

  onCleanup(() => {
    window.removeEventListener("resize", handleResize);
  });

  async function openInitialApp() {
    const appInfo = parseAppPathFromLocation(window.location.pathname);
    if (ScreenHelper.isMobile()) {
      if (!appInfo.args) appInfo.args = [];
      appInfo.args.push("--maximized");
    }

    const app = await appsService.get((app) => app.path === appInfo.appPath);
    if (!app) return;

    await openWindow(app.id, appInfo.args);
  }

  async function openWindow(appId: Apps, args?: string[]) {
    const existingWindow = await windowService.get((window) => window.appId === appId);
    if (existingWindow) {
      await windowService.active(existingWindow);
      return;
    }

    const appCommand = appCommands[appId];
    if (!appCommand) return;

    const command = appCommand();
    await command.execute(...(args ?? []));
  }

  let checkMobileScreenTimeout: NodeJS.Timeout | null = null;
  function handleResize() {
    if (checkMobileScreenTimeout) clearTimeout(checkMobileScreenTimeout);

    checkMobileScreenTimeout = setTimeout(async () => {
      const windows = await windowService.getAll();
      for (const window of windows) window.isMaximized = ScreenHelper.isMobile();
      windowService.bulkUpdate(windows);
      checkMobileScreenTimeout = null;
    }, 1000);
  }

  return (
    <Key each={windows()} by={(item) => item.id}>
      {(item) => <Window window={item()} />}
    </Key>
  );
}
