import React from 'react';
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    ReferenceField,
    ChipField,
    FunctionField,
    useRecordContext,
    TopToolbar,
    ListButton,
    EditButton,
} from 'react-admin';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Avatar,
    Paper,
    Divider,
} from '@mui/material';
import {
    Person as PersonIcon,
    Computer as ComputerIcon,
    Security as SecurityIcon,
    AccessTime as AccessTimeIcon,
    Info as InfoIcon,
} from '@mui/icons-material';

// 상단 액션 툴바
const AuditShowActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

// 변경사항 표시 컴포넌트
const ChangesField = () => {
    const record = useRecordContext();
    
    if (!record?.changes) {
        return <Typography variant="body2" color="text.secondary">변경사항 없음</Typography>;
    }

    return (
        <Paper elevation={1} sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom>
                변경사항:
            </Typography>
            <Typography
                component="pre"
                variant="body2"
                sx={{
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: 300,
                    overflow: 'auto',
                }}
            >
                {JSON.stringify(record.changes, null, 2)}
            </Typography>
        </Paper>
    );
};

// 사용자 정보 표시 컴포넌트
const UserInfoField = () => {
    const record = useRecordContext();
    
    if (!record) return null;

    const userName = record.username || record.userEmail || record.userId || '알 수 없는 사용자';
    const userUuid = record.userUuid;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 40, height: 40 }}>
                <PersonIcon />
            </Avatar>
            <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                    {userName}
                </Typography>
                {userUuid && (
                    <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                        UUID: {userUuid}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

// 액션 타입에 따른 색상 반환
const getActionColor = (action: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('create') || lowerAction.includes('생성') || lowerAction.includes('add')) {
        return 'success';
    }
    if (lowerAction.includes('update') || lowerAction.includes('수정') || lowerAction.includes('edit')) {
        return 'primary';
    }
    if (lowerAction.includes('delete') || lowerAction.includes('삭제') || lowerAction.includes('remove')) {
        return 'error';
    }
    if (lowerAction.includes('view') || lowerAction.includes('조회') || lowerAction.includes('read')) {
        return 'info';
    }
    if (lowerAction.includes('login') || lowerAction.includes('로그인')) {
        return 'success';
    }
    if (lowerAction.includes('logout') || lowerAction.includes('로그아웃')) {
        return 'default';
    }
    return 'secondary';
};

// 액션 필드 컴포넌트
const ActionField = () => {
    const record = useRecordContext();
    
    if (!record?.action) return null;

    return (
        <Chip 
            label={record.action} 
            color={getActionColor(record.action)}
            variant="outlined"
            sx={{ fontWeight: 600 }}
        />
    );
};

export const UserAuditsShow = () => (
    <Show actions={<AuditShowActions />} title="감사 로그 상세">
        <SimpleShowLayout>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    {/* 사용자 정보 */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon color="primary" />
                            사용자 정보
                        </Typography>
                        <UserInfoField />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* 액션 정보 */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SecurityIcon color="primary" />
                            액션 정보
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">액션</Typography>
                                <ActionField />
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">리소스</Typography>
                                <ChipField source="resource" variant="outlined" />
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">리소스 ID</Typography>
                                <TextField source="resourceId" sx={{ fontFamily: 'monospace' }} />
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* 기술적 정보 */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InfoIcon color="primary" />
                            기술적 정보
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">IP 주소</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <ComputerIcon fontSize="small" color="action" />
                                    <TextField source="ipAddress" sx={{ fontFamily: 'monospace' }} />
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">생성일시</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <AccessTimeIcon fontSize="small" color="action" />
                                    <DateField 
                                        source="createdAt" 
                                        showTime 
                                        options={{
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: false
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* 추가 정보 */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">ID</Typography>
                            <TextField source="id" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }} />
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* 변경사항 */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        변경사항
                    </Typography>
                    <ChangesField />
                </CardContent>
            </Card>
        </SimpleShowLayout>
    </Show>
);

export default UserAuditsShow;