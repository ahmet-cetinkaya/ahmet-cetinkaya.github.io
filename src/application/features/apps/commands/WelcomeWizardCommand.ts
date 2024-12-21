import CryptoExtensions from "~/core/acore-ts/crypto/CryptoExtensions";
import { Apps } from "~/domain/data/Apps";
import { TranslationKeys } from "~/domain/data/Translations";
import Window from "~/domain/models/Window";
import type IWindowsService from "../../desktop/services/abstraction/IWindowsService";
import type ICIProgram from "../../system/commands/abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "../../system/commands/abstraction/ICIProgram";

export default class WelcomeWizardCommand implements ICIProgram {
  name = "welcome";
  description = TranslationKeys.apps_terminal_commands_welcome_description;

  constructor(private windowService: IWindowsService) {}

  async execute(...args: string[]): Promise<CommandOutput> {
    if (args.includes("--help") || args.includes("-h")) return this.createHelpOutput();

    const appWindow = new Window(
      CryptoExtensions.generateNanoId(),
      Apps.welcome,
      TranslationKeys.apps_welcome_wizard,
      0,
      false,
      args.includes("--maximized"),
    );
    await this.windowService.add(appWindow);

    return {
      output: `{{${TranslationKeys.apps_terminal_commands_welcome_started}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${this.description}}}\n{{${TranslationKeys.common_usage}}}: ${this.name} [--maximized]`,
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
