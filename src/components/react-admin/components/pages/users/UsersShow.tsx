"use client";

import { GenericShow, ShowSection } from '../../guesser/GenericShow';
import {
    Person,
    Security,
    VpnKey,
    History,
    Info,
} from '@mui/icons-material';
import { Chip, Alert, Box } from '@mui/material';

export const UsersShow = () => {
    const sections: ShowSection[] = [
        {
            title: '기본 정보',
            icon: <Person />,
            columns: 2,
            fields: [
                { source: 'id', label: 'ID', type: 'text' },
                { source: 'username', label: '사용자명', type: 'text' },
                { source: 'email', label: '이메일', type: 'text' },
                { source: 'firstName', label: '이름', type: 'text' },
                { source: 'lastName', label: '성', type: 'text' },
                { source: 'phoneNumber', label: '전화번호', type: 'text' },
                { source: 'timezone', label: '시간대', type: 'text' },
                { source: 'locale', label: '언어/지역', type: 'text' },
            ],
        },
        {
            title: '계정 상태',
            icon: <Info />,
            columns: 2,
            fields: [
                { 
                    source: 'status', 
                    label: '현재 상태', 
                    type: 'custom', 
                    render: (value, record) => {
                        if (record.isSuspended) return <Chip label="정지됨" color="error" />;
                        if (!record.isActive) return <Chip label="비활성" color="default" />;
                        if (!record.isVerified) return <Chip label="미인증" color="warning" />;
                        return <Chip label="활성" color="success" />;
                    }
                },
                { source: 'isActive', label: '활성화', type: 'boolean' },
                { source: 'isVerified', label: '이메일 인증', type: 'boolean' },
                { source: 'isSuspended', label: '계정 정지', type: 'boolean' },
                {
                    source: 'statusAlert',
                    label: '계정 상태 알림',
                    type: 'custom',
                    render: (value, record) => {
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
                    }
                },
            ],
        },
        {
            title: '보안',
            icon: <Security />,
            columns: 2,
            fields: [
                { source: 'twoFactorEnabled', label: '2단계 인증', type: 'boolean' },
                { source: 'jwtVersion', label: 'JWT 버전', type: 'text' },
                { source: 'lastPasswordChange', label: '마지막 비밀번호 변경', type: 'date' },
                {
                    source: 'loginAttempts',
                    label: '로그인 시도 횟수',
                    type: 'custom',
                    render: (value) => (
                        <Chip
                            label={value || 0}
                            color={value >= 5 ? 'error' : 'default'}
                            size="small"
                        />
                    )
                },
                { source: 'lockoutUntil', label: '계정 잠금 해제 시간', type: 'date' },
                {
                    source: 'lastLoginIp',
                    label: '마지막 로그인 IP',
                    type: 'custom',
                    render: (value) => (
                        <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {value || '-'}
                        </Box>
                    )
                },
            ],
        },
        {
            title: '활동 기록',
            icon: <History />,
            columns: 2,
            fields: [
                { source: 'createdAt', label: '생성일시', type: 'date' },
                { source: 'updatedAt', label: '수정일시', type: 'date' },
                { source: 'lastLoginAt', label: '마지막 로그인', type: 'date' },
                { source: 'deletedAt', label: '삭제일시', type: 'date' },
            ],
        },
    ];

    return (
        <GenericShow
            sections={sections}
            enableEdit={true}
            enableDelete={true}
            useTabs={true}
        />
    );
};
