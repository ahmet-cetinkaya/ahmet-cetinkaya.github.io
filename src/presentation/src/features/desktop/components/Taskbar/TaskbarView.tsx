import { navigate } from "astro:transitions/client";
import { createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import { Window } from "~/domain/models/Window";
import { Container } from "~/presentation/Container";
import Button from "~/presentation/src/shared/components/ui/Button";
import useI18n from "~/presentation/src/shared/utils/i18nTranslate";

export default function TaskbarView() {
  const windowsService = createMemo(() => Container.instance.windowsService);
  const appsService = createMemo(() => Container.instance.appsService);

  const translate = useI18n();

  const [windows, setWindows] = createSignal<Window[]>([]);

  windowsService().subscribe(onWindowsChange);

  onCleanup(() => {
    windowsService().unsubscribe(onWindowsChange);
  });

  function onWindowsChange(windows: Window[]) {
    setWindows(windows);
  }

  async function onClickTaskView(window: Window) {
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
              class={mergeCls("h-8 text-xs", {
                "bg-slate-200 hover:bg-slate-300": windowsService().isActivated(window),
              })}
              onClick={() => onClickTaskView(window)}
              label={translate(window.title)}
            />
          )}
        </For>
      </div>
    </Show>
  );
}
