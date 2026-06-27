import InputDialog from "@shared/components/ui/InputDialog";
import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import { useI18n } from "@shared/utils/i18nTranslate";
import type { BaseDialogProps } from "./BaseFileExplorerDialog";
import { FileExplorerDialogService } from "../../services/FileExplorerDialogService";
import { executeDialogAction } from "./executeDialogAction";

export type RenameDialogProps = BaseDialogProps & {
  currentPath: string;
  currentName: string;
  dialogService: FileExplorerDialogService;
};

export default function RenameDialog(props: RenameDialogProps) {
  const translate = useI18n();

  const handleConfirm = async (newName: string): Promise<boolean> => {
    if (newName.trim() !== "" && newName !== props.currentName) {
      return executeDialogAction((callbacks) => {
        props.dialogService.renameEntry(props.currentPath, newName, callbacks);
      }, props);
    } else {
      props.onClose();
      return true;
    }
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
      onClose={() => props.onClose()}
      onCancel={() => props.onClose()}
    />
  );
}
