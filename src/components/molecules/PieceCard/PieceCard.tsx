'use client';
import { Card, CardContent, Typography, Box } from '@mui/material';
import NextLink from 'next/link';
import { SerializedPiece } from '@/domain/piece';
import { TagChip } from '../TagChip';

function isJapanese(text: string): boolean {
  return /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
}

function getJapaneseMainName(names: string[]): string | null {
  const japaneseNames = names.filter((name) => isJapanese(name)).sort();
  return japaneseNames[0] || null;
}

function getEnglishMainName(names: string[]): string | null {
  const englishNames = names.filter((name) => !isJapanese(name)).sort();
  return englishNames[0] || null;
}

function getMainName(names: string[], language: 'ja' | 'en'): string {
  const mainName =
    language === 'ja'
      ? getJapaneseMainName(names)
      : getEnglishMainName(names);
  return mainName || names[0] || '';
}

export interface PieceCardProps {
  piece: SerializedPiece;
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
  const mainName = getMainName(piece.names, language);
  const subName =
    language === 'ja'
      ? getEnglishMainName(piece.names)
      : getJapaneseMainName(piece.names);

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
