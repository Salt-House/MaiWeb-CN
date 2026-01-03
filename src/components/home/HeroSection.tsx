"use client"

import { motion } from "framer-motion"
import RoatChiho from "@/components/common/circle/RoatChiho"
import TokenChecker from "@/hooks/TokenChecker"
import { useEffect, useState } from "react"

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [token, setToken] = useState<string>("")

  useEffect(() => {
    setMounted(true)
    setToken(localStorage.getItem("token") || "")
  }, [])

  if (!mounted) return null

  return (
    <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-10">
     
      {/* 状态胶囊 */}
      <motion.div
        id="user"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="z-10 mb-10"
      >
        <div className="px-6 py-2 bg-white/60 backdrop-blur-md rounded-full shadow-lg border border-white/40 flex items-center space-x-2 transition-transform hover:scale-105">
          <div className={`w-2 h-2 rounded-full ${token ? "bg-green-400 animate-pulse" : "bg-red-400"}`}></div>
          <div className="font-bold text-sm md:text-base text-gray-700">
             {token === "" ? <span>未登录</span> : <TokenChecker />}
          </div>
        </div>
      </motion.div>

      {/* 核心视觉元素 - 旋转圆环 */}
      <motion.div
        className="relative z-0 scale-75 md:scale-100"
        initial={{ opacity: 0, rotate: -30 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 1.2, type: "spring" }}
      >
        <RoatChiho />
      </motion.div>
    </section>
  )
}
