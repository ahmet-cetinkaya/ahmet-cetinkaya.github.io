import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import { TranslationKeys } from "@domain/data/Translations";
import File from "@domain/models/File";
import PathUtils from "@packages/acore-ts/data/path/PathUtils";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

type TouchFlags = {
  accessTime: boolean;
  noCreate: boolean;
  date?: string;
  noDereference: boolean;
  modificationTime: boolean;
  reference?: string;
  timestamp?: string;
  time?: "access" | "modify";
  help: boolean;
  version: boolean;
};

export default class TouchCommand implements ICIProgram {
  name = "touch";
  description = TranslationKeys.apps_terminal_commands_touch_description;

  constructor(
    private readonly fileSystemService: IFileSystemService,
    private currentPath: string,
  ) {}

  private parseArgs(args: string[]): { flags: TouchFlags; files: string[] } {
    const flags: TouchFlags = {
      accessTime: false,
      noCreate: false,
      noDereference: false,
      modificationTime: false,
      help: false,
      version: false,
    };
    const files: string[] = [];

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("-")) {
        switch (arg) {
          case "-a":
            flags.accessTime = true;
            break;
          case "-c":
          case "--no-create":
            flags.noCreate = true;
            break;
          case "-d":
          case "--date":
            flags.date = args[++i];
            break;
          case "-h":
          case "--no-dereference":
            flags.noDereference = true;
            break;
          case "-m":
            flags.modificationTime = true;
            break;
          case "-r":
          case "--reference":
            flags.reference = args[++i];
            break;
          case "-t":
            flags.timestamp = args[++i];
            break;
          case "--time": {
            const timeValue = args[++i];
            flags.time =
              timeValue === "access" || timeValue === "atime" || timeValue === "use"
                ? "access"
                : timeValue === "modify" || timeValue === "mtime"
                  ? "modify"
                  : undefined;
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
        files.push(arg);
      }
    }

    return { flags, files };
  }

  async execute(...args: string[]): Promise<CommandOutput> {
    const { flags, files } = this.parseArgs(args);

    if (flags.help) return this.createHelpOutput();
    if (flags.version) return this.createVersionOutput();

    if (files.length === 0) return this.createErrorOutput(`{{${TranslationKeys.common_usage}}}: ${this.name} <path>`);

    let targetDate = new Date();

    if (flags.date) {
      targetDate = new Date(flags.date);
    } else if (flags.timestamp) {
      // Parse timestamp in [[CC]YY]MMDDhhmm[.ss] format
      targetDate = this.parseTimestamp(flags.timestamp);
    } else if (flags.reference) {
      const refPath = PathUtils.normalize(this.currentPath, flags.reference);
      const refFile = await this.fileSystemService.get((e) => e.fullPath === refPath);
      if (!refFile) return this.createErrorOutput(`failed to get attributes of '${flags.reference}': No such file`);
      targetDate = refFile.updatedDate ?? refFile.createdDate;
    }

    for (const path of files) {
      const targetPath = PathUtils.normalize(this.currentPath, path);

      if (targetPath !== "/" && !targetPath.startsWith("/home"))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${path}`);

      const exists = await this.pathExists(targetPath);

      if (!exists) {
        if (flags.noCreate) continue;
        const newFile = new File(targetPath, "", targetDate, 0);
        await this.fileSystemService.add(newFile);
      } else {
        const file = await this.fileSystemService.get((e) => e.fullPath === targetPath);
        if (file instanceof File) {
          file.updatedDate = targetDate;
          await this.fileSystemService.update(file);
        }
      }
    }

    return { output: "", exitCode: ExitCodes.SUCCESS };
  }

  private parseTimestamp(timestamp: string): Date {
    // Basic timestamp parser for [[CC]YY]MMDDhhmm[.ss] format
    const matches = timestamp.match(/^(\d{2}|\d{4})?(\d{2})(\d{2})(\d{2})(\d{2})(\.(\d{2}))?$/);
    if (!matches) throw new Error("Invalid timestamp format");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, yearStr, month, day, hour, minute, __, second] = matches;
    const year = yearStr ? parseInt(yearStr) : new Date().getFullYear();

    return new Date(
      year,
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      second ? parseInt(second) : 0,
    );
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}: 
  touch [{{${TranslationKeys.common_options}}}]... <{{${TranslationKeys.common_file}}}>

{{${TranslationKeys.common_options}}}:
  -a                    {{${TranslationKeys.apps_terminal_touch_help_option_access_time}}}
  -c, --no-create       {{${TranslationKeys.apps_terminal_touch_help_option_no_create}}}
  -d, --date=STRING     {{${TranslationKeys.apps_terminal_touch_help_option_date}}}
  -h, --no-dereference  {{${TranslationKeys.apps_terminal_touch_help_option_no_dereference}}}
  -m                    {{${TranslationKeys.apps_terminal_touch_help_option_modification_time}}}
  -r, --reference=FILE  {{${TranslationKeys.apps_terminal_touch_help_option_reference}}}
  -t STAMP              {{${TranslationKeys.apps_terminal_touch_help_option_timestamp}}}
      --time=WORD       {{${TranslationKeys.apps_terminal_touch_help_option_time}}}:
                         {{${TranslationKeys.apps_terminal_touch_help_option_time_access}}}
                         {{${TranslationKeys.apps_terminal_touch_help_option_time_modification}}}
      --help            {{${TranslationKeys.apps_terminal_touch_help_option_help}}}
      --version         {{${TranslationKeys.apps_terminal_touch_help_option_version}}}`,
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

  private createVersionOutput(): CommandOutput | PromiseLike<CommandOutput> {
    return { output: "touch version 1.0.0", exitCode: ExitCodes.SUCCESS };
  }
}
