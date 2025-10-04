import React from 'react';
import {
  List,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  TextInput,
  useListContext,
} from 'react-admin';
import { Box, Chip } from '@mui/material';
import { Group as GroupIcon } from '@mui/icons-material';
import { EmptyList } from '../common/EmptyList';
import { GroupedTable, TableColumn, GroupedTableData } from '../common/GroupedTable';

// 검색 필터
const siteMenuGroupFilters = [
  <TextInput key="name" label="그룹명" source="name" placeholder="그룹명 검색..." />,
  <TextInput key="description" label="설명" source="description" placeholder="설명 검색..." />,
];

// 메뉴 그룹을 상태별로 그룹화
const groupMenuGroupsByType = (groupData: any[]): GroupedTableData[] => {
  const grouped = new Map();
  
  groupData.forEach(group => {
    let groupKey: string;
    let groupName: string;
    
    if (group.isSystem) {
      groupKey = 'system';
      groupName = '시스템 그룹';
    } else if (group.isActive === false) {
      groupKey = 'inactive';
      groupName = '비활성 그룹';
    } else {
      groupKey = 'user';
      groupName = '사용자 그룹';
    }
    
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        groupKey,
        groupName,
        items: []
      });
    }
    
    grouped.get(groupKey).items.push(group);
  });
  
  // 그룹 순서: 시스템 -> 사용자 -> 비활성
  const order = ['system', 'user', 'inactive'];
  return order
    .map(key => grouped.get(key))
    .filter(group => group && group.items.length > 0);
};

// 테이블 컬럼 정의
const menuGroupTableColumns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: '80px',
  },
  {
    key: 'name',
    label: '그룹명',
    flex: 1,
  },
  {
    key: 'description',
    label: '설명',
    width: '200px',
  },
  {
    key: 'displayOrder',
    label: '순서',
    width: '80px',
    align: 'center',
    render: (value) => value || 0
  },
  {
    key: 'isSystem',
    label: '시스템',
    width: '80px',
    align: 'center',
    render: (value) => (
      <Chip 
        label={value ? '시스템' : '사용자'} 
        color={value ? 'error' : 'primary'}
        size="small"
      />
    )
  },
  {
    key: 'isActive',
    label: '활성',
    width: '80px',
    align: 'center',
    render: (value) => (
      <Chip 
        label={value !== false ? '활성' : '비활성'} 
        color={value !== false ? 'success' : 'default'}
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
];

// 상단 툴바
const MenuGroupListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

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
        title="등록된 메뉴 그룹이 없습니다"
        description="첫 번째 메뉴 그룹을 추가해보세요"
        icon={<GroupIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
        createButtonLabel="메뉴 그룹 추가"
      />
    );
  }

  const groupedData = groupMenuGroupsByType(originalData);

  return (
    <Box>
      {groupedData.map((groupData) => (
        <GroupedTable
          key={groupData.groupKey}
          groupData={groupData}
          columns={menuGroupTableColumns}
          resourceName="privates/siteMenuGroup"
          itemLabel="메뉴 그룹"
          enableBulkDelete={true}
          enableSelection={true}
          groupIcon={<GroupIcon />}
        />
      ))}
    </Box>
  );
};

// 메뉴 그룹 리스트 컴포넌트
export const SiteMenuGroupList = () => (
  <List
    actions={<MenuGroupListActions />}
    filters={siteMenuGroupFilters}
    title="메뉴 그룹 관리 (유형별 보기)"
  >
    <AllGroupsDatagrid />
  </List>
);

export default SiteMenuGroupList;