import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import type ICIProgram from "@application/features/system/commands/abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "@application/features/system/commands/abstraction/ICIProgram";
import { Apps } from "@domain/data/Apps";
import type { TranslationKey } from "@domain/data/Translations";
import { TranslationKeys } from "@domain/data/Translations";
import Window from "@domain/models/Window";
import CryptoExtensions from "@packages/acore-ts/crypto/CryptoExtensions";

export interface AppCommandConfig {
  name: string;
  description: TranslationKey;
  appId: Apps;
  translationKey: TranslationKey;
  startedMessageKey: TranslationKey;
}

/**
 * Base class for app-launching terminal commands (doom, email, terminal, etc.)
 */
export default abstract class BaseAppCommand implements ICIProgram {
  abstract name: string;
  abstract description: string;
  protected abstract readonly appConfig: AppCommandConfig;

  constructor(protected readonly windowService: IWindowsService) {}

  async execute(...args: string[]): Promise<CommandOutput> {
    if (args.includes("--help") || args.includes("-h")) return this.createHelpOutput();
    return this.launchApp(args, this.appConfig);
  }

  protected async launchApp(args: string[], config: AppCommandConfig): Promise<CommandOutput> {
    const flags = this.parseFlags(args);

    const appWindow = new Window(
      CryptoExtensions.generateNanoId(),
      config.appId,
      config.translationKey,
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
      output: `{{${config.startedMessageKey}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  protected createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}:
  ${this.name} [{{${TranslationKeys.common_options}}}]

{{${TranslationKeys.common_options}}}:
  --maximized: {{${TranslationKeys.apps_terminal_commands_apps_maximized}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  protected parseFlags(args: string[]) {
    return {
      maximized: args.includes("--maximized"),
    };
  }
}
