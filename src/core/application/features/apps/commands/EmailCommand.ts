import type IWindowsService from "@application/features/desktop/services/abstraction/IWindowsService";
import { Apps } from "@domain/data/Apps";
import { TranslationKeys } from "@domain/data/Translations";
import BaseAppCommand from "./BaseAppCommand";

export default class EmailCommand extends BaseAppCommand {
  name = "email";
  description = TranslationKeys.apps_terminal_commands_email_description;

  protected readonly appConfig = {
    name: this.name,
    description: this.description,
    appId: Apps.email,
    translationKey: TranslationKeys.common_contact,
    startedMessageKey: TranslationKeys.apps_terminal_commands_email_started,
  };

  constructor(windowService: IWindowsService) {
    super(windowService);
  }
}
