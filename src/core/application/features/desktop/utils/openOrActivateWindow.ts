import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import type Window from "@domain/models/Window";
import { haveSameWindowArgs } from "./haveSameWindowArgs";

export async function openOrActivateWindow(windowsService: IWindowsService, appWindow: Window): Promise<void> {
  const existingWindow = await windowsService.get(
    (window) => window.appId === appWindow.appId && haveSameWindowArgs(window.args, appWindow.args),
  );

  if (existingWindow) {
    await windowsService.active(existingWindow);
    return;
  }

  await windowsService.add(appWindow);
  await windowsService.active(appWindow);
}
