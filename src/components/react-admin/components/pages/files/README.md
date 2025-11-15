# Files Resource

파일 관리 리소스입니다.

## 컴포넌트

- **FilesList.tsx**: 파일 목록
- **FilesEdit.tsx**: 파일 메타데이터 수정
- **FilesCreate.tsx**: 파일 업로드
- **FilesShow.tsx**: 파일 상세 정보
- **index.ts**: 컴포넌트 export

## 주요 기능

- 파일 업로드
- 파일 메타데이터 관리 (설명, 태그)
- 파일 정보 조회
- 저장소 연결

## 사용법

```tsx
import { FilesList, FilesEdit, FilesCreate, FilesShow } from './components/pages/files';

<Resource 
  name="privates/files" 
  list={FilesList} 
  show={FilesShow} 
  edit={FilesEdit} 
  create={FilesCreate}
  options={{ label: '파일', menuGroup: 'objects' }} 
/>
```
