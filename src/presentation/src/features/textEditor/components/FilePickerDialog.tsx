import { For, Show, createEffect, createSignal, on } from "solid-js";
import type { JSX } from "solid-js";
import Directory from "@domain/models/Directory";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import type TextFileService from "@application/features/textEditor/services/TextFileService";
import { Paths } from "@domain/data/Directories";
import { TranslationKeys } from "@domain/data/Translations";
import Icons from "@domain/data/Icons";
import Icon from "@shared/components/Icon";
import Dialog from "@presentation/src/features/desktop/components/Dialog";
import DialogButtons from "@shared/components/ui/DialogButtons";
import Input from "@shared/components/ui/Input";
import Size from "@packages/acore-ts/ui/models/Size";
import { useI18n } from "@shared/utils/i18nTranslate";
import FileIcon from "@presentation/src/features/fileExplorer/components/FileIcon";

export type FilePickerMode = "open" | "save";

type FilePickerDialogProps = {
  isOpen: boolean;
  mode: FilePickerMode;
  initialPath: string;
  textFileService: TextFileService;
  onConfirm: (path: string) => void;
  onCancel: () => void;
};

export default function FilePickerDialog(props: FilePickerDialogProps): JSX.Element {
  const translate = useI18n();

  const [currentPath, setCurrentPath] = createSignal(props.initialPath);
  const [entries, setEntries] = createSignal<FileSystemEntry[]>([]);
  const [selectedFilePath, setSelectedFilePath] = createSignal<string | null>(null);
  const [fileName, setFileName] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  createEffect(
    on(
      () => props.isOpen,
      (isOpen) => {
        if (isOpen) {
          setCurrentPath(props.initialPath);
          setSelectedFilePath(null);
          setFileName("");
          setError(null);
        }
      },
    ),
  );

  createEffect(
    on([() => props.isOpen, currentPath], async ([isOpen, path]) => {
      if (!isOpen) return;
      await loadEntries(path);
    }),
  );

  async function loadEntries(path: string): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const result = await props.textFileService.listDirectory(path, { textOnly: props.mode === "open" });
      setEntries(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  function isDirectory(entry: FileSystemEntry): boolean {
    return entry instanceof Directory;
  }

  function handleEntryClick(entry: FileSystemEntry): void {
    if (isDirectory(entry)) {
      setCurrentPath(entry.fullPath);
      setSelectedFilePath(null);
      return;
    }

    if (props.mode === "open") {
      setSelectedFilePath(entry.fullPath);
    } else {
      setFileName(entry.name);
    }
  }

  function breadcrumbSegments(): { label: string; path: string }[] {
    const path = currentPath();
    const segments = path.split("/").filter(Boolean);
    const crumbs: { label: string; path: string }[] = [{ label: "/", path: Paths.ROOT }];
    let accumulated = "";
    for (const segment of segments) {
      accumulated += `/${segment}`;
      crumbs.push({ label: segment, path: accumulated });
    }
    return crumbs;
  }

  function isWritable(): boolean {
    return props.textFileService.isDirectoryWritable(currentPath());
  }

  function hasValidFileName(): boolean {
    return props.textFileService.isValidFileName(fileName());
  }

  function canConfirm(): boolean {
    if (props.mode === "open") return selectedFilePath() !== null;
    return hasValidFileName() && isWritable();
  }

  function handleConfirm(): void {
    if (!canConfirm()) return;

    if (props.mode === "open") {
      const path = selectedFilePath();
      if (path) props.onConfirm(path);
      return;
    }

    const directory = currentPath() === Paths.ROOT ? "" : currentPath();
    props.onConfirm(`${directory}/${fileName().trim()}`);
  }

  const title = (): string =>
    props.mode === "open"
      ? translate(TranslationKeys.apps_text_editor_open_title)
      : translate(TranslationKeys.apps_text_editor_save_as_title);

  return (
    <Dialog
      title={title()}
      isOpen={props.isOpen}
      onClose={props.onCancel}
      size={new Size(560, 480)}
      draggable={false}
      closeAriaLabel={title()}
      showOkButton={false}
      enableAutoResize={false}
      customButtons={[
        <DialogButtons
          onCancel={props.onCancel}
          onConfirm={handleConfirm}
          cancelButtonText={translate(TranslationKeys.common_cancel)}
          confirmButtonText={
            props.mode === "open"
              ? translate(TranslationKeys.common_open)
              : translate(TranslationKeys.apps_text_editor_save)
          }
        />,
      ]}
    >
      <div class="flex flex-col gap-2">
        <div class="border-surface-300 flex shrink-0 flex-wrap items-center gap-1 border-b pb-2 text-sm">
          <For each={breadcrumbSegments()}>
            {(crumb, index) => (
              <>
                <Show when={index() > 0}>
                  <span class="text-gray-500">/</span>
                </Show>
                <button
                  type="button"
                  class="hover:text-primary-400 rounded px-1 text-gray-300"
                  onClick={() => setCurrentPath(crumb.path)}
                >
                  {crumb.label}
                </button>
              </>
            )}
          </For>
        </div>

        <div
          class="border-surface-300 bg-surface-600 overflow-y-auto rounded border"
          style={{ height: props.mode === "save" ? "13rem" : "18rem" }}
        >
          <Show
            when={!loading()}
            fallback={
              <div class="flex size-full items-center justify-center">
                <Icon icon={Icons.spinner} class="size-6" isSpin />
              </div>
            }
          >
            <Show
              when={entries().length > 0}
              fallback={
                <div class="flex size-full items-center justify-center px-4 text-center text-sm text-gray-400">
                  {props.mode === "open"
                    ? translate(TranslationKeys.apps_text_editor_no_text_files)
                    : translate(TranslationKeys.apps_text_editor_empty_folder)}
                </div>
              }
            >
              <For each={entries()}>
                {(entry) => (
                  <button
                    type="button"
                    class="hover:bg-surface-400 flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm"
                    classList={{ "bg-surface-400": selectedFilePath() === entry.fullPath }}
                    onClick={() => handleEntryClick(entry)}
                    onDblClick={() => !isDirectory(entry) && props.mode === "open" && props.onConfirm(entry.fullPath)}
                  >
                    <FileIcon entry={entry} size="small" />
                    <span class="truncate text-gray-200">{entry.name}</span>
                  </button>
                )}
              </For>
            </Show>
          </Show>
        </div>

        <Show when={props.mode === "save"}>
          <div class="flex shrink-0 flex-col gap-1">
            <label class="text-xs text-gray-400">{translate(TranslationKeys.apps_text_editor_filename)}</label>
            <Input value={fileName()} onInputChange={setFileName} class="w-full" />
            <Show when={!isWritable()}>
              <span class="text-xs text-yellow-400">{translate(TranslationKeys.apps_text_editor_readonly_dir)}</span>
            </Show>
            <Show when={fileName().trim().length > 0 && !hasValidFileName()}>
              <span class="text-xs text-yellow-400">
                {translate(TranslationKeys.apps_text_editor_invalid_filename)}
              </span>
            </Show>
          </div>
        </Show>

        <Show when={error()}>
          <span class="text-xs text-red-400">{error()}</span>
        </Show>
      </div>
    </Dialog>
  );
}
