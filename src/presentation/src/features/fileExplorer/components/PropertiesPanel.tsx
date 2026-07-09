import { createSignal, onMount, onCleanup } from "solid-js";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import File from "@domain/models/File";
import Directory from "@domain/models/Directory";
import Icon from "@shared/components/Icon";
import Icons from "@domain/data/Icons";
import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";
import ScreenHelper from "@shared/utils/ScreenHelper";
import { formatFileSize, formatDate } from "../utils/formatters";

type PropertiesPanelProps = {
  entry: FileSystemEntry | null;
  onClose: () => void;
  isVisible: boolean;
};

export default function PropertiesPanel(props: PropertiesPanelProps) {
  const [panelPosition, setPanelPosition] = createSignal<"right" | "bottom">("right");

  function getFileType(entry: File): string {
    if (entry.extension) {
      return entry.extension.toUpperCase();
    }
    return "File";
  }

  function checkMobile() {
    const mobile = ScreenHelper.isMobile();
    setPanelPosition(mobile ? "bottom" : "right");
  }

  onMount(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
  });

  onCleanup(() => {
    window.removeEventListener("resize", checkMobile);
  });

  const panelClasses = () =>
    mergeCls(
      "bg-surface-500 shadow-lg overflow-hidden z-50",
      panelPosition() === "right" ? "w-80 h-full" : "w-full h-64",
    );

  if (!props.isVisible || !props.entry) {
    return null;
  }

  const { entry } = props;
  const isFile = entry instanceof File;
  const isDirectory = entry instanceof Directory;

  return (
    <div class={panelClasses()}>
      {/* Header */}
      <div class="bg-surface-600 flex items-center justify-between p-3">
        <div class="flex items-center space-x-2">
          <Icon icon={Icons.properties} class="h-4 w-4 text-gray-300" />
          <h3 class="text-sm font-medium text-gray-200">Properties</h3>
        </div>
        <button
          onClick={props.onClose}
          class="text-gray-400 transition-colors hover:text-gray-200"
          aria-label="Close properties"
        >
          <Icon icon={Icons.close} class="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div class="space-y-4 overflow-y-auto p-4" style="max-height: calc(100% - 60px)">
        {/* File/Folder Icon and Name */}
        <div class="flex items-center space-x-3">
          <div class="bg-surface-400 rounded-lg p-3">
            {isDirectory && <Icon icon={Icons.folder} class="text-primary-500 h-8 w-8" />}
            {isFile && <Icon icon={Icons.file} class="text-primary-500 h-8 w-8" />}
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="truncate text-sm font-medium text-gray-200">{entry.name}</h4>
            <p class="text-xs text-gray-400">{isDirectory ? "Directory" : getFileType(entry as File)}</p>
          </div>
        </div>

        {/* Properties */}
        <div class="space-y-3">
          {/* Type */}
          <div class="flex items-center justify-between py-2">
            <span class="text-xs text-gray-400">Type</span>
            <span class="text-xs text-gray-200">{isDirectory ? "Directory" : getFileType(entry as File)}</span>
          </div>

          {/* Name */}
          <div class="flex items-center justify-between py-2">
            <span class="text-xs text-gray-400">Name</span>
            <span class="max-w-[120px] truncate text-xs text-gray-200" title={entry.name}>
              {entry.name}
            </span>
          </div>

          {/* File-specific properties */}
          {isFile && (
            <>
              {/* Size */}
              <div class="flex items-center justify-between py-2">
                <span class="text-xs text-gray-400">Size</span>
                <span class="text-xs text-gray-200">{formatFileSize((entry as File).size)}</span>
              </div>

              {/* Extension */}
              {(entry as File).extension && (
                <div class="flex items-center justify-between py-2">
                  <span class="text-xs text-gray-400">Extension</span>
                  <span class="text-xs text-gray-200">{(entry as File).extension.toUpperCase()}</span>
                </div>
              )}
            </>
          )}

          {/* Path */}
          <div class="flex items-center justify-between py-2">
            <span class="text-xs text-gray-400">Path</span>
            <span class="max-w-[120px] truncate text-xs text-gray-200" title={entry.fullPath}>
              {entry.fullPath}
            </span>
          </div>

          {/* Directory */}
          {isFile && (
            <div class="flex items-center justify-between py-2">
              <span class="text-xs text-gray-400">Directory</span>
              <span class="max-w-[120px] truncate text-xs text-gray-200" title={(entry as File).directory}>
                {(entry as File).directory || "/"}
              </span>
            </div>
          )}

          {/* Parent */}
          {isDirectory && (
            <div class="flex items-center justify-between py-2">
              <span class="text-xs text-gray-400">Parent</span>
              <span class="max-w-[120px] truncate text-xs text-gray-200" title={(entry as Directory).parent}>
                {(entry as Directory).parent || "Root"}
              </span>
            </div>
          )}

          {/* Created Date */}
          <div class="flex items-center justify-between py-2">
            <span class="text-xs text-gray-400">Created</span>
            <span class="text-xs text-gray-200">{formatDate(entry.createdDate)}</span>
          </div>

          {/* Modified Date */}
          <div class="flex items-center justify-between py-2">
            <span class="text-xs text-gray-400">Modified</span>
            <span class="text-xs text-gray-200">{formatDate(entry.updatedDate || entry.createdDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
