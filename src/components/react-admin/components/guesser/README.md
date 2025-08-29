# ListGuesser (삭제 기능 제거됨)

이 `ListGuesser` 컴포넌트는 React Admin의 기본 `ListGuesser`를 상속받아 삭제 기능만 제거한 버전입니다.

## 특징

- ✅ 자동 필드 타입 추측 (Auto field type guessing)
- ✅ 생성, 편집, 보기 기능
- ✅ 필터링 및 내보내기 기능
- ❌ 삭제 기능 제거됨 (개별 삭제 및 일괄 삭제 모두)

## 사용법

### 기본 사용법 (자동 필드 추측)

```tsx
import ListGuesser from './components/guesser/ListGuesser';

// 자동으로 데이터 구조를 추측하여 필드를 생성
<ListGuesser />
```

### 커스텀 필드와 함께 사용

```tsx
import ListGuesser from './components/guesser/ListGuesser';
import { TextField, EmailField, DateField } from 'react-admin';

<ListGuesser>
  <TextField source="id" />
  <TextField source="name" />
  <EmailField source="email" />
  <DateField source="createdAt" />
</ListGuesser>
```

### Resource 컴포넌트에서 사용

```tsx
import { Resource } from 'react-admin';
import ListGuesser from './components/guesser/ListGuesser';

<Resource 
  name="users" 
  list={ListGuesser}
  // 삭제 기능이 필요한 경우 별도의 Edit 컴포넌트에서 구현하거나
  // 기본 List 컴포넌트 사용
/>
```

## 제거된 기능

1. **개별 삭제 버튼**: 각 행의 삭제 버튼이 제거됨
2. **일괄 삭제**: 체크박스 선택 후 일괄 삭제 기능 제거됨
3. **삭제 관련 액션**: TopToolbar에서 삭제 관련 버튼들 제거됨

## 삭제 기능이 필요한 경우

삭제 기능이 필요한 경우 React Admin의 기본 `List` 컴포넌트를 사용하거나, 
별도의 관리자 권한 체크 로직과 함께 삭제 기능을 포함한 커스텀 컴포넌트를 작성하세요.

```tsx
import { List, Datagrid, TextField, EditButton, DeleteButton } from 'react-admin';

const UserList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <EditButton />
      {/* 조건부로 삭제 버튼 표시 */}
      {hasDeletePermission && <DeleteButton />}
    </Datagrid>
  </List>
);
```
