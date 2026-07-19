import { For, Show, createSignal, onCleanup } from "solid-js";
import type { JSX } from "solid-js";
import { TranslationKeys } from "@domain/data/Translations";
import Icons from "@domain/data/Icons";
import Icon from "@shared/components/Icon";
import Button from "@shared/components/ui/Button";
import { useI18n } from "@shared/utils/i18nTranslate";

const MIN_SCALE = 0.1;
const MAX_SCALE = 10;
const ZOOM_STEP = 0.25;
const WHEEL_ZOOM_FACTOR = 0.0015;
const ROTATE_STEP_DEGREES = 90;

type Offset = { x: number; y: number };

export default function ImageViewer(props: { src: string; alt: string; onError: () => void }): JSX.Element {
  const translate = useI18n();

  const [scale, setScale] = createSignal(1);
  const [rotation, setRotation] = createSignal(0);
  const [offset, setOffset] = createSignal<Offset>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = createSignal(false);

  let dragStart: { pointerX: number; pointerY: number; origin: Offset } | null = null;

  function clampScale(value: number): number {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
  }

  function zoomIn(): void {
    setScale((current) => clampScale(current + ZOOM_STEP));
  }

  function zoomOut(): void {
    setScale((current) => clampScale(current - ZOOM_STEP));
  }

  function rotate(): void {
    setRotation((current) => current + ROTATE_STEP_DEGREES);
  }

  function reset(): void {
    setScale(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  }

  function handleWheel(event: WheelEvent): void {
    event.preventDefault();
    setScale((current) => clampScale(current - event.deltaY * WHEEL_ZOOM_FACTOR));
  }

  function handlePointerDown(event: PointerEvent): void {
    event.preventDefault();
    dragStart = { pointerX: event.clientX, pointerY: event.clientY, origin: offset() };
    setIsDragging(true);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent): void {
    if (!dragStart) return;
    setOffset({
      x: dragStart.origin.x + (event.clientX - dragStart.pointerX),
      y: dragStart.origin.y + (event.clientY - dragStart.pointerY),
    });
  }

  function handlePointerUp(event: PointerEvent): void {
    if (!dragStart) return;
    dragStart = null;
    setIsDragging(false);
    (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
  }

  onCleanup(() => {
    dragStart = null;
  });

  type ToolbarButton = { icon: Icons; label: string; action: () => void };
  const toolbarButtons = (): ToolbarButton[] => [
    { icon: Icons.zoomIn, label: translate(TranslationKeys.apps_media_viewer_zoom_in), action: zoomIn },
    { icon: Icons.zoomOut, label: translate(TranslationKeys.apps_media_viewer_zoom_out), action: zoomOut },
    { icon: Icons.rotate, label: translate(TranslationKeys.apps_media_viewer_rotate), action: rotate },
    { icon: Icons.refresh, label: translate(TranslationKeys.apps_media_viewer_reset), action: reset },
  ];

  const imageTransform = (): string =>
    `translate(${offset().x}px, ${offset().y}px) scale(${scale()}) rotate(${rotation()}deg)`;

  return (
    <div class="flex size-full flex-col overflow-hidden">
      <div class="border-surface-300 bg-surface-500 flex items-center gap-1 border-b p-2">
        <For each={toolbarButtons()}>
          {(btn) => (
            <Button
              variant="primary"
              size="small"
              ariaLabel={btn.label}
              title={btn.label}
              onClick={btn.action}
              class="w-auto p-2"
            >
              <Icon icon={btn.icon} class="h-4 w-4 shrink-0" />
            </Button>
          )}
        </For>
        <span class="ml-2 text-xs text-gray-400">{Math.round(scale() * 100)}%</span>
      </div>

      <div
        class="bg-surface-900 relative flex flex-1 items-center justify-center overflow-hidden"
        classList={{ "cursor-grabbing": isDragging(), "cursor-grab": !isDragging() }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <Show when={props.src}>
          <img
            src={props.src}
            alt={props.alt}
            draggable={false}
            onError={() => props.onError()}
            referrerpolicy="strict-origin-when-cross-origin"
            class="max-h-full max-w-full object-contain select-none"
            style={{ transform: imageTransform(), "transform-origin": "center center" }}
          />
        </Show>
      </div>
    </div>
  );
}
