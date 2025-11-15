import { FC, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis } from "recharts";
import visitData from '../mocks/visitdata.json';

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
