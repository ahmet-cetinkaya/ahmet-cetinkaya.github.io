import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import { Paths } from "@domain/data/Directories";
import { TranslationKeys } from "@domain/data/Translations";
import File from "@domain/models/File";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

export default class HistoryCommand implements ICIProgram {
  name = "history";
  description = TranslationKeys.apps_terminal_commands_history_description;

  constructor(private readonly fileSystemService: IFileSystemService) {}

  async execute(...args: string[]): Promise<CommandOutput> {
    if (args.includes("--help")) {
      return this.createHelpOutput();
    }

    const historyFile = (await this.fileSystemService.get(
      (entry) => entry.fullPath === `${Paths.USER_HOME}/.bash_history`,
    )) as File;
    if (!historyFile) return { output: "No command history found.", exitCode: ExitCodes.GENERAL_ERROR };

    const content = historyFile.content as string;
    if (!content) return { output: "", exitCode: ExitCodes.SUCCESS };
    return {
      output: content,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}:
  history [{{${TranslationKeys.common_options}}}]...

{{${TranslationKeys.common_options}}}:
      --help  {{${TranslationKeys.apps_terminal_history_help_option_help}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
