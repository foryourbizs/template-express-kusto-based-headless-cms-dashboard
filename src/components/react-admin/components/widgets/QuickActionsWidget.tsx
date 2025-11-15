import { FC, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Box, useTheme } from '@mui/material';
import { Settings, PersonAdd, Upload, AddCircleOutline, Create, Analytics } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
    icon: ReactNode;
    label: string;
    path: string;
}

export const QuickActionsWidget: FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const buttonStyle = {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : undefined,
        color: theme.palette.mode === 'dark' ? theme.palette.grey[200] : undefined,
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : undefined,
    };
    
    const quickActions: QuickAction[] = [
        { icon: <Settings fontSize="small" />, label: '설정', path: '/settings' },
        { icon: <PersonAdd fontSize="small" />, label: '관리자 추가', path: '/privates/users/create' },
        { icon: <Upload fontSize="small" />, label: '파일 업로드', path: '/privates/files/create' },
        { icon: <AddCircleOutline fontSize="small" />, label: '메뉴 추가', path: '/privates/site-menus/create' },
        { icon: <Create fontSize="small" />, label: '게시판 글 작성', path: '/posts/create' },
        { icon: <Analytics fontSize="small" />, label: '사용자 통계 추적', path: '/privates/users/audits' },
    ];
    
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                    gridTemplateRows: 'repeat(2, 1fr)',
                    gap: 1,
                    flex: 1,
                    height: '100%',
                }}
            >
                {quickActions.map((action, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        className="flex flex-col cursor-pointer"
                        style={{
                            ...buttonStyle,
                            height: '100%',
                        }}
                        onClick={() => navigate(action.path)}
                    >
                        {action.icon}
                        <span className="text-[0.65rem] mt-0.5 leading-tight">{action.label}</span>
                    </Button>
                ))}
            </Box>
        </Box>
    );
};
