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
  <TextInput source="groupKey" label="그룹키" />,
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
  const depth = record?.depth || 0;
  const hasChildren = record?.hasChildren || false;
  const title = record?.title || record?.attributes?.title || '-';
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* 들여쓰기 */}
      <Box sx={{ width: depth * 20 }} />
      
      {/* 계층 아이콘 */}
      {hasChildren ? (
        <FolderOpen fontSize="small" color="primary" />
      ) : (
        <Folder fontSize="small" color="action" />
      )}
      
      {/* 메뉴 제목 */}
      <Typography variant="body2" sx={{ fontWeight: depth === 0 ? 600 : 400 }}>
        {title}
      </Typography>
    </Box>
  );
};

// 그룹키 컴포넌트
const GroupKeyField = ({ record }: { record: any }) => {
  const groupKey = record?.groupKey || record?.attributes?.groupKey || '-';
  return (
    <Chip
      label={groupKey}
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
      sort={{ field: 'groupKey', order: 'ASC' }}
      perPage={50}
      title="메뉴 관리"
    >
      <Datagrid
        rowClick={(id, resource, record) => {
          console.log('Record data:', record);
          return 'edit';
        }}
        sx={{
          '& .RaDatagrid-headerCell': {
            fontWeight: 600,
          },
          '& .RaDatagrid-rowCell': {
            '&:first-of-type': {
              pl: 1,
            },
          },
        }}
      >
        {/* 그룹키 */}
        <FunctionField
          label="그룹"
          render={(record) => {
            console.log('GroupKey record:', record);
            return record?.groupKey || record?.attributes?.groupKey || '-';
          }}
        />
        
        {/* 메뉴명 */}
        <FunctionField
          label="메뉴명"
          render={(record) => record?.title || record?.attributes?.title || '-'}
        />
        
        {/* 메뉴 타입 */}
        <FunctionField
          label="유형"
          render={(record) => {
            const type = record?.type || record?.attributes?.type || 'INTERNAL_LINK';
            const choice = menuTypeChoices.find(choice => choice.id === type);
            return choice?.name || type;
          }}
        />
        
        {/* 설명 */}
        <FunctionField
          label="설명"
          render={(record) => record?.description || record?.attributes?.description || '-'}
        />
        
        {/* 표시 순서 */}
        <FunctionField
          label="순서"
          render={(record) => record?.displayOrder ?? record?.attributes?.displayOrder ?? 0}
        />
        
        {/* 공개 여부 */}
        <FunctionField
          label="공개"
          render={(record) => {
            const isPublic = record?.isPublic ?? record?.attributes?.isPublic ?? true;
            return isPublic ? '공개' : '비공개';
          }}
        />
        
        {/* 로그인 필수 */}
        <FunctionField
          label="로그인 필수"
          render={(record) => {
            const requireLogin = record?.requireLogin ?? record?.attributes?.requireLogin ?? false;
            return requireLogin ? '필수' : '불필요';
          }}
        />
        
        {/* 생성일 */}
        <FunctionField
          label="생성일"
          render={(record) => {
            const createdAt = record?.createdAt || record?.attributes?.createdAt;
            return createdAt ? new Date(createdAt).toLocaleDateString() : '-';
          }}
        />
        
        {/* 수정일 */}
        <FunctionField
          label="수정일"
          render={(record) => {
            const updatedAt = record?.updatedAt || record?.attributes?.updatedAt;
            return updatedAt ? new Date(updatedAt).toLocaleDateString() : '-';
          }}
        />
        
        {/* 액션 버튼들 */}
        <ShowButton />
        <EditButton />
        <CustomDeleteButton />
      </Datagrid>
    </List>
  );
};

export default SiteMenuList;
