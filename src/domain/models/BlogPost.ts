import { Post, type PostId } from './abstraction/Post';

export type BlogPostId = PostId;

export class BlogPost extends Post {
  constructor(
    id: BlogPostId,
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
