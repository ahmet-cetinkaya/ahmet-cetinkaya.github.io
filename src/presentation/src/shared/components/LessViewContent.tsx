import { createSignal, Show } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";
import useI18n from "../utils/i18nTranslate";
import Button from "./ui/Button";
import { TranslationKeys } from "~/domain/data/Translations";

type Props = {
  children: JSX.Element;
  containerClass?: string;
  heightLimit?: number;
};

const DEFAULT_HEIGHT_LIMIT = 200;

export default function LessViewContent(props: Props) {
  const translate = useI18n();

  const [expanded, setExpanded] = createSignal(false);
  const [contentHeight, setContentHeight] = createSignal(0);

  function onContentMount(el: HTMLDivElement) {
    requestAnimationFrame(() => setContentHeight(el.scrollHeight));
  }

  function isContentOverflowing() {
    const limit = props.heightLimit || DEFAULT_HEIGHT_LIMIT;
    return contentHeight() > limit;
  }

  return (
    <div class={mergeCls("relative", props.containerClass)}>
      <div
        ref={onContentMount}
        class={mergeCls("relative overflow-hidden transition-all duration-500 ease-in-out", {
          "max-h-full": expanded(),
        })}
        style={{
          "max-height": expanded()
            ? "none"
            : props.heightLimit
              ? `${props.heightLimit}px`
              : `${DEFAULT_HEIGHT_LIMIT}px`,
        }}
      >
        {props.children}

        <Show when={!expanded() && isContentOverflowing()}>
          <div class="pointer-events-none absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-white to-transparent" />
        </Show>
      </div>

      <Show when={!expanded() && isContentOverflowing()}>
        <Button onClick={() => setExpanded(true)} class="mt-2" variant="text">
          {translate(TranslationKeys.common_show_more)}
        </Button>
      </Show>
    </div>
  );
}
