import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import type ICIProgram from "@application/features/system/commands/abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "@application/features/system/commands/abstraction/ICIProgram";
import { Apps } from "@domain/data/Apps";
import { TranslationKeys } from "@domain/data/Translations";
import Window from "@domain/models/Window";
import CryptoExtensions from "@packages/acore-ts/crypto/CryptoExtensions";
import type IContainer from "@presentation/Container";

export default class FileExplorerCommand implements ICIProgram {
  name = "files";
  description = TranslationKeys.apps_file_explorer_description;

  constructor(
    private readonly windowService: IWindowsService,
    private readonly container: IContainer,
  ) {}

  async execute(...args: string[]): Promise<CommandOutput> {
    // Parse arguments to get target path
    const targetPath = args[0] || "/home/ac";
    const { i18n } = this.container;

    // Get current locale for translation
    const currentLocale = i18n.currentLocale.value || i18n.getBrowserLocale() || i18n.locales[0] || "en";

    try {
      // Create window for file explorer with translated title
      const appWindow = new Window(
        CryptoExtensions.generateNanoId(),
        Apps.fileExplorer,
        i18n.translate(currentLocale, TranslationKeys.apps_file_explorer_title),
        undefined, // layer
        false, // isMinimized
        false, // isMaximized
        undefined, // position
        undefined, // size
        undefined, // createdDate
        undefined, // updatedDate
        { initialPath: targetPath }, // args
      );

      await this.windowService.add(appWindow);

      return {
        output: `${i18n.translate(currentLocale, TranslationKeys.apps_file_explorer_opening)} ${targetPath}`,
        exitCode: ExitCodes.SUCCESS,
      };
    } catch (error) {
      return {
        output: `${this.name}: ${error instanceof Error ? error.message : i18n.translate(currentLocale, TranslationKeys.common_unknown_error)}`,
        exitCode: ExitCodes.GENERAL_ERROR,
      };
    }
  }
}
