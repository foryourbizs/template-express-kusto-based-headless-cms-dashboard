import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface WidgetState {
    isRefreshing: boolean;
    lastRefreshed: Date | null;
}

interface WidgetContextValue {
    getWidgetState: (widgetId: string) => WidgetState;
    refreshWidget: (widgetId: string) => void;
    isRefreshing: (widgetId: string) => boolean;
}

const WidgetContext = createContext<WidgetContextValue | undefined>(undefined);

export const WidgetProvider = ({ children }: { children: ReactNode }) => {
    const [widgetStates, setWidgetStates] = useState<Record<string, WidgetState>>({});

    const getWidgetState = useCallback((widgetId: string): WidgetState => {
        return widgetStates[widgetId] || { isRefreshing: false, lastRefreshed: null };
    }, [widgetStates]);

    const refreshWidget = useCallback((widgetId: string) => {
        setWidgetStates(prev => ({
            ...prev,
            [widgetId]: { isRefreshing: true, lastRefreshed: prev[widgetId]?.lastRefreshed || null }
        }));

        // 실제 데이터 로딩 시뮬레이션 (1초 후 완료)
        setTimeout(() => {
            setWidgetStates(prev => ({
                ...prev,
                [widgetId]: { isRefreshing: false, lastRefreshed: new Date() }
            }));
        }, 1000);
    }, []);

    const isRefreshing = useCallback((widgetId: string): boolean => {
        return widgetStates[widgetId]?.isRefreshing || false;
    }, [widgetStates]);

    return (
        <WidgetContext.Provider value={{ getWidgetState, refreshWidget, isRefreshing }}>
            {children}
        </WidgetContext.Provider>
    );
};

export const useWidget = (widgetId: string) => {
    const context = useContext(WidgetContext);
    if (!context) {
        throw new Error('useWidget must be used within a WidgetProvider');
    }

    return {
        isRefreshing: context.isRefreshing(widgetId),
        refresh: () => context.refreshWidget(widgetId),
        state: context.getWidgetState(widgetId),
    };
};
