import InputDialog from "@shared/components/ui/InputDialog";
import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import { useI18n } from "@shared/utils/i18nTranslate";
import type { BaseDialogProps } from "./BaseFileExplorerDialog";
import { FileExplorerDialogService } from "../../services/FileExplorerDialogService";
import { PermissionError } from "@application/features/system/services/PermissionService";

export type AddFileDialogProps = BaseDialogProps & {
  currentPath: string;
  dialogService: FileExplorerDialogService;
};

export default function AddFileDialog(props: AddFileDialogProps) {
  const translate = useI18n();

  const handleConfirm = async (fileName: string): Promise<boolean> => {
    if (!fileName.trim()) {
      return false; // Simply return false for empty input, no inline error needed
    }

    return new Promise<boolean>((resolve) => {
      props.dialogService.createFile(props.currentPath, fileName, {
        onSuccess: (_actualName) => {
          props.onSuccess?.();
          props.onClose();
          resolve(true);
        },
        onError: (error) => {
          props.onError?.(error);
          props.onClose(); // Close the dialog even when there's an error
          resolve(false);
        },
      });
    });
  };

  const handleCancel = () => {
    props.onClose();
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <InputDialog
      isOpen={props.isOpen}
      title={translate(TranslationKeys.apps_file_explorer_dialog_new_file_title)}
      message={translate(TranslationKeys.apps_file_explorer_dialog_new_file_message)}
      placeholder={translate(TranslationKeys.apps_file_explorer_dialog_new_file_placeholder)}
      defaultValue=""
      icon={Icons.filePlus}
      confirmButtonText={translate(TranslationKeys.common_ok)}
      cancelButtonText={translate(TranslationKeys.common_cancel)}
      onConfirm={handleConfirm}
      onClose={handleClose}
      onCancel={handleCancel}
    />
  );
}
