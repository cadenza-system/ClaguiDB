export class Person {
  constructor(
    public readonly id: number,
    public readonly names: string[],
    public readonly bio: string | null,
    public readonly birthYear: number | null,
    public readonly deathYear: number | null,
    public readonly country: string | null,
    public readonly createdAt: Date,
    public readonly createdByUserId: number
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

  isAlive(): boolean {
    return this.deathYear === null;
  }
}
