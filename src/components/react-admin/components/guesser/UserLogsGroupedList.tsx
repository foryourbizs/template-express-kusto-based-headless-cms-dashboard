import React, { useMemo } from 'react';
import {
    List,
    useListContext,
    TopToolbar,
    RefreshButton,
    ExportButton,
    FilterButton,
    TextInput,
    SearchInput,
    SelectInput,
    DateInput,
} from 'react-admin';
import {
    Person as PersonIcon,
    Timeline as TimelineIcon,
    Computer as ComputerIcon,
    AccessTime as AccessTimeIcon,
    Security as SecurityIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
    Visibility as VisibilityIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import {
    Box,
    Typography,
    Chip,
    Avatar,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import { MultiGroupTable, TableColumn, GroupedTableData } from '../common/GroupedTable';
import { EmptyList } from '../common/EmptyList';

// 액션 타입에 따른 아이콘 반환
const getActionIcon = (action: string | null | undefined) => {
    if (!action) return <SecurityIcon fontSize="small" color="secondary" />;
    
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('create') || lowerAction.includes('생성') || lowerAction.includes('add') || lowerAction.includes('insert')) {
        return <AddIcon fontSize="small" color="success" />;
    }
    if (lowerAction.includes('update') || lowerAction.includes('수정') || lowerAction.includes('edit') || lowerAction.includes('modify')) {
        return <EditIcon fontSize="small" color="primary" />;
    }
    if (lowerAction.includes('delete') || lowerAction.includes('삭제') || lowerAction.includes('remove')) {
        return <DeleteIcon fontSize="small" color="error" />;
    }
    if (lowerAction.includes('view') || lowerAction.includes('조회') || lowerAction.includes('read')) {
        return <VisibilityIcon fontSize="small" color="info" />;
    }
    if (lowerAction.includes('login') || lowerAction.includes('로그인') || lowerAction.includes('signin')) {
        return <LoginIcon fontSize="small" color="success" />;
    }
    if (lowerAction.includes('logout') || lowerAction.includes('로그아웃') || lowerAction.includes('signout')) {
        return <LogoutIcon fontSize="small" color="action" />;
    }
    return <SecurityIcon fontSize="small" color="secondary" />;
};

// 액션 타입에 따른 색상 반환
const getActionColor = (action: string | null | undefined): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    if (!action) return 'secondary';
    
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('create') || lowerAction.includes('생성') || lowerAction.includes('add') || lowerAction.includes('insert')) {
        return 'success';
    }
    if (lowerAction.includes('update') || lowerAction.includes('수정') || lowerAction.includes('edit') || lowerAction.includes('modify')) {
        return 'primary';
    }
    if (lowerAction.includes('delete') || lowerAction.includes('삭제') || lowerAction.includes('remove')) {
        return 'error';
    }
    if (lowerAction.includes('view') || lowerAction.includes('조회') || lowerAction.includes('read')) {
        return 'info';
    }
    if (lowerAction.includes('login') || lowerAction.includes('로그인') || lowerAction.includes('signin')) {
        return 'success';
    }
    if (lowerAction.includes('logout') || lowerAction.includes('로그아웃') || lowerAction.includes('signout')) {
        return 'default';
    }
    return 'secondary';
};

// 시간 포맷팅 함수
const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(date);
};

