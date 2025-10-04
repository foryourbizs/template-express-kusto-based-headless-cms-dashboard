# GroupedTable & MultiGroupTable 컴포넌트

React Admin에서 사용할 수 있는 그룹화된 테이블 컴포넌트입니다.

## 컴포넌트 종류

### 1. GroupedTable
단일 그룹 데이터를 위한 테이블 컴포넌트입니다.

### 2. MultiGroupTable  
여러 그룹 데이터를 위한 테이블 컴포넌트로, 두 가지 페이지네이션 모드를 지원합니다.

## 페이지네이션 모드

### Group Mode (`mode: 'group'`)
- **각 그룹별로 독립적인 페이지네이션**
- 그룹마다 별도의 페이지 상태를 유지
- 많은 그룹이 있고 각 그룹의 데이터를 독립적으로 탐색할 때 유용

```tsx
<MultiGroupTable
  groupedData={groupedData}
  columns={columns}
  pagination={{
    enabled: true,
    pageSize: 10,
    mode: 'group' // 그룹별 페이징
  }}
/>
```

### Global Mode (`mode: 'global'`)
- **전체 데이터를 하나의 페이지네이션으로 관리**
- 모든 그룹의 데이터를 통합하여 페이징
- 전체 데이터를 순차적으로 탐색할 때 유용

```tsx
<MultiGroupTable
  groupedData={groupedData}
  columns={columns}
  pagination={{
    enabled: true,
    pageSize: 15,
    mode: 'global' // 전체 페이징
  }}
/>
```

## 사용 예시

### 기본 사용법
```tsx
import { MultiGroupTable, TableColumn, GroupedTableData } from '../common/GroupedTable';

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: '이름', flex: 1 },
  { key: 'status', label: '상태', width: '100px' }
];

const groupedData: GroupedTableData[] = [
  {
    groupKey: 'active',
    groupName: '활성 사용자',
    items: [...]
  },
  {
    groupKey: 'inactive', 
    groupName: '비활성 사용자',
    items: [...]
  }
];

// 그룹별 페이징
<MultiGroupTable
  groupedData={groupedData}
  columns={columns}
  itemLabel="사용자"
  enableSelection={true}
  enableBulkDelete={true}
  pagination={{
    enabled: true,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    position: 'bottom',
    showFirstLastButtons: true,
    mode: 'group'
  }}
/>

// 전체 페이징
<MultiGroupTable
  groupedData={groupedData}
  columns={columns}
  itemLabel="사용자"
  enableSelection={true}
  enableBulkDelete={true}
  pagination={{
    enabled: true,
    pageSize: 15,
    pageSizeOptions: [10, 15, 25, 50],
    position: 'bottom',
    showFirstLastButtons: true,
    mode: 'global'
  }}
/>
```

## 페이지네이션 설정 옵션

### PaginationConfig
```typescript
interface PaginationConfig {
  enabled?: boolean;                    // 페이지네이션 활성화 여부
  pageSize?: number;                    // 기본 페이지 크기
  pageSizeOptions?: number[];           // 페이지 크기 옵션
  showFirstLastButtons?: boolean;       // 처음/마지막 버튼 표시 여부
  showPageNumbers?: boolean;            // 페이지 숫자 버튼 표시 여부 (기본값: true)
  maxPageButtons?: number;              // 표시할 최대 페이지 버튼 수 (기본값: 5)
  position?: 'top' | 'bottom' | 'both'; // 페이지네이션 위치
  mode?: 'group' | 'global';            // 페이징 모드
}
```

## 현재 프로젝트 적용 상황

### Group Mode 적용 컴포넌트
- **UserSessionList**: 세션 상태별로 그룹화, 각 그룹별 독립 페이징
- **SiteMenuList**: 메뉴 그룹별로 독립 페이징  
- **RatelimitsList**: 제한 유형별로 그룹화, 각 그룹별 독립 페이징

### Global Mode 적용 컴포넌트  
- **UserList**: 사용자 상태별 그룹화하지만 전체 데이터를 통합 페이징
- **SiteMenuGroupList**: 메뉴 그룹 유형별 그룹화하지만 전체 데이터를 통합 페이징

## 특징

### 장점
1. **유연한 페이징 모드**: 그룹별/전체 페이징 선택 가능
2. **독립적인 상태 관리**: 각 그룹의 페이지 상태가 독립적으로 유지
3. **일관된 UI**: 모든 테이블이 동일한 디자인과 기능을 제공
4. **반응형 지원**: 모바일에서 자동으로 레이아웃 조정
5. **선택 및 벌크 삭제**: 다중 선택과 일괄 삭제 기능 지원

### 새로운 기능: 페이지 숫자 버튼

기본적으로 모든 테이블에 1, 2, 3... 형태의 페이지 숫자 버튼이 표시됩니다.

```tsx
<MultiGroupTable
  pagination={{
    enabled: true,
    showPageNumbers: true,    // 기본값: true (숫자 버튼 표시)
    maxPageButtons: 5,        // 기본값: 5 (표시할 최대 버튼 수)
    showFirstLastButtons: true // 처음/마지막 버튼도 표시
  }}
/>
```

#### 페이지네이션 스타일 옵션
- **숫자 버튼 표시**: `showPageNumbers: true` (기본값)
- **기본 스타일**: `showPageNumbers: false` (이전/다음 버튼만)
- **최대 버튼 수**: `maxPageButtons: 5` (기본값)

### 사용 가이드라인
- **그룹별 페이징**: 각 그룹의 데이터가 많고 독립적으로 관리할 때
- **전체 페이징**: 전체 데이터를 순차적으로 탐색하고 싶을 때
- **페이지 크기**: 데이터 특성에 맞게 적절한 크기 설정
- **위치**: 대부분의 경우 'bottom'이 적합, 필요시 'both' 사용
- **숫자 버튼**: 기본적으로 활성화되어 더 직관적인 네비게이션 제공

---

# EmptyList 컴포넌트

React Admin의 List 컴포넌트에서 사용할 수 있는 재사용 가능한 빈 상태 컴포넌트입니다.

## EmptyList 사용법

```tsx
import { EmptyList } from '../common/EmptyList';
import { SomeIcon } from '@mui/icons-material';

// List 컴포넌트에서 사용
<List
  empty={
    <EmptyList
      title="등록된 항목이 없습니다"
      description="첫 번째 항목을 추가해보세요"
      icon={<SomeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
      createButtonLabel="항목 추가"
    />
  }
>
  {/* Datagrid 등 */}
</List>
```

## EmptyList Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | `string` | "등록된 항목이 없습니다" | 빈 상태의 제목 |
| `description` | `string` | "첫 번째 항목을 추가해보세요" | 빈 상태의 설명 |
| `icon` | `React.ReactNode` | `<AddIcon />` | 표시할 아이콘 |
| `showCreateButton` | `boolean` | `true` | 생성 버튼 표시 여부 |
| `createButtonLabel` | `string` | `undefined` | 생성 버튼의 라벨 |
| `resource` | `string` | `undefined` | 리소스 이름 (향후 확장용) |
