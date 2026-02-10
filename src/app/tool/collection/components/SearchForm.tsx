"use client"

import { motion } from "framer-motion"
import { FormEvent } from "react"

interface SearchFormProps {
  activeTab: string
  searchTerm: string
  searchColor: string
  searchGenre: string
  isSearching: boolean
  colorOptions: string[]
  activeGenreOptions: string[]
  onSearchTermChange: (term: string) => void
  onSearchColorChange: (color: string) => void
  onSearchGenreChange: (genre: string) => void
  onSearch: (e: FormEvent) => void
}

/**
 * 搜索表单组件
 * 提供对收藏品的筛选和搜索功能
 * 支持按名称、颜色（仅奖杯）和分类进行筛选
 *
 * @param props - 搜索表单相关的状态和函数
 */
export default function SearchForm({
  activeTab,
  searchTerm,
  searchColor,
  searchGenre,
  isSearching,
  colorOptions,
  activeGenreOptions,
  onSearchTermChange,
  onSearchColorChange,
  onSearchGenreChange,
  onSearch,
}: SearchFormProps) {
  return (
    <motion.div
      className="mb-8 bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-gray-100/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <motion.form
        onSubmit={onSearch}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* 名称搜索 */}
          <div className="md:col-span-5 lg:col-span-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
              搜索名称
            </label>
            <div className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={e => onSearchTermChange(e.target.value)}
                placeholder="输入收藏品名称..."
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all duration-300 bg-gray-50/50 hover:bg-white outline-none text-sm font-medium"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 group-hover:text-pink-500 transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* 颜色筛选 (仅奖杯) */}
          {activeTab === "trophy" && (
            <div className="md:col-span-3 lg:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                颜色筛选
              </label>
              <div className="relative">
                <select
                  value={searchColor}
                  onChange={e => onSearchColorChange(e.target.value)}
                  className="w-full pl-4 pr-10 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all duration-300 bg-gray-50/50 hover:bg-white outline-none appearance-none cursor-pointer text-sm font-medium"
                >
                  {colorOptions.map(color => (
                    <option key={color} value={color}>
                      {color === "" ? "全部颜色" : color}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* 分类筛选 */}
          <div
            className={`${
              activeTab === "trophy" ? "md:col-span-4 lg:col-span-3" : "md:col-span-5 lg:col-span-4"
            }`}
          >
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
              分类筛选
            </label>
            <div className="relative">
              <select
                value={searchGenre}
                onChange={e => onSearchGenreChange(e.target.value)}
                className="w-full pl-4 pr-10 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all duration-300 bg-gray-50/50 hover:bg-white outline-none appearance-none cursor-pointer text-sm font-medium"
              >
                <option value="">全部类型</option>
                {activeGenreOptions.map(genre => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* 搜索按钮 */}
          <div
            className={`flex items-end ${
              activeTab === "trophy" ? "md:col-span-12 lg:col-span-2" : "md:col-span-2 lg:col-span-4"
            }`}
          >
            <motion.button
              type="submit"
              disabled={isSearching}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-pink-500/30 disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>搜索中</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>筛选</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.form>
    </motion.div>
  )
}
