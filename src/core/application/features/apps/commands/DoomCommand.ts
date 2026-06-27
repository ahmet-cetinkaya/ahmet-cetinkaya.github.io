import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import { Apps } from "@domain/data/Apps";
import { TranslationKeys } from "@domain/data/Translations";
import BaseAppCommand from "./BaseAppCommand";

export default class DoomCommand extends BaseAppCommand {
  name = "doom";
  description = TranslationKeys.apps_terminal_commands_doom_description;

  protected readonly appConfig = {
    name: this.name,
    description: this.description,
    appId: Apps.doom,
    translationKey: TranslationKeys.apps_doom,
    startedMessageKey: TranslationKeys.apps_terminal_commands_doom_started,
  };

  constructor(windowService: IWindowsService) {
    super(windowService);
  }
}
