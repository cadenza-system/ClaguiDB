'use client';
import { Typography, Box, Button } from '@mui/material';
import { MainLayout } from '@/components/templates/MainLayout';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <MainLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold' }}>
          500
        </Typography>
        <Typography variant="h5" gutterBottom>
          エラーが発生しました
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          申し訳ございません。問題が発生しました。
        </Typography>
        <Button variant="contained" onClick={reset}>
          再試行
        </Button>
      </Box>
    </MainLayout>
  );
}
