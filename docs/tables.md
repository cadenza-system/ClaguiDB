# クラシックギターWiki - データベーススキーマ定義

## 概要
- データベース：MySQL 8.0+
- ORM：Prisma
- 論理削除を採用（deleted_at カラム）

---

## テーブル一覧

### コアデータ（10テーブル）
1. users
2. admins
3. persons
4. person_names
5. pieces
6. piece_names
7. tags
8. piece_tags
9. youtube_videos
10. favorites

### 編集リクエスト（8テーブル）
11. edit_requests_person_create
12. edit_requests_person_update
13. edit_requests_person_name_add
14. edit_requests_person_name_delete
15. edit_requests_piece_create
16. edit_requests_piece_update
17. edit_requests_piece_name_add
18. edit_requests_piece_name_delete

**合計：18テーブル**

---

## コアデータテーブル

### 1. users（ユーザー）
```sql
id                  INT PRIMARY KEY AUTO_INCREMENT
google_id           VARCHAR(255) UNIQUE NOT NULL
email               VARCHAR(255) NOT NULL
name                VARCHAR(255) NOT NULL
created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
is_premium          BOOLEAN NOT NULL DEFAULT FALSE
stripe_customer_id  VARCHAR(255) NULL
```

**説明**
- Google OAuthで認証
- is_premium：サブスク会員フラグ
- stripe_customer_id：Stripe顧客ID

---

### 2. admins（管理者）
```sql
id          INT PRIMARY KEY AUTO_INCREMENT
user_id     INT UNIQUE NOT NULL
created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id)
```

**説明**
- 管理者権限を持つユーザー

---

### 3. persons（人物：作曲家・編曲者）
```sql
id                  INT PRIMARY KEY AUTO_INCREMENT
bio                 TEXT NULL
birth_year          INT NULL
death_year          INT NULL
country             VARCHAR(255) NULL
created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
created_by_user_id  INT NOT NULL
deleted_at          DATETIME NULL
deleted_by_user_id  INT NULL

FOREIGN KEY (created_by_user_id) REFERENCES users(id)
FOREIGN KEY (deleted_by_user_id) REFERENCES users(id)
```

**説明**
- 作曲家・編曲者の基本情報
- 名称は person_names テーブルで管理

---

### 4. person_names（人物名称）
```sql
id          INT PRIMARY KEY AUTO_INCREMENT
person_id   INT NOT NULL
name        VARCHAR(500) NOT NULL
created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
deleted_at  DATETIME NULL

FOREIGN KEY (person_id) REFERENCES persons(id)
INDEX idx_person_names_name (name) WHERE deleted_at IS NULL
```

**説明**
- 1人物に対して複数の名称（別名・表記揺れ対応）
- 昇順ソート後、日本語/英語それぞれの先頭がメイン表記

---

### 5. pieces（楽曲）
```sql
id                  INT PRIMARY KEY AUTO_INCREMENT
composer_id         INT NOT NULL
arranger_id         INT NULL
parent_piece_id     INT NULL
composition_year    INT NULL
sheet_music_info    TEXT NULL
created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
created_by_user_id  INT NOT NULL
deleted_at          DATETIME NULL
deleted_by_user_id  INT NULL

FOREIGN KEY (composer_id) REFERENCES persons(id)
FOREIGN KEY (arranger_id) REFERENCES persons(id)
FOREIGN KEY (parent_piece_id) REFERENCES pieces(id)
FOREIGN KEY (created_by_user_id) REFERENCES users(id)
FOREIGN KEY (deleted_by_user_id) REFERENCES users(id)

INDEX idx_pieces_composer_id (composer_id)
INDEX idx_pieces_arranger_id (arranger_id)
INDEX idx_pieces_parent_piece_id (parent_piece_id)
```

**説明**
- 楽曲の基本情報
- parent_piece_id：組曲の楽章の場合に使用
- 名称は piece_names テーブルで管理

---

### 6. piece_names（楽曲名称）
```sql
id          INT PRIMARY KEY AUTO_INCREMENT
piece_id    INT NOT NULL
name        VARCHAR(500) NOT NULL
created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
deleted_at  DATETIME NULL

FOREIGN KEY (piece_id) REFERENCES pieces(id)
INDEX idx_piece_names_name (name) WHERE deleted_at IS NULL
```

