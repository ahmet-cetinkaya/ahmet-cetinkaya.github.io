import { For } from "solid-js";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import FileIcon from "./FileIcon";
import WindowsStyleTitle from "./WindowsStyleTitle";
import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";
import { createFileHandlers } from "../utils/fileHandlers";
import { getFileItemAttributes } from "../utils/fileItemAttributes";

type FileExplorerGridProps = {
  entries: FileSystemEntry[];
  selectedFiles: Set<string>;
  cutFiles: Set<string>;
  onFileSelect: (path: string, multi?: boolean) => void;
  onFileOpen: (entry: FileSystemEntry) => void;
  onFileContextMenu: (entry: FileSystemEntry | undefined, event: MouseEvent) => void;
};

export default function FileExplorerGrid(props: FileExplorerGridProps) {
  const handlers = createFileHandlers({
    onFileSelect: props.onFileSelect,
    onFileOpen: props.onFileOpen,
    onFileContextMenu: props.onFileContextMenu,
  });

  return (
    <div
      class="file-explorer-grid grid cursor-default select-none grid-cols-4 gap-4 p-2 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12"
      onContextMenu={handlers.handleBackgroundContextMenu}
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
            {...getFileItemAttributes(entry, handlers, props.onFileOpen)}
          >
            <div class="mb-1">
              <FileIcon entry={entry} size="large" />
            </div>

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
