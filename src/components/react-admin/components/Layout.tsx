import React from 'react';
import { Box, CssBaseline, useMediaQuery, Theme } from '@mui/material';
import { useAuthProvider, useDataProvider, useNotify, useRefresh } from 'react-admin';
import { Header } from './layout/Header';
import { Sidebar } from './layout/Sidebar';
import Main from './layout/Main';
import { Footer } from './layout/Footer';
import { LayoutProvider, useLayout } from './layout/LayoutProvider';
import { ReauthModal } from './ReauthModal';
import { LoadingSpinner } from './LoadingSpinner';
import { useAuthMonitor } from '../hooks/useAuthMonitor';
import { useLoadingState } from '../hooks/useLoadingState';
import { useThemeMode } from '../AdminApp';

/**
 * 커스텀 레이아웃 컴포넌트
 * React Admin의 기본 레이아웃 대신 각 영역을 직접 구현
 */
const LayoutContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { sidebarOpen, toggleSidebar } = useLayout();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const { darkMode } = useThemeMode();
  
  // React Admin 훅들
  const authProvider = useAuthProvider();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  // 로딩 상태
  const { isLoading } = useLoadingState();

  // 인증 모니터링
  const {
    isReauthModalOpen,
    closeReauthModal,
    forceLogout,
  } = useAuthMonitor();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', // 세로 레이아웃으로 변경
      minHeight: '100vh',
      width: '100%',
      overflow: 'auto',
      bgcolor: darkMode ? '#1a1a1a' : '#f5f5f5',
      transition: 'background-color 0.3s ease',
    }}>
      <CssBaseline />
      
      {/* 헤더 */}
      <Header 
        onMenuClick={toggleSidebar}
        isMobile={isMobile}
      />
      
      {/* 메인 컨텐츠 영역 (사이드바 + 콘텐츠) */}
      <Box sx={{ 
        display: 'flex', 
        flex: 1, // 남은 공간을 모두 차지
        position: 'relative' 
      }}>
        {/* 사이드바 */}
        <Sidebar 
          open={sidebarOpen}
          onClose={() => toggleSidebar(false)}
          isMobile={isMobile}
        />
        
        {/* 메인 콘텐츠 영역 */}
        <Main 
          sidebarOpen={sidebarOpen} 
          isMobile={isMobile}
        >
          {children}
        </Main>
      </Box>
      
      {/* 푸터 */}
      <Footer />
      
      {/* 로딩 스피너 */}
      <LoadingSpinner open={isLoading} message="페이지를 로딩 중입니다..." />
      
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