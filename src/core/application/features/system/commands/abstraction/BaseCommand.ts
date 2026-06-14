import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
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

  protected async pathExists(path: string): Promise<boolean> {
    if (path === "/") return true;
    const entry = await this.fileSystemService.get((e) => e.fullPath === path);
    return Boolean(entry);
  }
}