**説明**
- 1楽曲に対して複数の名称（別名・表記揺れ対応）
- 昇順ソート後、日本語/英語それぞれの先頭がメイン表記

---

### 7. tags（タグ）
```sql
id                  INT PRIMARY KEY AUTO_INCREMENT
name                VARCHAR(255) UNIQUE NOT NULL
created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
created_by_user_id  INT NOT NULL
deleted_at          DATETIME NULL
deleted_by_user_id  INT NULL

FOREIGN KEY (created_by_user_id) REFERENCES users(id)
FOREIGN KEY (deleted_by_user_id) REFERENCES users(id)
```

**説明**
- ユーザーが自由に作成可能（即時反映）
- 例：「バロック」「ロマン派」「初心者向け」など

---

### 8. piece_tags（楽曲とタグの中間テーブル）
```sql
id                  INT PRIMARY KEY AUTO_INCREMENT
piece_id            INT NOT NULL
tag_id              INT NOT NULL
created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
created_by_user_id  INT NOT NULL
deleted_at          DATETIME NULL

FOREIGN KEY (piece_id) REFERENCES pieces(id)
FOREIGN KEY (tag_id) REFERENCES tags(id)
FOREIGN KEY (created_by_user_id) REFERENCES users(id)

UNIQUE (piece_id, tag_id)
INDEX idx_piece_tags_piece_id (piece_id)
INDEX idx_piece_tags_tag_id (tag_id)
```

**説明**
- 楽曲とタグの多対多関係
- タグ付けは即時反映

---

### 9. youtube_videos（YouTube動画）
```sql
id                      INT PRIMARY KEY AUTO_INCREMENT
piece_id                INT NOT NULL
url                     VARCHAR(500) NOT NULL
approval_status         ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'
created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
created_by_user_id      INT NOT NULL
approved_by_admin_id    INT NULL
deleted_at              DATETIME NULL
deleted_by_user_id      INT NULL

FOREIGN KEY (piece_id) REFERENCES pieces(id)
FOREIGN KEY (created_by_user_id) REFERENCES users(id)
FOREIGN KEY (approved_by_admin_id) REFERENCES users(id)
FOREIGN KEY (deleted_by_user_id) REFERENCES users(id)

INDEX idx_youtube_videos_piece_id (piece_id)
INDEX idx_youtube_videos_approval_status (approval_status) WHERE deleted_at IS NULL
```

**説明**
- 楽曲に紐づくYouTube動画
- ユーザー追加は承認制
- 承認済みのみ一般公開

---

### 10. favorites（お気に入り）
```sql
id          INT PRIMARY KEY AUTO_INCREMENT
user_id     INT NOT NULL
piece_id    INT NOT NULL
created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
deleted_at  DATETIME NULL

FOREIGN KEY (user_id) REFERENCES users(id)
FOREIGN KEY (piece_id) REFERENCES pieces(id)

UNIQUE (user_id, piece_id)
INDEX idx_favorites_user_id (user_id)
```

**説明**
- ユーザーのお気に入り楽曲

---

## 編集リクエストテーブル

### 11. edit_requests_person_create（人物新規作成）
```sql
id                      INT PRIMARY KEY AUTO_INCREMENT
names                   JSON NOT NULL
bio                     TEXT NULL
birth_year              INT NULL
death_year              INT NULL
country                 VARCHAR(255) NULL
status                  ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'
created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
created_by_user_id      INT NOT NULL
reviewed_at             DATETIME NULL
reviewed_by_admin_id    INT NULL
review_comment          TEXT NULL
created_person_id       INT NULL

FOREIGN KEY (created_by_user_id) REFERENCES users(id)
FOREIGN KEY (reviewed_by_admin_id) REFERENCES users(id)
FOREIGN KEY (created_person_id) REFERENCES persons(id)

INDEX idx_edit_requests_person_create_status (status)
```

**説明**
- names：配列形式 `["Name1", "Name2"]`
- 承認後、persons テーブルにレコード作成
- created_person_id に作成されたIDを記録

---

