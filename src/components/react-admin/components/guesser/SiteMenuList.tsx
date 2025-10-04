import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  CreateButton,
  TopToolbar,
  ExportButton,
  useListContext,
  Button,
  useRecordContext,
  useRedirect,
} from 'react-admin';
import {
  Box,
  Chip,
  Typography,
} from '@mui/material';
import {
  Folder,
  Menu as MenuIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { EmptyList } from '../common/EmptyList';

// 그룹별 데이터 분리 함수
const groupMenusByGroup = (menuData: any[]) => {
  const grouped = new Map();
  
  menuData.forEach(menu => {
    const groupKey = menu?.groupKeyUuid || menu?.attributes?.groupKeyUuid || 'no-group';
    const groupName = menu?.groupKey?.name || menu?.attributes?.groupKey?.name || '그룹 없음';
    
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        groupKey,
        groupName,
        menus: []
      });
    }
    
    grouped.get(groupKey).menus.push(menu);
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

// 편집 버튼
const CustomEditButton = () => {
  const record = useRecordContext();
  const redirect = useRedirect();
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    redirect('edit', 'privates/siteMenu', record.id);
  };

  return (
    <Button
      onClick={handleEditClick}
      color="primary"
      size="small"
      startIcon={<EditIcon />}
    >
      편집
    </Button>
  );
};

// 그룹별 데이터그리드 컴포넌트
const GroupedDatagrid = ({ groupData }: { groupData: any }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'primary.main', 
        color: 'primary.contrastText',
        borderRadius: '4px 4px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Folder />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {groupData.groupName}
        </Typography>
        <Chip 
          label={`${groupData.menus.length}개 메뉴`} 
          size="small" 
          sx={{ 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'inherit'
          }} 
        />
      </Box>
      
      <Datagrid
        data={groupData.menus}
        total={groupData.menus.length}
        rowClick="edit"
        sx={{
          '& .RaDatagrid-headerCell': {
            fontWeight: 600,
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
          borderRadius: '0 0 4px 4px',
        }}
      >
        <TextField source="title" label="메뉴명" />
        <TextField source="type" label="유형" />
        <TextField source="description" label="설명" />
        <TextField source="displayOrder" label="순서" />
        <FunctionField
          label="작업"
          render={() => <CustomEditButton />}
        />
      </Datagrid>
    </Box>
  );
};

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
        <GroupedDatagrid key={groupData.groupKey} groupData={groupData} />
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
