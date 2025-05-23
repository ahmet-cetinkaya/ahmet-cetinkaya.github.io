import { navigate } from "astro:transitions/client";
import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import ArrayExtensions from "~/presentation/src/core/acore-ts/data/array/ArrayExtensions";
import { mergeCls } from "~/presentation/src/core/acore-ts/ui/ClassHelpers";
import Icons from "~/domain/data/Icons";
import { TranslationKeys } from "~/domain/data/Translations";
import Window from "~/domain/models/Window";
import Container from "~/presentation/Container";
import Icon from "~/presentation/src/shared/components/Icon";
import Button from "~/presentation/src/shared/components/ui/Button";
import Dropdown, { type DropdownItem } from "~/presentation/src/shared/components/ui/Dropdown";
import { useI18n } from "~/presentation/src/shared/utils/i18nTranslate";

export default function TaskbarView() {
  const windowsService = Container.instance.windowsService;
  const appsService = Container.instance.appsService;
  const i18n = Container.instance.i18n;
  const translate = useI18n();

  const [windows, setWindows] = createSignal<Window[]>([]);

  onMount(() => {
    windowsService.subscribe(onWindowsChange);
  });

  onCleanup(() => {
    windowsService.unsubscribe(onWindowsChange);
  });

  function onWindowsChange(windows: Window[]) {
    setWindows(windows);
  }

  async function onClickTaskView(window: Window) {
    if (windowsService.isActivated(window)) windowsService.minimize(window);
    else {
      windowsService.active(window);
      const app = await appsService.get((a) => a.id === window.appId);
      if (!app) return;

      const currentLocale = i18n.currentLocale.get();
      const localePathPrefix = currentLocale === "en" ? "" : `/${currentLocale}`;
      navigate(`${localePathPrefix}/${app.path}`);
    }
  }

  return (
    <Show when={windows().length > 0}>
      {/* Desktop */}
      <span class="hidden select-none items-center gap-2 sm:flex">
        <For each={windows()}>{(window) => <TaskViewButton window={window} />}</For>
      </span>

      {/* Tablet */}
      <span class="hidden select-none items-center gap-2 xs:flex sm:hidden">
        <MiniTaskView />
      </span>

      {/* Mobile */}
      <span class="flex select-none items-center gap-2 xs:hidden">
        <TaskViewDropdown />
      </span>
    </Show>
  );

  function MiniTaskView() {
    const topWindow = createMemo(() =>
      windows().some((w) => w.layer) ? ArrayExtensions.maxBy(windows(), (x) => x.layer)! : windows()[0],
    );
    const otherWindows = createMemo(() => windows().filter((w) => w.id !== topWindow().id));

    return (
      <>
        <TaskViewButton window={topWindow()} />
        <Show when={otherWindows().length > 0}>
          <Dropdown
            menuItems={otherWindows().map(
              (window) =>
                ({
                  text: window.title,
                  onClick: () => onClickTaskView(window),
                }) as DropdownItem,
            )}
            buttonClass="text-xs size-8"
            ariaLabel={translate(TranslationKeys.desktop_taskbar_other_windows_menu)}
          >
            <Icon icon={Icons.downArrow} class="size-4" />
          </Dropdown>
        </Show>
      </>
    );
  }

  function TaskViewDropdown() {
    return (
      <Dropdown
        menuItems={windows().map(
          (window) =>
            ({
              text: window.title,
              onClick: () => onClickTaskView(window),
            }) as DropdownItem,
        )}
        buttonClass="h-8 text-xs w-8"
        ariaLabel={translate(TranslationKeys.desktop_taskbar_windows_menu)}
      >
        <Icon icon={Icons.downArrow} class="size-4" />
      </Dropdown>
    );
  }

  function TaskViewButton(props: { window: Window }) {
    return (
      <Button
        onClick={() => onClickTaskView(props.window)}
        class={mergeCls("h-8 w-fit min-w-16 truncate text-xs", {
          "bg-surface-300 transition-colors duration-200 ease-in-out hover:bg-surface-200": windowsService.isActivated(
            props.window,
          ),
        })}
        variant="primary"
        ariaLabel={translate(props.window.title)}
      >
        {translate(props.window.title)}
      </Button>
    );
  }
}
