"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import TextScroller from "./TextScroller"
import { NamePlate, MaiBackGround, Icon, Trophie } from "../model"
import { CONFIG } from "@/config/api"

interface RenderItemProps {
  item: NamePlate | MaiBackGround | Icon | Trophie
  type: "icon" | "frame" | "plate" | "trophy"
  openImagePreview: (item: NamePlate | MaiBackGround | Icon | Trophie, type: string) => void
  GetCondition: (type: string, id: string) => void
}

const baseUrl = CONFIG.ASSETS.MAIMAI.BASE

/**
 * 渲染收藏品项目组件
 * 负责展示单个收藏品卡片，包含图片、名称、描述和分类标签
 * 支持悬停效果和点击预览
 *
 * @param item - 收藏品数据对象
 * @param type - 收藏品类型 (icon/frame/plate/trophy)
 * @param openImagePreview - 打开图片预览的回调函数
 * @param GetCondition - 获取获取条件的回调函数
 */
export default function RenderItem({
  item,
  type,
  openImagePreview,
  GetCondition,
}: RenderItemProps) {
  // 奖杯背景处理逻辑
  let bg_trophy = ""
  if (type === "trophy") {
    const trophyItem = item as Trophie
    switch (trophyItem.color) {
      case "Normal":
        bg_trophy = "bg-[url('/img/trophy/UI_CMN_Shougou_Normal.png')]"
        break
      case "Bronze":
        bg_trophy = "bg-[url('/img/trophy/UI_CMN_Shougou_Bronze.png')]"
        break
      case "Silver":
        bg_trophy = "bg-[url('/img/trophy/UI_CMN_Shougou_Silver.png')]"
        break
      case "Gold":
        bg_trophy = "bg-[url('/img/trophy/UI_CMN_Shougou_Gold.png')]"
        break
      case "Rainbow":
        bg_trophy = "bg-[url('/img/trophy/UI_CMN_Shougou_Rainbow.png')]"
        break
    }
  }

  // 通用卡片样式类
  const cardBaseClass =
    "relative cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-pink-200 transition-all duration-300"
  
  // 图片容器通用样式
  const imageContainerClass = 
    "relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-pink-50/50 group-hover:to-pink-100/50 transition-colors duration-300"

  switch (type) {
    case "icon":
      return (
        <motion.div
          key={item.collection_id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={cardBaseClass}
          onClick={() => {
            openImagePreview(item, "icon")
            GetCondition("icon", item.collection_id)
          }}
        >
          <div className="aspect-square p-4">
            <div className={imageContainerClass + " rounded-xl"}>
              <div className="relative w-full h-full p-2">
                <Image
                  src={`${baseUrl}/${type}/${Number(item.collection_id)}.png`}
                  alt={item.name}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
                  unoptimized
                />
              </div>
            </div>
          </div>
          <div className="px-4 pb-4 pt-0">
            <h3 className="text-sm font-bold text-gray-800 truncate group-hover:text-pink-600 transition-colors">
              {item.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-8 leading-4 opacity-80 group-hover:opacity-100 transition-opacity">
              {item.description}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200 group-hover:bg-pink-50 group-hover:text-pink-600 group-hover:border-pink-100 transition-colors">
                {(item as Icon).genre}
              </span>
            </div>
          </div>
        </motion.div>
      )

    case "frame":
      return (
        <motion.div
          key={item.collection_id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={cardBaseClass.replace("hover:border-pink-200", "hover:border-blue-200")}
          onClick={() => {
            openImagePreview(item, "frame")
            GetCondition("frame", item.collection_id)
          }}
        >
          <div className="aspect-[16/9] p-2">
             <div className={imageContainerClass + " rounded-xl group-hover:from-blue-50/50 group-hover:to-blue-100/50"}>
              <div className="relative w-full h-full p-1">
                <Image
                  src={`${CONFIG.ASSETS.STATIC}/UI_Frame_${item.collection_id}.png`}
                  alt={item.name}
                  fill
                  className="object-contain rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
            </div>
          </div>
          <div className="px-4 pb-4 pt-1">
            <h3 className="text-sm font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
              {item.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-8 leading-4 opacity-80 group-hover:opacity-100 transition-opacity">
              {item.description}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                {(item as MaiBackGround).genre}
              </span>
            </div>
          </div>
        </motion.div>
      )

    case "trophy":
      return (
        <motion.div
          key={item.collection_id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`relative cursor-pointer ${bg_trophy} bg-no-repeat bg-contain w-full max-w-[320px] mx-auto flex flex-col items-center justify-center filter drop-shadow-md hover:drop-shadow-2xl transition-all duration-300`}
          style={{ aspectRatio: "272/29" }}
          onClick={() => {
            openImagePreview(item, "trophy")
            GetCondition("trophy", item.collection_id)
          }}
        >
          <div
            className="max-w-[85%] text-white text-sm font-bold tracking-wide select-none"
            style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 4px rgba(0,0,0,0.5)" }}
          >
            <TextScroller text={item.name} speed={20} delay={2} />
          </div>
        </motion.div>
      )

    case "plate":
      return (
        <motion.div
          key={item.collection_id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={cardBaseClass.replace("hover:border-pink-200", "hover:border-green-200")}
          onClick={() => {
            openImagePreview(item, "nameplate")
            GetCondition("plate", item.collection_id)
          }}
        >
          <div className="aspect-[3/1] p-3">
             <div className={imageContainerClass + " rounded-xl group-hover:from-green-50/50 group-hover:to-green-100/50"}>
              <div className="relative w-full h-full">
                <Image
                  src={`${CONFIG.ASSETS.STATIC}/UI_Plate_${item.collection_id.toString().padStart(6, "0")}.png`}
                  alt={item.name}
                  fill
                  className="object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
            </div>
          </div>
          <div className="px-4 pb-4 pt-1">
            <h3 className="text-sm font-bold text-gray-800 truncate group-hover:text-green-600 transition-colors">
              {item.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-8 leading-4 opacity-80 group-hover:opacity-100 transition-opacity">
              {item.description}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200 group-hover:bg-green-50 group-hover:text-green-600 group-hover:border-green-100 transition-colors">
                {(item as NamePlate).genre}
              </span>
            </div>
          </div>
        </motion.div>
      )

    default:
      return null
  }
}
