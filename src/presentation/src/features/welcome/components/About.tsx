import { createSignal } from "solid-js";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import { TranslationKeys } from "~/domain/data/Translations";
import MarkdownParagraph from "~/presentation/src/shared/components/MarkdownParagraph";
import useI18n from "~/presentation/src/shared/utils/i18nTranslate";

type Props = {
  initialConfirmValue?: boolean;
  isWarnedForConfirm: boolean;
  onConfirm: (value: boolean) => void;
};

export default function About(props: Props) {
  const translate = useI18n();

  const [containerHeight, setContainerHeight] = createSignal(0);
  const [isConfirmed, setIsConfirmed] = createSignal(props.initialConfirmValue ?? false);

  function onContainerMount(element: HTMLDivElement) {
    requestAnimationFrame(() => {
      setContainerHeight(element.clientHeight - 100);
    });
  }

  function onConfirm() {
    setIsConfirmed(!isConfirmed());
    props.onConfirm(isConfirmed());
  }

  return (
    <div ref={onContainerMount} class="size-full px-10">
      <div
        class="overflow-y-auto rounded-lg border border-gray-300 bg-white p-4 shadow-md"
        style={{ height: `${containerHeight()}px` }}
      >
        <MarkdownParagraph content={translate(TranslationKeys.apps_welcome_about_me_markdown)} />
      </div>
      <div class="mt-4 flex items-center">
        <input id="confirm" type="checkbox" value={isConfirmed().toString()} onChange={onConfirm} />
        <label
          for="confirm"
          class={mergeCls("ms-2 text-sm text-gray-700", {
            "text-red-600": props.isWarnedForConfirm && !isConfirmed(),
          })}
        >
          {translate(TranslationKeys.apps_welcome_about_me_confirm)}
        </label>
      </div>
    </div>
  );
}
