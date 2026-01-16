import { Person } from '@/domain/person/person.entity';
import { createPerson } from '../../../helpers/factories';

describe('Person Entity', () => {
  describe('getJapaneseMainName', () => {
    it('日本語名称のアルファベット順で最初のものを返す', () => {
      const person = createPerson({
        names: ['アルベニス', 'イサーク・アルベニス', 'Isaac Albéniz'],
      });

      expect(person.getJapaneseMainName()).toBe('アルベニス');
    });

    it('複数の日本語名称がある場合、ソート順で最初のものを返す', () => {
      const person = createPerson({
        names: ['タレガ', 'フランシスコ・タレガ', 'Francisco Tárrega'],
      });

      expect(person.getJapaneseMainName()).toBe('タレガ');
    });

    it('日本語名称がない場合はnullを返す', () => {
      const person = createPerson({
        names: ['Isaac Albéniz', 'Albéniz'],
      });

      expect(person.getJapaneseMainName()).toBeNull();
    });

    it('空の配列の場合はnullを返す', () => {
      const person = createPerson({ names: [] });

      expect(person.getJapaneseMainName()).toBeNull();
    });
  });

  describe('getEnglishMainName', () => {
    it('英語名称のアルファベット順で最初のものを返す', () => {
      const person = createPerson({
        names: ['Isaac Albéniz', 'Albéniz', 'アルベニス'],
      });

      expect(person.getEnglishMainName()).toBe('Albéniz');
    });

    it('英語名称がない場合はnullを返す', () => {
      const person = createPerson({
        names: ['アルベニス', 'イサーク・アルベニス'],
      });

      expect(person.getEnglishMainName()).toBeNull();
    });
  });

  describe('getMainName', () => {
    it('言語がjaの場合、日本語名称を優先して返す', () => {
      const person = createPerson({
        names: ['アルベニス', 'Isaac Albéniz'],
      });

      expect(person.getMainName('ja')).toBe('アルベニス');
    });

    it('言語がenの場合、英語名称を優先して返す', () => {
      const person = createPerson({
        names: ['アルベニス', 'Isaac Albéniz'],
      });

      expect(person.getMainName('en')).toBe('Isaac Albéniz');
    });

    it('言語がjaで日本語名称がない場合、最初の名称を返す', () => {
      const person = createPerson({
        names: ['Isaac Albéniz', 'Albéniz'],
      });

      // names配列の最初の要素を返す
      expect(person.getMainName('ja')).toBe('Isaac Albéniz');
    });

    it('言語がenで英語名称がない場合、最初の名称を返す', () => {
      const person = createPerson({
        names: ['アルベニス', 'イサーク'],
      });

      expect(person.getMainName('en')).toBe('アルベニス');
    });

    it('名称が空の場合、空文字を返す', () => {
      const person = createPerson({ names: [] });

      expect(person.getMainName('ja')).toBe('');
      expect(person.getMainName('en')).toBe('');
    });
  });

  describe('isAlive', () => {
    it('deathYearがnullの場合はtrueを返す', () => {
      const person = createPerson({
        birthYear: 1900,
        deathYear: null,
      });

      expect(person.isAlive()).toBe(true);
    });

    it('deathYearがある場合はfalseを返す', () => {
      const person = createPerson({
        birthYear: 1900,
        deathYear: 1950,
      });

      expect(person.isAlive()).toBe(false);
    });
  });

  describe('toSerializable', () => {
    it('シリアライズ可能なオブジェクトを返す', () => {
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const person = createPerson({
        id: 1,
        names: ['Test'],
        bio: 'Test bio',
        birthYear: 1900,
        deathYear: 1950,
        country: 'Spain',
        createdAt,
        createdByUserId: 1,
      });

      const serialized = person.toSerializable();

      expect(serialized).toEqual({
        id: 1,
        names: ['Test'],
        bio: 'Test bio',
        birthYear: 1900,
        deathYear: 1950,
        country: 'Spain',
        createdAt: '2024-01-01T00:00:00.000Z',
        createdByUserId: 1,
      });
    });

    it('createdAtがISO文字列に変換される', () => {
      const person = createPerson({
        createdAt: new Date('2024-06-15T12:30:00.000Z'),
      });

      const serialized = person.toSerializable();

      expect(typeof serialized.createdAt).toBe('string');
      expect(serialized.createdAt).toBe('2024-06-15T12:30:00.000Z');
    });
  });
});
