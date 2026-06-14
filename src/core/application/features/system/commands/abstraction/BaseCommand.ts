import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import { TranslationKeys } from "@domain/data/Translations";
import PathUtils from "@packages/acore-ts/data/path/PathUtils";
import type ICIProgram from "./ICIProgram";
import { ExitCodes, type CommandOutput } from "./ICIProgram";

/**
 * Base class for terminal commands with shared utilities
 */
export default abstract class BaseCommand implements ICIProgram {
  abstract name: string;
  abstract description: string;

  constructor(protected readonly fileSystemService: IFileSystemService) {}

  abstract execute(...args: string[]): Promise<CommandOutput>;

  protected createErrorOutput(message: string): CommandOutput {
    return {
      output: `${this.name}: ${message}`,
      exitCode: ExitCodes.GENERAL_ERROR,
    };
  }

  protected normalizePath(currentPath: string, path: string): string {
    return PathUtils.normalize(currentPath, path);
  }

  protected async pathExists(path: string): Promise<boolean> {
    if (path === "/") return true;
    const entry = await this.fileSystemService.get((e) => e.fullPath === path);
    return Boolean(entry);
  }

  protected validatePathOwnership(path: string): CommandOutput | null {
    if (path !== "/" && !path.startsWith("/home")) {
      return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${path}`);
    }
    return null;
  }

  protected async validateSourceAndDestination(
    source: string,
    destination: string,
    currentPath: string,
  ): Promise<{ sourcePath: string; destPath: string; error?: CommandOutput }> {
    const sourcePath = this.normalizePath(currentPath, source);
    const destPath = this.normalizePath(currentPath, destination);

    const sourceEntry = await this.fileSystemService.get((e) => e.fullPath === sourcePath);
    if (!sourceEntry) {
      return {
        sourcePath,
        destPath,
        error: this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}: '${source}'`),
      };
    }

    const sourceError = this.validatePathOwnership(sourcePath);
    if (sourceError) return { sourcePath, destPath, error: sourceError };

    const destError = this.validatePathOwnership(destPath);
    if (destError) return { sourcePath, destPath, error: destError };

    return { sourcePath, destPath };
  }
}
