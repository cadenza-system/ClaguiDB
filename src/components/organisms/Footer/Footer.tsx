'use client';
import { Box, Container, Typography, Divider } from '@mui/material';
import NextLink from 'next/link';

export interface FooterProps {
  showAd?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ showAd = true }) => {
  return (
    <Box component="footer" sx={{ mt: 'auto', bgcolor: 'grey.100' }}>
      {showAd && (
        <Box sx={{ py: 2, bgcolor: 'grey.200', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            [広告エリア]
          </Typography>
        </Box>
      )}
      <Divider />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            flexWrap: 'wrap',
            mb: 2,
          }}
        >
          <Typography
            component={NextLink}
            href="/about"
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            このサイトについて
          </Typography>
          <Typography
            component={NextLink}
            href="/terms"
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            利用規約
          </Typography>
          <Typography
            component={NextLink}
            href="/privacy"
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            プライバシーポリシー
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          &copy; {new Date().getFullYear()} Classical Guitar Wiki
        </Typography>
      </Container>
    </Box>
  );
};
