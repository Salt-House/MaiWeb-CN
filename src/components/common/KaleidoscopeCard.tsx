"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import CONFIG from "@/config/api"

const KaleidoscopeCard = () => {
  return (
    <div className="w-full flex justify-center mt-30">
      <Link
        href="/kaleidoscope"
        className="block w-[800px] max-sm:w-[90%] cursor-pointer"
      >
        <motion.div
          className="relative my-10 w-full flex flex-col justify-center items-center rounded-2xl overflow-visible"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
        >
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
            style={{ height: "auto" }}
          />
        </motion.div>
        {/* Background - match SearchGameCenter style */}
        <motion.div
          className="absolute rounded-2xl inset-x-0 inset-y-0 z-[-1] bg-pink-50 border-4 border-pink-300 shadow-2xl"
          animate={{
            boxShadow: [
              "0 25px 50px -12px rgba(255, 95, 165, 0.25)",
              "0 25px 50px -12px rgba(255, 183, 206, 0.35)",
              "0 25px 50px -12px rgba(255, 95, 165, 0.25)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>

        {/* Content */}
        <div className="relative z-10 flex flex-row max-sm:flex-col w-full h-full py-8 pr-4 items-center justify-center">
          {/* Left: Blue Door Image */}
          <div className="w-1/3 max-sm:w-full flex justify-center items-center max-sm:mb-6">
            <div className="relative w-40 h-40 max-sm:w-32 max-sm:h-32">
              <Image
                src="/img/kaleidoscope/KALEDOSCOPE_Blue_door.png"
                alt="Blue Gate"
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>

          {/* Right: Text */}
          <div className="w-2/3 max-sm:w-full flex flex-col justify-center max-sm:px-6 text-left max-sm:text-center">
            <h2 className="text-2xl max-sm:text-xl font-bold text-pink-500 mb-4 drop-shadow-sm">
              maimai DX KALEIDXSCOPE:
              <br />
              <span className="text-sky-400">青之门</span> 解禁！
            </h2>
            <div className="text-gray-600 text-base leading-relaxed space-y-2">
              <p>
                完成特定条件即可开启青之门，挑战新曲：
                <span className="font-bold text-sky-600">
                  <Link
                    href={`${CONFIG.API.WEB.MUSIC}/1740`}
                    target="_blank"
                    className="text-sky-400 hover:underline"
                  >
                    果ての空、僕らが見た光。
                  </Link>
                </span>
              </p>
              <p className="text-pink-400 font-bold mt-2 text-base">
                点亮方法、钥匙获取及挑战详情 &gt;&gt;
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements - similar to SearchGameCenter */}
        <motion.div
          className="absolute -top-6 -right-6 w-12 h-12 opacity-40"
          animate={{
            rotate: 360,
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
      </motion.div>
    </Link>
    </div>
  )
}

export default KaleidoscopeCard
