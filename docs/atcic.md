# アトミックデザインルール

## 概要
このプロジェクトでは、アトミックデザインの概念を**緩く**適用します。
厳密な分類にこだわらず、コンポーネントの再利用性と保守性を向上させることを目的とします。

---

## ディレクトリ構造
```
src/
└── components/
    ├── atoms/           # 最小単位のコンポーネント
    ├── molecules/       # Atomsを組み合わせた小さなコンポーネント
    ├── organisms/       # Molecules/Atomsを組み合わせた大きなコンポーネント
    ├── templates/       # ページのレイアウト
    └── features/        # 機能別コンポーネント（ドメイン別）
        ├── person/
        ├── piece/
        ├── auth/
        └── ...
```

---

## 各レイヤーの定義

### Atoms（原子）
**最小単位の再利用可能なコンポーネント**

**特徴**:
- これ以上分割できない
- プロジェクト全体で汎用的に使える
- 外部状態に依存しない
- MUIコンポーネントのラッパーも含む

**例**:
- Button
- Input
- Label
- Icon
- Link
- Chip
- Avatar

#### ディレクトリ構造
```
src/components/atoms/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   └── index.ts
├── Input/
│   ├── Input.tsx
│   ├── Input.test.tsx
│   └── index.ts
└── ...
```

#### 実装例: `src/components/atoms/Button/Button.tsx`
```typescript
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

export interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  loading = false,
  disabled,
  children,
  ...props
}) => {
  return (
    <MuiButton
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </MuiButton>
  );
};
```

---

### Molecules（分子）
**Atomsを組み合わせた小さな機能単位**

**特徴**:
- 複数のAtomsを組み合わせる
- 単一の明確な責務を持つ
- プロジェクト全体で再利用可能
- 軽い状態管理を持つことがある

**例**:
- SearchForm
- LanguageSwitch
- LoginButton
- TagChip
- PersonCard

#### ディレクトリ構造
```
src/components/molecules/
├── SearchForm/
│   ├── SearchForm.tsx
│   ├── SearchForm.test.tsx
│   └── index.ts
├── LanguageSwitch/
└── ...
```

#### 実装例: `src/components/molecules/SearchForm/SearchForm.tsx`
```typescript
import { useState } from 'react';
import { Box, TextField } from '@mui/material';
import { Button } from '@/components/atoms/Button';

export interface SearchFormProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  placeholder = 'Search...',
  onSearch
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        size="small"
        fullWidth
      />
      <Button type="submit" variant="contained">
        Search
      </Button>
    </Box>
  );
};
```

---

### Organisms（有機体）
**Molecules/Atomsを組み合わせた大きな機能ブロック**

**特徴**:
- ページの一部を構成する大きな単位
- 複雑な状態管理を持つことがある
- ビジネスロジックを含むことがある
- 特定のドメインに依存することがある

**例**:
- Header
- Footer
- PersonDetailCard
- PieceList
- VideoPlayer
- EditRequestForm

#### ディレクトリ構造
```
src/components/organisms/
├── Header/
│   ├── Header.tsx
│   ├── Header.test.tsx
│   └── index.ts
├── Footer/
├── PersonDetailCard/
└── ...
```

#### 実装例: `src/components/organisms/Header/Header.tsx`
```typescript
'use client';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { LanguageSwitch } from '@/components/molecules/LanguageSwitch';
import { LoginButton } from '@/components/molecules/LoginButton';
import { useSession } from 'next-auth/react';

export const Header: React.FC = () => {
  const { data: session } = useSession();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Classical Guitar Wiki
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <LanguageSwitch />
          <LoginButton isLoggedIn={!!session} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
```

---

### Templates（テンプレート）
**ページのレイアウト構造**

**特徴**:
- ページの骨組みを定義
- Organismsを配置
- 具体的なコンテンツを持たない
- レイアウトのみに集中

**例**:
- MainLayout
- AuthLayout
- AdminLayout

#### ディレクトリ構造
```
src/components/templates/
├── MainLayout/
│   ├── MainLayout.tsx
│   └── index.ts
├── AuthLayout/
└── ...
```

#### 実装例: `src/components/templates/MainLayout/MainLayout.tsx`
```typescript
import { Box, Container } from '@mui/material';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
};
```

---

### Features（機能別コンポーネント）
**ドメイン別の機能固有コンポーネント**

**特徴**:
- 特定のドメインに強く依存
- Atoms/Molecules/Organismsのいずれかに分類しにくいもの
- 再利用性は低いが、関連機能をまとめる

**例**:
- PersonSearchResults
- PieceDetailView
- EditRequestList
- FavoritesList

#### ディレクトリ構造
```
src/components/features/
├── person/
│   ├── PersonSearchResults/
│   ├── PersonDetailView/
│   └── PersonEditForm/
├── piece/
│   ├── PieceSearchResults/
│   ├── PieceDetailView/
│   └── PieceEditForm/
└── ...
```

#### 実装例: `src/components/features/person/PersonDetailView/PersonDetailView.tsx`
```typescript
import { Box, Typography, Chip, Divider } from '@mui/material';
import { Person } from '@/domain/person/person.entity';

export interface PersonDetailViewProps {
  person: Person;
  language: 'ja' | 'en';
}

export const PersonDetailView: React.FC<PersonDetailViewProps> = ({
  person,
  language
}) => {
  const mainName = language === 'ja'
    ? person.getJapaneseMainName()
    : person.getEnglishMainName();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {mainName}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Also known as:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {person.names
            .filter(name => name !== mainName)
            .map(name => (
              <Chip key={name} label={name} size="small" />
            ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {person.birthYear && (
        <Typography>
          Born: {person.birthYear}
          {person.deathYear && ` - ${person.deathYear}`}
          {person.isAlive() && ' (Alive)'}
        </Typography>
      )}

      {person.country && (
        <Typography>Country: {person.country}</Typography>
      )}

      {person.bio && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Biography</Typography>
          <Typography>{person.bio}</Typography>
        </Box>
      )}
    </Box>
  );
};
```

