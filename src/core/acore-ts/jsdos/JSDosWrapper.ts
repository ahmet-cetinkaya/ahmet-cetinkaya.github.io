import "js-dos/dist/js-dos.js";
import type { DosOptions, ImageRendering, RenderAspect, RenderBackend } from "./DosOptions";
import type { DosProps } from "./DosProps";

export type DosFn = (element: HTMLDivElement, options: Partial<DosOptions>) => DosProps;
declare const Dos: DosFn;

/**
 * Wrapper class for JSDos
 */
export default class JSDosWrapper {
  private dos: DosProps;

  /**
   * Creates an instance of JSDosWrapper.
   * @param container - The HTML container element
   * @param options - Partial options for Dos
   */
  constructor(container: HTMLDivElement, options: Partial<DosOptions>) {
    this.dos = Dos(container, options);
  }

  /**
   * Switch player theme
   * @param theme - Theme name
   */
  setTheme(theme: DosOptions["theme"]) {
    this.dos.setTheme(theme);
  }

  /**
   * Change language
   * @param lang - Language code (e.g., en, ru)
   */
  setLang(lang: DosOptions["lang"]) {
    this.dos.setLang(lang);
  }

  /**
   * Change backend
   * @param backend - Backend name (e.g., dosbox, dosboxX)
   */
  setBackend(backend: DosOptions["backend"]) {
    this.dos.setBackend(backend);
  }

  /**
   * Change if backend is locked or not
   * @param locked - Boolean indicating if backend is locked
   */
  setBackendLocked(locked: boolean) {
    this.dos.setBackendLocked(locked);
  }

  /**
   * Select execution mode
   * @param capture - Boolean indicating worker thread mode
   */
  setWorkerThread(capture: DosOptions["workerThread"]) {
    this.dos.setWorkerThread(capture);
  }

  /**
   * Set if mouse is captured or not
   * @param capture - Boolean indicating mouse capture
   */
  setMouseCapture(capture: DosOptions["mouseCapture"]) {
    this.dos.setMouseCapture(capture);
  }

  /**
   * Change IPX backends (networking)
   * @param ipx - Array of IPX backends
   */
  setIpx(ipx: DosOptions["ipx"]) {
    this.dos.setIpx(ipx);
  }

  /**
   * Change IPX backend
   * @param backend - IPX backend as a string
   */
  setIpxBackend(backend: string) {
    this.dos.setIpxBackend(backend);
  }

  /**
   * Change IPX room
   * @param room - IPX room as a string
   */
  setRoom(room: DosOptions["room"]) {
    this.dos.setRoom(room);
  }

  /**
   * Open named sidebar panel
   * @param frame - Name of the sidebar panel
   */
  setFrame(frame: "network") {
    this.dos.setFrame(frame);
  }

  /**
   * Change background image
   * @param background - URL of the background image or null
   */
  setBackground(background: string | null) {
    this.dos.setBackground(background);
  }

  /**
   * Change fullscreen mode
   * @param fullScreen - Boolean to switch fullscreen mode
   */
  setFullScreen(fullScreen: boolean) {
    this.dos.setFullScreen(fullScreen);
  }

  /**
   * Change auto start
   * @param autoStart - Boolean to enable or disable auto start
   */
  setAutoStart(autoStart: boolean) {
    this.dos.setAutoStart(autoStart);
  }

  /**
   * Change kiosk mode
   * @param kiosk - Boolean to enable or disable kiosk mode
   */
  setKiosk(kiosk: boolean) {
    this.dos.setKiosk(kiosk);
  }

  /**
   * Change image rendering
   * @param rendering - Image rendering option
   */
  setImageRendering(rendering: ImageRendering) {
    this.dos.setImageRendering(rendering);
  }

  /**
   * Change render backend (available only before emulation start)
   * @param backend - Render backend option
   */
  setRenderBackend(backend: RenderBackend) {
    this.dos.setRenderBackend(backend);
  }

  /**
   * Change render aspect
   * @param aspect - Render aspect option
   */
  setRenderAspect(aspect: RenderAspect) {
    this.dos.setRenderAspect(aspect);
  }

  /**
   * Show/hide networking button
   * @param noNetworking - Boolean to show or hide networking button
   */
  setNoNetworking(noNetworking: boolean) {
    this.dos.setNoNetworking(noNetworking);
  }

  /**
   * Disable/enable cloud feature
   * @param noCloud - Boolean to disable or enable cloud feature
   */
  setNoCloud(noCloud: boolean) {
    this.dos.setNoCloud(noCloud);
  }

  /**
   * Pause/resume emulation
   * @param pause - Boolean to pause or resume emulation
   */
  setPaused(pause: boolean) {
    this.dos.setPaused(pause);
  }

  /**
   * Set scale of controls
   * @param scaleControls - Number to set scale of controls
   */
  setScaleControls(scaleControls: number) {
    this.dos.setScaleControls(scaleControls);
  }

  /**
   * Set mouse sensitivity
   * @param mouseSensitivity - Number to set mouse sensitivity
   */
  setMouseSensitivity(mouseSensitivity: number) {
    this.dos.setMouseSensitivity(mouseSensitivity);
  }

  /**
   * Show/hide system cursor
   * @param noCursor - Boolean to show or hide system cursor
   */
  setNoCursor(noCursor: boolean) {
    this.dos.setNoCursor(noCursor);
  }

  /**
   * Set virtual keyboard layout
   * @param layout - Array of strings or array of array of strings
   */
  setSoftKeyboardLayout(layout: string[] | string[][][]) {
    this.dos.setSoftKeyboardLayout(layout);
  }

  /**
   * Set virtual keyboard symbols
   * @param symbols - Array of objects mapping keys to symbols
   */
  setSoftKeyboardSymbols(symbols: { [key: string]: string }[]) {
    this.dos.setSoftKeyboardSymbols(symbols);
  }

  /**
   * Set sound volume
   * @param volume - Number to set sound volume (0 to 1)
   */
  setVolume(volume: number) {
    this.dos.setVolume(volume);
  }

  /**
   * Set key to access cloud services
   * @param key - Key as a string or null
   */
  setKey(key: string | null) {
    this.dos.setKey(key);
  }

  /**
   * Trigger to save changes in FS
   * @returns Promise resolving to a boolean indicating success
   */
  save(): Promise<boolean> {
    return this.dos.save();
  }

  /**
   * Kill the emulation (use to stop player)
   * @returns Promise resolving to void
   */
  stop(): Promise<void> {
    return this.dos.stop();
  }

  /**
   * Dispose the JSDosWrapper instance and clean up resources
   */
  dispose() {
    this.dos.stop();
    this.dos = undefined!;
  }
}
