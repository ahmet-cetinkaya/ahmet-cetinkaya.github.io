import { For, Show } from "solid-js";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import File from "@domain/models/File";
import Directory from "@domain/models/Directory";
import FileIcon from "./FileIcon";
import WindowsStyleTitle from "./WindowsStyleTitle";
import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";
import { formatFileSize, formatDate, getValidModifiedDate } from "../utils/formatters";
import { createFileHandlers } from "../utils/fileHandlers";
import { getFileItemAttributes } from "../utils/fileItemAttributes";

type FileExplorerListProps = {
  entries: FileSystemEntry[];
  selectedFiles: Set<string>;
  cutFiles: Set<string>;
  onFileSelect: (path: string, multi?: boolean) => void;
  onFileOpen: (entry: FileSystemEntry) => void;
  onFileContextMenu: (entry: FileSystemEntry | undefined, event: MouseEvent) => void;
};

export default function FileExplorerList(props: FileExplorerListProps) {
  const handlers = createFileHandlers({
    onFileSelect: props.onFileSelect,
    onFileOpen: props.onFileOpen,
    onFileContextMenu: props.onFileContextMenu,
  });

  return (
    <div
      class="file-explorer-list min-w-full cursor-default select-none"
      onContextMenu={handlers.handleBackgroundContextMenu}
    >
      <div class="border-surface-300 bg-surface-500 grid grid-cols-12 border-b p-2 text-xs font-medium text-gray-400">
        <div class="col-span-6">Name</div>
        <div class="col-span-2 text-right">Size</div>
        <div class="col-span-2 text-right">Type</div>
        <div class="col-span-2 text-right">Modified</div>
      </div>

      <div class="divide-surface-300 divide-y">
        <For each={props.entries}>
          {(entry) => (
            <div
              class={mergeCls(
                "file-item grid cursor-pointer grid-cols-12 items-center p-2 transition-colors duration-200 select-none",
                "hover:bg-surface-300 focus:bg-surface-300 focus:outline-none",
                props.selectedFiles.has(entry.fullPath) ? "bg-surface-300 ring-1 ring-blue-500" : "bg-surface-400/30",
                props.cutFiles.has(entry.fullPath) ? "opacity-50" : "",
              )}
              {...getFileItemAttributes(entry, handlers, props.onFileOpen)}
            >
              <div class="col-span-6 flex items-center space-x-2">
                <FileIcon entry={entry} size="small" />
                <div class="file-name-container min-w-0 flex-1 truncate text-sm font-medium text-gray-200 select-none">
                  <WindowsStyleTitle text={entry.name} maxLength={40} />
                </div>
              </div>

              <div class="col-span-2 text-right text-sm text-gray-400">
                <Show when={entry instanceof File}>{formatFileSize((entry as File).size)}</Show>
                <Show when={entry instanceof Directory}>—</Show>
              </div>

              <div class="col-span-2 text-right text-sm text-gray-400">
                <Show when={entry instanceof Directory}>Directory</Show>
                <Show when={entry instanceof File && entry.extension}>{(entry as File).extension.toUpperCase()}</Show>
                <Show when={entry instanceof File && !entry.extension}>File</Show>
              </div>

              <div class="col-span-2 text-right text-sm text-gray-400">{formatDate(getValidModifiedDate(entry))}</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
