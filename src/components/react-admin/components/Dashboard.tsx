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
        
        
        </>
    );
};

export default Dashboard;
