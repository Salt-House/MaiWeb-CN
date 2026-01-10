"use client"

import { useEffect, useState, useCallback } from "react"
import { CONFIG } from "@/config/api"
import type { AreaCharacters, AreaSong } from "../page"
import Link from "next/link"
import Image from "next/image"
import {
  FaArrowLeft,
  FaLocationDot,
  FaLanguage,
  FaMusic,
  FaUsers,
  FaCompactDisc,
  FaCircleInfo,
} from "react-icons/fa6"
import { motion, AnimatePresence } from "framer-motion"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

// -----------------------------------------------------------------------------
// 类型定义
// -----------------------------------------------------------------------------

interface PageProps {
  params: {
    id: string
  }
}

/**
 * 解析后的区域数据接口
 */
interface ParsedArea {
  aid: number
  area_id: string
  name: string
  comment: string
  description: string
  video_id: string
  characters: AreaCharacters[]
  songs: AreaSong[]
}

// -----------------------------------------------------------------------------
// 组件实现
// -----------------------------------------------------------------------------

/**
 * 区域详情页面组件
 * 展示特定区域的详细信息，包括角色和歌曲列表
 */
export default function AreaDetailPage({ params }: PageProps) {
  const id = params.id
  const [area, setArea] = useState<ParsedArea>()
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState("zh")
  const [activeTab, setActiveTab] = useState<"overview" | "characters" | "songs">("overview")

  const baseurl = CONFIG.ASSETS.MAIMAI.JACKET + "/"

  /**
   * 获取区域详细数据
   */
  const GetAreaDetail = useCallback(() => {
    setLoading(true)
    fetch(`${CONFIG.API.ENDPOINTS.EMAIL}/getOneArea?language=${language}&area_id=${params.id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        try {
          // 解析 characters 和 songs JSON 字符串
          const parsedArea: ParsedArea = {
            ...data.area,
            characters: data.area.characters ? JSON.parse(data.area.characters) : [],
            songs: data.area.songs ? JSON.parse(data.area.songs) : [],
          }
          setArea(parsedArea)
        } catch (parseError) {
          console.error("Failed to parse area data:", parseError)
          // 解析失败时的回退处理
          const fallbackArea: ParsedArea = {
            ...data.area,
            characters: [],
            songs: [],
          }
          setArea(fallbackArea)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error(error)
        setLoading(false)
      })
  }, [language, params.id])

  useEffect(() => {
    setTimeout(() => GetAreaDetail(), 0)
  }, [GetAreaDetail])

  // 标签页配置
  const tabs = [
    { id: "overview", label: "概览", icon: FaCircleInfo },
    { id: "characters", label: "角色", icon: FaUsers },
    { id: "songs", label: "歌曲", icon: FaMusic },
  ] as const

  return (
    <div className="relative w-full min-h-screen mx-auto flex flex-col ">
      {/* 顶部导航栏 */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50  shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/region"
            className="flex items-center text-gray-600 hover:text-pink-600 transition-colors group"
          >
            <div className="p-2 rounded-full group-hover:bg-pink-50 transition-colors">
              <FaArrowLeft />
            </div>
            <span className="font-medium ml-2">返回列表</span>
          </Link>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setLanguage("zh")}
              className={`px-3 py-1 text-sm rounded-md transition-all ${
                language === "zh" ? "bg-white text-pink-600 shadow-sm font-medium" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              中文
            </button>
            <button
              onClick={() => setLanguage("jp")}
              className={`px-3 py-1 text-sm rounded-md transition-all ${
                language === "jp" ? "bg-white text-pink-600 shadow-sm font-medium" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              日本語
            </button>
          </div>
        </div>
      </motion.div>

      {/* 主内容区域 */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <LoadingSpinner size="lg" />
          </div>
        ) : area ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 左侧：区域信息卡片 (Sticky) */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-24 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center"
                >
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <Image
                      src={`/img/version/${area.area_id}.png`}
                      alt={area.name}
                      fill
                      className="object-contain drop-shadow-xl"
                      unoptimized
                      onError={(e) => {
                        // @ts-ignore
                        e.target.src = "/img/logo.png"
                      }}
                    />
                  </div>
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-medium mb-3">
                    <FaLocationDot />
                    ID: {area.area_id}
                  </div>
                  
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{area.name}</h1>
                  <p className="text-gray-500 text-sm leading-relaxed">{area.description || "暂无描述"}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{area.characters?.length || 0}</div>
                      <div className="text-xs text-gray-500">角色</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{area.songs?.length || 0}</div>
                      <div className="text-xs text-gray-500">歌曲</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* 右侧：详情内容 */}
            <div className="lg:col-span-8 xl:col-span-9">
              {/* 标签页切换 */}
              <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                      }`}
                    >
                      <Icon />
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              {/* 内容展示 */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <FaCircleInfo className="text-pink-500" />
                          关于此区域
                        </h3>
                        <div className="prose prose-pink max-w-none text-gray-600">
                           {area.comment ? (
                             <p>{area.comment}</p>
                           ) : (
                             <p className="text-gray-400 italic">暂无详细介绍...</p>
                           )}
                        </div>
                      </div>

                      {/* 快速预览：角色 */}
                      {area.characters?.length > 0 && (
                        <div className="bg-gradient-to-br from-pink-50 to-white rounded-3xl p-8 border border-pink-100">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">登场角色</h3>
                            <button 
                              onClick={() => setActiveTab("characters")}
                              className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                            >
                              查看全部 &rarr;
                            </button>
                          </div>
                          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {area.characters.slice(0, 5).map((char, idx) => (
                              <div key={idx} className="flex-shrink-0 w-24 text-center">
                                <div className="w-20 h-20 mx-auto rounded-full border-2 border-white shadow-md overflow-hidden mb-2">
                                  <Image
                                    src={`/img/chara/${area.area_id}/0${idx + 1}.png`}
                                    alt={char.name}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                    onError={(e) => {
                                      // @ts-ignore
                                      e.target.src = "/img/user.png"
                                    }}
                                  />
                                </div>
                                <div className="text-xs font-medium text-gray-700 truncate">{char.name}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "characters" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {area.characters?.map((character, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex gap-6"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100">
                              <Image
                                src={`/img/chara/${area.area_id}/0${index + 1}.png`}
                                alt={character.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                                unoptimized
                                onError={(e) => {
                                  // @ts-ignore
                                  e.target.src = "/img/user.png"
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 truncate">{character.name}</h3>
                                {character.team && (
                                  <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full mt-1">
                                    {character.team}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {(character.description1 || character.description2) && (
                              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                {character.description1 || character.description2}
                              </p>
                            )}

                            {character.illustrator && (
                              <div className="text-xs text-gray-400">
                                画师: {character.illustrator}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {(!area.characters || area.characters.length === 0) && (
                        <div className="col-span-full py-12 text-center text-gray-400">
                          暂无角色信息
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "songs" && (
                    <div className="space-y-4">
                      {area.songs?.map((song, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-pink-200 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative group-hover:shadow-md transition-all">
                              <Image
                                src={`${baseurl}${song.song_id}.png`}
                                alt={song.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                                unoptimized
                                onError={(e) => {
                                  // @ts-ignore
                                  e.target.src = "/img/music.png"
                                }}
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FaCompactDisc className="text-white text-xl" />
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-pink-600 transition-colors">
                                {song.title}
                              </h3>
                              <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                            </div>

                            {song.song_id && (
                              <Link
                                href={`/music/${song.song_id}`}
                                className="px-4 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-colors whitespace-nowrap"
                              >
                                查看详情
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {(!area.songs || area.songs.length === 0) && (
                        <div className="py-12 text-center text-gray-400">
                          暂无歌曲信息
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaLocationDot className="text-gray-400 text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">未找到区域</h2>
            <p className="text-gray-500 mb-6">该区域不存在或已被移除</p>
            <Link
              href="/region"
              className="px-6 py-2 bg-pink-600 text-white rounded-full font-medium hover:bg-pink-700 transition-colors"
            >
              返回列表
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
