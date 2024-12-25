import { navigate } from "astro:transitions/client";
import { createResource, createSignal } from "solid-js";
import Position from "~/core/acore-ts/ui/models/Position";
import type Size from "~/core/acore-ts/ui/models/Size";
import Icons from "~/domain/data/Icons";
import { TranslationKeys } from "~/domain/data/Translations";
import WindowModel from "~/domain/models/Window";
import Container from "~/presentation/Container";
import Icon from "~/presentation/src/shared/components/Icon";
import Button from "~/presentation/src/shared/components/ui/Button";
import Modal from "~/core/acore-solidjs/ui/components/Modal";
import { useI18n } from "~/presentation/src/shared/utils/i18nTranslate";
import AppContent from "./AppContent";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";

type Props = {
  window: WindowModel;
};

export default function Window(props: Props) {
  const windowsService = Container.instance.windowsService;
  const appsService = Container.instance.appsService;
  const translate = useI18n();

  const [overrideLayer, setOverrideLayer] = createSignal<number | null>(null);
  const [path] = createResource<string>(getAppPath);

  async function getAppPath() {
    const app = await appsService.get((a) => a.id == props.window.appId);
    if (!app) throw new Error(`App (${props.window.appId}) not found`);

    return app.path;
  }

  async function onMinimize() {
    await windowsService.minimize(props.window);
  }

  async function onClick() {
    if (!path()) return;

    await windowsService.active(props.window);
    navigate(path()!);
  }

  function onClose() {
    windowsService.remove((w) => w.id === props.window.id);
  }

  function onDragStart() {
    if (!path()) return;

    const activatedWindow = windowsService.getActivatedWindow();
    const maxLayer = activatedWindow ? activatedWindow.layer : 1;
    setOverrideLayer(maxLayer + 1);
    navigate(path()!);
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
    navigate(path()!);
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
          class="rounded p-1 transition-colors duration-200 ease-in-out hover:bg-surface-300"
          variant="text"
          size="small"
          ariaLabel={translate(TranslationKeys.desktop_minimize)}
        >
          <Icon icon={Icons.minimize} class="size-4" />
        </Button>
      }
      maximizeOffset={{ top: 72, left: 10, right: 10, bottom: 16 }}
      dragOffset={{ top: 72 }}
      onClick={onClick}
      onClose={onClose}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onResizeStart={onResizeStart}
      onResizeEnd={onResizeEnd}
      onToggleMaximize={onToggleMaximize}
      class={mergeCls("shadow-md fixed min-h-52 min-w-60 transform rounded-lg border border-black bg-surface-500 text-white shadow-secondary", {
        hidden: props.window.isMinimized,
      })}
      headerClass="bg-surface-400"
      style={{
        "z-index": overrideLayer() ?? props.window.layer,
      }}
      customButton={(props) => (
        <Button
          class="rounded p-1 transition-colors duration-200 ease-in-out hover:bg-surface-300"
          onClick={props.onClick}
          variant="text"
          size="small"
          ariaLabel={props.ariaLabel!}
        >
          {props.children}
        </Button>
      )}
    >
      <AppContent appId={props.window.appId} args={props.window.args} />
    </Modal>
  );
}
