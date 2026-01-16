export type PieceId = number;

export interface CreatePieceInput {
  names: string[];
  composerId: number;
  arrangerId?: number;
  parentPieceId?: number;
  compositionYear?: number;
  sheetMusicInfo?: string;
  createdByUserId: number;
}

export interface UpdatePieceInput {
  composerId?: number;
  arrangerId?: number;
  parentPieceId?: number;
  compositionYear?: number;
  sheetMusicInfo?: string;
}

export interface PieceSearchCriteria {
  query?: string;
  composerId?: number;
  tagIds?: number[];
  limit?: number;
  offset?: number;
}

export interface PieceWithRelations {
  id: number;
  names: string[];
  composerId: number;
  composerNames: string[];
  arrangerId: number | null;
  arrangerNames: string[] | null;
  parentPieceId: number | null;
  compositionYear: number | null;
  sheetMusicInfo: string | null;
  tags: { id: number; name: string }[];
  favoriteCount: number;
  createdAt: Date;
}

export interface SerializedPieceWithRelations {
  id: number;
  names: string[];
  composerId: number;
  composerNames: string[];
  arrangerId: number | null;
  arrangerNames: string[] | null;
  parentPieceId: number | null;
  compositionYear: number | null;
  sheetMusicInfo: string | null;
  tags: { id: number; name: string }[];
  favoriteCount: number;
  createdAt: string;
}

export function serializePieceWithRelations(
  piece: PieceWithRelations
): SerializedPieceWithRelations {
  return {
    ...piece,
    createdAt: piece.createdAt.toISOString(),
  };
}
