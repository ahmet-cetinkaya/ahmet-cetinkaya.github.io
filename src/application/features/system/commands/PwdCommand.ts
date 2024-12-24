import { Paths } from "~/domain/data/Directories";
import { TranslationKeys } from "~/domain/data/Translations";
import type ICIProgram from "./abstraction/ICIProgram";
import { type CommandOutput, ExitCodes } from "./abstraction/ICIProgram";

export default class PwdCommand implements ICIProgram {
  name = "pwd";
  description = TranslationKeys.apps_terminal_commands_pwd_description;

  async execute(...args: string[]): Promise<CommandOutput> {
    if (args.includes("--help") || args.includes("-h")) return this.createHelpOutput();

    const currentPath = args[0] || Paths.USER_HOME;
    return {
      output: currentPath,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createHelpOutput(): CommandOutput | PromiseLike<CommandOutput> {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}: pwd`,
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
