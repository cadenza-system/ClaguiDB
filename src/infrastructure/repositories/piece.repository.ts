import { prisma } from '../database/prisma';
import { IPieceRepository } from '@/domain/piece/piece.repository.interface';
import { Piece } from '@/domain/piece/piece.entity';
import {
  PieceId,
  CreatePieceInput,
  UpdatePieceInput,
  PieceSearchCriteria,
  PieceWithRelations,
} from '@/domain/piece/piece.types';

export class PieceRepository implements IPieceRepository {
  async findById(id: PieceId): Promise<Piece | null> {
    const piece = await prisma.piece.findUnique({
      where: { id, deletedAt: null },
      include: {
        pieceNames: { where: { deletedAt: null } },
        pieceTags: {
          where: { deletedAt: null },
          include: { tag: true },
        },
        _count: {
          select: { favorites: { where: { deletedAt: null } } },
        },
      },
    });

    if (!piece) return null;
    return this.toDomain(piece);
  }

  async findByIdWithRelations(id: PieceId): Promise<PieceWithRelations | null> {
    const piece = await prisma.piece.findUnique({
      where: { id, deletedAt: null },
      include: {
        pieceNames: { where: { deletedAt: null } },
        composer: {
          include: { personNames: { where: { deletedAt: null } } },
        },
        arranger: {
          include: { personNames: { where: { deletedAt: null } } },
        },
        pieceTags: {
          where: { deletedAt: null },
          include: { tag: true },
        },
        _count: {
          select: { favorites: { where: { deletedAt: null } } },
        },
      },
    });

    if (!piece) return null;

    return {
      id: piece.id,
      names: piece.pieceNames.map((pn) => pn.name),
      composerId: piece.composerId,
      composerNames: piece.composer.personNames.map((pn) => pn.name),
      arrangerId: piece.arrangerId,
      arrangerNames: piece.arranger?.personNames.map((pn) => pn.name) || null,
      parentPieceId: piece.parentPieceId,
      compositionYear: piece.compositionYear,
      sheetMusicInfo: piece.sheetMusicInfo,
      tags: piece.pieceTags.map((pt) => ({ id: pt.tag.id, name: pt.tag.name })),
      favoriteCount: piece._count.favorites,
      createdAt: piece.createdAt,
    };
  }

  async search(criteria: PieceSearchCriteria): Promise<Piece[]> {
    const pieces = await prisma.piece.findMany({
      where: {
        deletedAt: null,
        ...(criteria.query && {
          pieceNames: {
            some: {
              name: { contains: criteria.query },
              deletedAt: null,
            },
          },
        }),
        ...(criteria.composerId && { composerId: criteria.composerId }),
        ...(criteria.tagIds &&
          criteria.tagIds.length > 0 && {
            pieceTags: {
              some: {
                tagId: { in: criteria.tagIds },
                deletedAt: null,
              },
            },
          }),
      },
      include: {
        pieceNames: { where: { deletedAt: null } },
        pieceTags: {
          where: { deletedAt: null },
          include: { tag: true },
        },
        _count: {
          select: { favorites: { where: { deletedAt: null } } },
        },
      },
      take: criteria.limit,
      skip: criteria.offset,
    });

    return pieces.map((p) => this.toDomain(p));
  }

  async findByComposerId(composerId: number): Promise<Piece[]> {
    const pieces = await prisma.piece.findMany({
      where: { composerId, deletedAt: null },
      include: {
        pieceNames: { where: { deletedAt: null } },
        pieceTags: {
          where: { deletedAt: null },
          include: { tag: true },
        },
        _count: {
          select: { favorites: { where: { deletedAt: null } } },
        },
      },
    });

    return pieces.map((p) => this.toDomain(p));
  }

  async findByArrangerId(arrangerId: number): Promise<Piece[]> {
    const pieces = await prisma.piece.findMany({
      where: { arrangerId, deletedAt: null },
      include: {
        pieceNames: { where: { deletedAt: null } },
        pieceTags: {
          where: { deletedAt: null },
          include: { tag: true },
        },
        _count: {
          select: { favorites: { where: { deletedAt: null } } },
        },
      },
    });

    return pieces.map((p) => this.toDomain(p));
  }

