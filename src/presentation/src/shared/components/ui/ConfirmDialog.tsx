import Dialog from "../../../features/desktop/components/Dialog";
import Button from "@shared/components/ui/Button";
import Icons from "@domain/data/Icons";
import Size from "@packages/acore-ts/ui/models/Size";
import { useI18n } from "@shared/utils/i18nTranslate";
import { TranslationKeys } from "@domain/data/Translations";
import DialogSizeCalculator from "@shared/utils/DialogSizeCalculator";

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
  description?: string | TranslationKeys;
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
        return Icons.trash;
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
      description={props.description && translateText(props.description)}
      icon={props.icon || getDefaultIcon()}
      isOpen={props.isOpen}
      onClose={handleClose}
      size={props.size || DialogSizeCalculator.getDefaultSize("confirm")}
      draggable={false}
      closeAriaLabel="Close confirmation dialog"
      showOkButton={false}
      enableAutoResize={true}
      fitContent={true}
      sizingOptions={DialogSizeCalculator.createSizeOptions("confirm")}
      customButtons={[
        <div class="flex justify-end space-x-2">
          <Button onClick={handleCancel} variant="text" size="small" class="px-4 py-2 text-sm" ariaLabel="Cancel">
            {props.cancelButtonText &&
            Object.values(TranslationKeys).includes(props.cancelButtonText as TranslationKeys)
              ? translate(props.cancelButtonText as TranslationKeys)
              : props.cancelButtonText || "Cancel"}
          </Button>
          <Button onClick={handleConfirm} variant="primary" size="small" class="px-4 py-2 text-sm" ariaLabel="Confirm">
            {props.confirmButtonText &&
            Object.values(TranslationKeys).includes(props.confirmButtonText as TranslationKeys)
              ? translate(props.confirmButtonText as TranslationKeys)
              : props.confirmButtonText || "OK"}
          </Button>
        </div>,
      ]}
    />
  );
}
