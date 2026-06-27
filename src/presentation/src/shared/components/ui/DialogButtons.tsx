import Button from "./Button";
import { TranslationKeys } from "@domain/data/Translations";
import { useI18n } from "@shared/utils/i18nTranslate";

type DialogButtonsProps = {
  onCancel: () => void;
  onConfirm: () => void;
  cancelButtonText?: string;
  confirmButtonText?: string;
};

export default function DialogButtons(props: DialogButtonsProps) {
  const translate = useI18n();

  const resolveText = (text: string | undefined, fallback: string): string => {
    if (text && Object.values(TranslationKeys).includes(text as TranslationKeys)) {
      return translate(text as TranslationKeys);
    }
    return text || fallback;
  };

  return (
    <div class="flex justify-end space-x-2">
      <Button onClick={props.onCancel} variant="text" size="small" class="px-4 py-2 text-sm" ariaLabel="Cancel">
        {resolveText(props.cancelButtonText, "Cancel")}
      </Button>
      <Button onClick={props.onConfirm} variant="primary" size="small" class="px-4 py-2 text-sm" ariaLabel="Confirm">
        {resolveText(props.confirmButtonText, "OK")}
      </Button>
    </div>
  );
}
