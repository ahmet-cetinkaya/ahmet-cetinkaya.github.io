import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import { TranslationKeys } from "@domain/data/Translations";
import File from "@domain/models/File";
import PathUtils from "@packages/acore-ts/data/path/PathUtils";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

type CpFlags = {
  recursive: boolean;
  force: boolean;
  verbose: boolean;
  targetDirectory?: string;
  noTargetDirectory: boolean;
  help: boolean;
  version: boolean;
};

export default class CpCommand implements ICIProgram {
  name = "cp";
  description = TranslationKeys.apps_terminal_commands_cp_description;

  constructor(
    private readonly fileSystemService: IFileSystemService,
    private currentPath: string,
  ) {}

  private parseArgs(args: string[]): { flags: CpFlags; sources: string[]; destination: string } {
    const flags: CpFlags = {
      recursive: false,
      force: false,
      verbose: false,
      noTargetDirectory: false,
      help: false,
      version: false,
    };

    const sources: string[] = [];
    let destination = "";

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("-")) {
        switch (arg) {
          case "-R":
          case "-r":
          case "--recursive":
            flags.recursive = true;
            break;
          case "-f":
          case "--force":
            flags.force = true;
            break;
          case "-v":
          case "--verbose":
            flags.verbose = true;
            break;
          case "-t":
          case "--target-directory":
            flags.targetDirectory = args[++i];
            break;
          case "-T":
          case "--no-target-directory":
            flags.noTargetDirectory = true;
            break;
          case "--help":
            flags.help = true;
            break;
          case "--version":
            flags.version = true;
            break;
        }
      } else {
        if (i === args.length - 1) {
          destination = arg;
        } else {
          sources.push(arg);
        }
      }
    }

    if (flags.targetDirectory) {
      if (sources.length === 0 && destination) {
        sources.push(destination);
        destination = flags.targetDirectory;
      }
    }

    return { flags, sources, destination };
  }

  async execute(...args: string[]): Promise<CommandOutput> {
    const { flags, sources, destination } = this.parseArgs(args);

    if (flags.help) return this.createHelpOutput();
    if (flags.version) return this.createVersionOutput();

    if (!destination || sources.length === 0)
      return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_cp_missing_operand}}}`);

    for (const source of sources) {
      const sourcePath = PathUtils.normalize(this.currentPath, source);
      const destPath = PathUtils.normalize(this.currentPath, destination);

      const sourceEntry = await this.fileSystemService.get((e) => e.fullPath === sourcePath);
      if (!sourceEntry)
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}: '${source}'`);

      if (sourcePath !== "/" && !sourcePath.startsWith("/home"))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${source}`);

      if (destPath !== "/" && !destPath.startsWith("/home"))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${destination}`);

      if (sourceEntry instanceof File) {
        const newFile = new File(destPath, sourceEntry.content, new Date(), sourceEntry.size);
        await this.fileSystemService.add(newFile);
        if (flags.verbose) return { output: `'${source}' -> '${destination}'`, exitCode: ExitCodes.SUCCESS };
      }
    }

    return { output: "", exitCode: ExitCodes.SUCCESS };
  }

  private createVersionOutput(): CommandOutput | PromiseLike<CommandOutput> {
    return { output: "cp version 1.0.0", exitCode: ExitCodes.SUCCESS };
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}:
  cp [{{${TranslationKeys.common_options}}}]... [-T] {{${TranslationKeys.common_source}}...} {{${TranslationKeys.common_target_directory}}}
  cp [{{${TranslationKeys.common_options}}}]... {{${TranslationKeys.common_source}}...} {{${TranslationKeys.common_target_directory}}}
  cp [{{${TranslationKeys.common_options}}}]... -t {{${TranslationKeys.common_target_directory}}} {{${TranslationKeys.common_source}}...}

{{${TranslationKeys.common_options}}}:
  -R, -r, --recursive        {{${TranslationKeys.apps_terminal_cp_help_option_recursive}}}
  -f, --force                {{${TranslationKeys.apps_terminal_cp_help_option_force}}}
  -t, --target-directory     {{${TranslationKeys.apps_terminal_cp_help_option_target_directory}}}
  -T, --no-target-directory  {{${TranslationKeys.apps_terminal_cp_help_option_no_target_directory}}}
  -v, --verbose              {{${TranslationKeys.apps_terminal_cp_help_option_verbose}}}
      --help                 {{${TranslationKeys.apps_terminal_cp_help_option_help}}}
      --version              {{${TranslationKeys.apps_terminal_cp_help_option_version}}}`,
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
