import { FC, ReactNode } from 'react';
import { Box, IconButton, CircularProgress, useTheme } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useWidget } from './WidgetContext';

interface WidgetWrapperProps {
    widgetId: string;
    children: ReactNode;
    showRefresh?: boolean;
}

export const WidgetWrapper: FC<WidgetWrapperProps> = ({ 
    widgetId, 
    children, 
    showRefresh = true 
}) => {
    const theme = useTheme();
    const { isRefreshing, refresh } = useWidget(widgetId);

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* 새로고침 버튼 */}
            {showRefresh && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: -40,
                        right: 0,
                        zIndex: 10,
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={refresh}
                        disabled={isRefreshing}
                        sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                color: theme.palette.primary.main,
                                backgroundColor: theme.palette.action.hover,
                            },
                        }}
                    >
                        {isRefreshing ? (
                            <CircularProgress size={20} />
                        ) : (
                            <Refresh fontSize="small" />
                        )}
                    </IconButton>
                </Box>
            )}

            {/* 위젯 컨텐츠 */}
            <Box sx={{ flex: 1, minHeight: 0, opacity: isRefreshing ? 0.6 : 1, transition: 'opacity 0.3s' }}>
                {children}
            </Box>
        </Box>
    );
};
