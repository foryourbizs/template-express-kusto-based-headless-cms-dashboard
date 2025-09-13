import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  SelectField,
  BooleanField,
  NumberField,
  DateField,
  EditButton,
  DeleteButton,
  ShowButton,
  CreateButton,
  TopToolbar,
  FilterButton,
  ExportButton,
  useListContext,
  ReferenceField,
  ReferenceInput,
  FunctionField,
  ChipField,
  SearchInput,
  TextInput,
  SelectInput,
  useDelete,
  useRecordContext,
  useNotify,
  useRefresh,
  Button,
  useGetList,
} from 'react-admin';
import {
  Box,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Folder,
  FolderOpen,
  Link,
  ExitToApp,
  TouchApp,
  Menu as MenuIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { EmptyList } from '../common/EmptyList';

// 계층 구조 데이터 변환 함수
const buildHierarchicalData = (menuItems: any[]) => {
  // 1. 먼저 모든 메뉴를 ID로 매핑
  const menuMap = new Map();
  menuItems.forEach(item => {
    const id = item.id || item.uuid;
    const parentUUID = item.parentUUID || item.attributes?.parentUUID;
    menuMap.set(id, {
      ...item,
      children: [],
      level: 0,
      hasChildren: false,
      parentUUID
    });
  });

  // 2. 계층 구조 구성
  const rootItems: any[] = [];
  const processedItems: any[] = [];

  menuItems.forEach(item => {
    const id = item.id || item.uuid;
    const parentUUID = item.parentUUID || item.attributes?.parentUUID;
    const menuItem = menuMap.get(id);

    if (!parentUUID || parentUUID === '' || !menuMap.has(parentUUID)) {
      // 루트 메뉴
      menuItem.level = 0;
      rootItems.push(menuItem);
    } else {
      // 하위 메뉴
      const parent = menuMap.get(parentUUID);
      if (parent) {
        parent.children.push(menuItem);
        parent.hasChildren = true;
        menuItem.level = (parent.level || 0) + 1;
      }
    }
  });

  // 3. 계층적 순서로 평면화
  const flattenHierarchy = (items: any[], level = 0): any[] => {
    const result: any[] = [];
    
    // 그룹 UUID와 표시순서로 정렬
    items.sort((a, b) => {
      const groupA = a.groupKeyUuid || a.attributes?.groupKeyUuid || '';
      const groupB = b.groupKeyUuid || b.attributes?.groupKeyUuid || '';
      const orderA = a.displayOrder || a.attributes?.displayOrder || 0;
      const orderB = b.displayOrder || b.attributes?.displayOrder || 0;
      
      if (groupA !== groupB) {
        return groupA.localeCompare(groupB);
      }
      return orderA - orderB;
    });

    items.forEach(item => {
      item.level = level;
      result.push(item);
      
      if (item.children && item.children.length > 0) {
        result.push(...flattenHierarchy(item.children, level + 1));
      }
    });
    
    return result;
  };

  return flattenHierarchy(rootItems);
};

// 커스텀 훅: 계층적 데이터 가져오기
const useHierarchicalMenuData = () => {
  const { data: originalData, total, isPending, error, refetch } = useGetList('privates/siteMenu', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'displayOrder', order: 'ASC' },
    filter: {}
  });

  const hierarchicalData = React.useMemo(() => {
    if (!originalData || originalData.length === 0) return [];
    return buildHierarchicalData(originalData);
  }, [originalData]);

  return {
    data: hierarchicalData,
    total,
    isPending,
    error,
    refetch
  };
};

// 메뉴 타입 선택지
const menuTypeChoices = [
  { id: 'INTERNAL_LINK', name: '내부 링크' },
  { id: 'EXTERNAL_LINK', name: '외부 링크' },
  { id: 'BUTTON', name: '버튼' },
];

// 검색 필터
const siteMenuFilters = [
  <SearchInput source="q" placeholder="메뉴명, 설명 검색" alwaysOn />,
  <TextInput source="title" label="메뉴명" />,
  <ReferenceInput
    source="groupKeyUuid"
    reference="privates/siteMenuGroup"
    label="메뉴 그룹"
  >
    <SelectInput
      optionText={(choice: any) => choice ? `${choice.name} (${choice.key})` : ''}
      optionValue="uuid"
    />
  </ReferenceInput>,
  <SelectInput
    source="type"
    label="메뉴 타입"
    choices={menuTypeChoices}
  />,
  <SelectInput
    source="isPublic"
    label="공개 여부"
    choices={[
      { id: true, name: '공개' },
      { id: false, name: '비공개' },
    ]}
  />,
  <SelectInput
    source="requireLogin"
    label="로그인 필수"
    choices={[
      { id: true, name: '필수' },
      { id: false, name: '불필요' },
    ]}
  />,
];

