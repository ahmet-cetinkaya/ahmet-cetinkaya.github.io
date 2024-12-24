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
import Modal from "~/presentation/src/shared/components/ui/Modal";
import { useI18n } from "~/presentation/src/shared/utils/i18nTranslate";
import AppContent from "./AppContent";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";

type Props = WindowModel;

export default function Window(props: Props) {
  const windowsService = Container.instance.windowsService;
  const appsService = Container.instance.appsService;
  const translate = useI18n();

  const [overrideLayer, setOverrideLayer] = createSignal<number | null>(null);
  const [path] = createResource<string>(getAppPath);

  async function getAppPath() {
    const app = await appsService.get((a) => a.id == props.appId);
    if (!app) throw new Error(`App (${props.appId}) not found`);

    return app.path;
  }

  function onMinimize() {
    windowsService.minimize(props);
  }

  async function onClick() {
    if (!path()) return;

    await windowsService.active(props);
    navigate(path()!);
  }

  function onClose() {
    windowsService.remove((w) => w.id === props.id);
  }

  function onDragStart() {
    if (!path()) return;

    const activatedWindow = windowsService.getActivatedWindow();
    const maxLayer = activatedWindow ? activatedWindow.layer : 1;
    setOverrideLayer(maxLayer + 1);
    navigate(path()!);
  }

  function onDragEnd(_: MouseEvent, position: Position) {
    props.position = position;
    if (overrideLayer()) {
      props.layer = overrideLayer()!;
      setOverrideLayer(null);
    }
    windowsService.update(props);
  }

  function onResizeStart() {
    if (!path()) return;

    const activatedWindow = windowsService.getActivatedWindow();
    const maxLayer = activatedWindow ? activatedWindow.layer : 1;
    setOverrideLayer(maxLayer + 1);
    navigate(path()!);
  }

  function onResizeEnd(_: Event, size: Size, position: Position) {
    props.size = size;
    props.position = position;
    if (overrideLayer()) {
      props.layer = overrideLayer()!;
      setOverrideLayer(null);
    }
    windowsService.update(props);
  }

  function onToggleMaximize(isMaximized: boolean) {
    props.isMaximized = isMaximized;
    windowsService.update(props);
  }

  return (
    <Modal
      title={props.title}
      customHeaderButtons={
        <Button
          onClick={onMinimize}
          variant="text"
          size="small"
          ariaLabel={translate(TranslationKeys.desktop_minimize)}
        >
          <Icon icon={Icons.minimize} class="size-4" />
        </Button>
      }
      position={props.position}
      size={props.size}
      isMaximized={props.isMaximized}
      maximizeOffset={{ top: 72, left: 10, right: 10, bottom: 16 }}
      dragOffset={{ top: 72 }}
      onClick={onClick}
      onClose={onClose}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onResizeStart={onResizeStart}
      onResizeEnd={onResizeEnd}
      onToggleMaximize={onToggleMaximize}
      class={mergeCls("border-black bg-surface-500 text-white shadow-secondary", {
        hidden: props.isMinimized,
      })}
      headerClass="bg-surface-400"
      style={{
        "z-index": overrideLayer() ?? props.layer,
      }}
    >
      <AppContent appId={props.appId} args={props.args} />
    </Modal>
  );
}
