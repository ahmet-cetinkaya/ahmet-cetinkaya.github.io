import InputDialog from "@shared/components/ui/InputDialog";
import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import { useI18n } from "@shared/utils/i18nTranslate";
import type { BaseDialogProps } from "./BaseFileExplorerDialog";
import { FileExplorerDialogService } from "../../services/FileExplorerDialogService";
import { executeDialogAction } from "./executeDialogAction";

type CreateMethod = "createFile" | "createFolder";

type AddEntryDialogProps = BaseDialogProps & {
  currentPath: string;
  dialogService: FileExplorerDialogService;
  createMethod: CreateMethod;
  titleKey: TranslationKeys;
  messageKey: TranslationKeys;
  placeholderKey: TranslationKeys;
  icon: Icons;
};

export default function AddEntryDialog(props: AddEntryDialogProps) {
  const translate = useI18n();

  const handleConfirm = async (name: string): Promise<boolean> => {
    if (!name.trim()) return false;

    return executeDialogAction((callbacks) => {
      const method = props.dialogService[props.createMethod];
      method.call(props.dialogService, props.currentPath, name, callbacks);
    }, props);
  };

  return (
    <InputDialog
      isOpen={props.isOpen}
      title={translate(props.titleKey)}
      message={translate(props.messageKey)}
      placeholder={translate(props.placeholderKey)}
      defaultValue=""
      icon={props.icon}
      confirmButtonText={translate(TranslationKeys.common_ok)}
      cancelButtonText={translate(TranslationKeys.common_cancel)}
      onConfirm={handleConfirm}
      onClose={() => props.onClose()}
      onCancel={() => props.onClose()}
    />
  );
}
