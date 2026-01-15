export class Tag {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly createdByUserId: number
  ) {}
}
