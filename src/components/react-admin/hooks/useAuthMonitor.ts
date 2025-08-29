import { useEffect, useState, useCallback } from 'react';
import { useAuthProvider, useLogout } from 'react-admin';
import { getTokenTimeRemaining } from '../lib/authProvider';

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

  // 인증 상태 확인 함수
  const checkAuthStatus = useCallback(async () => {
    if (!authProvider) return;

    try {
      // 1. 토큰 만료시간 확인
      const { accessToken, refreshToken } = getTokenTimeRemaining();
      
      // Refresh Token이 만료된 경우
      if (refreshToken.expired) {
        setState(prev => ({ 
          ...prev, 
          isAuthExpired: true, 
          isReauthModalOpen: true,
          timeRemaining: 0 
        }));
        return;
      }

      // 2. 서버에서 인증 상태 확인
      await authProvider.checkAuth({});
      
      // 인증 성공 - 상태 초기화
      setState(prev => ({ 
        ...prev, 
        isAuthExpired: false, 
        isReauthModalOpen: false,
        timeRemaining: accessToken.remaining 
      }));

    } catch (error: any) {
      console.error('Auth status check failed:', error);
      
      // 401 에러이거나 인증 실패인 경우
      if (error?.status === 401 || error?.message?.includes('Authentication')) {
        setState(prev => ({ 
          ...prev, 
          isAuthExpired: true, 
          isReauthModalOpen: true,
          timeRemaining: 0 
        }));
      }
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
    setState(prev => ({ 
      ...prev, 
      isAuthExpired: false, 
      isReauthModalOpen: false 
    }));
    logout();
  }, [logout]);

  // 정기적인 인증 상태 확인 (5분마다)
  useEffect(() => {
    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000); // 5분
    
    // 초기 확인
    checkAuthStatus();

    return () => clearInterval(interval);
  }, [checkAuthStatus]);

  // 토큰 만료 시간 업데이트 (1분마다)
  useEffect(() => {
    const interval = setInterval(() => {
      const { accessToken } = getTokenTimeRemaining();
      setState(prev => ({ ...prev, timeRemaining: accessToken.remaining }));
    }, 60 * 1000); // 1분

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
