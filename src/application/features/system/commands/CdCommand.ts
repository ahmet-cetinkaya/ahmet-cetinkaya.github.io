import type IFileSystemService from "~/application/features/system/services/abstraction/IFileSystemService";
import PathUtils from "~/core/acore-ts/data/path/PathUtils";
import { TranslationKeys } from "~/domain/data/Translations";
import Directory from "~/domain/models/Directory";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

export default class CdCommand implements ICIProgram<string | null> {
  name = "cd";
  description = TranslationKeys.apps_terminal_commands_cd_description;

  constructor(
    private readonly fileSystemService: IFileSystemService,
    private currentPath: string,
  ) {}

  async execute(...args: string[]): Promise<CommandOutput<string | null>> {
    if (args.includes("--help") || args.includes("-h")) return this.createHelpOutput();

    const path = args[0];
    if (!path) return { output: "", exitCode: ExitCodes.SUCCESS, data: this.currentPath };

    const targetPath = PathUtils.normalize(this.currentPath, path);
    if (!(await this.pathExists(targetPath)))
      return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}`);
    if (targetPath !== "/" && !targetPath.startsWith("/home"))
      return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}`);

    const entry = await this.fileSystemService.get((e) => e.fullPath === targetPath);
    if (!(entry instanceof Directory))
      return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}`);

    this.currentPath = targetPath;
    return { output: "", exitCode: ExitCodes.SUCCESS, data: this.currentPath };
  }

  private createHelpOutput(): CommandOutput<string | null> | PromiseLike<CommandOutput<string | null>> {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}:
  ${this.name} <{{${TranslationKeys.common_path}}}>`,
      exitCode: ExitCodes.SUCCESS,
      data: null,
    };
  }

  private async pathExists(path: string): Promise<boolean> {
    if (path === "/") return true;

    const entry = await this.fileSystemService.get((e) => e.fullPath === path);
    return Boolean(entry);
  }

  private createErrorOutput(message: string): CommandOutput<null> {
    return {
      output: `${this.name}: ${message}`,
      exitCode: ExitCodes.GENERAL_ERROR,
      data: null,
    };
  }
}
