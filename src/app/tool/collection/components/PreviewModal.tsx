"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Condition } from "../model"

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
    setIsMounted(true)
  }, [])

  const baseUrl = "https://assets2.lxns.net/maimai"

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
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="bg-white rounded-xl w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-full sm:max-h-[90vh] overflow-auto shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            {/* 模态框头部 */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate pr-4">
                {previewImage.name}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
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
            <div className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {/* 图片展示区域 */}
                <div className="flex-1 flex justify-center items-center bg-gray-50 rounded-lg p-3 sm:p-4 min-h-[200px] sm:min-h-[300px]">
                  {previewImage.type === "trophy" ? (
                    <div
                      className={`${previewImage.url} bg-no-repeat bg-contain bg-center w-full max-w-xs sm:max-w-md flex items-center justify-center`}
                      style={{ aspectRatio: "272/29", minHeight: "80px" }}
                    >
                      <div
                        className="text-white text-sm sm:text-lg font-bold text-center px-2 sm:px-4"
                        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)" }}
                      >
                        {previewImage.name}
                      </div>
                    </div>
                  ) : (
                    <img
                      src={getImageUrl() || ""}
                      alt={previewImage.name}
                      className="max-w-full max-h-64 sm:max-h-80 lg:max-h-96 object-contain rounded-lg shadow-lg"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* 条件信息区域 */}
                <div className="w-full lg:w-80 xl:w-96 bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                    获取条件
                  </h3>

                  {conditionLoading ? (
                    <div className="flex items-center justify-center py-6 sm:py-8">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600">
                        加载中...
                      </span>
                    </div>
                  ) : condition ? (
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          类别
                        </label>
                        <p className="text-sm sm:text-base text-gray-900 bg-white p-2 sm:p-3 rounded-lg border">
                          {condition.category}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          获取条件
                        </label>
                        <p className="text-sm sm:text-base text-gray-900 bg-white p-2 sm:p-3 rounded-lg border whitespace-pre-wrap leading-relaxed">
                          {condition.condition_CN || condition.condition}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <div className="text-gray-500 mb-2">
                        <svg
                          className="w-10 h-10 sm:w-12 sm:h-12 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.207-2.175.277-.193.559-.39.844-.59A4.973 4.973 0 0112 13.5c2.122 0 3.879-1.168 4.363-2.825M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm sm:text-base text-gray-500">暂无获取条件信息</p>
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
