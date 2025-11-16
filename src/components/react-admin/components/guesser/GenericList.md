"use client";

/**
 * GenericList 활용 예제 모음
 * 
 * 다양한 시나리오에서 GenericList를 활용하는 방법을 보여줍니다.
 */

import { 
  TextField, 
  EmailField, 
  DateField,
  BooleanField,
  FunctionField,
  NumberField,
  TextInput,
  SelectInput,
  NullableBooleanInput,
  DateInput,
  BulkDeleteButton,
  BulkExportButton,
  CreateButton,
  ExportButton,
  useRecordContext,
} from 'react-admin';
import { Box, Typography, Chip, Avatar } from '@mui/material';
import { GenericList, GenericListProps } from './GenericList';

// ============================================================================
// 예제 1: 가장 간단한 기본 리스트
// ============================================================================

export const SimpleList = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="name" label="이름" key="name" />,
      <DateField source="createdAt" label="생성일" key="created" />,
    ]}
    defaultSort={{ field: 'createdAt', order: 'DESC' }}
  />
);

// ============================================================================
// 예제 2: 검색 필터만 있는 심플한 리스트
// ============================================================================

export const SearchableList = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="title" label="제목" key="title" />,
      <TextField source="content" label="내용" key="content" />,
    ]}
    filters={[
      <TextInput source="q" label="검색" placeholder="제목 또는 내용" alwaysOn key="q" />,
    ]}
    perPage={50}
  />
);

// ============================================================================
// 예제 3: 복잡한 필터가 있는 고급 리스트
// ============================================================================

const advancedFilters = [
  <TextInput 
    source="q" 
    label="통합 검색" 
    placeholder="검색어 입력" 
    alwaysOn 
    key="q"
    sx={{ minWidth: 250 }}
  />,
  <SelectInput
    source="category"
    label="카테고리"
    choices={[
      { id: 'tech', name: '기술' },
      { id: 'business', name: '비즈니스' },
      { id: 'design', name: '디자인' },
    ]}
    key="category"
    sx={{ minWidth: 150 }}
  />,
  <SelectInput
    source="status"
    label="상태"
    choices={[
      { id: 'draft', name: '초안' },
      { id: 'published', name: '게시됨' },
      { id: 'archived', name: '보관됨' },
    ]}
    key="status"
    sx={{ minWidth: 120 }}
  />,
  <NullableBooleanInput source="featured" label="추천" key="featured" />,
  <DateInput source="publishedAt_gte" label="게시일 (시작)" key="publishStart" />,
  <DateInput source="publishedAt_lte" label="게시일 (종료)" key="publishEnd" />,
];

export const AdvancedFilterList = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="title" label="제목" key="title" />,
      <TextField source="category" label="카테고리" key="category" />,
      <TextField source="status" label="상태" key="status" />,
      <BooleanField source="featured" label="추천" key="featured" />,
      <DateField source="publishedAt" label="게시일" showTime key="published" />,
    ]}
    filters={advancedFilters}
    filterDefaultValues={{ status: 'published' }}
    filterLayout="horizontal"
    defaultSort={{ field: 'publishedAt', order: 'DESC' }}
  />
);

// ============================================================================
// 예제 4: 대량 작업 기능이 있는 리스트
// ============================================================================

export const BulkActionsListExample = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="filename" label="파일명" key="filename" />,
      <NumberField source="size" label="크기 (KB)" key="size" />,
      <DateField source="uploadedAt" label="업로드일" key="uploaded" />,
    ]}
    filters={[
      <TextInput source="q" label="파일명 검색" alwaysOn key="q" />,
    ]}
    enableBulkActions={true}
    bulkActionButtons={
      <>
        <BulkExportButton />
        <BulkDeleteButton />
      </>
    }
    datagridProps={{
      isRowSelectable: (record) => !record.isSystem,
    }}
  />
);

// ============================================================================
// 예제 5: 커스텀 빈 상태 & 액션 버튼
// ============================================================================

const CustomEmpty = () => (
  <Box textAlign="center" p={5}>
    <Typography variant="h6" gutterBottom color="text.secondary">
      아직 데이터가 없습니다
    </Typography>
    <Typography variant="body2" color="text.secondary" mb={3}>
      새로운 항목을 만들어보세요
    </Typography>
    <CreateButton label="첫 항목 만들기" />
  </Box>
);

const CustomActions = () => (
  <Box display="flex" gap={1}>
    <CreateButton label="새로 만들기" />
    <ExportButton label="내보내기" />
  </Box>
);

export const CustomEmptyAndActionsListExample = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="name" label="이름" key="name" />,
    ]}
    empty={<CustomEmpty />}
    actions={<CustomActions />}
  />
);

// ============================================================================
// 예제 6: 커스텀 필드 컴포넌트 활용
// ============================================================================

const UserAvatarField = () => {
  const record = useRecordContext();
  if (!record) return null;
  
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Avatar 
        src={record.avatar} 
        alt={record.username}
        sx={{ width: 32, height: 32 }}
      >
        {record.username?.[0]?.toUpperCase()}
      </Avatar>
      <Typography variant="body2">{record.username}</Typography>
    </Box>
  );
};

