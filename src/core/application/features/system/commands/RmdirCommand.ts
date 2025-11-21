import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import { TranslationKeys } from "@domain/data/Translations";
import Directory from "@domain/models/Directory";
import PathUtils from "@packages/acore-ts/data/path/PathUtils";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

type RmdirFlags = {
  ignoreFailOnNonEmpty: boolean;
  parents: boolean;
  verbose: boolean;
  help: boolean;
  version: boolean;
};

export default class RmdirCommand implements ICIProgram {
  name = "rmdir";
  description = TranslationKeys.apps_terminal_commands_rmdir_description;

  constructor(
    private readonly fileSystemService: IFileSystemService,
    private currentPath: string,
  ) {}

  private parseArgs(args: string[]): { flags: RmdirFlags; directories: string[] } {
    const flags: RmdirFlags = {
      ignoreFailOnNonEmpty: false,
      parents: false,
      verbose: false,
      help: false,
      version: false,
    };
    const directories: string[] = [];

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("-")) {
        switch (arg) {
          case "--ignore-fail-on-non-empty":
            flags.ignoreFailOnNonEmpty = true;
            break;
          case "-p":
          case "--parents":
            flags.parents = true;
            break;
          case "-v":
          case "--verbose":
            flags.verbose = true;
            break;
          case "--help":
            flags.help = true;
            break;
          case "--version":
            flags.version = true;
            break;
        }
      } else {
        directories.push(arg);
      }
    }

    return { flags, directories };
  }

  async execute(...args: string[]): Promise<CommandOutput> {
    const { flags, directories } = this.parseArgs(args);

    if (flags.help) return this.createHelpOutput();
    if (flags.version) return { output: "rmdir version 1.0.0", exitCode: ExitCodes.SUCCESS };

    if (directories.length === 0)
      return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}`);

    const messages: string[] = [];

    for (const path of directories) {
      const targetPath = PathUtils.normalize(this.currentPath, path);

      if (targetPath !== "/" && !targetPath.startsWith("/home"))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${path}`);

      const entry = await this.fileSystemService.get((e) => e.fullPath === targetPath);

      if (!entry) return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}`);
      if (!(entry instanceof Directory))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}`);

      const children = await this.fileSystemService.getAll((e) => e.fullPath.startsWith(`${targetPath}/`));
      if (children.length > 0 && !flags.ignoreFailOnNonEmpty) {
        return this.createErrorOutput(
          `${this.name}: {{${TranslationKeys.apps_terminal_rmdir_failed_not_empty}}}: ${path}`,
        );
      }

      if (flags.parents) {
        const parts = targetPath.split("/").filter(Boolean);
        for (let i = parts.length; i > 0; i--) {
          const currentPath = `/${parts.slice(0, i).join("/")}`;
          const hasChildren =
            (await this.fileSystemService.getAll((e) => e.fullPath.startsWith(`${currentPath}/`))).length > 0;

          if (!hasChildren || flags.ignoreFailOnNonEmpty) {
            await this.fileSystemService.remove((e) => e.fullPath === currentPath);
            if (flags.verbose)
              messages.push(
                `${this.name}: {{${TranslationKeys.apps_terminal_rmdir_removing_directory}}} '${currentPath}'`,
              );
          }
        }
      } else {
        await this.fileSystemService.remove((e) => e.fullPath === targetPath);
        if (flags.verbose)
          messages.push(`${this.name}: {{${TranslationKeys.apps_terminal_rmdir_removing_directory}}} '${targetPath}'`);
      }
    }

    return {
      output: messages.join("\n"),
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${TranslationKeys.apps_terminal_rmdir_help_description}}}

{{${TranslationKeys.common_usage}}}:
  rmdir [{{${TranslationKeys.common_options}}}]... <{{${TranslationKeys.common_path}}}>

{{${TranslationKeys.common_options}}}:
      --ignore-fail-on-non-empty  {{${TranslationKeys.apps_terminal_rmdir_help_option_ignore_non_empty}}}
  -p, --parents                   {{${TranslationKeys.apps_terminal_rmdir_help_option_parents}}};
  -v, --verbose                   {{${TranslationKeys.apps_terminal_rmdir_help_option_verbose}}}
      --help                      {{${TranslationKeys.apps_terminal_rmdir_help_option_help}}}
      --version                   {{${TranslationKeys.apps_terminal_rmdir_help_option_version}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createErrorOutput(message: string): CommandOutput {
    return {
      output: `${this.name}: ${message}`,
      exitCode: ExitCodes.GENERAL_ERROR,
    };
  }
}
