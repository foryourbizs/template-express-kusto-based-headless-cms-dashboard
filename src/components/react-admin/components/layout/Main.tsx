import React from 'react';
import { Box, Toolbar, Container, useTheme } from '@mui/material';
import { Notification } from 'react-admin';
import { MainErrorProvider } from '../common/MainErrorProvider';

interface MainProps {
  sidebarOpen: boolean;
  isMobile: boolean;
  children?: React.ReactNode;
}

/**
 * React Admin 메인 콘텐츠 영역
 * 간단한 구조로 React Admin이 자체 에러 처리를 담당
 */
export const Main: React.FC<MainProps> = ({ sidebarOpen, isMobile, children }) => {
  const theme = useTheme();

  return (
    <MainErrorProvider>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 헤더 높이만큼 여백 */}
        <Toolbar />

        {/* 콘텐츠 영역 */}
        <Container
          maxWidth={false}
          sx={{
            flex: 1,
            py: 3,
            px: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
          }}
        >
          {/* React Admin Notification - 우하단 고정 */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              zIndex: theme.zIndex.snackbar,
              maxWidth: '400px',
              width: '100%',
            }}
          >
            <Notification />
          </Box>

          {/* React Admin이 자체적으로 에러를 처리하므로 children만 렌더링 */}
          {children}
        </Container>
      </Box>
    </MainErrorProvider>
  );
};
