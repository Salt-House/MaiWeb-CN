"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import ChinaMap from "@/components/common/ChinaMap"
import NewsCard from "@/components/common/NewsCard"
import SearchGameCenter from "@/components/common/SearchGameCenter"
import Guide from "@/components/common/Guide"
import { Step } from "react-joyride"
import TokenChecker from "@/hooks/TokenChecker"
import RoatChiho from "@/components/common/circle/RoatChiho"
import { getNews as fetchNews, NewsProps } from "@/services/news"

export default function Home() {

  const [token, setToken] = useState<string>("")
  const textstroke = {
    textShadow:
      "-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)",
  }

  const steps: Step[] = [
    {
      target: "#music",
      content: "点击这里可以查看乐曲信息（包括成绩），铺面确认，乐曲播放等功能",
      disableBeacon: true,
    },
    {
      target: "#region",
      content: "点击这里可以查看舞萌区域信息，区域伙伴，区域跑图等功能",
    },
    {
      target: "#tool",
      content: "点击这里可以查看舞萌工具，卷王工具，成绩工具等功能",
    },
    {
      target: "#funDetail",
      content: "这里可以查看我们已完成的功能和正在开发中的功能",
    },
    {
      target: "#searchGameCenter",
      content: "在这里可以搜索机厅信息",
    },
    {
      target: "#playmap",
      content: "在这里可以查看全国行脚图，点亮你的行脚地图！",
    },
    {
      target: "#user",
      content: "点击这里可以登录或注册账号，进入用户页面（不要问为什么是牛奶）",
      disableScrolling: false,
    },
    {
      target: "#musicPlayer",
      content: "全局舞萌音乐播放器,点击乐曲封面可以最小化播放器",
      disableScrolling: false,
    },
  ]


  useEffect(() => {
    const now = new Date()
    const hours = now.getUTCHours() + 8 // Convert to East 8th timezone
    if (hours >= 22 && hours < 23) {
      alert("晚上好，夜深了，注意休息哦！")
    }
    const storedToken = localStorage.getItem("token") || ""
    setTimeout(() => setToken(storedToken), 0)
    if (localStorage.getItem("token") == "0") {
      localStorage.removeItem("token")
    }
  }, [])


  return (
    <>
      <div className="w-full overflow-hidden">
        {/* Main Layer */}
        <div className="relative w-full">
          {/* 使用抽离的 Guide 组件 */}
          <Guide steps={steps} mark={"hometour"} />
          {/* Control */}

          <div className="max-sm:h-[40px] w-[200px] h-[100px]"></div>
          <div className="mx-auto w-44 h-12 font-bold text-xl text-center">
            {token == "" ? <div> 🔴 无登录状态</div> : <TokenChecker />}
          </div>

          <RoatChiho />

          {/* 使用独立的SearchGameCenter组件 */}
          <SearchGameCenter />


          {/* Map Play display */}
          <div
            id="playmap"
            className="relative w-full max-sm:w-[90%] sm:w-[900px] h-[400px] sm:h-[480px] bg-white mx-auto flex flex-col justify-center items-center rounded-2xl border-4 border-[#41e7d7] shadow-xl"
          >
            <div
              className="absolute -top-5 flex justify-center items-center text-white font-bold text-xl sm:text-2xl"
              style={textstroke}
            >
              全国出勤行脚图
            </div>
            <div className="w-full sm:w-[800px] h-[350px] sm:h-[450px] p-3 sm:p-5">
              {token == "" ? (
                <div className="w-full h-full flex justify-center items-center">
                  <h1 className="text-lg sm:text-xl font-bold tracking-wide">请登录查看</h1>
                </div>
              ) : (
                <ChinaMap />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
