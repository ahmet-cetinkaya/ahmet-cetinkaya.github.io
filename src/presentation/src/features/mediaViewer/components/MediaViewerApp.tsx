import { Match, Show, Switch, createEffect, createMemo, createResource, createSignal } from "solid-js";
import type { JSX } from "solid-js";
import Container from "@presentation/Container";
import { getMediaKindForFileName, type MediaKind } from "@application/features/mediaViewer/services/MediaFileService";
import RemoteContentResolver from "@application/features/system/services/RemoteContentResolver";
import { buildYouTubeEmbedUrl, isYouTubeUrl, parseYouTubeId } from "@application/features/mediaViewer/utils/youtube";
import { extractShortcutUrl } from "@application/features/mediaViewer/utils/mediaShortcut";
import { Apps } from "@domain/data/Apps";
import { RemoteContentType } from "@domain/data/remoteContent/remoteContent";
import { TranslationKeys } from "@domain/data/Translations";
import Icons from "@domain/data/Icons";
import Icon from "@shared/components/Icon";
import { logger } from "@application/shared/logger";
import { useI18n } from "@shared/utils/i18nTranslate";
import { syncWindowTitle } from "@shared/utils/syncWindowTitle";
import ImageViewer from "./ImageViewer";
import MediaPlayer from "./MediaPlayer";

const RAW_URL_PATTERN = /^https?:\/\//i;

export default function MediaViewerApp(props: { filePath?: string; windowId?: string }): JSX.Element {
  const { windowsService, fileSystemService } = Container.instance;
  const remoteContentResolver = new RemoteContentResolver(fileSystemService);
  const translate = useI18n();
  const baseTitle = translate(TranslationKeys.apps_media_viewer);

  const [loadError, setLoadError] = createSignal(false);

  const isRawUrl = createMemo<boolean>(() => Boolean(props.filePath && RAW_URL_PATTERN.test(props.filePath)));

  const fileName = createMemo<string | null>(() => {
    const path = props.filePath;
    if (!path) return null;
    if (isRawUrl()) return path;
    const parts = path.split("/");
    return parts[parts.length - 1] ?? null;
  });

  type ResolvedMedia = { kind: MediaKind | null; src: string };

  // Only these filename-based kinds can hide a `[RemoteContent]` envelope in the seed
  // (a `.mp4` whose real asset is a remote/YouTube URL, or an unclassified library file).
  // Local images/audio never are, so we skip the file read for them.
  function mayWrapRemoteContent(kind: MediaKind | null): boolean {
    return kind === null || kind === "video";
  }

  // Resolves kind + src together so a media element never mounts against the wrong src.
  const [resolvedMedia] = createResource<ResolvedMedia, string>(
    () => props.filePath,
    async (path): Promise<ResolvedMedia> => {
      if (RAW_URL_PATTERN.test(path)) {
        return { kind: "youtube", src: path };
      }

      const parts = path.split("/");
      const name = parts[parts.length - 1] ?? "";
      const fileNameKind = getMediaKindForFileName(name);

      if (mayWrapRemoteContent(fileNameKind)) {
        const remote = await resolveRemoteContent(path);
        if (remote) {
          if (isYouTubeUrl(remote.url)) return { kind: "youtube", src: remote.url };
          if (remote.type === RemoteContentType.VIDEO) return { kind: "video", src: remote.url };
        }
      }

      return { kind: fileNameKind, src: path };
    },
  );

  async function resolveRemoteContent(path: string): Promise<ReturnType<typeof remoteContentResolver.resolveEnvelope>> {
    try {
      return await remoteContentResolver.resolveEnvelope(path);
    } catch (error) {
      logger.error(`Failed to resolve remote content for ${path}:`, error);
      return null;
    }
  }

  const resolvedKind = createMemo<MediaKind | null>(() => resolvedMedia()?.kind ?? null);
  const resolvedSrc = createMemo<string | null>(() => resolvedMedia()?.src ?? null);

  // Resolves the YouTube embed URL from the resolved source (a raw URL prop, a
  // `[RemoteContent]` envelope URL, or a `.url` shortcut file's content). Returns
  // null when the source is not a YouTube URL.
  const [youTubeEmbedUrl] = createResource<string | null, string>(
    () => (resolvedKind() === "youtube" ? (resolvedSrc() ?? undefined) : undefined),
    async (sourcePath) => {
      const sourceUrl = RAW_URL_PATTERN.test(sourcePath) ? sourcePath : await readShortcutUrl(sourcePath);
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
        <Match when={props.filePath && resolvedKind() === "image"}>
          <ImageViewer
            src={resolvedSrc() ?? props.filePath!}
            alt={fileName() ?? ""}
            onError={() => setLoadError(true)}
          />
        </Match>
        <Match when={props.filePath && resolvedKind() === "video"}>
          <MediaPlayer
            src={resolvedSrc() ?? props.filePath!}
            kind="video"
            title={fileName() ?? ""}
            onError={() => setLoadError(true)}
          />
        </Match>
        <Match when={props.filePath && resolvedKind() === "audio"}>
          <MediaPlayer
            src={resolvedSrc() ?? props.filePath!}
            kind="audio"
            title={fileName() ?? ""}
            onError={() => setLoadError(true)}
          />
        </Match>
        <Match when={resolvedKind() === "youtube"}>
          <Show
            when={youTubeEmbedUrl()}
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
            <div class="bg-surface-900 flex size-full items-center justify-center p-4">
              <iframe
                src={youTubeEmbedUrl()!}
                title={fileName() ?? baseTitle}
                class="aspect-video h-auto max-h-full w-full max-w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"
              />
            </div>
          </Show>
        </Match>
        <Match when={props.filePath && resolvedMedia.loading}>
          <CenteredMessage icon={Icons.spinner} message={translate(TranslationKeys.apps_media_viewer_loading)} />
        </Match>
        <Match when={props.filePath && resolvedKind() === null}>
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
