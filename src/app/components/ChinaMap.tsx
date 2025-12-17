import React, { useEffect, useRef, useState, useMemo } from "react"
import * as echarts from "echarts"
import chinaGeoJson from "./china.json" // 导入中国 GeoJSON 数据文件
import http from "@/utils/request"

interface UserRegionData {
  region_id: string
  region_name: string
  play_count: number
  created_at: string
}

interface GeoJSON {
  type: "FeatureCollection"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  features: any[]
}

const INITIAL_GLOBAL_DATA = [
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
  { name: "海南省", yearTimes: 0, dateTimes: 0, monthTimes: 0 },
]

const ChinaMap = () => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)
  const [userRegionData, setUserRegionData] = useState<UserRegionData[]>([])

  // 使用 useMemo 计算最终的图表数据
  const chartData = useMemo(() => {
    if (!Array.isArray(userRegionData)) {
      return INITIAL_GLOBAL_DATA
    }

    return INITIAL_GLOBAL_DATA.map(item => {
      const userRegion = userRegionData.find(region => region.region_name === item.name)
      if (userRegion) {
        return {
          ...item,
          yearTimes: userRegion.play_count,
          dateTimes: userRegion.play_count,
          monthTimes: userRegion.play_count,
        }
      }
      return item
    })
  }, [userRegionData])

  useEffect(() => {
    // 获取数据
    const fetchData = async () => {
      try {
        const data = await http.get<UserRegionData[]>("/api/maimai/maiweb/regions")
        if (data) {
          setUserRegionData(data)
        }
      } catch (error) {
        console.error("Failed to fetch region data:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!chartRef.current) return

    // 初始化 ECharts 实例
    const chartInstance = echarts.init(chartRef.current)
    chartInstanceRef.current = chartInstance

    // 注册中国地图 GeoJSON 数据
    echarts.registerMap("china", chinaGeoJson as GeoJSON)

    // 配置图表选项
    const options: echarts.EChartsOption = {
      title: {
        text: "",
        left: "top",
      },
      tooltip: {
        trigger: "item",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: function (params: any) {
          // ECharts 类型复杂，params 类型暂用 any，可进一步细化为 echarts.CallbackDataParams
          const { name, data } = params
          if (data) {
            const { yearTimes } = data as { yearTimes: number }
            return `
                            <div>
                                <strong>${name}</strong><br/>
                                出勤次数: ${yearTimes}<br/>
                            </div>
                        `
          } else {
            return `<div><strong>${name}</strong></div>`
          }
        },
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
          color: ["#fce7f3", "#ec4899"], // 粉色主题
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
          scaleLimit: {
            min: 1.2,
            max: 6.0,
          },
          emphasis: {
            label: {
              show: true, // 悬停时显示省份名称
            },
            itemStyle: {
              areaColor: "rgb(253, 242, 248)", // 悬停时区域的颜色
            },
          },
          data: [], // 初始为空，后续通过 setOption 更新
        },
      ],
    }

    chartInstance.setOption(options)

    const handleResize = () => {
      chartInstance.resize()
    }
    window.addEventListener("resize", handleResize)

    // 组件卸载时销毁实例
    return () => {
      window.removeEventListener("resize", handleResize)
      chartInstance.dispose()
      chartInstanceRef.current = null
    }
  }, [])

  // 监听数据变化更新图表
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.setOption({
        series: [
          {
            data: chartData.map(feature => ({
              value: feature.monthTimes,
              name: feature.name,
              yearTimes: feature.yearTimes,
              dataTimes: feature.dateTimes,
              monthTimes: feature.monthTimes,
            })),
          },
        ],
      })
    }
  }, [chartData])

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    ></div>
  )
}

export default ChinaMap
