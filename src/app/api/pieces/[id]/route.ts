import { NextRequest, NextResponse } from 'next/server';
import { PieceRepository } from '@/infrastructure/repositories/piece.repository';

const pieceRepository = new PieceRepository();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const piece = await pieceRepository.findByIdWithRelations(Number(id));

    if (!piece) {
      return NextResponse.json({ error: 'Piece not found' }, { status: 404 });
    }

    return NextResponse.json(piece);
  } catch (error) {
    console.error('Piece fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
