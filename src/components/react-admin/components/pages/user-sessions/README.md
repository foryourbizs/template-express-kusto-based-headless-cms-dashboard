# User Sessions Resource

사용자 세션 관리 리소스입니다.

## 컴포넌트

- **UserSessionsList.tsx**: 세션 목록 표시
- **UserSessionsShow.tsx**: 세션 상세 정보 조회
- **index.ts**: 컴포넌트 export

## 사용법

```tsx
import { UserSessionsList, UserSessionsShow } from './components/pages/user-sessions';

<Resource 
  name="privates/users/user-sessions" 
  list={UserSessionsList} 
  show={UserSessionsShow}
  options={{ label: '세션', menuGroup: 'users' }} 
/>
```
