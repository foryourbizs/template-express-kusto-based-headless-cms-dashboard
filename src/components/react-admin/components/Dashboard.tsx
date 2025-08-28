import { FC, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Paper,
    useTheme,
} from '@mui/material';
import {
    TrendingUp,
    People,
    Article,
    Comment,
    Visibility,
} from '@mui/icons-material';
import { useDataProvider } from 'react-admin';

/**
 * 대시보드 통계 카드 컴포넌트
 */
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible',
            }}
        >
            <CardContent sx={{ flex: 1, pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            backgroundColor: color,
                            color: 'white',
                            mr: 2,
                        }}
                    >
                        {icon}
                    </Box>
                    <Box>
                        <Typography variant="h4" component="div" fontWeight="bold">
                            {value}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            {title}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

/**
 * 대시보드 메인 컴포넌트
 */
export const Dashboard: FC = () => {
    const theme = useTheme();
    const dataProvider = useDataProvider();
    const [stats, setStats] = useState({
        users: 999,
        posts: 999,
        comments: 999,
        views: 999,
    });



    return (
        <Box sx={{ p: 3 }}>
            {/* 대시보드 헤더 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    대시보드
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    관리자 패널 개요 및 주요 통계
                </Typography>
            </Box>

            {/* 통계 카드들 */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(4, 1fr)',
                    },
                    gap: 3,
                    mb: 4,
                }}
            >
                <StatCard
                    title="전체 사용자"
                    value={stats.users}
                    icon={<People />}
                    color={theme.palette.primary.main}
                />
                <StatCard
                    title="전체 게시물"
                    value={stats.posts}
                    icon={<Article />}
                    color={theme.palette.success.main}
                />
                <StatCard
                    title="전체 댓글"
                    value={stats.comments}
                    icon={<Comment />}
                    color={theme.palette.warning.main}
                />
                <StatCard
                    title="페이지 뷰"
                    value={stats.views.toLocaleString()}
                    icon={<Visibility />}
                    color={theme.palette.info.main}
                />
            </Box>


        </Box>
    );
};

export default Dashboard;
