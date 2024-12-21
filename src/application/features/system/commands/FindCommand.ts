import type IFileSystemService from "~/application/features/system/services/abstraction/IFileSystemService";
import PathUtils from "~/core/acore-ts/data/path/PathUtils";
import { TranslationKeys } from "~/domain/data/Translations";
import Directory from "~/domain/models/Directory";
import File from "~/domain/models/File";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

type FindFlags = {
  name?: string;
  type?: "f" | "d";
  help: boolean;
  version: boolean;
};

export default class FindCommand implements ICIProgram {
  name = "find";
  description = TranslationKeys.apps_terminal_commands_find_description;

  constructor(
    private readonly fileSystemService: IFileSystemService,
    private currentPath: string,
  ) {}

  private parseArgs(args: string[]): { flags: FindFlags; startingPoints: string[] } {
    const flags: FindFlags = {
      help: false,
      version: false,
    };
    const startingPoints: string[] = [];

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("-")) {
        switch (arg) {
          case "-name":
            flags.name = args[++i];
            break;
          case "-type": {
            const type = args[++i];
            if (type === "f" || type === "d") flags.type = type;
            break;
          }
          case "--help":
            flags.help = true;
            break;
          case "--version":
            flags.version = true;
            break;
        }
      } else {
        startingPoints.push(arg);
      }
    }

    if (startingPoints.length === 0) startingPoints.push(".");

    return { flags, startingPoints };
  }

  async execute(...args: string[]): Promise<CommandOutput> {
    const { flags, startingPoints } = this.parseArgs(args);

    if (flags.help) return this.createHelpOutput();
    if (flags.version) return this.createVersionOutput();

    const results: string[] = [];

    for (const point of startingPoints) {
      const startPath = PathUtils.normalize(this.currentPath, point);

      if (startPath !== "/" && !startPath.startsWith("/home"))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${point}`);

      await this.findRecursively(startPath, flags, results);
    }

    return {
      output: results.join("\n"),
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private async findRecursively(path: string, flags: FindFlags, results: string[]): Promise<void> {
    const entries = await this.fileSystemService.getAll((e) => e.fullPath.startsWith(path));

    for (const entry of entries) {
      const isMatch = this.matchesFlags(entry, flags);
      if (isMatch) results.push(entry.fullPath);
    }
  }

  private matchesFlags(entry: File | Directory, flags: FindFlags): boolean {
    if (flags.type) {
      const isDirectory = entry instanceof Directory;
      if (flags.type === "d" && !isDirectory) return false;
      if (flags.type === "f" && isDirectory) return false;
    }

    if (flags.name) {
      const basename = PathUtils.basename(entry.fullPath);
      const pattern = flags.name.replace(/\*/g, ".*").replace(/\?/g, ".");
      const regex = new RegExp(`^${pattern}$`);
      if (!regex.test(basename)) return false;
    }

    return true;
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.apps_terminal_find_help_usage}}}:
  find [path...] [expression]

{{${TranslationKeys.apps_terminal_find_help_options}}}:
  -name pattern  {{${TranslationKeys.apps_terminal_find_help_option_name}}}
  -type c        {{${TranslationKeys.apps_terminal_find_help_option_type}}}
      --help     {{${TranslationKeys.apps_terminal_find_help_option_help}}}
      --version  {{${TranslationKeys.apps_terminal_find_help_option_version}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createErrorOutput(message: string): CommandOutput {
    return {
      output: `${this.name}: ${message}`,
      exitCode: ExitCodes.GENERAL_ERROR,
    };
  }

  private createVersionOutput(): CommandOutput {
    return { output: "find version 1.0.0", exitCode: ExitCodes.SUCCESS };
  }
}
