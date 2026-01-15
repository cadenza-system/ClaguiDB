'use client';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NextLink from 'next/link';
import { useState } from 'react';
import { LanguageSwitch } from '@/components/molecules/LanguageSwitch';

export interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn = false,
  userName,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: '作曲者検索', href: '/persons/search' },
    { label: '楽曲検索', href: '/pieces/search' },
  ];

  return (
    <AppBar position="sticky">
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileMenuOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component={NextLink}
          href="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Classical Guitar Wiki
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mr: 2 }}>
            {menuItems.map((item) => (
              <Typography
                key={item.href}
                component={NextLink}
                href={item.href}
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <LanguageSwitch />

          <IconButton color="inherit" component={NextLink} href="/pieces/search">
            <SearchIcon />
          </IconButton>

          {isLoggedIn ? (
            <>
              <IconButton color="inherit" onClick={handleUserMenuClick}>
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
              >
                <MenuItem disabled>{userName}</MenuItem>
                <MenuItem
                  component={NextLink}
                  href="/mypage"
                  onClick={handleUserMenuClose}
                >
                  マイページ
                </MenuItem>
                <MenuItem onClick={handleUserMenuClose}>ログアウト</MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton color="inherit" component={NextLink} href="/login">
              <AccountCircleIcon />
            </IconButton>
          )}
        </Box>

        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <Box sx={{ width: 250 }}>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.href} disablePadding>
                  <ListItemButton
                    component={NextLink}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};
