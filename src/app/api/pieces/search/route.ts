import { NextRequest, NextResponse } from 'next/server';
import { PieceRepository } from '@/infrastructure/repositories/piece.repository';

const pieceRepository = new PieceRepository();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const tagsParam = searchParams.get('tags');
    const tagIds = tagsParam
      ? tagsParam.split(',').map((id) => parseInt(id, 10))
      : undefined;

    const pieces = await pieceRepository.search({
      query: query || undefined,
      tagIds,
      limit: 50,
    });

    return NextResponse.json(
      pieces.map((piece) => ({
        id: piece.id,
        names: piece.names,
        composerId: piece.composerId,
        arrangerId: piece.arrangerId,
        parentPieceId: piece.parentPieceId,
        compositionYear: piece.compositionYear,
        sheetMusicInfo: piece.sheetMusicInfo,
        createdAt: piece.createdAt.toISOString(),
        createdByUserId: piece.createdByUserId,
        tags: piece.tags,
        favoriteCount: piece.favoriteCount,
      }))
    );
  } catch (error) {
    console.error('Piece search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
