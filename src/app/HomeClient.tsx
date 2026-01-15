'use client';
import { Typography, Box, Grid, Paper } from '@mui/material';
import { PieceCard } from '@/components/molecules/PieceCard';
import { TagChip } from '@/components/molecules/TagChip';
import { Piece } from '@/domain/piece';
import { Tag } from '@/domain/tag';
import { useLanguage } from '@/hooks/useLanguage';

interface HomeClientProps {
  recentPieces: Piece[];
  popularPieces: Piece[];
  tags: Tag[];
}

export function HomeClient({
  recentPieces,
  popularPieces,
  tags,
}: HomeClientProps) {
  const { language } = useLanguage();

  return (
    <Box>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Classical Guitar Wiki
        </Typography>
        <Typography variant="body1" color="text.secondary">
          クラシックギターの楽曲と作曲家を探索しよう
        </Typography>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          新着楽曲
        </Typography>
        {recentPieces.length > 0 ? (
          <Grid container spacing={2}>
            {recentPieces.map((piece) => (
              <Grid item xs={12} sm={6} md={4} key={piece.id}>
                <PieceCard piece={piece} language={language} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">
            まだ楽曲が登録されていません
          </Typography>
        )}
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          人気の楽曲
        </Typography>
        {popularPieces.length > 0 ? (
          <Grid container spacing={2}>
            {popularPieces.map((piece) => (
              <Grid item xs={12} sm={6} md={4} key={piece.id}>
                <PieceCard piece={piece} language={language} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">
            まだお気に入りが登録されていません
          </Typography>
        )}
      </Box>

      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          タグ一覧
        </Typography>
        {tags.length > 0 ? (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {tags.map((tag) => (
              <TagChip key={tag.id} name={tag.name} />
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">
            まだタグが登録されていません
          </Typography>
        )}
      </Box>
    </Box>
  );
}
