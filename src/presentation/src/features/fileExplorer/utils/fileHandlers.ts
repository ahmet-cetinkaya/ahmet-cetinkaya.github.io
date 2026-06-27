import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";

type FileHandlerCallbacks = {
  onFileSelect: (path: string, multi?: boolean) => void;
  onFileOpen: (entry: FileSystemEntry) => void;
  onFileContextMenu: (entry: FileSystemEntry | undefined, event: MouseEvent) => void;
};

export function createFileHandlers(callbacks: FileHandlerCallbacks) {
  return {
    handleClick(entry: FileSystemEntry, event: MouseEvent) {
      callbacks.onFileSelect(entry.fullPath, event.ctrlKey || event.metaKey);
    },
    handleDoubleClick(entry: FileSystemEntry, event: MouseEvent) {
      event.preventDefault();
      event.stopPropagation();
      callbacks.onFileOpen(entry);
    },
    handleContextMenu(entry: FileSystemEntry, event: MouseEvent) {
      event.preventDefault();
      event.stopPropagation();
      callbacks.onFileContextMenu(entry, event);
    },
    handleBackgroundContextMenu(event: MouseEvent) {
      event.preventDefault();
      callbacks.onFileContextMenu(undefined, event);
    },
  };
}
