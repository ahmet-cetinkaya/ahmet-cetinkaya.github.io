import { createSignal, For, onCleanup, onMount } from "solid-js";
import CryptoExtensions from "~/core/acore-ts/crypto/CryptoExtensions";
import { Categories } from "~/domain/data/Categories";
import type App from "~/domain/models/App";
import Window from "~/domain/models/Window";
import Container from "~/presentation/Container";
import AppShortcut from "~/presentation/src/shared/components/AppShortcut";
import Model from "~/presentation/src/shared/components/ThreeDimensionalModels/ThreeDimensionModel";
import ScreenHelper from "~/presentation/src/shared/utils/ScreenHelper";
import type IAppsService from "~/application/features/app/services/abstraction/IAppsService";
import type IWindowsService from "~/application/features/desktop/services/abstraction/IWindowsService";

type DesktopShortcut = App | null;
type DesktopShortcutMatrix = DesktopShortcut[][];

export default function Desktop() {
  const appsService: IAppsService = Container.instance.appsService;
  const windowsService: IWindowsService = Container.instance.windowsService;

  let containerRef: HTMLDivElement | undefined;
  let matrixDimensions: { dimension1: number; dimension2: number } | undefined;

  const [matrix, setMatrix] = createSignal<DesktopShortcutMatrix>([]);
  const [draggedShortcut, setDraggedShortcut] = createSignal<DesktopShortcut>(null);

  onMount(() => {
    window.addEventListener("resize", generateMatrix);
  });

  onCleanup(() => {
    window.removeEventListener("resize", generateMatrix);
  });

  function onContainerMount(element: HTMLDivElement) {
    containerRef = element;

    requestAnimationFrame(() => {
      matrixDimensions = getMatrixDimensions();
      generateMatrix();
    });
  }

  function getMatrixDimensions() {
    if (!containerRef) return { dimension1: 1, dimension2: 1 };

    const matrixSize = 128;
    const dimension1 = Math.max(Math.floor(containerRef.clientWidth / matrixSize) - 1, 1);
    const dimension2 = Math.max(Math.floor(containerRef.clientHeight / matrixSize) - 1, 1);
    return { dimension1, dimension2 };
  }

  async function generateMatrix() {
    if (!matrixDimensions) return;

    const { dimension1, dimension2 } = matrixDimensions;
    const newMatrix: DesktopShortcutMatrix = Array.from({ length: dimension1 }, () => Array(dimension2).fill(null));

    let x = 0;
    let y = 0;
    const apps: App[] = (await appsService.getAll((a) => a.categoryId === Categories.apps)).slice(
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
    if (!draggedShortcut()) return;
    if (!matrixDimensions) return;

    const updatedMatrix = matrix().map((row) => [...row]);
    const [draggedX, draggedY] = findShortcutPosition(draggedShortcut()!)!;

    const { dimension1, dimension2 } = matrixDimensions;

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

  function onShortcutClick(shortcut: DesktopShortcut) {
    if (!shortcut) return;

    const window = new Window(
      CryptoExtensions.generateNanoId(),
      shortcut.id,
      shortcut.name,
      0,
      false,
      ScreenHelper.isMobile(),
    );
    windowsService.add(window);
  }

  return (
    <div ref={onContainerMount} class="flex size-full flex-row">
      <For each={matrix()}>
        {(row, x) => (
          <div class="flex flex-col">
            <For each={row}>
              {(col, y) => (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onShortcutDrop(x(), y())}
                  class="m-3 h-32 w-32 select-none"
                >
                  {col ? (
                    <AppShortcut
                      label={col.name}
                      icon={<Model model={col.icon}></Model>}
                      href={col.path}
                      onClick={() => onShortcutClick(col)}
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

  function DesktopEmptyGrid() {
    return <div class="size-full" />;
  }
}
