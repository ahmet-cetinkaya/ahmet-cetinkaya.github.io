import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import type ICIProgram from "@application/features/system/commands/abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "@application/features/system/commands/abstraction/ICIProgram";
import type { IFileSystemService } from "@application/features/system/services/abstraction/IFileSystemService";
import { Apps } from "@domain/data/Apps";
import { TranslationKeys } from "@domain/data/Translations";
import Window from "@domain/models/Window";
import CryptoExtensions from "@packages/acore-ts/crypto/CryptoExtensions";
import type IContainer from "@presentation/Container";

export default class FileExplorerCommand implements ICIProgram {
  name = "files";
  description = TranslationKeys.apps_file_explorer_description;

  constructor(
    private readonly fileSystemService: IFileSystemService,
    private readonly windowService: IWindowsService,
    private readonly container: IContainer,
  ) {}

  async execute(...args: string[]): Promise<CommandOutput> {
    try {
      const targetPath = args[0] || "/home/ac";

      const pathExists = await this.pathExists(targetPath);
      if (!pathExists) {
        const { i18n } = this.container;
        const currentLocale = i18n.currentLocale.value || i18n.getBrowserLocale() || i18n.locales[0] || "en";
        return {
          output: `${this.name}: ${i18n.translate(currentLocale, TranslationKeys.apps_terminal_common_path_required)}: ${targetPath}`,
          exitCode: ExitCodes.GENERAL_ERROR,
        };
      }

      const { i18n } = this.container;
      const currentLocale = i18n.currentLocale.value || i18n.getBrowserLocale() || i18n.locales[0] || "en";

      const appWindow = new Window(
        CryptoExtensions.generateNanoId(),
        Apps.fileExplorer,
        i18n.translate(currentLocale, TranslationKeys.apps_file_explorer_title),
        undefined,
        false,
        false,
        undefined,
        undefined,
        undefined,
        undefined,
        { initialPath: targetPath },
      );

      await this.windowService.add(appWindow);

      return {
        output: `${i18n.translate(currentLocale, TranslationKeys.apps_file_explorer_opening)} ${targetPath}`,
        exitCode: ExitCodes.SUCCESS,
      };
    } catch (error) {
      const { i18n } = this.container;
      const currentLocale = i18n.currentLocale.value || i18n.getBrowserLocale() || i18n.locales[0] || "en";
      return {
        output: `${this.name}: ${error instanceof Error ? error.message : i18n.translate(currentLocale, TranslationKeys.common_unknown_error)}`,
        exitCode: ExitCodes.GENERAL_ERROR,
      };
    }
  }

  private async pathExists(path: string): Promise<boolean> {
    if (path === "/") return true;

    const entry = await this.fileSystemService.get((e) => e.fullPath === path);
    return Boolean(entry);
  }
}
