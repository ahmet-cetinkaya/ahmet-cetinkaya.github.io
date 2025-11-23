import { Show, type JSX } from "solid-js";
import Icon from "@presentation/src/shared/components/Icon";
import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import Modal from "@packages/acore-solidjs/ui/components/Modal";
import Button from "@shared/components/ui/Button";
import Size from "@packages/acore-ts/ui/models/Size";
import { useI18n } from "@shared/utils/i18nTranslate";

interface DialogProps {
  title?: string | TranslationKeys;
  message?: string;
  icon?: Icons;
  onClose?: () => void;
  isOpen?: boolean;
  size?: Size;
  draggable?: boolean;
  class?: string;
  showOkButton?: boolean;
  okButtonText?: string | TranslationKeys;
  customButtons?: JSX.Element[];
  closeAriaLabel?: string;
  description?: string | TranslationKeys;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
}

/**
 * A reusable dialog component that wraps the Modal component with common dialog patterns
 * including title, icon, message, and action buttons.
 */
export default function Dialog(props: DialogProps) {
  const translate = useI18n();

  const {
    title = "Dialog",
    icon,
    onClose,
    isOpen = true,
    size = new Size(320, 200),
    draggable = true,
    class: customClass = "",
    showOkButton = true,
    okButtonText = "OK",
    customButtons,
    closeAriaLabel = "Close dialog",
    description,
    style,
    children,
    message,
  } = props;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Helper function to translate text if it's a TranslationKey
  const translateText = (text: string | TranslationKeys): string => {
    return Object.values(TranslationKeys).includes(text as TranslationKeys) ? translate(text as TranslationKeys) : text;
  };

  return (
    <Show when={isOpen}>
      <Modal
        title={translateText(title)}
        size={size}
        draggable={draggable}
        maximizable={false}
        onClose={handleClose}
        closeAriaLabel={closeAriaLabel}
        // Center the dialog by not providing position, letting Modal center it by default
        class={`shadow-md fixed min-h-40 min-w-40 transform rounded-lg border border-black bg-surface-500 text-white shadow-secondary ${customClass}`}
        headerClass="bg-surface-400 border-b border-black"
        customHeaderButtons={customButtons}
        style={style}
      >
        <div class="flex h-full flex-col p-3">
          {/* Icon and Message/Children - Left aligned, icon vertically centered */}
          <div class="mb-4 flex flex-grow items-start">
            {icon && <Icon icon={icon} class="mr-4 mt-1 h-8 w-8 flex-shrink-0 text-2xl text-red-500" />}
            <div class="flex-grow">
              {/* Message text (fallback for simple dialogs) */}
              {message && (
                <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{translateText(message)}</p>
              )}
              {/* Description text */}
              {description && (
                <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{translateText(description)}</p>
              )}
              {/* Custom content (children) */}
              {children}
            </div>
          </div>

          {/* Action Buttons - Full width OK button */}
          <div class="border-t border-black pt-3">
            {customButtons}
            {showOkButton && (
              <Button
                onClick={handleClose}
                variant="primary"
                size="small"
                class="w-full px-4 py-2 text-sm"
                ariaLabel=""
              >
                {translateText(okButtonText)}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </Show>
  );
}
