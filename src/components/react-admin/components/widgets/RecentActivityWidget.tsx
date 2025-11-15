import { FC } from 'react';
import { Button, Box, useTheme } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWidget } from './WidgetContext';
interface Activity {
    id: number;
    type: string;
    user: string;
    timestamp: string;
}

export const RecentActivityWidget: FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const widget = useWidget('recent-activity');
    
    // 최근 활동 데이터 (최근 20개)
    const recentActivities: Activity[] = [
        { id: 1, type: '사용자 등록', user: 'user123', timestamp: '5분 전' },
        { id: 2, type: '파일 업로드', user: 'admin', timestamp: '12분 전' },
        { id: 3, type: '로그인', user: 'user456', timestamp: '23분 전' },
        { id: 4, type: '데이터 수정', user: 'editor', timestamp: '45분 전' },
        { id: 5, type: '권한 변경', user: 'admin', timestamp: '1시간 전' },
        { id: 6, type: '파일 삭제', user: 'user789', timestamp: '1시간 전' },
        { id: 7, type: '로그아웃', user: 'user123', timestamp: '2시간 전' },
        { id: 8, type: '메뉴 추가', user: 'admin', timestamp: '2시간 전' },
        { id: 9, type: '게시글 작성', user: 'editor', timestamp: '3시간 전' },
        { id: 10, type: '댓글 작성', user: 'user456', timestamp: '3시간 전' },
        { id: 11, type: '비밀번호 변경', user: 'user789', timestamp: '4시간 전' },
        { id: 12, type: '프로필 수정', user: 'user123', timestamp: '4시간 전' },
        { id: 13, type: '파일 다운로드', user: 'admin', timestamp: '5시간 전' },
        { id: 14, type: '설정 변경', user: 'admin', timestamp: '5시간 전' },
        { id: 15, type: '사용자 삭제', user: 'admin', timestamp: '6시간 전' },
        { id: 16, type: '로그인', user: 'editor', timestamp: '6시간 전' },
        { id: 17, type: '게시글 수정', user: 'editor', timestamp: '7시간 전' },
        { id: 18, type: '권한 조회', user: 'user456', timestamp: '7시간 전' },
        { id: 19, type: '파일 업로드', user: 'user789', timestamp: '8시간 전' },
        { id: 20, type: '로그아웃', user: 'admin', timestamp: '8시간 전' },
    ];
    
    return (
        <Box 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
            }}
        >
            {/* 테이블 영역 - flex로 남은 공간 차지 */}
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <ScrollArea className="h-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead 
                                    className="w-[100px]"
                                    style={{ color: theme.palette.text.secondary }}
                                >
                                    유형
                                </TableHead>
                                <TableHead style={{ color: theme.palette.text.secondary }}>
                                    사용자
                                </TableHead>
                                <TableHead 
                                    className="text-right"
                                    style={{ color: theme.palette.text.secondary }}
                                >
                                    시간
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentActivities.map((activity) => (
                                <TableRow 
                                    key={activity.id}
                                    onClick={() => {
                                        widget.refresh();
                                    }}
                                    style={{ 
                                        borderBottomColor: theme.palette.divider,
                                    }}
                                >
                                    <TableCell 
                                        className="font-medium text-xs"
                                        style={{ color: theme.palette.text.primary }}
                                    >
                                        {activity.type}
                                    </TableCell>
                                    <TableCell 
                                        className="text-xs"
                                        style={{ color: theme.palette.text.primary }}
                                    >
                                        {activity.user}
                                    </TableCell>
                                    <TableCell 
                                        className="text-right text-xs"
                                        style={{ color: theme.palette.text.secondary }}
                                    >
                                        {activity.timestamp}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </Box>

            {/* 상세보기 버튼 - 하단 고정 */}
            <Box sx={{ flexShrink: 0, mt: 1 }}>
                <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/privates/users/audits')}
                    sx={{
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontSize: '0.7rem',
                        py: 0.5,
                    }}
                >
                    활동 내역 상세보기
                </Button>
            </Box>
        </Box>
    );
};
