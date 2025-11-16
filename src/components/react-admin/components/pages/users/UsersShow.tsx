"use client";

import {
    Show,
    TabbedShowLayout,
    Tab,
    TextField,
    EmailField,
    DateField,
    BooleanField,
    FunctionField,
    useRecordContext,
    Labeled,
} from 'react-admin';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider,
    Alert,
    Stack,
} from '@mui/material';
import {
    Person,
    Security,
    VpnKey,
    History,
    Info,
} from '@mui/icons-material';

const StatusChip = () => {
    const record = useRecordContext();
    if (!record) return null;

    const getStatusInfo = () => {
        if (record.isSuspended) return { label: '정지됨', color: 'error' as const };
        if (!record.isActive) return { label: '비활성', color: 'default' as const };
        if (!record.isVerified) return { label: '미인증', color: 'warning' as const };
        return { label: '활성', color: 'success' as const };
    };

    const { label, color } = getStatusInfo();
    return <Chip label={label} color={color} />;
};

export const UsersShow = () => {
    return (
        <Show>
            <TabbedShowLayout>
                {/* 기본 정보 탭 */}
                <Tab label="기본 정보" icon={<Person />}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <Labeled label="ID"><TextField source="id" /></Labeled>
                        {/* <Labeled label="UUID"><TextField source="uuid" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }} /></Labeled> */}
                        <Labeled label="사용자명"><TextField source="username" /></Labeled>
                        <Labeled label="이메일"><EmailField source="email" /></Labeled>
                        <Labeled label="이름"><TextField source="firstName" emptyText="-" /></Labeled>
                        <Labeled label="성"><TextField source="lastName" emptyText="-" /></Labeled>
                        <Labeled label="전화번호"><TextField source="phoneNumber" emptyText="-" /></Labeled>
                        <Labeled label="시간대"><TextField source="timezone" /></Labeled>
                        <Labeled label="언어/지역"><TextField source="locale" /></Labeled>
                    </Box>
                </Tab>

                {/* 계정 상태 탭 */}
                <Tab label="계정 상태" icon={<Info />}>
                    <Stack spacing={2}>
                        <Labeled label="현재 상태">
                            <FunctionField render={() => <StatusChip />} />
                        </Labeled>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                            <Labeled label="활성화"><BooleanField source="isActive" /></Labeled>
                            <Labeled label="이메일 인증"><BooleanField source="isVerified" /></Labeled>
                            <Labeled label="계정 정지"><BooleanField source="isSuspended" /></Labeled>
                        </Box>
                    </Stack>
                </Tab>

                {/* 보안 설정 탭 */}
                <Tab label="보안" icon={<Security />}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VpnKey /> 인증 설정
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={2}>
                                <Labeled label="2단계 인증"><BooleanField source="twoFactorEnabled" /></Labeled>
                                <Labeled label="JWT 버전"><TextField source="jwtVersion" /></Labeled>
                                <Labeled label="마지막 비밀번호 변경"><DateField source="lastPasswordChange" showTime emptyText="-" /></Labeled>
                            </Stack>
                        </Box>

                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Security /> 로그인 보안
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={2}>
                                <Labeled label="로그인 시도 횟수">
                                    <FunctionField
                                        render={(record: any) => (
                                            <Chip
                                                label={record.loginAttempts || 0}
                                                color={record.loginAttempts >= 5 ? 'error' : 'default'}
                                                size="small"
                                            />
                                        )}
                                    />
                                </Labeled>
                                <Labeled label="계정 잠금 해제 시간"><DateField source="lockoutUntil" showTime emptyText="잠금 없음" /></Labeled>
                                <Labeled label="마지막 로그인 IP"><TextField source="lastLoginIp" emptyText="-" sx={{ fontFamily: 'monospace' }} /></Labeled>
                            </Stack>
                        </Box>
                    </Stack>
                </Tab>

                {/* 활동 기록 탭 */}
                <Tab label="활동 기록" icon={<History />}>
                    <Stack spacing={3}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <Labeled label="생성일시"><DateField source="createdAt" showTime /></Labeled>
                            <Labeled label="수정일시"><DateField source="updatedAt" showTime /></Labeled>
                            <Labeled label="마지막 로그인"><DateField source="lastLoginAt" showTime emptyText="로그인 기록 없음" /></Labeled>
                            <Labeled label="삭제일시"><DateField source="deletedAt" showTime emptyText="활성 상태" /></Labeled>
                        </Box>

                        <FunctionField
                            render={(record: any) => {
                                if (record.deletedAt) {
                                    return (
                                        <Alert severity="warning">
                                            이 계정은 {new Date(record.deletedAt).toLocaleString('ko-KR')}에 삭제되었습니다.
                                        </Alert>
                                    );
                                }
                                if (record.isSuspended) {
                                    return <Alert severity="error">이 계정은 현재 정지 상태입니다.</Alert>;
                                }
                                if (!record.isActive) {
                                    return <Alert severity="warning">이 계정은 비활성 상태입니다.</Alert>;
                                }
                                if (!record.isVerified) {
                                    return <Alert severity="info">이메일 인증이 완료되지 않았습니다.</Alert>;
                                }
                                return <Alert severity="success">정상 활성 계정입니다.</Alert>;
                            }}
                        />
                    </Stack>
                </Tab>
            </TabbedShowLayout>
        </Show>
    );
};
