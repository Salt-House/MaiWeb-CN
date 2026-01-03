"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FaMusic, FaMapMarkedAlt, FaTools, FaTrophy, FaGamepad, FaQuestionCircle } from "react-icons/fa"

const features = [
  {
    id: "music",
    title: "音乐Library",
    desc: "音乐详情与单曲成绩",
    icon: <FaMusic className="text-3xl text-white" />,
    href: "/music",
    color: "from-pink-500 to-rose-500",
    size: "large", // col-span-2 row-span-2
    bgImage: "/img/music/系ぎて_cover.png"
  },
  {
    id: "region",
    title: "B50",
    desc: "查询B50（登陆后使用）",
    icon: <FaTrophy className="text-2xl text-white" />,
    href: "/tool/best",
    color: "from-purple-500 to-indigo-500",
    size: "medium", // col-span-1 row-span-1
    bgImage: "/img/grade/sssp.webp"
  },
  {
    id: "gamecenter",
    title: "机厅查询",
    desc: "寻找附近的机厅",
    icon: <FaGamepad className="text-2xl text-white" />,
    href: "/tool/collection",
    color: "from-cyan-400 to-blue-500",
    size: "medium",
    bgImage: "/img/laundry.png"
  },
  {
    id: "tools",
    title: "实用工具",
    desc: "计算器与辅助",
    icon: <FaTools className="text-xl text-white" />,
    href: "/tool",
    color: "from-orange-400 to-amber-500",
    size: "small",
    bgImage: "w"
  },
  {
    id: "map",
    title: "行脚图",
    desc: "点亮足迹",
    icon: <FaMapMarkedAlt className="text-xl text-white" />,
    href: "#playmap", // 锚点
    color: "from-emerald-400 to-teal-500",
    size: "small",
    bgImage: "/img/circle/torikoro.png"
  },
    {
    id: "qa",
    title: "常见问题",
    desc: "新手指南",
    icon: <FaQuestionCircle className="text-xl text-white" />,
    href: "/qa",
    color: "from-gray-400 to-slate-500",
    size: "small",
    bgImage: ""
  },
]

export default function FeatureGrid() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center md:text-left border-l-4 border-pink-500 pl-4">
          功能探索
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[120px] md:auto-rows-[140px]">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`relative group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300
              ${feature.size === 'large' ? 'col-span-2 row-span-2' : ''}
              ${feature.size === 'medium' ? 'col-span-2 md:col-span-1 row-span-1' : ''}
              ${feature.size === 'small' ? 'col-span-1 row-span-1' : ''}
            `}
          >
            <Link href={feature.href} className="block h-full w-full relative" id={feature.id}>
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-100 group-hover:opacity-100 transition-opacity`}></div>
              
              {/* 背景图片层 */}
              {feature.bgImage && (
                <div className="absolute inset-0 opacity-45 group-hover:opacity-30 transition-opacity duration-300 mix-blend-overlay">
                  <Image 
                    src={feature.bgImage} 
                    alt="" 
                    fill 
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              )}

              {/* 装饰圆圈 */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

              <div className="relative h-full flex flex-col justify-between p-5 md:p-6 text-white">
                <div>
                   <div className="mb-3 p-3 bg-white/20 backdrop-blur-sm rounded-2xl w-fit group-hover:rotate-12 transition-transform duration-300">
                     {feature.icon}
                   </div>
                   <h3 className={`font-bold leading-tight ${feature.size === 'large' ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
                     {feature.title}
                   </h3>
                </div>
                
                {(feature.size === 'large' || feature.size === 'medium') && (
                  <p className="text-white/90 text-sm md:text-base font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {feature.desc} →
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
