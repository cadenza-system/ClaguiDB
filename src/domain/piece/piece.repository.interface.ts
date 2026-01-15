import { Piece } from './piece.entity';
import {
  PieceId,
  CreatePieceInput,
  UpdatePieceInput,
  PieceSearchCriteria,
  PieceWithRelations,
} from './piece.types';

export interface IPieceRepository {
  findById(id: PieceId): Promise<Piece | null>;
  findByIdWithRelations(id: PieceId): Promise<PieceWithRelations | null>;
  search(criteria: PieceSearchCriteria): Promise<Piece[]>;
  findByComposerId(composerId: number): Promise<Piece[]>;
  findByArrangerId(arrangerId: number): Promise<Piece[]>;
  findChildPieces(parentPieceId: number): Promise<Piece[]>;
  findRecent(limit: number): Promise<Piece[]>;
  findPopular(limit: number): Promise<Piece[]>;
  create(input: CreatePieceInput): Promise<Piece>;
  update(id: PieceId, input: UpdatePieceInput): Promise<Piece>;
  delete(id: PieceId, deletedByUserId: number): Promise<void>;
  addName(id: PieceId, name: string): Promise<void>;
  removeName(pieceNameId: number): Promise<void>;
  addTag(pieceId: PieceId, tagId: number, userId: number): Promise<void>;
  removeTag(pieceId: PieceId, tagId: number): Promise<void>;
}
