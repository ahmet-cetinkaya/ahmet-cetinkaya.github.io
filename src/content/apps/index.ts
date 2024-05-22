import { Icon } from '~/domain/constants/Icons';
import { TranslateKeys } from '~/domain/constants/TranslateKeys';
import { App, Apps } from '~/domain/models/App';
import { Categories } from '~/domain/models/Category';

export default [
  {
    id: Apps.AboutMe,
    categoryId: Categories.Apps,
    name: TranslateKeys.Apps_AboutMe,
    icon: Icon.AboutMeApp,
    execute: () => {
      console.log('About Me App');
    },
    createdDate: new Date('2024-05-11 15:54:45'),
  },
  {
    id: Apps.Contact,
    categoryId: Categories.Apps,
    name: TranslateKeys.Apps_Contact,
    icon: Icon.ContactApp,
    execute: () => {
      console.log('Contact App');
    },
    createdDate: new Date('2024-05-11 15:55:45'),
  },
  {
    id: Apps.Blog,
    categoryId: Categories.Apps,
    name: TranslateKeys.Apps_Blog,
    icon: Icon.BlogApp,
    execute: () => {
      console.log('Blog App');
    },
    createdDate: new Date('2024-05-11 21:29:55'),
  },
] as App[];
