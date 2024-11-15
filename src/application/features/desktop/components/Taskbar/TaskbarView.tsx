import { navigate } from 'astro:transitions/client';
import classNames from 'classnames';
import { createMemo, createSignal, For, onCleanup, Show } from 'solid-js';
import Button from '~/application/shared/components/ui/Button';
import { Container } from '~/container';
import { Window } from '~/domain/models/Window';

export default function TaskbarView() {
  const [windows, setWindows] = createSignal<Window[]>([]);
  const windowsService = createMemo(() => Container.WindowsService);
  const appsService = createMemo(() => Container.AppsService);

  windowsService().subscribe(onWindowsChange);

  onCleanup(() => {
    windowsService().unsubscribe(onWindowsChange);
  });

  function onWindowsChange(windows: Window[]) {
    setWindows(windows);
  }

  async function onClickTaskview(window: Window) {
    if (windowsService().isActivated(window)) windowsService().minimize(window);
    else {
      windowsService().active(window);
      const app = await appsService().get((a) => a.id === window.appId);
      if (app) navigate(app.path);
    }
  }

  return (
    <Show when={windows().length > 0}>
      <div class="flex gap-2">
        <For each={windows()}>
          {(window) => (
            <Button
              className={classNames({ 'bg-slate-200 hover:bg-slate-300': windowsService().isActivated(window) })}
              onClick={() => onClickTaskview(window)}
            >
              {window.title}
            </Button>
          )}
        </For>
      </div>
    </Show>
  );
}
