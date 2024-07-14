import { EventFunctions } from '@corePackages/ahmet-cetinkaya-core/dom/events/EventFunctions';
import { createMemo, createSignal, For, onCleanup, onMount, type JSX } from 'solid-js';
import Link from '~/application/shared/components/ui/Link';
import { Container } from '~/container';
import type { App } from '~/domain/models/App';
import { Categories } from '~/domain/models/Category';

type DesktopShortcut = App | null;
type DesktopShortcutMatrix = DesktopShortcut[][];

export default function Desktop() {
  const appsService = createMemo(() => Container.AppsService);

  const [matrix, setMatrix] = createSignal<DesktopShortcutMatrix>([]);
  const [draggedShortcut, setDraggedShortcut] = createSignal<DesktopShortcut>(null);

  let containerRef: HTMLDivElement | undefined;

  onMount(() => {
    generateMatrix();
    window.addEventListener('resize', generateMatrix);
  });

  onCleanup(() => {
    window.removeEventListener('resize', generateMatrix);
  });

  async function generateMatrix() {
    const { dimension1, dimension2 } = getMatrixDimensions();
    const newMatrix = Array(dimension1)
      .fill(null)
      .map(() => Array(dimension2).fill(null));

    let x = 0;
    let y = 0;
    const apps: App[] = (await appsService().getAll((a) => a.categoryId === Categories.Apps)).slice(
      0,
      dimension1 * dimension2,
    );

    apps.forEach((shortcut) => {
      newMatrix[x][y] = shortcut;
      ++y;
      if (y >= dimension2) {
        y = 0;
        ++x;
      }
    });

    setMatrix(newMatrix);
  }

  function getMatrixDimensions() {
    if (!containerRef) return { dimension1: 1, dimension2: 1 };

    const matrixSize = 128;
    const dimension1 = Math.max(Math.floor(containerRef.clientWidth / matrixSize) - 1, 1);
    const dimension2 = Math.max(Math.floor(containerRef.clientHeight / matrixSize) - 1, 1);
    return { dimension1, dimension2 };
  }

  function findShortcutPosition(shortcut: DesktopShortcut) {
    for (let x = 0; x < matrix().length; x++)
      for (let y = 0; y < matrix()[x].length; y++)
        if (matrix()[x][y] && matrix()[x][y]!.id === shortcut?.id) return [x, y];

    return null;
  }

  function onShortcutDragStart(shortcut: DesktopShortcut) {
    setDraggedShortcut(shortcut);
  }

  function onShortcutDrop(targetX: number, targetY: number) {
    const updatedMatrix = matrix().map((row) => [...row]);
    const [draggedX, draggedY] = findShortcutPosition(draggedShortcut()!)!;

    const { dimension1, dimension2 } = getMatrixDimensions();

    const validTargetX = targetX >= 0 && targetX < dimension1;
    const validTargetY = targetY >= 0 && targetY < dimension2;

    if (!validTargetX || !validTargetY) {
      const newX = Math.min(Math.max(targetX, 0), dimension1 - 1);
      const newY = Math.min(Math.max(targetY, 0), dimension2 - 1);

      targetX = newX;
      targetY = newY;
    }

    const targetShortcut = updatedMatrix[targetX][targetY];
    updatedMatrix[targetX][targetY] = draggedShortcut()!;
    updatedMatrix[draggedX][draggedY] = targetShortcut;

    setMatrix(updatedMatrix);
    setDraggedShortcut(null);
  }

  return (
    <div ref={containerRef} class="flex h-full flex-row">
      <For each={matrix()}>
        {(row, x) => (
          <div class="flex flex-col">
            <For each={row}>
              {(col, y) => (
                <div
                  onDragOver={EventFunctions.preventDefault}
                  onDrop={() => onShortcutDrop(x(), y())}
                  class="m-3 h-32 w-32"
                >
                  {col ? (
                    <DesktopShortcut
                      label={col.name}
                      icon={col.icon}
                      href={col.path}
                      onDragStart={() => onShortcutDragStart(col)}
                    />
                  ) : (
                    <DesktopEmptyGrid />
                  )}
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
}

//#region DesktopShortcut

interface DesktopShortcutProps {
  label: string;
  href: string;
  icon: JSX.Element;
  onDragStart: () => void;
}
function DesktopShortcut({ label, href, icon, onDragStart }: DesktopShortcutProps) {
  return (
    <Link
      href={href}
      draggable={true}
      onDragStart={onDragStart}
      class="flex h-full w-full flex-col items-center justify-center"
    >
      <figure>
        <picture>{icon}</picture>
        <figcaption class="w-full truncate text-wrap text-center">{label}</figcaption>
      </figure>
    </Link>
  );
}

//#endregion

//#region DesktopEmptyGrid

function DesktopEmptyGrid() {
  return <div class="h-full w-full" />;
}

//#endregion
