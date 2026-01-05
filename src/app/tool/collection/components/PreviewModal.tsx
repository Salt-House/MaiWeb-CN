"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Condition } from "@/types/collection"
import { CONFIG } from "@/config/api"

interface PreviewModalProps {
  previewImage: {
    url: string
    name: string
    type: string
    collection_id?: string
  } | null
  condition: Condition | undefined
  conditionLoading: boolean
  onClose: () => void
}

/**
 * 图片预览模态框组件
 * 展示收藏品的大图预览以及详细的获取条件
 * 支持点击遮罩关闭和ESC键关闭
 *
 * @param previewImage - 预览图片信息
 * @param condition - 获取条件信息
 * @param conditionLoading - 条件加载状态
 * @param onClose - 关闭模态框的回调函数
 */
export default function PreviewModal({
  previewImage,
  condition,
  conditionLoading,
  onClose,
}: PreviewModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 0)
    
    // 添加ESC键关闭监听
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const baseUrl = CONFIG.ASSETS.MAIMAI.BASE

  // 根据类型生成正确的图片URL
  const getImageUrl = () => {
    if (previewImage && previewImage.type === "icon" && previewImage.collection_id) {
      return `${baseUrl}/${previewImage.type}/${Number(previewImage.collection_id)}.png`
    }
    return previewImage?.url
  }

  const handleClose = () => {
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const modalContent = (
    <AnimatePresence>
      {previewImage && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="bg-white rounded-3xl w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            {/* 模态框头部 */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                 <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
                 <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate pr-4">
                    {previewImage.name}
                 </h2>
              </div>
              
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* 模态框内容 */}
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* 图片展示区域 */}
                <div className="flex-1 flex justify-center items-center bg-gray-50/50 rounded-2xl p-6 min-h-[300px] border border-gray-100/50">
                  {previewImage.type === "trophy" ? (
                    <div
                      className={`${previewImage.url} bg-no-repeat bg-contain bg-center w-full max-w-xs sm:max-w-md flex items-center justify-center filter drop-shadow-xl`}
                      style={{ aspectRatio: "272/29", minHeight: "80px" }}
                    >
                      <div
                        className="text-white text-sm sm:text-lg font-bold text-center px-4"
                        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)" }}
                      >
                        {previewImage.name}
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-64 sm:h-80 lg:h-[400px]">
                      <Image
                        src={getImageUrl() || ""}
                        alt={previewImage.name}
                        fill
                        className="object-contain drop-shadow-xl"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={false}
                        unoptimized
                      />
                    </div>
                  )}
                </div>

                {/* 条件信息区域 */}
                <div className="w-full lg:w-96 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    获取条件
                  </h3>

                  {conditionLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
                      <span className="text-sm text-gray-500 font-medium">
                        正在查询获取条件...
                      </span>
                    </div>
                  ) : condition ? (
                    <div className="space-y-6 flex-1">
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          类别
                        </label>
                        <div className="flex items-center">
                            <span className="inline-block px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm font-medium">
                                {condition.category}
                            </span>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                          详细条件
                        </label>
                        <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {condition.condition_CN || condition.condition}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="text-gray-300 mb-3">
                        <svg
                          className="w-16 h-16 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.207-2.175.277-.193.559-.39.844-.59A4.973 4.973 0 0112 13.5c2.122 0 3.879-1.168 4.363-2.825M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">暂无获取条件信息</p>
                      <p className="text-xs text-gray-400 mt-1">请尝试其他收藏品</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return isMounted ? createPortal(modalContent, document.body) : null
}
