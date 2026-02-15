import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import Dialog from "@presentation/src/features/desktop/components/Dialog";
import Size from "@packages/acore-ts/ui/models/Size";
import { useI18n } from "@shared/utils/i18nTranslate";

type NoActionDialogProps = {
  fileName?: string;
  fileType?: string;
  onClose?: () => void;
};

export default function NoActionDialog({ fileName, fileType, onClose }: NoActionDialogProps) {
  const translate = useI18n();

  // Window size for no action dialog
  const size = new Size(300, 200);

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
