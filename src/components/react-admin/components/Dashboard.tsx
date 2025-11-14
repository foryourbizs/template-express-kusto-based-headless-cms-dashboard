import { FC, useState, ReactNode, useRef, useEffect } from 'react';
import {
    useTheme,
} from '@mui/material';

import { useDataProvider } from 'react-admin';


import GridLayout, { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import "react-grid-layout/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

// 대시보드 위젯 타입 정의
interface DashboardWidgetConfig {
    title: string;
    component: ReactNode;
    // 레이아웃 설정
    x: number;      // 그리드 X 위치 (0-11)
    y: number;      // 그리드 Y 위치
    w: number;      // 너비 (1-12)
    h: number;      // 높이
    minW?: number;  // 최소 너비
    minH?: number;  // 최소 높이
}

// 반응형 브레이크포인트 설정
const BREAKPOINTS = {
    lg: 1200,  // 큰 화면
    md: 996,   // 중간 화면
    sm: 768,   // 작은 화면
    xs: 480,   // 매우 작은 화면
};

// 브레이크포인트별 컬럼 수
const COLS = {
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
};

// ⭐ 위젯 설정 (여기서 한 번에 관리!)
const DASHBOARD_WIDGETS: DashboardWidgetConfig[] = [
    {
        title: '사용자 통계',
        x: 0, y: 0, w: 6, h: 8, minW: 3, minH: 4,
        component: (
            <div>
                <p>총 사용자: 1,234명</p>
                <p>오늘 신규: 45명</p>
            </div>
        ),
    },
    {
        title: '시스템 상태',
        x: 6, y: 0, w: 6, h: 8, minW: 3, minH: 4,
        component: (
            <div>
                <p>서버 상태: 정상</p>
                <p>응답 시간: 123ms</p>
            </div>
        ),
    },
    {
        title: '최근 활동',
        x: 0, y: 8, w: 4, h: 6, minW: 2, minH: 4,
        component: (
            <div>
                <p>최근 로그인: 10분 전</p>
            </div>
        ),
    },
    {
        title: '알림',
        x: 4, y: 8, w: 4, h: 6, minW: 2, minH: 4,
        component: (
            <div>
                <p>새 알림 3개</p>
            </div>
        ),
    },
    {
        title: '퀵 액션',
        x: 8, y: 8, w: 4, h: 6, minW: 2, minH: 4,
        component: (
            <div>
                <Button>새 사용자 추가</Button>
            </div>
        ),
    },
];

/**
 * 대시보드 메인 컴포넌트
 */
export const Dashboard: FC = () => {
    const theme = useTheme();
    const dataProvider = useDataProvider();
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(1200);
    
    // 화면 크기에 따른 rowHeight 동적 계산
    const getRowHeight = (width: number) => {
        if (width < BREAKPOINTS.xs) return 20;
        if (width < BREAKPOINTS.sm) return 25;
        if (width < BREAKPOINTS.md) return 30;
        if (width < BREAKPOINTS.lg) return 35;
        return 40;
    };
    
    const [rowHeight, setRowHeight] = useState(getRowHeight(1200));
    
    // 컨테이너 너비 동적 측정
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setContainerWidth(width);
                setRowHeight(getRowHeight(width));
            }
        };
        
        // ResizeObserver로 컨테이너 크기 변화 감지 (사이드바 토글 포함)
        const resizeObserver = new ResizeObserver(() => {
            updateWidth();
        });
        
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        
        updateWidth();
        window.addEventListener('resize', updateWidth);
        
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateWidth);
        };
    }, []);
    
    // 브레이크포인트별 레이아웃 생성
    const generateResponsiveLayouts = () => {
        const layouts: { [key: string]: Layout[] } = {};
        
        // lg (큰 화면) - 원본 레이아웃
        layouts.lg = DASHBOARD_WIDGETS.map((widget, index) => ({
            i: `widget-${index}`,
            x: widget.x,
            y: widget.y,
            w: widget.w,
            h: widget.h,
            minW: widget.minW || 2,
            minH: widget.minH || 3,
        }));
        
        // md (중간 화면) - 너비 조정
        layouts.md = DASHBOARD_WIDGETS.map((widget, index) => ({
            i: `widget-${index}`,
            x: widget.x >= 6 ? 0 : widget.x,
            y: widget.x >= 6 ? widget.y + 10 : widget.y,
            w: Math.min(widget.w, 10),
            h: widget.h,
            minW: widget.minW || 2,
            minH: widget.minH || 3,
        }));
        
        // sm (작은 화면) - 2열 레이아웃
        layouts.sm = DASHBOARD_WIDGETS.map((widget, index) => ({
            i: `widget-${index}`,
            x: (index % 2) * 3,
            y: Math.floor(index / 2) * (widget.h + 1),
            w: 3,
            h: widget.h,
            minW: 2,
            minH: widget.minH || 3,
        }));
        
        // xs (매우 작은 화면) - 1열 레이아웃
        layouts.xs = DASHBOARD_WIDGETS.map((widget, index) => ({
            i: `widget-${index}`,
            x: 0,
            y: index * (widget.h + 1),
            w: 4,
            h: widget.h,
            minW: 2,
            minH: widget.minH || 3,
        }));
        
        return layouts;
    };
    
    const [layouts, setLayouts] = useState(generateResponsiveLayouts());

    // 레이아웃 변경 핸들러
    const handleLayoutChange = (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
        setLayouts(allLayouts);
        // TODO: 레이아웃을 localStorage나 백엔드에 저장
        console.log('Layout changed:', allLayouts);
    };

    return (
        <div style={{ padding: '20px', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }} ref={containerRef}>
            <h1 style={{ marginBottom: '20px' }}>대시보드</h1>
            
            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={BREAKPOINTS}
                cols={COLS}
                rowHeight={rowHeight}
                onLayoutChange={handleLayoutChange}
                draggableHandle=".drag-handle"
                isResizable={true}
                isDraggable={true}
                compactType="vertical"
                containerPadding={[0, 0]}
                margin={[10, 10]}
            >
                {DASHBOARD_WIDGETS.map((widget, index) => (
                    <div key={`widget-${index}`}>
                        <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div 
                                className="drag-handle" 
                                style={{ 
                                    cursor: 'move', 
                                    padding: '10px', 
                                    borderBottom: '1px solid #eee',
                                    fontWeight: 'bold'
                                }}
                            >
                                {widget.title}
                            </div>
                            <div style={{ padding: '10px', flex: 1 }}>
                                {widget.component}
                            </div>
                        </Card>
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
};

export default Dashboard;
