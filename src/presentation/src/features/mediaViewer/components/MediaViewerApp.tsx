import { Match, Show, Switch, createEffect, createMemo, createResource, createSignal } from "solid-js";
import type { JSX } from "solid-js";
import Container from "@presentation/Container";
import { getMediaKindForFileName, type MediaKind } from "@application/features/mediaViewer/services/MediaFileService";
import { buildYouTubeEmbedUrl, parseYouTubeId } from "@application/features/mediaViewer/utils/youtube";
import { extractShortcutUrl, isRawUrl as isRawMediaUrl } from "@application/features/mediaViewer/utils/mediaShortcut";
import { Apps } from "@domain/data/Apps";
import { TranslationKeys } from "@domain/data/Translations";
import Icons from "@domain/data/Icons";
import Icon from "@shared/components/Icon";
import { useI18n } from "@shared/utils/i18nTranslate";
import { syncWindowTitle } from "@shared/utils/syncWindowTitle";
import ImageViewer from "./ImageViewer";
import MediaPlayer from "./MediaPlayer";

export default function MediaViewerApp(props: {
  filePath?: string;
  windowId?: string;
  isVisible: boolean;
}): JSX.Element {
  const { windowsService, fileSystemService } = Container.instance;
  const translate = useI18n();
  const baseTitle = translate(TranslationKeys.apps_media_viewer);

  const [loadError, setLoadError] = createSignal(false);

  const isExternalUrl = createMemo<boolean>(() => Boolean(props.filePath && isRawMediaUrl(props.filePath)));

  const fileName = createMemo<string | null>(() => {
    const path = props.filePath;
    if (!path) return null;
    if (isExternalUrl()) return path;
    const parts = path.split("/");
    return parts[parts.length - 1] ?? null;
  });

  const mediaKind = createMemo<MediaKind | null>(() => {
    if (!props.filePath) return null;
    if (isExternalUrl()) return "youtube";
    const name = fileName();
    return name ? getMediaKindForFileName(name) : null;
  });

  // Resolves the YouTube embed URL from either a raw URL arg or a `.url` shortcut
  // file's content. Returns null when the source is not a YouTube URL.
  const [youTubeEmbedUrl] = createResource<string | null, string>(
    () => (mediaKind() === "youtube" ? props.filePath : undefined),
    async (path) => {
      const sourceUrl = isExternalUrl() ? path : await readShortcutUrl(path);
      const videoId = sourceUrl ? parseYouTubeId(sourceUrl) : null;
      return videoId ? buildYouTubeEmbedUrl(videoId) : null;
    },
  );

  async function readShortcutUrl(path: string): Promise<string | null> {
    try {
      const content = await fileSystemService.readFileContent(path);
      return extractShortcutUrl(content);
    } catch {
      return null;
    }
  }

  createEffect(() => {
    const name = fileName();
    void syncWindowTitle(windowsService, Apps.mediaViewer, props.windowId, name ? `${baseTitle} - ${name}` : baseTitle);
  });

  return (
    <div class="bg-surface-500 flex size-full flex-col overflow-hidden text-gray-200">
      <Switch
        fallback={<CenteredMessage icon={Icons.image} message={translate(TranslationKeys.apps_media_viewer_no_file)} />}
      >
        <Match when={loadError()}>
          <CenteredMessage
            icon={Icons.userForbidden}
            message={translate(TranslationKeys.apps_media_viewer_error)}
            tone="error"
          />
        </Match>
        <Match when={mediaKind() === "image" ? props.filePath : undefined} keyed>
          {(path) => <ImageViewer src={path} alt={fileName() ?? ""} onError={() => setLoadError(true)} />}
        </Match>
        <Match when={mediaKind() === "video" ? props.filePath : undefined} keyed>
          {(path) => (
            <MediaPlayer
              src={path}
              kind="video"
              title={fileName() ?? ""}
              isVisible={props.isVisible}
              onError={() => setLoadError(true)}
            />
          )}
        </Match>
        <Match when={mediaKind() === "audio" ? props.filePath : undefined} keyed>
          {(path) => (
            <MediaPlayer
              src={path}
              kind="audio"
              title={fileName() ?? ""}
              isVisible={props.isVisible}
              onError={() => setLoadError(true)}
            />
          )}
        </Match>
        <Match when={mediaKind() === "youtube"}>
          <Show
            when={youTubeEmbedUrl()}
            keyed
            fallback={
              <Show
                when={!youTubeEmbedUrl.loading}
                fallback={
                  <CenteredMessage
                    icon={Icons.spinner}
                    message={translate(TranslationKeys.apps_media_viewer_loading)}
                  />
                }
              >
                <CenteredMessage
                  icon={Icons.userForbidden}
                  message={translate(TranslationKeys.apps_media_viewer_invalid_url)}
                />
              </Show>
            }
          >
            {(embedUrl) => (
              <div class="bg-surface-900 flex size-full items-center justify-center p-4">
                <iframe
                  src={embedUrl}
                  title={fileName() ?? baseTitle}
                  class="aspect-video h-auto max-h-full w-full max-w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  referrerpolicy="strict-origin-when-cross-origin"
                />
              </div>
            )}
          </Show>
        </Match>
        <Match when={props.filePath && mediaKind() === null}>
          <CenteredMessage
            icon={Icons.userForbidden}
            message={translate(TranslationKeys.apps_media_viewer_unsupported)}
          />
        </Match>
      </Switch>
    </div>
  );
}

function CenteredMessage(props: { icon: Icons; message: string; tone?: "error" }): JSX.Element {
  const iconColor = (): string => (props.tone === "error" ? "text-red-400" : "text-gray-400");
  return (
    <div class="bg-surface-900 flex size-full items-center justify-center text-gray-200">
      <div class="text-center">
        <Icon icon={props.icon} class={`mx-auto mb-2 size-12 ${iconColor()}`} />
        <p class="text-lg font-medium">{props.message}</p>
      </div>
    </div>
  );
}
