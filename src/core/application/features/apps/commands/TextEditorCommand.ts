import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import type ICIProgram from "@application/features/system/commands/abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "@application/features/system/commands/abstraction/ICIProgram";
import { Apps } from "@domain/data/Apps";
import { TranslationKeys } from "@domain/data/Translations";
import Window from "@domain/models/Window";
import CryptoExtensions from "@packages/acore-ts/crypto/CryptoExtensions";

export default class TextEditorCommand implements ICIProgram {
  name = "text-editor";
  description = TranslationKeys.apps_text_editor;

  constructor(private windowService: IWindowsService) {}

  async execute(...args: string[]): Promise<CommandOutput> {
    const appWindow = new Window(
      CryptoExtensions.generateNanoId(),
      Apps.textEditor,
      TranslationKeys.apps_text_editor,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      args,
    );
    await this.windowService.add(appWindow);
    await this.windowService.active(appWindow);

    return {
      output: "",
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
