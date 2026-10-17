"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import ChinaMap from "@/components/common/ChinaMap"
import NewsCard from "@/components/common/NewsCard"
import SearchGameCenter from "@/components/common/SearchGameCenter"
import KaleidoscopeCard from "@/app/kaleidoscope/_components/KaleidoscopeCard"
import TokenChecker from "@/hooks/TokenChecker"
import RoatChiho from "@/components/common/circle/RoatChiho"
import { MaiTitle } from "@/components/common/MaiUI"
import { getNews as fetchNews, NewsProps } from "@/services/news"

export default function Home() {

  const [token, setToken] = useState<string>("")
  const textstroke = {
    textShadow:
      "-2px -2px 4px rgba(65, 180, 143, 1), 2px -2px 4px rgba(65, 180, 143, 1), -2px 2px 2px rgba(65, 180, 143, 1), 2px 2px 2px rgba(65, 180, 143, 1)",
  }


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
          {/* Control */}

          <div className="max-sm:h-[40px] w-[200px] h-[100px]"></div>
          <div className="mx-auto w-44 h-12 font-bold text-xl text-center rounded-full bg-white/90 shadow-md">
            {token == "" ? <div className="text-mai-red"> 🔴 无登录状态</div> : <TokenChecker />}
          </div>

          <RoatChiho />

          {/* Kaleidoscope Card */}
          <KaleidoscopeCard />

          {/* 使用独立的SearchGameCenter组件 */}
          <SearchGameCenter />


          {/* 官方标题横幅 */}
          <MaiTitle type="ranking" />
          {/* Map Play display */}
          <div
            id="playmap"
            className="relative w-full max-sm:w-[90%] sm:w-[900px] h-[400px] sm:h-[480px] bg-white mx-auto flex flex-col justify-center items-center rounded-2xl border-4 border-mai-green shadow-xl"
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
