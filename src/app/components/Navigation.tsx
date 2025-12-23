"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CONFIG } from "@/config/api"
import { FaBars, FaTimes } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"

import Image from "next/image"

interface MobileNavigationProps {
  textstroke: React.CSSProperties
}

export default function MobileNavigation({ textstroke }: MobileNavigationProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [userIconId, setUserIconId] = useState<string>("1") // 默认头像ID

  // 获取用户token和头像信息
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)

      // 获取用户信息
      const myHeaders = new Headers()
      myHeaders.append("Authorization", `Bearer ${storedToken}`)

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      }

      fetch(`${CONFIG.API.ENDPOINTS.API}/user/me`, requestOptions)
        .then(response => response.text())
        .then(result => {
          try {
            const data = JSON.parse(result)
            if (data.mai_icon_id) {
              setUserIconId(data.mai_icon_id)
            }
          } catch (error) {
            console.error("获取用户信息失败:", error)
          }
        })
        .catch(error => console.error(error))
    }
  }, [])

  // 头像URL
  const baseUrl = `${CONFIG.ASSETS.BASE}/maimai`
  const avatarUrl = `${baseUrl}/icon/${userIconId}.png`
  const defaultAvatarUrl = `${baseUrl}/icon/1.png`

  return (
    <div className="relative">
      {/* Top Container Back */}
      <div className="absolute inset-0 z-[-1] flex justify-center">
        <div className="max-sm:w-full w-[900px] h-[500px] bg-[url('/img/aurora.png')] bg-no-repeat bg-contain"></div>
      </div>

      {/* 导航栏 */}
      <motion.div
        className="relative z-[10] max-sm:w-[90%] max-sm:text-xl max-sm:h-14 w-[90%] max-w-[800px] bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 mx-auto mt-10 flex items-center justify-between sm:justify-center border-2 border-pink-200 hover:border-pink-300 transition-all duration-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(236, 72, 153, 0.25)" }}
      >
        {/* 桌面端导航链接 */}
        <div className="hidden sm:flex items-center max-sm:space-x-3 space-x-4 justify-center text-2xl text-white font-bold">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              id="music"
              href={"/music"}
              className="hover:scale-125 transition-all duration-300 ease-in-out text-pink-500 hover:text-pink-600"
              style={textstroke}
            >
              音乐
            </Link>
          </motion.div>
          <div className="text-pink-300">|</div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              id="region"
              href={"/region"}
              className="hover:scale-125 transition-all duration-300 ease-in-out text-pink-500 hover:text-pink-600"
              style={textstroke}
            >
              区域
            </Link>
          </motion.div>
          <div className="text-pink-300">|</div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              id="tool"
              href={"/tool"}
              className="hover:scale-125 transition-all duration-300 ease-in-out text-pink-500 hover:text-pink-600"
              style={textstroke}
            >
              工具
            </Link>
          </motion.div>
          <div className="text-pink-300">|</div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              id="qa"
              href={"/qa"}
              className="hover:scale-125 transition-all duration-300 ease-in-out text-pink-500 hover:text-pink-600"
              style={textstroke}
            >
              常见问题
            </Link>
          </motion.div>
          <div className="text-pink-300">|</div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              id="blog"
              href={"/blog"}
              className="hover:scale-125 transition-all duration-300 ease-in-out text-pink-500 hover:text-pink-600"
              style={textstroke}
            >
              更新日志
            </Link>
          </motion.div>
          {/* <div>|</div> */}
          {/* <Link id="guide" href={"/guide"} className="hover:scale-125 transition-all duration-300 ease-in-out text-pink-500" style={textstroke}>教学</Link> */}
        </div>

        {/* 移动端汉堡菜单按钮 */}
        <div className="sm:hidden flex items-center">
          <motion.button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-pink-500 text-2xl p-2 rounded-lg hover:bg-pink-50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: showMobileMenu ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {showMobileMenu ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>

        {/* 移动端右侧用户头像 */}
        <div className="sm:hidden">
          <Link href="/user/profile">
            <motion.div
              className="w-8 h-8 rounded-lg overflow-hidden border-2 border-pink-300 shadow-md hover:border-pink-400 transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Image
                src={token ? avatarUrl : defaultAvatarUrl}
                alt="用户头像"
                fill
                sizes="32px"
                className="object-cover"
                onError={e => {
                  // 如果加载失败，使用默认头像
                  ;(e.target as HTMLImageElement).src = defaultAvatarUrl
                }}
              />
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* 移动端下拉菜单 */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="sm:hidden absolute z-20 w-[90%] max-w-[410px] mx-auto left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border-2 border-pink-200"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex flex-col">
              <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={"/"}
                  className="block p-4 text-pink-500 font-bold border-b border-pink-100 hover:bg-pink-50 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  主页
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={"/music"}
                  className="block p-4 text-pink-500 font-bold border-b border-pink-100 hover:bg-pink-50 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  音乐
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={"/region"}
                  className="block p-4 text-pink-500 font-bold border-b border-pink-100 hover:bg-pink-50 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  区域
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={"/tool"}
                  className="block p-4 text-pink-500 font-bold border-b border-pink-100 hover:bg-pink-50 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  工具
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={"/qa"}
                  className="block p-4 text-pink-500 font-bold hover:bg-pink-50 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  常见问题
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={"/blog"}
                  className="block p-4 text-pink-500 font-bold hover:bg-pink-50 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  更新日志
                </Link>
              </motion.div>
              {/*<Link*/}
              {/*  href={"/guide"}*/}
              {/*  className="p-4 text-pink-500 font-bold hover:bg-pink-50"*/}
              {/*  onClick={() => setShowMobileMenu(false)}*/}
              {/*>*/}
              {/*  教学*/}
              {/*</Link>*/}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
