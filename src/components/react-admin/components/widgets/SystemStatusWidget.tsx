import { FC } from 'react';
import { Typography, Chip, useTheme } from '@mui/material';
import { CheckCircle, Warning, Error, Storage } from '@mui/icons-material';

export const SystemStatusWidget: FC = () => {
    const theme = useTheme();
    
    return (
        <div className="space-y-2" style={{ color: theme.palette.text.primary }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">API 서버</Typography>
                </div>
                <Chip label="정상" color="success" size="small" />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">데이터베이스</Typography>
                </div>
                <Chip label="정상" color="success" size="small" />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Warning color="warning" fontSize="small" />
                    <Typography variant="body2">스토리지</Typography>
                </div>
                <Chip label="주의" color="warning" size="small" />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Storage color="info" fontSize="small" />
                    <Typography variant="body2">디스크 사용량</Typography>
                </div>
                <Typography variant="body2" color="text.secondary">
                    68%
                </Typography>
            </div>
        </div>
    );
};
