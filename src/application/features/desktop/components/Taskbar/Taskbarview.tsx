import classNames from 'classnames';
import { createMemo, createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import Button from '~/application/shared/components/ui/Button';
import { Container } from '~/container';
import { Window } from '~/domain/models/Window';
import type { IWindowsService } from '../../services/abstraction/IWindowsService';

export default function TaskbarView() {
  const [windows, setWindows] = createSignal<Window[]>([]);
  const windowsService = createMemo<IWindowsService>(() => Container.WindowsService);

  onMount(() => {
    windowsService().subscribe(onWindowsChange);
  });

  onCleanup(() => {
    windowsService().unSubscribe(onWindowsChange);
  });

  function onWindowsChange(updatedWindows: Window[]) {
    setWindows(
      updatedWindows.map((w) => {
        if (w.updatedDate !== windows().find((x) => x.id === w.id)?.updatedDate) return w;
        return { ...w };
      }),
    );
  }

  function onClickTaskview(window: Window) {
    if (windowsService().isActivated(window)) windowsService().minimize(window.id);
    else windowsService().active(window.id);
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
