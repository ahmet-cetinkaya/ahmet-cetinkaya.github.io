import type IFileSystemService from "~/application/features/system/services/abstraction/IFileSystemService";
import PathUtils from "~/core/acore-ts/data/path/PathUtils";
import { TranslationKeys } from "~/domain/data/Translations";
import File from "~/domain/models/File";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

type CatFlags = {
  showAll: boolean;
  numberNonBlank: boolean;
  showEnds: boolean;
  number: boolean;
  squeezeBlank: boolean;
  showTabs: boolean;
  showNonPrinting: boolean;
  help: boolean;
  version: boolean;
};

export default class CatCommand implements ICIProgram {
  name = "cat";
  description = TranslationKeys.apps_terminal_commands_cat_description;

  constructor(
    private readonly fileSystemService: IFileSystemService,
    private currentPath: string,
  ) {}

  private parseArgs(args: string[]): { flags: CatFlags; files: string[] } {
    const flagMap = {
      showAll: ["-A", "--show-all"],
      numberNonBlank: ["-b", "--number-nonblank"],
      showEnds: ["-E", "--show-ends", "-e"],
      number: ["-n", "--number"],
      squeezeBlank: ["-s", "--squeeze-blank"],
      showTabs: ["-T", "--show-tabs", "-t"],
      showNonPrinting: ["-v", "--show-nonprinting"],
      help: ["--help"],
      version: ["--version"],
    };

    const flags = Object.entries(flagMap).reduce(
      (acc, [key, values]) => ({
        ...acc,
        [key]: args.some((arg) => values.includes(arg)),
      }),
      {} as CatFlags,
    );

    if (flags.showAll) {
      flags.showNonPrinting = true;
      flags.showEnds = true;
      flags.showTabs = true;
    }

    return {
      flags,
      files: args.filter((arg) => !arg.startsWith("-")),
    };
  }

  async execute(...args: string[]): Promise<CommandOutput> {
    const { flags, files } = this.parseArgs(args);

    if (flags.help) return this.createHelpOutput();
    if (flags.version) return this.createVersionOutput();

    if (files.length === 0) {
      return { output: "", exitCode: ExitCodes.SUCCESS };
    }

    const outputs: string[] = [];
    for (const path of files) {
      if (path === "-") continue;

      const targetPath = PathUtils.normalize(this.currentPath, path);
      if (!(await this.pathExists(targetPath)))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}: ${path}`);

      if (targetPath !== "/" && !targetPath.startsWith("/home"))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${path}`);

      const [entry] = await this.fileSystemService.getAll((e) => e.fullPath === targetPath);
      if (!(entry instanceof File))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_cat_is_a_directory}}}: ${path}`);

      outputs.push(this.processContent(entry.content, flags));
    }

    return {
      output: outputs.join("\n"),
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private processContent(content: string, flags: CatFlags): string {
    let lines = content.split("\n");

    if (flags.squeezeBlank) {
      lines = lines.reduce((acc, line) => {
        if (line.trim() === "" && acc[acc.length - 1]?.trim() === "") return acc;
        acc.push(line);
        return acc;
      }, [] as string[]);
    }

    lines = lines.map((line, i) => {
      let processedLine = line;

      if (flags.showTabs) processedLine = processedLine.replace(/\t/g, "^I");

      if (flags.showNonPrinting)
        processedLine = processedLine.replace(
          /[^\x20-\x7E\t\n]/g,
          (match) => "^" + String.fromCharCode(match.charCodeAt(0) + 64),
        );

      if (flags.showEnds) processedLine = processedLine + "$";

      if (flags.number || (flags.numberNonBlank && line.trim()))
        processedLine = `${String(i + 1).padStart(6, " ")}  ${processedLine}`;

      return processedLine;
    });

    return lines.join("\n");
  }

  private createHelpOutput(): CommandOutput {
    const helpText = `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}: 
  cat [{{${TranslationKeys.common_options}}}]... <{{${TranslationKeys.common_path}}}>

{{${TranslationKeys.apps_terminal_cat_help_stdin_note}}}

{{${TranslationKeys.common_options}}}:
  -A, --show-all          {{${TranslationKeys.apps_terminal_cat_help_option_show_all}}}
  -b, --number-nonblank   {{${TranslationKeys.apps_terminal_cat_help_option_number_nonblank}}}
  -e                      {{${TranslationKeys.apps_terminal_cat_help_option_e}}}
  -E, --show-ends         {{${TranslationKeys.apps_terminal_cat_help_option_show_ends}}}
  -n, --number            {{${TranslationKeys.apps_terminal_cat_help_option_number}}}
  -s, --squeeze-blank     {{${TranslationKeys.apps_terminal_cat_help_option_squeeze_blank}}}
  -t                      {{${TranslationKeys.apps_terminal_cat_help_option_t}}}
  -T, --show-tabs         {{${TranslationKeys.apps_terminal_cat_help_option_show_tabs}}}
  -v, --show-nonprinting  {{${TranslationKeys.apps_terminal_cat_help_option_show_nonprinting}}}
      --help              {{${TranslationKeys.apps_terminal_cat_help_option_help}}}
      --version           {{${TranslationKeys.apps_terminal_cat_help_option_version}}}

{{${TranslationKeys.apps_terminal_cat_help_examples}}}
  cat f - g  {{${TranslationKeys.apps_terminal_cat_help_example_file_content}}}
  cat        {{${TranslationKeys.apps_terminal_cat_help_example_stdin}}}`;

    return {
      output: helpText,
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

  private createVersionOutput(): CommandOutput {
    return {
      output: `${this.name} version 1.0.0`,
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
