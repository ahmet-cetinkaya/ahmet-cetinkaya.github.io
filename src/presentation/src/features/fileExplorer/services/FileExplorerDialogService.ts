import type FileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import FileExplorerService from "@application/features/fileExplorer/services/FileExplorerService";
import { PermissionError } from "@application/features/system/services/PermissionService";

export interface DialogCallbacks {
  onSuccess?: (actualName?: string) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

export class FileExplorerDialogService {
  constructor(
    private fileSystemService: FileSystemService,
    private refresh: () => void,
  ) {}

  private normalizeError(error: unknown): Error {
    return error instanceof PermissionError ? error : new Error(error instanceof Error ? error.message : String(error));
  }

  private async executeOperation<T>(
    operation: (service: FileExplorerService) => Promise<T>,
    callbacks?: DialogCallbacks,
    onSuccess?: (result: T) => void,
  ): Promise<void> {
    try {
      const service = FileExplorerService.getInstance(this.fileSystemService);
      const result = await operation(service);
      this.refresh();
      onSuccess?.(result);
    } catch (error) {
      callbacks?.onError?.(this.normalizeError(error));
    }
  }

  async createFolder(currentPath: string, folderName: string, callbacks?: DialogCallbacks): Promise<void> {
    await this.executeOperation(
      (service) => service.createFolder(currentPath, folderName.trim()),
      callbacks,
      (result) => callbacks?.onSuccess?.(result.actualName),
    );
  }

  async createFile(currentPath: string, fileName: string, callbacks?: DialogCallbacks): Promise<void> {
    await this.executeOperation(
      (service) => service.createFile(currentPath, fileName.trim()),
      callbacks,
      (result) => callbacks?.onSuccess?.(result.actualName),
    );
  }

  async renameEntry(currentPath: string, newName: string, callbacks?: DialogCallbacks): Promise<void> {
    await this.executeOperation(
      (service) => service.renameEntry(currentPath, newName.trim()),
      callbacks,
      () => callbacks?.onSuccess?.(),
    );
  }

  async deleteEntries(paths: string[], callbacks?: DialogCallbacks): Promise<void> {
    await this.executeOperation(
      (service) => service.deleteEntries(paths),
      callbacks,
      () => callbacks?.onSuccess?.(),
    );
  }
}
