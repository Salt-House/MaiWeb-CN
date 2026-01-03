"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Step } from "react-joyride"
import Guide from "@/components/common/Guide"
import HeroSection from "@/components/home/HeroSection"
import FeatureGrid from "@/components/home/FeatureGrid"
import NewsFeed from "@/components/home/NewsFeed"
import MapPreview from "@/components/home/MapPreview"

// 定义容器动画
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export default function Home() {
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
      target: "#tools",
      content: "点击这里可以查看舞萌工具，卷王工具，成绩工具等功能",
    },
    {
      target: "#news",
      content: "在这里可以查看最新的舞萌资讯",
    },
    {
      target: "#gamecenter",
      content: "在这里可以搜索机厅信息",
    },
    {
      target: "#playmap",
      content: "在这里可以查看全国行脚图，点亮你的行脚地图！",
    },
    {
      target: "#user",
      content: "点击这里可以登录或注册账号，进入用户页面",
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
  }, [])

  return (
    <motion.main
      className="w-full overflow-hidden min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Guide steps={steps} mark={"hometour-v2"} />

      {/* Hero Section */}
      <HeroSection />

      {/* Feature Bento Grid */}
      <FeatureGrid />

      {/* News Feed */}
      <NewsFeed />

      {/* Map Preview */}
      <MapPreview />
      
      {/* 底部留白，防止被 Footer 遮挡 */}
      <div className="h-20"></div>
    </motion.main>
  )
}
