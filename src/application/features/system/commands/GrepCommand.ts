import type IFileSystemService from "~/application/features/system/services/abstraction/IFileSystemService";
import PathUtils from "~/core/acore-ts/data/path/PathUtils";
import { TranslationKeys } from "~/domain/data/Translations";
import File from "~/domain/models/File";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

type GrepFlags = {
  ignoreCase: boolean;
  count: boolean;
  lineNumber: boolean;
  help: boolean;
  version: boolean;
};

export default class GrepCommand implements ICIProgram {
  name = "grep";
  description = TranslationKeys.apps_terminal_commands_grep_description;

  constructor(
    private readonly fileSystemService: IFileSystemService,
    private currentPath: string,
  ) {}

  private parseArgs(args: string[]): { flags: GrepFlags; pattern?: string; files: string[] } {
    const flags: GrepFlags = {
      ignoreCase: false,
      count: false,
      lineNumber: false,
      help: false,
      version: false,
    };

    const files: string[] = [];
    let pattern: string | undefined;

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("-")) {
        switch (arg) {
          case "-i":
          case "--ignore-case":
            flags.ignoreCase = true;
            break;
          case "-c":
          case "--count":
            flags.count = true;
            break;
          case "-n":
          case "--line-number":
            flags.lineNumber = true;
            break;
          case "--help":
            flags.help = true;
            break;
          case "--version":
            flags.version = true;
            break;
        }
      } else {
        if (!pattern) pattern = arg;
        else files.push(arg);
      }
    }

    return { flags, pattern, files };
  }

  async execute(...args: string[]): Promise<CommandOutput> {
    const { flags, pattern, files } = this.parseArgs(args);

    if (flags.help) return this.createHelpOutput();
    if (flags.version) return this.createVersionOutput();

    if (!pattern) return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_grep_missing_pattern}}}`);

    const results: string[] = [];

    for (const filePath of files) {
      const targetPath = PathUtils.normalize(this.currentPath, filePath);

      if (targetPath !== "/" && !targetPath.startsWith("/home"))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${filePath}`);

      const entry = await this.fileSystemService.get((e) => e.fullPath === targetPath);
      if (!entry) return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}`);

      if (entry instanceof File) {
        const lines = entry.content.split("\n");
        const regex = new RegExp(pattern, flags.ignoreCase ? "i" : "");
        const matches = lines.map((line, index) => ({ line, index: index + 1 })).filter(({ line }) => regex.test(line));

        if (flags.count) {
          results.push(`${filePath}:${matches.length}`);
        } else {
          matches.forEach(({ line, index }) => {
            const prefix = files.length > 1 ? `${filePath}:` : "";
            const lineNum = flags.lineNumber ? `${index}:` : "";
            results.push(`${prefix}${lineNum}${line}`);
          });
        }
      }
    }

    return {
      output: results.join("\n"),
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}:
  grep [{{${TranslationKeys.common_options}}}]... <{{${TranslationKeys.common_pattern}}}> [{{${TranslationKeys.common_file}}}]...

{{${TranslationKeys.common_options}}}:
  -i, --ignore-case  {{${TranslationKeys.apps_terminal_grep_help_option_ignore_case}}}
  -c, --count        {{${TranslationKeys.apps_terminal_grep_help_option_count}}}
  -n, --line-number  {{${TranslationKeys.apps_terminal_grep_help_option_line_number}}}
      --help         {{${TranslationKeys.apps_terminal_grep_help_option_help}}}
      --version      {{${TranslationKeys.apps_terminal_grep_help_option_version}}}`,
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
    return { output: "grep version 1.0.0", exitCode: ExitCodes.SUCCESS };
  }
}
