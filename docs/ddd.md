# DDD（ドメイン駆動設計）ルール

## 概要
このプロジェクトでは、DDDの概念を**緩く**適用します。
厳密なDDDではなく、保守性とスケーラビリティを向上させることを目的とした実用的なアプローチを取ります。

---

## ディレクトリ構造
```
src/
├── domain/              # ドメイン層（ビジネスロジック）
│   ├── person/
│   │   ├── person.entity.ts
│   │   ├── person.types.ts
│   │   ├── person.repository.interface.ts
│   │   └── person.service.ts
│   ├── piece/
│   ├── tag/
│   ├── user/
│   └── editRequest/
├── infrastructure/      # インフラ層（外部依存）
│   ├── database/
│   │   └── prisma.ts
│   └── repositories/    # リポジトリの実装
│       ├── person.repository.ts
│       ├── piece.repository.ts
│       └── ...
└── app/                 # プレゼンテーション層（Next.js）
    ├── api/             # APIエンドポイント
    └── (main)/          # ページ
```

---

## レイヤー定義

### 1. ドメイン層（Domain Layer）
**責務**: ビジネスロジックとルールの定義

**含まれるもの**:
- **Entity**: ビジネスオブジェクトの定義
- **Types**: ドメイン固有の型定義
- **Repository Interface**: データ永続化の抽象インターフェース
- **Service**: 複雑なビジネスロジック

**ルール**:
- ✅ 外部依存を持たない（Prisma、Next.js等を直接importしない）
- ✅ 純粋なTypeScript/JavaScriptのみ
- ✅ ビジネスルールはここに集約
- ❌ データベースアクセスコードを書かない
- ❌ APIリクエスト/レスポンスの形式に依存しない

---

### 2. インフラ層（Infrastructure Layer）
**責務**: 外部システムとの接続

**含まれるもの**:
- **Database**: Prisma Client初期化
- **Repository実装**: ドメイン層のRepository Interfaceの具体実装
- **外部API連携**: Stripe、Google OAuth等

**ルール**:
- ✅ Prismaを使ったDB操作
- ✅ Repository Interfaceを実装
- ✅ エラーハンドリング
- ❌ ビジネスロジックを書かない

---

### 3. プレゼンテーション層（Presentation Layer）
**責務**: ユーザーインターフェースとAPIエンドポイント

**含まれるもの**:
- **Pages**: Next.js App Router
- **API Routes**: REST API
- **Components**: UIコンポーネント

**ルール**:
- ✅ ドメインサービスを呼び出す
- ✅ リクエスト/レスポンスの変換
- ✅ 認証/認可のチェック
- ❌ 直接Prismaを呼ばない（Repository経由）
- ❌ 複雑なビジネスロジックを書かない

---

## ドメインモデルの構成

### Entity（エンティティ）
ビジネスオブジェクトの定義

#### 例: `src/domain/person/person.entity.ts`
```typescript
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

  /**
   * 日本語メイン表記を取得
   */
  getJapaneseMainName(): string | null {
    const japaneseNames = this.names
      .filter(name => this.isJapanese(name))
      .sort();
    return japaneseNames[0] || null;
  }

  /**
   * 英語メイン表記を取得
   */
  getEnglishMainName(): string | null {
    const englishNames = this.names
      .filter(name => !this.isJapanese(name))
      .sort();
    return englishNames[0] || null;
  }

  /**
   * 日本語判定
   */
  private isJapanese(text: string): boolean {
    return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text[0]);
  }

  /**
   * 存命中かどうか
   */
  isAlive(): boolean {
    return this.deathYear === null;
  }
}
```

---

### Types（型定義）
ドメイン固有の型

#### 例: `src/domain/person/person.types.ts`
```typescript
export type PersonId = number;

export interface CreatePersonInput {
  names: string[];
  bio?: string;
  birthYear?: number;
  deathYear?: number;
  country?: string;
  createdByUserId: number;
}

export interface UpdatePersonInput {
  bio?: string;
  birthYear?: number;
  deathYear?: number;
  country?: string;
}

export interface PersonSearchCriteria {
  query?: string;
  country?: string;
  isAlive?: boolean;
}
```

---

### Repository Interface（リポジトリインターフェース）
データ永続化の抽象定義

