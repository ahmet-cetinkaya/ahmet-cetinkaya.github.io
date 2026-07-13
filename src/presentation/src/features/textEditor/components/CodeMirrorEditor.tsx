import { createEffect, on, onCleanup, onMount } from "solid-js";
import { StreamLanguage } from "@codemirror/language";
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

async function languageExtension(language: EditorLanguage): Promise<Extension> {
  switch (language) {
    case "javascript": {
      const { javascript } = await import("@codemirror/lang-javascript");
      return javascript();
    }
    case "jsx": {
      const { javascript } = await import("@codemirror/lang-javascript");
      return javascript({ jsx: true });
    }
    case "typescript": {
      const { javascript } = await import("@codemirror/lang-javascript");
      return javascript({ typescript: true });
    }
    case "tsx": {
      const { javascript } = await import("@codemirror/lang-javascript");
      return javascript({ jsx: true, typescript: true });
    }
    case "json": {
      const { json } = await import("@codemirror/lang-json");
      return json();
    }
    case "markdown": {
      const { markdown } = await import("@codemirror/lang-markdown");
      return markdown();
    }
    case "html": {
      const { html } = await import("@codemirror/lang-html");
      return html();
    }
    case "css": {
      const { css } = await import("@codemirror/lang-css");
      return css();
    }
    case "xml": {
      const { xml } = await import("@codemirror/lang-xml");
      return xml();
    }
    case "python": {
      const { python } = await import("@codemirror/lang-python");
      return python();
    }
    case "rust": {
      const { rust } = await import("@codemirror/lang-rust");
      return rust();
    }
    case "cpp":
    case "c": {
      const { cpp } = await import("@codemirror/lang-cpp");
      return cpp();
    }
    case "java": {
      const { java } = await import("@codemirror/lang-java");
      return java();
    }
    case "php": {
      const { php } = await import("@codemirror/lang-php");
      return php();
    }
    case "sql": {
      const { sql } = await import("@codemirror/lang-sql");
      return sql();
    }
    case "go": {
      const { go } = await import("@codemirror/lang-go");
      return go();
    }
    case "yaml": {
      const { yaml } = await import("@codemirror/lang-yaml");
      return yaml();
    }
    case "shell": {
      const { shell } = await import("@codemirror/legacy-modes/mode/shell");
      return StreamLanguage.define(shell);
    }
    case "toml": {
      const { toml } = await import("@codemirror/legacy-modes/mode/toml");
      return StreamLanguage.define(toml);
    }
    case "ini": {
      const { properties } = await import("@codemirror/legacy-modes/mode/properties");
      return StreamLanguage.define(properties);
    }
    case "ruby": {
      const { ruby } = await import("@codemirror/legacy-modes/mode/ruby");
      return StreamLanguage.define(ruby);
    }
    case "lua": {
      const { lua } = await import("@codemirror/legacy-modes/mode/lua");
      return StreamLanguage.define(lua);
    }
    case "swift": {
      const { swift } = await import("@codemirror/legacy-modes/mode/swift");
      return StreamLanguage.define(swift);
    }
    case "dockerfile": {
      const { dockerFile } = await import("@codemirror/legacy-modes/mode/dockerfile");
      return StreamLanguage.define(dockerFile);
    }
    case "powershell": {
      const { powerShell } = await import("@codemirror/legacy-modes/mode/powershell");
      return StreamLanguage.define(powerShell);
    }
    case "dart": {
      const { dart } = await import("@codemirror/legacy-modes/mode/clike");
      return StreamLanguage.define(dart);
    }
    case "csharp": {
      const { csharp } = await import("@codemirror/legacy-modes/mode/clike");
      return StreamLanguage.define(csharp);
    }
    case "kotlin": {
      const { kotlin } = await import("@codemirror/legacy-modes/mode/clike");
      return StreamLanguage.define(kotlin);
    }
    case "scala": {
      const { scala } = await import("@codemirror/legacy-modes/mode/clike");
      return StreamLanguage.define(scala);
    }
    case "cmake": {
      const { cmake } = await import("@codemirror/legacy-modes/mode/cmake");
      return StreamLanguage.define(cmake);
    }
    case "groovy": {
      const { groovy } = await import("@codemirror/legacy-modes/mode/groovy");
      return StreamLanguage.define(groovy);
    }
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
  let latestLanguageToken = 0;

  async function applyLanguage(language: EditorLanguage): Promise<void> {
    const token = ++latestLanguageToken;
    const extension = await languageExtension(language);
    // Bail if the view was destroyed or a newer language request superseded this one.
    if (!view || !languageCompartment || token !== latestLanguageToken) return;
    view.dispatch({ effects: languageCompartment.reconfigure(extension) });
  }

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
        languageCompartment.of([]),
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
    void applyLanguage(props.language);
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

  createEffect(
    on(
      () => props.language,
      (language) => {
        void applyLanguage(language);
      },
      { defer: true },
    ),
  );

  onCleanup(() => {
    view?.destroy();
  });

  return <div ref={container} class="size-full overflow-auto text-sm" />;
}
