export class Piece {
  constructor(
    public readonly id: number,
    public readonly names: string[],
    public readonly composerId: number,
    public readonly arrangerId: number | null,
    public readonly parentPieceId: number | null,
    public readonly compositionYear: number | null,
    public readonly sheetMusicInfo: string | null,
    public readonly createdAt: Date,
    public readonly createdByUserId: number,
    public readonly tags: string[] = [],
    public readonly favoriteCount: number = 0
  ) {}

  getJapaneseMainName(): string | null {
    const japaneseNames = this.names
      .filter((name) => this.isJapanese(name))
      .sort();
    return japaneseNames[0] || null;
  }

  getEnglishMainName(): string | null {
    const englishNames = this.names
      .filter((name) => !this.isJapanese(name))
      .sort();
    return englishNames[0] || null;
  }

  getMainName(language: 'ja' | 'en'): string {
    const mainName =
      language === 'ja'
        ? this.getJapaneseMainName()
        : this.getEnglishMainName();
    return mainName || this.names[0] || '';
  }

  private isJapanese(text: string): boolean {
    return /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
  }

  isArrangement(): boolean {
    return this.arrangerId !== null;
  }

  isPartOfSuite(): boolean {
    return this.parentPieceId !== null;
  }
}
