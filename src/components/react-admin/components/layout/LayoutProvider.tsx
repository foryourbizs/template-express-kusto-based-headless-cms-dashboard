import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  sidebarOpen: boolean;
  toggleSidebar: (force?: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

interface LayoutProviderProps {
  children: ReactNode;
}

/**
 * 레이아웃 상태 관리 Provider
 * 사이드바 열림/닫힘, 로딩 상태 등을 관리
 */
export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = (force?: boolean) => {
    if (typeof force === 'boolean') {
      setSidebarOpen(force);
    } else {
      setSidebarOpen(prev => !prev);
    }
  };

  const value: LayoutContextType = {
    sidebarOpen,
    toggleSidebar,
    loading,
    setLoading,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

/**
 * 레이아웃 상태를 사용하는 훅
 */
export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
