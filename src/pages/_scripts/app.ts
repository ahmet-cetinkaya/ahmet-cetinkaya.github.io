import type { IAppsService } from '~/application/features/app/services/abstraction/IAppsService';
import type { IWindowsService } from '~/application/features/desktop/services/abstraction/IWindowsService';
import { Container } from '~/container';
import { CryptoExtensions } from '~/core/acore-ts/crypto/CryptoExtensions';
import { App, Apps } from '~/domain/models/App';
import type { Window } from '~/domain/models/Window';

export async function openApp(appId: Apps) {
  const appsService: IAppsService = Container.AppsService;
  const windowsService: IWindowsService = Container.WindowsService;

  const app: App | null = await appsService.get((app) => {
    return app.id === appId;
  });
  if (!app) return;

  const openedAppWindow = await windowsService.get((window) => window.appId === app.id);
  if (openedAppWindow) {
    windowsService.active(openedAppWindow);
    return;
  }

  await windowsService.add({
    id: CryptoExtensions.generateNanoId(),
    title: app.name,
    appId: app.id,
  } as Window);
}
