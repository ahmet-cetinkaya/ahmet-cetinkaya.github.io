import { Entity } from '@corePackages/ahmet-cetinkaya-core/domain/abstraction/Entity';

export type PostId = string;

export abstract class Post extends Entity<PostId> {
  constructor(
    id: PostId,
    public slug: string,
    public body: string,
    public title: string,
    public description: string,
    createdDate: Date,
    updatedDate?: Date,
  ) {
    super(id, createdDate, updatedDate);
  }
}
