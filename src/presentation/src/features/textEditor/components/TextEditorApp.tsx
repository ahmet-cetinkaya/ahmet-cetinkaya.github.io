import { For, Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import Container from "@presentation/Container";
import type { EditorLanguage } from "@application/features/textEditor/services/TextFileService";
import TextFileService from "@application/features/textEditor/services/TextFileService";
import { Apps } from "@domain/data/Apps";
import { TranslationKeys, type TranslationKey } from "@domain/data/Translations";
import Icons from "@domain/data/Icons";
import Icon from "@shared/components/Icon";
import Button from "@shared/components/ui/Button";
import ConfirmDialog from "@shared/components/ui/ConfirmDialog";
import { useI18n } from "@shared/utils/i18nTranslate";
import { Paths } from "@domain/data/Directories";
import CodeMirrorEditor from "./CodeMirrorEditor";
import FilePickerDialog, { type FilePickerMode } from "./FilePickerDialog";

export default function TextEditorApp(props: {
  filePath?: string;
  readOnly?: boolean;
  windowId?: string;
}): JSX.Element {
  const { fileSystemService, windowsService } = Container.instance;
  const textFileService = new TextFileService(fileSystemService);
  const translate = useI18n();
  const baseTitle = translate(TranslationKeys.apps_text_editor);
  const forcedReadOnly = props.readOnly ?? false;

  const [filePath, setFilePath] = createSignal<string | null>(props.filePath ?? null);
  const [content, setContent] = createSignal("");
  const [savedContent, setSavedContent] = createSignal("");
  const [language, setLanguage] = createSignal<EditorLanguage>("plaintext");
  const [isDirty, setIsDirty] = createSignal(false);
  const [readOnly, setReadOnly] = createSignal(props.readOnly ?? false);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [isSaving, setIsSaving] = createSignal(false);
  const [saveError, setSaveError] = createSignal<string | null>(null);
  const [pendingDiscardAction, setPendingDiscardAction] = createSignal<(() => Promise<void>) | null>(null);
  const [pickerMode, setPickerMode] = createSignal<FilePickerMode | null>(null);
  const [pickerInitialPath, setPickerInitialPath] = createSignal<string>(Paths.USER_HOME);
  const [showLabels, setShowLabels] = createSignal(false);

  const WIDE_TOOLBAR_THRESHOLD = 520;
  const SAVE_ERROR_TIMEOUT_MS = 5000;
  let toolbarRef: HTMLDivElement | undefined;
  let saveErrorTimer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => {
    if (saveErrorTimer) clearTimeout(saveErrorTimer);
  });

  onMount(async () => {
    if (toolbarRef) {
      const observer = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width ?? 0;
        setShowLabels(width >= WIDE_TOOLBAR_THRESHOLD);
      });
      observer.observe(toolbarRef);
      onCleanup(() => observer.disconnect());
    }

    const initialPath = props.filePath;
    if (initialPath) {
      await loadFile(initialPath);
    }
  });

  async function loadFile(path: string): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const entry = await fileSystemService.get((e) => e.fullPath === path);
      if (!entry) {
        throw new Error(`File not found: ${path}`);
      }

      const fileContent = await textFileService.readContent(path);
      const detectedLanguage = textFileService.getLanguageForExtension(entry.name);
      const isFileReadOnly = forcedReadOnly || textFileService.isReadOnly(path);

      setContent(fileContent);
      setSavedContent(fileContent);
      setLanguage(detectedLanguage);
      setFilePath(path);
      setReadOnly(isFileReadOnly);
      setIsDirty(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleNew(): Promise<void> {
    if (isDirty()) {
      setPendingDiscardAction(() => resetEditor);
      return;
    }

    await resetEditor();
  }

  async function resetEditor(): Promise<void> {
    setFilePath(null);
    setContent("");
    setSavedContent("");
    setLanguage("plaintext");
    setIsDirty(false);
    setReadOnly(false);
    setError(null);
    setSaveError(null);
  }

  async function handleOpen(): Promise<void> {
    if (isDirty()) {
      setPendingDiscardAction(() => openFilePicker);
      return;
    }

    await openFilePicker();
  }

  async function openFilePicker(): Promise<void> {
    setPickerInitialPath(currentDirectory());
    setPickerMode("open");
  }

  function currentDirectory(): string {
    const path = filePath();
    if (!path) return Paths.USER_HOME;
    const parentPath = path.slice(0, path.lastIndexOf("/"));
    return parentPath || Paths.USER_HOME;
  }

  async function handlePickerConfirm(path: string): Promise<void> {
    const mode = pickerMode();
    setPickerMode(null);

    if (mode === "open") {
      await loadFile(path);
      return;
    }

    await saveAsPath(path);
  }

  function handlePickerCancel(): void {
    setPickerMode(null);
  }

  async function runSave(operation: () => Promise<void>): Promise<void> {
    setIsSaving(true);
    setSaveError(null);

    try {
      await operation();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setSaveError(errorMessage);
      if (saveErrorTimer) clearTimeout(saveErrorTimer);
      saveErrorTimer = setTimeout(() => setSaveError(null), SAVE_ERROR_TIMEOUT_MS);
    } finally {
      setIsSaving(false);
    }
  }

  async function saveAsPath(path: string): Promise<void> {
    if (isSaving()) return;

    await runSave(async () => {
      const directoryPath = path.slice(0, path.lastIndexOf("/")) || Paths.USER_HOME;
      const fileName = path.slice(path.lastIndexOf("/") + 1);
      const newPath = await textFileService.saveToDirectory(directoryPath, fileName, content());
      setFilePath(newPath);
      setSavedContent(content());
      setIsDirty(false);
      setLanguage(textFileService.getLanguageForExtension(fileName));
      setReadOnly(textFileService.isReadOnly(newPath));
    });
  }

  async function handleConfirmDiscard(): Promise<void> {
    const action = pendingDiscardAction();
    setPendingDiscardAction(null);
    await action?.();
  }

  function handleCancelDiscard(): void {
    setPendingDiscardAction(null);
  }

  async function handleSave(): Promise<void> {
    const path = filePath();
    if (!path || readOnly() || isSaving()) return;

    await runSave(async () => {
      await textFileService.saveContent(path, content());
      setSavedContent(content());
      setIsDirty(false);
    });
  }

  async function handleSaveAs(): Promise<void> {
    if (isSaving()) return;
    setPickerInitialPath(currentDirectory());
    setPickerMode("save");
  }

  function handleContentChange(value: string): void {
    setContent(value);
    setIsDirty(value !== savedContent());
  }

  function getDisplayName(): string {
    const path = filePath();
    if (!path) return translate(TranslationKeys.apps_text_editor_untitled);
    const parts = path.split("/");
    return parts[parts.length - 1] ?? translate(TranslationKeys.apps_text_editor_untitled);
  }

  createEffect(() => {
    const name = getDisplayName();
    const dirtyMark = isDirty() && !readOnly() ? "● " : "";
    void syncWindowTitle(`${dirtyMark}${baseTitle} - ${name}`);
  });

  async function syncWindowTitle(title: string): Promise<void> {
    const appWindow = props.windowId
      ? await windowsService.get((w) => w.id === props.windowId)
      : await windowsService.get((w) => w.appId === Apps.textEditor);
    if (!appWindow || appWindow.title === title) return;
    appWindow.title = title as TranslationKey;
    await windowsService.update(appWindow);
  }

  type ToolbarButton = {
    icon: Icons;
    label: string;
    shortcut: string;
    action: () => void;
    disabled?: boolean;
  };

  const toolbarButtons = (): ToolbarButton[] => [
    {
      icon: Icons.filePlus,
      label: translate(TranslationKeys.apps_text_editor_new),
      shortcut: "Ctrl+N",
      action: handleNew,
    },
    {
      icon: Icons.open,
      label: translate(TranslationKeys.common_open),
      shortcut: "Ctrl+O",
      action: handleOpen,
    },
    {
      icon: Icons.file,
      label: translate(TranslationKeys.apps_text_editor_save),
      shortcut: "Ctrl+S",
      action: handleSave,
      disabled: !filePath() || readOnly() || !isDirty() || isSaving(),
    },
    {
      icon: Icons.copy,
      label: translate(TranslationKeys.apps_text_editor_save_as),
      shortcut: "Ctrl+Shift+S",
      action: handleSaveAs,
      disabled: isSaving(),
    },
  ];

  return (
    <>
      <div class="bg-surface-500 flex size-full flex-col overflow-hidden text-gray-200">
        <ConfirmDialog
          isOpen={pendingDiscardAction() !== null}
          title={translate(TranslationKeys.apps_text_editor)}
          message={translate(TranslationKeys.apps_text_editor_confirm_discard)}
          type="warning"
          confirmButtonText={translate(TranslationKeys.common_ok)}
          cancelButtonText={translate(TranslationKeys.common_cancel)}
          onConfirm={handleConfirmDiscard}
          onCancel={handleCancelDiscard}
        />

        <Show when={pickerMode() !== null}>
          <FilePickerDialog
            isOpen={pickerMode() !== null}
            mode={pickerMode()!}
            initialPath={pickerInitialPath()}
            textFileService={textFileService}
            onConfirm={handlePickerConfirm}
            onCancel={handlePickerCancel}
          />
        </Show>

        <div ref={toolbarRef} class="border-surface-300 bg-surface-500 relative flex items-center border-b p-2">
          <div class="flex items-center space-x-1">
            <For each={toolbarButtons()}>
              {(btn) => (
                <Button
                  variant="primary"
                  size="small"
                  ariaLabel={`${btn.label} (${btn.shortcut})`}
                  title={`${btn.label} (${btn.shortcut})`}
                  onClick={btn.action}
                  disabled={btn.disabled}
                  class="w-auto p-2"
                >
                  <span class="flex items-center gap-1.5 whitespace-nowrap">
                    <Icon icon={btn.icon} class="h-4 w-4 shrink-0" />
                    <Show when={showLabels()}>
                      <span>{btn.label}</span>
                    </Show>
                  </span>
                </Button>
              )}
            </For>
          </div>

          {/* Status */}
          <div class="mx-4 flex flex-1 items-center gap-2 overflow-hidden text-sm">
            <Show when={loading()}>
              <Icon icon={Icons.spinner} class="size-3 shrink-0" isSpin />
            </Show>
            <Show when={readOnly() && !loading()}>
              <span class="bg-surface-300 shrink-0 rounded px-2 py-0.5 text-xs">
                {translate(TranslationKeys.apps_text_editor_readonly)}
              </span>
            </Show>
            <Show when={isDirty() && !readOnly() && !loading()}>
              <span class="shrink-0 text-yellow-400" title={translate(TranslationKeys.apps_text_editor_unsaved)}>
                ●
              </span>
            </Show>
          </div>
        </div>

        <Show
          when={!error()}
          fallback={
            <div class="bg-surface-900 flex size-full items-center justify-center text-gray-200">
              <div class="text-center">
                <Icon icon={Icons.userForbidden} class="mx-auto mb-2 size-12 text-red-400" />
                <p class="text-lg font-medium">{error()}</p>
                <Button
                  ariaLabel={translate(TranslationKeys.apps_text_editor_new)}
                  variant="primary"
                  size="small"
                  class="mt-4"
                  onClick={handleNew}
                >
                  {translate(TranslationKeys.apps_text_editor_new)}
                </Button>
              </div>
            </div>
          }
        >
          <Show
            when={!loading()}
            fallback={
              <div class="bg-surface-900 flex size-full items-center justify-center text-gray-200">
                <Icon icon={Icons.spinner} class="size-8" isSpin />
              </div>
            }
          >
            <CodeMirrorEditor
              initialContent={content()}
              language={language()}
              readOnly={readOnly()}
              onChange={handleContentChange}
              onSave={handleSave}
            />
          </Show>
        </Show>

        <Show when={saveError()}>
          <div class="border-t border-red-900 bg-red-950 px-4 py-2 text-red-200">
            <div class="flex items-center gap-2">
              <Icon icon={Icons.x} class="size-4" />
              <span>{translate(TranslationKeys.apps_text_editor_save_error)}</span>
              <span class="text-sm text-red-300">({saveError()})</span>
            </div>
          </div>
        </Show>
      </div>
    </>
  );
}