// 변경 사항 표시 컴포넌트
const ChangesDisplay: React.FC<{ changes: any }> = ({ changes }) => {
    if (!changes) return <Typography variant="body2">-</Typography>;
    
    return (
        <Tooltip title={<pre>{JSON.stringify(changes, null, 2)}</pre>} arrow>
            <Box sx={{ 
                maxWidth: 150, 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'action.hover'
                }
            }}>
                <Typography 
                    variant="body2" 
                    component="pre" 
                    sx={{ 
                        fontSize: '0.75rem', 
                        margin: 0, 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {JSON.stringify(changes)}
                </Typography>
            </Box>
        </Tooltip>
    );
};

// 사용자 정보 표시 컴포넌트
const UserInfo: React.FC<{ userName: string; userUuid: string }> = ({ userName, userUuid }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                {userName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight={500}>
                {userName}
            </Typography>
        </Box>
    );
};

// 사용자 감사 로그 액션 컴포넌트
const UserLogsActions = () => (
    <TopToolbar>
        <FilterButton />
        <RefreshButton />
        <ExportButton />
    </TopToolbar>
);

// 사용자 감사 로그 필터
const logsFilters = [
    <SearchInput 
        key="q"
        source="q" 
        placeholder="사용자명, 액션, 리소스 검색..." 
        alwaysOn 
    />,
    <TextInput 
        key="action_filter"
        source="action_filter"
        label="액션"
        placeholder="액션 검색..."
    />,
    <TextInput 
        key="resource_filter"
        source="resource_filter"
        label="리소스"
        placeholder="리소스 검색..."
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

// 사용자 감사 로그 데이터그리드
const UserLogsDatagrid = () => {
    const { data, isLoading } = useListContext();
    
    // 테이블 컬럼 정의
    const columns: TableColumn[] = [
        {
            key: 'id',
            label: 'ID',
            width: '80px',
            hideOnMobile: true,
            render: (value) => (
                <Typography variant="body2" fontFamily="monospace">
                    {value}
                </Typography>
            )
        },
        {
            key: 'action',
            label: '액션',
            width: '120px',
            render: (value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getActionIcon(value)}
                    <Chip 
                        label={value || '알 수 없음'} 
                        color={getActionColor(value)} 
                        size="small"
                        variant="outlined"
                    />
                </Box>
            )
        },
        {
            key: 'resource',
            label: '리소스',
            width: '120px',
            render: (value) => value ? (
                <Chip 
                    label={value} 
                    variant="outlined" 
                    size="small"
                    color="default"
                />
            ) : '-'
        },
        {
            key: 'resourceId',
            label: '리소스 ID',
            width: '100px',
            hideOnMobile: true,
            render: (value) => value ? (
                <Typography variant="body2" fontFamily="monospace" fontSize="0.75rem">
                    {value.length > 10 ? `${value.substring(0, 10)}...` : value}
                </Typography>
            ) : '-'
        },
        {
            key: 'ipAddress',
            label: 'IP 주소',
            width: '120px',
            hideOnMobile: true,
            render: (value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ComputerIcon fontSize="small" color="action" />
                    <Typography variant="body2" fontFamily="monospace" fontSize="0.75rem">
                        {value || '-'}
                    </Typography>
                </Box>
            )
        },
        {
            key: 'changes',
            label: '변경 사항',
            width: '150px',
            hideOnMobile: true,
            render: (value) => <ChangesDisplay changes={value} />
        },
        {
            key: 'createdAt',
            label: '생성일시',
            width: '160px',
            render: (value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2" fontSize="0.75rem">
                        {formatDateTime(value)}
                    </Typography>
                </Box>
            )
        }
    ];

    // 데이터가 없거나 로딩 중일 때 처리
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <EmptyList
                title="등록된 감사 로그가 없습니다"
                description="사용자 활동이 발생하면 로그가 여기에 표시됩니다"
                icon={<TimelineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
            />
        );
    }

    // 사용자별로 데이터 그룹화
    const groupedData: GroupedTableData[] = useMemo(() => {
        const groups = new Map<string, any[]>();
        
        data.forEach((item: any) => {
            const userUuid = item.userUuid || 'unknown';
            if (!groups.has(userUuid)) {
                groups.set(userUuid, []);
            }
            groups.get(userUuid)!.push(item);
        });

        return Array.from(groups.entries()).map(([userUuid, items]) => {
            // 사용자 이름 결정
            let userName = '알 수 없는 사용자';
            const firstItem = items[0];
            
            if (firstItem?.username) {
                userName = firstItem.username;
            } else if (firstItem?.userEmail) {
                userName = firstItem.userEmail;
            } else if (firstItem?.userId) {
                userName = firstItem.userId;
            } else if (userUuid && userUuid !== 'unknown') {
                userName = `User-${userUuid.substring(0, 8)}`;
            }
            
            return {
                groupName: userName,
                groupKey: userUuid,
                items: items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            };
        }).sort((a, b) => a.groupName.localeCompare(b.groupName));
    }, [data]);

    return (
        <MultiGroupTable 
            groupedData={groupedData}
            columns={columns}
            enableSelection={true}
            enableBulkDelete={true}
            groupIcon={<PersonIcon />}
            itemLabel="로그"
            crudActions={{
                enableShow: true,
                enableEdit: false,
                enableDelete: true,
                enableCreate: false,
                resource: 'privates/users/audits',
                onError: (error, action, item) => {
                    console.error(`${action} 액션 실행 중 오류:`, error, item);
                    alert(`${action} 실행 중 오류가 발생했습니다: ${error.message}`);
                }
            }}
        />
    );
};

export const UserLogsGroupedList = () => {
    return (
        <List
            title="사용자 감사 로그 (사용자별 보기)"
            actions={<UserLogsActions />}
            filters={logsFilters}
            sort={{ field: 'createdAt', order: 'DESC' }}
            perPage={50}
        >
            <UserLogsDatagrid />
        </List>
    );
};

export default UserLogsGroupedList;