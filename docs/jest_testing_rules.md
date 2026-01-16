# Jestテスト戦略とルール

## 概要

このプロジェクトでは、**実用的なテスト戦略**を採用します。
100%のカバレッジを目指すのではなく、重要な部分に集中し、バグを早期発見できる効率的なテストを書きます。

---

## テストの種類と粒度

### 1. Unit Tests（単体テスト）

**対象**: 個別の関数、メソッド、コンポーネント

**粒度**: 細かい

**カバレッジ目標**: 70-80%

**優先順位**:

- 🔴 **必須**: ドメインロジック、ユーティリティ関数
- 🟡 **推奨**: Atoms、Molecules、Repository
- 🟢 **任意**: Organisms、Features（複雑なものは必須）

---

### 2. Integration Tests（統合テスト）

**対象**: 複数のモジュールの連携

**粒度**: 中程度

**カバレッジ目標**: 50-60%

**優先順位**:

- 🔴 **必須**: API Routes、Repository + Service
- 🟡 **推奨**: フォーム送信、データフロー
- 🟢 **任意**: 画面全体の統合

---

### 3. E2E Tests（エンドツーエンドテスト）

**対象**: ユーザーシナリオ全体

**粒度**: 粗い

**実装**: Phase 2以降（現時点では対象外）

---

## ディレクトリ構造

```
tests/
├── unit/                          # 単体テスト
│   ├── domain/                    # ドメインロジック
│   │   ├── person/
│   │   │   ├── person.entity.test.ts
│   │   │   └── person.service.test.ts
│   │   └── piece/
│   ├── lib/                       # ユーティリティ
│   │   ├── utils.test.ts
│   │   └── validations.test.ts
│   └── components/                # コンポーネント
│       ├── atoms/
│       │   └── Button/
│       │       └── Button.test.tsx
│       ├── molecules/
│       └── organisms/
├── integration/                   # 統合テスト
│   ├── api/                       # API Routes
│   │   ├── persons.test.ts
│   │   └── pieces.test.ts
│   └── repositories/              # Repository + DB
│       ├── person.repository.test.ts
│       └── piece.repository.test.ts
└── helpers/                       # テストヘルパー
    ├── setup.ts
    ├── mocks.ts
    └── factories.ts
```

---

## テストすべきもの・すべきでないもの

### ✅ テストすべきもの

#### 1. ドメインロジック（必須）

```typescript
// domain/person/person.entity.test.ts
describe('Person Entity', () => {
  describe('getJapaneseMainName', () => {
    it('日本語名称のアルファベット順で最初のものを返す', () => {
      const person = new Person(
        1,
        ['アルベニス', 'イサーク・アルベニス', 'Isaac Albéniz'],
        null,
        null,
        null,
        null,
        new Date(),
        1
      );

      expect(person.getJapaneseMainName()).toBe('アルベニス');
    });

    it('日本語名称がない場合はnullを返す', () => {
      const person = new Person(
        1,
        ['Isaac Albéniz', 'Albéniz'],
        null,
        null,
        null,
        null,
        new Date(),
        1
      );

      expect(person.getJapaneseMainName()).toBeNull();
    });
  });

  describe('isAlive', () => {
    it('deathYearがnullの場合はtrueを返す', () => {
      const person = new Person(
        1,
        ['Test'],
        null,
        1900,
        null,
        null,
        new Date(),
        1
      );

      expect(person.isAlive()).toBe(true);
    });

    it('deathYearがある場合はfalseを返す', () => {
      const person = new Person(
        1,
        ['Test'],
        null,
        1900,
        1950,
        null,
        new Date(),
        1
      );

      expect(person.isAlive()).toBe(false);
    });
  });
});
```

#### 2. ユーティリティ関数（必須）

```typescript
// lib/utils.test.ts
describe('formatYear', () => {
  it('正の数値をフォーマットする', () => {
    expect(formatYear(1900)).toBe('1900');
  });

  it('nullの場合は"Unknown"を返す', () => {
    expect(formatYear(null)).toBe('Unknown');
  });
});
```

#### 3. バリデーション（必須）

```typescript
// lib/validations.test.ts
describe('validatePersonInput', () => {
  it('有効なデータの場合はエラーなし', () => {
    const input = {
      names: ['Test'],
      birthYear: 1900,
      deathYear: 1950,
    };

    expect(() => validatePersonInput(input)).not.toThrow();
  });

  it('没年が生年より前の場合はエラー', () => {
    const input = {
      names: ['Test'],
      birthYear: 1950,
      deathYear: 1900,
    };

    expect(() => validatePersonInput(input)).toThrow(
      'Death year must be after birth year'
    );
  });
});
```

#### 4. Service層（必須）

