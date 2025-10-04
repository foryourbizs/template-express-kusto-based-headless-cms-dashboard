import React from 'react';
import {
  List,
  CreateButton,
  TopToolbar,
  ExportButton,
  useListContext,
} from 'react-admin';
import {
  Box,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
} from '@mui/icons-material';
import { EmptyList } from '../common/EmptyList';
import { GroupedTable, TableColumn, GroupedTableData } from '../common/GroupedTable';

// 그룹별 데이터 분리 함수
const groupMenusByGroup = (menuData: any[]): GroupedTableData[] => {
  const grouped = new Map();
  
  menuData.forEach(menu => {
    const groupKey = menu?.groupKeyUuid || menu?.attributes?.groupKeyUuid || 'no-group';
    const groupName = menu?.groupKey?.name || menu?.attributes?.groupKey?.name || '그룹 없음';
    
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        groupKey,
        groupName,
        items: []
      });
    }
    
    grouped.get(groupKey).items.push(menu);
  });
  
  return Array.from(grouped.values()).sort((a, b) => 
    a.groupName.localeCompare(b.groupName)
  );
};

// 상단 툴바
const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

// 테이블 컬럼 정의
const menuTableColumns: TableColumn[] = [
  {
    key: 'title',
    label: '메뉴명',
    flex: 1,
    minWidth: '150px',
    priority: 1, // 가장 높은 우선순위
    hideOnMobile: false,
  },
  {
    key: 'type',
    label: '유형',
    width: '120px',
    minWidth: '100px',
    priority: 15,
    hideOnMobile: false,
    render: (value) => (
      <Chip 
        label={value === 'EXTERNAL_LINK' ? '외부링크' : '내부링크'} 
        size="small"
        color={value === 'EXTERNAL_LINK' ? 'secondary' : 'primary'}
        variant="outlined"
      />
    )
  },
  {
    key: 'description',
    label: '설명',
    width: '200px',
    minWidth: '150px',
    priority: 20,
    hideOnMobile: true,
  },
  {
    key: 'displayOrder',
    label: '순서',
    width: '80px',
    minWidth: '60px',
    align: 'center',
    priority: 10,
    hideOnMobile: false,
    render: (value) => (
      <Chip 
        label={value || 0} 
        size="small"
        variant="outlined"
        color="default"
      />
    )
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
        title="등록된 메뉴가 없습니다"
        description="첫 번째 메뉴를 추가해보세요"
        icon={<MenuIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
        createButtonLabel="메뉴 추가"
      />
    );
  }

  const groupedData = groupMenusByGroup(originalData);

  return (
    <Box>
      {groupedData.map((groupData) => (
        <GroupedTable
          key={groupData.groupKey}
          groupData={groupData}
          columns={menuTableColumns}
          resourceName="privates/siteMenu"
          itemLabel="메뉴"
          enableBulkDelete={true}
          enableSelection={true}
        />
      ))}
    </Box>
  );
};

// 메뉴 목록 컴포넌트
export const SiteMenuList = () => {
  return (
    <List
      actions={<ListActions />}
      pagination={false}
      perPage={10000}
      sort={{ field: 'displayOrder', order: 'ASC' }}
      title="메뉴 관리 (그룹별 보기)"
      queryOptions={{
        meta: {
          include: ['groupKey', 'parent']
        }
      }}
    >
      <AllGroupsDatagrid />
    </List>
  );
};

export default SiteMenuList;