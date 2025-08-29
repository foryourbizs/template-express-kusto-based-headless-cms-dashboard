import { useState, useEffect, useCallback } from 'react';
import { useAuthProvider, useNotify } from 'react-admin';
import { getTokenTimeRemaining, refreshTokens } from '../lib/authProvider';
import { authEventEmitter } from '../utils/authEvents';

interface AuthState {
  isAuthenticated: boolean;
  needsReauth: boolean;
  accessTokenExpired: boolean;
  refreshTokenExpired: boolean;
  timeRemaining: {
    accessToken: number;
    refreshToken: number;
  };
}

interface UseAuthStateReturn {
  authState: AuthState;
  showReauthModal: boolean;
  handleReauthSuccess: () => void;
  handleReauthClose: () => void;
  checkAuthState: () => Promise<void>;
}

export const useAuthState = (): UseAuthStateReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    needsReauth: false,
    accessTokenExpired: false,
    refreshTokenExpired: false,
    timeRemaining: {
      accessToken: 0,
      refreshToken: 0,
    },
  });
  
  const [showReauthModal, setShowReauthModal] = useState(false);
  const authProvider = useAuthProvider();
  const notify = useNotify();

  const updateAuthState = useCallback(() => {
    const tokenInfo = getTokenTimeRemaining();
    const hasTokens = !!localStorage.getItem('accessToken') && !!localStorage.getItem('refreshToken');

    const newState: AuthState = {
      isAuthenticated: hasTokens && !tokenInfo.refreshToken.expired,
      needsReauth: hasTokens && tokenInfo.accessToken.expired && !tokenInfo.refreshToken.expired,
      accessTokenExpired: tokenInfo.accessToken.expired,
      refreshTokenExpired: tokenInfo.refreshToken.expired,
      timeRemaining: {
        accessToken: tokenInfo.accessToken.remaining,
        refreshToken: tokenInfo.refreshToken.remaining,
      },
    };

    setAuthState(newState);

    // 재인증이 필요한 경우 모달 표시
    if (newState.needsReauth && !showReauthModal) {
      setShowReauthModal(true);
    }

    // 리프레시 토큰도 만료된 경우 로그아웃
    if (newState.refreshTokenExpired && hasTokens) {
      if (authProvider) {
        authProvider.logout({});
      }
      notify('인증이 완전히 만료되었습니다. 다시 로그인해주세요.', { type: 'warning' });
    }

    return newState;
  }, [authProvider, notify, showReauthModal]);

  const checkAuthState = useCallback(async () => {
    const currentState = updateAuthState();

    // 액세스 토큰이 곧 만료될 예정이면 자동 갱신 시도
    const fiveMinutes = 5 * 60 * 1000;
    if (
      currentState.isAuthenticated &&
      !currentState.accessTokenExpired &&
      currentState.timeRemaining.accessToken < fiveMinutes &&
      currentState.timeRemaining.accessToken > 0
    ) {
      try {
        const refreshResult = await refreshTokens();
        if (refreshResult.success) {
          // 토큰 갱신 성공 시 상태 업데이트
          updateAuthState();
        } else {
          console.warn('Token refresh failed:', refreshResult.error);
        }
      } catch (error) {
        console.error('Auth state check error:', error);
      }
    }
  }, [updateAuthState]);

  const handleReauthSuccess = useCallback(() => {
    setShowReauthModal(false);
    updateAuthState();
  }, [updateAuthState]);

  const handleReauthClose = useCallback(() => {
    setShowReauthModal(false);
  }, []);

  // 인증 에러 이벤트 리스너
  useEffect(() => {
    const unsubscribe = authEventEmitter.onAuthError((event) => {
      const { reason } = event.detail;
      setShowReauthModal(true);
      notify(reason, { type: 'warning' });
    });

    return unsubscribe;
  }, [notify]);

  // 주기적으로 인증 상태 체크 (30초마다)
  useEffect(() => {
    // 초기 체크
    checkAuthState();

    const interval = setInterval(() => {
      checkAuthState();
    }, 30000); // 30초마다

    return () => clearInterval(interval);
  }, [checkAuthState]);

  // 토큰 변경 감지 (localStorage 이벤트)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        updateAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [updateAuthState]);

  return {
    authState,
    showReauthModal,
    handleReauthSuccess,
    handleReauthClose,
    checkAuthState,
  };
};
