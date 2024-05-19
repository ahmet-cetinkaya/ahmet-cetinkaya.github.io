import { getBlogPermalink, getPermalink } from './application/shared/utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Blog',
      links: [
        {
          text: 'Blog List',
          href: getBlogPermalink(),
        },
      ],
    },
    {
      text: 'Blog List',
      href: getBlogPermalink(),
    },
    {
      text: 'Page 2',
      href: getPermalink('/homes/page2'),
    },
  ],
};
