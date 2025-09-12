# EmptyList 컴포넌트

React Admin의 List 컴포넌트에서 사용할 수 있는 재사용 가능한 빈 상태 컴포넌트입니다.

## 사용법

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

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | `string` | "등록된 항목이 없습니다" | 빈 상태의 제목 |
| `description` | `string` | "첫 번째 항목을 추가해보세요" | 빈 상태의 설명 |
| `icon` | `React.ReactNode` | `<AddIcon />` | 표시할 아이콘 |
| `showCreateButton` | `boolean` | `true` | 생성 버튼 표시 여부 |
| `createButtonLabel` | `string` | `undefined` | 생성 버튼의 라벨 |
| `resource` | `string` | `undefined` | 리소스 이름 (향후 확장용) |

## 예시

### 기본 사용법
```tsx
<EmptyList />
```

### 커스텀 아이콘과 텍스트
```tsx
<EmptyList
  title="등록된 사용자가 없습니다"
  description="첫 번째 사용자를 추가해보세요"
  icon={<PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
  createButtonLabel="사용자 추가"
/>
```

### 생성 버튼 숨기기
```tsx
<EmptyList
  title="데이터가 없습니다"
  description="관리자에게 문의하세요"
  showCreateButton={false}
/>
```

## 현재 적용된 컴포넌트

- SiteMenuList: 메뉴 관리
- UserList: 사용자 관리  
- PostList: 게시물 관리

추가 List 컴포넌트에도 동일한 방식으로 적용할 수 있습니다.
