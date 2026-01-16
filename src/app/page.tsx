import { MainLayout } from '@/components/templates/MainLayout';
import { PieceRepository } from '@/infrastructure/repositories/piece.repository';
import { TagRepository } from '@/infrastructure/repositories/tag.repository';
import { HomeClient } from './HomeClient';

// データベース接続が必要なため、動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // CI環境ではDB接続をスキップ
  if (process.env.CI) {
    return (
      <MainLayout>
        <HomeClient recentPieces={[]} popularPieces={[]} tags={[]} />
      </MainLayout>
    );
  }

  const pieceRepository = new PieceRepository();
  const tagRepository = new TagRepository();

  const [recentPieces, popularPieces, tags] = await Promise.all([
    pieceRepository.findRecent(6),
    pieceRepository.findPopular(6),
    tagRepository.findAll(),
  ]);

  return (
    <MainLayout>
      <HomeClient
        recentPieces={recentPieces.map((p) => p.toSerializable())}
        popularPieces={popularPieces.map((p) => p.toSerializable())}
        tags={tags.map((t) => t.toSerializable())}
      />
    </MainLayout>
  );
}
