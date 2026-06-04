import { For } from "solid-js";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import Directory from "@domain/models/Directory";
import FileIcon from "./FileIcon";
import WindowsStyleTitle from "./WindowsStyleTitle";
import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";

type FileExplorerGridProps = {
  entries: FileSystemEntry[];
  selectedFiles: Set<string>;
  cutFiles: Set<string>;
  onFileSelect: (path: string, multi?: boolean) => void;
  onFileOpen: (entry: FileSystemEntry) => void;
  onFileContextMenu: (entry: FileSystemEntry | undefined, event: MouseEvent) => void;
};

export default function FileExplorerGrid(props: FileExplorerGridProps) {
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

  function handleBackgroundContextMenu(event: MouseEvent) {
    event.preventDefault();
    // Pass undefined entry for background context menu
    props.onFileContextMenu(undefined, event);
  }

  return (
    <div
      class="file-explorer-grid grid cursor-default select-none grid-cols-4 gap-4 p-2 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12"
      onContextMenu={handleBackgroundContextMenu}
    >
      <For each={props.entries}>
        {(entry) => (
          <div
            class={mergeCls(
              "file-item flex cursor-pointer select-none flex-col items-center justify-center rounded-lg p-2 transition-colors duration-200",
              "hover:bg-surface-300 focus:bg-surface-300 focus:outline-none",
              props.selectedFiles.has(entry.fullPath) ? "bg-surface-300 ring-2 ring-blue-500" : "bg-surface-400/50",
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
            {/* File/Folder Icon */}
            <div class="mb-1">
              <FileIcon entry={entry} size="large" />
            </div>

            {/* File/Folder Name */}
            <div class="flex min-h-[2.5rem] w-full items-center justify-center px-1 text-center">
              <div class="file-name-container w-full select-none">
                <WindowsStyleTitle
                  text={entry.name}
                  maxLength={20}
                  class="w-full text-center text-xs font-medium text-gray-200"
                  wrap={true}
                />
              </div>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
