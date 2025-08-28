import React from 'react';
import { ErrorBoundary } from './ErrorDisplay';

/**
 * React Admin 표준 에러 상태 관리
 * 복잡한 Context 대신 React Admin 내장 기능 활용
 */
interface ErrorState {
  hasError: boolean;
  error?: Error | string;
  resourceName?: string;
}

interface ErrorContextType {
  errorState: ErrorState;
  showError: (error: Error | string, resourceName?: string) => void;
  clearError: () => void;
}

const ErrorContext = React.createContext<ErrorContextType | null>(null);

export const useMainError = () => {
  const context = React.useContext(ErrorContext);
  if (!context) {
    throw new Error('useMainError must be used within MainErrorProvider');
  }
  return context;
};

/**
 * React Admin 방식의 간단한 에러 처리 Provider
 */
export const MainErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errorState, setErrorState] = React.useState<ErrorState>({
    hasError: false,
  });

  const showError = React.useCallback((error: Error | string, resourceName?: string) => {
    setErrorState({
      hasError: true,
      error,
      resourceName,
    });
  }, []);

  const clearError = React.useCallback(() => {
    setErrorState({
      hasError: false,
    });
  }, []);

  const handleRetry = React.useCallback(() => {
    clearError();
    // React Admin은 자동으로 데이터를 다시 fetch합니다
  }, [clearError]);

  return (
    <ErrorContext.Provider value={{ errorState, showError, clearError }}>
      {errorState.hasError && errorState.error ? (
        <ErrorBoundary
          error={errorState.error}
          resourceName={errorState.resourceName}
          onRetry={handleRetry}
        />
      ) : (
        children
      )}
    </ErrorContext.Provider>
  );
};

/**
 * React Admin 표준에 맞는 에러 표시 컴포넌트
 * ErrorBoundary를 통해 간단하게 처리
 */
export const MainErrorDisplay: React.FC = () => {
  // React Admin에서는 ErrorBoundary가 에러를 자동으로 처리하므로
  // 별도의 표시 컴포넌트가 필요하지 않습니다
  return null;
};
