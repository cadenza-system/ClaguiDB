import { PieceCard } from '@/components/molecules/PieceCard';
import { SerializedPiece } from '@/domain/piece';
import { render, screen } from '@testing-library/react';

// Next.js Link をモック
jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// TagChipをモックしてネストしたリンクを回避
jest.mock('@/components/molecules/TagChip', () => ({
  TagChip: ({ name }: { name: string }) => (
    <span data-testid="tag">{name}</span>
  ),
}));

describe('PieceCard', () => {
  const mockPiece: SerializedPiece = {
    id: 1,
    names: ['アルハンブラの思い出', 'Recuerdos de la Alhambra'],
    composerId: 1,
    arrangerId: null,
    parentPieceId: null,
    compositionYear: 1899,
    sheetMusicInfo: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    createdByUserId: 1,
    tags: ['Romantic', 'Spanish'],
    favoriteCount: 10,
  };

  it('言語がjaの場合、日本語名称が表示される', () => {
    render(<PieceCard piece={mockPiece} language="ja" />);

    expect(screen.getByText('アルハンブラの思い出')).toBeInTheDocument();
  });

  it('言語がenの場合、英語名称が表示される', () => {
    render(<PieceCard piece={mockPiece} language="en" />);

    expect(screen.getByText('Recuerdos de la Alhambra')).toBeInTheDocument();
  });

  it('言語がjaの場合、サブ名として英語名称が表示される', () => {
    render(<PieceCard piece={mockPiece} language="ja" />);

    expect(screen.getByText('Recuerdos de la Alhambra')).toBeInTheDocument();
  });

  it('言語がenの場合、サブ名として日本語名称が表示される', () => {
    render(<PieceCard piece={mockPiece} language="en" />);

    expect(screen.getByText('アルハンブラの思い出')).toBeInTheDocument();
  });

  it('楽曲詳細ページへのリンクがある', () => {
    render(<PieceCard piece={mockPiece} language="ja" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/pieces/1');
  });

  it('タグが表示される（最大3つ）', () => {
    const pieceWithManyTags: SerializedPiece = {
      ...mockPiece,
      tags: ['Romantic', 'Spanish', 'Guitar', 'Classical'],
    };

    render(<PieceCard piece={pieceWithManyTags} language="ja" />);

    const tags = screen.getAllByTestId('tag');
    expect(tags).toHaveLength(3);
    expect(screen.getByText('Romantic')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
    expect(screen.getByText('Guitar')).toBeInTheDocument();
    expect(screen.queryByText('Classical')).not.toBeInTheDocument();
  });

  it('タグがない場合、タグセクションが表示されない', () => {
    const pieceWithoutTags: SerializedPiece = {
      ...mockPiece,
      tags: [],
    };

    render(<PieceCard piece={pieceWithoutTags} language="ja" />);

    expect(screen.queryAllByTestId('tag')).toHaveLength(0);
  });

  it('作曲者名が渡された場合、表示される', () => {
    render(
      <PieceCard
        piece={mockPiece}
        language="ja"
        composerName="フランシスコ・タレガ"
      />
    );

    expect(screen.getByText('フランシスコ・タレガ')).toBeInTheDocument();
  });

  it('編曲者名が渡された場合、表示される', () => {
    render(
      <PieceCard piece={mockPiece} language="ja" arrangerName="セゴビア" />
    );

    expect(screen.getByText('(arr. セゴビア)')).toBeInTheDocument();
  });
});
