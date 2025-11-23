import { createSignal } from "solid-js";
import Dialog from "../../../features/desktop/components/Dialog";
import Button from "@shared/components/ui/Button";
import Icons from "@domain/data/Icons";
import Size from "@packages/acore-ts/ui/models/Size";
import { useI18n } from "@shared/utils/i18nTranslate";
import { TranslationKeys } from "@domain/data/Translations";

interface InputDialogProps {
  isOpen: boolean;
  title?: string | TranslationKeys;
  message?: string | TranslationKeys;
  placeholder?: string;
  defaultValue?: string;
  confirmButtonText?: string | TranslationKeys;
  cancelButtonText?: string | TranslationKeys;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  onClose?: () => void;
  icon?: Icons;
  size?: Size;
}

export default function InputDialog(props: InputDialogProps) {
  const translate = useI18n();
  const [inputValue, setInputValue] = createSignal(props.defaultValue || "");

  const handleConfirm = () => {
    const value = inputValue().trim();
    if (value) {
      props.onConfirm(value);
      setInputValue("");
    }
  };

  const handleCancel = () => {
    props.onCancel();
    setInputValue("");
  };

  const handleClose = () => {
    props.onClose?.();
    props.onCancel();
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const translateText = (text: string | TranslationKeys): string => {
    return Object.values(TranslationKeys).includes(text as TranslationKeys) ? translate(text as TranslationKeys) : text;
  };

  return (
    <Dialog
      title={props.title || "Input Required"}
      message={translateText(props.message || "")}
      icon={props.icon || Icons.edit}
      isOpen={props.isOpen}
      onClose={handleClose}
      size={props.size || new Size(400, 200)}
      draggable={true}
      closeAriaLabel="Close input dialog"
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
    >
      <div class="mt-2">
        <input
          type="text"
          value={inputValue()}
          onInput={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder={props.placeholder || translate(TranslationKeys.common_path)}
          class="w-full rounded border border-surface-300 bg-surface-600 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          ref={(el) => el && props.isOpen && el.focus()}
        />
      </div>
    </Dialog>
  );
}
