import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import { TranslationKeys } from "@domain/data/Translations";
import File from "@domain/models/File";
import BaseCommand from "./abstraction/BaseCommand";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

type MvFlags = {
  force: boolean;
  targetDirectory?: string;
  noTargetDirectory: boolean;
  verbose: boolean;
  help: boolean;
  version: boolean;
};

export default class MvCommand extends BaseCommand {
  name = "mv";
  description = TranslationKeys.apps_terminal_commands_mv_description;

  constructor(
    fileSystemService: IFileSystemService,
    private currentPath: string,
  ) {
    super(fileSystemService);
  }

  private parseArgs(args: string[]): { flags: MvFlags; sources: string[]; destination: string } {
    const flags: MvFlags = {
      force: false,
      noTargetDirectory: false,
      verbose: false,
      help: false,
      version: false,
    };

    const sources: string[] = [];
    let destination = "";

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("-")) {
        switch (arg) {
          case "-f":
          case "--force":
            flags.force = true;
            break;
          case "-t":
          case "--target-directory":
            flags.targetDirectory = args[++i];
            break;
          case "-T":
          case "--no-target-directory":
            flags.noTargetDirectory = true;
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
        if (i === args.length - 1) destination = arg;
        else sources.push(arg);
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
      return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_mv_missing_operand}}}`);

    for (const source of sources) {
      const { sourcePath, destPath, error } = await this.validateSourceAndDestination(
        source,
        destination,
        this.currentPath,
      );
      if (error) return error;

      const sourceEntry = await this.fileSystemService.get((e) => e.fullPath === sourcePath);
      if (sourceEntry instanceof File) {
        const destFile = await this.fileSystemService.get((e) => e.fullPath === destPath);

        if (destFile && !flags.force) {
          await this.fileSystemService.remove((e) => e.fullPath === destPath);
        }

        const newFile = new File(destPath, sourceEntry.content, sourceEntry.createdDate, sourceEntry.size);
        await this.fileSystemService.add(newFile);
        await this.fileSystemService.remove((e) => e.fullPath === sourcePath);

        if (flags.verbose) return { output: `'${source}' -> '${destination}'`, exitCode: ExitCodes.SUCCESS };
      }
    }

    return { output: "", exitCode: ExitCodes.SUCCESS };
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}:
  mv [{{${TranslationKeys.common_options}}}]... [-T] SOURCE DEST
  mv [{{${TranslationKeys.common_options}}}]... SOURCE... DIRECTORY
  mv [{{${TranslationKeys.common_options}}}]... -t DIRECTORY SOURCE...

{{${TranslationKeys.common_options}}}:
  -f, --force                {{${TranslationKeys.apps_terminal_mv_help_option_force}}}
  -t, --target-directory     {{${TranslationKeys.apps_terminal_mv_help_option_target_directory}}}
  -T, --no-target-directory  {{${TranslationKeys.apps_terminal_mv_help_option_no_target_directory}}}
  -v, --verbose              {{${TranslationKeys.apps_terminal_mv_help_option_verbose}}}
      --help                 {{${TranslationKeys.apps_terminal_mv_help_option_help}}}
      --version              {{${TranslationKeys.apps_terminal_mv_help_option_version}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createVersionOutput(): CommandOutput {
    return { output: "mv version 1.0.0", exitCode: ExitCodes.SUCCESS };
  }
}
