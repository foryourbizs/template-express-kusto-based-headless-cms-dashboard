import React from 'react';
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
export const Dashboard: React.FC = () => {
  const theme = useTheme();
  const dataProvider = useDataProvider();
  const [stats, setStats] = React.useState({
    users: 0,
    posts: 0,
    comments: 0,
    views: 0,
  });

  // 통계 데이터 로드
  React.useEffect(() => {
    const loadStats = async () => {
      try {
        // 각 리소스의 총 개수를 가져옵니다
        const [usersData, postsData, commentsData] = await Promise.all([
          dataProvider.getList('users', {
            pagination: { page: 1, perPage: 1 },
            sort: { field: 'id', order: 'ASC' },
            filter: {},
          }).catch(() => ({ total: 0 })),
          dataProvider.getList('posts', {
            pagination: { page: 1, perPage: 1 },
            sort: { field: 'id', order: 'ASC' },
            filter: {},
          }).catch(() => ({ total: 0 })),
          dataProvider.getList('comments', {
            pagination: { page: 1, perPage: 1 },
            sort: { field: 'id', order: 'ASC' },
            filter: {},
          }).catch(() => ({ total: 0 })),
        ]);

        setStats({
          users: usersData.total || 0,
          posts: postsData.total || 0,
          comments: commentsData.total || 0,
          views: Math.floor(Math.random() * 10000) + 1000, // 임시 데이터
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
    };

    loadStats();
  }, [dataProvider]);

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

      {/* 추가 대시보드 컨텐츠 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '2fr 1fr',
          },
          gap: 3,
        }}
      >
        <Paper sx={{ p: 3, height: '400px' }}>
          <Typography variant="h6" gutterBottom>
            최근 활동
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              color: 'text.secondary',
            }}
          >
            <Typography>
              차트나 최근 활동 목록이 여기에 표시됩니다
            </Typography>
          </Box>
        </Paper>
        <Paper sx={{ p: 3, height: '400px' }}>
          <Typography variant="h6" gutterBottom>
            빠른 작업
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              • 새 사용자 추가
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              • 게시물 관리
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              • 댓글 검토
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              • 시스템 설정
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
