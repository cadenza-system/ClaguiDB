# Classical Guitar Wiki

クラシックギターの楽曲と作曲家を管理するWikiアプリケーション

## 技術スタック

- Next.js 15 (App Router, Turbopack)
- React 19 / TypeScript
- MUI v6
- Prisma / MySQL 8.0
- Docker

## セットアップ

```bash
# Docker起動
docker-compose up -d

# マイグレーション実行
docker-compose exec app npx prisma migrate dev
```

http://localhost:3000 にアクセス

## 開発コマンド

```bash
npm run dev       # 開発サーバー
npm run build     # ビルド
npm test          # テスト
npm run lint      # Lint
npm run format    # フォーマット
```
