import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Stack,
} from '@mui/material';
import {
  Title,
  TopToolbar,
  RefreshButton,
} from 'react-admin';
import {
  Analytics as AnalyticsIcon,
  TrendingUp,
  People,
  Article,
} from '@mui/icons-material';

/**
 * 분석 페이지 - React Admin Resource로 등록됨
 */
export const Analytics: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Title title="분석" />
      
      <TopToolbar>
        <RefreshButton />
      </TopToolbar>
      
      <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <AnalyticsIcon sx={{ mr: 1 }} />
        데이터 분석
      </Typography>

      <Stack spacing={3}>
        <Card>
          <CardHeader
            avatar={<TrendingUp />}
            title="사용자 통계"
            subheader="최근 30일 데이터"
          />
          <CardContent>
            <Typography>
              여기에 사용자 통계 차트가 들어갑니다.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            avatar={<Article />}
            title="콘텐츠 분석"
            subheader="게시물 및 댓글 현황"
          />
          <CardContent>
            <Typography>
              여기에 콘텐츠 분석 데이터가 들어갑니다.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

/**
 * 시스템 로그 페이지 - React Admin Resource로 등록됨
 */
export const SystemLogs: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Title title="시스템 로그" />
      
      <TopToolbar>
        <RefreshButton />
      </TopToolbar>
      
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        시스템 로그
      </Typography>

      <Card>
        <CardContent>
          <Typography>
            여기에 시스템 로그가 표시됩니다.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
