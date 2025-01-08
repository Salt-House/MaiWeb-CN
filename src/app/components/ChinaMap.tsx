import React, { useEffect, useRef,useState } from "react";
import * as echarts from "echarts";
import chinaGeoJson from "./china.json"; // 导入中国 GeoJSON 数据文件

const ChinaMap = () => {
    const chartRef = useRef(null); // 用于引用 DOM 元素
    const [globalData,setgloablData] =useState([
        {name:"北京市",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"黑龙江省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"内蒙古自治区",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"吉林省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"辽宁省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"河北省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"新疆维吾尔自治区",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"甘肃省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"宁夏回族自治区",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"天津市",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"陕西省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"山西省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"山东省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"河南省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"江苏省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"安徽省",yearTimes:"1200",dateTimes:"12",monthTimes:"20"},
        {name:"湖北省",yearTimes:"1200",dateTimes:"12",monthTimes:"80"},
        {name:"重庆市",yearTimes:"1200",dateTimes:"12",monthTimes:"10"},
        {name:"四川省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"西藏自治区",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"上海市",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"浙江省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"江苏省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"福建省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"湖南省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"贵州省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"青海省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"江西省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"广西壮族自治区",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"广东省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"云南省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"台湾省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"香港特别行政区",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"澳门特别行政区",yearTimes:"1200",dateTimes:"12",monthTimes:"120"},
        {name:"海南省",yearTimes:"1200",dateTimes:"12",monthTimes:"120"}
    ]);

    useEffect(() => {
        // 初始化 ECharts 实例
        const chartInstance = echarts.init(chartRef.current);

        // 注册中国地图 GeoJSON 数据
        // 报错暂不影响
        echarts.registerMap("china", chinaGeoJson as any);

        // 配置图表选项
        const options = {
            title: {
                text: "",
                left: "top",
            },
            tooltip: {
                trigger: "item",
                formatter: function (params: any) {
                    const { name, data } = params;
                    if (data) {
                        const { dataTimes, monthTimes, yearTimes } = data;
                        return `
                            <div>
                                <strong>${name}</strong><br/>
                                年出勤人数: ${dataTimes}<br/>
                                月出勤人数: ${monthTimes}<br/>
                                日出勤人数: ${yearTimes}<br/>
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
                    zoom: 1.8,
                    center: [104.114129, 37.550339], // 设置地图中心位置
                    label: {
                        show: false, // 显示省份名称
                    },
                    emphasis: {
                        label: {
                            show: true, // 悬停时显示省份名称
                        },
                        itemStyle: {
                            areaColor: "rgb(239, 246, 255)", // 悬停时区域的颜色
                        },
                    },
                    // data: chinaGeoJson.features.map(feature => ({
                    //     name: feature.properties.name,
                    //     value: Math.random() * 100, // 示例数据
                    //     properties: feature.properties
                    // }))
                    data: globalData.map(feature => ({
                        value: feature.monthTimes,
                        name:feature.name,
                        yearTimes:feature.yearTimes,
                        dataTimes:feature.dateTimes,
                        monthTimes:feature.monthTimes
                    }))
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