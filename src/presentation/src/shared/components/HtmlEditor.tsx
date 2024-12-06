import { onCleanup } from "solid-js";
import Button from "./ui/Button";
import Icon from "./Icon";
import { Icons } from "~/domain/data/Icons";
import HtmlEditorManager from "~/core/acore-ts/ui/HtmlEditorManager";
import useI18n from "../utils/i18nTranslate";
import { TranslationKeys } from "~/domain/data/Translations";
import { Container } from "~/presentation/Container";
import type II18n from "~/core/acore-ts/i18n/abstraction/II18n";
import { mergeCls } from "~/core/acore-ts/ui/ClassHelpers";

export type Props = {
  inputClass?: string;
  onInput?: (html: string) => void;
};

export default function HtmlEditor(props: Props) {
  const i18n: II18n = Container.instance.i18n;
  let editorInstance: HtmlEditorManager | undefined;
  const translate = useI18n();

  function onEditorMount(editorElement: HTMLElement) {
    editorInstance = new HtmlEditorManager(editorElement, onEditorChange);
    editorInstance.attachEventListeners();
    i18n.currentLocale.subscribe(changeEditorUrlPromptText);

    onCleanup(() => {
      if (editorInstance) editorInstance.detachEventListeners();
      i18n.currentLocale.unsubscribe(changeEditorUrlPromptText);
    });
  }

  function changeEditorUrlPromptText() {
    if (!editorInstance) return;
    editorInstance.urlPromptText = translate(TranslationKeys.apps_email_enter_url);
  }

  function onEditorChange(html: string) {
    if (props.onInput) props.onInput(html);
  }

  return (
    <section>
      <header class="mb-2 flex">
        <ToolbarButton icon={Icons.bold} onClick={() => editorInstance!.formatText("b")} />
        <ToolbarButton icon={Icons.underline} onClick={() => editorInstance!.formatText("u")} />
        <ToolbarButton icon={Icons.italic} onClick={() => editorInstance!.formatText("i")} />
        <ToolbarButton icon={Icons.heading1} onClick={() => editorInstance!.formatText("h1")} />
        <ToolbarButton icon={Icons.heading2} onClick={() => editorInstance!.formatText("h2")} />
        <ToolbarButton icon={Icons.unorderedList} onClick={() => editorInstance!.formatText("ul")} />
        <ToolbarButton icon={Icons.orderedList} onClick={() => editorInstance!.formatText("ol")} />
        <ToolbarButton icon={Icons.link} onClick={() => editorInstance!.formatText("a")} />
        <ToolbarButton icon={Icons.formatClear} onClick={() => editorInstance!.clearFormat()} />
      </header>
      <div class={mergeCls("mt-2 h-48 w-full overflow-y-auto p-4", props.inputClass)}>
        <article ref={onEditorMount} contentEditable class="size-full p-1 outline-none" />
      </div>
    </section>
  );
}

function ToolbarButton(props: { icon: Icons; onClick: () => void }) {
  return (
    <Button variant="text" onClick={props.onClick} size="small">
      <Icon icon={props.icon} class="size-4" />
    </Button>
  );
}
