import CryptoExtensions from "~/core/acore-ts/crypto/CryptoExtensions";
import { Apps } from "~/domain/data/Apps";
import { TranslationKeys } from "~/domain/data/Translations";
import Window from "~/domain/models/Window";
import type IWindowsService from "../../desktop/services/abstraction/IWindowsService";
import type ICIProgram from "../../system/commands/abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "../../system/commands/abstraction/ICIProgram";

export default class TerminalCommand implements ICIProgram {
  name = "terminal";
  description = TranslationKeys.apps_terminal_commands_terminal_description;

  constructor(private windowService: IWindowsService) {}

  async execute(...args: string[]): Promise<CommandOutput> {
    if (args.includes("--help") || args.includes("-h")) return this.createHelpOutput();
    const flags = this.parseFlags(args);

    const appWindow = new Window(
      CryptoExtensions.generateNanoId(),
      Apps.terminal,
      TranslationKeys.apps_terminal,
      undefined,
      undefined,
      flags.maximized,
      undefined,
      undefined,
      undefined,
      args,
    );
    await this.windowService.add(appWindow);

    return {
      output: `{{${TranslationKeys.apps_terminal_commands_terminal_started}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createHelpOutput(): CommandOutput | PromiseLike<CommandOutput> {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}: 
  ${this.name} [{{${TranslationKeys.common_options}}}]

{{${TranslationKeys.common_options}}}:
  --maximized: {{${TranslationKeys.apps_terminal_commands_apps_maximized}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private parseFlags(args: string[]) {
    return {
      maximized: args.includes("--maximized"),
    };
  }
}
