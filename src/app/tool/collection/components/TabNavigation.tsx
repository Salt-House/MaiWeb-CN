"use client"

import { motion } from "framer-motion"

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

/**
 * 标签导航组件
 * 提供不同类型收藏品的切换功能
 * 使用 Framer Motion 实现平滑的背景切换动画
 *
 * @param activeTab - 当前激活的标签ID
 * @param onTabChange - 标签切换时的回调函数
 */
export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: "icon", label: "头像", delay: 0.1 },
    { id: "frame", label: "背景", delay: 0.2 },
    { id: "nameplate", label: "名牌", delay: 0.3 },
    { id: "trophy", label: "奖杯", delay: 0.4 },
  ]

  return (
    <motion.div
      className="mb-10 flex justify-center sticky top-4 z-30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap gap-1 p-1.5 bg-white/80 backdrop-blur-md rounded-full border border-gray-200/50 shadow-lg ring-1 ring-gray-100">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 z-10 ${
                isActive ? "text-pink-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-pink-50 to-white rounded-full shadow-sm border border-pink-100/50"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  style={{ zIndex: -1 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {/* 可以根据需要添加图标 */}
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
