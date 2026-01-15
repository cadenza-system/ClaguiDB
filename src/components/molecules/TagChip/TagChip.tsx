'use client';
import { Chip } from '@mui/material';
import NextLink from 'next/link';

export interface TagChipProps {
  name: string;
  onClick?: () => void;
  clickable?: boolean;
}

export const TagChip: React.FC<TagChipProps> = ({
  name,
  onClick,
  clickable = true,
}) => {
  if (clickable) {
    return (
      <Chip
        label={name}
        size="small"
        component={NextLink}
        href={`/pieces/search?tag=${encodeURIComponent(name)}`}
        clickable
        sx={{ cursor: 'pointer' }}
      />
    );
  }

  return (
    <Chip
      label={name}
      size="small"
      onClick={onClick}
      clickable={!!onClick}
    />
  );
};
