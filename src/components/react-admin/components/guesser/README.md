# Guesser Components

재사용 가능한 범용 React Admin 컴포넌트 모음입니다.

## 📚 컴포넌트 목록

### GenericList

설정 기반으로 쉽게 리스트 페이지를 구성할 수 있는 범용 List 컴포넌트입니다.

## 🚀 GenericList 사용법

### 기본 사용법

```tsx
import { GenericList } from '@/components/react-admin/components/guesser';
import { TextField, EmailField, DateField } from 'react-admin';

export const UsersList = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="username" label="사용자명" key="username" />,
      <EmailField source="email" label="이메일" key="email" />,
      <DateField source="createdAt" label="생성일" showTime key="createdAt" />
    ]}
    defaultSort={{ field: 'createdAt', order: 'DESC' }}
  />
);
```

### 필터 추가

```tsx
import { GenericList } from '@/components/react-admin/components/guesser';
import { TextField, TextInput, SelectInput, NullableBooleanInput } from 'react-admin';

const filters = [
  <TextInput source="q" label="검색" placeholder="검색어 입력" alwaysOn key="q" />,
  <SelectInput 
    source="status" 
    label="상태" 
    choices={[
      { id: 'active', name: '활성' },
      { id: 'inactive', name: '비활성' }
    ]}
    key="status"
  />,
  <NullableBooleanInput source="isVerified" label="인증 여부" key="verified" />
];

export const UsersList = () => (
  <GenericList
    columns={[...]}
    filters={filters}
    filterDefaultValues={{ status: 'active' }}
    alwaysShowFilters={true}
  />
);
```

### 고급 커스터마이징

```tsx
import { GenericList } from '@/components/react-admin/components/guesser';
import { 
  TextField, 
  FunctionField, 
  BulkDeleteButton,
  useRecordContext 
} from 'react-admin';
import { Chip } from '@mui/material';

// 커스텀 필드 컴포넌트
const StatusField = () => {
  const record = useRecordContext();
  return (
    <Chip 
      label={record.isActive ? '활성' : '비활성'} 
      color={record.isActive ? 'success' : 'default'}
      size="small"
    />
  );
};

export const UsersList = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="username" label="사용자명" key="username" />,
      <FunctionField 
        label="상태" 
        render={(record) => <StatusField />}
        key="status"
      />
    ]}
    filters={[...]}
    
    // 행 클릭 동작
    rowClick="edit"
    
    // 대량 작업
    enableBulkActions={true}
    bulkActionButtons={<BulkDeleteButton />}
    
    // 페이지당 항목 수
    perPage={50}
    
    // Datagrid 커스터마이징
    datagridProps={{
      optimized: true,
      isRowSelectable: record => record.canDelete,
      hover: true
    }}
    
    // 스타일 커스터마이징
    datagridSx={{
      '& .RaDatagrid-rowCell': {
        padding: '16px',
        borderBottom: '2px solid #f0f0f0'
      }
    }}
    
    headerCellSx={{
      fontWeight: 800,
      fontSize: '14px',
      color: 'primary.main'
    }}
  />
);
```

### 필터 레이아웃 변경

```tsx
// 세로 정렬 필터
<GenericList
  columns={[...]}
  filters={[...]}
  filterLayout="vertical"  // 기본값: 'horizontal'
/>
```

### 커스텀 빈 상태 & 액션

```tsx
import { CreateButton, ExportButton } from 'react-admin';
import { Box, Typography } from '@mui/material';

const CustomEmpty = () => (
  <Box textAlign="center" p={4}>
    <Typography variant="h6">데이터가 없습니다</Typography>
    <CreateButton label="새로 만들기" />
  </Box>
);

const CustomActions = () => (
  <>
    <CreateButton />
    <ExportButton />
  </>
);

<GenericList
  columns={[...]}
  empty={<CustomEmpty />}
  actions={<CustomActions />}
/>
```

## 📖 Props API

### GenericListProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ReactElement[]` | **(필수)** | Datagrid에 표시될 필드 컴포넌트 배열 |
| `filters` | `ReactElement[]` | `[]` | 필터 입력 컴포넌트 배열 |
| `filterDefaultValues` | `Record<string, any>` | `{}` | 필터 기본값 |
| `defaultSort` | `SortPayload` | `{ field: 'id', order: 'DESC' }` | 기본 정렬 설정 |
| `perPage` | `number` | `25` | 페이지당 항목 수 |
| `pagination` | `ReactElement \| false` | `undefined` | 커스텀 페이지네이션 컴포넌트 (false면 비활성화) |
| `paginationProps` | `Partial<PaginationProps>` | `undefined` | 페이지네이션 Props (rowsPerPageOptions 등) |
| `rowClick` | `string \| function \| false` | `'show'` | 행 클릭 동작 (`'edit'`, `'show'`, `false`) |
| `enableBulkActions` | `boolean` | `false` | 대량 작업 활성화 |
| `bulkActionButtons` | `ReactElement \| false` | `undefined` | 커스텀 대량 작업 버튼 |
| `datagridProps` | `Partial<DatagridProps>` | `{}` | Datagrid 추가 Props |
| `listProps` | `Partial<ListProps>` | `{}` | List 추가 Props |
| `listSx` | `SxProps<Theme>` | - | List 컨테이너 스타일 |
| `datagridSx` | `SxProps<Theme>` | - | Datagrid 스타일 |
| `headerCellSx` | `SxProps<Theme>` | - | 헤더 셀 스타일 |
| `filterLayout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 필터 정렬 방향 |
| `empty` | `ReactElement \| false` | - | 빈 상태 컴포넌트 |
| `actions` | `ReactElement \| false` | - | 액션 버튼 영역 |
| `hasTitle` | `boolean` | `true` | 제목 표시 여부 |
| `title` | `string \| ReactElement` | - | 커스텀 제목 |
| `storeKey` | `string \| false` | `resource` | 상태 저장 키 |
| `alwaysShowFilters` | `boolean` | `false` | 필터 항상 표시 |
| `disableExport` | `boolean` | `false` | 내보내기 비활성화 |

## 💡 실전 예제

### 1. 복잡한 사용자 리스트

```tsx
import { GenericList } from '@/components/react-admin/components/guesser';
import {
  TextField,
  EmailField,
  DateField,
  BooleanField,
  FunctionField,
  TextInput,
  SelectInput,
  NullableBooleanInput,
  DateInput,
} from 'react-admin';
import { Chip } from '@mui/material';

const StatusField = () => {
  const record = useRecordContext();
  if (!record) return null;

  const getStatusColor = () => {
    if (record.isSuspended) return 'error';
    if (!record.isActive) return 'default';
    if (!record.isVerified) return 'warning';
    return 'success';
  };

  const getStatusLabel = () => {
    if (record.isSuspended) return '정지됨';
    if (!record.isActive) return '비활성';
    if (!record.isVerified) return '미인증';
    return '활성';
  };

  return <Chip label={getStatusLabel()} color={getStatusColor()} size="small" />;
};

const userFilters = [
  <SelectInput
    key="status"
    source="status"
    label="계정 상태"
    choices={[
      { id: 'active', name: '활성' },
      { id: 'inactive', name: '비활성' },
      { id: 'unverified', name: '미인증' },
      { id: 'suspended', name: '정지됨' },
    ]}
    alwaysOn
    sx={{ minWidth: 150 }}
  />,
  <TextInput 
    key="search" 
    source="q" 
    label="검색"  
    placeholder="사용자명 또는 이메일"
    sx={{ minWidth: 200 }}
  />,
  <NullableBooleanInput
    key="isActive"
    source="isActive"
    label="활성화"
    sx={{ minWidth: 120 }}
  />,
  <DateInput
    key="createdAtStart"
    source="createdAt_gte"
    label="생성일 (시작)"
    sx={{ minWidth: 150 }}
  />,
];

