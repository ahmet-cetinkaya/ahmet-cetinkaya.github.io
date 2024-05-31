import { Icon } from '~/domain/constants/Icons';
import { TranslateKeys } from '~/domain/constants/TranslateKeys';
import { App, Apps } from '~/domain/models/App';
import { Categories } from '~/domain/models/Category';

export default [
  {
    id: Apps.AboutMe,
    categoryId: Categories.Apps,
    name: TranslateKeys.Apps_AboutMe,
    path: '/about-me',
    icon: Icon.AboutMeApp,
    createdDate: new Date('2024-05-11 15:54:45'),
  },
  {
    id: Apps.Contact,
    categoryId: Categories.Apps,
    name: TranslateKeys.Apps_Contact,
    path: '/contact',
    icon: Icon.ContactApp,
    createdDate: new Date('2024-05-11 15:55:45'),
  },
  {
    id: Apps.Blog,
    categoryId: Categories.Apps,
    name: TranslateKeys.Apps_Blog,
    path: '/blog',
    icon: Icon.BlogApp,
    createdDate: new Date('2024-05-11 21:29:55'),
  },
  {
    id: Apps.Shutdown,
    categoryId: Categories.Power,
    name: TranslateKeys.Commands_Shutdown,
    path: '/shutdown',
    createdDate: new Date('2024-05-22 11:39:25'),
  },
  {
    id: Apps.Restart,
    categoryId: Categories.Power,
    name: TranslateKeys.Commands_Restart,
    path: '/restart',
    createdDate: new Date('2024-05-22 11:39:25'),
  },
] as App[];
