import { navigate } from "astro:transitions/client";
import { createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import { Window } from "~/domain/models/Window";
import { Container } from "~/presentation/Container";
import Button from "~/presentation/src/shared/components/ui/Button";

export default function TaskbarView() {
  const [windows, setWindows] = createSignal<Window[]>([]);
  const windowsService = createMemo(() => Container.instance.windowsService);
  const appsService = createMemo(() => Container.instance.appsService);

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
              className={mergeCls({
                "bg-slate-200 hover:bg-slate-300": windowsService().isActivated(window),
              })}
              onClick={() => onClickTaskview(window)}
              label={window.title}
            />
          )}
        </For>
      </div>
    </Show>
  );
}
