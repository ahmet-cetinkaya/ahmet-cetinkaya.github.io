import { createEffect, onCleanup, onMount } from "solid-js";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { xml } from "@codemirror/lang-xml";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { php } from "@codemirror/lang-php";
import { sql } from "@codemirror/lang-sql";
import { go } from "@codemirror/lang-go";
import { yaml } from "@codemirror/lang-yaml";
import { StreamLanguage } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { toml } from "@codemirror/legacy-modes/mode/toml";
import { properties } from "@codemirror/legacy-modes/mode/properties";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";
import { lua } from "@codemirror/legacy-modes/mode/lua";
import { swift } from "@codemirror/legacy-modes/mode/swift";
import { dockerFile } from "@codemirror/legacy-modes/mode/dockerfile";
import { powerShell } from "@codemirror/legacy-modes/mode/powershell";
import { dart, csharp, kotlin, scala } from "@codemirror/legacy-modes/mode/clike";
import { cmake } from "@codemirror/legacy-modes/mode/cmake";
import { groovy } from "@codemirror/legacy-modes/mode/groovy";
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import type { EditorLanguage } from "@application/features/textEditor/services/TextFileService";

type Props = {
  initialContent: string;
  language: EditorLanguage;
  readOnly: boolean;
  onChange: (value: string) => void;
  onSave?: () => void;
};

function languageExtension(language: EditorLanguage): Extension {
  switch (language) {
    case "javascript":
      return javascript();
    case "jsx":
      return javascript({ jsx: true });
    case "typescript":
      return javascript({ typescript: true });
    case "tsx":
      return javascript({ jsx: true, typescript: true });
    case "json":
      return json();
    case "markdown":
      return markdown();
    case "html":
      return html();
    case "css":
      return css();
    case "xml":
      return xml();
    case "python":
      return python();
    case "rust":
      return rust();
    case "cpp":
      return cpp();
    case "c":
      return cpp();
    case "java":
      return java();
    case "php":
      return php();
    case "sql":
      return sql();
    case "go":
      return go();
    case "yaml":
      return yaml();
    case "shell":
      return StreamLanguage.define(shell);
    case "toml":
      return StreamLanguage.define(toml);
    case "ini":
      return StreamLanguage.define(properties);
    case "ruby":
      return StreamLanguage.define(ruby);
    case "lua":
      return StreamLanguage.define(lua);
    case "swift":
      return StreamLanguage.define(swift);
    case "dockerfile":
      return StreamLanguage.define(dockerFile);
    case "powershell":
      return StreamLanguage.define(powerShell);
    case "dart":
      return StreamLanguage.define(dart);
    case "csharp":
      return StreamLanguage.define(csharp);
    case "kotlin":
      return StreamLanguage.define(kotlin);
    case "scala":
      return StreamLanguage.define(scala);
    case "cmake":
      return StreamLanguage.define(cmake);
    case "groovy":
      return StreamLanguage.define(groovy);
    case "plaintext":
    default:
      return [];
  }
}

export default function CodeMirrorEditor(props: Props) {
  let container: HTMLDivElement | undefined;
  let view: EditorView | undefined;
  let editableCompartment: Compartment | undefined;
  let languageCompartment: Compartment | undefined;

  onMount(() => {
    if (!container) return;

    editableCompartment = new Compartment();
    languageCompartment = new Compartment();

    const saveKeymap = keymap.of([
      {
        key: "Mod-s",
        preventDefault: true,
        run: () => {
          props.onSave?.();
          return true;
        },
      },
    ]);

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        props.onChange(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: props.initialContent,
      extensions: [
        lineNumbers({ formatNumber: (n) => String(n) }),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        saveKeymap,
        languageCompartment.of(languageExtension(props.language)),
        vscodeDark,
        EditorView.lineWrapping,
        updateListener,
        editableCompartment.of(EditorState.readOnly.of(props.readOnly)),
        EditorView.theme({
          ".cm-editor": {
            height: "100%",
            display: "flex",
            flexDirection: "row",
          },
          ".cm-scroller": {
            overflow: "auto",
            flex: 1,
          },
          ".cm-content": {
            minWidth: 0,
          },
          ".cm-gutters": {
            backgroundColor: "#1e1e1e",
            color: "#6e7681",
            border: "none",
          },
          ".cm-lineNumbers .cm-gutterElement": {
            minWidth: "30px",
            textAlign: "right",
            paddingRight: "8px",
          },
          ".cm-activeLineGutter": {
            backgroundColor: "#2d2d2d",
            color: "#c9d1d9",
          },
        }),
      ],
    });

    view = new EditorView({ state, parent: container });
  });

  createEffect(() => {
    const nextContent = props.initialContent;
    if (!view) return;

    const currentContent = view.state.doc.toString();
    if (currentContent === nextContent) return;

    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: nextContent },
    });
  });

  createEffect(() => {
    if (!view || !editableCompartment) return;
    view.dispatch({ effects: editableCompartment.reconfigure(EditorState.readOnly.of(props.readOnly)) });
  });

  createEffect(() => {
    if (!view || !languageCompartment) return;
    view.dispatch({ effects: languageCompartment.reconfigure(languageExtension(props.language)) });
  });

  onCleanup(() => {
    view?.destroy();
  });

  return <div ref={container} class="size-full overflow-auto text-sm" />;
}
