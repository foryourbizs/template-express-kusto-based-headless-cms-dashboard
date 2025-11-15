import { FC, useState, ReactNode, useRef, useEffect } from 'react';
import {
    useTheme,
} from '@mui/material';

import { useDataProvider } from 'react-admin';

import { LocalStorage } from '@/lib/utils'
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChartContainer, ChartConfig, ChartTooltip, ChartLegend, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart"

import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart } from "recharts"
import "react-grid-layout/css/styles.css";

// Mock 데이터 임포트
import visitData from './mocks/visitdata.json';

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

// 방문자 차트 설정
const visitorChartConfig = {
    visitors: {
        label: "방문자",
        color: "#2563eb",
    },
    uniqueVisitors: {
        label: "순 방문자",
        color: "#60a5fa",
    },
    pageViews: {
        label: "페이지뷰",
        color: "#34d399",
    },
} satisfies ChartConfig;

// 방문자 차트 컴포넌트
const VisitorChart: FC = () => {
    const [period, setPeriod] = useState<'yearly' | 'monthly' | 'daily' | 'hourly'>('monthly');
    const [chartData, setChartData] = useState<any[]>([]);
    const [hiddenLines, setHiddenLines] = useState<Record<string, boolean>>({
        방문자: false,
        순방문자: false,
        페이지뷰: false,
    });

    useEffect(() => {
        switch (period) {
            case 'yearly':
                setChartData(visitData.yearly.map(d => ({
                    name: `${d.year}년`,
                    방문자: d.visitors,
                    순방문자: d.uniqueVisitors,
                    페이지뷰: d.pageViews,
                })));
                break;
            case 'monthly':
                setChartData(visitData.monthly.map(d => ({
                    name: d.monthName,
                    방문자: d.visitors,
                    순방문자: d.uniqueVisitors,
                    페이지뷰: d.pageViews,
                })));
                break;
            case 'daily':
                setChartData(visitData.daily.map(d => ({
                    name: `${d.date.split('-')[2]}일(${d.dayOfWeek})`,
                    방문자: d.visitors,
                    순방문자: d.uniqueVisitors,
                    페이지뷰: d.pageViews,
                })));
                break;
            case 'hourly':
                setChartData(visitData.hourly.map(d => ({
                    name: `${d.hour}시`,
                    방문자: d.visitors,
                    순방문자: d.uniqueVisitors,
                    페이지뷰: d.pageViews,
                })));
                break;
        }
    }, [period]);

    const toggleLine = (key: string) => {
        setHiddenLines(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="h-full w-full flex flex-col" style={{ maxHeight: '100%', overflow: 'hidden' }}>
            <div className="flex gap-2 mb-2 flex-shrink-0">
                <Button
                    variant={period === 'yearly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPeriod('yearly')}
                >
                    년도별
                </Button>
                <Button
                    variant={period === 'monthly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPeriod('monthly')}
                >
                    월별
                </Button>
                <Button
                    variant={period === 'daily' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPeriod('daily')}
                >
                    일별
                </Button>
                <Button
                    variant={period === 'hourly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPeriod('hourly')}
                >
                    시간별
                </Button>
            </div>
            
            {/* 커스텀 범례 */}
            <div className="flex gap-4 mb-2 flex-shrink-0 justify-center">
                <button
                    onClick={() => toggleLine('방문자')}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                    style={{ opacity: hiddenLines['방문자'] ? 0.5 : 1 }}
                >
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2563eb' }}></div>
                    <span className="text-sm">방문자</span>
                </button>
                <button
                    onClick={() => toggleLine('순방문자')}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                    style={{ opacity: hiddenLines['순방문자'] ? 0.5 : 1 }}
                >
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#60a5fa' }}></div>
                    <span className="text-sm">순방문자</span>
                </button>
                <button
                    onClick={() => toggleLine('페이지뷰')}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                    style={{ opacity: hiddenLines['페이지뷰'] ? 0.5 : 1 }}
                >
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#34d399' }}></div>
                    <span className="text-sm">페이지뷰</span>
                </button>
            </div>

            <div className="flex-1 min-h-0">
                <ChartContainer config={visitorChartConfig} className="h-full w-full">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            angle={period === 'daily' ? -45 : 0}
                            textAnchor={period === 'daily' ? 'end' : 'middle'}
                            height={period === 'daily' ? 60 : 30}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        {!hiddenLines['방문자'] && (
                            <Line
                                type="monotone"
                                dataKey="방문자"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                        )}
                        {!hiddenLines['순방문자'] && (
                            <Line
                                type="monotone"
                                dataKey="순방문자"
                                stroke="#60a5fa"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                        )}
                        {!hiddenLines['페이지뷰'] && (
                            <Line
                                type="monotone"
                                dataKey="페이지뷰"
                                stroke="#34d399"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                        )}
                    </LineChart>
                </ChartContainer>
            </div>
        </div>
    );
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
        title: '방문자 통계 차트',
        x: 6, y: 0, w: 12, h: 8, minW: 6, minH: 8,
        component: <VisitorChart />,
    },

    {
        title: '시스템 상태',
        x: 0, y: 10, w: 6, h: 8, minW: 3, minH: 4,
        component: (
            <div>
                <p>서버 상태: 정상</p>
                <p>응답 시간: 123ms</p>
            </div>
        ),
    },
    {
        title: '최근 활동',
        x: 6, y: 10, w: 4, h: 6, minW: 2, minH: 4,
        component: (
            <div>
                <p>최근 로그인: 10분 전</p>
            </div>
        ),
    },
    {
        title: '알림',
        x: 0, y: 18, w: 4, h: 6, minW: 2, minH: 4,
        component: (
            <div>
                <p>새 알림 3개</p>
            </div>
        ),
    },
    {
        title: '퀵 액션',
        x: 4, y: 18, w: 4, h: 6, minW: 2, minH: 4,
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
