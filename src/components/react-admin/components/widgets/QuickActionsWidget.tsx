import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Add, Upload, Settings, Refresh } from '@mui/icons-material';

export const QuickActionsWidget: FC = () => {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="flex flex-col h-20">
                <Add />
                <span className="text-xs mt-1">사용자 추가</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-20">
                <Upload />
                <span className="text-xs mt-1">파일 업로드</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-20">
                <Settings />
                <span className="text-xs mt-1">설정</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-20">
                <Refresh />
                <span className="text-xs mt-1">새로고침</span>
            </Button>
        </div>
    );
};
