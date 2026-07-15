import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import createMediaViewerWindow from "@application/features/mediaViewer/utils/createMediaViewerWindow";
import type ICIProgram from "@application/features/system/commands/abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "@application/features/system/commands/abstraction/ICIProgram";
import { TranslationKeys } from "@domain/data/Translations";

export default class MediaViewerCommand implements ICIProgram {
  name = "media-viewer";
  description = TranslationKeys.apps_media_viewer;

  constructor(private windowService: IWindowsService) {}

  async execute(...args: string[]): Promise<CommandOutput> {
    const appWindow = createMediaViewerWindow(args);
    await this.windowService.add(appWindow);
    await this.windowService.active(appWindow);

    return {
      output: "",
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
