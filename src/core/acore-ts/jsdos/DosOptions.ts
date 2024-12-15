export type DosEvent = "emu-ready" | "ci-ready" | "bnd-play" | "open-key";
export type ImageRendering = "pixelated" | "smooth";
export type RenderBackend = "webgl" | "canvas";
export type RenderAspect = "AsIs" | "1/1" | "5/4" | "4/3" | "16/10" | "16/9" | "Fit";

export type InitBundleEntry = Uint8Array;
export type InitFileEntry = {
  path: string;
  contents: Uint8Array;
};
export type InitFsEntry = InitBundleEntry | InitFileEntry;
export type InitFs = InitFsEntry | InitFsEntry[];

export type NamedHost = {
  name: string;
  host: string;
};

export type DosOptions = {
  url: string;
  dosboxConf: string;
  jsdosConf: unknown;
  initFs: InitFs;
  background: string;
  pathPrefix: string;
  theme:
    | "light"
    | "dark"
    | "cupcake"
    | "bumblebee"
    | "emerald"
    | "corporate"
    | "synthwave"
    | "retro"
    | "cyberpunk"
    | "valentine"
    | "halloween"
    | "garden"
    | "forest"
    | "aqua"
    | "lofi"
    | "pastel"
    | "fantasy"
    | "wireframe"
    | "black"
    | "luxury"
    | "dracula"
    | "cmyk"
    | "autumn"
    | "business"
    | "acid"
    | "lemonade"
    | "night"
    | "coffee"
    | "winter";
  lang: "ru" | "en";
  backend: "dosbox" | "dosboxX";
  backendLocked: boolean;
  backendHardware: (backend: "dosbox" | "dosboxX", sockdriveNative: boolean) => Promise<string | null>;
  workerThread: boolean;
  mouseCapture: boolean;
  onEvent: (event: DosEvent, ci?: unknown /* CommandInterface */) => void;
  ipx: NamedHost[];
  ipxBackend: string;
  room: string;
  fullScreen: boolean;
  sockdriveBackend: NamedHost;
  autoStart: boolean;
  kiosk: boolean;
  imageRendering: ImageRendering;
  renderBackend: RenderBackend;
  renderAspect: RenderAspect;
  noNetworking: boolean;
  noCloud: boolean;
  scaleControls: number;
  mouseSensitivity: number;
  noCursor: boolean;
  softKeyboardLayout: string[] | string[][][];
  softKeyboardSymbols: { [key: string]: string }[];
  volume: number;
  key: string;
};
