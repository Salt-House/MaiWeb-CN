"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { FcClock } from "react-icons/fc"
// 移除直接引入 framer-motion，结果列表改为动态组件以减小首屏 bundle
import dynamic from "next/dynamic"
import { ExceptOptions } from "type-fest/source/except"
import { motion } from "framer-motion"

// 接口定义
export interface ArcadeSearchRequest {
  lat?: number
  lng?: number
  name?: string
  page_index?: number
  page_size?: number
  range?: number
  sort?: string
  [property: string]: any
}

export interface Arcade {
  arcade_address: string
  arcade_cost: number | null
  arcade_count: number | null
  arcade_dead: boolean
  arcade_id: number
  arcade_lat: number
  arcade_lng: number
  arcade_name: string
  created_at: Date
  distance?: number
  [property: string]: any
}

const SearchGameCenter = () => {
  // 状态管理
  const key = "AA7BZ-FVT6T-ZQ5XP-VCND7-DKFYF-RKBCU"
  const [address, setAddress] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const options = ["1km", "5km", "10km"]
  const [searchGameCenter, setSearchGameCenter] = useState<ArcadeSearchRequest>({
    range: 3000,
    sort: "distance",
    page_index: 1,
    page_size: 50,
  })
  const [arcadeResults, setArcadeResults] = useState<Arcade[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [resultError, setResultError] = useState("")
  /**
   * 获取用户当前位置
   */
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("浏览器不支持地理定位")
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      position => {
        setSearchGameCenter(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }))
        setIsLoading(false)
        // alert('位置获取成功，可以开始搜索机厅');
      },
      error => {
        console.error("定位失败", error)
        setIsLoading(false)
        let errorMessage = "定位失败"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "用户拒绝了定位请求"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "位置信息不可用"
            break
          case error.TIMEOUT:
            errorMessage = "定位请求超时"
            break
        }
        // alert(errorMessage + "，请尝试手动输入地址");
      },
      {
        enableHighAccuracy: true, // 启用高精度
        timeout: 10000, // 10秒超时
        maximumAge: 0, // 不使用缓存位置
      }
    )
  }

  /**
   * 从输入地址获取位置坐标
   */
  const getLocationFromAdress = () => {
    if (!address.trim()) {
      alert("请输入地址")
      return
    }

    setIsLoading(true)
    var requestOptions = {
      method: "GET",
      redirect: "follow" as RequestRedirect,
    }

    fetch(
      `https://dev.maimai.moe/email/transfer/tencent/address2latlng?address=${address}`,
      requestOptions
    )
      .then(response => response.text())
      .then(result => {
        const data = JSON.parse(result)
        if (data.lat && data.lng) {
          setSearchGameCenter(prev => ({
            ...prev,
            lat: data.lat,
            lng: data.lng,
          }))
          // 地址解析成功后自动搜索机厅
          // 使用setTimeout确保状态更新完成后再搜索
          setTimeout(() => {
            // 创建临时的搜索参数，包含新的坐标
            const tempSearchParams = {
              ...searchGameCenter,
              lat: data.lat,
              lng: data.lng,
            }

            // 直接调用搜索API而不是GetGameCenter函数，避免状态更新延迟
            performSearch(tempSearchParams)
          }, 100)
        } else {
          alert("地址解析失败，请检查地址是否正确")
          setIsLoading(false)
        }
      })
      .catch(error => {
        console.log("error", error)
        alert("地址查询失败，请稍后重试")
        setIsLoading(false)
      })
  }

  useEffect(() => {
    getLocation()
  }, []) // 仅在组件挂载时执行一次

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  }

  /**
   * 执行机厅搜索的核心函数
   * @param searchParams 搜索参数
   */
  const performSearch = (searchParams: ArcadeSearchRequest) => {
    console.log("searchParams", searchParams)
    setIsLoading(true)
    setShowResults(true)
    setResultError("")

    var requestOptions = {
      method: "GET",
    }

    // 构建查询URL
    let baseurl = "https://dev.maimai.moe/email/search_gamecenter?"
    for (const key in searchParams) {
      if (
        searchParams[key] !== undefined &&
        searchParams[key] !== null &&
        searchParams[key] !== ""
      ) {
        baseurl += `${key}=${encodeURIComponent(searchParams[key])}&`
      }
    }
    // 移除最后的&符号
    baseurl = baseurl.slice(0, -1)

    console.log("查询URL:", baseurl)

    fetch(baseurl, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(result => {
        setIsLoading(false)
        if (result.success) {
          const arcades = result.data || []
          setArcadeResults(arcades)
          console.log("arcadeResults", arcades)
          if (arcades.length === 0) {
            setResultError("未找到符合条件的机厅，请尝试扩大搜索范围或调整搜索条件")
          }
        } else {
          setResultError(result.message || "查询失败，请稍后重试")
          setArcadeResults([])
        }
      })
      .catch(error => {
        console.error("查询机厅失败:", error)
        setIsLoading(false)
        setResultError("查询过程中出现网络错误，请检查网络连接后重试")
        setArcadeResults([])
      })
  }

  /**
   * 查询机厅（用户点击搜索按钮时调用）
   */
  const GetGameCenter = () => {
    // 检查是否有位置信息
    if (!searchGameCenter.lat || !searchGameCenter.lng) {
      // alert('请先获取位置信息或输入地址');
      return
    }

    performSearch(searchGameCenter)
  }

  const handleNavigation = (target: Arcade) => {
    const ua = navigator.userAgent.toLowerCase()
    const name = encodeURIComponent(target.arcade_name) // 编码避免中文或特殊字符问题
    let url = ""

    // TODO 兼容性：根据 UA 判断平台并提供对应 scheme（Android/IOS）；允许用户选择地图 App
    // Android：尝试打开高德地图 App
    url = `androidamap://navi?sourceApplication=yourapp&lat=${target.arcade_lat}&lon=${target.arcade_lng}&dev=0&style=2&poiname=${name}`

    // TODO 体验：回退策略建议缩短等待时间或提供提示；同时在不可见页面时避免自动跳转
    // 回退策略：5秒后跳转到高德地图网页版
    setTimeout(() => {
      window.location.href = `https://uri.amap.com/navigation?to=${target.arcade_lng},${target.arcade_lat},${name}&mode=car&policy=1`
    }, 500)

    window.location.href = url
  }

  // 移除自动触发搜索的useEffect，避免无限循环
  // 现在只有用户主动点击搜索按钮或地址解析成功后才会搜索

  // 动态引入结果组件（含 framer-motion），仅在需要显示结果时加载
  const SearchGameCenterResults = dynamic(() => import("./SearchGameCenterResults"), {
    ssr: false,
    loading: () => (
      <div className="max-sm:w-[90%] w-[800px] mx-auto mb-10 text-center text-gray-500">
        加载结果组件...
      </div>
    ),
  })

  return (
    <>
      {/* Search Game Center - 机厅搜索区域 */}
      <motion.div
        id="searchGameCenter"
        className="relative my-10 max-sm:w-[90%] w-[800px] mx-auto flex flex-col justify-center items-center rounded-2xl overflow-visible"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* 多层边框背景 - 更新为与网站风格一致的粉色系 */}
        <motion.div
          className="absolute rounded-2xl inset-x-0 inset-y-0 z-[-1] bg-gradient-to-br from-pink-50 via-white to-pink-100 border-4 border-pink-300 shadow-2xl"
          animate={{
            boxShadow: [
              "0 25px 50px -12px rgba(255, 95, 165, 0.25)",
              "0 25px 50px -12px rgba(255, 183, 206, 0.35)",
              "0 25px 50px -12px rgba(255, 95, 165, 0.25)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>

        {/* 装饰性动画元素 - 使用circle目录中的资源 */}
        <motion.div
          className="absolute -top-8 -left-8 w-16 h-16 opacity-30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Image
            src="/img/circle/star_pink.png"
            alt="装饰星星"
            width={64}
            height={64}
            className="w-full h-full"
          />
        </motion.div>

        <motion.div
          className="absolute -top-6 -right-10 w-12 h-12 opacity-40"
          animate={{
            rotate: -360,
            y: [0, -10, 0],
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Image
            src="/img/circle/star_yellow.png"
            alt="装饰星星"
            width={48}
            height={48}
            className="w-full h-full"
          />
        </motion.div>

        {/* Logo元素 (使用 next/image 以获得自动优化、懒加载与格式转换) */}
        <motion.div
          className="absolute -top-16"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            delay: 0.3,
          }}
        >
          <Image
            className="w-48 drop-shadow-lg"
            src="/img/circle/logo.png"
            alt="网站 Logo"
            width={192}
            height={192}
            priority
          />
        </motion.div>

        {/* 搜索表单 */}
        <motion.div
          className="w-full px-8 mt-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-col items-center gap-6">
            {/* 第一行：搜索范围、排序方式、获取定位 + 定位信息提示 */}
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex flex-wrap justify-center gap-6 w-full">
                {/* 搜索范围选择器 */}
                <motion.div
                  className="relative min-w-[140px] max-sm:flex-1 h-10 rounded-full overflow-hidden border-2 border-pink-300 bg-gradient-to-r from-pink-50 to-white shadow-lg"
                  whileHover={{ boxShadow: "0 10px 25px -5px rgba(255, 95, 165, 0.3)" }}
                  transition={{ duration: 0.2 }}
                >
                  <select
                    className="w-full h-9 py-1.5 px-4 appearance-none bg-transparent text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    value={searchGameCenter.range}
                    onChange={e =>
                      setSearchGameCenter(prev => ({ ...prev, range: parseInt(e.target.value) }))
                    }
                  >
                    <option value={1000}>1公里范围</option>
                    <option value={3000}>3公里范围</option>
                    <option value={5000}>5公里范围</option>
                    <option value={10000}>10公里范围</option>
                    <option value={20000}>20公里范围</option>
                  </select>
                  {/* TODO 可访问性：为选择器添加关联的 `<label>` 与 `aria-label`，增强键盘友好性 */}
                  {/* TODO 规范：移除颜色渐变（bg-gradient-to-*），替换为纯色或阴影 */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-gradient-to-r from-transparent to-pink-200">
                    <svg
                      className="h-4 w-4 text-pink-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </motion.div>

                {/* 排序方式选择器 */}
                {/* TODO 规范：移除颜色渐变（bg-gradient-to-*），保持统一的纯色主题 */}
                <motion.div
                  className="relative min-w-[140px] max-sm:flex-1 h-10 rounded-full overflow-hidden border-2 border-pink-300 bg-gradient-to-r from-pink-50 to-white shadow-lg"
                  whileHover={{ boxShadow: "0 10px 25px -5px rgba(255, 95, 165, 0.3)" }}
                  transition={{ duration: 0.2 }}
                >
                  {/* TODO 可访问性：为排序选择器添加 `<label>` 或 `aria-labelledby` */}
                  <select
                    className="w-full h-9 py-1.5 px-4 appearance-none bg-transparent text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    value={searchGameCenter.sort}
                    onChange={e => setSearchGameCenter(prev => ({ ...prev, sort: e.target.value }))}
                  >
                    <option value="distance">按距离排序</option>
                  </select>
                  {/* TODO 规范：移除颜色渐变（bg-gradient-to-*） */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-gradient-to-r from-transparent to-pink-200">
                    <svg
                      className="h-4 w-4 text-pink-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </motion.div>

                {/* 获取定位按钮 */}
                {/* TODO 性能：为定位请求添加节流/去抖；使用 GeolocationOptions（timeout、enableHighAccuracy） */}
                {/* TODO 规范：按钮配色避免使用渐变色（bg-gradient-to-*） */}
                <motion.button
                  onClick={getLocation}
                  className="flex items-center justify-center h-10 px-4 rounded-full bg-gradient-to-r from-pink-200 to-pink-300 border-2 border-pink-400 shadow-lg gap-2 max-sm:w-10 max-sm:h-10 max-sm:px-0 max-sm:gap-0"
                  title="获取我的位置"
                  whileHover={{
                    boxShadow: "0 10px 25px -5px rgba(255, 95, 165, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-pink-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-pink-700 whitespace-nowrap max-sm:hidden">
                    获取当前定位
                  </span>
                </motion.button>
              </div>

              {/* 定位信息提示 */}
              <motion.div
                className="-mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                {searchGameCenter.lat && searchGameCenter.lng ? (
                  <div className="flex items-center gap-1 text-sm text-pink-500 px-3">
                    <FcClock />
                    <span>已获取您的位置信息，可直接搜索附近机厅</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-sm text-pink-500 px-3">
                    <FcClock />
                    <span>未获取到您的位置信息</span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* 第二行：机厅名称搜索 + 搜索按钮 */}
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {/* 机厅名称搜索 */}
              <motion.div
                className="relative min-w-[250px] flex-1 max-w-[350px] max-sm:min-w-[200px]"
                transition={{ duration: 0.2 }}
              >
                {/* TODO 规范：移除颜色渐变，采用纯色背景；并添加 `<label>` 关联与 `aria-describedby` */}
                <input
                  type="text"
                  placeholder="请输入机厅名称（可选）"
                  className="w-full h-11 py-2.5 px-4 rounded-full border-2 border-pink-300 bg-gradient-to-r from-pink-50 to-white shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-gray-800 placeholder-pink-300"
                  value={searchGameCenter.name || ""}
                  onChange={e => setSearchGameCenter(prev => ({ ...prev, name: e.target.value }))}
                />
              </motion.div>

              {/* 搜索机厅按钮 */}
              <motion.div
                className="relative"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {/* TODO 规范：移除颜色渐变；将 loading spinner 改为组件以保持一致性 */}
                <motion.button
                  className="px-8 py-2.5 h-11 rounded-full bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500 text-lg font-bold text-white shadow-lg flex items-center gap-2 disabled:opacity-70 border-2 border-pink-500 max-sm:px-6 max-sm:text-base"
                  onClick={GetGameCenter}
                  disabled={isLoading}
                  whileHover={{
                    boxShadow: "0 15px 35px -5px rgba(255, 95, 165, 0.4)",
                  }}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="h-5 w-5 border-b-2 border-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      ></motion.div>
                      搜索中...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
                      搜索机厅
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>

            {/* 分隔栏 */}
            <div className="flex items-center w-full max-w-lg mx-auto max-sm:max-w-full max-sm:px-4">
              <div className="flex-1 h-px bg-pink-300"></div>
              <span className="px-4 text-sm text-pink-500 whitespace-nowrap max-sm:text-xs max-sm:px-2">
                或使用地址查询
              </span>
              <div className="flex-1 h-px bg-pink-300"></div>
            </div>

            {/* 第三行：地址搜索 + 地址查询按钮 */}
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {/* 地址搜索 */}
              <motion.div
                className="relative min-w-[250px] flex-1 max-w-[350px] max-sm:min-w-[200px]"
                transition={{ duration: 0.2 }}
              >
                <input
                  type="text"
                  placeholder="请输入地址"
                  className="w-full h-11 py-2.5 px-4 rounded-full border-2 border-pink-300 bg-gradient-to-r from-pink-50 to-white shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-gray-800 placeholder-pink-300"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </motion.div>

              {/* 地址查询按钮 */}
              <motion.div
                className="relative"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  className="px-8 py-2.5 h-11 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-lg font-bold text-white shadow-lg flex items-center gap-2 disabled:opacity-70 border-2 border-pink-600 max-sm:px-6 max-sm:text-base"
                  onClick={getLocationFromAdress}
                  disabled={isLoading || !address.trim()}
                  whileHover={{
                    boxShadow: "0 15px 35px -5px rgba(255, 95, 165, 0.4)",
                  }}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="h-5 w-5 border-b-2 border-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      ></motion.div>
                      查询中...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0z"
                        />
                      </svg>
                      地址查询
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 装饰元素 - 使用circle目录中的资源 */}
        <motion.div
          className="absolute -left-12 bottom-4 w-20 h-20 opacity-40"
          animate={{
            rotate: 360,
            x: [0, 10, 0],
            y: [0, -5, 0],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Image
            src="/img/circle/3d_cube.png"
            alt="装饰立方体"
            width={80}
            height={80}
            className="w-full h-full"
          />
        </motion.div>

        <motion.div
          className="absolute -right-12 bottom-12 w-16 h-16 opacity-50"
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
            x: [0, -8, 0],
          }}
          transition={{
            rotate: { duration: 18, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Image
            src="/img/circle/3d_glove_pink.png"
            alt="装饰手套"
            width={64}
            height={64}
            className="w-full h-full"
          />
        </motion.div>

        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-14 h-14 opacity-30"
          animate={{
            rotate: 360,
            y: [0, -15, 0],
          }}
          transition={{
            rotate: { duration: 22, repeat: Infinity, ease: "linear" },
            y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Image
            src="/img/circle/3d_stars.png"
            alt="装饰星星"
            width={56}
            height={56}
            className="w-full h-full"
          />
        </motion.div>
      </motion.div>
      {(showResults || isLoading || resultError) && (
        <SearchGameCenterResults
          showResults={showResults}
          isLoading={isLoading}
          resultError={resultError}
          arcadeResults={arcadeResults}
          onClose={() => setShowResults(false)}
          formatDate={formatDate}
          handleNavigation={handleNavigation}
        />
      )}

      {/* 背景装饰图案 */}
      <motion.div
        className="fixed inset-0 w-full h-full opacity-5 pointer-events-none z-[-2]"
        animate={{ rotate: 360 }}
        transition={{ duration: 300, repeat: Infinity, ease: "linear" }}
      >
        <Image src="/img/circle/bg_pattern.png" alt="背景装饰" fill className="object-cover" />
      </motion.div>

      {/* 自定义滚动条样式 - 更新为粉色主题 */}
      <style jsx global>{`
        .arcade-results::-webkit-scrollbar {
          width: 6px;
        }

        .arcade-results::-webkit-scrollbar-track {
          background: #fce7f3;
          border-radius: 10px;
        }

        .arcade-results::-webkit-scrollbar-thumb {
          background: #f472b6;
          border-radius: 10px;
        }

        .arcade-results::-webkit-scrollbar-thumb:hover {
          background: #ec4899;
        }
      `}</style>
    </>
  )
}

export default SearchGameCenter
