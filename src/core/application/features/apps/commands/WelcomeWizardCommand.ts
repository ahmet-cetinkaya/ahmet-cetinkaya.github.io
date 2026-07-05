import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import { ExitCodes, type CommandOutput } from "@application/features/system/commands/abstraction/ICIProgram";
import { Apps } from "@domain/data/Apps";
import { TranslationKeys } from "@domain/data/Translations";
import BaseAppCommand, { type AppCommandConfig } from "./BaseAppCommand";

export default class WelcomeWizardCommand extends BaseAppCommand {
  name = "welcome";
  description = TranslationKeys.apps_terminal_commands_welcome_description;

  protected readonly appConfig: AppCommandConfig = {
    name: this.name,
    description: this.description,
    appId: Apps.welcome,
    translationKey: TranslationKeys.apps_welcome_wizard,
    startedMessageKey: TranslationKeys.apps_terminal_commands_welcome_started,
  };

  constructor(windowService: IWindowsService) {
    super(windowService);
  }

  async execute(...args: string[]): Promise<CommandOutput> {
    if (args.includes("--help") || args.includes("-h")) return this.createHelpOutput();
    return this.launchApp(args, {
      name: this.name,
      description: this.description,
      appId: Apps.welcome,
      translationKey: TranslationKeys.apps_welcome_wizard,
      startedMessageKey: TranslationKeys.apps_terminal_commands_welcome_started,
    });
  }

  protected override createHelpOutput(): CommandOutput {
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
