export interface SerializedTag {
  id: number;
  name: string;
  createdAt: string;
  createdByUserId: number;
}

export class Tag {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly createdByUserId: number
  ) {}

  toSerializable(): SerializedTag {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt.toISOString(),
      createdByUserId: this.createdByUserId,
    };
  }
}
