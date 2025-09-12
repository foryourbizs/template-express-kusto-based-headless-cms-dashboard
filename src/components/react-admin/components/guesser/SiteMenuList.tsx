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
} from 'react-admin';
import {
  Box,
  Chip,
  Typography,
} from '@mui/material';
import {
  Folder,
  FolderOpen,
  Link,
  ExitToApp,
  TouchApp,
} from '@mui/icons-material';

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
        {record?.title}
      </Typography>
    </Box>
  );
};

// 그룹키 컴포넌트
const GroupKeyField = ({ record }: { record: any }) => (
  <Chip
    label={record?.groupKey}
    size="small"
    variant="outlined"
    color="primary"
  />
);

// 메뉴 타입 컴포넌트
const MenuTypeField = ({ record }: { record: any }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {getMenuTypeIcon(record?.type)}
    <Typography variant="body2">
      {menuTypeChoices.find(choice => choice.id === record?.type)?.name || record?.type}
    </Typography>
  </Box>
);

// 접근 권한 표시 컴포넌트
const AccessControlField = ({ record }: { record: any }) => {
  const { isPublic, requireLogin } = record || {};
  
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

// 빈 상태 컴포넌트
const Empty = () => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <Typography variant="h6" color="textSecondary" gutterBottom>
      등록된 메뉴가 없습니다
    </Typography>
    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
      첫 번째 메뉴를 추가해보세요
    </Typography>
    <CreateButton />
  </Box>
);

// 메뉴 목록 컴포넌트
export const SiteMenuList = () => {
  return (
    <List
      filters={siteMenuFilters}
      actions={<ListActions />}
      empty={<Empty />}
      sort={{ field: 'groupKey', order: 'ASC' }}
      perPage={50}
      title="메뉴 관리"
    >
      <Datagrid
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
        }}
      >
        {/* UUID (숨김, 편집용) */}
        <TextField source="uuid" sx={{ display: 'none' }} />
        
        {/* 그룹키 */}
        <FunctionField
          label="그룹"
          render={GroupKeyField}
          sortBy="groupKey"
        />
        
        {/* 계층적 제목 */}
        <FunctionField
          label="메뉴명"
          render={HierarchicalTitle}
          sortBy="title"
          sx={{ minWidth: 250 }}
        />
        
        {/* 메뉴 타입 */}
        <FunctionField
          label="유형"
          render={MenuTypeField}
          sortBy="type"
        />
        
        {/* 설명 */}
        <TextField
          source="description"
          label="설명"
          sx={{ maxWidth: 200 }}
          emptyText="-"
        />
        
        {/* 표시 순서 */}
        <NumberField
          source="displayOrder"
          label="순서"
          sx={{ textAlign: 'center' }}
        />
        
        {/* 접근 권한 */}
        <FunctionField
          label="접근 권한"
          render={AccessControlField}
          sortable={false}
        />
        
        {/* 생성일 */}
        <DateField
          source="createdAt"
          label="생성일"
          showTime={false}
        />
        
        {/* 수정일 */}
        <DateField
          source="updatedAt"
          label="수정일"
          showTime={false}
        />
        
        {/* 액션 버튼들 */}
        <Box sx={{ display: 'flex', gap: 0.5, minWidth: 120 }}>
          <ShowButton />
          <EditButton />
          <DeleteButton
            confirmTitle="메뉴 삭제"
            confirmContent="이 메뉴를 삭제하시겠습니까? 하위 메뉴가 있는 경우 함께 삭제됩니다."
          />
        </Box>
      </Datagrid>
    </List>
  );
};

export default SiteMenuList;
