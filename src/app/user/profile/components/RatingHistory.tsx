// 动态按需加载 echarts，减小首屏 bundle
import type * as EChartsType from "echarts"
import { useEffect, useState, useRef } from "react"
import { UserHistorySub } from "../../model"
import { CONFIG } from "@/config/api"

export default function RatingHistory() {
  const [token, setToken] = useState<string | null>(null)
  const [ratingHistory, setRatingHistory] = useState<UserHistorySub[]>([])
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<EChartsType.ECharts | null>(null)
  const echartsModuleRef = useRef<typeof import("echarts") | null>(null)

  const GetHistory = () => {
    const myHeaders = new Headers()
    myHeaders.append("Accept", "application/json")
    myHeaders.append("Authorization", `Bearer ${token}`)

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    }

    fetch(`${CONFIG.API.ENDPOINTS.API}/maimai/maiweb/histories/ratings`, requestOptions)
      .then(response => response.text())
      .then(result => {
        try {
          const data = JSON.parse(result)
          if (data && Array.isArray(data)) {
            // TODO 优化：移除调试日志或接入统一日志上报
            console.log("获取到的历史数据:", data)
            setRatingHistory(data)
          } else {
            console.error("获取历史数据格式不正确:", data)
          }
        } catch (error) {
          console.error("解析历史数据失败:", error)
        }
      })
      .catch(error => console.error("请求数据失败:", error))
  }

  // 导出图表为图片
  const exportChart = () => {
    if (chartInstance.current) {
      const url = chartInstance.current.getDataURL({
        type: "png",
        pixelRatio: 2,
        backgroundColor: "#fff",
      })

      // 创建一个链接元素并触发下载
      const link = document.createElement("a")
      link.download = `Rating-History-${new Date().toLocaleDateString("zh-CN")}.png`
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
    // TODO 优化：将 GetHistory 使用 useCallback 包裹并加入依赖，或在数据层统一请求
    if (token) {
      GetHistory()
    }
  }, [token])

  useEffect(() => {
    // 确保DOM已经加载
    if (!chartRef.current) {
      return
    }

    // 动态加载 echarts 并初始化
    ;(async () => {
      if (!echartsModuleRef.current) {
        echartsModuleRef.current = await import("echarts")
      }
      const echarts = echartsModuleRef.current
      if (chartInstance.current) {
        chartInstance.current.dispose()
      }
      chartInstance.current = echarts.init(chartRef.current!)
      chartInstance.current.resize()

      // 数据加载完成后更新图表
      if (ratingHistory.length > 0) {
        updateChart()
      }
    })()

    // 窗口大小变化时重新调整图表大小
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener("resize", handleResize)

    // 数据加载完成后更新图表放到动态加载回调中

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize)
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [chartRef.current]) // TODO 优化：依赖 ref.current 可能导致 ESLint 告警；考虑改为 [] 并在数据变化处触发更新

  // 单独的函数用于更新图表
  const updateChart = () => {
    if (!chartInstance.current || ratingHistory.length === 0) {
      return
    }

    try {
      // 提取日期和分数
      const dates = ratingHistory.map(item => item.active_until.split("T")[0])
      const ratings = ratingHistory.map(item => item.rating)

      // TODO 优化：移除调试日志
      console.log("图表数据准备完成:", { dates, ratings })

      // 设置图表配置
      chartInstance.current.setOption({
        title: {
          text: "Rating 历史记录",
          textStyle: {
            color: "#333",
          },
        },
        tooltip: {
          trigger: "axis",
          // TODO 优化：为 `params` 指定 ECharts 参数类型；并考虑自定义 tooltip 组件以提升可读性
          formatter: function (params: any) {
            const dataIndex = params[0].dataIndex
            return `日期: ${dates[dataIndex]}<br/>Rating: ${ratings[dataIndex]}`
          },
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: 0,
            start: 90,
            end: 100,
          },
          {
            type: "inside",
            xAxisIndex: 0,
            start: 90,
            end: 100,
          },
        ],
        xAxis: {
          type: "category",
          data: dates,
          axisLabel: {
            rotate: 45,
          },
        },
        yAxis: {
          type: "value",
          min: 0,
          // TODO 优化：根据数据动态计算最大值，如 `Math.max(...ratings) * 1.05`
          max: 16431,
          nameLocation: "middle",
          nameGap: 30,
        },
        series: [
          {
            name: "Rating",
            type: "line",
            data: ratings,
            smooth: true,
            lineStyle: {
              width: 3,
              color: "#FF5722",
            },
            itemStyle: {
              color: "#FF5722",
            },
            markPoint: {
              symbol: "pin", // 标记的图形类型，也可以是 'circle', 'rect', 'image://' 等
              symbolSize: 50, // 图形大小
              data: [
                {
                  type: "max",
                  name: "最高分",
                  itemStyle: {
                    color: "#f56c6c", // 标记颜色（红色）
                  },
                  label: {
                    show: true,
                    formatter: "最高分: {@[1]}", // 显示数值
                    color: "#fff",
                    fontWeight: "bold",
                    backgroundColor: "#f56c6c",
                    padding: [2, 6],
                    borderRadius: 4,
                  },
                },
              ],
            },
          },
        ],
        grid: {
          left: "5%",
          right: "5%",
          bottom: "15%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存为图片",
            },
          },
        },
      })
    } catch (error) {
      console.error("设置图表配置失败:", error)
    }
  }

  // 当历史数据发生变化时更新图表
  useEffect(() => {
    updateChart()
  }, [ratingHistory])

  return (
    <div className="flex flex-col items-center w-full">
      <div
        id="rating-history"
        ref={chartRef}
        style={{ width: "100%", height: "400px", border: "1px solid #eee" }}
      ></div>
      <div className="mt-4">
        <button
          onClick={exportChart}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          导出图表
        </button>
      </div>
    </div>
  )
}
