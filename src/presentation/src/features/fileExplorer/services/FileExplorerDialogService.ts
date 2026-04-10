import type FileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import FileExplorerService from "@application/features/fileExplorer/services/FileExplorerService";
import { PermissionError } from "@application/features/system/services/PermissionService";

export interface DialogCallbacks {
  onSuccess?: (actualName?: string) => void;
  onError?: (error: PermissionError) => void;
  onClose?: () => void;
}

export class FileExplorerDialogService {
  constructor(
    private fileSystemService: FileSystemService,
    private refresh: () => void,
  ) {}

  async createFolder(currentPath: string, folderName: string, callbacks?: DialogCallbacks): Promise<void> {
    try {
      const service = FileExplorerService.getInstance(this.fileSystemService);
      const result = await service.createFolder(currentPath, folderName.trim());
      this.refresh();
      callbacks?.onSuccess?.(result.actualName);
    } catch (error) {
      callbacks?.onError?.(error as PermissionError);
    }
  }

  async createFile(currentPath: string, fileName: string, callbacks?: DialogCallbacks): Promise<void> {
    try {
      const service = FileExplorerService.getInstance(this.fileSystemService);
      const result = await service.createFile(currentPath, fileName.trim());
      this.refresh();
      callbacks?.onSuccess?.(result.actualName);
    } catch (error) {
      callbacks?.onError?.(error as PermissionError);
    }
  }

  async renameEntry(currentPath: string, newName: string, callbacks?: DialogCallbacks): Promise<void> {
    try {
      const service = FileExplorerService.getInstance(this.fileSystemService);
      await service.renameEntry(currentPath, newName.trim());
      this.refresh();
      callbacks?.onSuccess?.();
    } catch (error) {
      callbacks?.onError?.(error as PermissionError);
    }
  }

  async deleteEntries(paths: string[], callbacks?: DialogCallbacks): Promise<void> {
    try {
      const service = FileExplorerService.getInstance(this.fileSystemService);
      await service.deleteEntries(paths);
      this.refresh();
      callbacks?.onSuccess?.();
    } catch (error) {
      callbacks?.onError?.(error as PermissionError);
    }
  }
}
