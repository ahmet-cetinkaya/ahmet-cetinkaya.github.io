import type { JSX } from "astro/jsx-runtime";
import { navigate } from "astro:transitions/client";
import { createSignal, onMount } from "solid-js";
import { Position } from "~/core/acore-ts/ui/models/Position";
import type { Size } from "~/core/acore-ts/ui/models/Size";
import { Icons } from "~/domain/data/Icons";
import { Window as WindowModel } from "~/domain/models/Window";
import { Container } from "~/presentation/Container";
import Icon from "~/presentation/src/shared/components/Icon";
import Button from "~/presentation/src/shared/components/ui/Button";
import Modal from "~/presentation/src/shared/components/ui/Modal";

type Props = {
  window: WindowModel;
  children: JSX.Element;
};

export default function Window(props: Props) {
  const windowsService = Container.instance.windowsService;
  const appsService = Container.instance.appsService;

  const [overrideLayer, setOverrideLayer] = createSignal<number | null>(null);
  const [path, setPath] = createSignal<string>("");

  onMount(() => {
    getAppPath();
  });

  async function getAppPath() {
    const app = await appsService.get((a) => a.id == props.window.appId);
    if (!app) throw new Error(`App (${props.window.appId}) not found`);

    setPath(app.path);
  }

  function onMinimize() {
    windowsService.minimize(props.window);
  }

  async function onClick() {
    await windowsService.active(props.window);
    navigate(path());
  }

  function onClose() {
    windowsService.remove((w) => w.id === props.window.id);
  }

  function onDragStart() {
    const activatedWindow = windowsService.getActivatedWindow();
    const maxLayer = activatedWindow ? activatedWindow.layer : 1;
    setOverrideLayer(maxLayer + 1);
    navigate(path());
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
    const activatedWindow = windowsService.getActivatedWindow();
    const maxLayer = activatedWindow ? activatedWindow.layer : 1;
    setOverrideLayer(maxLayer + 1);
    navigate(path());
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
      title={props.window.title}
      customHeaderButtons={
        <Button onClick={onMinimize} variant="text" size="small">
          <Icon icon={Icons.minimize} class="size-4" />
        </Button>
      }
      position={props.window.position}
      size={props.window.size}
      isMaximized={props.window.isMaximized}
      maximizeOffset={{ top: 92, left: 10, right: 10, bottom: 16 }}
      dragOffset={{ top: 92 }}
      onClick={onClick}
      onClose={onClose}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onResizeStart={onResizeStart}
      onResizeEnd={onResizeEnd}
      onToggleMaximize={onToggleMaximize}
      class="border-black bg-surface-500 text-white shadow-secondary"
      headerClass="bg-surface-400"
      style={{
        "z-index": overrideLayer() ?? props.window.layer,
      }}
    >
      {props.children}
    </Modal>
  );
}
