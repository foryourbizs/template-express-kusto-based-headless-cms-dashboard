import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
  CreateButton,
  TopToolbar,
  FilterButton,
  ExportButton,
  FunctionField,
  SearchInput,
  TextInput,
  useRecordContext,
  useDelete,
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
  Group as GroupIcon,
  Menu as MenuIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import EmptyList from '../common/EmptyList';

// 검색 필터
const siteMenuGroupFilters = [
  // JSON API 스펙에 맞는 검색을 위해 개별 필드로 검색
  <TextInput 
    source="name" 
    label="그룹명" 
    placeholder="그룹명으로 검색"
  />,
  <TextInput 
    source="key" 
    label="그룹 키" 
    placeholder="키로 검색"
  />,
  <TextInput 
    source="description" 
    label="설명" 
    placeholder="설명으로 검색"
  />,
];

// 상단 툴바
const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

// 그룹 키 표시 컴포넌트
const GroupKeyField = ({ record }: { record: any }) => {
  const key = record?.key || record?.attributes?.key || '-';
  return (
    <Chip
      label={key}
      size="small"
      variant="filled"
      color="primary"
      sx={{
        fontFamily: 'monospace',
        fontWeight: 'bold'
      }}
    />
  );
};

// 그룹명 표시 컴포넌트
const GroupNameField = ({ record }: { record: any }) => {
  const name = record?.name || record?.attributes?.name || '-';
  const key = record?.key || record?.attributes?.key || '';
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <GroupIcon color="primary" fontSize="small" />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Key: {key}
        </Typography>
      </Box>
    </Box>
  );
};

// 설명 표시 컴포넌트
const DescriptionField = ({ record }: { record: any }) => {
  const description = record?.description || record?.attributes?.description || '-';
  return (
    <Typography 
      variant="body2" 
      sx={{ 
        maxWidth: 300,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}
      title={description}
    >
      {description}
    </Typography>
  );
};

// 관련 메뉴 수 표시 컴포넌트
const RelatedMenusField = ({ record }: { record: any }) => {
  // TODO: 실제 API를 통해 관련 메뉴 수를 가져와야 함
  // 현재는 표시하지 않음
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <MenuIcon fontSize="small" color="action" />
      <Typography variant="body2" color="text.secondary">
        확인 중...
      </Typography>
    </Box>
  );
};

// 커스텀 편집 버튼
const CustomEditButton = () => {
  const record = useRecordContext();
  
  return (
    <EditButton
      record={record}
      sx={{
        '& .MuiButton-startIcon': {
          marginRight: 0.5
        }
      }}
    />
  );
};

// 커스텀 삭제 버튼
const CustomDeleteButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [open, setOpen] = React.useState(false);
  const [deleteOne] = useDelete();

  const handleDelete = () => {
    deleteOne(
      'privates/siteMenuGroup',
      { id: record.id },
      {
        onSuccess: () => {
          notify('메뉴 그룹이 삭제되었습니다', { type: 'info' });
          refresh();
        },
        onError: (error: any) => {
          notify(`오류: ${error?.message || '삭제 중 오류가 발생했습니다'}`, { type: 'error' });
        },
      }
    );
    setOpen(false);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 중단
    setOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleButtonClick}
        color="error"
        size="small"
        startIcon={<DeleteIcon />}
        sx={{
          '& .MuiButton-startIcon': {
            marginRight: 0.5
          }
        }}
      >
        삭제
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>메뉴 그룹 삭제</DialogTitle>
        <DialogContent>
          <Typography>
            이 메뉴 그룹을 삭제하시겠습니까?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            ⚠️ 이 그룹에 속한 모든 메뉴도 함께 영향을 받을 수 있습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            취소
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// 메뉴 그룹 리스트 컴포넌트
export const SiteMenuGroupList = () => {
  return (
    <List
      filters={siteMenuGroupFilters}
      actions={<ListActions />}
      title="메뉴 그룹 관리"
      perPage={25}
      empty={
        <EmptyList
          title="등록된 메뉴 그룹이 없습니다"
          description="메뉴 그룹을 추가하여 사이트 메뉴를 체계적으로 관리할 수 있습니다"
          icon={<GroupIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
          createButtonLabel="메뉴 그룹 추가"
        />
      }
    >
      <Datagrid
        rowClick="edit"
        sx={{
          '& .RaDatagrid-headerCell': {
            fontWeight: 600,
          },
          '& .RaDatagrid-rowCell': {
            '&:first-of-type': {
              pl: 2,
            },
          },
        }}
      >
        {/* 그룹 키 */}
        <FunctionField
          label="그룹 키"
          render={(record) => <GroupKeyField record={record} />}
          sortBy="key"
        />
        
        {/* 그룹명 */}
        <FunctionField
          label="그룹명"
          render={(record) => <GroupNameField record={record} />}
          sortBy="name"
          sx={{ minWidth: 200 }}
        />
        
        {/* 설명 */}
        <FunctionField
          label="설명"
          render={(record) => <DescriptionField record={record} />}
          sortBy="description"
        />
        
        {/* 관련 메뉴 수 */}
        <FunctionField
          label="관련 메뉴"
          render={(record) => <RelatedMenusField record={record} />}
        />
        
        {/* UUID */}
        <TextField
          label="UUID"
          source="uuid"
          sx={{ 
            fontFamily: 'monospace',
            fontSize: '0.75rem'
          }}
        />
        
        {/* 액션 버튼들 */}
        <CustomEditButton />
        <CustomDeleteButton />
      </Datagrid>
    </List>
  );
};

export default SiteMenuGroupList;
