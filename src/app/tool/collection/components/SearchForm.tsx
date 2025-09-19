'use client'

import { motion } from 'framer-motion'
import { FormEvent } from 'react'

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
    onSearch
}: SearchFormProps) {
    return (
        <motion.div
            className="mb-6 bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-pink-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <motion.form
                onSubmit={onSearch}
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <motion.div
                    className="flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            搜索名称
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchTermChange(e.target.value)}
                            placeholder="输入收藏品名称..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        />
                    </div>

                    {activeTab === "trophy" && (
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                颜色筛选
                            </label>
                            <select
                                value={searchColor}
                                onChange={(e) => onSearchColorChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                            >
                                {colorOptions.map((color) => (
                                    <option key={color} value={color}>
                                        {color === "" ? "全部颜色" : color}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Genre筛选
                        </label>
                        <select
                            value={searchGenre}
                            onChange={(e) => onSearchGenreChange(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        >
                            <option value="">全部类型</option>
                            {activeGenreOptions.map((genre) => (
                                <option key={genre} value={genre}>
                                    {genre}
                                </option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <motion.button
                        type="submit"
                        disabled={isSearching}
                        className="px-8 py-3 bg-pink-600 text-white rounded-lg font-medium shadow-lg hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isSearching ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>搜索中...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span>搜索</span>
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </motion.form>
        </motion.div>
    )
}