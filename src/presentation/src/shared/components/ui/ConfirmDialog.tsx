import Dialog from "../../../features/desktop/components/Dialog";
import Icons from "@domain/data/Icons";
import Size from "@packages/acore-ts/ui/models/Size";
import { useI18n } from "@shared/utils/i18nTranslate";
import { TranslationKeys } from "@domain/data/Translations";
import DialogSizeCalculator from "@shared/utils/DialogSizeCalculator";
import DialogButtons from "./DialogButtons";

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
        <DialogButtons
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          cancelButtonText={props.cancelButtonText}
          confirmButtonText={props.confirmButtonText}
        />,
      ]}
    />
  );
}
