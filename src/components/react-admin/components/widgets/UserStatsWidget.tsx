import { FC } from 'react';
import { Typography, useTheme } from '@mui/material';
import { Group, PersonAdd, CheckCircle, TrendingUp } from '@mui/icons-material';

export const UserStatsWidget: FC = () => {
    const theme = useTheme();
    
    return (
        <div className="grid grid-cols-2 gap-2" style={{ color: theme.palette.text.primary }}>
            <div className="flex items-center gap-2">
                <Group color="primary" />
                <div>
                    <Typography variant="caption" color="text.secondary">
                        총 사용자
                    </Typography>
                    <Typography variant="h6">1,234</Typography>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <PersonAdd color="success" />
                <div>
                    <Typography variant="caption" color="text.secondary">
                        신규 사용자
                    </Typography>
                    <Typography variant="h6">56</Typography>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <CheckCircle color="info" />
                <div>
                    <Typography variant="caption" color="text.secondary">
                        활성 사용자
                    </Typography>
                    <Typography variant="h6">892</Typography>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <TrendingUp color="warning" />
                <div>
                    <Typography variant="caption" color="text.secondary">
                        증가율
                    </Typography>
                    <Typography variant="h6">+12%</Typography>
                </div>
            </div>
        </div>
    );
};
