import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import type ICIProgram from "@application/features/system/commands/abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "@application/features/system/commands/abstraction/ICIProgram";
import { Apps } from "@domain/data/Apps";
import { TranslationKeys } from "@domain/data/Translations";
import Window from "@domain/models/Window";
import CryptoExtensions from "@packages/acore-ts/crypto/CryptoExtensions";

export default class DoomCommand implements ICIProgram {
  name = "doom";
  description = TranslationKeys.apps_terminal_commands_doom_description;

  constructor(private windowService: IWindowsService) {}

  async execute(...args: string[]): Promise<CommandOutput> {
    if (args.includes("--help") || args.includes("-h")) return this.createHelpOutput();
    const flags = this.parseFlags(args);

    const appWindow = new Window(
      CryptoExtensions.generateNanoId(),
      Apps.doom,
      TranslationKeys.apps_doom,
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
      output: `{{${TranslationKeys.apps_terminal_commands_doom_started}}}`,
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
