import { CryptoExtensions } from '@corePackages/ahmet-cetinkaya-core/crypto/CryptoExtensions';
import { Container } from '~/container';
import { App, Apps } from '~/domain/models/App';

export async function openApp(appId: Apps) {
  const appsService = Container.AppsService;
  const windowsService = Container.WindowsService;

  const app: App | null = await appsService.get((app) => app.id === appId);
  if (!app) return;

  const openedAppWindow = await windowsService.get((window) => window.appId === app.id);
  if (openedAppWindow) {
    windowsService.active(openedAppWindow.id);
    return;
  }

  await windowsService.add({
    id: CryptoExtensions.generateNanoId(),
    title: app.name,
    appId: app.id,
    isMinimized: false,
    layer: 0,
    createdDate: new Date(),
  });
}
