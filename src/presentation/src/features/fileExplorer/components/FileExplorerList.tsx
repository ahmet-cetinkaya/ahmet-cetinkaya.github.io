import { For, Show } from "solid-js";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import File from "@domain/models/File";
import Directory from "@domain/models/Directory";
import FileIcon from "./FileIcon";
import WindowsStyleTitle from "./WindowsStyleTitle";
import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";

type FileExplorerListProps = {
  entries: FileSystemEntry[];
  selectedFiles: Set<string>;
  cutFiles: Set<string>;
  onFileSelect: (path: string, multi?: boolean) => void;
  onFileOpen: (entry: FileSystemEntry) => void;
  onFileContextMenu: (entry: FileSystemEntry | undefined, event: MouseEvent) => void;
};

export default function FileExplorerList(props: FileExplorerListProps) {
  function handleFileClick(entry: FileSystemEntry, event: MouseEvent) {
    event.preventDefault();

    if (event.detail === 1) {
      // Single click - select file
      props.onFileSelect(entry.fullPath, event.ctrlKey || event.metaKey);
    } else if (event.detail === 2) {
      // Double click - open file
      event.stopPropagation();
      props.onFileOpen(entry);
    }
  }

  function handleContextMenu(entry: FileSystemEntry, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    props.onFileContextMenu(entry, event);
  }

  function formatFileSize(size: number): string {
    const units = ["B", "KB", "MB", "GB"];
    let unitIndex = 0;
    let value = size;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${value.toFixed(1)} ${units[unitIndex]}`;
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getValidModifiedDate(entry: FileSystemEntry): Date {
    // Check if updatedDate exists and is a valid date (not a minimum date)
    if (entry.updatedDate) {
      // Check if it's a reasonable date (not before 1970)
      const minValidDate = new Date("1970-01-01");
      if (entry.updatedDate >= minValidDate) {
        return entry.updatedDate;
      }
    }
    // Fall back to createdDate if updatedDate is invalid or doesn't exist
    return entry.createdDate;
  }

  function handleBackgroundContextMenu(event: MouseEvent) {
    event.preventDefault();
    // Pass undefined entry for background context menu
    props.onFileContextMenu(undefined, event);
  }

  return (
    <div class="min-w-full" onContextMenu={handleBackgroundContextMenu}>
      {/* Table Header */}
      <div class="grid grid-cols-12 border-b border-surface-300 bg-surface-500 p-2 text-xs font-medium text-gray-400">
        <div class="col-span-6">Name</div>
        <div class="col-span-2 text-right">Size</div>
        <div class="col-span-2 text-right">Type</div>
        <div class="col-span-2 text-right">Modified</div>
      </div>

      {/* File List */}
      <div class="divide-y divide-surface-300">
        <For each={props.entries}>
          {(entry) => (
            <div
              class={mergeCls(
                "grid select-none grid-cols-12 items-center p-2 transition-colors duration-200",
                "hover:bg-surface-300 focus:bg-surface-300 focus:outline-none",
                props.selectedFiles.has(entry.fullPath) ? "bg-surface-300 ring-1 ring-blue-500" : "bg-surface-400/30",
                props.cutFiles.has(entry.fullPath) ? "opacity-50" : "",
              )}
              onClick={(e) => handleFileClick(entry, e)}
              onContextMenu={(e) => handleContextMenu(entry, e)}
              tabIndex={0}
              role="button"
              aria-label={`${entry.name} ${entry instanceof Directory ? "directory" : "file"}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  props.onFileOpen(entry);
                }
              }}
            >
              {/* Name */}
              <div class="col-span-6 flex items-center space-x-2">
                <FileIcon entry={entry} size="small" />
                <div class="truncate text-sm font-medium text-gray-200" style="min-width: 0; flex: 1;">
                  <WindowsStyleTitle text={entry.name} maxLength={40} />
                </div>
              </div>

              {/* Size */}
              <div class="col-span-2 text-right text-sm text-gray-400">
                <Show when={entry instanceof File}>{formatFileSize((entry as File).size)}</Show>
                <Show when={entry instanceof Directory}>—</Show>
              </div>

              {/* Type */}
              <div class="col-span-2 text-right text-sm text-gray-400">
                <Show when={entry instanceof Directory}>Directory</Show>
                <Show when={entry instanceof File && entry.extension}>{(entry as File).extension.toUpperCase()}</Show>
                <Show when={entry instanceof File && !entry.extension}>File</Show>
              </div>

              {/* Modified Date */}
              <div class="col-span-2 text-right text-sm text-gray-400">{formatDate(getValidModifiedDate(entry))}</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
