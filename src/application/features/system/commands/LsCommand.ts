import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import { TranslationKeys } from "@domain/data/Translations";
import Directory from "@domain/models/Directory";
import File from "@domain/models/File";
import OutputHelper from "@packages/acore-ts/data/output/OutputHelper";
import PathUtils from "@packages/acore-ts/data/path/PathUtils";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

type LsFlags = {
  all: boolean;
  almostAll: boolean;
  recursive: boolean;
  longFormat: boolean;
  reverseOrder: boolean;
  sortBySize: boolean;
  sortByTime: boolean;
  humanReadable: boolean;
  help: boolean;
  version: boolean;
};

export default class LsCommand implements ICIProgram {
  name = "ls";
  description = TranslationKeys.apps_terminal_commands_ls_description;

  constructor(
    private readonly fileSystemService: IFileSystemService,
    private currentPath: string,
  ) {}

  private parseArgs(args: string[]): { flags: LsFlags; files: string[] } {
    const flagMap = {
      all: ["-a", "--all"],
      almostAll: ["-A", "--almost-all"],
      recursive: ["-R", "--recursive"],
      longFormat: ["-l"],
      reverseOrder: ["-r", "--reverse"],
      sortBySize: ["-S"],
      sortByTime: ["-t"],
      humanReadable: ["-h", "--human-readable"],
      help: ["--help"],
      version: ["--version"],
    };

    const flags = Object.entries(flagMap).reduce(
      (acc, [key, values]) => ({
        ...acc,
        [key]: args.some((arg) => values.includes(arg)),
      }),
      {} as LsFlags,
    );

    return {
      flags,
      files: args.filter((arg) => !arg.startsWith("-")),
    };
  }

  async execute(...args: string[]): Promise<CommandOutput> {
    const { flags, files } = this.parseArgs(args);

    if (flags.help) return this.createHelpOutput();
    if (flags.version) return { output: "ls 1.0.0", exitCode: ExitCodes.SUCCESS };

    try {
      const path = files[0] || this.currentPath;
      const targetPath = PathUtils.normalize(this.currentPath, path);
      if (!(await this.pathExists(targetPath)))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}`);
      if (targetPath !== "/" && !targetPath.startsWith("/home"))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${path}`);

      let entries = await this.fileSystemService.getAll((e) => {
        if (targetPath === "/") {
          const pathParts = e.fullPath.split("/");
          return pathParts.length === 2; // Direct children of root
        }
        const pathParts = e.fullPath.split("/");
        return (
          e.fullPath.startsWith(targetPath) &&
          (flags.recursive ? true : pathParts.length === targetPath.split("/").length + 1)
        );
      });

      entries = this.sortEntries(entries, flags);

      const formattedEntries = await Promise.all(entries.map((entry) => this.formatDirectoryEntry(entry, flags)));

      return {
        output: this.formatLsOutput(
          formattedEntries.filter((e): e is NonNullable<typeof e> => e !== null),
          flags,
        ),
        exitCode: ExitCodes.SUCCESS,
      };
    } catch (error) {
      return this.createErrorOutput(
        error instanceof Error ? error.message : `{{${TranslationKeys.common_unknown_error}}}`,
      );
    }
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}: 
  ls [{{${TranslationKeys.common_options}}}]... [{{${TranslationKeys.common_path}}}]

{{${TranslationKeys.common_options}}}:
  -a, --all             {{${TranslationKeys.apps_terminal_ls_help_option_all}}}
  -R, --recursive       {{${TranslationKeys.apps_terminal_ls_help_option_recursive}}}
  -l                    {{${TranslationKeys.apps_terminal_ls_help_option_long_format}}}
  -S                    {{${TranslationKeys.apps_terminal_ls_help_option_sort_by_size}}}
  -t                    {{${TranslationKeys.apps_terminal_ls_help_option_sort_by_time}}}
  -h, --human-readable  {{${TranslationKeys.apps_terminal_ls_help_option_human_readable}}}
  --help                {{${TranslationKeys.apps_terminal_ls_help_option_help}}}
  --version             {{${TranslationKeys.apps_terminal_ls_help_option_version}}}`,
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

  private async formatDirectoryEntry(entry: Directory | File, options: LsFlags) {
    if (!options.all && entry.name.startsWith(".")) return null;
    const isDirectory = entry instanceof Directory;
    return {
      permissions: isDirectory ? "drwxr-x---" : ".rw-r--r--",
      size: isDirectory ? "-" : this.formatSize(entry.size, options.humanReadable),
      user: "ac",
      modifiedDate: (entry.updatedDate ?? entry.createdDate).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      name: isDirectory ? `📁 ${entry.name || "/"}` : `📄 ${entry.name}`,
    };
  }

  private formatSize(size: number, humanReadable: boolean): string {
    if (!humanReadable) return size.toString();

    const units = ["B", "K", "M", "G", "T"];
    let unitIndex = 0;
    let value = size;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${Math.round(value)}${units[unitIndex]}`;
  }

  private sortEntries(entries: Array<Directory | File>, flags: LsFlags): Array<Directory | File> {
    const sorted = [...entries];

    if (flags.sortBySize) {
      sorted.sort((a, b) => {
        if (a instanceof Directory && b instanceof File) return -1;
        if (a instanceof File && b instanceof Directory) return 1;
        if (a instanceof File && b instanceof File) return b.size - a.size;
        return a.name.localeCompare(b.name);
      });
    } else if (flags.sortByTime) {
      sorted.sort((a, b) => {
        const aTime = a.updatedDate ?? a.createdDate;
        const bTime = b.updatedDate ?? b.createdDate;
        return bTime.getTime() - aTime.getTime();
      });
    } else {
      sorted.sort((a, b) => {
        if (a instanceof Directory && b instanceof File) return -1;
        if (a instanceof File && b instanceof Directory) return 1;
        return a.name.localeCompare(b.name);
      });
    }

    if (flags.reverseOrder) {
      sorted.reverse();
    }

    return sorted;
  }

  private formatLsOutput(
    entries: Array<{
      permissions: string;
      size: string;
      user: string;
      modifiedDate: string;
      name: string;
    }>,
    flags: LsFlags,
  ): string {
    if (entries.length === 0) return "";
    if (!flags.longFormat) return entries.map((entry) => entry.name).join("  ");

    const columns = [
      { header: "Permissions", getValue: (entry: (typeof entries)[0]) => entry.permissions },
      { header: "Size", getValue: (entry: (typeof entries)[0]) => entry.size },
      { header: "User", getValue: (entry: (typeof entries)[0]) => entry.user },
      { header: "Date Modified", getValue: (entry: (typeof entries)[0]) => entry.modifiedDate },
      { header: "Name", getValue: (entry: (typeof entries)[0]) => entry.name },
    ];

    return OutputHelper.formatTable(entries, columns);
  }
}