  async findChildPieces(parentPieceId: number): Promise<Piece[]> {
    const pieces = await prisma.piece.findMany({
      where: { parentPieceId, deletedAt: null },
      include: {
        pieceNames: { where: { deletedAt: null } },
        pieceTags: {
          where: { deletedAt: null },
          include: { tag: true },
        },
        _count: {
          select: { favorites: { where: { deletedAt: null } } },
        },
      },
    });

    return pieces.map((p) => this.toDomain(p));
  }

  async findRecent(limit: number): Promise<Piece[]> {
    const pieces = await prisma.piece.findMany({
      where: { deletedAt: null },
      include: {
        pieceNames: { where: { deletedAt: null } },
        pieceTags: {
          where: { deletedAt: null },
          include: { tag: true },
        },
        _count: {
          select: { favorites: { where: { deletedAt: null } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return pieces.map((p) => this.toDomain(p));
  }

  async findPopular(limit: number): Promise<Piece[]> {
    const pieces = await prisma.piece.findMany({
      where: { deletedAt: null },
      include: {
        pieceNames: { where: { deletedAt: null } },
        pieceTags: {
          where: { deletedAt: null },
          include: { tag: true },
        },
        _count: {
          select: { favorites: { where: { deletedAt: null } } },
        },
      },
      orderBy: {
        favorites: { _count: 'desc' },
      },
      take: limit,
    });

    return pieces.map((p) => this.toDomain(p));
  }

  async create(input: CreatePieceInput): Promise<Piece> {
    const piece = await prisma.piece.create({
      data: {
        composerId: input.composerId,
        arrangerId: input.arrangerId,
        parentPieceId: input.parentPieceId,
        compositionYear: input.compositionYear,
        sheetMusicInfo: input.sheetMusicInfo,
        createdByUserId: input.createdByUserId,
        pieceNames: {
          create: input.names.map((name) => ({ name })),
        },
      },
      include: {
        pieceNames: true,
        pieceTags: {
          include: { tag: true },
        },
        _count: {
          select: { favorites: true },
        },
      },
    });

    return this.toDomain(piece);
  }

  async update(id: PieceId, input: UpdatePieceInput): Promise<Piece> {
    const piece = await prisma.piece.update({
      where: { id },
      data: {
        composerId: input.composerId,
        arrangerId: input.arrangerId,
        parentPieceId: input.parentPieceId,
        compositionYear: input.compositionYear,
        sheetMusicInfo: input.sheetMusicInfo,
      },
      include: {
        pieceNames: { where: { deletedAt: null } },
        pieceTags: {
          where: { deletedAt: null },
          include: { tag: true },
        },
        _count: {
          select: { favorites: { where: { deletedAt: null } } },
        },
      },
    });

    return this.toDomain(piece);
  }

  async delete(id: PieceId, deletedByUserId: number): Promise<void> {
    await prisma.piece.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedByUserId,
      },
    });
  }

  async addName(id: PieceId, name: string): Promise<void> {
    await prisma.pieceName.create({
      data: { pieceId: id, name },
    });
  }

  async removeName(pieceNameId: number): Promise<void> {
    await prisma.pieceName.update({
      where: { id: pieceNameId },
      data: { deletedAt: new Date() },
    });
  }

  async addTag(pieceId: PieceId, tagId: number, userId: number): Promise<void> {
    await prisma.pieceTag.create({
      data: { pieceId, tagId, createdByUserId: userId },
    });
  }

  async removeTag(pieceId: PieceId, tagId: number): Promise<void> {
    await prisma.pieceTag.updateMany({
      where: { pieceId, tagId },
      data: { deletedAt: new Date() },
    });
  }

  private toDomain(prismaModel: {
    id: number;
    composerId: number;
    arrangerId: number | null;
    parentPieceId: number | null;
    compositionYear: number | null;
    sheetMusicInfo: string | null;
    createdAt: Date;
    createdByUserId: number;
    pieceNames: { name: string }[];
    pieceTags: { tag: { name: string } }[];
    _count: { favorites: number };
  }): Piece {
    return new Piece(
      prismaModel.id,
      prismaModel.pieceNames.map((pn) => pn.name),
      prismaModel.composerId,
      prismaModel.arrangerId,
      prismaModel.parentPieceId,
      prismaModel.compositionYear,
      prismaModel.sheetMusicInfo,
      prismaModel.createdAt,
      prismaModel.createdByUserId,
      prismaModel.pieceTags.map((pt) => pt.tag.name),
      prismaModel._count.favorites
    );
  }
}
