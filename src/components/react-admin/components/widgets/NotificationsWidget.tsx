import { FC } from 'react';
import { Typography, Badge, useTheme } from '@mui/material';
import { Notifications, ErrorOutline, InfoOutlined } from '@mui/icons-material';

export const NotificationsWidget: FC = () => {
    const theme = useTheme();
    
    return (
        <div className="h-full flex flex-col" style={{ color: theme.palette.text.primary }}>
            <div className="flex items-center justify-end mb-2">
                <Badge badgeContent={3} color="error">
                    <Notifications />
                </Badge>
            </div>
            <div className="space-y-2 flex-1 overflow-auto">
                <div 
                    className="flex items-start gap-2 p-2 rounded" 
                    style={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : '#ffebee'
                    }}
                >
                    <ErrorOutline color="error" fontSize="small" />
                    <div>
                        <Typography variant="body2" fontWeight="medium">
                            보안 업데이트 필요
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            시스템 보안 패치가 필요합니다.
                        </Typography>
                    </div>
                </div>
                <div 
                    className="flex items-start gap-2 p-2 rounded" 
                    style={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : '#e3f2fd'
                    }}
                >
                    <InfoOutlined color="info" fontSize="small" />
                    <div>
                        <Typography variant="body2" fontWeight="medium">
                            새 기능 출시
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            대시보드 레이아웃 커스터마이징이 가능합니다.
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};
