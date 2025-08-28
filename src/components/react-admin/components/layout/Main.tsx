import React from 'react';
import { Box, Toolbar, Container, useTheme } from '@mui/material';
import { Notification } from 'react-admin';

interface MainProps {
  sidebarOpen: boolean;
  isMobile: boolean;
  children?: React.ReactNode;
}

/**
 * 메인 콘텐츠 영역 컴포넌트
 * React Admin의 페이지들이 렌더링되는 영역
 */
export const Main: React.FC<MainProps> = ({ sidebarOpen, isMobile, children }) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: '100%', // 항상 전체 너비 사용
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
        {/* React Admin Notification 컴포넌트 - 콘텐츠 영역 내부로 이동 */}
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

        {/* React Admin 페이지들이 여기에 렌더링됩니다 */}
        {children}
      </Container>
    </Box>
  );
};
