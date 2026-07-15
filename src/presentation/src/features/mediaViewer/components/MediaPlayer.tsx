import { Show, createMemo, createSignal, onCleanup } from "solid-js";
import type { JSX } from "solid-js";
import { TranslationKeys } from "@domain/data/Translations";
import Icons from "@domain/data/Icons";
import Icon from "@shared/components/Icon";
import Button from "@shared/components/ui/Button";
import { useI18n } from "@shared/utils/i18nTranslate";
import AudioEqualizer from "./AudioEqualizer";

type MediaElement = HTMLVideoElement | HTMLAudioElement;

const DEFAULT_VOLUME = 1;
const SECONDS_PER_MINUTE = 60;

export default function MediaPlayer(props: {
  src: string;
  kind: "video" | "audio";
  title: string;
  onError: () => void;
}): JSX.Element {
  const translate = useI18n();

  const [isPlaying, setIsPlaying] = createSignal(false);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [volume, setVolume] = createSignal(DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = createSignal(false);
  const [audioElement, setAudioElement] = createSignal<HTMLAudioElement | undefined>();

  let mediaRef: MediaElement | undefined;
  let containerRef: HTMLDivElement | undefined;

  function togglePlay(): void {
    if (!mediaRef) return;
    if (mediaRef.paused) {
      void mediaRef.play();
    } else {
      mediaRef.pause();
    }
  }

  function handleSeek(event: InputEvent): void {
    if (!mediaRef) return;
    const value = Number((event.currentTarget as HTMLInputElement).value);
    mediaRef.currentTime = value;
    setCurrentTime(value);
  }

  function handleVolumeChange(event: InputEvent): void {
    if (!mediaRef) return;
    const value = Number((event.currentTarget as HTMLInputElement).value);
    mediaRef.volume = value;
    mediaRef.muted = value === 0;
    setVolume(value);
    setIsMuted(value === 0);
  }

  function toggleMute(): void {
    if (!mediaRef) return;
    const nextMuted = !mediaRef.muted;
    mediaRef.muted = nextMuted;
    setIsMuted(nextMuted);
  }

  function toggleFullscreen(): void {
    const target = props.kind === "video" ? mediaRef : containerRef;
    if (!target) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void target.requestFullscreen();
    }
  }

  function syncPlaybackState(): void {
    if (!mediaRef) return;
    setIsPlaying(!mediaRef.paused);
    setCurrentTime(mediaRef.currentTime);
    setDuration(Number.isFinite(mediaRef.duration) ? mediaRef.duration : 0);
    setVolume(mediaRef.volume);
    setIsMuted(mediaRef.muted);
  }

  onCleanup(() => {
    mediaRef?.pause();
  });

  const progressMax = createMemo<number>(() => (duration() > 0 ? duration() : 0));

  // Shared across both <video> and <audio> since they mirror the same playback lifecycle.
  const mediaEventHandlers = {
    onError: () => props.onError(),
    onLoadedMetadata: syncPlaybackState,
    onTimeUpdate: () => mediaRef && setCurrentTime(mediaRef.currentTime),
    onPlay: () => setIsPlaying(true),
    onPause: () => setIsPlaying(false),
    onVolumeChange: syncPlaybackState,
  };

  return (
    <div ref={containerRef} class="bg-surface-900 flex size-full flex-col">
      <div class="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4">
        <Show
          when={props.kind === "video"}
          fallback={
            <div class="flex size-full flex-col items-stretch gap-3">
              <AudioEqualizer element={audioElement()} isPlaying={isPlaying()} />
              <span class="shrink-0 truncate text-center text-sm text-gray-300">{props.title}</span>
            </div>
          }
        >
          <video
            ref={(el) => (mediaRef = el)}
            src={props.src}
            autoplay
            {...mediaEventHandlers}
            onClick={togglePlay}
            class="max-h-full max-w-full cursor-pointer"
          />
        </Show>
      </div>

      <Show when={props.kind === "audio"}>
        <audio
          ref={(el) => {
            mediaRef = el;
            setAudioElement(el);
          }}
          src={props.src}
          autoplay
          {...mediaEventHandlers}
          class="hidden"
        />
      </Show>

      <MediaControls
        isPlaying={isPlaying()}
        currentTime={currentTime()}
        duration={progressMax()}
        volume={volume()}
        isMuted={isMuted()}
        showFullscreen={props.kind === "video"}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={toggleMute}
        onToggleFullscreen={toggleFullscreen}
        translate={translate}
      />
    </div>
  );
}

function MediaControls(props: {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  showFullscreen: boolean;
  onTogglePlay: () => void;
  onSeek: (event: InputEvent) => void;
  onVolumeChange: (event: InputEvent) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  translate: (key: TranslationKeys) => string;
}): JSX.Element {
  const playLabel = (): string =>
    props.isPlaying
      ? props.translate(TranslationKeys.apps_media_viewer_pause)
      : props.translate(TranslationKeys.apps_media_viewer_play);
  const muteLabel = (): string =>
    props.isMuted
      ? props.translate(TranslationKeys.apps_media_viewer_unmute)
      : props.translate(TranslationKeys.apps_media_viewer_mute);
  const volumeValue = (): number => (props.isMuted ? 0 : props.volume);

  return (
    <div class="border-surface-300 bg-surface-500 flex items-center gap-3 border-t p-3">
      <Button
        variant="primary"
        size="small"
        ariaLabel={playLabel()}
        title={playLabel()}
        onClick={props.onTogglePlay}
        class="w-auto p-2"
      >
        <Icon icon={props.isPlaying ? Icons.pause : Icons.play} class="h-4 w-4 shrink-0" />
      </Button>

      <span class="shrink-0 text-xs text-gray-300 tabular-nums">{formatTime(props.currentTime)}</span>

      <input
        type="range"
        min={0}
        max={props.duration || 0}
        step="any"
        value={props.currentTime}
        onInput={props.onSeek}
        aria-label={props.translate(TranslationKeys.apps_media_viewer_seek)}
        class="accent-primary-500 h-1 flex-1 cursor-pointer"
      />

      <span class="shrink-0 text-xs text-gray-300 tabular-nums">{formatTime(props.duration)}</span>

      <Button
        variant="primary"
        size="small"
        ariaLabel={muteLabel()}
        title={muteLabel()}
        onClick={props.onToggleMute}
        class="w-auto p-2"
      >
        <Icon icon={props.isMuted ? Icons.volumeMute : Icons.volumeHigh} class="h-4 w-4 shrink-0" />
      </Button>

      <input
        type="range"
        min={0}
        max={1}
        step="0.05"
        value={volumeValue()}
        onInput={props.onVolumeChange}
        aria-label={props.translate(TranslationKeys.apps_media_viewer_volume)}
        class="accent-primary-500 h-1 w-20 shrink-0 cursor-pointer"
      />

      <Show when={props.showFullscreen}>
        <Button
          variant="primary"
          size="small"
          ariaLabel={props.translate(TranslationKeys.apps_media_viewer_fullscreen)}
          title={props.translate(TranslationKeys.apps_media_viewer_fullscreen)}
          onClick={props.onToggleFullscreen}
          class="w-auto p-2"
        >
          <Icon icon={Icons.fullscreen} class="h-4 w-4 shrink-0" />
        </Button>
      </Show>
    </div>
  );
}

function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = Math.floor(totalSeconds % SECONDS_PER_MINUTE);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
