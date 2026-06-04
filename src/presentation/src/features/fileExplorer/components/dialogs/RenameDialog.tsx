import InputDialog from "@shared/components/ui/InputDialog";
import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import { useI18n } from "@shared/utils/i18nTranslate";
import type { BaseDialogProps } from "./BaseFileExplorerDialog";
import { FileExplorerDialogService } from "../../services/FileExplorerDialogService";

export type RenameDialogProps = BaseDialogProps & {
  currentPath: string;
  currentName: string;
  dialogService: FileExplorerDialogService;
};

export default function RenameDialog(props: RenameDialogProps) {
  const translate = useI18n();

  const handleConfirm = async (newName: string): Promise<boolean> => {
    // Only proceed if name is actually different and not empty
    if (newName.trim() !== "" && newName !== props.currentName) {
      return new Promise<boolean>((resolve) => {
        props.dialogService.renameEntry(props.currentPath, newName, {
          onSuccess: () => {
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
    } else {
      // Close dialog without action if name hasn't changed
      props.onClose();
      return true;
    }
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
      title={translate(TranslationKeys.apps_file_explorer_dialog_rename_title)}
      message={`${translate(TranslationKeys.apps_file_explorer_dialog_rename_message)} "${props.currentName}":`}
      placeholder={translate(TranslationKeys.apps_file_explorer_dialog_rename_placeholder)}
      defaultValue={props.currentName}
      icon={Icons.edit}
      confirmButtonText={translate(TranslationKeys.common_ok)}
      cancelButtonText={translate(TranslationKeys.common_cancel)}
      onConfirm={handleConfirm}
      onClose={handleClose}
      onCancel={handleCancel}
    />
  );
}
