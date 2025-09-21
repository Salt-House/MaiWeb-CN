'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTools, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaSearch, FaFilter, FaStar, FaMusic, FaUsers } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import PageTransitionWrapper from "../components/PageTransitionWrapper";
import ErrorBoundary from "../components/ErrorBoundary";

export interface AreaCharacters {
  name: string;
  illustrator: string;
  description1: string;
  description2: string;
  team: string;
  props: any;
}

export interface AreaSong {
  song_id?: string;
  title: string;
  artist: string;
  description: string;
  illustrator: string;
  movie: string;
}

export interface Area {
  aid: number;
  area_id: string;
  name: string;
  comment: string;
  description: string;
  video_id: string;
  characters: string; // This will be a JSON string that needs to be parsed
  songs: string; // This will be a JSON string that needs to be parsed
}

export default function RegionPage() {
  const [lang, setLang] = useState("zh");
  const [page, setPage] = useState(1);
  const [page_size, setPageSize] = useState(100);
  const [areas, setAreas] = useState<Area[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});
  const [expandedCharacter, setExpandedCharacter] = useState<{ [key: string]: boolean }>({});
  const [expandedSong, setExpandedSong] = useState<{ [key: string]: boolean }>({});
  const [checkAreaData, setCheckAreaData] = useState<boolean>(false);
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const textstroke = {
    textShadow: '-1px -1px 3px rgba(236, 72, 153, 0.8), 1px -1px 3px rgba(236, 72, 153, 0.8), -1px 1px 3px rgba(236, 72, 153, 0.8), 1px 1px 3px rgba(236, 72, 153, 0.8)'
  };

  /**
   * 根据区域ID中最后一个数字进行分组，并按数字大小排序
   * @param areas 区域数组
   * @returns 分组后的区域对象
   */
  const groupAreasByPrefix = (areas: Area[]) => {
    const groups: { [key: string]: Area[] } = {};
    
    areas.forEach(area => {
      // 提取ID中除最后一个数字部分的字符串作为分组键
      const matches = area.area_id.match(/^(.+?)(\d+)$/);
      const prefix = matches ? matches[1] : area.area_id;
      
      if (!groups[prefix]) {
        groups[prefix] = [];
      }
      groups[prefix].push(area);
    });
    
    // 对每个分组内的区域按照ID中最后一个数字从小到大排序
    Object.keys(groups).forEach(groupKey => {
      groups[groupKey].sort((a, b) => {
        const aMatches = a.area_id.match(/^(.+?)(\d+)$/);
        const bMatches = b.area_id.match(/^(.+?)(\d+)$/);
        
        const aNum = aMatches ? parseInt(aMatches[2], 10) : 0;
        const bNum = bMatches ? parseInt(bMatches[2], 10) : 0;
        
        return aNum - bNum;
      });
    });
    
    return groups;
  };

  /**
   * 切换分组的展开/收起状态
   * @param groupKey 分组键
   */
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  /**
   * 搜索过滤功能
   * @param term 搜索词
   */
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredAreas(areas);
      return;
    }
    
    const filtered = areas.filter(area => 
      area.name.toLowerCase().includes(term.toLowerCase()) ||
      area.area_id.toLowerCase().includes(term.toLowerCase()) ||
      area.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredAreas(filtered);
  };

  /**
   * 切换搜索框显示状态
   */
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchTerm("");
      setFilteredAreas(areas);
    }
  };

  const GetArea = (lang: string, page: number, page_size: number) => {
    setIsLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    
    fetch(`https://dev.maimai.moe/email/area/list?language=${lang}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((result) => {
        try {
          const temp = JSON.parse(result);
          if (temp && temp.list && Array.isArray(temp.list)) {
            setAreas(temp.list);
            setFilteredAreas(temp.list);
            // 确保在客户端环境中使用localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('area_data', JSON.stringify(temp));
            }
          } else {
            console.error('Invalid data format received:', temp);
            setAreas([]);
            setFilteredAreas([]);
          }
        } catch (parseError) {
          console.error('Failed to parse response:', parseError);
          setAreas([]);
          setFilteredAreas([]);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch area data:', error);
        setAreas([]);
        setFilteredAreas([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const CheckAreaData = () => {
    // 检查是否在客户端环境
    if (typeof window === 'undefined') {
      return true; // 服务端渲染时总是需要获取数据
    }
    
    const storedData = localStorage.getItem('area_data');
    if (!storedData || storedData === '[]' || storedData === '""') {
      return true; // 需要获取数据
    }
    try {
      const parsedData = JSON.parse(storedData);
      if (parsedData.length <= 12) {
        return true;
      }
      return Array.isArray(parsedData) && parsedData.length === 0;
    } catch (error) {
      console.error("解析缓存的区域数据时出错:", error);
      return true; // 解析错误，需要重新获取数据
    }
  }

  useEffect(() => {
    // const shouldFetchData = CheckAreaData();
    const shouldFetchData = true
    //   todo 12.1移除该注释
    if (shouldFetchData) {
      GetArea(lang, page, page_size);
    } else {
      // 确保在客户端环境中执行
      if (typeof window !== 'undefined') {
        try {
          const storedData = localStorage.getItem('area_data');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            // 检查是否已经是数组格式
            if (Array.isArray(parsedData)) {
              setAreas(parsedData);
            } else {
              // 可能存储的是JSON字符串的字符串
              setAreas(JSON.parse(parsedData));
            }
          }
        } catch (error) {
          console.error("解析存储的区域数据时出错:", error);
          GetArea(lang, page, page_size); // 出错时重新获取数据
        }
      }
    }
  }, [lang, page, page_size]);

  // 数据加载后的日志记录和初始化分组展开状态
  useEffect(() => {
    if (areas && areas.length > 0) {
      console.log("区域数据已加载:", areas.length);
      setFilteredAreas(areas);
      
      // 初始化所有分组为展开状态
      const groups = groupAreasByPrefix(areas);
      const initialExpandedState: { [key: string]: boolean } = {};
      Object.keys(groups).forEach(groupKey => {
        initialExpandedState[groupKey] = true;
      });
      setExpandedGroups(initialExpandedState);
    }
  }, [areas])

  // 处理搜索功能
  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, areas])

  return (
    <ErrorBoundary>
      <motion.div 
        className="min-h-screen relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* 背景装饰元素 - 优化版 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-20 -right-20 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          {/* 新增装饰元素 */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100/15 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.1, 1],
              translateX: [0, 20, 0],
              translateY: [0, -15, 0]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center p-6 max-sm:p-4">
          {/* 头部区域 - 重新设计 */}
          <motion.div 
            className="w-full max-w-6xl mb-8 px-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col items-center space-y-6 md:space-y-8">

              {/* 搜索和统计信息 - 重新设计 */}
              <motion.div 
                className="flex flex-col items-center gap-4 w-full max-w-2xl"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {/* 搜索区域 */}
                <div className="flex items-center gap-3 w-full">
                  <motion.button
                    onClick={toggleSearch}
                    className="flex-1 flex items-center justify-between gap-3 px-6 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-pink-200/50 transition-all duration-300 group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <FaSearch className="text-pink-500 text-lg" />
                      <span className="text-gray-700 font-medium">搜索区域...</span>
                    </div>
                    <div className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-500 font-mono">
                      ⌘K
                    </div>
                  </motion.button>
                </div>

                {/* 统计信息卡片 */}
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-100 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="text-pink-400" />
                      <span className="text-sm font-medium">总计区域</span>
                    </div>
                    <div className="text-2xl font-bold text-pink-600 mt-1">{areas.length}</div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMusic className="text-purple-400" />
                      <span className="text-sm font-medium">分组数量</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mt-1">
                      {Object.keys(groupAreasByPrefix(areas)).length}
                    </div>
                  </div>
                  
                  {searchTerm && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaFilter className="text-blue-400" />
                        <span className="text-sm font-medium">搜索结果</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mt-1">{filteredAreas.length}</div>
                    </div>
                  )}
                </motion.div>
              </motion.div>

              {/* 搜索框 */}
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    className="w-full max-w-2xl"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="输入区域名称、ID或描述..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-6 py-4 pl-12 bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-gray-700 placeholder-gray-400 text-base"
                        autoFocus
                      />
                      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 text-lg" />
                      {searchTerm && (
                        <motion.button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ✕
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* 主内容区域 */}
          {isLoading ? (
            <motion.div 
              className="flex flex-col items-center justify-center w-full py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="relative w-20 h-20 mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 rounded-full border-4 border-pink-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent"></div>
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold text-gray-700 mb-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                正在加载区域数据
              </motion.h3>
              <p className="text-gray-500">请稍候，正在为您准备精彩内容...</p>
            </motion.div>
          ) : filteredAreas.length === 0 ? (
            <motion.div 
              className="flex flex-col items-center justify-center w-full py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm ? "未找到匹配的区域" : "暂无区域数据"}
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                {searchTerm 
                  ? `没有找到包含 "${searchTerm}" 的区域，请尝试其他关键词`
                  : "区域数据正在准备中，请稍后再试"
                }
              </p>
              {searchTerm && (
                <motion.button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  清除搜索
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              className="w-full max-w-6xl space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {Object.entries(groupAreasByPrefix(filteredAreas))
                .sort(([, aAreas], [, bAreas]) => bAreas.length - aAreas.length)
                .map(([groupKey, groupAreas], groupIndex) => (
                <motion.div 
                  key={groupKey} 
                  className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-500 group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
                  whileHover={{ y: -5, scale: 1.005 }}
                >
                  {/* 分组标题 - 重新设计 */}
                  <motion.div 
                    className="flex items-center justify-between cursor-pointer mb-5 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 transition-all duration-300"
                    onClick={() => toggleGroup(groupKey)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-4 flex-wrap">
                      <motion.div
                        className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex-shrink-0"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent break-words">
                          {groupKey || '其他'}
                        </h2>
                        <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-pink-700 border border-pink-200 shadow-sm">
                          {groupAreas.length} 个区域
                        </span>
                      </div>
                    </div>
                    <motion.div 
                      className="text-gray-500 text-xl flex-shrink-0 transition-colors duration-300 group-hover:text-pink-500"
                      animate={{ rotate: expandedGroups[groupKey] ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChevronDown />
                    </motion.div>
                  </motion.div>
                  
                  {/* 分组内容 */}
                  <AnimatePresence>
                    {expandedGroups[groupKey] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <motion.div 
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          {groupAreas.map((area, areaIndex) => (
                            <motion.div
                              key={area.area_id}
                              initial={{ opacity: 0, y: 20, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ 
                                duration: 0.4, 
                                delay: areaIndex * 0.05,
                                ease: "easeOut"
                              }}
                              whileHover={{ 
                                y: -8, 
                                scale: 1.03,
                                transition: { duration: 0.2 }
                              }}
                              className="group"
                            >
                              <Link href={`/region/${area.area_id}`} className="block">
                                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-white/40 group-hover:border-pink-200 group-hover:shadow-lg">
                                  {/* 区域名称 */}
                                  <div className="relative mb-4">
                                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl p-3 text-center shadow-md">
                                      <h3 className={`text-white font-bold text-base ${area.name.length > 15 ? "animate-text-scroll-region" : ""} whitespace-nowrap overflow-hidden`}>
                                        {area.name}
                                      </h3>
                                    </div>
                                  </div>
                                  
                                  {/* 区域图片 */}
                                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100">
                                    <motion.img 
                                      src={`/img/version/${area.area_id}.png`} 
                                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" 
                                      alt={area.name}
                                      whileHover={{ rotate: [0, -2, 2, 0] }}
                                      transition={{ duration: 0.6 }}
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/img/placeholder.png';
                                      }}
                                    />
                                    
                                    {/* 悬停覆盖层 */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                                    
                                    {/* 区域ID标签 */}
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-md text-xs font-medium text-gray-600 border border-gray-200 shadow-sm">
                                      {area.area_id}
                                    </div>
                                    
                                    {/* 悬停时的查看详情提示 */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        查看详情
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* 区域描述 */}
                                  {area.description && (
                                    <div className="mt-4 p-3 bg-gray-50/80 rounded-lg border border-gray-100">
                                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                        {area.description}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>)}
         </div>

         {/* 页脚装饰 */}
         <motion.div 
           className="mt-12 text-center py-8 px-4"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.6, delay: 1 }}
         >
           <div className="flex items-center justify-center gap-3 text-gray-500 text-sm">
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="text-lg"
             >
               🎵
             </motion.div>
             <span className="text-center">继续探索舞萌DX的精彩世界</span>
             <motion.div
               animate={{ rotate: -360 }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="text-lg"
             >
               🎮
             </motion.div>
           </div>
         </motion.div>
       </motion.div>
    </ErrorBoundary>
  );
}
