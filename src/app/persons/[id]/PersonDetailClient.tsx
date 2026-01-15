'use client';
import { Typography, Box, Grid, Chip, Divider, Paper } from '@mui/material';
import { Person } from '@/domain/person';
import { Piece } from '@/domain/piece';
import { PieceCard } from '@/components/molecules/PieceCard';
import { useLanguage } from '@/hooks/useLanguage';

interface PersonDetailClientProps {
  person: Person;
  composedPieces: Piece[];
  arrangedPieces: Piece[];
}

export function PersonDetailClient({
  person,
  composedPieces,
  arrangedPieces,
}: PersonDetailClientProps) {
  const { language } = useLanguage();
  const mainName = person.getMainName(language);
  const subName =
    language === 'ja'
      ? person.getEnglishMainName()
      : person.getJapaneseMainName();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {mainName}
      </Typography>

      {subName && (
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {subName}
        </Typography>
      )}

      {person.names.length > 2 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {person.names
            .filter((n) => n !== mainName && n !== subName)
            .map((name) => (
              <Chip key={name} label={name} size="small" variant="outlined" />
            ))}
        </Box>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          {(person.birthYear || person.deathYear) && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                生没年
              </Typography>
              <Typography>
                {person.birthYear || '?'} - {person.deathYear || (person.birthYear ? '存命' : '?')}
              </Typography>
            </Grid>
          )}
          {person.country && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                国籍
              </Typography>
              <Typography>{person.country}</Typography>
            </Grid>
          )}
          {person.bio && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                経歴
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {person.bio}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {composedPieces.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            作曲した楽曲
          </Typography>
          <Grid container spacing={2}>
            {composedPieces.map((piece) => (
              <Grid item xs={12} sm={6} md={4} key={piece.id}>
                <PieceCard piece={piece} language={language} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {arrangedPieces.length > 0 && (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            編曲した楽曲
          </Typography>
          <Grid container spacing={2}>
            {arrangedPieces.map((piece) => (
              <Grid item xs={12} sm={6} md={4} key={piece.id}>
                <PieceCard piece={piece} language={language} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
