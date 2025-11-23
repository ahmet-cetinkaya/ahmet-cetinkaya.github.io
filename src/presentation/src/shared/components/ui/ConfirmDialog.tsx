import Dialog from "../../../features/desktop/components/Dialog";
import Button from "@shared/components/ui/Button";
import Icons from "@domain/data/Icons";
import Size from "@packages/acore-ts/ui/models/Size";
import { useI18n } from "@shared/utils/i18nTranslate";
import { TranslationKeys } from "@domain/data/Translations";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string | TranslationKeys;
  message: string | TranslationKeys;
  confirmButtonText?: string | TranslationKeys;
  cancelButtonText?: string | TranslationKeys;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
  icon?: Icons;
  type?: "danger" | "warning" | "info";
  size?: Size;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  const translate = useI18n();

  const handleConfirm = () => {
    props.onConfirm();
  };

  const handleCancel = () => {
    props.onCancel();
  };

  const handleClose = () => {
    props.onClose?.();
    props.onCancel();
  };

  const translateText = (text: string | TranslationKeys): string => {
    return Object.values(TranslationKeys).includes(text as TranslationKeys) ? translate(text as TranslationKeys) : text;
  };

  const getDefaultIcon = (): Icons => {
    switch (props.type) {
      case "danger":
        return Icons.userForbidden;
      case "warning":
        return Icons.spinner;
      default:
        return Icons.envelope;
    }
  };

  return (
    <Dialog
      title={props.title || "Confirm Action"}
      message={translateText(props.message)}
      icon={props.icon || getDefaultIcon()}
      isOpen={props.isOpen}
      onClose={handleClose}
      size={props.size || new Size(400, 200)}
      draggable={true}
      closeAriaLabel="Close confirmation dialog"
      showOkButton={false}
      customButtons={[
        <div class="flex space-x-2">
          <Button onClick={handleCancel} variant="text" size="small" class="px-3 py-2 text-sm" ariaLabel="Cancel">
            {translateText(props.cancelButtonText || TranslationKeys.common_close)}
          </Button>
          <Button onClick={handleConfirm} variant="primary" size="small" class="px-3 py-2 text-sm" ariaLabel="Confirm">
            {translateText(props.confirmButtonText || TranslationKeys.common_close)}
          </Button>
        </div>,
      ]}
    />
  );
}
