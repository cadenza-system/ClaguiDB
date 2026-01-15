'use client';
import { useState } from 'react';
import { Typography, Box, Grid, CircularProgress } from '@mui/material';
import { SearchForm } from '@/components/molecules/SearchForm';
import { PersonCard } from '@/components/molecules/PersonCard';
import { Person } from '@/domain/person';
import { useLanguage } from '@/hooks/useLanguage';

export function PersonSearchClient() {
  const { language } = useLanguage();
  const [results, setResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `/api/persons/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResults(
        data.map(
          (p: {
            id: number;
            names: string[];
            bio: string | null;
            birthYear: number | null;
            deathYear: number | null;
            country: string | null;
            createdAt: string;
            createdByUserId: number;
          }) =>
            new Person(
              p.id,
              p.names,
              p.bio,
              p.birthYear,
              p.deathYear,
              p.country,
              new Date(p.createdAt),
              p.createdByUserId
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
        作曲者検索
      </Typography>

      <Box sx={{ mb: 4, maxWidth: 600 }}>
        <SearchForm
          placeholder="作曲者名を入力..."
          onSearch={handleSearch}
        />
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
              {results.map((person) => (
                <Grid item xs={12} sm={6} md={4} key={person.id}>
                  <PersonCard person={person} language={language} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">
              該当する作曲者が見つかりませんでした
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
