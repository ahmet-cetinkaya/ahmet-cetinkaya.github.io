import { For, Show, createEffect, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import Icon from "@shared/components/Icon";
import { useI18n } from "@shared/utils/i18nTranslate";
import { TranslationKeys } from "@domain/data/Translations";
import { logger } from "@shared/utils/logger";
import ClipboardService from "../services/ClipboardService";
import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";
import Icons from "@domain/data/Icons";

type ContextMenuItem = {
  label: string;
  icon?: Icons;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
};

type FileContextMenuProps = {
  entry?: () => FileSystemEntry | undefined;
  position: () => { x: number; y: number };
  selectedFiles: () => string[];
  visible: () => boolean;
  onClose: () => void;
  onFileOperation: (operation: string, paths: string[]) => void;
  onNavigate?: (path: string) => void;
  currentPath: () => string;
};

export default function FileContextMenu(props: FileContextMenuProps) {
  const translate = useI18n();

  logger.uiInteraction("FileContextMenu", "render", {
    visible: props.visible(),
    position: props.position(),
    entryName: props.entry?.()?.name,
    selectedFilesCount: props.selectedFiles().length,
  });

  createEffect(() => {
    if (props.visible()) {
      let menuJustOpened = true;
      let suppressNextClick = true;

      const handleMouseDownOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        // Immediately after opening menu, suppress the first mousedown
        if (menuJustOpened && suppressNextClick) {
          suppressNextClick = false;
          // Use a short timeout to reset menuJustOpened flag after event cycle
          setTimeout(() => {
            menuJustOpened = false;
          }, 0);
          return;
        }

        // Close if clicking outside the menu (check for context-menu class)
        if (!target.closest(".context-menu")) {
          props.onClose();
        }
      };

      const handleContextMenuGlobal = (e: MouseEvent) => {
        // Close if another context menu is opened elsewhere
        const target = e.target as HTMLElement;
        if (target && !target.closest(".context-menu")) {
          props.onClose();
        }
      };

      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          props.onClose();
        }
      };

      // Add mousedown listener immediately (no timing delay)
      document.addEventListener("mousedown", handleMouseDownOutside, true);
      document.addEventListener("contextmenu", handleContextMenuGlobal, true);
      document.addEventListener("keydown", handleEscapeKey);

      onCleanup(() => {
        document.removeEventListener("mousedown", handleMouseDownOutside, true);
        document.removeEventListener("contextmenu", handleContextMenuGlobal, true);
        document.removeEventListener("keydown", handleEscapeKey);
      });
    }
  });

  const menuItems = () => {
    const items: ContextMenuItem[] = [];
    const selectedFiles = props.selectedFiles();
    const entry = props.entry?.();
    const hasSelection = selectedFiles.length > 0;
    const hasContextTarget = entry !== undefined;

    const targetPaths = hasSelection ? selectedFiles : hasContextTarget ? [entry!.fullPath] : [];

    let hasContent = false;

    if (hasSelection || hasContextTarget) {
      items.push({
        label: translate(TranslationKeys.common_open),
        icon: Icons.open,
        action: () => props.onFileOperation("open", targetPaths),
      });

      items.push(
        {
          label: translate(TranslationKeys.common_copy),
          icon: Icons.copy,
          action: () => props.onFileOperation("copy", targetPaths),
        },
        {
          label: translate(TranslationKeys.common_cut),
          icon: Icons.cut,
          action: () => props.onFileOperation("cut", targetPaths),
        },
      );

      const clipboard = ClipboardService.getClipboard();
      const hasClipboardContent = clipboard && clipboard.items.length > 0;
      const canPaste = hasClipboardContent && ClipboardService.canPaste(props.currentPath());

      if (hasClipboardContent) {
        items.push({
          label: translate(TranslationKeys.common_paste),
          icon: Icons.paste,
          action: () => props.onFileOperation("paste", []),
          disabled: !canPaste,
        });
      }

      if (items.length > 0) {
        hasContent = true;
      }

      items.push(
        { separator: true, label: "", action: () => {} },
        {
          label: translate(TranslationKeys.common_rename),
          icon: Icons.edit,
          action: () => props.onFileOperation("rename", targetPaths),
          disabled: targetPaths.length !== 1,
        },
        {
          label: translate(TranslationKeys.common_delete),
          icon: Icons.trash,
          action: () => props.onFileOperation("delete", targetPaths),
        },
        {
          label: "Properties",
          icon: Icons.properties,
          action: () => props.onFileOperation("properties", targetPaths),
          disabled: targetPaths.length !== 1,
        },
      );
    }

    if (!hasContextTarget) {
      const clipboard = ClipboardService.getClipboard();
      const hasClipboardContent = clipboard && clipboard.items.length > 0;
      const canPaste = hasClipboardContent && ClipboardService.canPaste(props.currentPath());

      if (hasContent) {
        items.push({ separator: true, label: "", action: () => {} });
      }

      if (hasClipboardContent) {
        items.push({
          label: translate(TranslationKeys.common_paste),
          icon: Icons.paste,
          action: () => props.onFileOperation("paste", []),
          disabled: !canPaste,
        });

        items.push({ separator: true, label: "", action: () => {} });
      }

      items.push(
        {
          label: translate(TranslationKeys.common_new_folder),
          icon: Icons.folderPlus,
          action: () => props.onFileOperation("new-folder", []),
        },
        {
          label: translate(TranslationKeys.common_new_file),
          icon: Icons.filePlus,
          action: () => props.onFileOperation("new-file", []),
        },
        { separator: true, label: "", action: () => {} },
        {
          label: translate(TranslationKeys.common_open_in_terminal),
          icon: Icons.terminal,
          action: () => props.onFileOperation("open-in-terminal", [props.currentPath()]),
        },
        { separator: true, label: "", action: () => {} },
        {
          label: translate(TranslationKeys.common_refresh),
          icon: Icons.refresh,
          action: () => props.onFileOperation("refresh", []),
        },
      );
    }

    return items;
  };

  if (!props.visible()) return null;

  return (
    <Portal mount={document.body}>
      <div
        class="context-menu shadow-md fixed z-[9999] min-w-48 rounded-lg border border-surface-300 bg-surface-500 shadow-secondary"
        style={{
          left: `${props.position().x}px`,
          top: `${props.position().y}px`,
        }}
        role="menu"
        aria-label="File context menu"
      >
        <For each={menuItems()}>
          {(item) => (
            <Show when={!item.separator} fallback={<div class="my-1 border-t border-surface-300" />}>
              <button
                type="button"
                class={mergeCls(
                  "flex w-full items-center space-x-2 px-3 py-2 text-left text-sm text-gray-200",
                  "transition-colors duration-200",
                  item.disabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-surface-400 focus:bg-surface-400 focus:outline-none",
                )}
                onClick={() => {
                  if (!item.disabled) {
                    item.action();
                    props.onClose();
                  }
                }}
                disabled={item.disabled}
                role="menuitem"
              >
                {item.icon && <Icon icon={item.icon} class="h-4 w-4" />}
                <span>{item.label}</span>
              </button>
            </Show>
          )}
        </For>
      </div>
    </Portal>
  );
}
