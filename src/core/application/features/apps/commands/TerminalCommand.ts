import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import { Apps } from "@domain/data/Apps";
import { TranslationKeys } from "@domain/data/Translations";
import BaseAppCommand from "./BaseAppCommand";

export default class TerminalCommand extends BaseAppCommand {
  name = "terminal";
  description = TranslationKeys.apps_terminal_commands_terminal_description;

  protected readonly appConfig = {
    name: this.name,
    description: this.description,
    appId: Apps.terminal,
    translationKey: TranslationKeys.apps_terminal,
    startedMessageKey: TranslationKeys.apps_terminal_commands_terminal_started,
  };

  constructor(windowService: IWindowsService) {
    super(windowService);
  }
}
