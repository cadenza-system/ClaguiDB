import { Piece } from '@/domain/piece/piece.entity';
import { createPiece } from '../../../helpers/factories';

describe('Piece Entity', () => {
  describe('getJapaneseMainName', () => {
    it('日本語名称のアルファベット順で最初のものを返す', () => {
      const piece = createPiece({
        names: ['アルハンブラの思い出', 'Recuerdos de la Alhambra'],
      });

      expect(piece.getJapaneseMainName()).toBe('アルハンブラの思い出');
    });

    it('日本語名称がない場合はnullを返す', () => {
      const piece = createPiece({
        names: ['Recuerdos de la Alhambra', 'Memories of the Alhambra'],
      });

      expect(piece.getJapaneseMainName()).toBeNull();
    });
  });

  describe('getEnglishMainName', () => {
    it('英語名称のアルファベット順で最初のものを返す', () => {
      const piece = createPiece({
        names: ['Recuerdos de la Alhambra', 'Memories of the Alhambra', 'アルハンブラの思い出'],
      });

      expect(piece.getEnglishMainName()).toBe('Memories of the Alhambra');
    });

    it('英語名称がない場合はnullを返す', () => {
      const piece = createPiece({
        names: ['アルハンブラの思い出', '思い出'],
      });

      expect(piece.getEnglishMainName()).toBeNull();
    });
  });

  describe('getMainName', () => {
    it('言語がjaの場合、日本語名称を優先して返す', () => {
      const piece = createPiece({
        names: ['アルハンブラの思い出', 'Recuerdos de la Alhambra'],
      });

      expect(piece.getMainName('ja')).toBe('アルハンブラの思い出');
    });

    it('言語がenの場合、英語名称を優先して返す', () => {
      const piece = createPiece({
        names: ['アルハンブラの思い出', 'Recuerdos de la Alhambra'],
      });

      expect(piece.getMainName('en')).toBe('Recuerdos de la Alhambra');
    });

    it('該当する言語の名称がない場合、最初の名称を返す', () => {
      const piece = createPiece({
        names: ['Recuerdos de la Alhambra'],
      });

      expect(piece.getMainName('ja')).toBe('Recuerdos de la Alhambra');
    });

    it('名称が空の場合、空文字を返す', () => {
      const piece = createPiece({ names: [] });

      expect(piece.getMainName('ja')).toBe('');
      expect(piece.getMainName('en')).toBe('');
    });
  });

  describe('isArrangement', () => {
    it('arrangerIdがnullでない場合はtrueを返す', () => {
      const piece = createPiece({ arrangerId: 2 });

      expect(piece.isArrangement()).toBe(true);
    });

    it('arrangerIdがnullの場合はfalseを返す', () => {
      const piece = createPiece({ arrangerId: null });

      expect(piece.isArrangement()).toBe(false);
    });
  });

  describe('isPartOfSuite', () => {
    it('parentPieceIdがnullでない場合はtrueを返す', () => {
      const piece = createPiece({ parentPieceId: 10 });

      expect(piece.isPartOfSuite()).toBe(true);
    });

    it('parentPieceIdがnullの場合はfalseを返す', () => {
      const piece = createPiece({ parentPieceId: null });

      expect(piece.isPartOfSuite()).toBe(false);
    });
  });

  describe('toSerializable', () => {
    it('シリアライズ可能なオブジェクトを返す', () => {
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const piece = createPiece({
        id: 1,
        names: ['Test Piece'],
        composerId: 1,
        arrangerId: 2,
        parentPieceId: null,
        compositionYear: 1900,
        sheetMusicInfo: 'Sheet info',
        createdAt,
        createdByUserId: 1,
        tags: ['Romantic', 'Spanish'],
        favoriteCount: 10,
      });

      const serialized = piece.toSerializable();

      expect(serialized).toEqual({
        id: 1,
        names: ['Test Piece'],
        composerId: 1,
        arrangerId: 2,
        parentPieceId: null,
        compositionYear: 1900,
        sheetMusicInfo: 'Sheet info',
        createdAt: '2024-01-01T00:00:00.000Z',
        createdByUserId: 1,
        tags: ['Romantic', 'Spanish'],
        favoriteCount: 10,
      });
    });

    it('createdAtがISO文字列に変換される', () => {
      const piece = createPiece({
        createdAt: new Date('2024-06-15T12:30:00.000Z'),
      });

      const serialized = piece.toSerializable();

      expect(typeof serialized.createdAt).toBe('string');
      expect(serialized.createdAt).toBe('2024-06-15T12:30:00.000Z');
    });
  });
});