#### 例: `src/domain/person/person.repository.interface.ts`
```typescript
import { Person } from './person.entity';
import { PersonId, CreatePersonInput, UpdatePersonInput, PersonSearchCriteria } from './person.types';

export interface IPersonRepository {
  /**
   * IDで人物を取得
   */
  findById(id: PersonId): Promise<Person | null>;

  /**
   * 人物を検索
   */
  search(criteria: PersonSearchCriteria): Promise<Person[]>;

  /**
   * 人物を作成
   */
  create(input: CreatePersonInput): Promise<Person>;

  /**
   * 人物を更新
   */
  update(id: PersonId, input: UpdatePersonInput): Promise<Person>;

  /**
   * 人物を削除（論理削除）
   */
  delete(id: PersonId, deletedByUserId: number): Promise<void>;

  /**
   * 名称を追加
   */
  addName(id: PersonId, name: string): Promise<void>;

  /**
   * 名称を削除
   */
  removeName(personNameId: number): Promise<void>;
}
```

---

### Service（サービス）
複数のエンティティにまたがる複雑なビジネスロジック

#### 例: `src/domain/person/person.service.ts`
```typescript
import { IPersonRepository } from './person.repository.interface';
import { Person } from './person.entity';
import { CreatePersonInput } from './person.types';

export class PersonService {
  constructor(private readonly personRepository: IPersonRepository) {}

  /**
   * 人物を作成（名称の重複チェック付き）
   */
  async createPerson(input: CreatePersonInput): Promise<Person> {
    // ビジネスルール: 名称は最低1つ必要
    if (input.names.length === 0) {
      throw new Error('At least one name is required');
    }

    // ビジネスルール: 没年は生年より後でなければならない
    if (input.birthYear && input.deathYear && input.deathYear < input.birthYear) {
      throw new Error('Death year must be after birth year');
    }

    // 重複チェック
    const existing = await this.personRepository.search({
      query: input.names[0],
    });

    if (existing.length > 0) {
      throw new Error('Person with similar name already exists');
    }

    return this.personRepository.create(input);
  }

  /**
   * 作曲家と編曲者の楽曲を統合して取得
   */
  async getPersonWithAllPieces(personId: number): Promise<{
    person: Person;
    composedPieces: any[];
    arrangedPieces: any[];
  }> {
    // このメソッドはPieceRepositoryも必要なので、
    // 実際にはより上位のサービスで実装する
    throw new Error('Not implemented');
  }
}
```

---

## インフラ層の実装

### Repository実装
Repository Interfaceの具体実装

#### 例: `src/infrastructure/repositories/person.repository.ts`
```typescript
import { prisma } from '../database/prisma';
import { IPersonRepository } from '@/domain/person/person.repository.interface';
import { Person } from '@/domain/person/person.entity';
import {
  PersonId,
  CreatePersonInput,
  UpdatePersonInput,
  PersonSearchCriteria,
} from '@/domain/person/person.types';

export class PersonRepository implements IPersonRepository {
  async findById(id: PersonId): Promise<Person | null> {
    const person = await prisma.person.findUnique({
      where: { id, deletedAt: null },
      include: {
        personNames: {
          where: { deletedAt: null },
        },
      },
    });

    if (!person) return null;

    return this.toDomain(person);
  }

  async search(criteria: PersonSearchCriteria): Promise<Person[]> {
    const persons = await prisma.person.findMany({
      where: {
        deletedAt: null,
        ...(criteria.query && {
          personNames: {
            some: {
              name: { contains: criteria.query },
              deletedAt: null,
            },
          },
        }),
        ...(criteria.country && { country: criteria.country }),
        ...(criteria.isAlive !== undefined && {
          deathYear: criteria.isAlive ? null : { not: null },
        }),
      },
      include: {
        personNames: {
          where: { deletedAt: null },
        },
      },
    });

    return persons.map(p => this.toDomain(p));
  }

  async create(input: CreatePersonInput): Promise<Person> {
    const person = await prisma.person.create({
      data: {
        bio: input.bio,
        birthYear: input.birthYear,
        deathYear: input.deathYear,
        country: input.country,
        createdByUserId: input.createdByUserId,
        personNames: {
          create: input.names.map(name => ({ name })),
        },
      },
      include: {
        personNames: true,
      },
    });

    return this.toDomain(person);
  }

  async update(id: PersonId, input: UpdatePersonInput): Promise<Person> {
    const person = await prisma.person.update({
      where: { id },
      data: {
        bio: input.bio,
        birthYear: input.birthYear,
        deathYear: input.deathYear,
        country: input.country,
      },
      include: {
        personNames: {
          where: { deletedAt: null },
        },
      },
    });

    return this.toDomain(person);
  }

  async delete(id: PersonId, deletedByUserId: number): Promise<void> {
    await prisma.person.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedByUserId,
      },
    });
  }

  async addName(id: PersonId, name: string): Promise<void> {
    await prisma.personName.create({
      data: {
        personId: id,
        name,
      },
    });
  }

  async removeName(personNameId: number): Promise<void> {
    await prisma.personName.update({
      where: { id: personNameId },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Prismaモデルをドメインエンティティに変換
   */
  private toDomain(prismaModel: any): Person {
    return new Person(
      prismaModel.id,
      prismaModel.personNames.map((pn: any) => pn.name),
      prismaModel.bio,
      prismaModel.birthYear,
      prismaModel.deathYear,
      prismaModel.country,
      prismaModel.createdAt,
      prismaModel.createdByUserId
    );
  }
}
```

