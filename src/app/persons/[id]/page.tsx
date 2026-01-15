import { notFound } from 'next/navigation';
import { MainLayout } from '@/components/templates/MainLayout';
import { PersonRepository } from '@/infrastructure/repositories/person.repository';
import { PieceRepository } from '@/infrastructure/repositories/piece.repository';
import { PersonDetailClient } from './PersonDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PersonDetailPage({ params }: Props) {
  const { id } = await params;
  const personRepository = new PersonRepository();
  const pieceRepository = new PieceRepository();

  const person = await personRepository.findById(Number(id));

  if (!person) {
    notFound();
  }

  const [composedPieces, arrangedPieces] = await Promise.all([
    pieceRepository.findByComposerId(person.id),
    pieceRepository.findByArrangerId(person.id),
  ]);

  return (
    <MainLayout>
      <PersonDetailClient
        person={person}
        composedPieces={composedPieces}
        arrangedPieces={arrangedPieces}
      />
    </MainLayout>
  );
}
