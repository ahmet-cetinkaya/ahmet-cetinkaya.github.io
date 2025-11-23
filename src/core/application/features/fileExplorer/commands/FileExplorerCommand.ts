import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import type ICIProgram from "@application/features/system/commands/abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "@application/features/system/commands/abstraction/ICIProgram";
import type { IFileSystemService } from "@application/features/system/services/abstraction/IFileSystemService";
import { Apps } from "@domain/data/Apps";
import { TranslationKeys } from "@domain/data/Translations";
import Window from "@domain/models/Window";
import CryptoExtensions from "@packages/acore-ts/crypto/CryptoExtensions";

export default class FileExplorerCommand implements ICIProgram {
  name = "files";
  description = TranslationKeys.apps_file_explorer_description;

  constructor(
    private readonly fileSystemService: IFileSystemService,
    private readonly windowService: IWindowsService,
    private currentPath: string,
  ) {}

  async execute(...args: string[]): Promise<CommandOutput> {
    try {
      // Parse arguments to get target path
      const targetPath = args[0] || this.currentPath;

      // Validate path exists
      const pathExists = await this.pathExists(targetPath);
      if (!pathExists) {
        return {
          output: `${this.name}: {{${TranslationKeys.apps_terminal_common_path_required}}}: ${targetPath}`,
          exitCode: ExitCodes.GENERAL_ERROR,
        };
      }

      // Create window for file explorer
      const appWindow = new Window(
        CryptoExtensions.generateNanoId(),
        Apps.fileExplorer,
        `{{${TranslationKeys.apps_file_explorer_title}}} - ${targetPath}`,
        800,
        600,
        undefined, // maximized
        true, // resizable
        true, // minimizable
        true, // maximizable
        { initialPath: targetPath }, // args
      );

      await this.windowService.add(appWindow);

      return {
        output: `{{${TranslationKeys.apps_file_explorer_opening}}} ${targetPath}`,
        exitCode: ExitCodes.SUCCESS,
      };
    } catch (error) {
      return {
        output: `${this.name}: ${error instanceof Error ? error.message : `{{${TranslationKeys.common_unknown_error}}}`}`,
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