---

## API Routeでの使用例

#### `src/app/api/persons/[id]/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PersonRepository } from '@/infrastructure/repositories/person.repository';
import { PersonService } from '@/domain/person/person.service';

const personRepository = new PersonRepository();
const personService = new PersonService(personRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const person = await personRepository.findById(Number(params.id));

    if (!person) {
      return NextResponse.json(
        { error: 'Person not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: person.id,
      japaneseMainName: person.getJapaneseMainName(),
      englishMainName: person.getEnglishMainName(),
      allNames: person.names,
      bio: person.bio,
      birthYear: person.birthYear,
      deathYear: person.deathYear,
      country: person.country,
      isAlive: person.isAlive(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## ドメインごとの責務

### Person（人物）ドメイン
- 人物の基本情報管理
- 名称管理（メイン表記の決定ロジック）
- 存命判定

### Piece（楽曲）ドメイン
- 楽曲の基本情報管理
- 名称管理
- 親子関係（組曲と楽章）の管理
- タグ付け

### User（ユーザー）ドメイン
- ユーザー認証
- プレミアム会員管理
- お気に入り管理

### EditRequest（編集リクエスト）ドメイン
- 編集リクエストの作成
- 承認/却下処理
- リクエスト内容の適用

### Tag（タグ）ドメイン
- タグの作成
- タグの削除

---

## ベストプラクティス

### ✅ DO（推奨）
1. **ビジネスロジックはドメイン層に集約**
   - 例: 名称のソートロジック、メイン表記の決定
2. **Repository経由でデータアクセス**
   - API RouteやPage ComponentからPrismaを直接使わない
3. **エンティティにメソッドを持たせる**
   - 例: `person.getJapaneseMainName()`
4. **型安全性を保つ**
   - Prismaの型をそのまま使わず、ドメイン型に変換
5. **Serviceは複雑なロジックのみ**
   - 単純なCRUDはRepositoryで完結

### ❌ DON'T（非推奨）
1. **API RouteでPrismaを直接使う**
```typescript
   // ❌ Bad
   export async function GET() {
     const persons = await prisma.person.findMany();
     return NextResponse.json(persons);
   }
```
2. **ドメイン層で外部依存を持つ**
```typescript
   // ❌ Bad
   import { prisma } from '@/infrastructure/database/prisma';

   export class Person {
     async save() {
       await prisma.person.update(/* ... */);
     }
   }
```
3. **ビジネスロジックをAPI Routeに書く**
```typescript
   // ❌ Bad
   export async function POST(request: NextRequest) {
     const data = await request.json();

     // ビジネスロジック
     if (data.deathYear < data.birthYear) {
       return NextResponse.json({ error: '...' }, { status: 400 });
     }

     const person = await prisma.person.create({ data });
     return NextResponse.json(person);
   }
```

---

## 実装の優先順位

### Phase 1: 基本実装
1. Entity定義
2. Repository Interface定義
3. Repository実装
4. API Routeで使用

### Phase 2: リファクタリング
1. 複雑なロジックをServiceに移動
2. ドメインイベントの導入（必要に応じて）

### Phase 3: 最適化
1. キャッシング戦略
2. パフォーマンスチューニング

---

## まとめ

- **厳密なDDDは目指さない**（実用性優先）
- **レイヤー分離を意識**（Domain / Infrastructure / Presentation）
- **ビジネスロジックはドメイン層**
- **Repository経由でデータアクセス**
- **段階的に実装**（最初から完璧を目指さない）
