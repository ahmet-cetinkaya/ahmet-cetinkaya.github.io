import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import { TranslationKeys } from "@domain/data/Translations";
import PathUtils from "@packages/acore-ts/data/path/PathUtils";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

type CommandFlags = {
  force: boolean;
  recursive: boolean;
  verbose: boolean;
  preserveRoot: boolean;
  help: boolean;
  version: boolean;
};

export default class RmCommand implements ICIProgram {
  name = "rm";
  description = TranslationKeys.apps_terminal_commands_rm_description;

  private readonly PROTECTED_PATHS = ["/"];
  private readonly ALLOWED_PATH_PREFIXES = ["/home"];
  private verboseMessages: string[] = [];

  constructor(
    private readonly fileSystemService: IFileSystemService,
    private currentPath: string,
  ) {}

  private parseArgs(args: string[]): { flags: CommandFlags; paths: string[] } {
    const flagMap = {
      force: ["-f", "--force"],
      recursive: ["-r", "-R", "--recursive"],
      verbose: ["-v", "--verbose"],
      help: ["-h", "--help"],
    };

    const flags = Object.entries(flagMap).reduce(
      (acc, [key, values]) => ({
        ...acc,
        [key]: args.some((arg) => values.includes(arg)),
      }),
      {
        preserveRoot: !args.includes("--no-preserve-root") || args.includes("--preserve-root"),
        version: args.includes("--version"),
      } as CommandFlags,
    );

    return {
      flags,
      paths: args.filter((arg) => !arg.startsWith("-")),
    };
  }

  async execute(...args: string[]): Promise<CommandOutput> {
    this.verboseMessages = [];
    const { flags, paths } = this.parseArgs(args);

    if (flags.help) return this.createHelpOutput();
    if (flags.version) return this.createVersionOutput();
    if (paths.length === 0) return this.createErrorOutput(`{{${TranslationKeys.common_usage}}}: ${this.name} <path>`);

    for (const path of paths) {
      const validatedPath = await this.validatePath(path, flags);
      if (typeof validatedPath === "string") {
        if (validatedPath.startsWith("{{")) return this.createErrorOutput(validatedPath);
        await this.removePath(validatedPath, flags);
      }
    }

    return {
      output: flags.verbose ? this.verboseMessages.join("\n") : "",
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private logVerbose(message: string): void {
    this.verboseMessages.push(message);
  }

  private async validatePath(path: string, flags: CommandFlags): Promise<string | null> {
    const targetPath = PathUtils.normalize(this.currentPath, path);

    if (!(await this.pathExists(targetPath)))
      return flags.force ? null : `{{${TranslationKeys.apps_terminal_common_path_required}}}`;

    if (
      (flags.preserveRoot && this.PROTECTED_PATHS.includes(targetPath)) ||
      (!this.ALLOWED_PATH_PREFIXES.some((prefix) => targetPath.startsWith(prefix)) &&
        !this.PROTECTED_PATHS.includes(targetPath))
    )
      return `{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${path}`;

    return targetPath;
  }

  private async removePath(path: string, flags: CommandFlags): Promise<void> {
    if (flags.recursive) {
      await this.removeDirectory(path, flags.verbose);
    } else {
      await this.fileSystemService.remove((e) => e.fullPath === path);
      if (flags.verbose) this.logVerbose(`removed ${path}`);
    }
  }

  private async removeDirectory(path: string, verbose: boolean): Promise<void> {
    const entries = await this.fileSystemService.getAll((e) => e.fullPath.startsWith(path));
    await Promise.all(
      entries.map(async (entry) => {
        await this.fileSystemService.remove((e) => e.fullPath === entry.fullPath);
        if (verbose) this.logVerbose(`removed ${entry.fullPath}`);
      }),
    );
  }

  private async pathExists(path: string): Promise<boolean> {
    if (this.PROTECTED_PATHS.includes(path)) return true;

    const entry = await this.fileSystemService.get((e) => e.fullPath === path);
    return Boolean(entry);
  }

  private createHelpOutput(): CommandOutput {
    const helpText = `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}: 
  ${this.name} [{{${TranslationKeys.common_options}}}]... [{{${TranslationKeys.common_file}}}]...

{{${TranslationKeys.common_options}}}
  -f, --force           {{${TranslationKeys.apps_terminal_rm_help_option_force}}}
  -r, -R, --recursive   {{${TranslationKeys.apps_terminal_rm_help_option_recursive}}}
  -v, --verbose         {{${TranslationKeys.apps_terminal_rm_help_option_verbose}}}
    --no-preserve-root  {{${TranslationKeys.apps_terminal_rm_help_option_no_preserve_root}}}
    --preserve-root     {{${TranslationKeys.apps_terminal_rm_help_option_preserve_root}}}
  -h, --help            {{${TranslationKeys.apps_terminal_rm_help_option_help}}}
  --version             {{${TranslationKeys.apps_terminal_rm_help_option_version}}}`;

    return {
      output: helpText,
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
    return {
      output: `${this.name} version 1.0.0`,
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
