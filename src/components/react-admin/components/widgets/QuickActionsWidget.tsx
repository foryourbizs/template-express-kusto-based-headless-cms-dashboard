import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@mui/material';
import { Add, Upload, Settings, Refresh } from '@mui/icons-material';

export const QuickActionsWidget: FC = () => {
    const theme = useTheme();

    const buttonStyle = {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : undefined,
        color: theme.palette.mode === 'dark' ? theme.palette.grey[200] : undefined,
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : undefined,
    };
    
    return (
        <div className="grid grid-cols-2 gap-2" style={{ color: theme.palette.text.primary }}>
            <Button 
                variant="outline" 
                className="flex flex-col h-20"
                style={buttonStyle}
            >
                <Add />
                <span className="text-xs mt-1">사용자 추가</span>
            </Button>
            <Button 
                variant="outline" 
                className="flex flex-col h-20"
                style={buttonStyle}
            >
                <Upload />
                <span className="text-xs mt-1">파일 업로드</span>
            </Button>
            <Button 
                variant="outline" 
                className="flex flex-col h-20"
                style={buttonStyle}
            >
                <Settings />
                <span className="text-xs mt-1">설정</span>
            </Button>
            <Button 
                variant="outline" 
                className="flex flex-col h-20"
                style={buttonStyle}
            >
                <Refresh />
                <span className="text-xs mt-1">새로고침</span>
            </Button>
        </div>
    );
};
