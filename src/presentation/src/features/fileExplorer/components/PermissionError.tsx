import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import Dialog from "@presentation/src/features/desktop/components/Dialog";
import { useI18n } from "@shared/utils/i18nTranslate";
import { PermissionError } from "@application/features/system/services/PermissionService";
import DialogSizeCalculator from "@shared/utils/DialogSizeCalculator";

type PermissionErrorProps = {
  error: Error | PermissionError;
  onClose?: () => void;
};

export default function PermissionErrorDialog({ error, onClose }: PermissionErrorProps) {
  const translate = useI18n();

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

  // Extract path from error and use translation
  const createErrorDescription = (): string => {
    let path: string;

    // If it's our PermissionError, use the path property
    if (error instanceof PermissionError && error.isPermissionError) {
      path = error.path;
    } else {
      // Fallback: extract path from message for other error types or backward compatibility
      const message = error.message;
      const pathMatch = message.match(/([/][^\s]+)/);
      path = pathMatch ? pathMatch[1] : "";
    }

    if (path) {
      return translateWithParams(TranslationKeys.apps_terminal_permission_denied_basic, {
        path: path,
      });
    }

    // Fallback to generic permission denied description
    return translate(TranslationKeys.apps_terminal_permission_denied_description);
  };

  // Use standardized size for error dialog
  const size = DialogSizeCalculator.getDefaultSize("error");

  const finalDescription = createErrorDescription();

  return (
    <Dialog
      title={TranslationKeys.apps_terminal_permission_denied_title}
      description={finalDescription}
      icon={Icons.userForbidden}
      onClose={onClose}
      size={size}
      draggable={true}
      fitContent={true}
      closeAriaLabel="Close permission error dialog"
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
