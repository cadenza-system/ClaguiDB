'use client';
import { TextField, TextFieldProps } from '@mui/material';

export type InputProps = TextFieldProps;

export const Input: React.FC<InputProps> = (props) => {
  return <TextField size="small" {...props} />;
};
