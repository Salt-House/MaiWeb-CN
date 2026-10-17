"use client"

import { AnimatePresence, motion } from "framer-motion"
import { FaCircle, FaMapMarkerAlt } from "react-icons/fa"
import type { Arcade } from "./SearchGameCenter"
import Image from "next/image"
import { useMemo } from "react"
import { FixedSizeList as List, ListChildComponentProps } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"

export interface SearchGameCenterResultsProps {
  showResults: boolean
  isLoading: boolean
  resultError: string
  arcadeResults: Arcade[]
  onClose: () => void
  formatDate: (d: string) => string
  handleNavigation: (arcade: Arcade) => void
}

interface RowData {
  items: Arcade[]
  handleNavigation: (arcade: Arcade) => void
  formatDate: (d: string) => string
}

const Row = ({ index, style, data }: ListChildComponentProps<RowData>) => {
  const { items, handleNavigation, formatDate } = data
  const arcade = items[index]

  return (
    <div style={style}>
      <div className="py-1.5 h-full">
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 hover:shadow-lg transition-all duration-300 border border-pink-200 hover:border-pink-400 h-full flex items-center gap-3 relative overflow-hidden group">
          {/* 装饰背景 */}
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-pink-100/50 rounded-full blur-2xl group-hover:bg-pink-200/50 transition-colors" />

          <div className="flex-1 min-w-0 z-10">
            <div className="flex items-center gap-2 mb-1">
              <FaCircle className="text-[10px] text-green-500 shrink-0" />
              <h3 className="font-bold text-gray-800 text-lg truncate">{arcade.arcade_name}</h3>
            </div>

            <div className="flex items-start text-gray-500 mb-2">
              <FaMapMarkerAlt className="mr-1.5 text-pink-400 mt-1 shrink-0 text-sm" />
              <p className="text-sm line-clamp-2 leading-relaxed">{arcade.arcade_address}</p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {arcade.arcade_count && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-pink-50 text-pink-600 border border-pink-100">
                  {arcade.arcade_count} 台
                </span>
              )}
              {arcade.arcade_cost !== null && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                  ¥{arcade.arcade_cost}/pc
                </span>
              )}
              <span className="text-xs text-gray-400 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatDate(arcade.created_at.toString())}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end justify-center gap-1 shrink-0 z-10 pl-2 border-l border-gray-100 min-w-[80px]">
            {arcade.distance && (
              <span className="text-pink-500 font-bold text-lg leading-none">
                {(arcade.distance / 1000).toFixed(1)}
                <span className="text-xs font-normal ml-0.5">km</span>
              </span>
            )}

            <motion.button
              className="mt-1 flex items-center justify-center px-3 py-1.5 rounded-full bg-pink-500 text-white text-xs font-medium shadow-sm hover:bg-pink-600 transition-colors gap-1"
              onClick={() => handleNavigation(arcade)}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
              导航
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 机厅搜索结果列表（延迟 / 分块加载 framer-motion，减轻首屏 JS）
 */
export default function SearchGameCenterResults(props: SearchGameCenterResultsProps) {
  const {
    showResults,
    isLoading,
    resultError,
    arcadeResults,
    onClose,
    formatDate,
    handleNavigation,
  } = props

  const sortedResults = useMemo(() => {
    return [...arcadeResults].sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
  }, [arcadeResults])

  const itemData = useMemo(
    () => ({ items: sortedResults, handleNavigation, formatDate }),
    [sortedResults, handleNavigation, formatDate]
  )

  return (
    <AnimatePresence>
      {showResults && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-[90%] max-w-[800px] mx-auto mb-20"
        >
          <motion.div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-pink-300 hover:border-pink-400 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-pink-600">机厅查询结果</h3>
              <motion.button
                onClick={onClose}
                className="text-pink-400 hover:text-pink-600 transition-colors p-2 rounded-full hover:bg-pink-50"
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </motion.button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-t-4 border-r-4 border-b-4 border-pink-400 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/img/handpink.png"
                      alt="加载中图标"
                      width={32}
                      height={32}
                      className="w-8 h-8 animate-pulse"
                    />
                  </div>
                </div>
                <p className="mt-4 text-gray-600">正在查询附近机厅...</p>
              </div>
            ) : resultError ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                </div>
                <p className="text-gray-700">{resultError}</p>
                <p className="text-sm text-gray-500 mt-2">请尝试调整搜索条件或范围</p>
              </div>
            ) : (
              <div
                style={{ height: Math.min(sortedResults.length * 150, 400), width: "100%" }}
                className="mx-auto"
              >
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                      className="arcade-results"
                      height={height}
                      width={width}
                      itemCount={sortedResults.length}
                      itemSize={150}
                      itemData={itemData}
                    >
                      {Row}
                    </List>
                  )}
                </AutoSizer>
              </div>
            )}

            <style jsx>{`
              .arcade-results::-webkit-scrollbar {
                width: 8px;
              }
              .arcade-results::-webkit-scrollbar-track {
                background: #fce7f3;
                border-radius: 4px;
              }
              .arcade-results::-webkit-scrollbar-thumb {
                background: #f472b6;
                border-radius: 4px;
              }
              .arcade-results::-webkit-scrollbar-thumb:hover {
                background: #ec4899;
              }
            `}</style>

            {!isLoading && arcadeResults.length > 0 && !resultError && (
              <div className="mt-4 flex justify-center items-center text-sm text-gray-500">
                共找到 {arcadeResults.length} 个机厅
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
