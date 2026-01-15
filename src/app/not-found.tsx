import { Typography, Box, Button } from '@mui/material';
import NextLink from 'next/link';
import { MainLayout } from '@/components/templates/MainLayout';

export default function NotFound() {
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
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          ページが見つかりません
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          お探しのページは存在しないか、移動した可能性があります。
        </Typography>
        <Button variant="contained" component={NextLink} href="/">
          トップページへ戻る
        </Button>
      </Box>
    </MainLayout>
  );
}
