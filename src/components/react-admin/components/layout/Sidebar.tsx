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
  ViewList,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResourceDefinitions, useRedirect, useNotify, useRefresh, useDataProvider } from 'react-admin';

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
  resourceName?: string;
  divider?: boolean;
}

// 리소스별 아이콘 매핑
const resourceIcons: Record<string, React.ReactNode> = {
  users: <People />,
  posts: <Article />,
  comments: <Comment />,
  analytics: <Analytics />,
  settings: <Settings />,
  // 기본 아이콘
  default: <ViewList />,
};

const DRAWER_WIDTH = 240;

/**
 * 사이드바 컴포넌트
 * 네비게이션 메뉴와 로고를 포함
 */
export const Sidebar: React.FC<SidebarProps> = ({ open, onClose, isMobile }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const resourceDefinitions = useResourceDefinitions();
  const redirect = useRedirect();
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();


  // React Admin에 등록된 리소스들을 기반으로 메뉴 생성
  const generateMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [
      // 대시보드는 항상 첫 번째
      {
        id: 'dashboard',
        label: '대시보드',
        icon: <Dashboard />,
        path: '/',
      },
    ];

    // 등록된 리소스들을 메뉴에 추가
    Object.keys(resourceDefinitions).forEach((resourceName) => {
      const resource = resourceDefinitions[resourceName];
      
      // list 페이지가 있는 리소스만 메뉴에 추가
      if (resource.hasList) {
        items.push({
          id: resourceName,
          label: resource.options?.label || resourceName,
          icon: resourceIcons[resourceName] || resourceIcons.default,
          path: `/${resourceName}`,
          resourceName: resourceName,
        });
      }
    });

    return items;
  };

  const menuItems = generateMenuItems();

  const handleNavigation = async (path: string, resourceName?: string) => {
    if (isMobile) {
      onClose();
    }

    // 대시보드인 경우
    if (path === '/') {
      redirect('/');
      notify('대시보드로 이동', { type: 'info' });
      return;
    }

    // 리소스 페이지인 경우
    if (resourceName) {
      try {
        // 1. 먼저 redirect로 경로 변경
        redirect('list', resourceName);
        
        // 2. 데이터 프로바이더로 실제 데이터 요청 (프리로드)
        await dataProvider.getList(resourceName, {
          pagination: { page: 1, perPage: 10 },
          sort: { field: 'id', order: 'ASC' },
          filter: {},
        });
        
        // 3. refresh로 UI 업데이트 트리거
        refresh();
        
        notify(`${resourceName} loaded successfully`, {
          type: 'success'
        });
      } catch (error) {
        console.error('Navigation error:', error);
        notify(`데이터 프로바이더 리소스 호출에 예외가 발생하였습니다 : ${resourceName}`, {
          type: 'error'
        });

      }
    } else {
      // 기타 경로는 navigate 사용
      navigate(path);
    }
  };

  const isSelected = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
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
                onClick={() => handleNavigation(item.path, item.resourceName)}
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
