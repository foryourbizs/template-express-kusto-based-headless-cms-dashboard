import { FC, useState } from 'react';
import {
    useTheme,
} from '@mui/material';

import { useDataProvider } from 'react-admin';

import { Button } from "@/components/ui/button"


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
        <>
            <Button>xxx</Button>
        
        </>
    );
};

export default Dashboard;
