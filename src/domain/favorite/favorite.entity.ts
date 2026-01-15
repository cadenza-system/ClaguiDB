export class Favorite {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly pieceId: number,
    public readonly createdAt: Date
  ) {}
}