```typescript
// domain/person/person.service.test.ts
describe('PersonService', () => {
  let service: PersonService;
  let mockRepository: jest.Mocked<IPersonRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addName: jest.fn(),
      removeName: jest.fn(),
    };
    service = new PersonService(mockRepository);
  });

  describe('createPerson', () => {
    it('名称が空の場合はエラー', async () => {
      const input = { names: [], createdByUserId: 1 };

      await expect(service.createPerson(input)).rejects.toThrow(
        'At least one name is required'
      );
    });

    it('重複チェックでエラー', async () => {
      mockRepository.search.mockResolvedValue([
        new Person(1, ['Existing'], null, null, null, null, new Date(), 1),
      ]);

      const input = { names: ['Existing'], createdByUserId: 1 };

      await expect(service.createPerson(input)).rejects.toThrow(
        'Person with similar name already exists'
      );
    });

    it('正常に作成', async () => {
      mockRepository.search.mockResolvedValue([]);
      const newPerson = new Person(
        1,
        ['New'],
        null,
        null,
        null,
        null,
        new Date(),
        1
      );
      mockRepository.create.mockResolvedValue(newPerson);

      const input = { names: ['New'], createdByUserId: 1 };
      const result = await service.createPerson(input);

      expect(result).toEqual(newPerson);
      expect(mockRepository.create).toHaveBeenCalledWith(input);
    });
  });
});
```

#### 5. Atoms（推奨）

```typescript
// components/atoms/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('正しくレンダリングされる', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('クリックイベントが発火する', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('loading時はdisabledになる', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('loading時はLoading...と表示される', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

#### 6. Molecules（推奨）

```typescript
// components/molecules/SearchForm/SearchForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchForm } from './SearchForm';