---

## 分類の判断基準

### どのレイヤーに配置すべきか？

#### フローチャート
```
コンポーネントを作る
    ↓
┌─────────────────────────────┐
│これ以上分割できない？        │ YES → Atoms
└─────────────────────────────┘
    ↓ NO
┌─────────────────────────────┐
│プロジェクト全体で汎用的？    │ YES → Molecules
└─────────────────────────────┘
    ↓ NO
┌─────────────────────────────┐
│ページの大きな構成要素？      │ YES → Organisms
└─────────────────────────────┘
    ↓ NO
┌─────────────────────────────┐
│レイアウトのみ？              │ YES → Templates
└─────────────────────────────┘
    ↓ NO
    ↓
  Features（ドメイン別）
```

---

## 実装ルール

### ✅ DO（推奨）

1. **コンポーネントは1ファイル1コンポーネント**
```
   Button/
   ├── Button.tsx      # メインコンポーネント
   ├── Button.test.tsx # テスト
   └── index.ts        # エクスポート
```

2. **propsの型を明示的に定義**
```typescript
   export interface ButtonProps {
     variant?: 'contained' | 'outlined' | 'text';
     loading?: boolean;
     onClick?: () => void;
   }
```

3. **デフォルトpropsを設定**
```typescript
   export const Button: React.FC<ButtonProps> = ({
     variant = 'contained',
     loading = false,
     ...props
   }) => {
     // ...
   };
```

4. **index.tsでエクスポート**
```typescript
   export { Button } from './Button';
   export type { ButtonProps } from './Button';
```

5. **Storybookを書く**（余裕があれば）
```typescript
   // Button.stories.tsx
   export default {
     component: Button,
     title: 'Atoms/Button',
   };
```

---

### ❌ DON'T（非推奨）

1. **Atomsに複雑な状態管理を持たせない**
```typescript
   // ❌ Bad
   export const Button: React.FC = () => {
     const [count, setCount] = useState(0);
     const dispatch = useDispatch();
     // ...
   };
```

2. **Atomsを特定ドメインに依存させない**
```typescript
   // ❌ Bad
   export const Button: React.FC<{ person: Person }> = ({ person }) => {
     return <button>{person.getJapaneseMainName()}</button>;
   };
```

3. **Organismsを過度に抽象化しない**
   - 再利用されないならFeaturesに配置する

4. **深いネストを避ける**
```typescript
   // ❌ Bad
   <Organism>
     <Molecule>
       <Atom>
         <Atom>
           <Atom>...</Atom>
         </Atom>
       </Atom>
     </Molecule>
   </Organism>
```

---

## MUIとの統合

### MUIコンポーネントのラッパー戦略

#### パターン1: シンプルなラッパー（推奨）
```typescript
// Atoms/Button.tsx
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

export type ButtonProps = MuiButtonProps;

export const Button: React.FC<ButtonProps> = (props) => {
  return <MuiButton {...props} />;
};
```

#### パターン2: カスタマイズ追加
```typescript
// Atoms/Button.tsx
export interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  loading,
  disabled,
  children,
  ...props
}) => {
  return (
    <MuiButton disabled={disabled || loading} {...props}>
      {loading ? <CircularProgress size={20} /> : children}
    </MuiButton>
  );
};
```

#### パターン3: 直接MUIを使用
Atoms/Molecules/Organismsで直接MUIを使ってもOK
```typescript
import { Box, Typography } from '@mui/material';

export const Header: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6">Header</Typography>
    </Box>
  );
};
```

---

## Pageでの使用例

#### `src/app/(main)/persons/[id]/page.tsx`
```typescript
import { MainLayout } from '@/components/templates/MainLayout';
import { PersonDetailView } from '@/components/features/person/PersonDetailView';
import { PersonRepository } from '@/infrastructure/repositories/person.repository';

export default async function PersonPage({ params }: { params: { id: string } }) {
  const repository = new PersonRepository();
  const person = await repository.findById(Number(params.id));

  if (!person) {
    return <div>Not found</div>;
  }

  return (
    <MainLayout>
      <PersonDetailView person={person} language="ja" />
    </MainLayout>
  );
}
```

---

## ベストプラクティス

### 1. コンポーネントの命名
- **Atoms**: 一般的な名前（Button, Input, Label）
- **Molecules**: 機能的な名前（SearchForm, LoginButton）
- **Organisms**: 具体的な名前（PersonDetailCard, PieceList）
- **Features**: ドメイン + 機能（PersonSearchResults）

### 2. Props設計
- **明示的な型定義**
- **オプショナルpropsにはデフォルト値**
- **children propsを適切に使う**

### 3. 状態管理
- **Atoms**: 状態なし
- **Molecules**: ローカル状態のみ
- **Organisms**: Context/Redux可
- **Features**: 自由

### 4. スタイリング
- **MUIのsxプロップ使用**
- **テーマカラーを使う**
- **レスポンシブ対応**

---

## テスト戦略

### Atoms
- **Props変更時の描画確認**
- **イベントハンドラの動作確認**

### Molecules
- **統合的な動作確認**
- **フォーム送信等のシナリオテスト**

### Organisms
- **主要な機能のE2Eテスト**
- **モックを活用**

---

## まとめ

- **厳密な分類にこだわらない**
- **迷ったらFeaturesに配置**
- **再利用性が高まったらAtomsへ移動**
- **MUIを直接使ってもOK**
- **段階的にリファクタリング**
