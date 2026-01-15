'use client';
import { Card, CardContent, Typography, Box } from '@mui/material';
import NextLink from 'next/link';
import { Piece } from '@/domain/piece';
import { TagChip } from '../TagChip';

export interface PieceCardProps {
  piece: Piece;
  language: 'ja' | 'en';
  composerName?: string;
  arrangerName?: string;
}

export const PieceCard: React.FC<PieceCardProps> = ({
  piece,
  language,
  composerName,
  arrangerName,
}) => {
  const mainName = piece.getMainName(language);
  const subName =
    language === 'ja'
      ? piece.getEnglishMainName()
      : piece.getJapaneseMainName();

  return (
    <Card
      component={NextLink}
      href={`/pieces/${piece.id}`}
      sx={{
        textDecoration: 'none',
        '&:hover': { boxShadow: 4 },
        transition: 'box-shadow 0.2s',
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">
          {mainName}
        </Typography>
        {subName && (
          <Typography variant="body2" color="text.secondary">
            {subName}
          </Typography>
        )}
        <Box sx={{ mt: 1 }}>
          {composerName && (
            <Typography variant="body2" color="text.secondary">
              {composerName}
            </Typography>
          )}
          {arrangerName && (
            <Typography variant="caption" color="text.secondary">
              (arr. {arrangerName})
            </Typography>
          )}
        </Box>
        {piece.tags.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {piece.tags.slice(0, 3).map((tag) => (
              <TagChip key={tag} name={tag} />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
