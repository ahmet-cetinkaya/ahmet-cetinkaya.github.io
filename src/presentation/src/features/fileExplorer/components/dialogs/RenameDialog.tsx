import { createSignal } from "solid-js";
import InputDialog from "@shared/components/ui/InputDialog";
import Icons from "@domain/data/Icons";
import type { BaseDialogProps } from "./BaseFileExplorerDialog";
import { FileExplorerDialogService } from "../../services/FileExplorerDialogService";

export type RenameDialogProps = BaseDialogProps & {
  currentPath: string;
  currentName: string;
  dialogService: FileExplorerDialogService;
};

export default function RenameDialog(props: RenameDialogProps) {
  const [errorMessage, setErrorMessage] = createSignal<string>();

  const handleConfirm = async (newName: string): Promise<boolean> => {
    // Only proceed if name is actually different and not empty
    if (newName.trim() !== "" && newName !== props.currentName) {
      return new Promise<boolean>((resolve) => {
        props.dialogService.renameEntry(props.currentPath, newName, {
          onSuccess: () => {
            setErrorMessage(undefined);
            props.onSuccess?.();
            props.onClose();
            resolve(true); // Success - allow dialog to close
          },
          onError: (error) => {
            // Show error inline instead of opening new dialog
            // Don't close the dialog - let user try again
            const message = error instanceof Error ? error.message : "Failed to rename";
            setErrorMessage(message);
            resolve(false); // Error - prevent dialog from closing
          },
        });
      });
    } else {
      // Close dialog without action if name hasn't changed
      props.onClose();
      return true;
    }
  };

  const handleCancel = () => {
    setErrorMessage(undefined);
    props.onClose();
  };

  const handleClose = () => {
    setErrorMessage(undefined);
    props.onClose();
  };

  return (
    <InputDialog
      isOpen={props.isOpen}
      title="Rename"
      message={`Enter new name for "${props.currentName}":`}
      placeholder="New name"
      defaultValue={props.currentName}
      icon={Icons.edit}
      confirmButtonText="OK"
      cancelButtonText="Cancel"
      onConfirm={handleConfirm}
      onClose={handleClose}
      onCancel={handleCancel}
      errorMessage={errorMessage()}
    />
  );
}
