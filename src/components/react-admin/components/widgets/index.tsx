import { ReactElement } from 'react';
import { UserStatsWidget } from './UserStatsWidget';
import { VisitorChartWidget } from './VisitorChartWidget';
import { SystemStatusWidget } from './SystemStatusWidget';
import { RecentActivityWidget } from './RecentActivityWidget';
import { NotificationsWidget } from './NotificationsWidget';
import { QuickActionsWidget } from './QuickActionsWidget';

// 위젯 설정 타입
export interface DashboardWidget {
    id: string;
    title: string;
    component: ReactElement;
    layout: {
        x: number;
        y: number;
        w: number;
        h: number;
        minW?: number;
        minH?: number;
        maxW?: number;
        maxH?: number;
    };
}

// 대시보드 위젯 설정
export const DASHBOARD_WIDGETS: DashboardWidget[] = [
    {
        id: 'user-stats',
        title: '방문 합계',
        component: <UserStatsWidget />,
        layout: { x: 0, y: 0, w: 3, h: 8, minW: 2, minH: 8 },
    },
    {
        id: 'visitor-chart',
        title: '방문자 통계 차트',
        component: <VisitorChartWidget />,
        layout: { x: 3, y: 0, w: 6, h: 9, minW: 4, minH: 8 },
    },
    {
        id: 'system-status',
        title: '시스템 상태',
        component: <SystemStatusWidget />,
        layout: { x: 9, y: 0, w: 3, h: 6, minW: 2, minH: 5 },
    },
    {
        id: 'recent-activity',
        title: '최근 활동',
        component: <RecentActivityWidget />,
        layout: { x: 0, y: 3, w: 3, h: 8, minW: 2, minH: 7 },
    },
    {
        id: 'notifications',
        title: '알림',
        component: <NotificationsWidget />,
        layout: { x: 9, y: 3, w: 3, h: 8, minW: 2, minH: 8 },
    },
    {
        id: 'quick-actions',
        title: '퀵 액션',
        component: <QuickActionsWidget />,
        layout: { x: 3, y: 6, w: 6, h: 7, minW: 3, minH: 7 },
    },
];


