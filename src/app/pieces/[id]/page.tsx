import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/templates/MainLayout';
import { PieceRepository } from '@/infrastructure/repositories/piece.repository';
import { PersonRepository } from '@/infrastructure/repositories/person.repository';
import { YoutubeVideoRepository } from '@/infrastructure/repositories/youtube-video.repository';
import { serializePieceWithRelations } from '@/domain/piece';
import { PieceDetailClient } from './PieceDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PieceDetailPage({ params }: Props) {
  const { id } = await params;
  const pieceRepository = new PieceRepository();
  const personRepository = new PersonRepository();
  const youtubeRepository = new YoutubeVideoRepository();

  const piece = await pieceRepository.findByIdWithRelations(Number(id));

  if (!piece) {
    notFound();
  }

  const [childPieces, videos, composer, arranger] = await Promise.all([
    pieceRepository.findChildPieces(piece.id),
    youtubeRepository.findByPieceId(piece.id, true),
    personRepository.findById(piece.composerId),
    piece.arrangerId ? personRepository.findById(piece.arrangerId) : null,
  ]);

  return (
    <MainLayout>
      <PieceDetailClient
        piece={serializePieceWithRelations(piece)}
        composer={composer?.toSerializable() ?? null}
        arranger={arranger?.toSerializable() ?? null}
        childPieces={childPieces.map((p) => p.toSerializable())}
        videos={videos.map((v) => v.toSerializable())}
      />
    </MainLayout>
  );
}
