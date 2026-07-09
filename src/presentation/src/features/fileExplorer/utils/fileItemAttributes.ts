import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import Directory from "@domain/models/Directory";

type FileHandlers = {
  handleClick: (entry: FileSystemEntry, e: MouseEvent) => void;
  handleDoubleClick: (entry: FileSystemEntry, e: MouseEvent) => void;
  handleContextMenu: (entry: FileSystemEntry, e: MouseEvent) => void;
};

export function getFileItemAttributes(
  entry: FileSystemEntry,
  handlers: FileHandlers,
  onFileOpen: (entry: FileSystemEntry) => void,
) {
  return {
    onClick: (e: MouseEvent) => handlers.handleClick(entry, e),
    onDblClick: (e: MouseEvent) => handlers.handleDoubleClick(entry, e),
    onContextMenu: (e: MouseEvent) => handlers.handleContextMenu(entry, e),
    tabIndex: 0,
    role: "button" as const,
    "aria-label": `${entry.name} ${entry instanceof Directory ? "directory" : "file"}`,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        onFileOpen(entry);
      }
    },
  };
}
