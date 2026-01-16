import { MainLayout } from '@/components/templates/MainLayout';
import { TagRepository } from '@/infrastructure/repositories/tag.repository';
import { PieceSearchClient } from './PieceSearchClient';

// データベース接続が必要なため、動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default async function PieceSearchPage() {
  const tagRepository = new TagRepository();
  const tags = await tagRepository.findAll();

  return (
    <MainLayout>
      <PieceSearchClient availableTags={tags.map((t) => t.toSerializable())} />
    </MainLayout>
  );
}
