# Dashboard Widgets

이 폴더는 대시보드의 모든 위젯을 모듈화하여 관리합니다.

## 구조

```
widgets/
├── index.tsx                   # 위젯 설정 및 export
├── VisitorChartWidget.tsx      # 방문자 통계 차트
├── UserStatsWidget.tsx         # 사용자 통계
├── SystemStatusWidget.tsx      # 시스템 상태
├── RecentActivityWidget.tsx    # 최근 활동
├── NotificationsWidget.tsx     # 알림
└── QuickActionsWidget.tsx      # 퀵 액션
... 등등 추가하여 사용

```

## 사용법

### 새 위젯 추가하기

1. **위젯 컴포넌트 생성** (`NewWidget.tsx`)
```tsx
import { FC } from 'react';
import { Typography } from '@mui/material';

export const NewWidget: FC = () => {
    return (
        <div>
            <Typography variant="h6">새 위젯</Typography>
            {/* 위젯 내용 */}
        </div>
    );
};
```

2. **`index.tsx`에 위젯 추가**
```tsx
import { NewWidget } from './NewWidget';

export const DASHBOARD_WIDGETS: DashboardWidget[] = [
    // ... 기존 위젯들
    {
        id: 'new-widget',
        title: '새 위젯',
        component: <NewWidget />,
        layout: { 
            x: 0,      // 그리드 X 위치 (0-11)
            y: 10,     // 그리드 Y 위치
            w: 6,      // 너비 (1-12 컬럼)
            h: 4,      // 높이
            minW: 3,   // 최소 너비 (선택)
            minH: 2    // 최소 높이 (선택)
        },
    },
];

export { NewWidget };
```

## 주의사항

- **Card 래퍼 불필요**: 각 위젯 컴포넌트는 `Card`나 `CardHeader` 래퍼를 포함하지 않습니다. Dashboard 컴포넌트가 자동으로 추가합니다.
- **제목 표시**: 위젯의 `title` 속성이 드래그 핸들 영역에 표시됩니다.
- **높이 관리**: 위젯 내부에서 `overflow: 'auto'`를 사용하여 스크롤을 관리하세요.
- **반응형**: 레이아웃 시스템이 자동으로 브레이크포인트(lg/md/sm/xs)에 맞춰 조정합니다.

## 레이아웃 시스템

### 그리드 구성
- **lg (1200px+)**: 12 컬럼
- **md (996px+)**: 10 컬럼
- **sm (768px+)**: 6 컬럼
- **xs (480px+)**: 4 컬럼

### 위치 계산
- `x`: 좌측에서의 컬럼 위치 (0부터 시작)
- `y`: 상단에서의 행 위치
- `w`: 차지하는 컬럼 수
- `h`: 차지하는 행 수

### 예시
```tsx
layout: { 
    x: 0, y: 0,  // 좌측 상단
    w: 6, h: 4   // 6컬럼 너비, 4행 높이
}
```

## 위젯 타입 정의

```typescript
export interface DashboardWidget {
    id: string;              // 고유 ID
    title: string;           // 드래그 핸들에 표시될 제목
    component: ReactElement; // React 컴포넌트
    layout: {
        x: number;      // X 위치
        y: number;      // Y 위치
        w: number;      // 너비
        h: number;      // 높이
        minW?: number;  // 최소 너비 (선택)
        minH?: number;  // 최소 높이 (선택)
        maxW?: number;  // 최대 너비 (선택)
        maxH?: number;  // 최대 높이 (선택)
    };
}
```

## 기존 위젯 목록

| ID | 제목 | 컴포넌트 | 레이아웃 |
|----|------|----------|----------|
| user-stats | 사용자 통계 | `UserStatsWidget` | x:0, y:0, w:3, h:3 |
| visitor-chart | 방문자 통계 차트 | `VisitorChartWidget` | x:3, y:0, w:6, h:6 |
| system-status | 시스템 상태 | `SystemStatusWidget` | x:9, y:0, w:3, h:3 |
| recent-activity | 최근 활동 | `RecentActivityWidget` | x:0, y:3, w:3, h:3 |
| notifications | 알림 | `NotificationsWidget` | x:9, y:3, w:3, h:3 |
| quick-actions | 퀵 액션 | `QuickActionsWidget` | x:3, y:6, w:6, h:3 |

## 유지보수 가이드

### 위젯 수정
1. 해당 위젯 파일만 수정
2. 타입이나 인터페이스 변경 필요 시 `index.tsx`의 타입 정의 확인

### 위젯 순서 변경
`index.tsx`의 `DASHBOARD_WIDGETS` 배열 순서 조정

### 위젯 삭제
1. 해당 파일 삭제
2. `index.tsx`에서 import 및 배열 항목 제거

### 레이아웃 재정의
`layout` 속성의 x, y, w, h 값 수정
