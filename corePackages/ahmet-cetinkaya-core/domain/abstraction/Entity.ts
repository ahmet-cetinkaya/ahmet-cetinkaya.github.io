export abstract class Entity<TId> {
  id: TId;
  createdDate: Date;
  updatedDate?: Date;

  constructor({ id, createdDate, updatedDate }: Entity<TId>) {
    this.id = id;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }
}
