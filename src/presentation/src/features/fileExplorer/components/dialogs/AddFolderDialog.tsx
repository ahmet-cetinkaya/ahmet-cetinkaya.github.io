import { createSignal } from "solid-js";
import InputDialog from "@shared/components/ui/InputDialog";
import Icons from "@domain/data/Icons";
import type { BaseDialogProps } from "./BaseFileExplorerDialog";
import { FileExplorerDialogService } from "../../services/FileExplorerDialogService";

export type AddFolderDialogProps = BaseDialogProps & {
  currentPath: string;
  dialogService: FileExplorerDialogService;
};

export default function AddFolderDialog(props: AddFolderDialogProps) {
  const [infoMessage, setInfoMessage] = createSignal<string>();

  const handleConfirm = async (folderName: string): Promise<boolean> => {
    if (!folderName.trim()) {
      setInfoMessage("Please enter a folder name");
      return false;
    }

    return new Promise<boolean>((resolve) => {
      props.dialogService.createFolder(props.currentPath, folderName, {
        onSuccess: (_actualName) => {
          setInfoMessage(undefined);
          props.onSuccess?.();
          props.onClose();
          resolve(true);
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Failed to create folder";
          setInfoMessage(message);
          resolve(false);
        },
      });
    });
  };

  const handleCancel = () => {
    setInfoMessage(undefined);
    props.onClose();
  };

  const handleClose = () => {
    setInfoMessage(undefined);
    props.onClose();
  };

  return (
    <InputDialog
      isOpen={props.isOpen}
      title="New Folder"
      message="Enter the name for the new folder:"
      placeholder="Folder name"
      defaultValue=""
      icon={Icons.folderPlus}
      confirmButtonText="OK"
      cancelButtonText="Cancel"
      onConfirm={handleConfirm}
      onClose={handleClose}
      onCancel={handleCancel}
      errorMessage={infoMessage()}
    />
  );
}
