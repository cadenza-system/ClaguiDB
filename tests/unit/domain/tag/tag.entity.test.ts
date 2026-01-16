import { createTag } from '../../../helpers/factories';

describe('Tag Entity', () => {
  describe('constructor', () => {
    it('正しくインスタンスを生成する', () => {
      const tag = createTag({
        id: 1,
        name: 'Romantic',
        createdByUserId: 1,
      });

      expect(tag.id).toBe(1);
      expect(tag.name).toBe('Romantic');
      expect(tag.createdByUserId).toBe(1);
    });
  });

  describe('toSerializable', () => {
    it('シリアライズ可能なオブジェクトを返す', () => {
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const tag = createTag({
        id: 1,
        name: 'Baroque',
        createdAt,
        createdByUserId: 1,
      });

      const serialized = tag.toSerializable();

      expect(serialized).toEqual({
        id: 1,
        name: 'Baroque',
        createdAt: '2024-01-01T00:00:00.000Z',
        createdByUserId: 1,
      });
    });

    it('createdAtがISO文字列に変換される', () => {
      const tag = createTag({
        createdAt: new Date('2024-06-15T12:30:00.000Z'),
      });

      const serialized = tag.toSerializable();

      expect(typeof serialized.createdAt).toBe('string');
      expect(serialized.createdAt).toBe('2024-06-15T12:30:00.000Z');
    });
  });
});
