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
      className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100"
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
          className="grid grid-cols-1 md:grid-cols-12 gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="md:col-span-6 lg:col-span-5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">搜索名称</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={e => onSearchTermChange(e.target.value)}
                placeholder="输入收藏品名称..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white outline-none"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {activeTab === "trophy" && (
            <div className="md:col-span-3 lg:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">颜色筛选</label>
              <select
                value={searchColor}
                onChange={e => onSearchColorChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white outline-none appearance-none cursor-pointer"
              >
                {colorOptions.map(color => (
                  <option key={color} value={color}>
                    {color === "" ? "全部颜色" : color}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={`${activeTab === "trophy" ? "md:col-span-3 lg:col-span-3" : "md:col-span-6 lg:col-span-5"}`}>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">分类筛选</label>
            <select
              value={searchGenre}
              onChange={e => onSearchGenreChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white outline-none appearance-none cursor-pointer"
            >
              <option value="">全部类型</option>
              {activeGenreOptions.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          
           <div className={`flex items-end ${activeTab === "trophy" ? "md:col-span-12 lg:col-span-2" : "md:col-span-12 lg:col-span-2"}`}>
              <motion.button
              type="submit"
              disabled={isSearching}
              className="w-full py-3 bg-pink-600 text-white rounded-xl font-bold shadow-md hover:bg-pink-700 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>搜索...</span>
                </>
              ) : (
                <span>应用筛选</span>
              )}
            </motion.button>
           </div>
        </motion.div>
      </motion.form>
    </motion.div>
  )
}
