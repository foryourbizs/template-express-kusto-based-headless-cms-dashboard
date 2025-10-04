import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Timeline as TimelineIcon } from '@mui/icons-material';
import UserLogsGroupedList from '../guesser/UserLogsGroupedList';

/**
 * 사용자 로그 페이지 - GroupedTable을 사용한 데모
 * 
 * 이 컴포넌트는 GroupedTable을 사용하여 사용자별로 그룹화된 감사 로그를 표시합니다.
 * 
 * 주요 기능:
 * - 사용자별 로그 그룹화
 * - 페이지네이션 지원
 * - 벌크 선택 및 삭제
 * - 반응형 디자인
 * - 검색 및 필터링
 */
export const UserLogsPage: React.FC = () => {
    return (
        <Box sx={{ padding: 2 }}>
            {/* 페이지 헤더 */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <TimelineIcon color="primary" fontSize="large" />
                        <Typography variant="h4" fontWeight={600}>
                            사용자 감사 로그 관리
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        GroupedTable을 사용하여 사용자별로 그룹화된 감사 로그를 관리합니다.
                        각 사용자의 활동을 시간순으로 정리하여 효과적으로 모니터링할 수 있습니다.
                    </Typography>
                </CardContent>
            </Card>

            {/* 그룹화된 로그 리스트 */}
            <UserLogsGroupedList
                resource="privates/users/audits"
                sort={{ field: 'createdAt', order: 'DESC' }}
                perPage={150}
            />
        </Box>
    );
};

export default UserLogsPage;