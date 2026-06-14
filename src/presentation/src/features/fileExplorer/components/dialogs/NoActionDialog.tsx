import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import Dialog from "@presentation/src/features/desktop/components/Dialog";
import { useI18n } from "@shared/utils/i18nTranslate";
import DialogSizeCalculator from "@shared/utils/DialogSizeCalculator";
import { createTranslateWithParams } from "@shared/utils/translateWithParams";

type NoActionDialogProps = {
  fileName?: string;
  fileType?: string;
  onClose?: () => void;
};

export default function NoActionDialog({ fileName, fileType, onClose }: NoActionDialogProps) {
  const translate = useI18n();
  const translateWithParams = createTranslateWithParams(translate);

  // Use standardized size for notice dialog
  const size = DialogSizeCalculator.getDefaultSize("notice");

  // Create dialog description with file information
  const createDescription = (): string => {
    if (fileName) {
      return translateWithParams(TranslationKeys.apps_file_explorer_no_action_description_with_file, {
        fileName,
        fileType: fileType || "unknown",
      });
    }

    return translate(TranslationKeys.apps_file_explorer_no_action_description);
  };

  const description = createDescription();

  return (
    <Dialog
      title={TranslationKeys.apps_file_explorer_no_action_title}
      description={description}
      icon={Icons.userForbidden}
      onClose={onClose}
      size={size}
      draggable={true}
      fitContent={true}
      closeAriaLabel="Close no action dialog"
      okButtonText={TranslationKeys.common_close}
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        position: "fixed",
      }}
    />
  );
}
