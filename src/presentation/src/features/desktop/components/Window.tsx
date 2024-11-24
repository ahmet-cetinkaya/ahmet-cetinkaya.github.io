import type { JSX } from "astro/jsx-runtime";
import { navigate } from "astro:transitions/client";
import { createSignal, onMount } from "solid-js";
import { Position } from "~/core/acore-ts/ui/models/Position";
import type { Size } from "~/core/acore-ts/ui/models/Size";
import { Window as WindowModel } from "~/domain/models/Window";
import { Container } from "~/presentation/Container";
import Modal from "~/presentation/src/shared/components/ui/Modal";
import useI18n from "~/presentation/src/shared/utils/i18n-translate";

interface Props {
  window: WindowModel;
  children: JSX.Element;
}

export default function Window(props: Props) {
  const windowService = Container.instance.windowsService;
  const appsService = Container.instance.appsService;

  const [overrideLayer, setOverrideLayer] = createSignal<number | null>(null);
  const [path, setPath] = createSignal<string>("");
  const translate = useI18n();

  onMount(() => {
    getAppPath();
  });

  async function getAppPath() {
    const app = await appsService.get((a) => a.id == props.window.appId);
    if (!app) throw new Error(`App (${props.window.appId}) not found`);

    setPath(app.path);
  }

  function onMinimize() {
    windowService.minimize(props.window);
  }

  function onClick() {
    windowService.active(props.window);
    navigate(path());
  }

  function onClose() {
    windowService.remove((w) => w.id === props.window.id);
  }

  function onDragStart() {
    const activatedWindow = windowService.getActivedWindow();
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
    windowService.update(props.window);
  }

  function onResizeStart() {
    const activatedWindow = windowService.getActivedWindow();
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
    windowService.update(props.window);
  }

  return (
    <Modal
      title={translate(props.window.title)}
      style={{
        "z-index": overrideLayer() ?? props.window.layer,
      }}
      customHeaderButtons={
        <button type="button" onClick={onMinimize}>
          Minimize
        </button>
      }
      position={props.window.position}
      size={props.window.size}
      onClick={onClick}
      onClose={onClose}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onResizeStart={onResizeStart}
      onResizeEnd={onResizeEnd}
    >
      {props.children}
    </Modal>
  );
}
