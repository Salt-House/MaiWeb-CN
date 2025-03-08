import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import chinaGeoJson from "./china.json"; // 导入中国 GeoJSON 数据文件

interface UserRegionData {
    user_id: string;
    region_id: string;
    region_name: string;
    play_count: number;
    updated_at: string;
}

const ChinaMap = () => {
    const chartRef = useRef(null); // 用于引用 DOM 元素
    const [token, setToken] = useState<string | null>("");
    const [userRegionData, setUserRegionData] = useState<UserRegionData[]>([]);
    const [globalData, setgloablData] = useState([
        { name: "北京市", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "黑龙江省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "内蒙古自治区", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "吉林省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "辽宁省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "河北省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "新疆维吾尔自治区", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "甘肃省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "宁夏回族自治区", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "天津市", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "陕西省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "山西省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "山东省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "河南省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "江苏省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "安徽省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "湖北省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "重庆市", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "四川省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "西藏自治区", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "上海市", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "浙江省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "福建省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "湖南省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "贵州省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "青海省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "江西省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "广西壮族自治区", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "广东省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "云南省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "台湾省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "香港特别行政区", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "澳门特别行政区", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
        { name: "海南省", yearTimes: 0, dateTimes: 0, monthTimes: 0 }
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
                                出勤次数: ${yearTimes}<br/>
                            </div>
                        `;
                    } else {
                        return `<div><strong>${name}</strong></div>`;
                    }
                }
            },
            visualMap: {
                show: false,
                min: 0,
                max: 5,
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
                        name: feature.name,
                        yearTimes: feature.yearTimes,
                        dataTimes: feature.dateTimes,
                        monthTimes: feature.monthTimes
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
    }, [globalData]);
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
                                出勤次数: ${yearTimes}<br/>
                            </div>
                        `;
                    } else {
                        return `<div><strong>${name}</strong></div>`;
                    }
                }
            },
            visualMap: {
                show: false,
                min: 0,
                max: 5,
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
                        name: feature.name,
                        yearTimes: feature.yearTimes,
                        dataTimes: feature.dateTimes,
                        monthTimes: feature.monthTimes
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
    }, [token]);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    useEffect(() => {
        if (token != "") {
            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
            };

            fetch("https://dev.maimai.moe/api/maimai/maiweb/regions", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const data = JSON.parse(result);
                    if (data) {
                        setUserRegionData(data);
                    }
                })
                .catch((error) => console.error(error));
        }
    }, [token]);

    useEffect(() => {
        console.log(userRegionData);
        if (userRegionData.length != 0) {
            console.log(userRegionData.length);
        }
        updateGlobalData();
    }, [userRegionData]);
    const updateGlobalData = () => {
        if (!Array.isArray(userRegionData)) {
            console.error('userRegionData is not an array', userRegionData);
            return;
        }
        // 创建一个新的数组，避免直接修改原状态
        const updatedData = globalData.map(item => {
            // 找到对应的区域数据
            const userRegion = userRegionData.find(region => region.region_name === item.name);

            // 如果找到了对应的区域数据，则更新
            if (userRegion) {
                return {
                    ...item,
                    yearTimes: userRegion.play_count, // 假设play_count对应yearTimes，按需求调整
                    dateTimes: userRegion.play_count, // 假设play_count对应dateTimes，按需求调整
                    monthTimes: userRegion.play_count // 假设play_count对应monthTimes，按需求调整
                };
            }

            // 如果没有找到，保持不变
            return item;
        });

        // 更新状态
        setgloablData(updatedData);
    };

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