import { createSignal, createResource, createMemo, onMount, Show, onCleanup } from "solid-js";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import FileExplorerService, {
  type FileExplorerState,
  FileViewMode,
  FileSortCriteria,
  SortOrder,
} from "@application/features/fileExplorer/services/FileExplorerService";
import Directory from "@domain/models/Directory";
import Container from "@presentation/Container";
import Icons from "@domain/data/Icons";
import { useI18n } from "@shared/utils/i18nTranslate";
import { TranslationKeys } from "@domain/data/Translations";
import ScreenHelper from "@shared/utils/ScreenHelper";
import { logger } from "@shared/utils/logger";
import FileExplorerToolbar from "./FileExplorerToolbar";
import FileExplorerGrid from "./FileExplorerGrid";
import FileExplorerList from "./FileExplorerList";
import FileContextMenu from "./FileContextMenu";
import PropertiesPanel from "./PropertiesPanel";
import ClipboardService from "../services/ClipboardService";
import PermissionError from "./PermissionError";
import { PermissionError as PermissionErrorType } from "@application/features/system/services/PermissionService";
import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";
import { FileExplorerDialogManager } from "./dialogs";
import type { DialogConfig } from "./dialogs";
import Dialog from "../../desktop/components/Dialog";

type FileExplorerAppProps = {
  initialPath: string;
};

