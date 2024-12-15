import type { DosOptions, ImageRendering, RenderAspect, RenderBackend } from "./DosOptions";

export type DosProps = {
  setTheme(theme: DosOptions["theme"]): void;
  setLang(lang: DosOptions["lang"]): void;
  setBackend(backend: DosOptions["backend"]): void;
  setBackendLocked(locked: boolean): void;
  setWorkerThread(capture: DosOptions["workerThread"]): void;
  setMouseCapture(capture: DosOptions["mouseCapture"]): void;
  setIpx(ipx: DosOptions["ipx"]): void;
  setIpxBackend(backend: string): void;
  setRoom(room: DosOptions["room"]): void;
  setFrame(frame: "network"): void;
  setBackground(background: string | null): void;
  setFullScreen(fullScreen: boolean): void;
  setAutoStart(autoStart: boolean): void;
  setKiosk(kiosk: boolean): void;
  setImageRendering(rendering: ImageRendering): void;
  setRenderBackend(backend: RenderBackend): void;
  setRenderAspect(aspect: RenderAspect): void;
  setNoNetworking(noNetworking: boolean): void;
  setNoCloud(noCloud: boolean): void;
  setPaused(pause: boolean): void;
  setScaleControls(scaleControls: number): void;
  setMouseSensitivity(mouseSensitivity: number): void;
  setNoCursor(noCursor: boolean): void;
  setSoftKeyboardLayout(layout: string[] | string[][][]): void;
  setSoftKeyboardSymbols(symbols: { [key: string]: string }[]): void;
  setVolume(volume: number): void;
  setKey(key: string | null): void;

  save(): Promise<boolean>;
  stop(): Promise<void>;
};
