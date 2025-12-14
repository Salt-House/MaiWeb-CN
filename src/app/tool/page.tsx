"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function ToolPage() {
  const [token, setToken] = useState<string | null>()
  const textstroke = {
    textShadow:
      "-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)",
  }
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"))
    }
  }, [])
  useEffect(() => {}, [token])

  return (
    <>
      <div className="max-sm:w-[90%] text-center w-[800px] h-[600px] mx-auto p-2 space-y-2 flex flex-col justify-center items-center">
        <h1
          className="text-3xl max-sm:text-2xl max-sm:mb-2 font-bold text-white"
          style={textstroke}
        >
          欢迎来到Maimai.moe 工具页面
        </h1>
        <div className="flex max-sm:flex-col max-sm:space-y-5 sm:space-x-5 text-white">
          <div className="border-b-4 border-b-red-500 rounded-full active:border-b-0 transition-all duration-300 ">
            <Link
              href={"/tool/best"}
              className="w-44 h-16 bg-green-500 rounded-full border-4 border-white text-center text-xl font-bold flex justify-center items-center"
            >
              Best50
            </Link>
          </div>
          <div className="border-b-4 border-b-red-500 rounded-full active:border-b-0 transition-all duration-300 ">
            <Link
              href={"/tool/news"}
              className="w-44 h-16 bg-green-500 rounded-full border-4 border-white text-center text-xl font-bold flex justify-center items-center"
            >
              资讯
            </Link>
          </div>
          <div className="border-b-4 border-b-red-500 rounded-full active:border-b-0 transition-all duration-300 ">
            <Link
              href={"/tool/collection"}
              className="w-44 h-16 bg-green-500 rounded-full border-4 border-white text-center text-xl font-bold flex justify-center items-center"
            >
              特殊收藏品
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
