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
import { Storage as StorageIcon } from '@mui/icons-material';
import { EmptyList } from '../common/EmptyList';
import { GroupedTable, TableColumn, GroupedTableData } from '../common/GroupedTable';

// 스토리지를 유형별로 그룹화
const groupStoragesByType = (storageData: any[]): GroupedTableData[] => {
  const grouped = new Map();
  
  storageData.forEach(storage => {
    let groupKey: string;
    let groupName: string;
    
    const provider = storage.provider?.toLowerCase() || 'unknown';
    
    if (provider.includes('aws') || provider.includes('s3')) {
      groupKey = 'aws';
      groupName = 'AWS S3';
    } else if (provider.includes('gcp') || provider.includes('google')) {
      groupKey = 'gcp';
      groupName = 'Google Cloud Storage';
    } else if (provider.includes('azure')) {
      groupKey = 'azure';
      groupName = 'Azure Blob Storage';
    } else if (provider.includes('local') || provider.includes('file')) {
      groupKey = 'local';
      groupName = '로컬 스토리지';
    } else {
      groupKey = 'other';
      groupName = '기타 스토리지';
    }
    
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        groupKey,
        groupName,
        items: []
      });
    }
    
    grouped.get(groupKey).items.push(storage);
  });
  
  const order = ['local', 'aws', 'gcp', 'azure', 'other'];
  return order
    .map(key => grouped.get(key))
    .filter(group => group && group.items.length > 0);
};

// 테이블 컬럼 정의
const storageTableColumns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: '80px',
  },
  {
    key: 'name',
    label: '스토리지명',
    flex: 1,
  },
  {
    key: 'provider',
    label: '제공자',
    width: '120px',
    render: (value) => (
      <Chip 
        label={value || 'Unknown'} 
        color="primary"
        size="small"
        variant="outlined"
      />
    )
  },
  {
    key: 'region',
    label: '지역',
    width: '100px',
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

const AllGroupsDatagrid = () => {
  const listContext = useListContext();
  const { data: originalData, isPending } = listContext;
  
  if (isPending) return <div>로딩 중...</div>;

  if (!originalData || originalData.length === 0) {
    return (
      <EmptyList
        title="등록된 오브젝트 스토리지가 없습니다"
        description="첫 번째 스토리지를 추가해보세요"
        icon={<StorageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
        createButtonLabel="스토리지 추가"
      />
    );
  }

  const groupedData = groupStoragesByType(originalData);

  return (
    <Box>
      {groupedData.map((groupData) => (
        <GroupedTable
          key={groupData.groupKey}
          groupData={groupData}
          columns={storageTableColumns}
          resourceName="privates/objectStorages"
          itemLabel="스토리지"
          enableBulkDelete={true}
          enableSelection={true}
          groupIcon={<StorageIcon />}
        />
      ))}
    </Box>
  );
};

export const ObjectStoragesList = () => (
  <List
    actions={
      <TopToolbar>
        <FilterButton />
        <CreateButton />
        <ExportButton />
      </TopToolbar>
    }
    filters={[
      <TextInput key="name" label="스토리지명" source="name" placeholder="스토리지명 검색..." />,
      <TextInput key="provider" label="제공자" source="provider" placeholder="제공자 검색..." />,
    ]}
    title="오브젝트 스토리지 관리 (제공자별 보기)"
  >
    <AllGroupsDatagrid />
  </List>
);

export default ObjectStoragesList;