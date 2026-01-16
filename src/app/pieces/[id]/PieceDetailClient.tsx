'use client';
import {
  Typography,
  Box,
  Grid,
  Chip,
  Paper,
  Card,
} from '@mui/material';
import NextLink from 'next/link';
import { SerializedPieceWithRelations, SerializedPiece } from '@/domain/piece';
import { SerializedPerson } from '@/domain/person';
import { SerializedYoutubeVideo } from '@/domain/youtube';
import { TagChip } from '@/components/molecules/TagChip';
import { PieceCard } from '@/components/molecules/PieceCard';
import { useLanguage } from '@/hooks/useLanguage';

function isJapanese(text: string): boolean {
  return /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text);
}

function getMainName(names: string[], language: 'ja' | 'en'): string {
  const sorted = [...names].sort();
  if (language === 'ja') {
    return sorted.find((n) => isJapanese(n)) || sorted[0] || '';
  }
  return sorted.find((n) => !isJapanese(n)) || sorted[0] || '';
}

function getVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

interface PieceDetailClientProps {
  piece: SerializedPieceWithRelations;
  composer: SerializedPerson | null;
  arranger: SerializedPerson | null;
  childPieces: SerializedPiece[];
  videos: SerializedYoutubeVideo[];
}

export function PieceDetailClient({
  piece,
  composer,
  arranger,
  childPieces,
  videos,
}: PieceDetailClientProps) {
  const { language } = useLanguage();

  const mainName = getMainName(piece.names, language);
  const subNames = piece.names.filter((n) => n !== mainName);
  const composerName = composer ? getMainName(composer.names, language) : '';
  const arrangerName = arranger ? getMainName(arranger.names, language) : null;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {mainName}
      </Typography>

      {subNames.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {subNames.map((name) => (
            <Chip key={name} label={name} size="small" variant="outlined" />
          ))}
        </Box>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              作曲者
            </Typography>
            <Typography
              component={NextLink}
              href={`/persons/${piece.composerId}`}
              sx={{ color: 'primary.main', textDecoration: 'none' }}
            >
              {composerName}
            </Typography>
          </Grid>

          {arrangerName && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                編曲者
              </Typography>
              <Typography
                component={NextLink}
                href={`/persons/${piece.arrangerId}`}
                sx={{ color: 'primary.main', textDecoration: 'none' }}
              >
                {arrangerName}
              </Typography>
            </Grid>
          )}

          {piece.compositionYear && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                作曲年
              </Typography>
              <Typography>{piece.compositionYear}</Typography>
            </Grid>
          )}

          {piece.sheetMusicInfo && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                楽譜情報
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {piece.sheetMusicInfo}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {piece.tags.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            タグ
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {piece.tags.map((tag) => (
              <TagChip key={tag.id} name={tag.name} />
            ))}
          </Box>
        </Box>
      )}

      {childPieces.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            楽章・収録曲
          </Typography>
          <Grid container spacing={2}>
            {childPieces.map((child) => (
              <Grid item xs={12} sm={6} md={4} key={child.id}>
                <PieceCard piece={child} language={language} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {videos.length > 0 && (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            YouTube動画
          </Typography>
          <Grid container spacing={2}>
            {videos.map((video) => {
              const videoId = getVideoId(video.url);
              return (
                <Grid item xs={12} sm={6} key={video.id}>
                  <Card>
                    <Box
                      sx={{
                        position: 'relative',
                        paddingTop: '56.25%',
                        bgcolor: 'grey.200',
                      }}
                    >
                      {videoId && (
                        <iframe
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 0,
                          }}
                          src={`https://www.youtube.com/embed/${videoId}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
