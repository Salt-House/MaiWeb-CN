'use client'

import { AnimatePresence, motion } from 'framer-motion';
import { FaCircle, FaMapMarkerAlt } from 'react-icons/fa';
import type { Arcade } from './SearchGameCenter';
import Image from 'next/image';

export interface SearchGameCenterResultsProps {
  showResults: boolean;
  isLoading: boolean;
  resultError: string;
  arcadeResults: Arcade[];
  onClose: () => void;
  formatDate: (d: string) => string;
  handleNavigation: (arcade: Arcade) => void;
}

/**
 * 机厅搜索结果列表（延迟 / 分块加载 framer-motion，减轻首屏 JS）
 */
export default function SearchGameCenterResults(props: SearchGameCenterResultsProps) {
  const { showResults, isLoading, resultError, arcadeResults, onClose, formatDate, handleNavigation } = props;
  return (
    <AnimatePresence>
      {showResults && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="max-sm:w-[90%] w-[800px] mx-auto mb-20"
        >
          <div className="bg-white rounded-2xl p-4 shadow-lg border-4 border-[rgb(113,241,229)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                机厅查询结果
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-t-4 border-r-4 border-b-4 border-[rgb(125,136,217)] animate-spin"></div>
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
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <p className="text-gray-700">{resultError}</p>
                <p className="text-sm text-gray-500 mt-2">请尝试调整搜索条件或范围</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto pr-1 arcade-results">
                {arcadeResults
                  .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
                  .map((arcade, index) => (
                    <motion.div
                      key={arcade.arcade_id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="mb-3 last:mb-0"
                    >
                      <div
                        className={`bg-gradient-to-r from-[rgb(245,242,193)]/30 to-[rgb(164,247,238)]/30 rounded-xl p-3 hover:shadow-md transition-all duration-300 border-2 border-[rgb(113,241,229)]`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <FaCircle className={`mr-2 text-xs text-green-500`} />
                              <h3 className="font-bold text-black text-lg">{arcade.arcade_name}</h3>
                            </div>

                            <div className="flex items-center text-gray-600 mt-2">
                              <FaMapMarkerAlt className="mr-1 text-[rgb(125,136,217)]" />
                              <p className="text-sm line-clamp-2">{arcade.arcade_address}</p>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2">
                              {arcade.arcade_count && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  机台数: {arcade.arcade_count}
                                </span>
                              )}
                              {arcade.arcade_cost !== null && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  单次: {arcade.arcade_cost}元
                                </span>
                              )}
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                更新: {formatDate(arcade.created_at.toString())}
                              </span>
                            </div>
                          </div>

                          <div className="ml-2 flex flex-col items-center">
                            <button
                              className="p-2 rounded-full bg-[rgb(113,241,229)] hover:bg-[rgb(113,241,229)]/70 transition-colors"
                              onClick={() => handleNavigation(arcade)}
                            >
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                              </svg>
                            </button>
                            {arcade.distance && (
                              <p className="font-bold mt-1">{(arcade.distance / 1000).toFixed(2)} km</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}

            {!isLoading && arcadeResults.length > 0 && !resultError && (
              <div className="mt-4 text-center text-sm text-gray-500">共找到 {arcadeResults.length} 个机厅</div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
