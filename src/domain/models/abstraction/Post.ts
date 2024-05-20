import { Entity } from '@corePackages/ahmet-cetinkaya-core/domain/abstraction/Entity';

export type PostIdType = string;

export abstract class Post extends Entity<PostIdType> {
  slug: string;
  body: string;
  title: string;
  description: string;

  constructor({ id, slug, body, title, description, createdDate, updatedDate }: Post) {
    super({ id, createdDate, updatedDate });
    this.slug = slug;
    this.body = body;
    this.title = title;
    this.description = description;
  }
}
