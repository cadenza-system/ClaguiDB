import { Typography, Container, Box } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Classical Guitar Wiki
        </Typography>
        <Typography variant="body1">
          クラシックギターの楽曲と作曲家を管理するWikiアプリケーション
        </Typography>
      </Box>
    </Container>
  );
}
