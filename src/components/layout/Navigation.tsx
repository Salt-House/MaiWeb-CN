"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CONFIG } from "@/config/api"
import { FaBars, FaTimes } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface NavigationProps {
  textstroke: React.CSSProperties
}

interface NavItem {
  id: string
  href: string
  label: string
}

const navItems: NavItem[] = [
  { id: "music", href: "/music", label: "音乐" },
  { id: "region", href: "/region", label: "区域" },
  { id: "tool", href: "/tool", label: "工具" },
  { id: "qa", href: "/qa", label: "常见问题" },
  { id: "blog", href: "/blog", label: "更新日志" },
]

export default function Navigation({ textstroke }: NavigationProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [userIconId, setUserIconId] = useState<string>("1") // 默认头像ID
  const pathname = usePathname()

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
    <div className="relative font-douyin">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-[-1] flex justify-center pointer-events-none">
        <motion.div 
          className="max-sm:w-full w-[900px] h-[500px] bg-[url('/img/aurora.png')] bg-no-repeat bg-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* Main Navigation Bar */}
      <motion.nav
        className="relative z-[10] max-sm:w-[90%] w-[90%] max-w-[800px] mx-auto mt-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <div className="bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-xl rounded-full px-6 py-4 flex items-center justify-between sm:justify-center border border-white/50 transition-all duration-300">
          
          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center space-x-1 justify-center text-xl font-bold">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
              
              return (
                <div key={item.id} className="flex items-center">
                  {index > 0 && <div className="text-pink-300 mx-3 select-none">|</div>}
                  <Link href={item.href} className="relative group px-4 py-2">
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-pink-100/50 rounded-full -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <motion.span
                      className={`block transition-colors duration-300 ${
                        isActive ? "text-pink-600" : "text-pink-500 group-hover:text-pink-600"
                      }`}
                      style={textstroke}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                </div>
              )
            })}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="sm:hidden flex items-center">
            <motion.button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-pink-500 text-2xl p-2 rounded-full hover:bg-pink-50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle Menu"
            >
              <motion.div
                animate={{ rotate: showMobileMenu ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {showMobileMenu ? <FaTimes /> : <FaBars />}
              </motion.div>
            </motion.button>
          </div>

          {/* Mobile User Avatar (Right side) */}
          <div className="sm:hidden">
            <Link href="/user/profile">
              <motion.div
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-300 shadow-md hover:border-pink-400 transition-colors relative bg-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Image
                  src={token ? avatarUrl : defaultAvatarUrl}
                  alt="用户头像"
                  fill
                  sizes="40px"
                  className="object-cover"
                  onError={e => {
                    ;(e.target as HTMLImageElement).src = defaultAvatarUrl
                  }}
                />
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="sm:hidden absolute z-20 w-[90%] max-w-[410px] mx-auto left-0 right-0 mt-4 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100 p-2">
              <div className="flex flex-col space-y-1">
                {/* Home Link for Mobile */}
                <MobileNavLink 
                  href="/" 
                  label="主页" 
                  onClick={() => setShowMobileMenu(false)} 
                  isActive={pathname === "/"}
                />
                
                {navItems.map((item) => (
                  <MobileNavLink
                    key={item.id}
                    href={item.href}
                    label={item.label}
                    onClick={() => setShowMobileMenu(false)}
                    isActive={pathname === item.href || pathname?.startsWith(`${item.href}/`)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface MobileNavLinkProps {
  href: string
  label: string
  onClick: () => void
  isActive: boolean
}

function MobileNavLink({ href, label, onClick, isActive }: MobileNavLinkProps) {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div 
        className={`p-4 rounded-2xl flex items-center justify-between transition-colors ${
          isActive ? "bg-pink-50 text-pink-600" : "text-gray-600 hover:bg-gray-50"
        }`}
        whileHover={{ x: 5, backgroundColor: "rgba(255, 241, 242, 0.5)" }}
        whileTap={{ scale: 0.98 }}
      >
        <span className={`font-bold ${isActive ? "text-pink-600" : "text-gray-600"}`}>
          {label}
        </span>
        {isActive && (
          <motion.div 
            layoutId="mobileActiveIndicator"
            className="w-2 h-2 rounded-full bg-pink-500"
          />
        )}
      </motion.div>
    </Link>
  )
}
