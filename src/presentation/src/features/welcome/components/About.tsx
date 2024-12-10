import { createSignal } from "solid-js";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import { TranslationKeys } from "~/domain/data/Translations";
import MarkdownParagraph from "~/presentation/src/shared/components/MarkdownParagraph";
import Title from "~/presentation/src/shared/components/ui/Title";
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
    <div ref={onContainerMount} class="size-full">
      <Title level={1}>{translate(TranslationKeys.apps_welcome_about_me)}</Title>

      <div
        class="shadow-md max-h-128 overflow-y-auto rounded-lg border border-gray-300 bg-surface-400 p-4"
        style={{ height: `${containerHeight()}px` }}
      >
        <MarkdownParagraph content={translate(TranslationKeys.apps_welcome_about_me_markdown)} />
      </div>

      <div class="mt-4 flex items-center">
        <input id="confirm" type="checkbox" checked={isConfirmed()} onChange={onConfirm} />
        <label
          for="confirm"
          class={mergeCls("text-md ms-2 text-gray-200", {
            "text-red-600": props.isWarnedForConfirm && !isConfirmed(),
          })}
        >
          {translate(TranslationKeys.apps_welcome_about_me_confirm)}
        </label>
      </div>
    </div>
  );
}
