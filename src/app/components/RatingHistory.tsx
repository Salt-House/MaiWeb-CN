import * as echarts from 'echarts';
import { useEffect, useState, useRef } from "react";
import { UserHistorySub } from "../user/model";

export default function RatingHistory() {
    const [token, setToken] = useState<string | null>(null);
    const [ratingHistory, setRatingHistory] = useState<UserHistorySub[]>([]);
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);

    const GetHistory = () => {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        fetch("https://dev.maimai.moe/api/maimai/maiweb/histories/ratings", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                try {
                    const data = JSON.parse(result);
                    if (data && Array.isArray(data)) {
                        console.log("获取到的历史数据:", data);
                        setRatingHistory(data);
                    } else {
                        console.error("获取历史数据格式不正确:", data);
                    }
                } catch (error) {
                    console.error("解析历史数据失败:", error);
                }
            })
            .catch((error) => console.error("请求数据失败:", error));
    }

    // 导出图表为图片
    const exportChart = () => {
        if (chartInstance.current) {
            const url = chartInstance.current.getDataURL({
                type: 'png',
                pixelRatio: 2,
                backgroundColor: '#fff'
            });

            // 创建一个链接元素并触发下载
            const link = document.createElement('a');
            link.download = `Rating-History-${new Date().toLocaleDateString('zh-CN')}.png`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            GetHistory();
        }
    }, [token]);

    useEffect(() => {
        // 确保DOM已经加载
        if (!chartRef.current) {
            return;
        }

        // 如果已经存在实例，先销毁
        if (chartInstance.current) {
            chartInstance.current.dispose();
        }

        // 初始化图表并确保有明确的尺寸
        chartInstance.current = echarts.init(chartRef.current);
        chartInstance.current.resize();

        // 窗口大小变化时重新调整图表大小
        const handleResize = () => {
            chartInstance.current?.resize();
        };
        window.addEventListener('resize', handleResize);

        // 数据加载完成后更新图表
        if (ratingHistory.length > 0) {
            updateChart();
        }

        // 清理函数
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = null;
            }
        };
    }, [chartRef.current]); // 只在组件挂载和DOM元素更改时执行

    // 单独的函数用于更新图表
    const updateChart = () => {
        if (!chartInstance.current || ratingHistory.length === 0) {
            return;
        }

        try {
            // 提取日期和分数
            const dates = ratingHistory.map(item => item.active_until.split('T')[0]);
            const ratings = ratingHistory.map(item => item.rating);

            console.log("图表数据准备完成:", { dates, ratings });

            // 设置图表配置
            chartInstance.current.setOption({
                title: {
                    text: 'Rating 历史记录',
                    textStyle: {
                        color: '#333'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params: any) {
                        const dataIndex = params[0].dataIndex;
                        return `日期: ${dates[dataIndex]}<br/>Rating: ${ratings[dataIndex]}`;
                    }
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        xAxisIndex: 0,
                        start: 90,
                        end: 100
                    },
                    {
                        type: 'inside',
                        xAxisIndex: 0,
                        start: 90,
                        end: 100
                    }
                ],
                xAxis: {
                    type: 'category',
                    data: dates,
                    axisLabel: {
                        rotate: 45,
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'Rating',
                    min: 0,
                    max: 16431,
                    nameLocation: 'middle',
                    nameGap: 30
                },
                series: [
                    {
                        name: 'Rating',
                        type: 'line',
                        data: ratings,
                        smooth: true,
                        lineStyle: {
                            width: 3,
                            color: '#FF5722'
                        },
                        itemStyle: {
                            color: '#FF5722'
                        },
                        markPoint: {
                            symbol: 'pin', // 标记的图形类型，也可以是 'circle', 'rect', 'image://' 等
                            symbolSize: 50, // 图形大小
                            data: [
                                {
                                    type: 'max',
                                    name: '最高分',
                                    itemStyle: {
                                        color: '#f56c6c' // 标记颜色（红色）
                                    },
                                    label: {
                                        show: true,
                                        formatter: '最高分: {@[1]}', // 显示数值
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        backgroundColor: '#f56c6c',
                                        padding: [2, 6],
                                        borderRadius: 4,
                                    }
                                }]
                        }
                    }
                ],
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '15%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {
                            title: '保存为图片'
                        }
                    }
                }
            });
        } catch (error) {
            console.error("设置图表配置失败:", error);
        }
    };

    // 当历史数据发生变化时更新图表
    useEffect(() => {
        updateChart();
    }, [ratingHistory]);

    return (
        <div className="flex flex-col items-center w-full">
            <div id="rating-history" ref={chartRef} style={{ width: '100%', height: '400px', border: '1px solid #eee' }}></div>
            <div className="mt-4">
                <button
                    onClick={exportChart}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    导出图表
                </button>
            </div>
        </div>
    );
}