### 12. edit_requests_person_update（人物基本情報編集）
```sql
id                      INT PRIMARY KEY AUTO_INCREMENT
person_id               INT NOT NULL
bio                     TEXT NULL
birth_year              INT NULL
death_year              INT NULL
country                 VARCHAR(255) NULL
status                  ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'
created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
created_by_user_id      INT NOT NULL
reviewed_at             DATETIME NULL
reviewed_by_admin_id    INT NULL
review_comment          TEXT NULL

FOREIGN KEY (person_id) REFERENCES persons(id)
FOREIGN KEY (created_by_user_id) REFERENCES users(id)
FOREIGN KEY (reviewed_by_admin_id) REFERENCES users(id)

INDEX idx_edit_requests_person_update_status (status)
```

**説明**
- NULLフィールドは「変更なし」を意味
- 承認後、persons テーブルを更新

---

### 13. edit_requests_person_name_add（人物名称追加）
```sql
id                      INT PRIMARY KEY AUTO_INCREMENT
person_id               INT NOT NULL
name                    VARCHAR(500) NOT NULL
status                  ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'
created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
created_by_user_id      INT NOT NULL
reviewed_at             DATETIME NULL
reviewed_by_admin_id    INT NULL
review_comment          TEXT NULL
created_person_name_id  INT NULL

FOREIGN KEY (person_id) REFERENCES persons(id)
FOREIGN KEY (created_by_user_id) REFERENCES users(id)
FOREIGN KEY (reviewed_by_admin_id) REFERENCES users(id)
FOREIGN KEY (created_person_name_id) REFERENCES person_names(id)

INDEX idx_edit_requests_person_name_add_status (status)
```

**説明**
- 承認後、person_names テーブルにレコード作成

---

### 14. edit_requests_person_name_delete（人物名称削除）
```sql
id                      INT PRIMARY KEY AUTO_INCREMENT
person_name_id          INT NOT NULL
status                  ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'
created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
created_by_user_id      INT NOT NULL
reviewed_at             DATETIME NULL
reviewed_by_admin_id    INT NULL
review_comment          TEXT NULL

FOREIGN KEY (person_name_id) REFERENCES person_names(id)
FOREIGN KEY (created_by_user_id) REFERENCES users(id)
FOREIGN KEY (reviewed_by_admin_id) REFERENCES users(id)

INDEX idx_edit_requests_person_name_delete_status (status)
```

**説明**
- 承認後、person_names テーブルの該当レコードを論理削除

---

### 15. edit_requests_piece_create（楽曲新規作成）
```sql
id                      INT PRIMARY KEY AUTO_INCREMENT
names                   JSON NOT NULL
composer_id             INT NOT NULL
arranger_id             INT NULL
parent_piece_id         INT NULL
composition_year        INT NULL
sheet_music_info        TEXT NULL
status                  ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'
created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
created_by_user_id      INT NOT NULL
reviewed_at             DATETIME NULL
reviewed_by_admin_id    INT NULL
review_comment          TEXT NULL
created_piece_id        INT NULL

FOREIGN KEY (composer_id) REFERENCES persons(id)
FOREIGN KEY (arranger_id) REFERENCES persons(id)
FOREIGN KEY (parent_piece_id) REFERENCES pieces(id)
FOREIGN KEY (created_by_user_id) REFERENCES users(id)
FOREIGN KEY (reviewed_by_admin_id) REFERENCES users(id)
FOREIGN KEY (created_piece_id) REFERENCES pieces(id)

INDEX idx_edit_requests_piece_create_status (status)
```

**説明**
- names：配列形式 `["Name1", "Name2"]`
- 承認後、pieces テーブルにレコード作成

---

### 16. edit_requests_piece_update（楽曲基本情報編集）
```sql
id                      INT PRIMARY KEY AUTO_INCREMENT
piece_id                INT NOT NULL
composer_id             INT NULL
arranger_id             INT NULL
parent_piece_id         INT NULL
composition_year        INT NULL
sheet_music_info        TEXT NULL
status                  ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'
created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
created_by_user_id      INT NOT NULL
reviewed_at             DATETIME NULL
reviewed_by_admin_id    INT NULL
review_comment          TEXT NULL

FOREIGN KEY (piece_id) REFERENCES pieces(id)
FOREIGN KEY (composer_id) REFERENCES persons(id)
FOREIGN KEY (arranger_id) REFERENCES persons(id)
FOREIGN KEY (parent_piece_id) REFERENCES pieces(id)
FOREIGN KEY (created_by_user_id) REFERENCES users(id)
FOREIGN KEY (reviewed_by_admin_id) REFERENCES users(id)

INDEX idx_edit_requests_piece_update_status (status)
```

