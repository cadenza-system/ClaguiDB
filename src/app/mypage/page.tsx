'use client';
import { Typography, Box, Paper, Alert } from '@mui/material';
import { MainLayout } from '@/components/templates/MainLayout';

export default function MyPage() {
  // TODO: Get user session
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return (
      <MainLayout>
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <Alert severity="warning">
            このページを表示するにはログインが必要です。
          </Alert>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout isLoggedIn>
      <Typography variant="h4" component="h1" gutterBottom>
        マイページ
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          お気に入り楽曲
        </Typography>
        <Typography color="text.secondary">
          お気に入りに登録した楽曲がありません
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          サブスクリプション
        </Typography>
        <Typography color="text.secondary">
          現在のプラン: 無料
        </Typography>
      </Paper>
    </MainLayout>
  );
}
