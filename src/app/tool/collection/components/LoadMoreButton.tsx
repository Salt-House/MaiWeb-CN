'use client'

import { motion } from 'framer-motion'

interface LoadMoreButtonProps {
    loadMore: () => void
    isSearching: boolean
}

/**
 * 加载更多按钮组件
 * @param loadMore - 加载更多数据的函数
 * @param isSearching - 是否正在搜索状态
 */
export default function LoadMoreButton({ loadMore, isSearching }: LoadMoreButtonProps) {
    return (
        <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <motion.button
                onClick={loadMore}
                disabled={isSearching}
                className="px-8 py-3 bg-purple-600 text-white rounded-xl font-medium shadow-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
            >
                {isSearching ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>加载中...</span>
                    </div>
                ) : (
                    '加载更多'
                )}
            </motion.button>
        </motion.div>
    )
}