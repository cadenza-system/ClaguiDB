import { Favorite } from './favorite.entity';

export interface IFavoriteRepository {
  findByUserId(userId: number): Promise<Favorite[]>;
  findByUserAndPiece(userId: number, pieceId: number): Promise<Favorite | null>;
  add(userId: number, pieceId: number): Promise<Favorite>;
  remove(userId: number, pieceId: number): Promise<void>;
  countByPieceId(pieceId: number): Promise<number>;
}
