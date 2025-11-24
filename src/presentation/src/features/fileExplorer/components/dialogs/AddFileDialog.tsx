import { createSignal } from "solid-js";
import InputDialog from "@shared/components/ui/InputDialog";
import Icons from "@domain/data/Icons";
import type { BaseDialogProps } from "./BaseFileExplorerDialog";
import { FileExplorerDialogService } from "../../services/FileExplorerDialogService";

export type AddFileDialogProps = BaseDialogProps & {
  currentPath: string;
  dialogService: FileExplorerDialogService;
};

export default function AddFileDialog(props: AddFileDialogProps) {
  const [infoMessage, setInfoMessage] = createSignal<string>();

  const handleConfirm = async (fileName: string): Promise<boolean> => {
    if (!fileName.trim()) {
      setInfoMessage("Please enter a file name");
      return false;
    }

    return new Promise<boolean>((resolve) => {
      props.dialogService.createFile(props.currentPath, fileName, {
        onSuccess: (_actualName) => {
          setInfoMessage(undefined);
          props.onSuccess?.();
          props.onClose();
          resolve(true);
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Failed to create file";
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
      title="New File"
      message="Enter the name for the new file:"
      placeholder="File name"
      defaultValue=""
      icon={Icons.filePlus}
      confirmButtonText="OK"
      cancelButtonText="Cancel"
      onConfirm={handleConfirm}
      onClose={handleClose}
      onCancel={handleCancel}
      errorMessage={infoMessage()}
    />
  );
}
