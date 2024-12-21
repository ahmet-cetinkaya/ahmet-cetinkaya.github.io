export abstract class Entity<TId> {
  constructor(
    public id: TId,
    public createdDate: Date,
    public updatedDate: Date | undefined,
  ) {}
}
