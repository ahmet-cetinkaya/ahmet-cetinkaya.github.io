import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import { TranslationKeys } from "@domain/data/Translations";
import Directory from "@domain/models/Directory";
import PathUtils from "@packages/acore-ts/data/path/PathUtils";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

type MkdirFlags = {
  mode?: string;
  parents: boolean;
  verbose: boolean;
  help: boolean;
  version: boolean;
};

export default class MkdirCommand implements ICIProgram {
  name = "mkdir";
  description = TranslationKeys.apps_terminal_commands_mkdir_description;

  constructor(
    private readonly fileSystemService: IFileSystemService,
    private currentPath: string,
  ) {}

  private parseArgs(args: string[]): { flags: MkdirFlags; directories: string[] } {
    const flags: MkdirFlags = {
      mode: undefined,
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
          case "-m":
          case "--mode":
            flags.mode = args[++i];
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
    if (flags.version) return { output: "mkdir version 1.0.0", exitCode: ExitCodes.SUCCESS };

    if (directories.length === 0)
      return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}`);

    const messages: string[] = [];

    for (const path of directories) {
      const targetPath = PathUtils.normalize(this.currentPath, path);

      if (targetPath !== "/" && !targetPath.startsWith("/home"))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${path}`);

      if (await this.pathExists(targetPath)) {
        if (!flags.parents)
          return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_mkdir_dir_exists}}}: ${path}`);
        continue;
      }

      if (flags.parents) {
        const parts = targetPath.split("/").filter(Boolean);
        let currentPath = "";

        for (const part of parts) {
          currentPath += `/${part}`;
          if (!(await this.pathExists(currentPath))) {
            const newDir = new Directory(currentPath, new Date());
            await this.fileSystemService.add(newDir);
            if (flags.verbose)
              messages.push(`mkdir: {{${TranslationKeys.apps_terminal_mkdir_created_directory}}} '${currentPath}'`);
          }
        }
      } else {
        const newDirectory = new Directory(targetPath, new Date());
        await this.fileSystemService.add(newDirectory);
        if (flags.verbose)
          messages.push(`mkdir: {{${TranslationKeys.apps_terminal_mkdir_created_directory}}} '${targetPath}'`);
      }
    }

    return {
      output: messages.join("\n"),
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${TranslationKeys.apps_terminal_mkdir_help_description}}}

{{${TranslationKeys.common_usage}}}: 
  mkdir [{{${TranslationKeys.common_options}}}]... <{{${TranslationKeys.common_path}}}>

{{${TranslationKeys.common_options}}}:
  -m, --mode=MODE  {{${TranslationKeys.apps_terminal_mkdir_help_option_mode}}}
  -p, --parents    {{${TranslationKeys.apps_terminal_mkdir_help_option_parents}}}
  -v, --verbose    {{${TranslationKeys.apps_terminal_mkdir_help_option_verbose}}}
      --help       {{${TranslationKeys.apps_terminal_mkdir_help_option_help}}}
      --version    {{${TranslationKeys.apps_terminal_mkdir_help_option_version}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private async pathExists(path: string): Promise<boolean> {
    if (path === "/") return true;

    const entry = await this.fileSystemService.get((e) => e.fullPath === path);
    return Boolean(entry);
  }

  private createErrorOutput(message: string): CommandOutput {
    return {
      output: `${this.name}: ${message}`,
      exitCode: ExitCodes.GENERAL_ERROR,
    };
  }
}
