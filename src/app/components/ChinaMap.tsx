import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import chinaGeoJson from "./china.json"; // 导入中国 GeoJSON 数据文件

const ChinaMap = () => {
    const chartRef = useRef(null); // 用于引用 DOM 元素

    useEffect(() => {
        // 初始化 ECharts 实例
        const chartInstance = echarts.init(chartRef.current);

        // 注册中国地图 GeoJSON 数据
        // 报错暂不影响
        echarts.registerMap("china", chinaGeoJson as any);

        // 配置图表选项
        const options = {
            title: {
                text: "行脚图",
                left: "top",
            },
            tooltip: {
                trigger: "item",
                formatter: function (params) {
                    const { name, data } = params;
                    if (data && data.properties) {
                        const { adcode, center, centroid, childrenNum, level, parent } = data.properties;
                        return `
                            <div>
                                <strong>${name}</strong><br/>
                                行政代码: ${adcode}<br/>
                                中心: ${center.join(', ')}<br/>
                                重心: ${centroid.join(', ')}<br/>
                                子区域数量: ${childrenNum}<br/>
                                级别: ${level}<br/>
                                父级行政代码: ${parent.adcode}
                            </div>
                        `;
                    } else {
                        return `<div><strong>${name}</strong></div>`;
                    }
                }
            },
            visualMap: {
                min: 0,
                max: 100,
                left: "left",
                top: "bottom",
                text: ["高", "低"],
                calculable: true,
                inRange: {
                    color: ["#e0ffff", "#006edd"], // 渐变色
                },
            },
            series: [
                {
                    name: "数据值",
                    type: "map",
                    map: "china", // 使用已注册的 'china' 地图
                    roam: true, // 开启地图缩放和平移
                    zoom: 1.5,
                    center: [104.114129, 37.550339], // 设置地图中心位置
                    label: {
                        show: false, // 显示省份名称
                    },
                    emphasis: {
                        label: {
                            show: true, // 悬停时显示省份名称
                        },
                        itemStyle: {
                            areaColor: "#8e91e0", // 悬停时区域的颜色
                        },
                    },
                },
            ],
        };

        // 设置图表选项
        chartInstance.setOption(options);

        // 组件卸载时销毁实例
        return () => {
            chartInstance.dispose();
        };
    }, []);

    return (
        <div
            ref={chartRef}
            style={{
                width: "100%",
                height: "100%",
            }}
        ></div>
    );
};

export default ChinaMap;