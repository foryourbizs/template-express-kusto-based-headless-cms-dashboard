import { FC } from 'react';
import { Typography, List, ListItem, ListItemText, Avatar, useTheme } from '@mui/material';

export const RecentActivityWidget: FC = () => {
    const theme = useTheme();
    
    return (
        <List dense style={{ color: theme.palette.text.primary }}>
            <ListItem>
                <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                    U
                </Avatar>
                <ListItemText
                    primary="새 사용자 등록"
                    secondary="5분 전"
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                />
            </ListItem>
            <ListItem>
                <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'success.main' }}>
                    F
                </Avatar>
                <ListItemText
                    primary="파일 업로드 완료"
                    secondary="12분 전"
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                />
            </ListItem>
            <ListItem>
                <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'warning.main' }}>
                    S
                </Avatar>
                <ListItemText
                    primary="시스템 백업 시작"
                    secondary="1시간 전"
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                />
            </ListItem>
        </List>
    );
};
