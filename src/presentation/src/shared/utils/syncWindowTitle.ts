import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import type { Apps } from "@domain/data/Apps";
import type { TranslationKey } from "@domain/data/Translations";

// Shared by window-hosted apps (Text Editor, Media Viewer, ...) to keep their
// OS window title in sync with in-app state (current file name, dirty mark, etc.).
// Falls back to the first window for the app when no explicit windowId is known yet.
export async function syncWindowTitle(
  windowsService: IWindowsService,
  appId: Apps,
  windowId: string | undefined,
  title: string,
): Promise<void> {
  const appWindow = windowId
    ? await windowsService.get((w) => w.id === windowId)
    : await windowsService.get((w) => w.appId === appId);
  if (!appWindow || appWindow.title === title) return;
  appWindow.title = title as TranslationKey;
  await windowsService.update(appWindow);
}
