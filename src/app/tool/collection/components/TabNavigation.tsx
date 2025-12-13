"use client"

import { motion } from "framer-motion"

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

/**
 * 标签导航组件
 * @param activeTab - 当前激活的标签
 * @param onTabChange - 标签切换回调函数
 */
export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: "icon", label: "头像", delay: 0.1 },
    { id: "frame", label: "背景", delay: 0.2 },
    { id: "nameplate", label: "名牌", delay: 0.3 },
    { id: "trophy", label: "奖杯", delay: 0.4 },
  ]

  const getTabClass = (tabId: string) => {
    const baseClass =
      "px-6 py-3 rounded-lg font-medium transition-all duration-300 relative overflow-hidden"
    const activeClass = "bg-pink-600 text-white shadow-lg"
    const inactiveClass = "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"

    return `${baseClass} ${activeTab === tabId ? activeClass : inactiveClass}`
  }

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId)
  }

  return (
    <motion.div
      className="mb-8 flex justify-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-inner">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 z-10 ${
                isActive ? "text-pink-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-100"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  style={{ zIndex: -1 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
