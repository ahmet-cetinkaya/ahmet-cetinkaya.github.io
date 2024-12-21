import { TranslationKeys } from "~/domain/data/Translations";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

export default class WhoamiCommand implements ICIProgram {
  name = "whoami";
  description = TranslationKeys.apps_terminal_commands_whoami_description;

  async execute(...args: string[]): Promise<CommandOutput> {
    if (args.includes("--help")) {
      return this.createHelpOutput();
    }

    return {
      output: "ac",
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.apps_terminal_whoami_help_usage}}}:
  whoami [OPTION]...

{{${TranslationKeys.apps_terminal_whoami_help_options}}}:
      --help  {{${TranslationKeys.apps_terminal_whoami_help_option_help}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
