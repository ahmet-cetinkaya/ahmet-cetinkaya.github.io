import { createSignal, createResource, onMount, Show, onCleanup } from "solid-js";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import FileExplorerService, {
  FileViewMode,
  FileSortCriteria,
  SortOrder,
  type FileExplorerState,
} from "@application/features/fileExplorer/services/FileExplorerService";
import Directory from "@domain/models/Directory";
import Container from "@presentation/Container";
import Icon from "@shared/components/Icon";
import Icons from "@domain/data/Icons";
import Button from "@shared/components/ui/Button";
import Dropdown from "@shared/components/ui/Dropdown";
import Dialog from "../../desktop/components/Dialog";
import InputDialog from "@shared/components/ui/InputDialog";
import ConfirmDialog from "@shared/components/ui/ConfirmDialog";
import { useI18n } from "@shared/utils/i18nTranslate";
import { TranslationKeys } from "@domain/data/Translations";
import ScreenHelper from "@shared/utils/ScreenHelper";
import { logger } from "@shared/utils/logger";
import FileExplorerBreadcrumb from "./FileExplorerBreadcrumb";
import FileExplorerGrid from "./FileExplorerGrid";
import FileExplorerList from "./FileExplorerList";
import FileContextMenu from "./FileContextMenu";
import PropertiesPanel from "./PropertiesPanel";
import ClipboardService from "../services/ClipboardService";
import PermissionError from "./PermissionError";
import { PermissionError as PermissionErrorType } from "@application/features/system/services/PermissionService";
import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";

type Props = {
  initialPath: string;
};

