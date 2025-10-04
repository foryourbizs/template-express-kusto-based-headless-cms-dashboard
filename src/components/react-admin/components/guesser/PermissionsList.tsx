import React from 'react';
import {
  List,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  RefreshButton,
  TextInput,
  useListContext,
} from 'react-admin';
import { Box, Chip } from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';
import { EmptyList } from '../common/EmptyList';
import { GroupedTable, TableColumn, GroupedTableData } from '../common/GroupedTable';

// 권한 전용 액션 버튼들
const PermissionActions = () => (
  <TopToolbar>
    <FilterButton />
    <RefreshButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

// 권한 전용 필터
const permissionFilters = [
  <TextInput key="name" label="권한명" source="name" placeholder="권한명 검색..." />,
  <TextInput key="resource" label="리소스" source="resource" placeholder="리소스 검색..." />,
  <TextInput key="action" label="액션" source="action" placeholder="액션 검색..." />,
  <TextInput key="description" label="설명" source="description" placeholder="설명 검색..." />,
];

// 권한 데이터를 리소스별로 그룹화
const groupPermissionsByResource = (permissionData: any[]): GroupedTableData[] => {
  const grouped = new Map();
  
  permissionData.forEach(permission => {
    const resource = permission.resource || '기타';
    const groupKey = resource;
    const groupName = `${resource} 권한`;
    
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        groupKey,
        groupName,
        items: []
      });
    }
    
    grouped.get(groupKey).items.push(permission);
  });
  
  return Array.from(grouped.values()).sort((a, b) => 
    a.groupName.localeCompare(b.groupName)
  );
};

// 테이블 컬럼 정의
const permissionTableColumns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: '80px',
  },
  {
    key: 'name',
    label: '권한명',
    flex: 1,
  },
  {
    key: 'resource',
    label: '리소스',
    width: '120px',
  },
  {
    key: 'action',
    label: '액션',
    width: '120px',
    render: (value) => (
      <Chip 
        label={value || 'READ'} 
        color="primary"
        size="small"
        variant="outlined"
      />
    )
  },
  {
    key: 'description',
    label: '설명',
    width: '200px',
  },
  {
    key: 'isSystem',
    label: '시스템 권한',
    width: '100px',
    align: 'center',
    render: (value) => (
      <Chip 
        label={value ? '시스템' : '사용자'} 
        color={value ? 'error' : 'default'}
        size="small"
      />
    )
  },
  {
    key: 'createdAt',
    label: '생성일',
    width: '150px',
    render: (value) => value ? new Date(value).toLocaleString('ko-KR') : '-'
  },
  {
    key: 'updatedAt',
    label: '수정일',
    width: '150px',
    render: (value) => value ? new Date(value).toLocaleString('ko-KR') : '-'
  },
];

// 전체 그룹 표시 컴포넌트
const AllGroupsDatagrid = () => {
  const listContext = useListContext();
  const { data: originalData, isPending } = listContext;
  
  if (isPending) {
    return <div>로딩 중...</div>;
  }

  if (!originalData || originalData.length === 0) {
    return (
      <EmptyList
        title="등록된 권한이 없습니다"
        description="권한을 추가하여 부가적인 시스템 제어를 설정할 수 있습니다"
        icon={<SecurityIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
        createButtonLabel="권한 추가"
      />
    );
  }

  const groupedData = groupPermissionsByResource(originalData);

  return (
    <Box>
      {groupedData.map((groupData) => (
        <GroupedTable
          key={groupData.groupKey}
          groupData={groupData}
          columns={permissionTableColumns}
          resourceName="privates/permissions"
          itemLabel="권한"
          enableBulkDelete={true}
          enableSelection={true}
          groupIcon={<SecurityIcon />}
        />
      ))}
    </Box>
  );
};

// 권한 리스트 컴포넌트
export const PermissionsListWithDelete = (props: any) => {
  return (
    <List
      {...props}
      actions={<PermissionActions />}
      filters={permissionFilters}
      title="권한 관리 (리소스별 보기)"
    >
      <AllGroupsDatagrid />
    </List>
  );
};

export default PermissionsListWithDelete;