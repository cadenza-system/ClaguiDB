'use client';
import { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export interface SearchFormProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  placeholder = '検索...',
  onSearch,
  defaultValue = '',
}) => {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', gap: 1, width: '100%' }}
    >
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        size="small"
        fullWidth
      />
      <IconButton type="submit" color="primary">
        <SearchIcon />
      </IconButton>
    </Box>
  );
};