describe('SearchForm', () => {
  it('入力とボタンが表示される', () => {
    render(<SearchForm onSearch={jest.fn()} />);

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('フォーム送信時にonSearchが呼ばれる', () => {
    const handleSearch = jest.fn();
    render(<SearchForm onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test query' } });

    const button = screen.getByText('Search');
    fireEvent.click(button);

    expect(handleSearch).toHaveBeenCalledWith('test query');
  });

  it('空文字でも送信できる', () => {
    const handleSearch = jest.fn();
    render(<SearchForm onSearch={handleSearch} />);

    const button = screen.getByText('Search');
    fireEvent.click(button);

    expect(handleSearch).toHaveBeenCalledWith('');
  });
});
```

#### 7. API Routes（必須）

```typescript
// integration/api/persons.test.ts
import { GET, POST } from '@/app/api/persons/route';
import { NextRequest } from 'next/server';

// Prismaをモック
jest.mock('@/infrastructure/database/prisma', () => ({
  prisma: {
    person: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('GET /api/persons', () => {
  it('作曲者一覧を返す', async () => {
    const mockPersons = [{ id: 1, names: ['Test'], bio: null /* ... */ }];

    (prisma.person.findMany as jest.Mock).mockResolvedValue(mockPersons);

    const request = new NextRequest('http://localhost:3000/api/persons');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
  });
});

describe('POST /api/persons', () => {
  it('作曲者を作成', async () => {
    const newPerson = { id: 1, names: ['New'] /* ... */ };
    (prisma.person.create as jest.Mock).mockResolvedValue(newPerson);

    const request = new NextRequest('http://localhost:3000/api/persons', {
      method: 'POST',
      body: JSON.stringify({ names: ['New'] }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBe(1);
  });

  it('不正なデータの場合は400エラー', async () => {
    const request = new NextRequest('http://localhost:3000/api/persons', {
      method: 'POST',
      body: JSON.stringify({ names: [] }), // 空配列
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
```

---

### ❌ テストしなくてよいもの

#### 1. MUIコンポーネントの内部動作

```typescript
// ❌ Bad: MUIの動作をテストしている
it('Buttonがクリック可能', () => {
  render(<MuiButton>Click</MuiButton>);
  // MUIが既にテストしている
});
```

#### 2. シンプルな表示のみのコンポーネント

```typescript
// ❌ Bad: ロジックがないコンポーネント
export const Title: React.FC<{ text: string }> = ({ text }) => {
  return <Typography variant="h1">{text}</Typography>;
};
// テスト不要
```

#### 3. Next.jsの機能

```typescript
// ❌ Bad: Next.jsのルーティング機能をテスト
it('リンクが正しく動作する', () => {
  render(<Link href="/about">About</Link>);
  // Next.jsが既にテストしている
});
```

#### 4. 外部ライブラリの機能

```typescript
// ❌ Bad: Prismaのクエリビルダーをテスト
it('PrismaのfindManyが動作する', async () => {
  const result = await prisma.person.findMany();
  // Prismaが既にテストしている
});
```

#### 5. 型定義のみのファイル

```typescript
// types/person.ts
export type PersonId = number;
export interface PersonInput {
  names: string[];
}
// テスト不要
```

---

## テストのベストプラクティス

### 1. AAA パターン（Arrange-Act-Assert）

```typescript
it('example test', () => {
  // Arrange（準備）
  const input = { names: ['Test'] };
  const service = new PersonService(mockRepository);

  // Act（実行）
  const result = service.createPerson(input);

  // Assert（検証）
  expect(result).toBeDefined();
});
```

### 2. 1つのテストケースで1つのことだけ検証

```typescript
// ✅ Good
it('名称が空の場合はエラー', () => {
  expect(() => validate({ names: [] })).toThrow();
});

it('没年が生年より前の場合はエラー', () => {
  expect(() => validate({ birthYear: 1950, deathYear: 1900 })).toThrow();
});

// ❌ Bad
it('バリデーションエラー', () => {
  expect(() => validate({ names: [] })).toThrow();
  expect(() => validate({ birthYear: 1950, deathYear: 1900 })).toThrow();
  expect(() => validate({ names: [''] })).toThrow();
});
```

### 3. テストデータはファクトリーで生成

```typescript
// tests/helpers/factories.ts
export const createPerson = (overrides?: Partial<Person>): Person => {
  return new Person(
    overrides?.id ?? 1,
    overrides?.names ?? ['Default Name'],
    overrides?.bio ?? null,
    overrides?.birthYear ?? 1900,
    overrides?.deathYear ?? null,
    overrides?.country ?? null,
    overrides?.createdAt ?? new Date(),
    overrides?.createdByUserId ?? 1
  );
};

// テストで使用
const person = createPerson({ names: ['Custom Name'] });
```

### 4. モックは最小限に

```typescript
// ✅ Good: 必要な部分だけモック
const mockRepository = {
  findById: jest.fn(),
  create: jest.fn(),
} as unknown as IPersonRepository;

// ❌ Bad: 全メソッドをモック（使わないのに）
const mockRepository = {
  findById: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  search: jest.fn(),
  addName: jest.fn(),
  removeName: jest.fn(),
} as IPersonRepository;
```

### 5. テストの説明は日本語でOK

```typescript
describe('Person Entity', () => {
  it('日本語名称のアルファベット順で最初のものを返す', () => {
    // ...
  });
});
```

### 6. エラーケースを優先的にテスト

```typescript
describe('createPerson', () => {
  // エラーケースを先に書く
  it('名称が空の場合はエラー', () => {
    /* ... */
  });
  it('重複している場合はエラー', () => {
    /* ... */
  });

  // 正常系は最後
  it('正常に作成できる', () => {
    /* ... */
  });
});
```

---

## モック戦略

### 1. Prismaのモック

```typescript
// tests/helpers/setup.ts
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

jest.mock('@/infrastructure/database/prisma', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
```

### 2. Next Authのモック

```typescript
// tests/helpers/mocks.ts
export const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: '2025-12-31',
};

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: mockSession, status: 'authenticated' }),
}));
```

### 3. API Routeのモック

```typescript
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'mock data' }),
    ok: true,
    status: 200,
  })
) as jest.Mock;
```

---

## カバレッジ目標

### 全体

- **Line Coverage**: 70%以上
- **Branch Coverage**: 60%以上
- **Function Coverage**: 70%以上

### レイヤー別

| レイヤー                  | 目標カバレッジ | 優先度  |
| ------------------------- | -------------- | ------- |
| Domain（Entity, Service） | 90%+           | 🔴 最高 |
| Lib（Utils, Validations） | 90%+           | 🔴 最高 |
| Repository                | 80%+           | 🟡 高   |
| API Routes                | 70%+           | 🟡 高   |
| Components（Atoms）       | 60%+           | 🟢 中   |
| Components（Molecules）   | 50%+           | 🟢 中   |
| Components（Organisms）   | 30%+           | ⚪ 低   |
| Components（Features）    | 30%+           | ⚪ 低   |

---

## テスト実行コマンド

```bash
# 全テスト実行
pnpm test

# Watch モード
pnpm test:watch

# カバレッジ表示
pnpm test:coverage

# 特定ファイルのみ
pnpm test person.entity.test.ts

# 特定パターン
pnpm test --testPathPattern=domain

# 更新されたファイルのみ
pnpm test --onlyChanged
```

---

## CI/CDでのテスト

### GitHub Actions設定例

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## テスト作成の優先順位

### Phase 1（初期実装時）

1. ✅ ドメインロジック（Entity, Service）
2. ✅ ユーティリティ関数
3. ✅ バリデーション

### Phase 2（機能追加時）

4. ✅ API Routes（主要エンドポイント）
5. ✅ Repository（CRUD操作）
6. ✅ 重要なコンポーネント（Atoms, Molecules）

### Phase 3（余裕があれば）

7. 🟡 統合テスト
8. 🟡 複雑なOrganism
9. 🟡 E2Eテスト（Playwright導入）

---

## まとめ

### DO（推奨）

- ✅ ドメインロジックは必ずテスト
- ✅ エラーケースを優先的にテスト
- ✅ AAAパターンに従う
- ✅ ファクトリーでテストデータ生成
- ✅ モックは最小限に

### DON'T（非推奨）

- ❌ 外部ライブラリの動作をテストしない
- ❌ 単純な表示コンポーネントはテスト不要
- ❌ 100%カバレッジを目指さない
- ❌ 1つのテストで複数のことを検証しない
- ❌ 過度なモックは避ける

### 重要な原則

- **実用性優先**: 意味のあるテストを書く
- **段階的に**: 最初から完璧を目指さない
- **保守性**: テストも読みやすく、メンテしやすく
- **効率性**: 重要な部分に集中
