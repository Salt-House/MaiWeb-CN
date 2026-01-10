"use client"

import CollectionItemSkeleton from "./components/CollectionItemSkeleton"
import SvgStrokedText from "@/components/ui/SvgStrokedText"
import { motion, AnimatePresence } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import { NamePlate, MaiBackGround, Icon, Trophie, Condition } from "@/types/collection"
import TabNavigation from "./components/TabNavigation"
import SearchForm from "./components/SearchForm"
import RenderItem from "./components/RenderItem"
import LoadMoreButton from "./components/LoadMoreButton"
import PreviewModal from "./components/PreviewModal"
import { CONFIG } from "@/config/api"

const baseUrl = CONFIG.ASSETS.MAIMAI.BASE

// 统一的数据获取函数
const fetchData = async (url: string) => {
  const myHeaders = new Headers()
  myHeaders.append("Accept", "application/json")

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: myHeaders,
    })
    const text = await response.text()
    return JSON.parse(text)
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    return []
  }
}

/**
 * 收藏品展示页面
 * 包含头像、背景、名牌、奖杯的展示、搜索和预览功能
 */
export default function CollectionPage() {
  const [namePlates, setNamePlates] = useState<NamePlate[]>([])
  const [MaiBackGround, setMaiBackGround] = useState<MaiBackGround[]>([])
  const [Icons, setIcons] = useState<Icon[]>([])
  const [Trophies, setTrophies] = useState<Trophie[]>([])
  const [activeTab, setActiveTab] = useState<string>("icon")
  const [activeGenreOptions, setActiveGenreOptions] = useState<string[]>([""])
  const [condition, setCondition] = useState<Condition>()
  const [conditionLoading, setConditionLoading] = useState<boolean>(true)

  // 搜索相关状态
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchColor, setSearchColor] = useState<string>("")
  const [searchGenre, setSearchGenre] = useState<string>("")
  const [isSearching, setIsSearching] = useState<boolean>(false)

  // 分页相关状态
  const currentPageRef = useRef<Record<string, number>>({
    icon: 1,
    frame: 1,
    nameplate: 1,
    trophy: 1,
  })
  const [hasMore, setHasMore] = useState<Record<string, boolean>>({
    icon: true,
    frame: true,
    nameplate: true,
    trophy: true,
  })
  const pageSize = 30

  // 颜色选项
  const colorOptions = ["", "Normal", "Bronze", "Gold", "Silver", "Rainbow"]

  //搜索选项
  const [trophyGenreOptions, setTtrophyGenreOptions] = useState<string[]>([""])
  const [nameplateGenreOptions, setNameplateGenreOptions] = useState<string[]>([""])
  const [frameGenreOptions, setFrameGenreOptions] = useState<string[]>([""])
  const [iconGenreOptions, setIconGenreOptions] = useState<string[]>([""])

  const [previewImage, setPreviewImage] = useState<{
    url: string
    name: string
    type: string
    collection_id?: string
  } | null>(null)

  // 获取条件 "icon", "frame", "plate", "trophy"
  const GetCondition = (type: string, id: string) => {
    setConditionLoading(true)
    const requestOptions = {
      method: "GET",
    }
    const collection_id = (id as string | number).toString().padStart(6, "0")

    fetch(
      `${CONFIG.API.ENDPOINTS.EMAIL}/condition?type=${type}&colletion_id=${collection_id}`,
      requestOptions
    )
      .then(response => response.text())
      .then(result => {
        if (result) {
          const data = JSON.parse(result)
          setCondition({
            category: data.category,
            condition: data.condition,
            condition_CN: data.condition_CN,
          })
        } else {
          setCondition(undefined)
        }
        setConditionLoading(false)
      })
      .catch(error => console.log("error", error))
  }

  // 打开图片预览
  const openImagePreview = (item: any, type: string) => {
    let imageUrl = ""
    switch (type) {
      case "frame":
        imageUrl = `${CONFIG.ASSETS.STATIC}/UI_Frame_${item.collection_id}.png`
        break
      case "nameplate":
      case "plate":
        imageUrl = `${CONFIG.ASSETS.STATIC}/UI_Plate_${item.collection_id}.png`
        break
      case "icon":
        imageUrl = `${baseUrl}/${type}/${item.collection_id}.png`
        break
      case "trophy":
        switch (item.color) {
          case "Normal":
            imageUrl = "/img/trophy/UI_CMN_Shougou_Normal.png"
            break
          case "Bronze":
            imageUrl = "/img/trophy/UI_CMN_Shougou_Bronze.png"
            break
          case "Silver":
            imageUrl = "/img/trophy/UI_CMN_Shougou_Silver.png"
            break
          case "Gold":
            imageUrl = "/img/trophy/UI_CMN_Shougou_Gold.png"
            break
          case "Rainbow":
            imageUrl = "/img/trophy/UI_CMN_Shougou_Rainbow.png"
            break
        }
        break
    }

    setPreviewImage({
      url: imageUrl,
      name: item.name,
      type: type,
      collection_id: item.collection_id,
    })
  }

  // 关闭图片预览
  const closeImagePreview = () => {
    setPreviewImage(null)
  }

  // 加载数据函数
  const loadData = useCallback(
    async (type: string, searchParams: Record<string, string> = {}, append: boolean = false) => {
      setIsSearching(true)
      let setter

      // 构建查询参数
      const queryParams = new URLSearchParams()
      queryParams.append("type", type)
      queryParams.append("page", append ? (currentPageRef.current[type] + 1).toString() : "1")
      queryParams.append("page_size", pageSize.toString())

      // 添加搜索参数
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      // 根据类型确定端点和设置器
      switch (type) {
        case "icon":
          setter = setIcons
          break
        case "frame":
          setter = setMaiBackGround
          break
        case "nameplate":
          setter = setNamePlates
          break
        case "trophy":
          setter = setTrophies
          break
      }

      // 获取数据
      try {
        const apiUrl = `${CONFIG.API.ENDPOINTS.EMAIL}/list?${queryParams.toString()}`
        console.log("API请求URL:", apiUrl)

        const data = await fetchData(apiUrl)

        if (setter) {
          // 如果是加载更多，则追加数据，否则替换数据
          if (append) {
            // 根据不同的数据类型选择正确的状态更新方法
            switch (type) {
              case "icon":
                setIcons(prev => [...prev, ...data.collections])
                break
              case "frame":
                setMaiBackGround(prev => [...prev, ...data.collections])
                break
              case "nameplate":
                setNamePlates(prev => [...prev, ...data.collections])
                break
              case "trophy":
                setTrophies(prev => [...prev, ...data.collections])
                break
            }

            // 更新页码
            currentPageRef.current[type] += 1

            // 检查是否还有更多数据
            setHasMore(prev => ({
              ...prev,
              [type]: (data.collections?.length || 0) === pageSize,
            }))
          } else {
            // 直接替换数据
            setter(data.collections || [])

            // 重置页码
            currentPageRef.current[type] = 1

            // 检查是否还有更多数据
            setHasMore(prev => ({
              ...prev,
              [type]: (data.collections?.length || 0) === pageSize,
            }))
          }
        } else {
          console.error(`No setter found for type: ${type}`)
        }
      } catch (error) {
        console.error(`Error loading ${type}:`, error)
      } finally {
        setIsSearching(false)
      }
    },
    [pageSize]
  )

  // 加载更多数据
  const loadMore = (type: string) => {
    loadData(
      type,
      {
        keywords: searchTerm,
        color: searchColor,
        genre: searchGenre,
      },
      true
    )
  }

  const loadOptions = async () => {
    const trophyData = await fetchData(`${CONFIG.API.ENDPOINTS.EMAIL}/options?type=trophies`)
    const nameplateData = await fetchData(`${CONFIG.API.ENDPOINTS.EMAIL}/options?type=plate`)
    const frameData = await fetchData(`${CONFIG.API.ENDPOINTS.EMAIL}/options?type=frames`)
    const iconData = await fetchData(`${CONFIG.API.ENDPOINTS.EMAIL}/options?type=icon`)
    setTtrophyGenreOptions(trophyData.options)
    setNameplateGenreOptions(nameplateData.options)
    setFrameGenreOptions(frameData.options)
    setIconGenreOptions(iconData.options)
  }

  // 刷新数据
  const refreshData = useCallback(
    (type: string) => {
      // 重置搜索条件
      setSearchTerm("")
      setSearchColor("")
      setSearchGenre("")

      // 加载第一页数据
      loadData(type)
    },
    [loadData]
  )

  // 初始加载
  useEffect(() => {
    loadOptions()
  }, [])

  useEffect(() => {
    refreshData(activeTab)
    switch (activeTab) {
      case "icon":
        setActiveGenreOptions(iconGenreOptions)
        break
      case "frame":
        setActiveGenreOptions(frameGenreOptions)
        break
      case "nameplate":
        setActiveGenreOptions(nameplateGenreOptions)
        break
      case "trophy":
        setActiveGenreOptions(trophyGenreOptions)
        break
    }
  }, [
    activeTab,
    iconGenreOptions,
    frameGenreOptions,
    nameplateGenreOptions,
    trophyGenreOptions,
    refreshData,
  ])

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    // 阻止表单默认提交行为，防止页面刷新
    e.preventDefault()

    // 调用loadData函数，传递当前活动标签和搜索参数
    loadData(activeTab, {
      keywords: searchTerm, // 从状态中获取的搜索关键词
      color: searchColor, // 从状态中获取的颜色筛选条件（仅对奖杯有效）
      genre: searchGenre, // 从状态中获取的区域筛选条件（仅对名牌和背景有效）
    })
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
            <SvgStrokedText text="收藏品展示" height={100} strokeColor={"#ec4899"} strokeWidth={10} />
            <p className="mt-2 text-gray-500 font-medium">探索与收集你的 Maimai 游戏藏品</p>
        </div>

        {/* Tab导航 */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={tab => {
            setActiveTab(tab)
            loadData(tab)
          }}
        />

        {/* 搜索区域 */}
        <SearchForm
          activeTab={activeTab}
          searchTerm={searchTerm}
          searchColor={searchColor}
          searchGenre={searchGenre}
          isSearching={isSearching}
          colorOptions={colorOptions}
          activeGenreOptions={activeGenreOptions}
          onSearchTermChange={setSearchTerm}
          onSearchColorChange={setSearchColor}
          onSearchGenreChange={setSearchGenre}
          onSearch={handleSearch}
        />

        {/* 内容区域 */}
        <motion.div
          className="min-h-[500px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === "icon" && (
              <motion.div
                key="icon"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-8 px-2">
                  <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-pink-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-gray-800">玩家头像</h2>
                  </div>
                  <span className="text-sm font-medium text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100">
                    Total: {Icons.length}
                  </span>
                </div>

                {Icons.length === 0 ? (
                  <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {Array.from({ length: 18 }).map((_, i) => (
                      <CollectionItemSkeleton key={i} type="icon" />
                    ))}
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, staggerChildren: 0.03 }}
                    >
                      {Icons.map((item, index) => (
                        <motion.div
                          key={item.collection_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          <RenderItem
                            item={item}
                            type="icon"
                            openImagePreview={openImagePreview}
                            GetCondition={GetCondition}
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* 加载更多按钮 */}
                    {hasMore.icon && (
                      <LoadMoreButton loadMore={() => loadMore("icon")} isSearching={isSearching} />
                    )}
                  </>
                )}
              </motion.div>
            )}
            {activeTab === "frame" && (
              <motion.div
                key="frame"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-8 px-2">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-gray-800">游戏背景</h2>
                  </div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                    Total: {MaiBackGround.length}
                  </span>
                </div>
                {MaiBackGround.length === 0 ? (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {Array.from({ length: 8 }).map((_, i) => (
                      <CollectionItemSkeleton key={i} type="frame" />
                    ))}
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, staggerChildren: 0.03 }}
                    >
                      {MaiBackGround.map((item, index) => (
                        <motion.div
                          key={item.collection_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          <RenderItem
                            item={item}
                            type="frame"
                            openImagePreview={openImagePreview}
                            GetCondition={GetCondition}
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* 加载更多按钮 */}
                    {hasMore.frame && (
                      <LoadMoreButton
                        loadMore={() => loadMore("frame")}
                        isSearching={isSearching}
                      />
                    )}
                  </>
                )}
              </motion.div>
            )}
            {activeTab === "nameplate" && (
              <motion.div
                key="nameplate"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-8 px-2">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-gray-800">玩家名牌</h2>
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-4 py-1.5 rounded-full border border-green-100">
                    Total: {namePlates.length}
                  </span>
                </div>
                {namePlates.length === 0 ? (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <CollectionItemSkeleton key={i} type="plate" />
                    ))}
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, staggerChildren: 0.03 }}
                    >
                      {namePlates.map((item, index) => (
                        <motion.div
                          key={item.collection_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          <RenderItem
                            item={item}
                            type="plate"
                            openImagePreview={openImagePreview}
                            GetCondition={GetCondition}
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* 加载更多按钮 */}
                    {hasMore.nameplate && (
                      <LoadMoreButton
                        loadMore={() => loadMore("nameplate")}
                        isSearching={isSearching}
                      />
                    )}
                  </>
                )}
              </motion.div>
            )}

            {activeTab === "trophy" && (
              <motion.div
                key="trophy"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-8 px-2">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-yellow-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-gray-800">游戏奖杯</h2>
                  </div>
                  <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-4 py-1.5 rounded-full border border-yellow-100">
                    Total: {Trophies.length}
                  </span>
                </div>
                {Trophies.length === 0 ? (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {Array.from({ length: 9 }).map((_, i) => (
                      <CollectionItemSkeleton key={i} type="trophy" />
                    ))}
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, staggerChildren: 0.03 }}
                    >
                      {Trophies.map((item, index) => (
                        <motion.div
                          key={item.collection_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          <RenderItem
                            item={item}
                            type="trophy"
                            openImagePreview={openImagePreview}
                            GetCondition={GetCondition}
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* 加载更多按钮 */}
                    {hasMore.trophy && (
                      <LoadMoreButton
                        loadMore={() => loadMore("trophy")}
                        isSearching={isSearching}
                      />
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <PreviewModal
        previewImage={previewImage}
        condition={condition}
        conditionLoading={conditionLoading}
        onClose={closeImagePreview}
      />
    </div>
  )
}