// 메뉴 타입 아이콘 매핑
const getMenuTypeIcon = (type: string) => {
  switch (type) {
    case 'INTERNAL_LINK':
      return <Link fontSize="small" />;
    case 'EXTERNAL_LINK':
      return <ExitToApp fontSize="small" />;
    case 'BUTTON':
      return <TouchApp fontSize="small" />;
    default:
      return <Link fontSize="small" />;
  }
};

// 계층 구조를 시각적으로 표현하는 컴포넌트
const HierarchicalTitle = ({ record }: { record: any }) => {
  const level = record?.level || 0;
  const hasChildren = record?.hasChildren || false;
  const title = record?.title || record?.attributes?.title || '-';
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {/* 들여쓰기 */}
      {level > 0 && (
        <Box sx={{ 
          width: level * 20, 
          height: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          pr: 1
        }}>
          {/* 연결선 표시 */}
          <Box sx={{ 
            width: 12, 
            height: 1, 
            backgroundColor: 'text.secondary',
            opacity: 0.5
          }} />
        </Box>
      )}
      
      {/* 계층 아이콘 */}
      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 20 }}>
        {hasChildren ? (
          <FolderOpen 
            fontSize="small" 
            sx={{ 
              color: level === 0 ? 'primary.main' : 'warning.main',
              fontSize: '18px'
            }} 
          />
        ) : level > 0 ? (
          <MenuIcon 
            fontSize="small" 
            sx={{ 
              color: 'action.active',
              fontSize: '16px'
            }} 
          />
        ) : (
          <Folder 
            fontSize="small" 
            sx={{ 
              color: 'primary.main',
              fontSize: '18px'
            }} 
          />
        )}
      </Box>
      
      {/* 메뉴 제목 */}
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: level === 0 ? 600 : level === 1 ? 500 : 400,
          color: level === 0 ? 'primary.main' : level === 1 ? 'text.primary' : 'text.secondary',
          fontSize: level === 0 ? '0.9rem' : level === 1 ? '0.85rem' : '0.8rem'
        }}
      >
        {title}
      </Typography>
      
      {/* 레벨 및 계층 정보 */}
      <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
        {level > 0 && (
          <Chip 
            label={`L${level}`} 
            size="small" 
            variant="outlined" 
            sx={{ 
              fontSize: '0.7rem', 
              height: 18,
              '& .MuiChip-label': { px: 0.5 },
              color: level === 1 ? 'info.main' : 'warning.main',
              borderColor: level === 1 ? 'info.main' : 'warning.main'
            }}
          />
        )}
        {hasChildren && (
          <Chip 
            label={`${record.children?.length || 0}개`}
            size="small" 
            variant="filled"
            color="primary"
            sx={{ 
              fontSize: '0.7rem', 
              height: 18,
              '& .MuiChip-label': { px: 0.5 }
            }}
          />
        )}
      </Box>
    </Box>
  );
};

// 그룹키 컴포넌트
const GroupKeyField = ({ record }: { record: any }) => {
  const groupKeyUuid = record?.groupKeyUuid || record?.attributes?.groupKeyUuid || '-';
  return (
    <Chip
      label={groupKeyUuid}
      size="small"
      variant="outlined"
      color="primary"
    />
  );
};

// 메뉴 타입 컴포넌트
const MenuTypeField = ({ record }: { record: any }) => {
  const type = record?.type || record?.attributes?.type || 'INTERNAL_LINK';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {getMenuTypeIcon(type)}
      <Typography variant="body2">
        {menuTypeChoices.find(choice => choice.id === type)?.name || type}
      </Typography>
    </Box>
  );
};

// 접근 권한 표시 컴포넌트
const AccessControlField = ({ record }: { record: any }) => {
  const isPublic = record?.isPublic ?? record?.attributes?.isPublic ?? true;
  const requireLogin = record?.requireLogin ?? record?.attributes?.requireLogin ?? false;
  
  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {isPublic ? (
        <Chip label="공개" size="small" color="success" variant="outlined" />
      ) : (
        <Chip label="제한" size="small" color="warning" variant="outlined" />
      )}
      {requireLogin && (
        <Chip label="로그인 필요" size="small" color="info" variant="outlined" />
      )}
    </Box>
  );
};

// 상단 툴바
const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

