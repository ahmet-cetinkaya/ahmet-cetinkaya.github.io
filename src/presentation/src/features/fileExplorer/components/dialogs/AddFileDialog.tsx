import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import type { BaseDialogProps } from "./BaseFileExplorerDialog";
import { FileExplorerDialogService } from "../../services/FileExplorerDialogService";
import AddEntryDialog from "./AddEntryDialog";

export type AddFileDialogProps = BaseDialogProps & {
  currentPath: string;
  dialogService: FileExplorerDialogService;
};

export default function AddFileDialog(props: AddFileDialogProps) {
  return (
    <AddEntryDialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSuccess={props.onSuccess}
      onError={props.onError}
      currentPath={props.currentPath}
      dialogService={props.dialogService}
      createMethod="createFile"
      titleKey={TranslationKeys.apps_file_explorer_dialog_new_file_title}
      messageKey={TranslationKeys.apps_file_explorer_dialog_new_file_message}
      placeholderKey={TranslationKeys.apps_file_explorer_dialog_new_file_placeholder}
      icon={Icons.filePlus}
    />
  );
}
