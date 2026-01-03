"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import ChinaMap from "@/components/common/ChinaMap"
import { useEffect, useState } from "react"

export default function MapPreview() {
  const [token, setToken] = useState<string>("")

  useEffect(() => {
    setToken(localStorage.getItem("token") || "")
  }, [])

  return (
    <section id="playmap" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/50"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8">
          {/* 左侧：介绍与数据 */}
          <div className="p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white/50 to-blue-50/30">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              全国行脚图
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              记录你在全国各地的出勤足迹，点亮你的舞萌地图。每一个省份，都是一次新的相遇。
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {token ? "✓" : "?"}
                </div>
                <div>
                  <div className="text-sm text-gray-500">当前状态</div>
                  <div className="font-bold text-gray-800">{token ? "已登录并记录" : "请登录查看"}</div>
                </div>
              </div>
              
              <Link
                href={token ? "/user" : "/user"}
                className="inline-block w-full py-4 text-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                {token ? "查看我的详细数据" : "立即登录开启行脚"}
              </Link>
            </div>
          </div>

          {/* 右侧：地图可视化 */}
          <div className="lg:col-span-2 h-[400px] lg:h-[500px] bg-white/40 relative">
            {token ? (
              <div className="w-full h-full p-4">
                <ChinaMap />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur-sm">
                <div className="text-center p-6">
                   <p className="text-gray-400 text-xl font-medium">地图预览仅对登录用户可见</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
