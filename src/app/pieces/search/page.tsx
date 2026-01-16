import { MainLayout } from '@/components/templates/MainLayout';
import { TagRepository } from '@/infrastructure/repositories/tag.repository';
import { PieceSearchClient } from './PieceSearchClient';

export default async function PieceSearchPage() {
  const tagRepository = new TagRepository();
  const tags = await tagRepository.findAll();

  return (
    <MainLayout>
      <PieceSearchClient availableTags={tags.map((t) => t.toSerializable())} />
    </MainLayout>
  );
}
