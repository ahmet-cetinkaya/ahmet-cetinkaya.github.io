import { Show, createEffect, createSignal, type JSX } from "solid-js";
import Icons from "@domain/data/Icons";
import { TranslationKeys } from "@domain/data/Translations";
import Modal from "@packages/acore-solidjs/ui/components/Modal";
import Button from "@shared/components/ui/Button";
import Size from "@packages/acore-ts/ui/models/Size";
import { useI18n } from "@shared/utils/i18nTranslate";
import DialogSizeCalculator, { type DialogSizingOptions } from "@shared/utils/DialogSizeCalculator";

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
  // Auto-sizing options
  enableAutoResize?: boolean;
  sizingOptions?: DialogSizingOptions;
  fitContent?: boolean;
  // Backdrop options
  closeOnBackdropClick?: boolean;
}

/**
 * A reusable dialog component that wraps the Modal component with common dialog patterns
 * including title, icon, message, and action buttons.
 */
export default function Dialog(props: DialogProps) {
  const translate = useI18n();
  const [dynamicSize, setDynamicSize] = createSignal<Size>(props.size || new Size(320, 200));

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
    enableAutoResize = true,
    sizingOptions,
    fitContent = false,
    closeOnBackdropClick = true,
  } = props;

  // Calculate optimal size based on content
  createEffect(() => {
    if (enableAutoResize && isOpen) {
      const contentText = `${translateText(title || "")} ${translateText(message || "")} ${translateText(description || "")}`;
      const hasInput = children !== undefined;
      const hasButtons = showOkButton || customButtons !== undefined;
      const hasError = contentText.toLowerCase().includes("error") || contentText.toLowerCase().includes("failed");

      const metrics = DialogSizeCalculator.analyzeContent(
        contentText,
        hasInput,
        hasButtons,
        hasError,
        icon !== undefined,
      );

      const calculatedSize = DialogSizeCalculator.calculateOptimalSize(metrics, sizingOptions);
      const constrainedSize = DialogSizeCalculator.getViewportConstrainedSize(calculatedSize);

      // Use the larger of calculated size or provided size
      const finalSize = new Size(
        Math.max(size.width, constrainedSize.width),
        Math.max(size.height, constrainedSize.height),
      );

      setDynamicSize(finalSize);
    } else {
      setDynamicSize(size);
    }
  });

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleBackdropClick = () => {
    if (closeOnBackdropClick && onClose) {
      onClose();
    }
  };

  // Helper function to translate text if it's a TranslationKey
  const translateText = (text: string | TranslationKeys): string => {
    return Object.values(TranslationKeys).includes(text as TranslationKeys) ? translate(text as TranslationKeys) : text;
  };

  return (
    <Show when={isOpen}>
      {/* Background overlay/dim */}
      <div class="fixed inset-0 z-[99] bg-black bg-opacity-30" onClick={handleBackdropClick} />

      <Modal
        title={translateText(title)}
        size={dynamicSize()}
        draggable={draggable}
        maximizable={false}
        onClose={handleClose}
        closeAriaLabel={closeAriaLabel}
        // Use Window-style classes with higher z-index for dialogs
        class={`shadow-md fixed min-h-40 min-w-60 transform rounded-lg border border-black bg-surface-500 text-white shadow-secondary ${customClass}`}
        headerClass="bg-surface-400 border-b border-black"
        customHeaderButtons={customButtons}
        style={{
          "z-index": 101, // Above the backdrop overlay (z-[99])
          transition: enableAutoResize ? "width 0.2s ease-out, height 0.2s ease-out" : "none",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)", // Center dialog
          margin: 0, // Override auto-margining
          ...(fitContent
            ? {
                width: "fit-content",
                height: "fit-content",
                "max-width": sizingOptions?.maxWidth ? `${sizingOptions.maxWidth}px` : "90vw",
                "max-height": sizingOptions?.maxHeight ? `${sizingOptions.maxHeight}px` : "90vh",
              }
            : {}),
          ...style,
        }}
      >
        <div class="flex h-full flex-col">
          {/* Scrollable Content Area */}
          <div class="flex-grow overflow-y-auto p-4">
            {/* Icon and Message/Children - Left aligned, icon vertically centered */}
            <div class="flex items-start">
              {icon && (
                <div class="mr-3 mt-0.5 flex flex-shrink-0 items-center justify-center">
                  <img
                    src={(() => {
                      // Use string comparison as a fallback in case enum comparison fails
                      const iconStr = String(icon);
                      const folderPlusStr = String(Icons.folderPlus);
                      const filePlusStr = String(Icons.filePlus);
                      const editStr = String(Icons.edit);
                      const trashStr = String(Icons.trash);

                      if (iconStr === folderPlusStr || icon === Icons.folderPlus) return "/icons/folder-plus.svg";
                      if (iconStr === filePlusStr || icon === Icons.filePlus) return "/icons/file-plus.svg";
                      if (iconStr === editStr || icon === Icons.edit) return "/icons/edit.svg";
                      if (iconStr === trashStr || icon === Icons.trash) return "/icons/trash.svg";

                      return "/icons/file.svg"; // Default fallback icon
                    })()}
                    alt="Dialog icon"
                    class="h-6 w-6"
                    style="filter: brightness(0) invert(0.7);" // Makes icon gray (70% brightness)
                  />
                </div>
              )}
              <div class="min-w-0 flex-grow">
                {/* Message text (fallback for simple dialogs) */}
                {message && <p class="mb-3 text-sm leading-relaxed text-gray-200">{translateText(message)}</p>}
                {/* Description text */}
                {description && <p class="mb-3 text-sm leading-relaxed text-gray-200">{translateText(description)}</p>}
                {/* Custom content (children) */}
                {children}
              </div>
            </div>
          </div>

          {/* Fixed Footer with Action Buttons */}
          <div class="flex-shrink-0 border-t border-black bg-surface-500 p-3">
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
