import { FC, ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useWidget } from './WidgetContext';

interface WidgetContentProps {
    widgetId: string;
    children: ReactNode;
}

export const WidgetContent: FC<WidgetContentProps> = ({ widgetId, children }) => {
    const { isRefreshing } = useWidget(widgetId);

    return (
        <Box 
            sx={{ 
                height: '100%',
                position: 'relative',
            }}
        >
            {/* 로딩 스피너 오버레이 */}
            {isRefreshing && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.01)',
                        margin: '-100%',
                        backdropFilter: 'blur(10px)',
                        zIndex: 10,
                    }}
                >
                    <CircularProgress size={40} />
                </Box>
            )}
            
            {/* 위젯 컨텐츠 */}
            <Box 
                sx={{ 
                    height: '100%',
                    opacity: isRefreshing ? 0.4 : 1, 
                    transition: 'opacity 0.3s',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};
