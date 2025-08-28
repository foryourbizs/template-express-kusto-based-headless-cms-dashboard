import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  People,
  Article,
  Comment,
  Settings,
  Analytics,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  divider?: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: '대시보드',
    icon: <Dashboard />,
    path: '/admin',
  },
  {
    id: 'users',
    label: '사용자',
    icon: <People />,
    path: '/admin/users',
  },
  {
    id: 'posts',
    label: '게시물',
    icon: <Article />,
    path: '/admin/posts',
  },
  {
    id: 'comments',
    label: '댓글',
    icon: <Comment />,
    path: '/admin/comments',
    divider: true,
  },
  {
    id: 'analytics',
    label: '분석',
    icon: <Analytics />,
    path: '/admin/analytics',
  },
  {
    id: 'settings',
    label: '설정',
    icon: <Settings />,
    path: '/admin/settings',
  },
];

const DRAWER_WIDTH = 240;

/**
 * 사이드바 컴포넌트
 * 네비게이션 메뉴와 로고를 포함
 */
export const Sidebar: React.FC<SidebarProps> = ({ open, onClose, isMobile }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const isSelected = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', height: '100%' }}>
      {/* 로고/타이틀 영역 */}
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            Admin Panel
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      {/* 메뉴 리스트 */}
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isSelected(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.contrastText,
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected(item.path)
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.secondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isSelected(item.path) ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
            {item.divider && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      {/* 모바일용 임시 드로어 */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // 성능 향상
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              backgroundColor: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* 데스크톱용 고정 드로어 */
        <Drawer
          variant="persistent"
          open={open}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              backgroundColor: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};
