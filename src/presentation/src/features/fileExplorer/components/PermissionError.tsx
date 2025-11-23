import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import Dialog from "@presentation/src/features/desktop/components/Dialog";
import Size from "@packages/acore-ts/ui/models/Size";
import { useI18n } from "@shared/utils/i18nTranslate";

interface PermissionErrorProps {
  message: string;
  path?: string;
  onClose?: () => void;
}

export default function PermissionError({ message, path, onClose }: PermissionErrorProps) {
  const translate = useI18n();

  // Create error description using the message for debugging purposes
  const createErrorDescription = (): string => {
    if (message) {
      // Extract path from message if no path prop provided
      if (!actualPath && message) {
        // Look for paths in quotes: "/path/to/file"
        const quotedPathMatch = message.match(/["']([^"']+)["']/);
        if (quotedPathMatch) {
          return translateWithParams(TranslationKeys.apps_terminal_permission_denied_description, {
            path: quotedPathMatch[1],
          });
        }

        // Look for paths that start with /
        const pathMatch = message.match(/([/][^\s]+)/);
        if (pathMatch) {
          return translateWithParams(TranslationKeys.apps_terminal_permission_denied_description, {
            path: pathMatch[1],
          });
        }
      }

      // If no path found in message, show generic error
      return translate(TranslationKeys.apps_terminal_permission_denied_description);
    }

    return translateWithParams(TranslationKeys.apps_terminal_permission_denied_description, { path: actualPath });
  };

  // Window size for permission error
  const size = new Size(400, 250);

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

  // Use provided path directly - parent component should extract path from error message
  // This simplifies the component and centralizes path extraction logic
  const actualPath = path || "";

  const finalDescription = createErrorDescription();

  return (
    <Dialog
      title={TranslationKeys.apps_terminal_permission_denied_title}
      description={finalDescription}
      icon={Icons.userForbidden}
      onClose={onClose}
      size={size}
      draggable={true}
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
