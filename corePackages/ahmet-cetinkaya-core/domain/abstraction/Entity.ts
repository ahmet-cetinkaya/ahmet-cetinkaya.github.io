export abstract class Entity<TId> {
  id: TId;
  createdDate: Date;
  updatedDate?: Date;

  constructor(id, createdDate, updatedDate) {
    this.id = id;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }
}
