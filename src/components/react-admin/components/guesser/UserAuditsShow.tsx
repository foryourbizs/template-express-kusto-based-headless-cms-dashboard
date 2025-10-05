import React from 'react';
import { useRecordContext } from 'react-admin';
import {
    Box,
    Typography,
    Avatar,
    Chip,
} from '@mui/material';
import {
    Person as PersonIcon,
    Computer as ComputerIcon,
    Security as SecurityIcon,
    Info as InfoIcon,
    AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { GenericShow, ShowSection } from '../common';

// 사용자 정보 표시 컴포넌트
const UserInfoField = () => {
    const record = useRecordContext();
    
    const userName = record?.username || record?.userEmail || record?.userId || '알 수 없는 사용자';
    const userUuid = record?.userUuid;

    if (!record) {
        return (
            <Typography variant="body2" color="text.secondary">
                사용자 정보 없음
            </Typography>
        );
    }

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
const getActionColor = (action: string | null | undefined): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    if (!action) return 'default';
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
const ActionChip = (value: string) => (
    <Chip 
        label={value} 
        color={getActionColor(value)}
        variant="outlined"
        sx={{ fontWeight: 600 }}
    />
);

// IP 주소 표시 컴포넌트
const IPAddressField = (value: string) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ComputerIcon fontSize="small" color="action" />
        <Typography variant="body2" fontFamily="monospace">
            {value || '-'}
        </Typography>
    </Box>
);

// 생성일시 표시 컴포넌트
const DateTimeField = (value: string) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTimeIcon fontSize="small" color="action" />
        <Typography variant="body2">
            {value ? new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).format(new Date(value)) : '-'}
        </Typography>
    </Box>
);

export const UserAuditsShow = () => {
    const sections: ShowSection[] = [
        {
            title: '사용자 정보',
            icon: <PersonIcon color="primary" />,
            columns: 1,
            fields: [
                {
                    source: 'userInfo',
                    label: '사용자',
                    type: 'custom',
                    render: () => <UserInfoField />
                }
            ]
        },
        {
            title: '액션 정보',
            icon: <SecurityIcon color="primary" />,
            columns: 3,
            fields: [
                {
                    source: 'action',
                    label: '액션',
                    type: 'custom',
                    render: (value) => ActionChip(value)
                },
                {
                    source: 'resource',
                    label: '리소스',
                    type: 'chip',
                    color: 'default'
                },
                {
                    source: 'resourceId',
                    label: '리소스 ID',
                    type: 'text'
                }
            ]
        },
        {
            title: '기술적 정보',
            icon: <InfoIcon color="primary" />,
            columns: 2,
            fields: [
                {
                    source: 'ipAddress',
                    label: 'IP 주소',
                    type: 'custom',
                    render: (value) => IPAddressField(value)
                },
                {
                    source: 'createdAt',
                    label: '생성일시',
                    type: 'custom',
                    render: (value) => DateTimeField(value)
                },
                {
                    source: 'id',
                    label: 'ID',
                    type: 'text'
                }
            ]
        },
        {
            title: '변경사항',
            columns: 1,
            fields: [
                {
                    source: 'changes',
                    label: '변경 내역',
                    type: 'json'
                }
            ]
        }
    ];

    return (
        <GenericShow
            title="감사 로그 상세"
            sections={sections}
            enableEdit={false}
            enableDelete={false}
        />
    );
};

export default UserAuditsShow;