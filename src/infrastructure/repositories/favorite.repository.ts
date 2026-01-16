import { prisma } from '../database/prisma';
import { IFavoriteRepository } from '@/domain/favorite/favorite.repository.interface';
import { Favorite } from '@/domain/favorite/favorite.entity';

type FavoriteModel = {
  id: number;
  userId: number;
  pieceId: number;
  createdAt: Date;
  deletedAt: Date | null;
};

export class FavoriteRepository implements IFavoriteRepository {
  async findByUserId(userId: number): Promise<Favorite[]> {
    const favorites = await prisma.favorite.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f: FavoriteModel) => this.toDomain(f));
  }

  async findByUserAndPiece(
    userId: number,
    pieceId: number
  ): Promise<Favorite | null> {
    const favorite = await prisma.favorite.findFirst({
      where: { userId, pieceId, deletedAt: null },
    });

    if (!favorite) return null;
    return this.toDomain(favorite);
  }

  async add(userId: number, pieceId: number): Promise<Favorite> {
    const existing = await prisma.favorite.findFirst({
      where: { userId, pieceId },
    });

    if (existing) {
      if (existing.deletedAt) {
        const updated = await prisma.favorite.update({
          where: { id: existing.id },
          data: { deletedAt: null },
        });
        return this.toDomain(updated);
      }
      return this.toDomain(existing);
    }

    const favorite = await prisma.favorite.create({
      data: { userId, pieceId },
    });

    return this.toDomain(favorite);
  }

  async remove(userId: number, pieceId: number): Promise<void> {
    await prisma.favorite.updateMany({
      where: { userId, pieceId },
      data: { deletedAt: new Date() },
    });
  }

  async countByPieceId(pieceId: number): Promise<number> {
    return prisma.favorite.count({
      where: { pieceId, deletedAt: null },
    });
  }

  private toDomain(prismaModel: FavoriteModel): Favorite {
    return new Favorite(
      prismaModel.id,
      prismaModel.userId,
      prismaModel.pieceId,
      prismaModel.createdAt
    );
  }
}
