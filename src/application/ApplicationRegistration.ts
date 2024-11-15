import type { I18nBase } from '~/core/acore-ts/i18n/abstraction/I18nBase';
import { I18n } from '~/core/acore-ts/i18n/I18n';

export interface IApplicationRegistration {
  i18n: I18nBase;
}

export const applicationContainer: IApplicationRegistration = {
  i18n: new I18n(),
};
