import { Post, type PostId } from './abstraction/Post';

export type ProjectPostId = PostId;

export class ProjectPost extends Post {
  constructor(
    id: ProjectPostId,
    slug: string,
    body: string,
    title: string,
    description: string,
    createdDate: Date,
    updatedDate?: Date,
  ) {
    super(id, slug, body, title, description, createdDate, updatedDate);
  }
}
