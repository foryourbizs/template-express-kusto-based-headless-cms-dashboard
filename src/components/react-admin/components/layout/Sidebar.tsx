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
  ViewList,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResourceDefinitions, useRedirect } from 'react-admin';
import { DRAWER_WIDTH } from '../../constants/layout';
import { useLoadingState } from '../../hooks/useLoadingState';

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
}

interface MenuGroup {
  id: string;
  label: string;
  items: MenuItem[];
}

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
  const { startNavigation, endNavigation } = useLoadingState();

  // 리소스를 메뉴 그룹별로 정리
  const organizeMenuItems = (): { ungrouped: MenuItem[]; groups: MenuGroup[] } => {
    const ungrouped: MenuItem[] = [
      {
        id: 'dashboard',
        label: '대시보드',
        icon: <Dashboard />,
        path: '/',
      },
    ];

    const groupMap = new Map<string, { label: string; items: MenuItem[]; order: number }>();

    // 리소스들을 순회하며 그룹별로 분류
    Object.entries(resourceDefinitions).forEach(([resourceName, resource]) => {
      if (!resource.hasList) return;

      const options = resource.options as any;
      const menuGroup = options?.menuGroup as string;
      const menuGroupLabel = options?.menuGroupLabel as string;
      const icon = options?.icon || <ViewList />;

      const menuItem: MenuItem = {
        id: resourceName,
        label: options?.label || resourceName,
        icon: icon,
        path: `/${resourceName}`,
        resourceName,
      };

      if (menuGroup && menuGroupLabel) {
        // 그룹이 있는 경우
        if (!groupMap.has(menuGroup)) {
          // 그룹 순서를 동적으로 결정 (users=1, system=2, 기타=999)
          const order = menuGroup === 'users' ? 1 : menuGroup === 'system' ? 2 : 999;
          groupMap.set(menuGroup, {
            label: menuGroupLabel,
            items: [],
            order,
          });
        }
        groupMap.get(menuGroup)!.items.push(menuItem);
      } else {
        // 그룹이 없는 경우
        ungrouped.push(menuItem);
      }
    });

    // 그룹 처리: menuGroup이 있는 경우 항상 그룹으로 표시 (1개여도 그룹핑)
    const groups: MenuGroup[] = [];
    
    Array.from(groupMap.entries()).forEach(([groupId, groupData]) => {
      const sortedItems = groupData.items.sort((a, b) => a.label.localeCompare(b.label));
      
      // menuGroup이 지정된 경우 항상 그룹으로 표시 (아이템이 1개여도 그룹핑)
      groups.push({
        id: groupId,
        label: groupData.label,
        items: sortedItems,
      });
    });

    // 그룹들을 순서대로 정렬
    groups.sort((a, b) => {
      const groupDataA = groupMap.get(a.id);
      const groupDataB = groupMap.get(b.id);
      const orderA = groupDataA?.order || 999;
      const orderB = groupDataB?.order || 999;
      return orderA - orderB;
    });

    return { ungrouped, groups };
  };

  const { ungrouped, groups } = organizeMenuItems();

  // 네비게이션 처리
  const handleNavigation = async (path: string, resourceName?: string) => {
    // 로딩 상태 시작
    startNavigation();
    
    // 모바일에서 사이드바 닫기
    if (isMobile) onClose();

    // 로딩 스피너가 보이도록 약간의 지연
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      if (path === '/') {
        redirect('/');
      } else if (path.startsWith('/system.')) {
        navigate(path);
      } else if (resourceName) {
        redirect('list', resourceName);
      } else {
        navigate(path);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      endNavigation();
    }
  };

  // 선택 상태 확인 - 정확한 경로 매칭
  const isSelected = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    
    const currentPath = location.pathname;
    
    // 정확히 일치하는 경우
    if (currentPath === path) {
      return true;
    }
    
    // 하위 경로인 경우 (예: /privates/users/123/edit)
    if (currentPath.startsWith(path + '/')) {
      // 단, 다른 더 구체적인 리소스 경로가 있는지 확인
      const allResourcePaths = Object.keys(resourceDefinitions)
        .filter(name => resourceDefinitions[name].hasList)
        .map(name => `/${name}`)
        .filter(resourcePath => resourcePath !== path && resourcePath.startsWith(path));
      
      // 현재 경로가 더 구체적인 리소스와 일치하는지 확인
      const hasMoreSpecificMatch = allResourcePaths.some(resourcePath => 
        currentPath === resourcePath || currentPath.startsWith(resourcePath + '/')
      );
      
      return !hasMoreSpecificMatch;
    }
    
    return false;
  };

  // 메뉴 아이템 렌더링
  const renderMenuItem = (item: MenuItem) => (
    <ListItem key={item.id} disablePadding>
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
  );

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
        {/* 그룹화되지 않은 메뉴들 (대시보드 등) */}
        {ungrouped.map(renderMenuItem)}

        {/* 그룹화된 메뉴들 */}
        {groups.map((group) => (
          <React.Fragment key={group.id}>
            <Divider sx={{ my: 2, mx: 2 }} />
            <Typography
              variant="subtitle2"
              sx={{
                px: 2,
                py: 1,
                color: theme.palette.text.secondary,
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {group.label}
            </Typography>
            {group.items.map(renderMenuItem)}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { md: open ? DRAWER_WIDTH : 0 }, 
        flexShrink: { md: 0 },
        transition: (theme) => theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
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
