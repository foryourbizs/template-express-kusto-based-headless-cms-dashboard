# Pages - Resource Components

React Admin 리소스별로 구조화된 컴포넌트 폴더입니다.

## 폴더 구조

```
pages/
├── users/                  # 사용자 관리
│   ├── UsersList.tsx
│   ├── UsersEdit.tsx
│   ├── UsersCreate.tsx
│   ├── UsersShow.tsx
│   ├── index.ts
│   └── README.md
├── user-sessions/          # 사용자 세션
│   ├── UserSessionsList.tsx
│   ├── UserSessionsShow.tsx
│   ├── index.ts
│   └── README.md
├── object-storages/        # 오브젝트 스토리지
│   ├── ObjectStoragesList.tsx
│   ├── ObjectStoragesEdit.tsx
│   ├── ObjectStoragesCreate.tsx
│   ├── ObjectStoragesShow.tsx
│   ├── index.ts
│   └── README.md
├── files/                  # 파일 관리
│   ├── FilesList.tsx
│   ├── FilesEdit.tsx
│   ├── FilesCreate.tsx
│   ├── FilesShow.tsx
│   ├── index.ts
│   └── README.md
├── Settings.tsx            # 설정 페이지
├── SettingsSimple.tsx      # 간단한 설정 페이지
└── SystemPages.tsx         # 시스템 페이지

```

## 디자인 패턴

각 리소스 폴더는 다음 구조를 따릅니다:

1. **List 컴포넌트**: 리소스 목록 표시
2. **Edit 컴포넌트**: 기존 리소스 수정
3. **Create 컴포넌트**: 새 리소스 생성
4. **Show 컴포넌트**: 리소스 상세 정보 조회
5. **index.ts**: 모든 컴포넌트를 export
6. **README.md**: 리소스 문서

## 새 리소스 추가하기

1. 리소스 폴더 생성 (예: `my-resource/`)
2. 필요한 컴포넌트 생성:
   ```tsx
   // MyResourceList.tsx
   "use client";
   import { List, Datagrid, TextField } from 'react-admin';
   
   export const MyResourceList = () => {
     return (
       <List>
         <Datagrid rowClick="edit">
           <TextField source="id" label="ID" />
         </Datagrid>
       </List>
     );
   };
   ```
3. `index.ts`에서 export:
   ```tsx
   export { MyResourceList } from './MyResourceList';
   ```
4. `AdminApp.tsx`에서 import하고 Resource로 등록:
   ```tsx
   import { MyResourceList } from './components/pages/my-resource';
   
   <Resource name="my-resource" list={MyResourceList} />
   ```

## 규칙

- ✅ 모든 컴포넌트는 `"use client"` 지시어 필요 (Next.js App Router)
- ✅ 컴포넌트명은 PascalCase + 리소스명 (예: UsersList)
- ✅ JSON:API 형식: `attributes.*` 경로 사용
- ✅ 한글 라벨 필수
- ✅ 각 폴더에 README.md 문서 작성

## 유지보수

- 리소스별로 독립적인 폴더 구조로 유지보수 용이
- index.ts를 통한 깔끔한 import 경로
- 각 리소스는 독립적으로 수정 가능
- 테스트 시 리소스별로 활성화/비활성화 쉬움
