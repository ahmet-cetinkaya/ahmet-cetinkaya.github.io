import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import { TranslationKeys } from "@domain/data/Translations";
import File from "@domain/models/File";
import BaseCommand, { filterPositionalArgs, parseBooleanFlags } from "./abstraction/BaseCommand";
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

export default class CatCommand extends BaseCommand {
  name = "cat";
  description = TranslationKeys.apps_terminal_commands_cat_description;

  constructor(fileSystemService: IFileSystemService, currentPath: string) {
    super(fileSystemService);
    this.currentPath = currentPath;
  }

  private currentPath: string;

  private parseArgs(args: string[]): { flags: CatFlags; files: string[] } {
    const flags = parseBooleanFlags(args, {
      showAll: ["-A", "--show-all"],
      numberNonBlank: ["-b", "--number-nonblank"],
      showEnds: ["-E", "--show-ends", "-e"],
      number: ["-n", "--number"],
      squeezeBlank: ["-s", "--squeeze-blank"],
      showTabs: ["-T", "--show-tabs", "-t"],
      showNonPrinting: ["-v", "--show-nonprinting"],
      help: ["--help"],
      version: ["--version"],
    }) as CatFlags;

    if (flags.showAll) {
      flags.showNonPrinting = true;
      flags.showEnds = true;
      flags.showTabs = true;
    }

    const files = filterPositionalArgs(args);
    return { flags, files };
  }

  async execute(...args: string[]): Promise<CommandOutput> {
    return this.runFileCommand(args, this.parseArgs, this.createHelpOutput(), (flags, files) =>
      this.processCatFiles(flags, files),
    );
  }

  private async processCatFiles(flags: CatFlags, files: string[]): Promise<CommandOutput> {
    if (files.length === 0) {
      return { output: "", exitCode: ExitCodes.SUCCESS };
    }

    const outputs: string[] = [];
    for (const path of files) {
      if (path === "-") continue;

      const targetPath = this.normalizePath(this.currentPath, path);
      if (!(await this.pathExists(targetPath)))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}: ${path}`);

      const ownershipError = this.validatePathOwnership(targetPath);
      if (ownershipError) return ownershipError;

      const entry = await this.fileSystemService.resolvePath(targetPath);
      if (!entry || !(entry instanceof File))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_cat_is_a_directory}}}: ${path}`);

      const content = await this.fileSystemService.readFileContent(targetPath);
      outputs.push(this.processContent(content, flags));
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
          (match) => `^${String.fromCharCode(match.charCodeAt(0) + 64)}`,
        );

      if (flags.showEnds) processedLine = `${processedLine}$`;

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
}
