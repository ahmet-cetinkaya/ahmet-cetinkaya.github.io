import { TranslateKeys } from '~/domain/constants/TranslateKeys';
import { Categories, type Category } from '~/domain/models/Category';

export default [
  {
    id: Categories.Apps,
    name: TranslateKeys.Apps_Apps,
    createdDate: new Date('2024-05-22 12:14:49'),
  },
  {
    id: Categories.System,
    name: TranslateKeys.System_System,
    createdDate: new Date('2024-05-22 12:14:49'),
  },
  {
    id: Categories.Power,
    name: TranslateKeys.Power_Power,
    createdDate: new Date('2024-05-22 12:14:49'),
  },
] as Category[];