**説明**
- NULLフィールドは「変更なし」を意味
- 承認後、pieces テーブルを更新

---

### 17. edit_requests_piece_name_add（楽曲名称追加）
```sql
id                      INT PRIMARY KEY AUTO_INCREMENT
piece_id                INT NOT NULL
name                    VARCHAR(500) NOT NULL
status                  ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'
created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
created_by_user_id      INT NOT NULL
reviewed_at             DATETIME NULL
reviewed_by_admin_id    INT NULL
review_comment          TEXT NULL
created_piece_name_id   INT NULL

FOREIGN KEY (piece_id) REFERENCES pieces(id)
FOREIGN KEY (created_by_user_id) REFERENCES users(id)
FOREIGN KEY (reviewed_by_admin_id) REFERENCES users(id)
FOREIGN KEY (created_piece_name_id) REFERENCES piece_names(id)

INDEX idx_edit_requests_piece_name_add_status (status)
```

**説明**
- 承認後、piece_names テーブルにレコード作成

---

### 18. edit_requests_piece_name_delete（楽曲名称削除）
```sql
id                      INT PRIMARY KEY AUTO_INCREMENT
piece_name_id           INT NOT NULL
status                  ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'
created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
created_by_user_id      INT NOT NULL
reviewed_at             DATETIME NULL
reviewed_by_admin_id    INT NULL
review_comment          TEXT NULL

FOREIGN KEY (piece_name_id) REFERENCES piece_names(id)
FOREIGN KEY (created_by_user_id) REFERENCES users(id)
FOREIGN KEY (reviewed_by_admin_id) REFERENCES users(id)

INDEX idx_edit_requests_piece_name_delete_status (status)
```

**説明**
- 承認後、piece_names テーブルの該当レコードを論理削除

---

## インデックス戦略

### 検索性能向上
- person_names.name
- piece_names.name
- 論理削除を考慮（WHERE deleted_at IS NULL）

### 外部キー
- 自動生成されない場合は明示的に作成
- pieces の composer_id, arranger_id, parent_piece_id
- youtube_videos の piece_id
- favorites の user_id

### ステータスフィルタリング
- 承認待ちクエリの高速化
- 各 edit_requests テーブルの status カラム

---

## 論理削除の仕様

### 対象テーブル
- persons
- pieces
- tags
- youtube_videos
- person_names
- piece_names
- piece_tags
- favorites

### 削除時の処理
- deleted_at に現在時刻を設定
- deleted_by_user_id に削除実行者を記録
- 物理削除は行わない

### クエリ時の注意
- 常に `WHERE deleted_at IS NULL` を条件に追加
- Prismaの場合はグローバルミドルウェアで対応推奨

---

## 制約・ルール

### UNIQUE制約
- users.google_id
- admins.user_id
- tags.name
- piece_tags (piece_id, tag_id)
- favorites (user_id, piece_id)

### NOT NULL制約
- 必須フィールドはすべてNOT NULL
- 外部キーも基本的にNOT NULL（一部例外あり）

### デフォルト値
- created_at：CURRENT_TIMESTAMP
- updated_at：CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
- is_premium：FALSE
- approval_status：'pending'
- status：'pending'

---

## 名称管理の仕様

### メイン表記の決定ロジック
1. person_names / piece_names から deleted_at IS NULL のレコードを取得
2. name カラムで昇順ソート
3. 日本語（ひらがな・カタカナ・漢字）で始まる名称のうち最初のもの → 日本語メイン表記
4. 英語（アルファベット）で始まる名称のうち最初のもの → 英語メイン表記

### 実装時の注意
- アプリケーション層でソート・判定を行う
- キャッシュ推奨（頻繁に使用されるため）