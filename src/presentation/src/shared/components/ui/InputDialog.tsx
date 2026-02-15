import { createSignal } from "solid-js";
import Dialog from "../../../features/desktop/components/Dialog";
import Button from "@shared/components/ui/Button";
import Icons from "@domain/data/Icons";
import Size from "@packages/acore-ts/ui/models/Size";
import { useI18n } from "@shared/utils/i18nTranslate";
import { TranslationKeys } from "@domain/data/Translations";
import DialogSizeCalculator from "@shared/utils/DialogSizeCalculator";

interface InputDialogProps {
  isOpen: boolean;
  title?: string | TranslationKeys;
  message?: string | TranslationKeys;
  placeholder?: string;
  defaultValue?: string;
  confirmButtonText?: string | TranslationKeys;
  cancelButtonText?: string | TranslationKeys;
  onConfirm: (value: string) => Promise<boolean> | void | Promise<void>;
  onCancel: () => void;
  onClose?: () => void;
  icon?: Icons;
  size?: Size;
  errorMessage?: string;
}

export default function InputDialog(props: InputDialogProps) {
  const translate = useI18n();
  const [inputValue, setInputValue] = createSignal(props.defaultValue || "");

  const handleConfirm = async () => {
    const value = inputValue().trim();
    if (value) {
      try {
        const result = props.onConfirm(value);
        // Handle both async and sync returns
        const shouldClose = result instanceof Promise ? await result : result;

        // Only clear input and close if onConfirm returns true or undefined (success)
        if (shouldClose !== false) {
          setInputValue("");
        }
      } catch {
        // Don't let errors propagate - they should be handled by the dialog component
        // The dialog should stay open and show the error message
      }
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
      icon={props.icon || Icons.filePlus} // Provide fallback icon
      isOpen={props.isOpen}
      onClose={handleClose}
      size={props.size || new Size(400, 200)}
      draggable={false}
      closeAriaLabel="Close input dialog"
      showOkButton={false}
      enableAutoResize={true}
      sizingOptions={DialogSizeCalculator.createSizeOptions("input")}
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
    >
      <div class="mt-2">
        <input
          type="text"
          value={inputValue()}
          onInput={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder={props.placeholder || translate(TranslationKeys.common_path)}
          class={`w-full rounded border px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 ${
            props.errorMessage
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-surface-300 focus:border-blue-500 focus:ring-blue-500"
          } bg-surface-600`}
          ref={(el) => el && props.isOpen && el.focus()}
        />
        {props.errorMessage && <div class="mt-2 text-sm text-red-400">{props.errorMessage}</div>}
      </div>
    </Dialog>
  );
}
