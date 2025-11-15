import { FC, useEffect, useState } from 'react';
import { Typography, useTheme, Box, Paper, Button } from '@mui/material';
import { Group, TodayOutlined, CalendarMonthOutlined, CalendarTodayOutlined, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWidget } from './WidgetContext'
import { useCountUp } from '../../hooks/useCountUp';

export const UserStatsWidget: FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const widget = useWidget('user-stats');
    const [refreshKey, setRefreshKey] = useState(0);
    
    // 기준일자
    const referenceDate = '2025년 6월 27일';
    
    // 새로고침 완료 시 애니메이션 재시작
    useEffect(() => {
        if (!widget.isRefreshing && widget.state.lastRefreshed) {
            setRefreshKey(prev => prev + 1);
        }
    }, [widget.isRefreshing, widget.state.lastRefreshed]);
    
    // 숫자 애니메이션 (refreshKey가 변경되면 재시작)
    const totalUsers = useCountUp({ end: 45750982, duration: 2000, trigger: refreshKey });
    const todayUsers = useCountUp({ end: 1234, duration: 1500, trigger: refreshKey });
    const monthUsers = useCountUp({ end: 85432, duration: 1800, trigger: refreshKey });
    const yearUsers = useCountUp({ end: 2145678, duration: 2000, trigger: refreshKey });

    
    
    const periodStats = [
        {
            label: '금일',
            value: todayUsers,
            icon: <TodayOutlined />,
            color: theme.palette.info.main,
        },
        {
            label: '금월',
            value: monthUsers,
            icon: <CalendarMonthOutlined />,
            color: theme.palette.success.main,
        },
        {
            label: '금년',
            value: yearUsers,
            icon: <CalendarTodayOutlined />,
            color: theme.palette.warning.main,
        },
    ];
    
    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* 기준일자 표시 */}
            <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ textAlign: 'right', fontSize: '0.65rem', flexShrink: 0 }}
            >
                기준일: {referenceDate}
            </Typography>

            {/* 총 고유 사용자 - 큰 영역 */}
            <Paper
                elevation={0}
                sx={{
                    p: 1.5,
                    mt: 0.5,
                    borderRadius: 2,
                    border: `2px solid ${theme.palette.primary.main}`,
                    backgroundColor: theme.palette.primary.light + '10',
                    flexShrink: 0,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            flexShrink: 0,
                        }}
                    >
                        <Group sx={{ fontSize: 28 }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                                display: 'block',
                                fontSize: '0.65rem',
                                fontWeight: 500,
                            }}
                        >
                            총 고유 방문
                        </Typography>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 700,
                                color: theme.palette.primary.main,
                                lineHeight: 1.2,
                                fontSize: '1.5rem',
                            }}
                        >
                            {totalUsers}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* 기간별 통계 - 컴팩트 그리드 */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 0.75,
                    mt: 0.75,
                    flex: 1,
                    minHeight: 0,
                }}
            >
                {periodStats.map((stat, index) => (
                    <Paper
                        key={index}
                        elevation={0}
                        sx={{
                            p: 0.75,
                            borderRadius: 1.5,
                            border: `1px solid ${theme.palette.divider}`,
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <Box sx={{ color: stat.color, mb: 0.25 }}>
                            {stat.icon}
                        </Box>
                        <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                                display: 'block',
                                fontSize: '0.6rem',
                                mb: 0.25,
                            }}
                        >
                            {stat.label}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                fontWeight: 600,
                                fontSize: '0.8rem',
                            }}
                        >
                            {stat.value}
                        </Typography>
                    </Paper>
                ))}
            </Box>

            {/* 트래킹 페이지 이동 버튼 */}
            <Button
                variant="outlined"
                size="small"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/privates/users/audits')}
                sx={{
                    mt: 0.75,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontSize: '0.7rem',
                    py: 0.5,
                    flexShrink: 0,
                }}
            >
                사용자 트래킹 상세보기
            </Button>
        </Box>
    );
};
