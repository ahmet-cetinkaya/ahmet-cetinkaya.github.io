import { createSignal, For, onCleanup, onMount } from "solid-js";
import type App from "~/domain/models/App";
import Container from "~/presentation/Container";
import AppShortcut from "~/presentation/src/shared/components/AppShortcut";
import ThreeDimensionalModel from "~/presentation/src/shared/components/ThreeDimensionalModel";
import ScreenHelper from "~/presentation/src/shared/utils/ScreenHelper";
import type IAppsService from "~/application/features/apps/services/abstraction/IAppsService";
import appCommands from "~/presentation/src/shared/constants/AppCommands";
import type IFileSystemService from "~/application/features/system/services/abstraction/IFileSystemService";
import File from "~/domain/models/File";
import Extensions from "~/application/features/system/constants/Extensions";

type DesktopShortcut = App | null;
type DesktopShortcutMatrix = DesktopShortcut[][];

const EXEC_REGEX = /Exec=(.+)/;

export default function Desktop() {
  const appsService: IAppsService = Container.instance.appsService;
  const fileSystemService: IFileSystemService = Container.instance.fileSystemService;

  let containerRef: HTMLDivElement | undefined;
  let matrixDimensions: { dimension1: number; dimension2: number } | undefined;

  const [matrix, setMatrix] = createSignal<DesktopShortcutMatrix>([]);
  const [draggedShortcut, setDraggedShortcut] = createSignal<DesktopShortcut>(null);

  onMount(() => {
    window.addEventListener("resize", onResize);
  });

  onCleanup(() => {
    window.removeEventListener("resize", () => onResize);
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

    const matrixSize = 128 + 24; // 128px for the shortcut size, 24px for the gap
    const dimension1 = Math.max(Math.floor(containerRef.clientWidth / matrixSize), 1);
    const dimension2 = Math.max(Math.floor(containerRef.clientHeight / matrixSize), 1);

    // Ensure the dimensions do not exceed the container size
    const maxDimension1 = Math.floor(window.innerWidth / matrixSize);
    const maxDimension2 = Math.floor(window.innerHeight / matrixSize);

    return {
      dimension1: Math.min(dimension1, maxDimension1),
      dimension2: Math.min(dimension2, maxDimension2),
    };
  }

  async function generateMatrix() {
    if (!matrixDimensions) return;

    const { dimension1, dimension2 } = matrixDimensions!;
    const newMatrix: DesktopShortcutMatrix = Array.from({ length: dimension1 }, () => Array(dimension2).fill(null));

    const desktopShortcuts = (await fileSystemService.getAll(
      (e) => e instanceof File && e.extension === Extensions.desktop,
    )) as File[];

    const desktopAppShortcuts = desktopShortcuts.map((shortcut) => {
      const match = shortcut.content.match(EXEC_REGEX);
      if (!match) throw new Error(`Invalid desktop file: ${shortcut.id}`);
      return match[1];
    });

    const desktopApps = (await appsService.getAll((a) => desktopAppShortcuts.includes(a.id)))
      .sort((a, b) => desktopAppShortcuts.indexOf(a.id) - desktopAppShortcuts.indexOf(b.id))
      .slice(0, dimension1 * dimension2);

    let x = 0,
      y = 0;
    desktopApps.forEach((shortcut) => {
      newMatrix[x][y] = shortcut;
      if (++y >= dimension2) {
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

    const appCommand = appCommands[shortcut.id];
    if (!appCommand) throw new Error(`No command found for app with id: ${shortcut.id}`);

    const appCommandArgs = [];
    if (ScreenHelper.isMobile()) appCommandArgs.push("--maximized");

    appCommand().execute(...appCommandArgs);
  }

  let resizeDebounceTimeout: Timer | null = null;
  function onResize() {
    if (resizeDebounceTimeout) clearTimeout(resizeDebounceTimeout);
    resizeDebounceTimeout = setTimeout(() => {
      matrixDimensions = getMatrixDimensions();
      generateMatrix();
    }, 1000);
  }

  return (
    <div ref={onContainerMount} class="flex size-full flex-row gap-6">
      <For each={matrix()}>
        {(row, x) => (
          <div class="flex flex-col gap-6">
            <For each={row}>
              {(col, y) => (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onShortcutDrop(x(), y())}
                  class="h-32 w-32 select-none"
                >
                  {col ? (
                    <AppShortcut
                      label={col.name}
                      icon={<ThreeDimensionalModel model={col.icon}></ThreeDimensionalModel>}
                      href={`/${col.path}`}
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
}

function DesktopEmptyGrid() {
  return <div class="size-full select-none" />;
}