// 커스텀 삭제 버튼
const CustomDeleteButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [open, setOpen] = React.useState(false);
  const [deleteOne] = useDelete();

  const handleDelete = () => {
    deleteOne(
      'privates/siteMenu',
      { id: record.id },
      {
        onSuccess: () => {
          notify('메뉴가 삭제되었습니다', { type: 'info' });
          refresh();
        },
        onError: (error: any) => {
          notify(`오류: ${error?.message || '삭제 중 오류가 발생했습니다'}`, { type: 'error' });
        },
      }
    );
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        color="error"
        size="small"
        startIcon={<DeleteIcon />}
      >
        삭제
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>메뉴 삭제</DialogTitle>
        <DialogContent>
          이 메뉴를 삭제하시겠습니까? 하위 메뉴가 있는 경우 함께 삭제됩니다.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>취소</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// 커스텀 데이터그리드 컴포넌트
const HierarchicalDatagrid = () => {
  const { data, isPending } = useHierarchicalMenuData();
  
  if (isPending) {
    return <div>로딩 중...</div>;
  }

  return (
    <Datagrid
      data={data}
      total={data.length}
      rowClick="edit"
      sx={{
        '& .RaDatagrid-headerCell': {
          fontWeight: 600,
        },
        '& .RaDatagrid-rowCell': {
          '&:first-of-type': {
            pl: 1,
          },
        },
        // 계층별 행 스타일링
        '& .RaDatagrid-row': {
          '&[data-level="0"]': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            borderLeft: '3px solid',
            borderLeftColor: 'primary.main',
          },
          '&[data-level="1"]': {
            backgroundColor: 'rgba(156, 39, 176, 0.04)',
            borderLeft: '3px solid',
            borderLeftColor: 'secondary.main',
          },
          '&[data-level="2"]': {
            backgroundColor: 'rgba(255, 152, 0, 0.04)',
            borderLeft: '3px solid',
            borderLeftColor: 'warning.main',
          },
        },
      }}
    >
      {/* 그룹 */}
      <FunctionField
        label="그룹"
        render={(record) => {
          const level = record?.level || 0;
          const groupKeyUuid = record?.groupKeyUuid || record?.attributes?.groupKeyUuid || '-';
          return (
            <Chip
              label={groupKeyUuid}
              size="small"
              variant={level === 0 ? "filled" : "outlined"}
              color={level === 0 ? "primary" : "default"}
            />
          );
        }}
      />
      
      {/* 메뉴명 (계층적 표시) */}
      <FunctionField
        label="메뉴명"
        render={(record) => <HierarchicalTitle record={record} />}
        sx={{ minWidth: 300 }}
      />
      
      {/* 메뉴 타입 */}
      <FunctionField
        label="유형"
        render={(record) => {
          const type = record?.type || record?.attributes?.type || 'INTERNAL_LINK';
          const choice = menuTypeChoices.find(choice => choice.id === type);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getMenuTypeIcon(type)}
              <Typography variant="body2">
                {choice?.name || type}
              </Typography>
            </Box>
          );
        }}
      />
      
      {/* 설명 */}
      <FunctionField
        label="설명"
        render={(record) => {
          const description = record?.description || record?.attributes?.description || '-';
          return (
            <Typography 
              variant="body2" 
              sx={{ 
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              title={description}
            >
              {description}
            </Typography>
          );
        }}
      />
      
      {/* 표시 순서 */}
      <FunctionField
        label="순서"
        render={(record) => {
          const order = record?.displayOrder ?? record?.attributes?.displayOrder ?? 0;
          const level = record?.level || 0;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">{order}</Typography>
              {level > 0 && (
                <Typography variant="caption" color="text.secondary">
                  (L{level})
                </Typography>
              )}
            </Box>
          );
        }}
      />
      
      {/* 접근 제어 */}
      <FunctionField
        label="접근"
        render={(record) => <AccessControlField record={record} />}
      />
      
      {/* 생성일 */}
      <FunctionField
        label="생성일"
        render={(record) => {
          const createdAt = record?.createdAt || record?.attributes?.createdAt;
          return createdAt ? new Date(createdAt).toLocaleDateString() : '-';
        }}
      />
      
      {/* 액션 버튼들 */}
      <ShowButton />
      <EditButton />
      <CustomDeleteButton />
    </Datagrid>
  );
};

// 메뉴 목록 컴포넌트
export const SiteMenuList = () => {
  return (
    <List
      filters={siteMenuFilters}
      actions={<ListActions />}
      empty={
        <EmptyList
          title="등록된 메뉴가 없습니다"
          description="첫 번째 메뉴를 추가해보세요"
          icon={<MenuIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
          createButtonLabel="메뉴 추가"
        />
      }
      pagination={false}
      title="메뉴 관리 (계층적 보기)"
    >
      <HierarchicalDatagrid />
    </List>
  );
};

export default SiteMenuList;
