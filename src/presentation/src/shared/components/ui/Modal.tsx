import { createSignal, Show, type JSX } from "solid-js";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import DragHelper from "~/core/acore-ts/ui/DragHelper";
import Position from "~/core/acore-ts/ui/models/Position";
import type Size from "~/core/acore-ts/ui/models/Size";
import ResizeHelper from "~/core/acore-ts/ui/ResizeHelper";
import { useI18n } from "../../utils/i18nTranslate";
import { TranslationKeys } from "~/domain/data/Translations";
import Button from "./Button";
import Icon from "../Icon";
import Icons from "~/domain/data/Icons";
import Title from "./Title";
import type { Offset } from "~/core/acore-ts/ui/models/Offset";

type Props = {
  children: JSX.Element;
  class?: string;
  customHeaderButtons?: JSX.Element;
  dragOffset?: Offset;
  headerClass?: string;
  isMaximized?: boolean;
  maximizable?: boolean;
  maximizeOffset?: Offset;
  onClick?: () => void;
  onClose?: () => void;
  onDragEnd?: (event: MouseEvent, position: Position) => void;
  onDragStart?: (event: MouseEvent, position: Position) => void;
  onResize?: (event: Event, size: Size) => void;
  onResizeEnd?: (event: Event, size: Size, position: Position) => void;
  onResizeStart?: (event: Event, size: Size, position: Position) => void;
  onToggleMaximize?: (isMaximized: boolean) => void;
  position?: Position;
  size?: Size;
  style?: JSX.CSSProperties;
  title?: TranslationKeys;
};

export default function Modal(props: Props) {
  const maximizable = props.maximizable ?? true;

  const translate = useI18n();

  const [isModalOpen, setIsModalOpen] = createSignal(true);
  const [isMaximized, setIsMaximized] = createSignal(props.isMaximized ?? false);

  function onContainerMount(element: HTMLElement) {
    DragHelper.makeDraggableElement(element, {
      onDragStart,
      onDragEnd,
      offset: props.dragOffset,
    });

    ResizeHelper.makeResizableElement(element, {
      onResizeStart: (event, size) => {
        props.onResizeStart?.(event, size, new Position(element.offsetTop, element.offsetLeft));
      },
      onResizeEnd: (event, size) => {
        props.onResizeEnd?.(event, size, new Position(element.offsetTop, element.offsetLeft));
      },
    });
  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen());
    props.onClose?.();
  }

  function toggleMaximize() {
    if (!maximizable) return;

    const nextIsMaximizedValue: boolean = !isMaximized();
    setIsMaximized(nextIsMaximizedValue);
    props.onToggleMaximize?.(nextIsMaximizedValue);
  }

  function onClick(event: MouseEvent) {
    if (isHeaderButton(event.target as HTMLElement)) return;

    props.onClick?.();
  }

  function onDragStart(event: MouseEvent, position: Position) {
    props.onDragStart?.(event, position);
  }

  function onDragEnd(event: MouseEvent, position: Position) {
    props.onDragEnd?.(event, position);
  }

  function isHeaderButton(targetElement: HTMLElement) {
    return targetElement.closest(".ac-header-buttons");
  }

  return (
    <Show when={isModalOpen()}>
      <div
        ref={onContainerMount}
        onClick={onClick}
        class={mergeCls(
          "shadow-md bg-whitez fixed min-h-52 min-w-60 transform overflow-hidden rounded-lg border border-gray-300",
          props.class,
        )}
        style={{
          ...props.style,
          top:
            (isMaximized() ?? maximizable)
              ? `${0 + (props.maximizeOffset?.top ?? 0)}px`
              : props.position?.top
                ? props.position.top + "px"
                : "15%",
          left:
            (isMaximized() ?? maximizable)
              ? `${0 + (props.maximizeOffset?.left ?? 0)}px`
              : props.position?.left
                ? props.position.left + "px"
                : "15%",
          right: (isMaximized() ?? maximizable) ? `${0 + (props.maximizeOffset?.right ?? 0)}px` : undefined,
          bottom: (isMaximized() ?? maximizable) ? `${0 + (props.maximizeOffset?.bottom ?? 0)}px` : undefined,
          width:
            (isMaximized() ?? maximizable)
              ? "calc(100vw - " +
                (props.maximizeOffset?.left ?? 0) +
                "px - " +
                (props.maximizeOffset?.right ?? 0) +
                "px)"
              : props.size?.width
                ? props.size.width + "px"
                : "70vw",
          height:
            (isMaximized() ?? maximizable)
              ? "calc(100vh - " +
                (props.maximizeOffset?.top ?? 0) +
                "px - " +
                (props.maximizeOffset?.bottom ?? 0) +
                "px)"
              : props.size?.height
                ? props.size.height + "px"
                : "70vh",
        }}
      >
        <header class={mergeCls("flex items-center justify-between gap-2 p-2", props.headerClass)}>
          <Title class="m-0 text-xl">{translate(props.title!)}</Title>

          <div class="ac-header-buttons flex cursor-pointer items-center justify-between gap-1">
            {props.customHeaderButtons}
            <Show when={maximizable}>
              <Button
                onClick={toggleMaximize}
                variant="text"
                size="small"
                ariaLabel={translate(TranslationKeys.common_maximize)}
              >
                <Icon icon={Icons.maximize} class="size-4" />
              </Button>
            </Show>
            <Button
              onClick={toggleModal}
              variant="text"
              size="small"
              ariaLabel={translate(TranslationKeys.common_close)}
            >
              <Icon icon={Icons.close} class="size-4" />
            </Button>
          </div>
        </header>

        <main class="size-full overflow-hidden p-2 pb-16">{props.children}</main>
      </div>
    </Show>
  );
}
