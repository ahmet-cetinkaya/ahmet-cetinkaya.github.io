import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import type ICIProgram from "@application/features/system/commands/abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "@application/features/system/commands/abstraction/ICIProgram";
import createTextEditorWindow from "@application/features/textEditor/utils/createTextEditorWindow";
import { TranslationKeys } from "@domain/data/Translations";

export default class TextEditorCommand implements ICIProgram {
  name = "text-editor";
  description = TranslationKeys.apps_text_editor;

  constructor(private windowService: IWindowsService) {}

  async execute(...args: string[]): Promise<CommandOutput> {
    const appWindow = createTextEditorWindow(args);
    await this.windowService.add(appWindow);
    await this.windowService.active(appWindow);

    return {
      output: "",
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
