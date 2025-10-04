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
 * 사이드바 상태에 따라 마진을 조정하여 콘텐츠가 전체 폭을 활용할 수 있도록 함
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
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto', // 내부 스크롤 허용
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
            // 푸터를 위한 하단 여백 제거 (이제 flexbox로 처리)
          }}
        >
          {/* React Admin Notification - 우하단 고정 */}
          <Box
            sx={{
              position: 'fixed', // fixed로 유지하여 푸터에 가려지지 않도록
              bottom: { xs: 80, sm: 80 }, // 푸터 높이만큼 여백 추가
              right: 16,
              zIndex: theme.zIndex.snackbar,
              maxWidth: '400px',
              width: { xs: 'calc(100% - 32px)', sm: '400px' },
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

export default Main;
