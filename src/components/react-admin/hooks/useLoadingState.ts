import { useState, useEffect } from 'react';
import { useLoading } from 'react-admin';

/**
 * 글로벌 로딩 상태를 관리하는 훅
 */
export const useLoadingState = () => {
  const [isNavigationLoading, setIsNavigationLoading] = useState(false);
  const loading = useLoading();

  // React Admin의 로딩 상태와 네비게이션 로딩 상태를 결합
  const isLoading = loading || isNavigationLoading;

  const startNavigation = () => {
    setIsNavigationLoading(true);
  };

  const endNavigation = () => {
    setIsNavigationLoading(false);
  };

  // React Admin 로딩이 끝나면 네비게이션 로딩도 종료
  useEffect(() => {
    if (!loading && isNavigationLoading) {
      // React Admin 로딩이 완료되면 추가로 300ms 후에 네비게이션 로딩 종료
      // 이렇게 하면 데이터 로딩이 완전히 끝난 후에 로딩 스피너가 사라짐
      const timer = setTimeout(() => {
        setIsNavigationLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [loading, isNavigationLoading]);

  return {
    isLoading,
    startNavigation,
    endNavigation,
  };
};
