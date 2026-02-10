"use client"

import Link from "next/link"
import { CONFIG } from "@/config/api"
import { useEffect, useState, useCallback, useMemo } from "react"
import { FaChevronDown, FaMapMarkerAlt, FaSearch, FaFilter, FaMusic, FaTimes } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import ErrorBoundary from "./components/ErrorBoundary"
import Image from "next/image"

// -----------------------------------------------------------------------------
// 类型定义
// -----------------------------------------------------------------------------

/**
 * 区域角色接口
 */
export interface AreaCharacters {
  name: string
  illustrator: string
  description1: string
  description2: string
  team: string
  props: Record<string, unknown>
}

/**
 * 区域歌曲接口
 */
export interface AreaSong {
  song_id?: string
  title: string
  artist: string
  description: string
  illustrator: string
  movie: string
}

/**
 * 区域接口 (API返回的原始数据)
 */
export interface Area {
  aid: number
  area_id: string
  name: string
  comment: string
  description: string
  video_id: string
  characters: string // JSON string
  songs: string // JSON string
}

// -----------------------------------------------------------------------------
// 组件实现
// -----------------------------------------------------------------------------

/**
 * 区域列表页面组件
 * 展示所有区域，支持搜索、筛选和分组显示
 */
export default function RegionPage() {
  // 状态管理
  const [lang] = useState("zh")
  const [areas, setAreas] = useState<Area[]>([])
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([])
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * 根据区域ID中最后一个数字进行分组，并按数字大小排序
   * @param areas 区域数组
   * @returns 分组后的区域对象
   */
  const groupAreasByPrefix = useCallback((areasToGroup: Area[]) => {
    const groups: { [key: string]: Area[] } = {}

    areasToGroup.forEach(area => {
      // 提取ID中除最后一个数字部分的字符串作为分组键
      const matches = area.area_id.match(/^(.+?)(\d+)$/)
      const prefix = matches ? matches[1] : area.area_id

      if (!groups[prefix]) {
        groups[prefix] = []
      }
      groups[prefix].push(area)
    })

    // 对每个分组内的区域按照ID中最后一个数字从小到大排序
    Object.keys(groups).forEach(groupKey => {
      groups[groupKey].sort((a, b) => {
        const aMatches = a.area_id.match(/^(.+?)(\d+)$/)
        const bMatches = b.area_id.match(/^(.+?)(\d+)$/)

        const aNum = aMatches ? parseInt(aMatches[2], 10) : 0
        const bNum = bMatches ? parseInt(bMatches[2], 10) : 0

        return aNum - bNum
      })
    })

    return groups
  }, [])

  // 使用 useMemo 缓存分组结果，避免重复计算
  const groupedAreas = useMemo(() => groupAreasByPrefix(filteredAreas), [filteredAreas, groupAreasByPrefix])

  /**
   * 切换分组的展开/收起状态
   * @param groupKey 分组键
   */
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }))
  }

  /**
   * 搜索过滤功能
   * @param term 搜索词
   */
  const filterAreas = useCallback(
    (term: string) => {
      if (!term.trim()) {
        setFilteredAreas(areas)
        return
      }

      const lowerTerm = term.toLowerCase()
      const filtered = areas.filter(
        area =>
          area.name.toLowerCase().includes(lowerTerm) ||
          area.area_id.toLowerCase().includes(lowerTerm) ||
          area.description.toLowerCase().includes(lowerTerm)
      )
      setFilteredAreas(filtered)
    },
    [areas]
  )

  /**
   * 切换搜索框显示状态
   */
  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (showSearch) {
      setSearchTerm("")
      setFilteredAreas(areas)
    }
  }

  // 获取数据
  useEffect(() => {
    const fetchData = async (language: string) => {
      setIsLoading(true)
      try {
        const myHeaders = new Headers()
        myHeaders.append("Accept", "application/json")
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
        }

        const response = await fetch(
          `${CONFIG.API.ENDPOINTS.EMAIL}/area/list?language=${language}`,
          requestOptions
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.text()
        const temp = JSON.parse(result)

        if (temp && temp.list && Array.isArray(temp.list)) {
          setAreas(temp.list)
          setFilteredAreas(temp.list)
          if (typeof window !== "undefined") {
            localStorage.setItem("area_data", JSON.stringify(temp))
          }
        } else {
          console.error("Invalid data format received:", temp)
          setAreas([])
          setFilteredAreas([])
        }
      } catch (error) {
        console.error("Failed to fetch area data:", error)
        setAreas([])
        setFilteredAreas([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData(lang)
  }, [lang])

  // 数据加载后的初始化
  useEffect(() => {
    if (areas && areas.length > 0) {
      const groups = groupAreasByPrefix(areas)
      const initialExpandedState: { [key: string]: boolean } = {}
      Object.keys(groups).forEach(groupKey => {
        initialExpandedState[groupKey] = true
      })
      setExpandedGroups(initialExpandedState)
    }
  }, [areas, groupAreasByPrefix])

  // 处理搜索
  useEffect(() => {
    filterAreas(searchTerm)
  }, [searchTerm, filterAreas])

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative overflow-hidden ">
        {/* 背景装饰 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-pink-300/10 rounded-full blur-[100px]"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-purple-300/10 rounded-full blur-[100px]"
            animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
          {/* 页面头部 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 mb-4 tracking-tight">
              探索区域
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto mb-8 text-lg">
              发现舞萌DX世界中的各个精彩区域，解锁独特的角色与乐曲。
            </p>

            {/* 搜索栏 */}
            <div className="w-full max-w-2xl relative group z-20">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative bg-white rounded-2xl shadow-sm border border-pink-100 flex items-center p-2 transition-all duration-300 focus-within:shadow-md focus-within:border-pink-300">
                <FaSearch className="text-gray-400 ml-4 text-xl" />
                <input
                  type="text"
                  placeholder="搜索区域名称、ID..."
                  className="w-full px-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* 统计概览 */}
            <motion.div 
              className="flex gap-6 mt-8 text-sm font-medium text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-pink-100 shadow-sm">
                <FaMapMarkerAlt className="text-pink-400" />
                <span>{areas.length} 个区域</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-purple-100 shadow-sm">
                <FaFilter className="text-purple-400" />
                <span>{Object.keys(groupedAreas).length} 个分组</span>
              </div>
            </motion.div>
          </motion.div>

          {/* 内容区域 */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin mb-4" />
              <p className="text-gray-500 animate-pulse">正在加载数据...</p>
            </div>
          ) : filteredAreas.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">未找到匹配区域</h3>
              <p className="text-gray-500">尝试更换搜索关键词</p>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {Object.entries(groupedAreas)
                .sort(([, a], [, b]) => b.length - a.length)
                .map(([groupKey, groupAreas]) => (
                <motion.div
                  key={groupKey}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-sm overflow-hidden"
                >
                  {/* 分组标题 */}
                  <div
                    onClick={() => toggleGroup(groupKey)}
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                        {groupKey.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{groupKey || "其他"}</h2>
                        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                          {groupAreas.length} 区域
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedGroups[groupKey] ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-400"
                    >
                      <FaChevronDown />
                    </motion.div>
                  </div>

                  {/* 区域网格 */}
                  <AnimatePresence>
                    {expandedGroups[groupKey] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 pt-0">
                          {groupAreas.map((area) => (
                            <Link href={`/region/${area.area_id}`} key={area.area_id}>
                              <motion.div
                                whileHover={{ y: -5 }}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
                              >
                                {/* 图片容器 */}
                                <div className="aspect-square relative overflow-hidden bg-gray-50">
                                  <Image
                                    src={`/img/version/${area.area_id}.png`}
                                    alt={area.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    onError={(e) => {
                                      // @ts-ignore
                                      e.target.src = "/img/placeholder.png"
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <span className="text-white text-sm font-medium">查看详情 →</span>
                                  </div>
                                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-mono text-gray-600 shadow-sm">
                                    {area.area_id}
                                  </div>
                                </div>

                                {/* 内容容器 */}
                                <div className="p-5 flex-1 flex flex-col">
                                  <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1 group-hover:text-pink-600 transition-colors">
                                    {area.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                                    {area.description || "暂无描述"}
                                  </p>
                                  
                                  {/* 底部标签 */}
                                  <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                      <FaMusic className="text-pink-300" />
                                      <span>详情</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
