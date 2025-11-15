import { FC } from 'react';
import { IconButton, CircularProgress, useTheme } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useWidget } from './WidgetContext';

interface WidgetHeaderProps {
    widgetId: string;
    title: string;
    showRefresh?: boolean;
}

export const WidgetHeader: FC<WidgetHeaderProps> = ({ widgetId, title, showRefresh = false }) => {
    const theme = useTheme();
    const { isRefreshing, refresh } = useWidget(widgetId);

    return (
        <div
            className="drag-handle"
            style={{
                cursor: 'move',
                padding: '10px',
                borderBottom: '1px solid #eee',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <span>{title}</span>
            {showRefresh && (
                <div
                    style={{ cursor: 'default' }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            refresh();
                        }}
                        disabled={isRefreshing}
                        sx={{
                            color: theme.palette.text.secondary,
                            cursor: 'pointer',
                            '&:hover': {
                                color: theme.palette.primary.main,
                                backgroundColor: theme.palette.action.hover,
                            },
                        }}
                    >
                        {isRefreshing ? (
                            <CircularProgress size={18} />
                        ) : (
                            <Refresh fontSize="small" />
                        )}
                    </IconButton>
                </div>
            )}
        </div>
    );
};
