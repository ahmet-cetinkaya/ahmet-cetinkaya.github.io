import CryptoExtensions from "~/core/acore-ts/crypto/CryptoExtensions";
import { Apps } from "~/domain/data/Apps";
import { TranslationKeys } from "~/domain/data/Translations";
import Window from "~/domain/models/Window";
import type IWindowsService from "../../desktop/services/abstraction/IWindowsService";
import type ICIProgram from "../../system/commands/abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "../../system/commands/abstraction/ICIProgram";

export default class DoomCommand implements ICIProgram {
  name = "doom";
  description = TranslationKeys.apps_terminal_commands_doom_description;

  constructor(private windowService: IWindowsService) {}

  async execute(...args: string[]): Promise<CommandOutput> {
    if (args.includes("--help") || args.includes("-h")) return this.createHelpOutput();

    const appWindow = new Window(CryptoExtensions.generateNanoId(), Apps.doom, TranslationKeys.games_doom);
    await this.windowService.add(appWindow);

    return {
      output: `{{${TranslationKeys.apps_terminal_commands_doom_started}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createHelpOutput(): CommandOutput | PromiseLike<CommandOutput> {
    return {
      output: `${this.name}: {{${this.description}}}\n{{${TranslationKeys.common_usage}}}: ${this.name}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
