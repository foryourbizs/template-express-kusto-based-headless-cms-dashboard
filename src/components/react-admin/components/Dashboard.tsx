import { FC, useState, ReactNode, useRef, useEffect } from 'react';
import {
    useTheme,
} from '@mui/material';

import { useDataProvider } from 'react-admin';

import { LocalStorage } from '@/lib/utils'
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import "react-grid-layout/css/styles.css";

// 모듈화된 위젯 설정 임포트
import { DASHBOARD_WIDGETS } from './widgets';

const ResponsiveGridLayout = WidthProvider(Responsive);

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

/**
 * 대시보드 메인 컴포넌트
 */
export const Dashboard: FC = () => {
    const theme = useTheme();
    const dataProvider = useDataProvider();
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(1200);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

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
            x: widget.layout.x,
            y: widget.layout.y,
            w: widget.layout.w,
            h: widget.layout.h,
            minW: widget.layout.minW || 2,
            minH: widget.layout.minH || 3,
        }));

        // md (중간 화면) - 너비 조정
        layouts.md = DASHBOARD_WIDGETS.map((widget, index) => ({
            i: `widget-${index}`,
            x: widget.layout.x >= 6 ? 0 : widget.layout.x,
            y: widget.layout.x >= 6 ? widget.layout.y + 10 : widget.layout.y,
            w: Math.min(widget.layout.w, 10),
            h: widget.layout.h,
            minW: widget.layout.minW || 2,
            minH: widget.layout.minH || 3,
        }));

        // sm (작은 화면) - 2열 레이아웃
        layouts.sm = DASHBOARD_WIDGETS.map((widget, index) => ({
            i: `widget-${index}`,
            x: (index % 2) * 3,
            y: Math.floor(index / 2) * (widget.layout.h + 1),
            w: 3,
            h: widget.layout.h,
            minW: 2,
            minH: widget.layout.minH || 3,
        }));

        // xs (매우 작은 화면) - 1열 레이아웃
        layouts.xs = DASHBOARD_WIDGETS.map((widget, index) => ({
            i: `widget-${index}`,
            x: 0,
            y: index * (widget.layout.h + 1),
            w: 4,
            h: widget.layout.h,
            minW: 2,
            minH: widget.layout.minH || 3,
        }));

        return layouts;
    };

    // LocalStorage에서 저장된 레이아웃 불러오기 또는 기본 레이아웃 생성
    const getInitialLayouts = (): { [key: string]: Layout[] } => {
        const savedLayouts = LocalStorage.get<{ [key: string]: Layout[] }>('userLayoutPosData');

        if (savedLayouts) {
            console.log('Loaded saved layout from LocalStorage');
            return savedLayouts;
        }

        console.log('Using default layout');
        return generateResponsiveLayouts();
    };

    const [layouts, setLayouts] = useState(getInitialLayouts());

    // 레이아웃 준비 완료 처리
    useEffect(() => {
        // 짧은 지연 후 레이아웃 표시 (초기 위치 계산 완료 후)
        const timer = setTimeout(() => {
            setIsLayoutReady(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // 레이아웃 변경 핸들러
    const handleLayoutChange = (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
        setLayouts(allLayouts);

        // LocalStorage에 레이아웃 저장
        LocalStorage.set('userLayoutPosData', allLayouts);
        console.log('Layout saved to LocalStorage:', allLayouts);
    };

    // 레이아웃 초기화 함수
    const resetLayout = () => {
        const defaultLayouts = generateResponsiveLayouts();
        setIsLayoutReady(false);
        setLayouts(defaultLayouts);
        LocalStorage.set('userLayoutPosData', defaultLayouts);
        console.log('Layout reset to default');

        // 애니메이션을 위해 다시 활성화
        setTimeout(() => {
            setIsLayoutReady(true);
        }, 50);
    };

    return (
        <div style={{ padding: '20px', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }} ref={containerRef}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>대시보드</h1>
                <Button className={`cursor-pointer bg-[${theme.palette.background.default}] text-[${theme.palette.text.primary}]`} onClick={resetLayout} variant="outline">
                    레이아웃 초기화
                </Button>
            </div>

            <div style={{
                opacity: isLayoutReady ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
            }}>
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
                        <div key={`widget-${index}`} className='h-auto'>
                            <Card className={`bg-[${theme.palette.background.default}] text-[${theme.palette.text.primary}]`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                                <div style={{ padding: '10px', flex: 1, overflow: 'hidden' }}>
                                    {widget.component}
                                </div>
                            </Card>
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};

export default Dashboard;
