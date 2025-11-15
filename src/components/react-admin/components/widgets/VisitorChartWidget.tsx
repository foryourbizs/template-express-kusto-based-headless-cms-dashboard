import { FC, useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis } from "recharts";
import visitData from '../mocks/visitdata.json';

// 차트 데이터 타입
type ChartDataPoint = {
    name: string;
    visitors: number;
    uniqueVisitors: number;
    pageViews: number;
};

type Period = 'yearly' | 'monthly' | 'daily' | 'hourly';

type LineKey = 'visitors' | 'uniqueVisitors' | 'pageViews';

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: any) => {
    const theme = useTheme();
    
    if (!active || !payload || !payload.length) {
        return null;
    }

    return (
        <div style={{
            backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
            border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`,
            borderRadius: '6px',
            padding: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }}>
            <p style={{
                margin: '0 0 8px 0',
                fontWeight: 'bold',
                color: theme.palette.text.primary,
            }}>
                {label}
            </p>
            <table style={{ 
                borderCollapse: 'separate', 
                borderSpacing: '0 6px',
                width: '100%',
            }}>
                <tbody>
                    {payload.map((entry: any, index: number) => {
                        const configKey = entry.dataKey as keyof typeof visitorChartConfig;
                        const displayLabel = visitorChartConfig[configKey]?.label || entry.dataKey;
                        
                        return (
                            <tr key={index}>
                                <td style={{ paddingRight: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '12px',
                                            height: '12px',
                                            backgroundColor: entry.color,
                                            borderRadius: '2px',
                                        }} />
                                        <span style={{ 
                                            color: theme.palette.text.secondary,
                                            fontSize: '14px',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {displayLabel}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <strong style={{ 
                                        color: theme.palette.text.primary,
                                        fontSize: '14px',
                                    }}>
                                        {entry.value.toLocaleString()}
                                    </strong>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
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

export const VisitorChartWidget: FC = () => {
    const theme = useTheme();
    const [period, setPeriod] = useState<Period>('monthly');
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [hiddenLines, setHiddenLines] = useState<Record<LineKey, boolean>>({
        visitors: false,
        uniqueVisitors: false,
        pageViews: false,
    });

    useEffect(() => {
        switch (period) {
            case 'yearly':
                setChartData(visitData.yearly.map(d => ({
                    name: `${d.year}년`,
                    visitors: d.visitors,
                    uniqueVisitors: d.uniqueVisitors,
                    pageViews: d.pageViews,
                })));
                break;
            case 'monthly':
                setChartData(visitData.monthly.map(d => ({
                    name: d.monthName,
                    visitors: d.visitors,
                    uniqueVisitors: d.uniqueVisitors,
                    pageViews: d.pageViews,
                })));
                break;
            case 'daily':
                setChartData(visitData.daily.map(d => ({
                    name: `${d.date.split('-')[2]}일(${d.dayOfWeek})`,
                    visitors: d.visitors,
                    uniqueVisitors: d.uniqueVisitors,
                    pageViews: d.pageViews,
                })));
                break;
            case 'hourly':
                setChartData(visitData.hourly.map(d => ({
                    name: `${d.hour}시`,
                    visitors: d.visitors,
                    uniqueVisitors: d.uniqueVisitors,
                    pageViews: d.pageViews,
                })));
                break;
        }
    }, [period]);

    const toggleLine = (key: LineKey) => {
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
                    style={period === 'yearly' ? {} : {
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : undefined,
                        color: theme.palette.mode === 'dark' ? theme.palette.grey[200] : undefined,
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : undefined,
                    }}
                >
                    년도별
                </Button>
                <Button
                    variant={period === 'monthly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPeriod('monthly')}
                    style={period === 'monthly' ? {} : {
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : undefined,
                        color: theme.palette.mode === 'dark' ? theme.palette.grey[200] : undefined,
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : undefined,
                    }}
                >
                    월별
                </Button>
                <Button
                    variant={period === 'daily' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPeriod('daily')}
                    style={period === 'daily' ? {} : {
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : undefined,
                        color: theme.palette.mode === 'dark' ? theme.palette.grey[200] : undefined,
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : undefined,
                    }}
                >
                    일별
                </Button>
                <Button
                    variant={period === 'hourly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPeriod('hourly')}
                    style={period === 'hourly' ? {} : {
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : undefined,
                        color: theme.palette.mode === 'dark' ? theme.palette.grey[200] : undefined,
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : undefined,
                    }}
                >
                    시간별
                </Button>
            </div>
            
            {/* 커스텀 범례 */}
            <div className="flex gap-4 mb-2 flex-shrink-0 justify-center">
                <button
                    onClick={() => toggleLine('visitors')}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                    style={{ 
                        opacity: hiddenLines.visitors ? 0.5 : 1,
                        color: theme.palette.text.primary
                    }}
                >
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2563eb' }}></div>
                    <span className="text-sm">방문자</span>
                </button>
                <button
                    onClick={() => toggleLine('uniqueVisitors')}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                    style={{ 
                        opacity: hiddenLines.uniqueVisitors ? 0.5 : 1,
                        color: theme.palette.text.primary
                    }}
                >
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#60a5fa' }}></div>
                    <span className="text-sm">순방문자</span>
                </button>
                <button
                    onClick={() => toggleLine('pageViews')}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                    style={{ 
                        opacity: hiddenLines.pageViews ? 0.5 : 1,
                        color: theme.palette.text.primary
                    }}
                >
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#34d399' }}></div>
                    <span className="text-sm">페이지뷰</span>
                </button>
            </div>

            <div className="flex-1 min-h-0">
                <ChartContainer config={visitorChartConfig} className="h-full w-full">
                    <LineChart data={chartData} margin={{ 
                        top: 5, 
                        right: 30, 
                        left: 30, 
                        bottom: period === 'daily' ? 20 : 5 
                    }}>
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke={theme.palette.mode === 'dark' ? '#444' : '#e0e0e0'}
                        />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={0}
                            angle={period === 'daily' ? -45 : 0}
                            textAnchor={period === 'daily' ? 'end' : 'middle'}
                            height={period === 'daily' ? 60 : 30}

                        />
                        <ChartTooltip content={<CustomTooltip />} />
                        {!hiddenLines.visitors && (
                            <Line
                                type="monotone"
                                dataKey="visitors"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                        )}
                        {!hiddenLines.uniqueVisitors && (
                            <Line
                                type="monotone"
                                dataKey="uniqueVisitors"
                                stroke="#60a5fa"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                        )}
                        {!hiddenLines.pageViews && (
                            <Line
                                type="monotone"
                                dataKey="pageViews"
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
