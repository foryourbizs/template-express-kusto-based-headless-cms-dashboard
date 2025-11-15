import { FC, ReactNode } from 'react';
import { Typography, Chip, useTheme, Box, ChipProps } from '@mui/material';
import { CheckCircle, Warning, Error, Storage } from '@mui/icons-material';

interface StatusItem {
    icon: ReactNode;
    label: string;
    status: string;
    statusColor?: ChipProps['color'];
}

export const SystemStatusWidget: FC = () => {
    const theme = useTheme();
    
    const statusItems: StatusItem[] = [
        {
            icon: <Storage color="info" fontSize="small" />,
            label: 'API 서버',
            status: '-',
        },
        {
            icon: <Storage color="info" fontSize="small" />,
            label: '데이터베이스',
            status: '-',
        },
        {
            icon: <Storage color="info" fontSize="small" />,
            label: '스토리지',
            status: '-',
        },
        {
            icon: <Storage color="info" fontSize="small" />,
            label: '디스크 사용량',
            status: '-',
        },
    ];
    
    return (
        <Box 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1,
                color: theme.palette.text.primary 
            }}
        >
            {statusItems.map((item, index) => (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flex: 1,
                        minHeight: 0,
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {item.icon}
                        <Typography variant="body2">{item.label}</Typography>
                    </Box>
                    {item.statusColor ? (
                        <Chip label={item.status} color={item.statusColor} size="small" />
                    ) : (
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            {item.status}
                        </Typography>
                    )}
                </Box>
            ))}
        </Box>
    );
};