export const UsersList = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="username" label="사용자명" key="username" />,
      <EmailField source="email" label="이메일" key="email" />,
      <FunctionField 
        label="이름" 
        render={(record: any) => 
          record.firstName || record.lastName 
            ? `${record.firstName || ''} ${record.lastName || ''}`.trim()
            : '-'
        }
        key="name"
      />,
      <FunctionField 
        label="상태" 
        render={() => <StatusField />}
        key="status"
      />,
      <BooleanField source="twoFactorEnabled" label="2FA" key="2fa" />,
      <DateField source="lastLoginAt" label="최근 로그인" showTime key="lastLogin" />,
      <DateField source="createdAt" label="생성일" showTime key="created" />,
    ]}
    filters={userFilters}
    filterDefaultValues={{ status: 'active' }}
    defaultSort={{ field: 'createdAt', order: 'DESC' }}
    perPage={25}
    rowClick="show"
  />
);
```

### 2. 파일 관리 리스트

```tsx
export const FilesList = () => (
  <GenericList
    columns={[
      <TextField source="id" label="ID" key="id" />,
      <TextField source="filename" label="파일명" key="filename" />,
      <TextField source="mimeType" label="타입" key="type" />,
      <FunctionField
        label="크기"
        render={(record) => `${(record.size / 1024).toFixed(2)} KB`}
        key="size"
      />,
      <DateField source="uploadedAt" label="업로드일" showTime key="uploaded" />,
    ]}
    filters={[
      <TextInput source="q" label="파일명 검색" alwaysOn key="q" />,
      <SelectInput
        source="mimeType"
        label="파일 타입"
        choices={[
          { id: 'image/jpeg', name: 'JPEG' },
          { id: 'image/png', name: 'PNG' },
          { id: 'application/pdf', name: 'PDF' },
        ]}
        key="mime"
      />,
    ]}
    defaultSort={{ field: 'uploadedAt', order: 'DESC' }}
    rowClick="show"
    enableBulkActions={true}
  />
);
```

## 🎨 스타일 커스터마이징 패턴

### 테마별 스타일링

```tsx
// 어두운 테마
<GenericList
  datagridSx={{
    '& .RaDatagrid-headerCell': {
      backgroundColor: '#1a1a1a',
      color: '#fff',
    },
    '& .RaDatagrid-rowCell': {
      borderColor: '#333',
    },
  }}
/>

// 컴팩트한 디자인
<GenericList
  datagridSx={{
    '& .RaDatagrid-rowCell': {
      padding: '8px',
      fontSize: '13px',
    },
  }}
  headerCellSx={{
    padding: '12px 8px',
  }}
/>
```

## 🔧 고급 기능

### 조건부 행 스타일

```tsx
<GenericList
  datagridProps={{
    rowStyle: (record) => ({
      backgroundColor: record.isActive ? 'inherit' : '#f5f5f5',
      opacity: record.isActive ? 1 : 0.6,
    }),
  }}
/>
```

### 선택 가능한 행 제어

```tsx
<GenericList
  enableBulkActions={true}
  datagridProps={{
    isRowSelectable: (record) => record.canDelete && !record.isSystem,
  }}
/>
```

### 페이지네이션 커스터마이징

```tsx
// 페이지당 항목 수 옵션 변경
<GenericList
  columns={[...]}
  paginationProps={{
    rowsPerPageOptions: [10, 25, 50, 100, 200]
  }}
  perPage={50}
/>

// 페이지네이션 비활성화
<GenericList
  columns={[...]}
  pagination={false}
/>

// 커스텀 페이지네이션 컴포넌트
import { Pagination } from 'react-admin';

<GenericList
  columns={[...]}
  pagination={
    <Pagination 
      rowsPerPageOptions={[5, 10, 25]} 
      labelRowsPerPage="페이지당"
    />
  }
/>
```

## 📝 참고사항

- 모든 `columns`와 `filters` 배열 항목에는 고유한 `key` prop이 필요합니다
- `filterDefaultValues`는 필터의 `source`와 일치해야 합니다
- `rowClick`을 `false`로 설정하면 행 클릭이 비활성화됩니다
- `storeKey={false}`로 설정하면 필터/정렬 상태가 URL에 저장되지 않습니다
