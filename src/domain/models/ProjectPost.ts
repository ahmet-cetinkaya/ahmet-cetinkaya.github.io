import { Post, type PostIdType } from './abstraction/Post';

export type ProjectPostIdType = PostIdType;

export class ProjectPost extends Post {
  constructor({ id, slug, body, title, description, createdDate, updatedDate }: ProjectPost) {
    super({ id, slug, body, title, description, createdDate, updatedDate });
  }
}
