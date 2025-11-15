import { FC } from 'react';
import { Typography, Badge } from '@mui/material';
import { Notifications, ErrorOutline, InfoOutlined } from '@mui/icons-material';

export const NotificationsWidget: FC = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-end mb-2">
                <Badge badgeContent={3} color="error">
                    <Notifications />
                </Badge>
            </div>
            <div className="space-y-2 flex-1 overflow-auto">
                <div className="flex items-start gap-2 p-2 rounded bg-red-50">
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
                <div className="flex items-start gap-2 p-2 rounded bg-blue-50">
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
