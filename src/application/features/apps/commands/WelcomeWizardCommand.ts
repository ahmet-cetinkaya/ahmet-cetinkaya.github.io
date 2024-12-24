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
      undefined,
      undefined,
      undefined,
      args,
    );
    await this.windowService.add(appWindow);

    return {
      output: `{{${TranslationKeys.apps_terminal_commands_welcome_started}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}: 
  ${this.name} [{{${TranslationKeys.common_options}}}]

{{${TranslationKeys.common_options}}}:
  --maximized: {{${TranslationKeys.apps_terminal_commands_apps_maximized}}}
  --part: {{${TranslationKeys.apps_terminal_commands_welcome_part}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
