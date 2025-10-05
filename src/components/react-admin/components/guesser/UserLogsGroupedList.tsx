import React, { useState, useMemo, useCallback } from 'react';
import {
    List,
    useListContext,
    TopToolbar,
    RefreshButton,
    ExportButton,
    FilterButton,
    TextInput,
    DateInput,
    SearchInput,
} from 'react-admin';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    Theme,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Person as PersonIcon,
    Timeline as TimelineIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    AccessTime as AccessTimeIcon,
    Computer as ComputerIcon,
    Security as SecurityIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import GroupedTable, { MultiGroupTable, TableColumn, GroupedTableData } from '../common/GroupedTable';
import { EmptyList } from '../common/EmptyList';

// 감사 로그 필터
const auditFilters = [
    <SearchInput key="q" source="q" alwaysOn placeholder="사용자명, 액션, 리소스 검색..." />,
    <TextInput key="action" source="action_filter" label="액션" placeholder="액션 검색..." />,
    <TextInput key="resource" source="resource_filter" label="리소스" placeholder="리소스 검색..." />,
    <DateInput key="start" source="createdAt_gte" label="시작일" />,
    <DateInput key="end" source="createdAt_lte" label="종료일" />,
];

// 상단 툴바
const AuditLogActions = () => (
    <TopToolbar>
        <FilterButton />
        <RefreshButton />
        <ExportButton />
    </TopToolbar>
);

// 액션 타입에 따른 아이콘 반환
const getActionIcon = (action: string) => {
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
const getActionColor = (action: string) => {
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

// 사용자 정보 표시 컴포넌트 (간단화)
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

// 사용자별로 로그 그룹화
const groupLogsByUser = (auditLogs: any[]): GroupedTableData[] => {
    if (!auditLogs) return [];

    const grouped = new Map<string, any[]>();

    // 로그를 사용자별로 그룹화
    auditLogs.forEach(log => {
        const userUuid = log.userUuid || 'unknown';
        if (!grouped.has(userUuid)) {
            grouped.set(userUuid, []);
        }
        grouped.get(userUuid)!.push(log);
    });

    // 그룹별 데이터 생성
    return Array.from(grouped.entries()).map(([userUuid, logs]) => {
        // 사용자 이름 결정 (여러 방법 시도)
        const firstLog = logs[0];
        let userName = '알 수 없는 사용자';
        
        // 로그에서 사용자 정보 추출 시도
        if (firstLog?.username) {
            userName = firstLog.username;
        } else if (firstLog?.userEmail) {
            userName = firstLog.userEmail;
        } else if (firstLog?.userId) {
            userName = firstLog.userId;
        } else if (userUuid !== 'unknown') {
            // UUID의 앞 8자리만 표시
            userName = `User-${userUuid.substring(0, 8)}`;
        }
        
        return {
            groupKey: userUuid,
            groupName: userName,
            items: logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        };
    }).sort((a, b) => a.groupName.localeCompare(b.groupName));
};

// 전체 그룹 표시 컴포넌트
const AllGroupsDatagrid = () => {
    const listContext = useListContext();
    const { data: originalData, isPending, total } = listContext;
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // 선택 상태 변경 핸들러 - 항상 정의됨
    const handleSelectionChange = useCallback((newSelectedIds: string[]) => {
        setSelectedIds(newSelectedIds);
    }, []);

    // 벌크 삭제 핸들러 - 항상 정의됨
    const handleBulkDelete = useCallback((selectedIds: string[]) => {
        // TODO: 실제 삭제 로직 구현
        console.log('삭제할 로그 IDs:', selectedIds);
        alert(`${selectedIds.length}개의 로그를 삭제하시겠습니까?`);
    }, []);

    // 행 클릭 핸들러 - 항상 정의됨
    const handleRowClick = useCallback((item: any) => {
        console.log('클릭된 로그:', item);
        console.log('로그 ID:', item.id);
        console.log('로그 타입:', typeof item.id);
        // TODO: 상세 보기 모달 또는 페이지로 이동
    }, []);
    
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
                title="등록된 감사 로그가 없습니다"
                description="사용자 활동이 발생하면 로그가 여기에 표시됩니다"
                icon={<TimelineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
                showCreateButton={false}
            />
        );
    }

    // 현재 페이지의 데이터를 그룹별로 분리
    const groupedData = groupLogsByUser(originalData);

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
                        label={value} 
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

    return (
        <Box>
            {/* 선택된 항목 정보 */}
            {selectedIds.length > 0 && (
                <Alert 
                    severity="info" 
                    sx={{ mb: 2 }}
                    action={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Typography variant="body2">
                                {selectedIds.length}개 선택됨
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={() => handleBulkDelete(selectedIds)}
                                color="error"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    }
                >
                    선택된 로그를 일괄 처리할 수 있습니다.
                </Alert>
            )}

            {/* 현재 페이지의 그룹별 테이블들 */}
            {groupedData.map((groupData) => (
                <GroupedTable
                    key={groupData.groupKey}
                    groupData={groupData}
                    columns={columns}
                    enableSelection={true}
                    enableBulkDelete={true}
                    selectedIds={selectedIds}
                    onSelectionChange={handleSelectionChange}
                    onBulkDelete={handleBulkDelete}
                    onRowClick={handleRowClick}
                    groupIcon={<PersonIcon />}
                    itemLabel="로그"
                    pagination={{
                        enabled: false // 서버 페이지네이션을 사용하므로 테이블 자체 페이지네이션은 비활성화
                    }}
                    crudActions={{
                        enableShow: true,
                        enableEdit: false,
                        enableDelete: true,
                        enableCreate: false,
                        resource: 'privates/users/audits', // React Admin에서 정의된 감사 로그 리소스 경로
                        onShow: (item) => {
                            console.log('보기 버튼 클릭:', item);
                            // 커스텀 처리가 필요한 경우 여기에 구현
                        },
                        onError: (error, action, item) => {
                            console.error(`${action} 액션 실행 중 오류:`, error, item);
                            alert(`${action} 실행 중 오류가 발생했습니다: ${error.message}`);
                        }
                    }}
                />
            ))}
        </Box>
    );
};

export const UserLogsGroupedList = () => (
    <List
        actions={<AuditLogActions />}
        filters={auditFilters}
        title="사용자 감사 로그 (사용자별 보기)"
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={50} // 적절한 페이지 크기로 설정
    >
        <AllGroupsDatagrid />
    </List>
);

export default UserLogsGroupedList;