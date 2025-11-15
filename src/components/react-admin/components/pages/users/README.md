# Users Resource

사용자 관리 리소스의 모든 컴포넌트가 포함된 폴더입니다.

## 컴포넌트

- **UsersList.tsx**: 사용자 목록 표시
- **UsersEdit.tsx**: 사용자 정보 수정
- **UsersCreate.tsx**: 새로운 사용자 생성
- **UsersShow.tsx**: 사용자 상세 정보 조회
- **index.ts**: 모든 컴포넌트를 export하는 진입점

## 사용법

```tsx
import { UsersList, UsersEdit, UsersCreate, UsersShow } from './components/pages/users';

<Resource 
  name="privates/users" 
  list={UsersList} 
  edit={UsersEdit} 
  create={UsersCreate}
  show={UsersShow}
  options={{ label: '사용자', menuGroup: 'users', menuGroupLabel: '사용자 관리' }} 
/>
```

## 데이터 구조 (JSON:API)

```json
{
  "data": {
    "id": "1",
    "type": "users",
    "attributes": {
      "username": "testuser",
      "email": "test@example.com",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```
