import React from 'react';
import {
    List,
    useListContext,
    TopToolbar,
    RefreshButton,
    ExportButton,
    FilterButton,
    CreateButton,
    TextInput,
    SearchInput,
    SelectInput,
    DateInput,
} from 'react-admin';
import { 
    People as PeopleIcon,
    CheckCircle as ActiveIcon,
    Cancel as InactiveIcon,
    Pending as PendingIcon,
} from '@mui/icons-material';
import {
    Box,
    Typography,
    Chip,
    Avatar,
    CircularProgress,
} from '@mui/material';
import { MultiGroupTable, TableColumn, GroupedTableData } from '../common/GroupedTable';
import { EmptyList } from '../common/EmptyList';

// 상태에 따른 아이콘과 색상
const getStatusDisplay = (status: string | null | undefined) => {
    if (!status) {
        return {
            icon: <PendingIcon fontSize="small" />,
            color: 'default' as const,
            label: '알 수 없음'
        };
    }
    
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus === 'active' || lowerStatus === '활성') {
        return {
            icon: <ActiveIcon fontSize="small" />,
            color: 'success' as const,
            label: '활성'
        };
    }
    if (lowerStatus === 'inactive' || lowerStatus === '비활성') {
        return {
            icon: <InactiveIcon fontSize="small" />,
            color: 'error' as const,
            label: '비활성'
        };
    }
    if (lowerStatus === 'pending' || lowerStatus === '대기') {
        return {
            icon: <PendingIcon fontSize="small" />,
            color: 'warning' as const,
            label: '대기'
        };
    }
    
    return {
        icon: <PendingIcon fontSize="small" />,
        color: 'default' as const,
        label: status
    };
};

// 사용자 정보 표시 컴포넌트
const UserDisplay: React.FC<{ name: string; email: string }> = ({ name, email }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
            {name?.charAt(0)?.toUpperCase() || 'U'}
        </Avatar>
        <Box>
            <Typography variant="body2" fontWeight={500}>
                {name || '이름 없음'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {email || '이메일 없음'}
            </Typography>
        </Box>
    </Box>
);

// List 액션 버튼
const UserListActions = () => (
    <TopToolbar>
        <FilterButton />
        <RefreshButton />
        <ExportButton />
        <CreateButton />
    </TopToolbar>
);

// 사용자 필터
const userFilters = [
    <SearchInput 
        key="q"
        source="q" 
        alwaysOn={true}
        placeholder="사용자명, 이메일 검색..."
    />,
    <SelectInput 
        key="status"
        source="status" 
        label="상태"
        choices={[
            { id: 'active', name: '활성' },
            { id: 'inactive', name: '비활성' },
            { id: 'pending', name: '대기' }
        ]}
        emptyText="전체"
    />,
    <TextInput 
        key="role"
        source="role" 
        label="역할"
    />,
    <DateInput 
        key="createdAt_gte"
        source="createdAt_gte" 
        label="생성일 시작"
    />,
    <DateInput 
        key="createdAt_lte"
        source="createdAt_lte" 
        label="생성일 종료"
    />
];

// 메인 데이터그리드 컴포넌트
const UserDatagrid = () => {
    const listContext = useListContext();
    const { data: originalData, isPending } = listContext;

    // 테이블 컬럼 정의
    const columns: TableColumn[] = [
        {
            key: 'user',
            label: '사용자',
            width: '200px',
            render: (_, item) => (
                <UserDisplay name={item.name || item.username} email={item.email} />
            )
        },
        {
            key: 'status',
            label: '상태',
            width: '120px',
            render: (value) => {
                const { icon, color, label } = getStatusDisplay(value);
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {icon}
                        <Chip 
                            label={label} 
                            color={color} 
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                );
            }
        },
        {
            key: 'role',
            label: '역할',
            width: '100px',
            render: (value) => value ? (
                <Chip 
                    label={value} 
                    variant="outlined" 
                    size="small"
                    color="primary"
                />
            ) : '-'
        },
        {
            key: 'lastLoginAt',
            label: '마지막 로그인',
            width: '160px',
            hideOnMobile: true,
            render: (value) => value ? (
                <Typography variant="body2" fontSize="0.75rem">
                    {new Intl.DateTimeFormat('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }).format(new Date(value))}
                </Typography>
            ) : '로그인 기록 없음'
        },
        {
            key: 'createdAt',
            label: '생성일',
            width: '120px',
            hideOnMobile: true,
            render: (value) => (
                <Typography variant="body2" fontSize="0.75rem">
                    {new Intl.DateTimeFormat('ko-KR').format(new Date(value))}
                </Typography>
            )
        }
    ];

    if (isPending) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!originalData || originalData.length === 0) {
        return (
            <EmptyList
                title="등록된 사용자가 없습니다"
                description="새 사용자를 생성하여 시작하세요"
                icon={<PeopleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
                showCreateButton={true}
            />
        );
    }

    // 사용자 상태별 그룹화
    const groupedData: GroupedTableData[] = (() => {
        const grouped = new Map<string, any[]>();

        originalData.forEach(user => {
            const status = user?.status || 'unknown';
            let groupKey: string;
            let groupName: string;

            if (status === 'active' || status === '활성') {
                groupKey = 'active';
                groupName = '활성 사용자';
            } else if (status === 'inactive' || status === '비활성') {
                groupKey = 'inactive';
                groupName = '비활성 사용자';
            } else if (status === 'pending' || status === '대기') {
                groupKey = 'pending';
                groupName = '대기 사용자';
            } else {
                groupKey = 'unknown';
                groupName = '기타 사용자';
            }

            if (!grouped.has(groupKey)) {
                grouped.set(groupKey, []);
            }
            grouped.get(groupKey)!.push(user);
        });

        // 그룹 정렬
        const sortOrder = { 'active': 0, 'pending': 1, 'inactive': 2, 'unknown': 99 };
        return Array.from(grouped.entries())
            .map(([groupKey, items]) => ({
                groupKey,
                groupName: groupKey === 'active' ? '활성 사용자' :
                          groupKey === 'pending' ? '대기 사용자' :
                          groupKey === 'inactive' ? '비활성 사용자' : '기타 사용자',
                items: items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            }))
            .sort((a, b) => (sortOrder[a.groupKey as keyof typeof sortOrder] || 99) - (sortOrder[b.groupKey as keyof typeof sortOrder] || 99));
    })();

    return (
        <MultiGroupTable
            groupedData={groupedData}
            columns={columns}
            enableSelection={true}
            enableBulkDelete={true}
            groupIcon={<PeopleIcon />}
            itemLabel="사용자"
            crudActions={{
                enableShow: true,
                enableEdit: true,
                enableDelete: true,
                enableCreate: true,
                resource: 'privates/users'
            }}
        />
    );
};

export const UserList = () => (
    <List 
        actions={<UserListActions />} 
        filters={userFilters}
        title="사용자 관리"
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={25}
    >
        <UserDatagrid />
    </List>
);

export default UserList;