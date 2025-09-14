import { useEffect, useState, useCallback } from 'react';
import { useAuthProvider, useLogout } from 'react-admin';
import { getTokenTimeRemaining, isCurrentlyLoggingOut } from '../lib/authProvider';

interface AuthMonitorState {
  isAuthExpired: boolean;
  isReauthModalOpen: boolean;
  timeRemaining: number;
}

/**
 * 인증 상태를 모니터링하고 필요시 재인증 모달을 관리하는 훅
 */
export const useAuthMonitor = () => {
  const [state, setState] = useState<AuthMonitorState>({
    isAuthExpired: false,
    isReauthModalOpen: false,
    timeRemaining: 0,
  });

  const authProvider = useAuthProvider();
  const logout = useLogout();

  // 인증 상태 확인 함수 (로컬 토큰만 체크, 서버 호출 없음)
  const checkAuthStatus = useCallback(async () => {
    if (!authProvider) return;

    try {
      // 토큰 존재 여부 확인
      const hasTokens = !!localStorage.getItem('accessToken') && !!localStorage.getItem('refreshToken');
      
      if (!hasTokens) {
        console.log('useAuthMonitor: No tokens found');
        setState(prev => ({ 
          ...prev, 
          isAuthExpired: false, 
          isReauthModalOpen: false,
          timeRemaining: 0 
        }));
        return;
      }

      // 1. 토큰 만료시간 확인 (로컬에서만)
      const { accessToken, refreshToken } = getTokenTimeRemaining();
      
      console.log('useAuthMonitor: Checking auth status', {
        accessExpired: accessToken.expired,
        refreshExpired: refreshToken.expired,
        accessRemaining: accessToken.remaining,
        refreshRemaining: refreshToken.remaining
      });

      // Refresh Token이 만료된 경우 - 모달 표시
      if (refreshToken.expired) {
        console.log('useAuthMonitor: Refresh token expired, showing modal');
        setState(prev => ({ 
          ...prev, 
          isAuthExpired: true, 
          isReauthModalOpen: true,
          timeRemaining: 0 
        }));
        return;
      }

      // Access Token이 만료된 경우 (하지만 Refresh Token은 유효) - 모달 표시
      if (accessToken.expired && !refreshToken.expired) {
        console.log('useAuthMonitor: Access token expired, showing modal');
        setState(prev => ({ 
          ...prev, 
          isAuthExpired: true, 
          isReauthModalOpen: true,
          timeRemaining: 0 
        }));
        return;
      }

      // 토큰이 유효한 경우
      setState(prev => ({ 
        ...prev, 
        isAuthExpired: false, 
        isReauthModalOpen: false,
        timeRemaining: accessToken.remaining 
      }));

    } catch (error: any) {
      console.error('Auth status check failed:', error);
      
      // 로컬 토큰 문제인 경우
      setState(prev => ({ 
        ...prev, 
        isAuthExpired: true, 
        isReauthModalOpen: true,
        timeRemaining: 0 
      }));
    }
  }, [authProvider]);

  // 재인증 모달 열기
  const openReauthModal = useCallback(() => {
    setState(prev => ({ ...prev, isReauthModalOpen: true }));
  }, []);

  // 재인증 모달 닫기
  const closeReauthModal = useCallback(() => {
    setState(prev => ({ ...prev, isReauthModalOpen: false }));
  }, []);

  // 강제 로그아웃
  const forceLogout = useCallback(() => {
    // 이미 로그아웃 중이면 스킵
    if (isCurrentlyLoggingOut()) {
      console.log('useAuthMonitor: Logout already in progress, skipping...');
      return;
    }

    console.log('useAuthMonitor: Initiating force logout...');
    setState(prev => ({ 
      ...prev, 
      isAuthExpired: false, 
      isReauthModalOpen: false 
    }));
    logout();
  }, [logout]);

  // 정기적인 인증 상태 확인 (1분마다로 변경)
  useEffect(() => {
    const interval = setInterval(checkAuthStatus, 1 * 60 * 1000); // 1분마다
    
    // 초기 확인
    checkAuthStatus();

    return () => clearInterval(interval);
  }, [checkAuthStatus]);

  // 토큰 만료 시간 업데이트 (30초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      const { accessToken } = getTokenTimeRemaining();
      setState(prev => ({ ...prev, timeRemaining: accessToken.remaining }));
    }, 30 * 1000); // 30초

    return () => clearInterval(interval);
  }, []);

  // 전역 401 에러 리스너
  useEffect(() => {
    const handleAuthError = () => {
      openReauthModal();
    };

    window.addEventListener('auth-error', handleAuthError);
    return () => window.removeEventListener('auth-error', handleAuthError);
  }, [openReauthModal]);

  return {
    ...state,
    checkAuthStatus,
    openReauthModal,
    closeReauthModal,
    forceLogout,
  };
};
