import { Person } from '@/domain/person/person.entity';
import { Piece } from '@/domain/piece/piece.entity';
import { Tag } from '@/domain/tag/tag.entity';
import { YoutubeVideo } from '@/domain/youtube/youtube-video.entity';

export const createPerson = (overrides?: Partial<{
  id: number;
  names: string[];
  bio: string | null;
  birthYear: number | null;
  deathYear: number | null;
  country: string | null;
  createdAt: Date;
  createdByUserId: number;
}>): Person => {
  return new Person(
    overrides?.id ?? 1,
    overrides?.names ?? ['Test Person', 'テスト人物'],
    overrides?.bio ?? null,
    overrides?.birthYear ?? 1900,
    overrides?.deathYear ?? null,
    overrides?.country ?? null,
    overrides?.createdAt ?? new Date('2024-01-01'),
    overrides?.createdByUserId ?? 1
  );
};

export const createPiece = (overrides?: Partial<{
  id: number;
  names: string[];
  composerId: number;
  arrangerId: number | null;
  parentPieceId: number | null;
  compositionYear: number | null;
  sheetMusicInfo: string | null;
  createdAt: Date;
  createdByUserId: number;
  tags: string[];
  favoriteCount: number;
}>): Piece => {
  return new Piece(
    overrides?.id ?? 1,
    overrides?.names ?? ['Test Piece', 'テスト楽曲'],
    overrides?.composerId ?? 1,
    overrides?.arrangerId ?? null,
    overrides?.parentPieceId ?? null,
    overrides?.compositionYear ?? null,
    overrides?.sheetMusicInfo ?? null,
    overrides?.createdAt ?? new Date('2024-01-01'),
    overrides?.createdByUserId ?? 1,
    overrides?.tags ?? [],
    overrides?.favoriteCount ?? 0
  );
};

export const createTag = (overrides?: Partial<{
  id: number;
  name: string;
  createdAt: Date;
  createdByUserId: number;
}>): Tag => {
  return new Tag(
    overrides?.id ?? 1,
    overrides?.name ?? 'Test Tag',
    overrides?.createdAt ?? new Date('2024-01-01'),
    overrides?.createdByUserId ?? 1
  );
};

export const createYoutubeVideo = (overrides?: Partial<{
  id: number;
  pieceId: number;
  url: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  createdByUserId: number;
}>): YoutubeVideo => {
  return new YoutubeVideo(
    overrides?.id ?? 1,
    overrides?.pieceId ?? 1,
    overrides?.url ?? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    overrides?.approvalStatus ?? 'approved',
    overrides?.createdAt ?? new Date('2024-01-01'),
    overrides?.createdByUserId ?? 1
  );
};
