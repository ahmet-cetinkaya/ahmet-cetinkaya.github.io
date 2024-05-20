import { Post, type PostIdType } from './abstraction/Post';

export type BlogPostIdType = PostIdType;

export class BlogPost extends Post {
  constructor({ id, slug, body, title, description, createdDate, updatedDate }: BlogPost) {
    super({ id, slug, body, title, description, createdDate, updatedDate });
  }
}
