# 리소스 모듈화 완료 - 구조 가이드

## 📁 새로운 폴더 구조

```
src/components/react-admin/components/pages/
├── users/                    ✅ 완료
│   ├── UsersList.tsx         - 사용자 목록
│   ├── UsersEdit.tsx         - 사용자 수정
│   ├── UsersCreate.tsx       - 사용자 생성
│   ├── UsersShow.tsx         - 사용자 상세
│   ├── index.ts              - Export 모듈
│   └── README.md             - 문서
│
├── user-sessions/            ✅ 완료
│   ├── UserSessionsList.tsx  - 세션 목록
│   ├── UserSessionsShow.tsx  - 세션 상세
│   ├── index.ts
│   └── README.md
│
├── object-storages/          ✅ 완료
│   ├── ObjectStoragesList.tsx    - 저장소 목록
│   ├── ObjectStoragesEdit.tsx    - 저장소 수정
│   ├── ObjectStoragesCreate.tsx  - 저장소 생성
│   ├── ObjectStoragesShow.tsx    - 저장소 상세
│   ├── index.ts
│   └── README.md
│
├── files/                    ✅ 완료
│   ├── FilesList.tsx         - 파일 목록
│   ├── FilesEdit.tsx         - 파일 수정
│   ├── FilesCreate.tsx       - 파일 업로드
│   ├── FilesShow.tsx         - 파일 상세
│   ├── index.ts
│   └── README.md
│
└── README.md                 - 전체 가이드
```

## 🎯 핵심 개선 사항

### 1. 모듈화된 구조
각 리소스가 독립적인 폴더로 분리되어 유지보수가 매우 편리합니다.

**Before:**
```tsx
// 모든 컴포넌트가 guesser 폴더에 섞여있음
components/guesser/
  UserList.tsx
  UserEdit.tsx
  FilesList.tsx
  FilesEdit.tsx
  ObjectStoragesList.tsx
  ...
```

**After:**
```tsx
// 리소스별로 깔끔하게 분리
components/pages/
  users/
  files/
  object-storages/
```

### 2. 깔끔한 Import 경로

**Before:**
```tsx
import UserList from './components/guesser_______OLD/UserList';
import UserEdit from './components/guesser_______OLD/UserEdit';
import FilesList from './components/guesser_______OLD/FilesList';
```

**After:**
```tsx
import { UsersList, UsersEdit, UsersCreate, UsersShow } from './components/pages/users';
import { FilesList, FilesEdit, FilesCreate, FilesShow } from './components/pages/files';
```

### 3. AdminApp.tsx 구조 개선

```tsx
// 깔끔한 import 섹션
import { UsersList, UsersEdit, UsersCreate, UsersShow } from './components/pages/users';
import { UserSessionsList, UserSessionsShow } from './components/pages/user-sessions';
import { ObjectStoragesList, ObjectStoragesEdit, ObjectStoragesCreate, ObjectStoragesShow } from './components/pages/object-storages';
import { FilesList, FilesEdit, FilesCreate, FilesShow } from './components/pages/files';

// 명확한 Resource 정의
<Admin>
  {/* 사용자 관리 */}
  <Resource 
    name="privates/users" 
    list={UsersList} 
    edit={UsersEdit} 
    create={UsersCreate}
    show={UsersShow}
    options={{ label: '사용자', menuGroup: 'users', menuGroupLabel: '사용자 관리', icon: <People /> }} 
  />
  
  {/* 오브젝트 관리 */}
  <Resource 
    name="privates/objectStorages" 
    list={ObjectStoragesList} 
    edit={ObjectStoragesEdit} 
    create={ObjectStoragesCreate}
    show={ObjectStoragesShow}
    options={{ label: '저장소', menuGroup: 'objects', menuGroupLabel: '오브젝트', icon: <Storage /> }} 
  />
</Admin>
```

## 🚀 새 리소스 추가하는 법

### Step 1: 폴더 생성
```bash
mkdir src/components/react-admin/components/pages/my-resource
```

### Step 2: List 컴포넌트 생성
```tsx
// src/components/react-admin/components/pages/my-resource/MyResourceList.tsx
"use client";

import { List, Datagrid, TextField } from 'react-admin';

export const MyResourceList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" label="ID" />
        <TextField source="attributes.name" label="이름" />
      </Datagrid>
    </List>
  );
};
```

### Step 3: Edit, Create, Show 컴포넌트 생성 (필요시)
```tsx
// MyResourceEdit.tsx, MyResourceCreate.tsx, MyResourceShow.tsx
// 위의 users 폴더 참조
```

### Step 4: index.ts 생성
```tsx
// src/components/react-admin/components/pages/my-resource/index.ts
export { MyResourceList } from './MyResourceList';
export { MyResourceEdit } from './MyResourceEdit';
export { MyResourceCreate } from './MyResourceCreate';
export { MyResourceShow } from './MyResourceShow';
```

### Step 5: AdminApp.tsx에 등록
```tsx
// Import
import { MyResourceList, MyResourceEdit, MyResourceCreate, MyResourceShow } from './components/pages/my-resource';

// Resource 추가
<Resource 
  name="privates/my-resource" 
  list={MyResourceList} 
  edit={MyResourceEdit} 
  create={MyResourceCreate}
  show={MyResourceShow}
  options={{ 
    label: '내 리소스', 
    menuGroup: 'mygroup', 
    menuGroupLabel: '내 그룹',
    icon: <Article /> 
  }} 
/>
```

## 📝 코딩 규칙

### 1. 모든 컴포넌트에 "use client" 필수
```tsx
"use client";  // Next.js App Router 필수

import { List } from 'react-admin';
```

### 2. JSON:API 속성 경로
```tsx
// ✅ 올바른 방법
<TextField source="attributes.username" />
<TextField source="attributes.email" />

// ❌ 잘못된 방법
<TextField source="username" />
```

### 3. 컴포넌트 네이밍
```tsx
// ✅ 올바른 방법
export const UsersList = () => { ... }
export const UsersEdit = () => { ... }

// ❌ 잘못된 방법
export const UserList = () => { ... }
export const usersList = () => { ... }
```

### 4. 한글 라벨 사용
```tsx
<TextField source="attributes.username" label="사용자명" />
<TextField source="attributes.email" label="이메일" />
```

## ✅ 완료 체크리스트

- [x] users 리소스 모듈화
- [x] user-sessions 리소스 모듈화
- [x] object-storages 리소스 모듈화
- [x] files 리소스 모듈화
- [x] AdminApp.tsx 업데이트
- [x] 각 폴더에 README.md 작성
- [x] 전체 가이드 문서 작성
- [x] 빌드 에러 확인 (에러 없음 ✅)

## 🎉 결과

1. **유지보수성 향상**: 각 리소스가 독립적인 폴더로 분리
2. **가독성 향상**: 깔끔한 import 경로와 명확한 구조
3. **확장성 향상**: 새 리소스 추가가 매우 쉬움
4. **문서화**: 각 리소스마다 README 문서 제공
5. **일관성**: 모든 리소스가 동일한 패턴을 따름

## 📚 참고 파일

- `src/components/react-admin/components/pages/README.md` - 전체 가이드
- `src/components/react-admin/components/pages/users/README.md` - Users 리소스 가이드
- 각 리소스 폴더의 README.md - 개별 리소스 가이드
