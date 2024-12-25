import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import { TranslationKeys } from "~/domain/data/Translations";
import MarkdownParagraph from "~/core/acore-solidjs/ui/components/MarkdownParagraph";
import Title from "~/presentation/src/shared/components/ui/Title";
import { useI18n } from "~/presentation/src/shared/utils/i18nTranslate";

type Props = {
  isConfirmedValue: boolean;
  isWarnedForConfirm: boolean;
  onConfirm: (value: boolean) => void;
};

export default function About(props: Props) {
  const translate = useI18n();

  function onConfirmChange() {
    props.onConfirm(!props.isConfirmedValue);
  }

  return (
    <div class="size-full px-8 py-4">
      <Title level={1}>{translate(TranslationKeys.apps_welcome_about_me)}</Title>

      <div class="shadow-md h-3/4 overflow-y-auto rounded-lg border border-gray-300 bg-surface-400 p-4">
        <MarkdownParagraph content={translate(TranslationKeys.apps_welcome_about_me_markdown)} />
      </div>

      <div class="mt-4 flex items-center">
        <input id="confirm" type="checkbox" checked={props.isConfirmedValue} onChange={onConfirmChange} />
        <label
          for="confirm"
          class={mergeCls("text-md ms-2 text-gray-200", {
            "text-red-600": props.isWarnedForConfirm && !props.isConfirmedValue,
          })}
        >
          {translate(TranslationKeys.apps_welcome_about_me_confirm)}
        </label>
      </div>
    </div>
  );
}
