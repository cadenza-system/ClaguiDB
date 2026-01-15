'use client';
import NextLink from 'next/link';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';

export interface LinkProps extends Omit<MuiLinkProps, 'href'> {
  href: string;
}

export const Link: React.FC<LinkProps> = ({ href, children, ...props }) => {
  return (
    <MuiLink component={NextLink} href={href} {...props}>
      {children}
    </MuiLink>
  );
};
