import { createEffect, createSignal, onCleanup } from "solid-js";
import type { JSX } from "solid-js";

const FFT_SIZE = 256;
const BAR_COUNT = 24;
const SEGMENT_COUNT = 16;
const SEGMENT_GAP_RATIO = 0.28;
const BAR_GAP_RATIO = 0.3;
const PEAK_FALL_PER_FRAME = 0.35;
const PEAK_HOLD_FRAMES = 14;

// Winamp-style segment colors keyed by height fraction: green base, amber mid, red top.
const SEGMENT_LOW = "#22e06b";
const SEGMENT_MID = "#f4d03f";
const SEGMENT_HIGH = "#e2402d";
const SEGMENT_MID_THRESHOLD = 0.6;
const SEGMENT_HIGH_THRESHOLD = 0.82;
const SEGMENT_OFF = "rgba(255, 255, 255, 0.05)";
const PEAK_CAP_COLOR = "#f8fafc";

/**
 * Spectrum-analyzer visualizer driven by real FFT data from a Web Audio
 * AnalyserNode tapped off the playing <audio> element (local audio files).
 */
export default function AudioEqualizer(props: {
  element?: HTMLAudioElement;
  isPlaying: boolean;
  isVisible: boolean;
}): JSX.Element {
  let canvasRef: HTMLCanvasElement | undefined;
  let audioContext: AudioContext | undefined;
  let analyser: AnalyserNode | undefined;
  let frequencyBuffer: Uint8Array<ArrayBuffer> | undefined;
  let animationFrame: number | undefined;
  const [isDocumentVisible, setIsDocumentVisible] = createSignal(typeof document === "undefined" || !document.hidden);
  const peaks = new Float32Array(BAR_COUNT);
  const peakHolds = new Int16Array(BAR_COUNT);
  const magnitudes = new Float32Array(BAR_COUNT);

  function ensureGraph(element: HTMLAudioElement): void {
    if (analyser) return;

    const AudioCtor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;

    audioContext = new AudioCtor();
    const mediaSource = audioContext.createMediaElementSource(element);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = 0.8;
    mediaSource.connect(analyser);
    analyser.connect(audioContext.destination);
    frequencyBuffer = new Uint8Array(analyser.frequencyBinCount);
  }

  function canRender(): boolean {
    return props.isPlaying && props.isVisible && isDocumentVisible();
  }

  function startRendering(): void {
    if (animationFrame !== undefined) return;
    animationFrame = requestAnimationFrame(renderFrame);
  }

  function stopRendering(): void {
    if (animationFrame === undefined) return;
    cancelAnimationFrame(animationFrame);
    animationFrame = undefined;
  }

  function renderFrame(): void {
    animationFrame = undefined;
    if (!canRender()) return;
    if (!canvasRef || !analyser || !frequencyBuffer) {
      startRendering();
      return;
    }

    const context = canvasRef.getContext("2d");
    if (!context) {
      startRendering();
      return;
    }

    resizeCanvasToDisplaySize(canvasRef);
    analyser.getByteFrequencyData(frequencyBuffer);
    fillAnalyserMagnitudes(magnitudes, frequencyBuffer);
    drawBars(context, canvasRef, magnitudes, peaks, peakHolds);
    startRendering();
  }

  createEffect(() => {
    if (!canRender()) {
      stopRendering();
      return;
    }

    const { element } = props;
    if (!element) {
      stopRendering();
      return;
    }

    ensureGraph(element);
    if (!analyser) return;

    void audioContext?.resume();
    startRendering();
  });

  function handleVisibilityChange(): void {
    setIsDocumentVisible(!document.hidden);
  }

  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    onCleanup(() => document.removeEventListener("visibilitychange", handleVisibilityChange));
  }

  onCleanup(() => {
    stopRendering();
    void audioContext?.close();
  });

  return (
    <div class="border-surface-300 flex min-h-0 w-full flex-1 items-stretch overflow-hidden rounded border bg-black p-3 shadow-inner">
      <canvas ref={canvasRef} class="size-full" />
    </div>
  );
}

function drawBars(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  magnitudes: Float32Array,
  peaks: Float32Array,
  peakHolds: Int16Array,
): void {
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);

  const barWidth = width / BAR_COUNT;
  const barGap = barWidth * BAR_GAP_RATIO;
  const drawWidth = barWidth - barGap;
  const segmentHeight = height / SEGMENT_COUNT;
  const segmentGap = segmentHeight * SEGMENT_GAP_RATIO;
  const drawSegmentHeight = segmentHeight - segmentGap;

  for (let index = 0; index < BAR_COUNT; index++) {
    const litSegments = Math.round(magnitudes[index] * SEGMENT_COUNT);
    const x = index * barWidth;

    drawColumn(context, x, drawWidth, segmentHeight, drawSegmentHeight, litSegments);
    updateAndDrawPeak(context, { index, x, drawWidth, segmentHeight, litSegments }, peaks, peakHolds);
  }
}

function fillAnalyserMagnitudes(magnitudes: Float32Array, frequencies: Uint8Array): void {
  const binsPerBar = Math.floor(frequencies.length / BAR_COUNT) || 1;
  for (let index = 0; index < BAR_COUNT; index++) {
    magnitudes[index] = averageBin(frequencies, index * binsPerBar, binsPerBar) / 255;
  }
}

function drawColumn(
  context: CanvasRenderingContext2D,
  x: number,
  drawWidth: number,
  segmentHeight: number,
  drawSegmentHeight: number,
  litSegments: number,
): void {
  for (let segment = 0; segment < SEGMENT_COUNT; segment++) {
    const fraction = segment / (SEGMENT_COUNT - 1);
    const isLit = segment < litSegments;
    context.fillStyle = isLit ? segmentColor(fraction) : SEGMENT_OFF;
    const y = (SEGMENT_COUNT - 1 - segment) * segmentHeight;
    context.fillRect(x, y, drawWidth, drawSegmentHeight);
  }
}

type PeakColumn = { index: number; x: number; drawWidth: number; segmentHeight: number; litSegments: number };

function updateAndDrawPeak(
  context: CanvasRenderingContext2D,
  column: PeakColumn,
  peaks: Float32Array,
  peakHolds: Int16Array,
): void {
  const { index, x, drawWidth, segmentHeight, litSegments } = column;

  if (litSegments >= peaks[index]) {
    peaks[index] = litSegments;
    peakHolds[index] = PEAK_HOLD_FRAMES;
  } else if (peakHolds[index] > 0) {
    peakHolds[index]--;
  } else {
    peaks[index] = Math.max(0, peaks[index] - PEAK_FALL_PER_FRAME);
  }

  const peakSegment = Math.max(0, Math.round(peaks[index]) - 1);
  const y = (SEGMENT_COUNT - 1 - peakSegment) * segmentHeight;
  context.fillStyle = PEAK_CAP_COLOR;
  context.fillRect(x, y, drawWidth, Math.max(2, segmentHeight * 0.18));
}

function segmentColor(fraction: number): string {
  if (fraction >= SEGMENT_HIGH_THRESHOLD) return SEGMENT_HIGH;
  if (fraction >= SEGMENT_MID_THRESHOLD) return SEGMENT_MID;
  return SEGMENT_LOW;
}

function averageBin(frequencies: Uint8Array, start: number, count: number): number {
  let total = 0;
  for (let offset = 0; offset < count; offset++) total += frequencies[start + offset] ?? 0;
  return total / count;
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): void {
  const { clientWidth, clientHeight } = canvas;
  if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
    canvas.width = clientWidth;
    canvas.height = clientHeight;
  }
}
