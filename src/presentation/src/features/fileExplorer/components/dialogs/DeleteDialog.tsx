import ConfirmDialog from "@shared/components/ui/ConfirmDialog";
import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import { useI18n } from "@shared/utils/i18nTranslate";
import type { BaseDialogProps } from "./BaseFileExplorerDialog";
import { FileExplorerDialogService } from "../../services/FileExplorerDialogService";

export type DeleteDialogProps = BaseDialogProps & {
  pathsToDelete: string[];
  dialogService: FileExplorerDialogService;
};

export default function DeleteDialog(props: DeleteDialogProps) {
  const translate = useI18n();
  const itemCount = props.pathsToDelete.length;
  const fileNames = props.pathsToDelete.map((path) => path.split("/").pop() || "unknown");

  // Custom translate function that supports parameter replacement
  const translateWithParams = (key: TranslationKeys, params: Record<string, string> = {}): string => {
    const translation = translate(key);
    let result = translation;

    // Replace {{param}} patterns with provided values
    Object.entries(params).forEach(([paramName, paramValue]) => {
      const pattern = new RegExp(`{{${paramName}}}`, "g");
      result = result.replace(pattern, paramValue);
    });

    return result;
  };

  const confirmMessage =
    itemCount === 1
      ? translateWithParams(TranslationKeys.apps_file_explorer_dialog_delete_message_single, {
          name: fileNames[0],
        })
      : translateWithParams(TranslationKeys.apps_file_explorer_dialog_delete_message_multiple, {
          count: itemCount.toString(),
        });

  return (
    <ConfirmDialog
      isOpen={props.isOpen}
      title={translate(TranslationKeys.apps_file_explorer_dialog_delete_title)}
      message={confirmMessage}
      type="danger"
      icon={Icons.trash}
      confirmButtonText={translate(TranslationKeys.common_ok)}
      cancelButtonText={translate(TranslationKeys.common_cancel)}
      onConfirm={async () => {
        await props.dialogService.deleteEntries(props.pathsToDelete, {
          onSuccess: () => {
            props.onSuccess?.();
            props.onClose();
          },
          onError: (error) => {
            props.onError?.(error);
            props.onClose(); // Close the confirm dialog even when there's an error
          },
        });
      }}
      onCancel={() => {
        props.onClose();
      }}
    />
  );
}
