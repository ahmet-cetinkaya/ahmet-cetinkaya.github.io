import { TranslationKeys } from "~/domain/data/Translations";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

export default class EchoCommand implements ICIProgram {
  name = "echo";
  description = TranslationKeys.apps_terminal_commands_echo_description;

  async execute(...args: string[]): Promise<CommandOutput> {
    if (args.includes("--help") || args.includes("-h")) return this.createHelpOutput();

    return { output: args.join(" "), exitCode: ExitCodes.SUCCESS };
  }

  private createHelpOutput(): CommandOutput | PromiseLike<CommandOutput> {
    return {
      output: `${this.name}: {{${this.description}}}\n{{${TranslationKeys.common_usage}}}: echo <message>`,
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
