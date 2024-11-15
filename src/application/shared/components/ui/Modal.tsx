import classNames from 'classnames';
import { createSignal, type JSX } from 'solid-js';
import { DragHelper } from '~/core/acore-ts/ui/DragHelper';
import { ResizeHelper } from '~/core/acore-ts/ui/ResizeHelper';
import { Position } from '~/core/acore-ts/ui/models/Position';
import type { Size } from '~/core/acore-ts/ui/models/Size';

interface Props {
  title?: string;
  class?: string;
  style?: JSX.CSSProperties;
  children: JSX.Element;
  customHeaderButtons?: JSX.Element;
  position?: Position;
  size?: Size;
  onClick?: () => void;
  onClose?: () => void;
  onDragStart?: (event: MouseEvent, position: Position) => void;
  onDragEnd?: (event: MouseEvent, position: Position) => void;
  onResize?: (event: Event, size: Size) => void;
  onResizeStart?: (event: Event, size: Size, position: Position) => void;
  onResizeEnd?: (event: Event, size: Size, position: Position) => void;
}

export default function Modal(props: Props) {
  const [isModalOpen, setIsModalOpen] = createSignal(true);
  const [isMaximized, setMaximized] = createSignal(false);

  function onModalElementMount(element: HTMLElement) {
    DragHelper.makeDraggableElement(element, {
      onDragStart,
      onDragEnd,
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
    setMaximized((prev) => !prev);
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
    return targetElement.closest('.ac-header-buttons');
  }

  return (
    <div
      ref={(element) => {
        onModalElementMount(element);
      }}
      class={classNames(
        'fixed left-1/3 top-1/3 z-50 min-h-52 min-w-96 transform overflow-auto rounded-lg border border-gray-300 bg-white shadow-md',
        props.class,
      )}
      style={{
        ...props.style,
        top: isMaximized() ? '0px' : props.position?.top ? props.position.top + 'px' : undefined,
        left: isMaximized() ? '0px' : props.position?.left ? props.position.left + 'px' : undefined,
        width: isMaximized() ? '100vw' : props.size?.width ? props.size.width + 'px' : undefined,
        height: isMaximized() ? '100vh' : props.size?.height ? props.size.height + 'px' : undefined,
      }}
      onClick={onClick}
    >
      <header class="flex justify-between gap-2 p-2">
        <h1>{props.title}</h1>

        <div class="ac-header-buttons flex cursor-pointer gap-2">
          {props.customHeaderButtons}
          <button onClick={toggleMaximize}>Maximize</button>
          <button onClick={toggleModal}>Close</button>
        </div>
      </header>

      <main class="p-2">{props.children}</main>
    </div>
  );
}
