import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout,
  Settings,
} from '@mui/icons-material';
import { useAuthProvider, useLogout, useGetIdentity } from 'react-admin';

interface HeaderProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

/**
 * 헤더 컴포넌트
 * 메뉴 버튼, 타이틀, 사용자 메뉴 등을 포함
 */
export const Header: React.FC<HeaderProps> = ({ onMenuClick, isMobile }) => {
  const theme = useTheme();
  const logout = useLogout();
  const { data: identity } = useGetIdentity();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        {/* 메뉴 버튼 */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* 타이틀 */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          관리자 대시보드
        </Typography>

        {/* 오른쪽 액션들 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* 알림 */}
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* 사용자 메뉴 */}
          <IconButton
            onClick={handleUserMenuOpen}
            color="inherit"
            sx={{ p: 0 }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.palette.primary.main,
              }}
            >
              {identity?.fullName?.[0] || 'A'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 24,
                  height: 24,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleUserMenuClose}>
              <AccountCircle sx={{ mr: 1 }} />
              프로필
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose}>
              <Settings sx={{ mr: 1 }} />
              설정
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              로그아웃
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
