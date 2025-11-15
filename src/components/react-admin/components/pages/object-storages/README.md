# Object Storages Resource

오브젝트 스토리지 관리 리소스입니다.

## 컴포넌트

- **ObjectStoragesList.tsx**: 저장소 목록
- **ObjectStoragesEdit.tsx**: 저장소 수정
- **ObjectStoragesCreate.tsx**: 저장소 생성
- **ObjectStoragesShow.tsx**: 저장소 상세 정보
- **index.ts**: 컴포넌트 export

## 지원 프로바이더

- AWS S3
- Azure Blob Storage
- Google Cloud Storage

## 사용법

```tsx
import { ObjectStoragesList, ObjectStoragesEdit, ObjectStoragesCreate, ObjectStoragesShow } from './components/pages/object-storages';

<Resource 
  name="privates/objectStorages" 
  list={ObjectStoragesList} 
  edit={ObjectStoragesEdit} 
  create={ObjectStoragesCreate}
  show={ObjectStoragesShow}
  options={{ label: '저장소', menuGroup: 'objects' }} 
/>
```
