import { FC, ReactNode } from 'react';
import { Typography, Button, Box, useTheme, Chip } from '@mui/material';
import { ErrorOutline, InfoOutlined, WarningAmberOutlined, CheckCircleOutline, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

type NotificationType = 'error' | 'warning' | 'info' | 'success';

interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
}

export const NotificationsWidget: FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    
    const notifications: Notification[] = [
        { id: 1, type: 'error', title: '보안 업데이트 필요', message: '시스템 보안 패치가 필요합니다.', time: '5분 전' },
        { id: 2, type: 'warning', title: '디스크 용량 부족', message: '스토리지 용량이 80%를 초과했습니다.', time: '15분 전' },
        { id: 3, type: 'info', title: '새 기능 출시', message: '대시보드 커스터마이징이 가능합니다.', time: '1시간 전' },
        { id: 4, type: 'success', title: '백업 완료', message: '시스템 백업이 성공적으로 완료되었습니다.', time: '2시간 전' },
        { id: 5, type: 'warning', title: '로그인 실패 시도', message: '비정상적인 로그인 시도가 감지되었습니다.', time: '3시간 전' },
    ];
    
    const getNotificationConfig = (type: NotificationType): { 
        icon: ReactNode; 
        color: string; 
        bgColor: string;
        label: string;
    } => {
        const configs = {
            error: {
                icon: <ErrorOutline fontSize="small" />,
                color: theme.palette.error.main,
                bgColor: theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : '#ffebee',
                label: '오류',
            },
            warning: {
                icon: <WarningAmberOutlined fontSize="small" />,
                color: theme.palette.warning.main,
                bgColor: theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.1)' : '#fff3e0',
                label: '경고',
            },
            info: {
                icon: <InfoOutlined fontSize="small" />,
                color: theme.palette.info.main,
                bgColor: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : '#e3f2fd',
                label: '일반',
            },
            success: {
                icon: <CheckCircleOutline fontSize="small" />,
                color: theme.palette.success.main,
                bgColor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : '#e8f5e9',
                label: '완료',
            },
        };
        return configs[type];
    };
    
    return (
        <Box 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
            }}
        >
            {/* 알림 목록 영역 - flex로 남은 공간 차지 */}
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <ScrollArea className="h-full pr-2">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {notifications.map((notification) => {
                            const config = getNotificationConfig(notification.type);
                            return (
                                <Box
                                    key={notification.id}
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        p: 1.5,
                                        borderRadius: 1.5,
                                        backgroundColor: config.bgColor,
                                        border: `1px solid ${config.color}30`,
                                    }}
                                >
                                    <Box sx={{ color: config.color, mt: 0.25, flexShrink: 0 }}>
                                        {config.icon}
                                    </Box>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <Typography 
                                                variant="body2" 
                                                fontWeight={600}
                                                sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}
                                            >
                                                {notification.title}
                                            </Typography>
                                            <Chip 
                                                label={config.label} 
                                                size="small"
                                                sx={{ 
                                                    height: 18,
                                                    fontSize: '0.6rem',
                                                    backgroundColor: config.color,
                                                    color: 'white',
                                                }}
                                            />
                                        </Box>
                                        <Typography 
                                            variant="caption" 
                                            color="text.secondary"
                                            sx={{ 
                                                display: 'block',
                                                fontSize: '0.65rem',
                                                mb: 0.25,
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {notification.message}
                                        </Typography>
                                        <Typography 
                                            variant="caption"
                                            sx={{ 
                                                fontSize: '0.6rem',
                                                color: theme.palette.text.disabled,
                                            }}
                                        >
                                            {notification.time}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </ScrollArea>
            </Box>

            {/* 알림 내역 바로가기 버튼 - 하단 고정 */}
            <Box sx={{ flexShrink: 0, mt: 1 }}>
                <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/notifications')}
                    sx={{
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontSize: '0.7rem',
                        py: 0.5,
                    }}
                >
                    알림 내역 전체보기
                </Button>
            </Box>
        </Box>
    );
};