const StatusChipField = () => {
  const record = useRecordContext();
  if (!record) return null;

  const statusConfig = {
    active: { label: '활성', color: 'success' as const },
    pending: { label: '대기중', color: 'warning' as const },
    suspended: { label: '정지', color: 'error' as const },
    inactive: { label: '비활성', color: 'default' as const },
  };

  const config = statusConfig[record.status as keyof typeof statusConfig] || statusConfig.inactive;

  return <Chip label={config.label} color={config.color} size="small" />;
};

export const CustomFieldsListExample = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <FunctionField 
        label="사용자" 
        render={() => <UserAvatarField />}
        key="user"
      />,
      <EmailField source="email" label="이메일" key="email" />,
      <FunctionField 
        label="상태" 
        render={() => <StatusChipField />}
        key="status"
      />,
      <DateField source="lastLoginAt" label="최근 로그인" showTime key="lastLogin" />,
    ]}
    filters={[
      <TextInput source="q" label="검색" alwaysOn key="q" />,
      <SelectInput
        source="status"
        label="상태"
        choices={[
          { id: 'active', name: '활성' },
          { id: 'pending', name: '대기중' },
          { id: 'suspended', name: '정지' },
          { id: 'inactive', name: '비활성' },
        ]}
        key="status"
      />,
    ]}
    defaultSort={{ field: 'lastLoginAt', order: 'DESC' }}
  />
);

// ============================================================================
// 예제 7: 스타일 커스터마이징
// ============================================================================

export const StyledListExample = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="name" label="이름" key="name" />,
      <TextField source="email" label="이메일" key="email" />,
    ]}
    datagridSx={{
      '& .RaDatagrid-rowCell': {
        padding: '16px',
        borderBottom: '2px solid #f0f0f0',
      },
      '& .RaDatagrid-row:hover': {
        backgroundColor: '#f8f9fa',
      },
    }}
    headerCellSx={{
      fontWeight: 800,
      fontSize: '14px',
      color: 'primary.main',
      backgroundColor: '#fafafa',
    }}
  />
);

// ============================================================================
// 예제 8: 조건부 행 스타일링
// ============================================================================

export const ConditionalRowStyleListExample = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="title" label="제목" key="title" />,
      <TextField source="priority" label="우선순위" key="priority" />,
      <BooleanField source="completed" label="완료" key="completed" />,
    ]}
    datagridProps={{
      rowStyle: (record) => {
        if (record.completed) {
          return { backgroundColor: '#e8f5e9', opacity: 0.7 };
        }
        if (record.priority === 'high') {
          return { backgroundColor: '#ffebee' };
        }
        if (record.priority === 'medium') {
          return { backgroundColor: '#fff3e0' };
        }
        return {};
      },
    }}
  />
);

// ============================================================================
// 예제 9: 행 클릭 커스터마이징
// ============================================================================

export const CustomRowClickListExample = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="name" label="이름" key="name" />,
    ]}
    rowClick="edit"  // 'show' | 'edit' | false | (id, resource, record) => string
  />
);

// ============================================================================
// 예제 10: 세로 정렬 필터
// ============================================================================

export const VerticalFilterLayoutListExample = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="title" label="제목" key="title" />,
    ]}
    filters={[
      <TextInput source="q" label="검색" key="q" sx={{ width: '100%' }} />,
      <SelectInput source="category" label="카테고리" key="cat" sx={{ width: '100%' }} />,
      <NullableBooleanInput source="published" label="게시됨" key="pub" sx={{ width: '100%' }} />,
    ]}
    filterLayout="vertical"
  />
);

// ============================================================================
// 예제 11: 페이지당 항목 수 조정
// ============================================================================

export const LargePageSizeListExample = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="name" label="이름" key="name" />,
    ]}
    perPage={100}
  />
);

// ============================================================================
// 예제 12: 제목 커스터마이징
// ============================================================================

export const CustomTitleListExample = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="name" label="이름" key="name" />,
    ]}
    title="나만의 커스텀 제목"
  />
);

// 또는 제목 숨기기
export const NoTitleListExample = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="name" label="이름" key="name" />,
    ]}
    hasTitle={false}
  />
);

// ============================================================================
// 예제 13: 내보내기 비활성화
// ============================================================================

export const NoExportListExample = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="sensitiveData" label="민감 데이터" key="sensitive" />,
    ]}
    disableExport={true}
  />
);

// ============================================================================
// 예제 14: 필터 상태 저장 비활성화
// ============================================================================

export const NoStateStorageListExample = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="name" label="이름" key="name" />,
    ]}
    storeKey={false}  // URL에 필터/정렬 상태 저장 안함
  />
);

// ============================================================================
// 내보내기
// ============================================================================

export const examples = {
  SimpleList,
  SearchableList,
  AdvancedFilterList,
  BulkActionsListExample,
  CustomEmptyAndActionsListExample,
  CustomFieldsListExample,
  StyledListExample,
  ConditionalRowStyleListExample,
  CustomRowClickListExample,
  VerticalFilterLayoutListExample,
  LargePageSizeListExample,
  CustomTitleListExample,
  NoTitleListExample,
  NoExportListExample,
  NoStateStorageListExample,
};
