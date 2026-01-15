'use client';
import { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip as MuiChip,
} from '@mui/material';
import { SearchForm } from '@/components/molecules/SearchForm';
import { PieceCard } from '@/components/molecules/PieceCard';
import { Piece } from '@/domain/piece';
import { Tag } from '@/domain/tag';
import { useLanguage } from '@/hooks/useLanguage';

interface PieceSearchClientProps {
  availableTags: Tag[];
}

export function PieceSearchClient({ availableTags }: PieceSearchClientProps) {
  const { language } = useLanguage();
  const [results, setResults] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set('q', query);
      }
      if (selectedTags.length > 0) {
        params.set('tags', selectedTags.join(','));
      }

      const res = await fetch(`/api/pieces/search?${params.toString()}`);
      const data = await res.json();
      setResults(
        data.map(
          (p: {
            id: number;
            names: string[];
            composerId: number;
            arrangerId: number | null;
            parentPieceId: number | null;
            compositionYear: number | null;
            sheetMusicInfo: string | null;
            createdAt: string;
            createdByUserId: number;
            tags: string[];
            favoriteCount: number;
          }) =>
            new Piece(
              p.id,
              p.names,
              p.composerId,
              p.arrangerId,
              p.parentPieceId,
              p.compositionYear,
              p.sheetMusicInfo,
              new Date(p.createdAt),
              p.createdByUserId,
              p.tags,
              p.favoriteCount
            )
        )
      );
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        楽曲検索
      </Typography>

      <Box sx={{ mb: 4, maxWidth: 600 }}>
        <SearchForm placeholder="楽曲名を入力..." onSearch={handleSearch} />

        <FormControl fullWidth sx={{ mt: 2 }} size="small">
          <InputLabel>タグで絞り込み</InputLabel>
          <Select
            multiple
            value={selectedTags}
            onChange={(e) => setSelectedTags(e.target.value as number[])}
            input={<OutlinedInput label="タグで絞り込み" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((tagId) => {
                  const tag = availableTags.find((t) => t.id === tagId);
                  return tag ? (
                    <MuiChip key={tagId} label={tag.name} size="small" />
                  ) : null;
                })}
              </Box>
            )}
          >
            {availableTags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && searched && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {results.length}件の結果
          </Typography>

          {results.length > 0 ? (
            <Grid container spacing={2}>
              {results.map((piece) => (
                <Grid item xs={12} sm={6} md={4} key={piece.id}>
                  <PieceCard piece={piece} language={language} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">
              該当する楽曲が見つかりませんでした
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
