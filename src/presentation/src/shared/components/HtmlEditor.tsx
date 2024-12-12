import { onCleanup, createMemo, createEffect, Index } from "solid-js";
import Button from "./ui/Button";
import Icon from "./Icon";
import Icons from "~/domain/data/Icons";
import HtmlEditorManager, { type FormatType } from "~/core/acore-ts/ui/HtmlEditorManager";
import useI18n from "../utils/i18nTranslate";
import { TranslationKeys } from "~/domain/data/Translations";
import Container from "~/presentation/Container";
import type II18n from "~/core/acore-ts/i18n/abstraction/II18n";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";

export type Props = {
  class?: string;
  inputClass?: string;
  onInput?: (html: string) => void;
  toolbarClass?: string;
};

export default function HtmlEditor(props: Props) {
  const i18n: II18n = Container.instance.i18n;
  const translate = useI18n();

  let editorInstance: HtmlEditorManager | undefined;

  const toolbarButtons = createMemo(() => [
    { icon: Icons.bold, format: "b", label: TranslationKeys.common_bold },
    { icon: Icons.underline, format: "u", label: TranslationKeys.common_underline },
    { icon: Icons.italic, format: "i", label: TranslationKeys.common_italic },
    { icon: Icons.heading1, format: "h1", label: TranslationKeys.common_header1 },
    { icon: Icons.heading2, format: "h2", label: TranslationKeys.common_header2 },
    { icon: Icons.unorderedList, format: "ul", label: TranslationKeys.common_unordered_list },
    { icon: Icons.orderedList, format: "ol", label: TranslationKeys.common_ordered_list },
    { icon: Icons.link, format: "a", label: TranslationKeys.common_hyperlink },
    { icon: Icons.formatClear, format: "", label: TranslationKeys.common_clear_format, clear: true },
  ]);

  function onEditorMount(editorElement: HTMLElement) {
    editorInstance = new HtmlEditorManager(editorElement, onEditorChange);
    editorInstance.attachEventListeners();
    i18n.currentLocale.subscribe(changeEditorUrlPromptText);

    onCleanup(() => {
      if (editorInstance) editorInstance.detachEventListeners();
      i18n.currentLocale.unsubscribe(changeEditorUrlPromptText);
    });
  }

  createEffect(() => {
    changeEditorUrlPromptText();
  });

  function changeEditorUrlPromptText() {
    if (!editorInstance) return;
    editorInstance.urlPromptText = translate(TranslationKeys.apps_email_enter_url);
  }

  function onEditorChange(html: string) {
    if (props.onInput) props.onInput(html);
  }

  return (
    <section class={mergeCls(props.class)}>
      <header class={mergeCls("mb-2 flex border-b border-surface-300 p-2", props.toolbarClass)}>
        <Index each={toolbarButtons()}>
          {(button) => (
            <ToolbarButton
              icon={button().icon}
              onClick={() =>
                button().clear
                  ? editorInstance!.clearFormat()
                  : editorInstance!.formatText(button().format as FormatType)
              }
              ariaLabel={translate(button().label)}
            />
          )}
        </Index>
      </header>
      <div
        class={mergeCls(
          "mt-2 h-64 w-full overflow-y-auto border-black bg-surface-400 p-4 shadow-primary",
          props.inputClass,
        )}
      >
        <article ref={onEditorMount} contentEditable class="size-full p-1 outline-none" />
      </div>
    </section>
  );

  function ToolbarButton(props: { icon: Icons; ariaLabel: string; onClick: () => void }) {
    return (
      <Button variant="text" onClick={props.onClick} size="small" ariaLabel={props.ariaLabel}>
        <Icon icon={props.icon} class="size-4" />
      </Button>
    );
  }
}
