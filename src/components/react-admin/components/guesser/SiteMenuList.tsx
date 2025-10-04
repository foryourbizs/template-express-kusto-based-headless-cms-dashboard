import React, { useState } from 'react';
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
  BulkDeleteButton,
  useDelete,
  useNotify,
  useRefresh,
  DatagridConfigurable,
} from 'react-admin';
import {
  Box,
  Chip,
  Typography,
  Checkbox,
  IconButton,
} from '@mui/material';
import {
  Folder,
  Menu as MenuIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
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
const CustomEditButton = ({ record }: { record?: any }) => {
  const redirect = useRedirect();
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (record && record.id) {
      redirect('edit', 'privates/siteMenu', record.id);
    }
  };

  return (
    <Button
      onClick={handleEditClick}
      color="primary"
      size="small"
      startIcon={<EditIcon />}
      disabled={!record || !record.id}
    >
      편집
    </Button>
  );
};

// 데이터를 그룹별로 정렬하고 그룹 헤더를 포함한 플랫 리스트로 변환
const createGroupedFlatData = (menuData: any[]) => {
  const groupedData = groupMenusByGroup(menuData);
  const flatData: any[] = [];
  
  groupedData.forEach((group) => {
    // 그룹 헤더 항목 추가
    flatData.push({
      id: `group-header-${group.groupKey}`,
      isGroupHeader: true,
      groupName: group.groupName,
      groupKey: group.groupKey,
      menuCount: group.menus.length,
    });
    
    // 그룹의 메뉴들 추가
    group.menus.forEach((menu, index) => {
      flatData.push({
        ...menu,
        isGroupHeader: false,
        isFirstInGroup: index === 0,
        isLastInGroup: index === group.menus.length - 1,
        groupName: group.groupName,
      });
    });
  });
  
  return flatData;
};

// 그룹 헤더 렌더링 컴포넌트
const GroupHeaderRow = ({ record }: { record: any }) => {
  if (!record.isGroupHeader) return null;
  
  return (
    <Box sx={{ 
      p: 2, 
      backgroundColor: 'primary.main', 
      color: 'primary.contrastText',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      borderRadius: 1,
      mb: 1
    }}>
      <Folder />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {record.groupName}
      </Typography>
      <Chip 
        label={`${record.menuCount}개 메뉴`} 
        size="small" 
        sx={{ 
          backgroundColor: 'rgba(255,255,255,0.2)',
          color: 'inherit'
        }} 
      />
    </Box>
  );
};

// 독립적인 선택 상태를 가진 그룹별 데이터그리드 컴포넌트
const GroupedDatagrid = ({ groupData, groupIndex }: { groupData: any; groupIndex: number }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteOne] = useDelete();
  const notify = useNotify();
  const refresh = useRefresh();

  // 개별 체크박스 핸들러
  const handleToggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  // 전체 선택/해제 핸들러
  const handleToggleSelectAll = () => {
    if (selectedIds.length === groupData.menus.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(groupData.menus.map((menu: any) => menu.id));
    }
  };

  // 선택된 항목들 삭제
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      await Promise.all(
        selectedIds.map(id => 
          deleteOne('privates/siteMenu', { id })
        )
      );
      notify(`${selectedIds.length}개 메뉴가 삭제되었습니다`, { type: 'info' });
      setSelectedIds([]);
      refresh();
    } catch (error: any) {
      notify(`삭제 중 오류가 발생했습니다: ${error.message}`, { type: 'error' });
    }
  };

  const isAllSelected = selectedIds.length === groupData.menus.length && groupData.menus.length > 0;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < groupData.menus.length;

  return (
    <Box sx={{ mb: 3 }}>
      {/* 그룹 헤더 */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'primary.main', 
        color: 'primary.contrastText',
        borderRadius: '4px 4px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
        
        {/* 선택된 항목 표시 및 삭제 버튼 */}
        {selectedIds.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 1,
            px: 2,
            py: 0.5
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: 'inherit',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {selectedIds.length}개 선택됨
            </Typography>
            <IconButton
              onClick={handleBulkDelete}
              size="small"
              sx={{ 
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      
      {/* 커스텀 테이블 */}
      <Box sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        borderTop: 'none',
        borderRadius: '0 0 4px 4px',
        overflow: 'hidden'
      }}>
        {/* 테이블 헤더 */}
        <Box sx={{ 
          display: 'flex',
          backgroundColor: 'rgba(25, 118, 210, 0.08)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: '52px',
          alignItems: 'center'
        }}>
          <Box sx={{ width: '48px', display: 'flex', justifyContent: 'center' }}>
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={handleToggleSelectAll}
              size="small"
            />
          </Box>
          <Box sx={{ flex: 1, px: 2, fontWeight: 600, fontSize: '0.875rem' }}>메뉴명</Box>
          <Box sx={{ width: '120px', px: 2, fontWeight: 600, fontSize: '0.875rem' }}>유형</Box>
          <Box sx={{ width: '200px', px: 2, fontWeight: 600, fontSize: '0.875rem' }}>설명</Box>
          <Box sx={{ width: '80px', px: 2, fontWeight: 600, fontSize: '0.875rem' }}>순서</Box>
          <Box sx={{ width: '100px', px: 2, fontWeight: 600, fontSize: '0.875rem' }}>작업</Box>
        </Box>
        
        {/* 테이블 바디 */}
        {groupData.menus.map((menu: any, index: number) => (
          <Box 
            key={menu.id}
            sx={{ 
              display: 'flex',
              borderBottom: index < groupData.menus.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
              minHeight: '52px',
              alignItems: 'center',
              backgroundColor: selectedIds.includes(menu.id) ? 'action.selected' : 'inherit',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <Box sx={{ width: '48px', display: 'flex', justifyContent: 'center' }}>
              <Checkbox
                checked={selectedIds.includes(menu.id)}
                onChange={() => handleToggleSelection(menu.id)}
                size="small"
              />
            </Box>
            <Box 
              sx={{ flex: 1, px: 2, cursor: 'pointer' }}
              onClick={() => window.location.href = `#/privates/siteMenu/${menu.id}`}
            >
              {menu.title || '-'}
            </Box>
            <Box sx={{ width: '120px', px: 2 }}>
              {menu.type || 'INTERNAL_LINK'}
            </Box>
            <Box sx={{ width: '200px', px: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {menu.description || '-'}
            </Box>
            <Box sx={{ width: '80px', px: 2 }}>
              {menu.displayOrder || 0}
            </Box>
            <Box sx={{ width: '100px', px: 2 }}>
              <CustomEditButton record={menu} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// 통합 데이터그리드 컴포넌트
const UnifiedGroupDatagrid = () => {
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
      {groupedData.map((groupData, index) => (
        <GroupedDatagrid 
          key={`group-${groupData.groupKey}-${index}`}
          groupData={groupData} 
          groupIndex={index}
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
      <UnifiedGroupDatagrid />
    </List>
  );
};

export default SiteMenuList;
