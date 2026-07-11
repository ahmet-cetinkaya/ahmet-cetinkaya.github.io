import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import { pathExists as checkPathExists } from "@application/shared/pathExists";
import { TranslationKeys, type TranslationKey } from "@domain/data/Translations";
import File from "@domain/models/File";
import PathUtils from "@packages/acore-ts/data/path/PathUtils";
import type ICIProgram from "./ICIProgram";
import { ExitCodes, type CommandOutput } from "./ICIProgram";

type BooleanFlagMap = Record<string, string[]>;

export function parseBooleanFlags(args: string[], flagMap: BooleanFlagMap): Record<string, boolean> {
  return Object.entries(flagMap).reduce(
    (acc, [key, values]) => ({
      ...acc,
      [key]: args.some((arg) => values.includes(arg)),
    }),
    {} as Record<string, boolean>,
  );
}

export function filterPositionalArgs(args: string[]): string[] {
  return args.filter((arg) => !arg.startsWith("-"));
}

/**
 * Base class for terminal commands with shared utilities
 */
export default abstract class BaseCommand implements ICIProgram {
  abstract name: string;
  abstract description: TranslationKey;

  protected currentPath: string;

  constructor(
    protected readonly fileSystemService: IFileSystemService,
    currentPath?: string,
  ) {
    this.currentPath = currentPath ?? "/";
  }

  abstract execute(...args: string[]): Promise<CommandOutput>;

  protected createErrorOutput(message: string): CommandOutput {
    return {
      output: `${this.name}: ${message}`,
      exitCode: ExitCodes.GENERAL_ERROR,
    };
  }

  protected createVersionOutput(): CommandOutput {
    return {
      output: `${this.name} version 1.0.0`,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  protected resolveHelpOrVersion<T extends { help: boolean; version: boolean }>(
    flags: T,
    helpOutput: CommandOutput,
  ): CommandOutput | null {
    if (flags.help) return helpOutput;
    if (flags.version) return this.createVersionOutput();
    return null;
  }

  protected normalizePath(currentPath: string, path: string): string {
    return PathUtils.normalize(currentPath, path);
  }

  protected async pathExists(path: string): Promise<boolean> {
    return checkPathExists(this.fileSystemService, path);
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

  protected parseTransferArgs(
    args: string[],
    flagNames: Array<{ names: string[]; type: "boolean" | "value"; key: string }>,
    missingOperandKey: TranslationKeys,
    helpOutput: CommandOutput,
  ): { flags: Record<string, string | boolean>; sources: string[]; destination: string } | { error: CommandOutput } {
    const flags: Record<string, string | boolean> = {};
    for (const def of flagNames) {
      if (def.type === "boolean") flags[def.key] = false;
    }

    const positionalArgs: string[] = [];
    let targetDirectory: string | undefined;

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("-")) {
        let matched = false;
        for (const def of flagNames) {
          if (def.names.includes(arg)) {
            if (def.type === "value") {
              flags[def.key] = args[++i] ?? "";
            } else {
              flags[def.key] = true;
            }
            if (def.key === "targetDirectory") targetDirectory = flags[def.key] as string;
            matched = true;
            break;
          }
        }
        if (!matched && arg !== "-") continue;
      } else {
        positionalArgs.push(arg);
      }
    }

    const sources: string[] = [];
    let destination = "";

    if (targetDirectory) {
      sources.push(...positionalArgs);
      destination = targetDirectory;
    } else {
      for (let i = 0; i < positionalArgs.length; i++) {
        if (i === positionalArgs.length - 1) destination = positionalArgs[i];
        else sources.push(positionalArgs[i]);
      }
    }

    if (flags.help) return { error: helpOutput };
    if (flags.version) return { error: this.createVersionOutput() };
    if (!destination || sources.length === 0) {
      return { error: this.createErrorOutput(`{{${missingOperandKey}}}`) };
    }

    return { flags, sources, destination };
  }

  protected async executeTransfer(
    result: { sources: string[]; destination: string } | { error: CommandOutput },
    handler: (sourceEntry: File, destPath: string) => Promise<boolean>,
  ): Promise<CommandOutput> {
    if ("error" in result) return result.error;

    const transferResult = await this.forEachValidSource(result.sources, result.destination, this.currentPath, handler);
    return transferResult ?? { output: "", exitCode: ExitCodes.SUCCESS };
  }

  protected async forEachValidSource(
    sources: string[],
    destination: string,
    currentPath: string,
    handler: (sourceEntry: File, destPath: string) => Promise<boolean>,
  ): Promise<CommandOutput | null> {
    const messages: string[] = [];

    for (const source of sources) {
      const { sourcePath, destPath, error } = await this.validateSourceAndDestination(source, destination, currentPath);
      if (error) return error;

      const sourceEntry = await this.fileSystemService.get((e) => e.fullPath === sourcePath);
      if (!(sourceEntry instanceof File)) continue;

      const isVerbose = await handler(sourceEntry, destPath);
      if (isVerbose) {
        messages.push(`'${source}' -> '${destination}'`);
      }
    }

    if (messages.length === 0) return null;

    return { output: messages.join("\n"), exitCode: ExitCodes.SUCCESS };
  }

  protected async executeDirectoryCommand(
    directories: string[],
    currentPath: string,
    handler: (path: string, targetPath: string, messages: string[]) => Promise<CommandOutput | null>,
  ): Promise<CommandOutput> {
    const messages: string[] = [];
    for (const path of directories) {
      const targetPath = this.normalizePath(currentPath, path);
      const ownershipError = this.validatePathOwnership(targetPath);
      if (ownershipError) return ownershipError;
      const result = await handler(path, targetPath, messages);
      if (result) return result;
    }
    return { output: messages.join("\n"), exitCode: ExitCodes.SUCCESS };
  }

  protected async runDirectoryCommand<T extends { help: boolean; version: boolean }>(
    args: string[],
    parseArgs: (args: string[]) => { flags: T; directories: string[] },
    helpOutput: CommandOutput,
    createHandler: (
      flags: T,
    ) => (path: string, targetPath: string, messages: string[]) => Promise<CommandOutput | null>,
  ): Promise<CommandOutput> {
    const { flags, directories } = parseArgs(args);
    if (flags.help) return helpOutput;
    if (flags.version) return this.createVersionOutput();
    if (directories.length === 0)
      return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}`);
    return this.executeDirectoryCommand(directories, this.currentPath, createHandler(flags));
  }

  protected async runFileCommand<T extends { help: boolean; version: boolean }>(
    args: string[],
    parseArgs: (args: string[]) => { flags: T; files: string[] },
    helpOutput: CommandOutput,
    run: (flags: T, files: string[]) => Promise<CommandOutput>,
  ): Promise<CommandOutput> {
    const { flags, files } = parseArgs(args);
    const earlyExit = this.resolveHelpOrVersion(flags, helpOutput);
    if (earlyExit) return earlyExit;
    return run(flags, files);
  }
}
