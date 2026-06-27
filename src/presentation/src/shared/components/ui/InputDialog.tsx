import { createSignal } from "solid-js";
import Dialog from "../../../features/desktop/components/Dialog";
import Icons from "@domain/data/Icons";
import Size from "@packages/acore-ts/ui/models/Size";
import { useI18n } from "@shared/utils/i18nTranslate";
import { logger } from "@shared/utils/logger";
import { TranslationKeys } from "@domain/data/Translations";
import DialogSizeCalculator from "@shared/utils/DialogSizeCalculator";
import DialogButtons from "./DialogButtons";

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

  // Helper function to translate both string and TranslationKey types
  const translateText = (text: string | TranslationKeys): string => {
    return Object.values(TranslationKeys).includes(text as TranslationKeys) ? translate(text as TranslationKeys) : text;
  };

  // Calculate dynamic size based on content and error state
  const dialogSize =
    props.size ||
    (() => {
      const contentMetrics = DialogSizeCalculator.analyzeContent(
        translateText(props.message || ""),
        true, // hasInput
        true, // hasButtons
        !!props.errorMessage, // hasError
        !!props.icon, // hasIcon
      );

      const calculatedSize = DialogSizeCalculator.calculateOptimalSize(
        contentMetrics,
        DialogSizeCalculator.createSizeOptions("input"),
      );

      return DialogSizeCalculator.getViewportConstrainedSize(calculatedSize);
    })();

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
      } catch (error) {
        logger.error("Input dialog confirmation error:", error);
        // Dialog should stay open and show the error message via props.errorMessage
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

  return (
    <Dialog
      title={props.title || "Input Required"}
      message={translateText(props.message || "")}
      icon={props.icon || Icons.filePlus} // Provide fallback icon
      isOpen={props.isOpen}
      onClose={handleClose}
      size={dialogSize}
      draggable={false}
      closeAriaLabel="Close input dialog"
      showOkButton={false}
      enableAutoResize={false} // We're handling sizing dynamically
      fitContent={true}
      sizingOptions={DialogSizeCalculator.createSizeOptions("input")}
      customButtons={[
        <DialogButtons
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          cancelButtonText={props.cancelButtonText}
          confirmButtonText={props.confirmButtonText}
        />,
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
