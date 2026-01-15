'use client';
import { Box, Container } from '@mui/material';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';

export interface MainLayoutProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
  userName?: string;
  isPremium?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isLoggedIn = false,
  userName,
  isPremium = false,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header isLoggedIn={isLoggedIn} userName={userName} />
      <Container component="main" maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
      <Footer showAd={!isPremium} />
    </Box>
  );
};
