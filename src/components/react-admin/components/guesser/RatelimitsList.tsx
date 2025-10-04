import React from 'react';
import {
  List,
  TopToolbar,
  CreateButton,
  ExportButton,
  RefreshButton,
  FilterButton,
  TextInput,
  useListContext,
} from 'react-admin';
import { Box, Chip } from '@mui/material';
import { Speed as SpeedIcon } from '@mui/icons-material';
import { EmptyList } from '../common/EmptyList';
import { GroupedTable, TableColumn, GroupedTableData } from '../common/GroupedTable';

// Rate Limit을 유형별로 그룹화
const groupRateLimitsByType = (rateData: any[]): GroupedTableData[] => {
  const grouped = new Map();
  
  rateData.forEach(rate => {
    let groupKey: string;
    let groupName: string;
    
    if (!rate.isActive) {
      groupKey = 'inactive';
      groupName = '비활성 제한';
    } else if (rate.requests > 1000) {
      groupKey = 'high';
      groupName = '높은 제한 (1000+)';
    } else if (rate.requests > 100) {
      groupKey = 'medium';
      groupName = '중간 제한 (100-1000)';
    } else {
      groupKey = 'low';
      groupName = '낮은 제한 (~100)';
    }
    
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        groupKey,
        groupName,
        items: []
      });
    }
    
    grouped.get(groupKey).items.push(rate);
  });
  
  // 그룹 순서: 높은 -> 중간 -> 낮은 -> 비활성
  const order = ['high', 'medium', 'low', 'inactive'];
  return order
    .map(key => grouped.get(key))
    .filter(group => group && group.items.length > 0);
};

// 테이블 컬럼 정의
const rateTableColumns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: '80px',
  },
  {
    key: 'identifier',
    label: '식별자',
    flex: 1,
  },
  {
    key: 'requests',
    label: '요청 수',
    width: '100px',
    align: 'center',
    render: (value) => value?.toLocaleString() || 0
  },
  {
    key: 'windowMs',
    label: '시간 창(ms)',
    width: '120px',
    align: 'center',
    render: (value) => value?.toLocaleString() || 0
  },
  {
    key: 'isActive',
    label: '활성',
    width: '80px',
    align: 'center',
    render: (value) => (
      <Chip 
        label={value ? '활성' : '비활성'} 
        color={value ? 'success' : 'default'}
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

// 필터
const rateFilters = [
  <TextInput key="identifier" label="식별자" source="identifier" placeholder="식별자 검색..." />,
];

// 상단 툴바
const RateListActions = () => (
  <TopToolbar>
    <FilterButton />
    <RefreshButton />
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
        title="등록된 Rate Limit이 없습니다"
        description="첫 번째 Rate Limit을 추가해보세요"
        icon={<SpeedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
        createButtonLabel="Rate Limit 추가"
      />
    );
  }

  const groupedData = groupRateLimitsByType(originalData);

  return (
    <Box>
      {groupedData.map((groupData) => (
        <GroupedTable
          key={groupData.groupKey}
          groupData={groupData}
          columns={rateTableColumns}
          resourceName="privates/rateLimits"
          itemLabel="제한"
          enableBulkDelete={true}
          enableSelection={true}
          groupIcon={<SpeedIcon />}
        />
      ))}
    </Box>
  );
};

// Rate Limits 리스트 컴포넌트
export const RatelimitsList = () => (
  <List
    actions={<RateListActions />}
    filters={rateFilters}
    title="Rate Limit 관리 (제한별 보기)"
  >
    <AllGroupsDatagrid />
  </List>
);

export default RatelimitsList;