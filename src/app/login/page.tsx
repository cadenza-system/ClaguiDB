'use client';
import { Box, Typography, Paper, Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { MainLayout } from '@/components/templates/MainLayout';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    alert('Google認証は準備中です');
  };

  return (
    <MainLayout>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <Paper sx={{ p: 6, textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            ログイン
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Googleアカウントでログインして、お気に入りの楽曲を保存したり、新しい楽曲を追加したりしましょう。
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            fullWidth
          >
            Googleでログイン
          </Button>
        </Paper>
      </Box>
    </MainLayout>
  );
}
