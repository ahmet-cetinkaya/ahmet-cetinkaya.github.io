import { createSignal, createEffect } from "solid-js";
import type FileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import { FileExplorerDialogService } from "../../services/FileExplorerDialogService";
import { logger } from "@shared/utils/logger";
import AddFolderDialog from "./AddFolderDialog";
import AddFileDialog from "./AddFileDialog";
import RenameDialog from "./RenameDialog";
import DeleteDialog from "./DeleteDialog";
import NoActionDialog from "./NoActionDialog";

export type DialogType = "add-folder" | "add-file" | "rename" | "delete" | "no-action";

export interface DialogConfig {
  type: DialogType;
  currentPath?: string;
  pathsToDelete?: string[];
  currentName?: string;
  fileName?: string;
  fileType?: string;
}

export type FileExplorerDialogManagerProps = {
  fileSystemService: FileSystemService;
  refresh: () => void;
  onError?: (error: unknown) => void;
  onSuccess?: () => void;
  onOpenDialog?: (openDialog: (config: DialogConfig) => void) => void;
};

export default function FileExplorerDialogManager(props: FileExplorerDialogManagerProps) {
  const [activeDialog, setActiveDialog] = createSignal<DialogConfig | null>(null);
  const [dialogService, setDialogService] = createSignal<FileExplorerDialogService | null>(null);

  // Initialize dialog service when component mounts
  const initializeDialogService = () => {
    if (!dialogService()) {
      setDialogService(new FileExplorerDialogService(props.fileSystemService, props.refresh));
    }
    return dialogService()!;
  };

  // Expose openDialog method to parent component through props callback
  const openDialog = (config: DialogConfig) => {
    initializeDialogService();
    setActiveDialog(config);
  };

  // Provide the openDialog method to parent component once when component mounts
  createEffect(() => {
    if (props.onOpenDialog) {
      props.onOpenDialog(openDialog);
    }
  });

  const closeDialog = () => {
    setActiveDialog(null);
  };

  const handleError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Dialog error: ${errorMessage}`, error);
    props.onError?.(error);
  };

  const handleSuccess = () => {
    props.onSuccess?.();
  };

  return (
    <>
      {/* Add Folder Dialog */}
      {dialogService() && activeDialog()?.type === "add-folder" && (
        <AddFolderDialog
          isOpen={true}
          currentPath={activeDialog()!.currentPath!}
          dialogService={dialogService()!}
          onSuccess={handleSuccess}
          onError={handleError}
          onClose={closeDialog}
        />
      )}

      {/* Add File Dialog */}
      {dialogService() && activeDialog()?.type === "add-file" && (
        <AddFileDialog
          isOpen={true}
          currentPath={activeDialog()!.currentPath!}
          dialogService={dialogService()!}
          onSuccess={handleSuccess}
          onError={handleError}
          onClose={closeDialog}
        />
      )}

      {/* Rename Dialog */}
      {dialogService() && activeDialog()?.type === "rename" && (
        <RenameDialog
          isOpen={true}
          currentPath={activeDialog()!.currentPath!}
          currentName={activeDialog()!.currentName!}
          dialogService={dialogService()!}
          onSuccess={handleSuccess}
          onError={handleError}
          onClose={closeDialog}
        />
      )}

      {/* Delete Dialog */}
      {dialogService() && activeDialog()?.type === "delete" && (
        <DeleteDialog
          isOpen={true}
          pathsToDelete={activeDialog()!.pathsToDelete!}
          dialogService={dialogService()!}
          onSuccess={handleSuccess}
          onError={handleError}
          onClose={closeDialog}
        />
      )}

      {/* No Action Dialog */}
      {activeDialog()?.type === "no-action" && (
        <NoActionDialog fileName={activeDialog()!.fileName} fileType={activeDialog()!.fileType} onClose={closeDialog} />
      )}
    </>
  );
}
