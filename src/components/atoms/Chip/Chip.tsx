'use client';
import { Chip as MuiChip, ChipProps as MuiChipProps } from '@mui/material';

export type ChipProps = MuiChipProps;

export const Chip: React.FC<ChipProps> = (props) => {
  return <MuiChip size="small" {...props} />;
};
