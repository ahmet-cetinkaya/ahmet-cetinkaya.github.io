import { TranslateKeys } from '~/domain/constants/TranslateKeys';
import { Categories } from '~/domain/models/Category';
import { Commands, type Command } from '~/domain/models/Command';

export default [
  {
    id: Commands.Shutdown,
    categoryId: Categories.Power,
    name: TranslateKeys.Commands_Shutdown,
    execute: () => {
      window.location.href = 'about:blank';
    },
    createdDate: new Date('2024-05-22 11:39:25'),
  },
  {
    id: Commands.Restart,
    categoryId: Categories.Power,
    name: TranslateKeys.Commands_Restart,
    execute: () => {
      window.location.reload();
    },
    createdDate: new Date('2024-05-22 11:39:25'),
  },
] as Command[];