export default function FileExplorerApp(props: Props) {
  const { fileSystemService } = Container.instance;
  const translate = useI18n();

  // Responsive design - detect mobile/tablet
  const [isMobile, setIsMobile] = createSignal(ScreenHelper.isMobile());

  // Context menu state
  const [contextMenu, setContextMenu] = createSignal<{
    visible: boolean;
    position: { x: number; y: number };
    entry?: FileSystemEntry;
  }>({
    visible: false,
    position: { x: 0, y: 0 },
  });

  // Properties panel state
  const [propertiesPanel, setPropertiesPanel] = createSignal<{
    visible: boolean;
    entry: FileSystemEntry | null;
  }>({
    visible: false,
    entry: null,
  });

  // File explorer state
  const [state, setState] = createSignal<FileExplorerState>({
    currentPath: props.initialPath,
    selectedFiles: new Set(),
    viewMode: isMobile() ? FileViewMode.LIST : FileViewMode.GRID, // Default to list on mobile
    sortBy: FileSortCriteria.NAME,
    sortOrder: SortOrder.ASC,
    showHidden: false,
  });

  // Navigation history for back/forward buttons
  const [navigationHistory, setNavigationHistory] = createSignal<string[]>([props.initialPath]);
  const [historyIndex, setHistoryIndex] = createSignal(0);

  // Track files that are cut (for opacity styling)
  const [cutFiles, setCutFiles] = createSignal<Set<string>>(new Set());

  // Handle permission errors
  const [permissionError, setPermissionError] = createSignal<{ message: string; path?: string } | null>(null);

  // Dialog states
  const [errorDialog, setErrorDialog] = createSignal<{ isOpen: boolean; message: string; title?: string }>({
    isOpen: false,
    message: "",
    title: "Error",
  });

  const [inputDialog, setInputDialog] = createSignal<{
    isOpen: boolean;
    title: string;
    message: string;
    placeholder: string;
    defaultValue?: string;
    onConfirm: (value: string) => void;
    onCancel: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    placeholder: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const [confirmDialog, setConfirmDialog] = createSignal<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: "danger" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
    type: "info",
  });

  // Extract file path from error message
  const extractFilePathFromError = (message?: string): string => {
    if (!message) return "";

    // Look for paths in quotes: Permission denied: "/path/to/file"
    const quotedPathMatch = message.match(/["']([^"']+)["']/);
    if (quotedPathMatch) return quotedPathMatch[1];

    // Look for paths after "operation on": operation on /path/to/file
    const operationMatch = message.match(/operation on\s+(\/[^\s]+)/);
    if (operationMatch) return operationMatch[1];

    // Look for paths that start with /
    const pathMatch = message.match(/(\/[^\s]+)/);
    if (pathMatch) return pathMatch[1];

    return "";
  };

  // Handle errors with permission check
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

  // Clear permission error
  const clearPermissionError = () => {
    setPermissionError(null);
  };

  // Handle screen resize
  const handleResize = () => {
    setIsMobile(ScreenHelper.isMobile());

    // Auto-switch to list view on mobile if currently in grid view
    if (ScreenHelper.isMobile() && state().viewMode === FileViewMode.GRID) {
      setState((prev) => ({ ...prev, viewMode: FileViewMode.LIST }));
    }
  };

  onMount(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle file operations shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        // Select all files
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
      } else if (e.key === "F5") {
        e.preventDefault();
        refresh();
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

  // Resource for directory contents
  const [directoryContents] = createResource(
    () => state(),
    async (currentState) => {
      const service = new FileExplorerService(fileSystemService);
      return await service.getDirectoryContents(currentState.currentPath, currentState);
    },
  );

  // Navigation functions
  async function navigateToPath(path: string) {
    if (path === state().currentPath) return;

    // Update navigation history
    const newHistory = navigationHistory().slice(0, historyIndex() + 1);
    newHistory.push(path);
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setState((prev) => ({ ...prev, currentPath: path, selectedFiles: new Set() }));
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
    }
  }

  function goForward() {
    if (canGoForward()) {
      const newIndex = historyIndex() + 1;
      setHistoryIndex(newIndex);
      const targetPath = navigationHistory()[newIndex];
      setState((prev) => ({ ...prev, currentPath: targetPath, selectedFiles: new Set() }));
    }
  }

  async function refresh() {
    // Refetch the directory contents by re-mutating the state
    setState((prev) => ({ ...prev }));
  }

  // File selection functions
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

  // File operations
  async function openFile(entry: FileSystemEntry) {
    if (entry instanceof Directory) {
      navigateToPath(entry.fullPath);
    } else {
      // Handle file opening based on type
      // FUTURE: Implement file opening logic based on file type
      // For now, files are handled by their respective applications
      console.log(`Opening file: ${entry.name} (${entry.fullPath})`);
    }
  }

  // Create folder function
  async function createFolder() {
    setInputDialog({
      isOpen: true,
      title: "New Folder",
      message: "Enter the name for the new folder:",
      placeholder: "Folder name",
      defaultValue: "",
      onConfirm: async (folderName) => {
        try {
          const { currentPath } = state();
          const service = new FileExplorerService(fileSystemService);
          await service.createFolder(currentPath, folderName.trim());
          refresh();
        } catch (error) {
          handleError(error);
        }
      },
      onCancel: () => {
        // User cancelled, do nothing
      },
    });
  }

  // Create file function
  async function createFile() {
    setInputDialog({
      isOpen: true,
      title: "New File",
      message: "Enter the name for the new file:",
      placeholder: "File name",
      defaultValue: "",
      onConfirm: async (fileName) => {
        try {
          const { currentPath } = state();
          const service = new FileExplorerService(fileSystemService);
          await service.createFile(currentPath, fileName.trim());
          refresh();
        } catch (error) {
          handleError(error);
        }
      },
      onCancel: () => {
        // User cancelled, do nothing
      },
    });
  }

  // View and sort functions
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

  // List options dropdown menu items
  const createMenuItems = () => [
    {
      text: TranslationKeys.common_new_folder,
      icon: Icons.folderPlus,
      onClick: createFolder,
    },
    {
      text: TranslationKeys.common_new_file,
      icon: Icons.filePlus,
      onClick: createFile,
    },
  ];

  const listOptionsMenuItems = () => [
    {
      text: TranslationKeys.apps_file_explorer_view_options,
      items: [
        {
          text: TranslationKeys.apps_file_explorer_view_grid,
          icon: Icons.spinner, // Using spinner as placeholder for grid icon
          onClick: () => setViewMode(FileViewMode.GRID),
        },
        {
          text: TranslationKeys.apps_file_explorer_view_list,
          icon: Icons.unorderedList,
          onClick: () => setViewMode(FileViewMode.LIST),
        },
      ],
    },
    {
      text: TranslationKeys.apps_file_explorer_sort_options,
      items: [
        {
          text: TranslationKeys.apps_file_explorer_sort_by_name,
          icon:
            state().sortBy === FileSortCriteria.NAME
              ? state().sortOrder === SortOrder.ASC
                ? Icons.upArrow
                : Icons.downArrow
              : Icons.center,
          onClick: () => handleSortChange(FileSortCriteria.NAME),
        },
        {
          text: TranslationKeys.apps_file_explorer_sort_by_size,
          icon:
            state().sortBy === FileSortCriteria.SIZE
              ? state().sortOrder === SortOrder.ASC
                ? Icons.upArrow
                : Icons.downArrow
              : Icons.center,
          onClick: () => handleSortChange(FileSortCriteria.SIZE),
        },
        {
          text: TranslationKeys.apps_file_explorer_sort_by_modified,
          icon:
            state().sortBy === FileSortCriteria.MODIFIED
              ? state().sortOrder === SortOrder.ASC
                ? Icons.upArrow
                : Icons.downArrow
              : Icons.center,
          onClick: () => handleSortChange(FileSortCriteria.MODIFIED),
        },
        {
          text: TranslationKeys.apps_file_explorer_sort_by_type,
          icon:
            state().sortBy === FileSortCriteria.TYPE
              ? state().sortOrder === SortOrder.ASC
                ? Icons.upArrow
                : Icons.downArrow
              : Icons.center,
          onClick: () => handleSortChange(FileSortCriteria.TYPE),
        },
      ],
    },
  ];

  // Context menu handlers
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
      entry: undefined, // No specific entry for background click
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

  async function handleFileOperation(operation: string, paths: string[]) {
    try {
      switch (operation) {
        case "open":
          // Open selected files
          for (const path of paths) {
            const entry = await fileSystemService.get((e) => e.fullPath === path);
            if (entry) {
              await openFile(entry);
            }
          }
          break;

        case "delete": {
          // Delete files with confirmation
          if (paths.length === 0) return;

          const confirmMessage =
            paths.length === 1
              ? `Are you sure you want to delete "${paths[0].split("/").pop()}"?`
              : `Are you sure you want to delete ${paths.length} selected items?`;

          setConfirmDialog({
            isOpen: true,
            title: "Confirm Delete",
            message: confirmMessage,
            type: "danger",
            onConfirm: async () => {
              try {
                const fileExplorerService = FileExplorerService;
                const service = new fileExplorerService(fileSystemService);
                await service.deleteEntries(paths);
                clearSelection();
                refresh();
              } catch (error) {
                handleError(error);
              }
            },
            onCancel: () => {
              // User cancelled, do nothing
            },
          });
          break;
        }

        case "rename": {
          // Rename file (only works for single file)
          if (paths.length !== 1) return;

          const currentPath = paths[0];
          const currentName = currentPath.split("/").pop() || "";

          setInputDialog({
            isOpen: true,
            title: "Rename",
            message: `Enter new name for "${currentName}":`,
            placeholder: "New name",
            defaultValue: currentName,
            onConfirm: async (newName) => {
              try {
                if (newName.trim() !== "" && newName !== currentName) {
                  const fileExplorerService = FileExplorerService;
                  const service = new fileExplorerService(fileSystemService);
                  await service.renameEntry(currentPath, newName.trim());
                  refresh();
                }
              } catch (error) {
                handleError(error);
              }
            },
            onCancel: () => {
              // User cancelled, do nothing
            },
          });
          break;
        }

        case "copy": {
          // Copy files to clipboard
          if (paths.length === 0) return;

          const clipboardItems = paths.map((path) => ({
            path,
            name: path.split("/").pop() || "",
            isDirectory: false, // We'll determine this below
            originalPath: path,
          }));

          // Determine which items are directories
          for (const item of clipboardItems) {
            const entry = await fileSystemService.get((e) => e.fullPath === item.path);
            if (entry) {
              item.isDirectory = entry instanceof Directory;
            }
          }

          ClipboardService.copy(clipboardItems, state().currentPath);
          break;
        }

        case "cut": {
          // Cut files to clipboard
          if (paths.length === 0) return;

          const cutItems = paths.map((path) => ({
            path,
            name: path.split("/").pop() || "",
            isDirectory: false, // We'll determine this below
            originalPath: path,
          }));

          // Determine which items are directories
          for (const item of cutItems) {
            const entry = await fileSystemService.get((e) => e.fullPath === item.path);
            if (entry) {
              item.isDirectory = entry instanceof Directory;
            }
          }

          ClipboardService.cut(cutItems, state().currentPath);
          setCutFiles(new Set(paths)); // Track cut files for opacity styling
          clearSelection();
          break;
        }

        case "paste": {
          // Paste from clipboard
          const clipboard = ClipboardService.getClipboard();
          if (!clipboard || !ClipboardService.canPaste(state().currentPath)) {
            return;
          }

          try {
            const fileExplorerService = FileExplorerService;
            const service = new fileExplorerService(fileSystemService);

            if (ClipboardService.isCutOperation()) {
              // Move operation (cut + paste)
              await service.moveEntries(
                clipboard.items.map((item) => item.originalPath),
                state().currentPath,
              );
              ClipboardService.completeCutOperation();
              setCutFiles(new Set<string>()); // Clear cut files after successful paste
            } else {
              // Copy operation
              await service.copyEntries(
                clipboard.items.map((item) => item.originalPath),
                state().currentPath,
              );
            }

            refresh();
          } catch (error) {
            handleError(error);
          }
          break;
        }

        case "new-folder":
          // Create new folder
          await createFolder();
          break;

        case "new-file": {
          // Create new file
          await createFile();
          break;
        }

        case "refresh":
          refresh();
          break;

        case "open-in-terminal": {
          // Open directory in terminal
          if (paths.length === 1) {
            const directoryPath = paths[0];

            try {
              // Use the same window management system as WindowManager
              const { Apps } = await import("@domain/data/Apps");
              const appCommands = (await import("@shared/constants/AppCommands")).default;

              // Check if terminal is already open
              const existingWindow = await Container.instance.windowsService.get(
                (window) => window.appId === Apps.terminal,
              );

              if (existingWindow) {
                // Activate existing terminal window
                await Container.instance.windowsService.active(existingWindow);
              } else {
                // Open new terminal with directory as argument
                const terminalCommand = appCommands[Apps.terminal]();
                await terminalCommand.execute(directoryPath);
              }
            } catch (error) {
              handleError(error);
            }
          }
          break;
        }

        case "view": {
          // View file content (placeholder - will implement in Phase 2)
          if (paths.length === 1) {
            // FUTURE: Implement file viewer for read-only file content preview
            console.log(`View file: ${paths[0]}`);
          }
          break;
        }

        case "edit": {
          // Edit file content (placeholder - will implement in Phase 2)
          if (paths.length === 1) {
            // FUTURE: Implement file editor for in-place file editing
            console.log(`Edit file: ${paths[0]}`);
          }
          break;
        }

        case "properties": {
          // Show properties panel
          if (paths.length === 1) {
            const entry = await fileSystemService.get((e) => e.fullPath === paths[0]);
            if (entry) {
              setPropertiesPanel({
                visible: true,
                entry,
              });
            }
          }
          break;
        }

        default:
        // Unknown operation
      }
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <>
      <div
        class={mergeCls(
          "flex size-full flex-col bg-surface-400",
          isMobile() ? "text-sm" : "", // Smaller text on mobile
        )}
      >
        {/* Toolbar with integrated layout: BACK_ICON | FORWARD_ICON | BREADCRUMB | CREATE_FOLDER_ICON | LIST_OPTIONS_ICON */}
        <div class="relative flex items-center justify-between border-b border-surface-300 bg-surface-500 p-2">
          {/* BACK_ICON | FORWARD_ICON */}
          <div class="flex items-center space-x-1">
            <Button
              variant="primary"
              size="small"
              ariaLabel="Navigate back"
              onClick={goBack}
              disabled={!canGoBack()}
              class="p-2"
            >
              <Icon icon={Icons.leftArrow} class="h-4 w-4" />
            </Button>

            <Button
              variant="primary"
              size="small"
              ariaLabel="Navigate forward"
              onClick={goForward}
              disabled={!canGoForward()}
              class="p-2"
            >
              <Icon icon={Icons.rightArrow} class="h-4 w-4" />
            </Button>
          </div>

          {/* BREADCRUMB */}
          <div class="mx-4 flex flex-1 items-center justify-center">
            <FileExplorerBreadcrumb currentPath={state().currentPath} onNavigate={navigateToPath} />
          </div>

          {/* CREATE_BUTTON (Dropdown) | LIST_OPTIONS_ICON */}
          <div class="flex items-center space-x-1">
            <Dropdown menuItems={createMenuItems()} ariaLabel="Create new file or folder" buttonClass="p-2">
              <Icon icon={Icons.plus} class="h-4 w-4" />
            </Dropdown>

            <Dropdown menuItems={listOptionsMenuItems()} ariaLabel="List options" buttonClass="p-2">
              <Icon icon={Icons.orderedList} class="h-4 w-4" />
            </Dropdown>
          </div>
        </div>

        {/* File Display Area */}
        <div
          class={mergeCls(
            "flex flex-1",
            propertiesPanel().visible && propertiesPanel().entry
              ? isMobile()
                ? "flex-col" // Mobile: properties at bottom
                : "flex-row" // Desktop: properties on right
              : "flex-row", // Default layout
          )}
        >
          <div
            class={mergeCls(
              "overflow-auto",
              propertiesPanel().visible && propertiesPanel().entry && !isMobile()
                ? "flex-1" // Desktop: take remaining space when panel is visible
                : "flex-1", // Default: take full space
            )}
            onContextMenu={handleBackgroundContextMenu}
          >
            <Show
              when={directoryContents() && directoryContents()!.length > 0}
              fallback={<div class="p-8 text-center text-gray-400">{translate(TranslationKeys.common_no_results)}</div>}
            >
              {/* Grid View */}
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

              {/* List View */}
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

          {/* Properties Panel */}
          <Show when={propertiesPanel().visible && propertiesPanel().entry}>
            <PropertiesPanel
              entry={propertiesPanel().entry}
              onClose={closePropertiesPanel}
              isVisible={propertiesPanel().visible}
            />
          </Show>
        </div>

        {/* Status Bar */}
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

      {/* Context Menu */}
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

      {/* Permission Error Modal */}
      <Show when={permissionError()}>
        {(errorData) => (
          <PermissionError
            message={errorData()?.message || "Permission denied"}
            path={errorData()?.path}
            onClose={clearPermissionError}
          />
        )}
      </Show>

      {/* Error Dialog */}
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

      {/* Input Dialog */}
      <InputDialog
        isOpen={inputDialog().isOpen}
        title={inputDialog().title}
        message={inputDialog().message}
        placeholder={inputDialog().placeholder}
        defaultValue={inputDialog().defaultValue}
        onConfirm={inputDialog().onConfirm}
        onCancel={inputDialog().onCancel}
        onClose={() => setInputDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog().isOpen}
        title={confirmDialog().title}
        message={confirmDialog().message}
        onConfirm={confirmDialog().onConfirm}
        onCancel={confirmDialog().onCancel}
        type={confirmDialog().type}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
