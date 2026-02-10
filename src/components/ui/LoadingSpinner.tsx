"use client"

import React from "react"

interface LoadingSpinnerProps {
  size?: "ultrasm" | "sm" | "md" | "lg"
  message?: string
  description?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "sm",
  message = "加载中...",
  description = "正在获取数据",
}) => {
  // 根据size属性确定尺寸
  const sizeClasses = {
    ultrasm: "w-6 h-6",
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-28 h-28",
  }

  return (
    <div
      className={`flex flex-col items-center justify-center ${size === "ultrasm" ? "" : "py-10"} `}
    >
      <div className={`relative ${sizeClasses[size]} mb-4`}>
        <div className="absolute w-full h-full rounded-full border-4 border-t-[rgb(155,244,236)] border-r-[rgb(155,244,236)] border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute w-full h-full rounded-full border-4 border-t-transparent border-r-transparent border-b-[rgb(69,197,255)] border-l-[rgb(69,197,255)] animate-spin animation-delay-500"></div>
      </div>
      {message && <p className="text-lg font-medium text-gray-700">{message}</p>}
      {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
    </div>
  )
}

export default LoadingSpinner