export default function FileExplorerApp(props: FileExplorerAppProps) {
  const { fileSystemService } = Container.instance;
  const translate = useI18n();

  const [isMobile, setIsMobile] = createSignal(ScreenHelper.isMobile());

  const [contextMenu, setContextMenu] = createSignal<{
    visible: boolean;
    position: { x: number; y: number };
    entry?: FileSystemEntry;
  }>({
    visible: false,
    position: { x: 0, y: 0 },
  });

  const [propertiesPanel, setPropertiesPanel] = createSignal<{
    visible: boolean;
    entry: FileSystemEntry | null;
  }>({
    visible: false,
    entry: null,
  });

  const [state, setState] = createSignal<FileExplorerState>({
    currentPath: props.initialPath,
    files: [],
    selectedFiles: new Set(),
    viewMode: isMobile() ? FileViewMode.LIST : FileViewMode.GRID,
    sortBy: FileSortCriteria.NAME,
    sortOrder: SortOrder.ASC,
    isLoading: true,
    showHidden: false,
    refreshCounter: 0,
  });

  // Separate signal for breadcrumb path to prevent unnecessary re-renders
  const [breadcrumbPath, setBreadcrumbPath] = createSignal(props.initialPath);

  const [navigationHistory, setNavigationHistory] = createSignal<string[]>([props.initialPath]);
  const [historyIndex, setHistoryIndex] = createSignal(0);

  const [cutFiles, setCutFiles] = createSignal<Set<string>>(new Set());

  const [permissionError, setPermissionError] = createSignal<{ message: string; path?: string } | null>(null);

  const [errorDialog, setErrorDialog] = createSignal<{ isOpen: boolean; message: string; title?: string }>({
    isOpen: false,
    message: "",
    title: "Error",
  });

  // New dialog system
  let openDialog: (config: DialogConfig) => void;

  const createFolder = () => {
    const { currentPath } = state();
    if (openDialog) {
      openDialog({ type: "add-folder", currentPath });
    }
  };

  const createFile = () => {
    const { currentPath } = state();
    if (openDialog) {
      openDialog({ type: "add-file", currentPath });
    }
  };

  const handleRenameOperation = (paths: string[]) => {
    if (paths.length !== 1) return;

    const currentPath = paths[0];
    const currentName = currentPath.split("/").pop() || "";

    if (openDialog) {
      openDialog({ type: "rename", currentPath, currentName });
    }
  };

  const handleDeleteOperation = (paths: string[]) => {
    if (paths.length === 0) return;

    if (openDialog) {
      openDialog({ type: "delete", pathsToDelete: paths });
    }
  };

  const extractFilePathFromError = (message?: string): string => {
    if (!message) return "";

    const quotedPathMatch = message.match(/["']([^"']+)["']/);
    if (quotedPathMatch) return quotedPathMatch[1];

    const operationMatch = message.match(/operation on\s+(\/[^\s]+)/);
    if (operationMatch) return operationMatch[1];

    const pathMatch = message.match(/(\/[^\s]+)/);
    if (pathMatch) return pathMatch[1];

    return "";
  };

  const handleError = (error: unknown) => {
    if (error instanceof PermissionErrorType) {
      const filePath = extractFilePathFromError(error.message);
      setPermissionError({
        message: error.message,
        path: filePath,
      });
    } else {
      const message = error instanceof Error ? error.message : "Unknown error";
      logger.error("File operation error:", error);
      setErrorDialog({
        isOpen: true,
        message,
        title: "Operation Failed",
      });
    }
  };

  const clearPermissionError = () => {
    setPermissionError(null);
  };

  const handleResize = () => {
    setIsMobile(ScreenHelper.isMobile());

    if (ScreenHelper.isMobile() && state().viewMode === FileViewMode.GRID) {
      setState((prev) => ({ ...prev, viewMode: FileViewMode.LIST }));
    }
  };

  onMount(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        setState((prev) => ({
          ...prev,
          selectedFiles: new Set(directoryContents()?.map((entry) => entry.fullPath) || []),
        }));
      } else if (e.key === "Delete") {
        e.preventDefault();
        if (state().selectedFiles.size > 0) {
          handleFileOperation("delete", Array.from(state().selectedFiles));
        }
      } else if (e.key === "Escape") {
        clearSelection();
        closeContextMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  onCleanup(() => {
    window.removeEventListener("resize", handleResize);
  });

  // Create a derived signal that only includes the properties that should trigger refresh
  const refreshTrigger = createMemo(() => {
    const currentState = state();
    return `${currentState.currentPath}-${currentState.sortBy}-${currentState.sortOrder}-${currentState.viewMode}-${currentState.refreshCounter || 0}`;
  });

  const [directoryContents] = createResource(refreshTrigger, async () => {
    const currentState = state();
    const service = new FileExplorerService(fileSystemService);
    return await service.getDirectoryContents(currentState.currentPath, {
      sortBy: currentState.sortBy,
      sortOrder: currentState.sortOrder,
      viewMode: currentState.viewMode,
    });
  });

  async function navigateToPath(path: string) {
    if (path === state().currentPath) return;

    const newHistory = navigationHistory().slice(0, historyIndex() + 1);
    newHistory.push(path);
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setState((prev) => ({ ...prev, currentPath: path, selectedFiles: new Set() }));
    setBreadcrumbPath(path);
  }

  function canGoBack() {
    return historyIndex() > 0;
  }

  function canGoForward() {
    return historyIndex() < navigationHistory().length - 1;
  }

  function goBack() {
    if (canGoBack()) {
      const newIndex = historyIndex() - 1;
      setHistoryIndex(newIndex);
      const targetPath = navigationHistory()[newIndex];
      setState((prev) => ({ ...prev, currentPath: targetPath, selectedFiles: new Set() }));
      setBreadcrumbPath(targetPath);
    }
  }

  function goForward() {
    if (canGoForward()) {
      const newIndex = historyIndex() + 1;
      setHistoryIndex(newIndex);
      const targetPath = navigationHistory()[newIndex];
      setState((prev) => ({ ...prev, currentPath: targetPath, selectedFiles: new Set() }));
      setBreadcrumbPath(targetPath);
    }
  }

  async function refresh() {
    // Increment refresh counter to trigger directory reload
    setState((prev) => ({ ...prev, refreshCounter: (prev.refreshCounter || 0) + 1 }));
  }

  function selectFile(path: string, multi = false) {
    setState((prev) => {
      const selectedFiles = new Set(prev.selectedFiles);

      if (multi) {
        if (selectedFiles.has(path)) {
          selectedFiles.delete(path);
        } else {
          selectedFiles.add(path);
        }
      } else {
        selectedFiles.clear();
        selectedFiles.add(path);
      }

      return { ...prev, selectedFiles };
    });
  }

  function clearSelection() {
    setState((prev) => ({ ...prev, selectedFiles: new Set() }));
  }

  async function openFile(entry: FileSystemEntry) {
    if (entry instanceof Directory) {
      navigateToPath(entry.fullPath);
    } else {
      // FUTURE: Implement file opening logic based on file type
    }
  }

  function setViewMode(mode: FileViewMode) {
    setState((prev) => ({ ...prev, viewMode: mode }));
    refresh();
  }

  function handleSortChange(sortBy: FileSortCriteria) {
    const newSortOrder =
      sortBy === state().sortBy && state().sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    setState((prev) => ({ ...prev, sortBy, sortOrder: newSortOrder }));
    refresh();
  }

  function handleContextMenu(entry: FileSystemEntry | undefined, event: MouseEvent) {
    event.preventDefault();
    setContextMenu({
      visible: true,
      position: { x: event.clientX, y: event.clientY },
      entry,
    });
  }

  function handleBackgroundContextMenu(event: MouseEvent) {
    event.preventDefault();
    setContextMenu({
      visible: true,
      position: { x: event.clientX, y: event.clientY },
      entry: undefined,
    });
  }

  function closeContextMenu() {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  }

  function closePropertiesPanel() {
    setPropertiesPanel({
      visible: false,
      entry: null,
    });
  }

  async function createClipboardItems(paths: string[]) {
    const clipboardItems = paths.map((path) => ({
      path,
      name: path.split("/").pop() || "",
      isDirectory: false,
      originalPath: path,
    }));

    for (const item of clipboardItems) {
      const entry = await fileSystemService.get((e) => e.fullPath === item.path);
      if (entry) {
        item.isDirectory = entry instanceof Directory;
      }
    }

    return clipboardItems;
  }

  async function handleOpenOperation(paths: string[]) {
    for (const path of paths) {
      const entry = await fileSystemService.get((e) => e.fullPath === path);
      if (entry) {
        await openFile(entry);
      }
    }
  }

  async function handleCopyOperation(paths: string[]) {
    if (paths.length === 0) return;
    const clipboardItems = await createClipboardItems(paths);
    ClipboardService.copy(clipboardItems, state().currentPath);
  }

  async function handleCutOperation(paths: string[]) {
    if (paths.length === 0) return;
    const cutItems = await createClipboardItems(paths);
    ClipboardService.cut(cutItems, state().currentPath);
    setCutFiles(new Set(paths));
    clearSelection();
  }

  async function handlePasteOperation() {
    const clipboard = ClipboardService.getClipboard();
    if (!clipboard || !ClipboardService.canPaste(state().currentPath)) {
      return;
    }

    try {
      const service = new FileExplorerService(fileSystemService);

      if (ClipboardService.isCutOperation()) {
        await service.moveEntries(
          clipboard.items.map((item) => item.originalPath),
          state().currentPath,
        );
        ClipboardService.completeCutOperation();
        setCutFiles(new Set<string>());
      } else {
        await service.copyEntries(
          clipboard.items.map((item) => item.originalPath),
          state().currentPath,
        );
      }

      refresh();
    } catch (error) {
      handleError(error);
    }
  }

  async function handleOpenInTerminalOperation(paths: string[]) {
    if (paths.length === 1) {
      const directoryPath = paths[0];

      try {
        const { Apps } = await import("@domain/data/Apps");
        const appCommands = (await import("@shared/constants/AppCommands")).default;

        const existingWindow = await Container.instance.windowsService.get((window) => window.appId === Apps.terminal);

        if (existingWindow) {
          await Container.instance.windowsService.active(existingWindow);
        } else {
          const terminalCommand = appCommands[Apps.terminal]();
          await terminalCommand.execute(directoryPath);
        }
      } catch (error) {
        handleError(error);
      }
    }
  }

  async function handleViewOperation(paths: string[]) {
    if (paths.length === 1) {
      // FUTURE: Implement file viewer for read-only file content preview
    }
  }

  async function handleEditOperation(paths: string[]) {
    if (paths.length === 1) {
      // FUTURE: Implement file editor for in-place file editing
    }
  }

  async function handlePropertiesOperation(paths: string[]) {
    if (paths.length === 1) {
      const entry = await fileSystemService.get((e) => e.fullPath === paths[0]);
      if (entry) {
        setPropertiesPanel({
          visible: true,
          entry,
        });
      }
    }
  }

  async function handleFileOperation(operation: string, paths: string[]) {
    try {
      switch (operation) {
        case "open":
          await handleOpenOperation(paths);
          break;

        case "delete":
          handleDeleteOperation(paths);
          break;

        case "rename":
          handleRenameOperation(paths);
          break;

        case "copy":
          await handleCopyOperation(paths);
          break;

        case "cut":
          await handleCutOperation(paths);
          break;

        case "paste":
          await handlePasteOperation();
          break;

        case "new-folder":
          createFolder();
          break;

        case "new-file":
          createFile();
          break;

        case "refresh":
          refresh();
          break;

        case "open-in-terminal":
          await handleOpenInTerminalOperation(paths);
          break;

        case "view":
          await handleViewOperation(paths);
          break;

        case "edit":
          await handleEditOperation(paths);
          break;

        case "properties":
          await handlePropertiesOperation(paths);
          break;

        default:
          break;
      }
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <>
      <div class={mergeCls("flex size-full flex-col bg-surface-400", isMobile() ? "text-sm" : "")}>
        <FileExplorerToolbar
          currentPath={state().currentPath}
          breadcrumbPath={breadcrumbPath()}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onGoBack={goBack}
          onGoForward={goForward}
          onNavigate={navigateToPath}
          onCreateFolder={createFolder}
          onCreateFile={createFile}
          onViewModeChange={setViewMode}
          currentViewMode={state().viewMode}
          onSortChange={handleSortChange}
          currentSortBy={state().sortBy}
          currentSortOrder={state().sortOrder}
        />

        <div
          class={mergeCls(
            "flex flex-1",
            propertiesPanel().visible && propertiesPanel().entry ? (isMobile() ? "flex-col" : "flex-row") : "flex-row",
          )}
        >
          <div
            class={mergeCls(
              "overflow-auto",
              propertiesPanel().visible && propertiesPanel().entry && !isMobile() ? "flex-1" : "flex-1",
            )}
            onContextMenu={handleBackgroundContextMenu}
          >
            <Show
              when={directoryContents() && directoryContents()!.length > 0}
              fallback={<div class="p-8 text-center text-gray-400">{translate(TranslationKeys.common_no_results)}</div>}
            >
              <Show when={state().viewMode === FileViewMode.GRID}>
                <FileExplorerGrid
                  entries={directoryContents()!}
                  selectedFiles={state().selectedFiles}
                  cutFiles={cutFiles()}
                  onFileSelect={selectFile}
                  onFileOpen={openFile}
                  onFileContextMenu={handleContextMenu}
                />
              </Show>

              <Show when={state().viewMode === FileViewMode.LIST}>
                <FileExplorerList
                  entries={directoryContents()!}
                  selectedFiles={state().selectedFiles}
                  cutFiles={cutFiles()}
                  onFileSelect={selectFile}
                  onFileOpen={openFile}
                  onFileContextMenu={handleContextMenu}
                />
              </Show>
            </Show>
          </div>

          <Show when={propertiesPanel().visible && propertiesPanel().entry}>
            <PropertiesPanel
              entry={propertiesPanel().entry}
              onClose={closePropertiesPanel}
              isVisible={propertiesPanel().visible}
            />
          </Show>
        </div>

        <div class="border-t border-surface-300 bg-surface-500 p-2 text-xs text-gray-300">
          <div class="flex justify-between">
            <span>
              {directoryContents()?.length || 0} {translate(TranslationKeys.common_items)}
            </span>
            <span>
              {state().selectedFiles.size > 0 &&
                `${state().selectedFiles.size} ${translate(TranslationKeys.common_selected)}`}
            </span>
          </div>
        </div>
      </div>

      <Show when={contextMenu().visible}>
        <FileContextMenu
          entry={() => contextMenu().entry}
          position={() => contextMenu().position}
          selectedFiles={() => Array.from(state().selectedFiles)}
          visible={() => contextMenu().visible}
          onClose={closeContextMenu}
          onFileOperation={handleFileOperation}
          onNavigate={navigateToPath}
          currentPath={() => state().currentPath}
        />
      </Show>

      <Show when={permissionError()}>
        {(errorData) => (
          <PermissionError
            message={errorData()?.message || "Permission denied"}
            path={errorData()?.path}
            onClose={clearPermissionError}
          />
        )}
      </Show>

      <Show when={errorDialog().isOpen}>
        <Dialog
          title={errorDialog().title}
          description={errorDialog().message}
          icon={Icons.userForbidden}
          isOpen={errorDialog().isOpen}
          onClose={() => setErrorDialog({ isOpen: false, message: "", title: "Error" })}
          draggable={true}
          closeAriaLabel="Close error dialog"
          okButtonText={TranslationKeys.common_close}
        />
      </Show>

      <FileExplorerDialogManager
        fileSystemService={fileSystemService}
        refresh={refresh}
        onError={handleError}
        onSuccess={refresh}
        onOpenDialog={(openDialogFn: (config: DialogConfig) => void) => {
          openDialog = openDialogFn;
        }}
      />
    </>
  );
}
