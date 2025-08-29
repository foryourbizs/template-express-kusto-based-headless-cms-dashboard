import React from 'react';
import { Box, CssBaseline, useMediaQuery, Theme } from '@mui/material';
import { useAuthProvider, useDataProvider, useNotify, useRefresh } from 'react-admin';
import { Header } from './layout/Header';
import { Sidebar } from './layout/Sidebar';
import { Main } from './layout/Main';
import { Footer } from './layout/Footer';
import { LayoutProvider, useLayout } from './layout/LayoutProvider';
import { ReauthModal } from './ReauthModal';
import { useAuthMonitor } from '../hooks/useAuthMonitor';

/**
 * 커스텀 레이아웃 컴포넌트
 * React Admin의 기본 레이아웃 대신 각 영역을 직접 구현
 */
const LayoutContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { sidebarOpen, toggleSidebar } = useLayout();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  
  // React Admin 훅들
  const authProvider = useAuthProvider();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  // 인증 모니터링
  const {
    isReauthModalOpen,
    closeReauthModal,
    forceLogout,
  } = useAuthMonitor();

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100%',
      overflow: 'auto' 
    }}>
      <CssBaseline />
      
      {/* 헤더 */}
      <Header 
        onMenuClick={toggleSidebar}
        isMobile={isMobile}
      />
      
      {/* 사이드바 */}
      <Sidebar 
        open={sidebarOpen}
        onClose={() => toggleSidebar(false)}
        isMobile={isMobile}
      />
      
      {/* 메인 콘텐츠 영역 */}
      <Main 
        sidebarOpen={sidebarOpen} isMobile={isMobile}>
        {children}
      </Main>
      
      {/* 푸터 */}
      <Footer />
      
      {/* 재인증 모달 */}
      <ReauthModal
        open={isReauthModalOpen}
        onClose={closeReauthModal}
        onForceLogout={forceLogout}
      />
    </Box>
  );
};

/**
 * 레이아웃 래퍼 컴포넌트
 * LayoutProvider로 상태 관리
 */
export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <LayoutProvider>
      <LayoutContent>{children}</LayoutContent>
    </LayoutProvider>
  );
};

export default Layout;