import InputDialog from "@shared/components/ui/InputDialog";
import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import { useI18n } from "@shared/utils/i18nTranslate";
import type { BaseDialogProps } from "./BaseFileExplorerDialog";
import { FileExplorerDialogService } from "../../services/FileExplorerDialogService";

export type AddFolderDialogProps = BaseDialogProps & {
  currentPath: string;
  dialogService: FileExplorerDialogService;
};

export default function AddFolderDialog(props: AddFolderDialogProps) {
  const translate = useI18n();

  const handleConfirm = async (folderName: string): Promise<boolean> => {
    if (!folderName.trim()) {
      return false; // Simply return false for empty input, no inline error needed
    }

    return new Promise<boolean>((resolve) => {
      props.dialogService.createFolder(props.currentPath, folderName, {
        onSuccess: (_actualName) => {
          props.onSuccess?.();
          props.onClose();
          resolve(true);
        },
        onError: (error) => {
          props.onError?.(error);
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
      title={translate(TranslationKeys.apps_file_explorer_dialog_new_folder_title)}
      message={translate(TranslationKeys.apps_file_explorer_dialog_new_folder_message)}
      placeholder={translate(TranslationKeys.apps_file_explorer_dialog_new_folder_placeholder)}
      defaultValue=""
      icon={Icons.folderPlus}
      confirmButtonText={translate(TranslationKeys.common_ok)}
      cancelButtonText={translate(TranslationKeys.common_cancel)}
      onConfirm={handleConfirm}
      onClose={handleClose}
      onCancel={handleCancel}
    />
  );
}
