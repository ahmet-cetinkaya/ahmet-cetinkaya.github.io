import { Show, createMemo } from "solid-js";
import type { FileSystemEntry } from "@application/features/system/services/abstraction/IFileSystemService";
import Directory from "@domain/models/Directory";
import { getFileIconConfig } from "@application/features/fileExplorer/models/FileIcon";
import Icons from "@domain/data/Icons";
import Icon from "@shared/components/Icon";
import { mergeCls } from "@packages/acore-ts/ui/ClassHelpers";
import { Paths } from "@domain/data/Directories";

type FileIconProps = {
  entry: FileSystemEntry;
  size?: "small" | "medium" | "large";
  class?: string;
};

export default function FileIcon(props: FileIconProps) {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  const isDirectory = createMemo(() => props.entry instanceof Directory);

  const iconConfig = createMemo(() => getFileIconConfig(props.entry.name, isDirectory()));
  const isGitHubEntry = createMemo(
    () =>
      props.entry.fullPath.startsWith(`${Paths.USER_HOME}/Code`) && props.entry.fullPath !== `${Paths.USER_HOME}/Code`,
  );

  return (
    <div class={mergeCls("flex items-center justify-center", sizeClasses[props.size || "medium"], props.class)}>
      <div class="relative">
        <Show
          when={iconConfig().model}
          fallback={
            <Icon
              icon={isDirectory() ? Icons.folder : Icons[iconConfig().icon as keyof typeof Icons] || Icons.file}
              class={mergeCls(sizeClasses[props.size || "medium"], iconConfig().color, "text-primary-500")}
            />
          }
        >
          <Icon
            icon={isDirectory() ? Icons.folder : Icons.file}
            class={mergeCls(sizeClasses[props.size || "medium"], iconConfig().color, "text-primary-500")}
          />
        </Show>

        <Show when={isGitHubEntry()}>
          <div
            class={mergeCls(
              "shadow-sm absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-white p-0.5",
              props.size === "small" ? "h-2.5 w-2.5" : props.size === "large" ? "h-5 w-5" : "h-3.5 w-3.5",
            )}
          >
            <Icon icon={Icons.github} class="h-full w-full text-black" />
          </div>
        </Show>
      </div>
    </div>
  );
}
