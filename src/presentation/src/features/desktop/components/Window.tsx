import { createResource, createSignal } from "solid-js";
import Position from "@packages/acore-ts/ui/models/Position";
import type Size from "@packages/acore-ts/ui/models/Size";
import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import WindowModel from "@domain/models/Window";
import Container from "@presentation/Container";
import Icon from "@shared/components/Icon";
import Button from "@shared/components/ui/Button";
import Modal from "@packages/acore-solidjs/ui/components/Modal";
import { useI18n } from "@shared/utils/i18nTranslate";
import AppContent from "@presentation/src/features/desktop/components/AppContent";
import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";

type Props = {
  window: WindowModel;
  topOffset?: number;
};

const WINDOW_EDGE_OFFSET: number = 16;

export default function Window(props: Props) {
  const { windowsService, appsService, i18n } = Container.instance;
  const translate = useI18n();

  const { appId } = props.window;
  const { args: appArgs } = props.window;

  const [overrideLayer, setOverrideLayer] = createSignal<number | null>(null);
  const [path] = createResource<string>(getAppPath);

  async function getAppPath() {
    const app = await appsService.get((a) => a.id == props.window.appId);
    if (!app) throw new Error(`App (${props.window.appId}) not found`);

    return app.path;
  }

  async function onMinimize(event: MouseEvent) {
    event.stopPropagation();
    await windowsService.minimize(props.window);
  }

  async function onClick() {
    if (!path()) return;

    if (!windowsService.isActivated(props.window)) {
      await windowsService.active(props.window);
    }

    navigateToAppPath();
  }

  function navigateToAppPath() {
    const currentLocale = i18n.currentLocale.get();
    const localePathPrefix = currentLocale === "en" ? "" : `/${currentLocale}`;
    const targetPath = `${localePathPrefix}/${path()!}`;
    if (window.location.pathname !== targetPath) {
      // Sync the address bar to the focused window without triggering a
      // ClientRouter transition, which would remount every island (and thus
      // reload all open windows) on focus/drag/resize.
      window.history.pushState({}, "", targetPath);
    }
  }

  function onClose() {
    windowsService.remove((w) => w.id === props.window.id);
  }

  function onDragStart() {
    if (!path()) return;

    const activatedWindow = windowsService.getActivatedWindow();
    const maxLayer = activatedWindow ? activatedWindow.layer : 1;
    setOverrideLayer(maxLayer + 1);
    navigateToAppPath();
  }

  function onDragEnd(_: MouseEvent, position: Position) {
    props.window.position = position;
    if (overrideLayer()) {
      props.window.layer = overrideLayer()!;
      setOverrideLayer(null);
    }
    windowsService.update(props.window);
  }

  function onResizeStart() {
    if (!path()) return;

    const activatedWindow = windowsService.getActivatedWindow();
    const maxLayer = activatedWindow ? activatedWindow.layer : 1;
    setOverrideLayer(maxLayer + 1);
    navigateToAppPath();
  }

  function onResizeEnd(_: Event, size: Size, position: Position) {
    props.window.size = size;
    props.window.position = position;
    if (overrideLayer()) {
      props.window.layer = overrideLayer()!;
      setOverrideLayer(null);
    }
    windowsService.update(props.window);
  }

  function onToggleMaximize(isMaximized: boolean) {
    props.window.isMaximized = isMaximized;
    windowsService.update(props.window);
  }

  return (
    <Modal
      title={translate(props.window.title)}
      position={props.window.position}
      size={props.window.size}
      isMaximized={props.window.isMaximized}
      customHeaderButtons={
        <Button
          onClick={onMinimize}
          class="hover:bg-surface-300 rounded p-1 transition-colors duration-200 ease-in-out"
          variant="text"
          size="small"
          ariaLabel={translate(TranslationKeys.desktop_minimize)}
        >
          <Icon icon={Icons.minimize} class="size-4" />
        </Button>
      }
      maximizeOffset={{
        top: 70 + WINDOW_EDGE_OFFSET,
        left: WINDOW_EDGE_OFFSET,
        right: WINDOW_EDGE_OFFSET,
        bottom: WINDOW_EDGE_OFFSET,
      }}
      dragOffset={{ top: (props.topOffset ?? 0) + WINDOW_EDGE_OFFSET }}
      maximizable={true}
      onClick={onClick}
      onClose={onClose}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onResizeStart={onResizeStart}
      onResizeEnd={onResizeEnd}
      onToggleMaximize={onToggleMaximize}
      styles={{
        wrapper: mergeCls(
          "shadow-md min-h-52 min-w-60 transform rounded-lg border border-black bg-surface-500 text-white shadow-secondary",
          {
            hidden: props.window.isMinimized,
          },
        ),
        header: "bg-surface-400",
        title: "text-xl font-semibold",
        headerButtons: "ml-auto flex items-center gap-2",
        maximizeButton: "text-gray-300 transition-colors duration-200 ease-in-out hover:bg-surface-300",
        closeButton: "text-gray-300 transition-colors duration-200 ease-in-out hover:bg-surface-300 hover:text-white",
        icon: "size-4",
      }}
      style={{
        "z-index": overrideLayer() ?? props.window.layer,
      }}
      customButton={(props) => (
        <Button
          class="hover:bg-surface-300 rounded p-1 transition-colors duration-200 ease-in-out"
          onClick={props.onClick}
          variant="text"
          size="small"
          ariaLabel={props.ariaLabel!}
        >
          {props.children}
        </Button>
      )}
    >
      <AppContent appId={appId} args={appArgs} />
    </Modal>
  );
}
