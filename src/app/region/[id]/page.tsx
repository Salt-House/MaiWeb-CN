"use client"

import { useEffect, useState } from "react"
import { Area } from "../page"
import type { AreaCharacters, AreaSong } from "../page"
import Link from "next/link"
import {
  FaArrowLeft,
  FaLocationDot,
  FaLanguage,
  FaCircleInfo,
  FaMusic,
  FaUsers,
} from "react-icons/fa6"
import { FiExternalLink } from "react-icons/fi"
import LoadingSpinner from "@/app/components/LoadingSpinner"

interface PageProps {
  params: {
    id: string
  }
}

// Define the parsed area interface
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

export default function AreaDetailPage({ params }: PageProps) {
  const id = params.id
  const [area, setArea] = useState<ParsedArea>()
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState("zh")
  const textstroke = {
    textShadow:
      "-2px -2px 4px rgba(236, 72, 153, 1), 2px -2px 4px rgba(236, 72, 153, 1), -2px 2px 2px rgba(236, 72, 153, 1), 2px 2px 2px rgba(236, 72, 153, 1)",
  }
  const baseurl = "https://assets2.lxns.net/maimai/jacket/"

  const GetAreaDetail = () => {
    setLoading(true)
    fetch(`https://dev.maimai.moe/email/getOneArea?language=${language}&area_id=${params.id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        try {
          // Parse the characters and songs JSON strings
          const parsedArea: ParsedArea = {
            ...data.area,
            characters: data.area.characters ? JSON.parse(data.area.characters) : [],
            songs: data.area.songs ? JSON.parse(data.area.songs) : [],
          }
          setArea(parsedArea)
        } catch (parseError) {
          console.error("Failed to parse area data:", parseError)
          // Set area with empty arrays if parsing fails
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
  }

  useEffect(() => {
    GetAreaDetail()
  }, [language])

  useEffect(() => {
    GetAreaDetail()
  }, [])

  return (
    <div className="relative w-full min-h-screen  mx-auto flex flex-col items-center overflow-x-hidden">
      {/* 背景装饰元素 */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-[-1] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-blue-200/15 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* 顶部导航栏 */}
      <div className="w-full  border-b border-pink-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* 返回按钮 */}
          <Link
            href="/region"
            className="flex items-center text-pink-600 hover:text-pink-700 transition-all duration-200 group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-lg max-sm:text-base">返回区域列表</span>
          </Link>

          {/* 语言切换 */}
          <div className="flex items-center space-x-3">
            <FaLanguage className="text-pink-600 text-lg" />
            <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-pink-200 shadow-sm">
              <button
                onClick={() => setLanguage("jp")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  language === "jp"
                    ? "bg-pink-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-pink-100/50"
                }`}
              >
                日本語
              </button>
              <button
                onClick={() => setLanguage("zh")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  language === "zh"
                    ? "bg-pink-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-pink-100/50"
                }`}
              >
                中文
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="w-full max-w-6xl mx-auto px-4 py-8 flex-1">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        ) : area ? (
          <div className="space-y-8">
            {/* 区域标题和图片 */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center rounded-full px-6 py-2 border border-pink-200 shadow-sm">
                <FaLocationDot className="text-pink-500 mr-2" />
                <span className="text-sm text-gray-600">区域ID: {area.area_id}</span>
              </div>

              <h1 className="text-4xl font-bold text-gray-800 max-sm:text-2xl" style={textstroke}>
                {area.name}
              </h1>

              <div className="relative">
                <img
                  src={`/img/version/${area.area_id}.png`}
                  className="w-96 h-96 object-contain mx-auto animate-floatUpDown transition-all duration-300 ease-in-out max-sm:w-64 max-sm:h-64"
                  alt={area.name}
                  onError={e => {
                    const target = e.target as HTMLImageElement
                    target.src = "/img/logo.png"
                  }}
                />
                <div className="absolute inset-0 from-transparent to-white/50 pointer-events-none"></div>
              </div>
            </div>

            {/* 统计信息卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-pink-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <FaCircleInfo className="text-pink-500 text-xl mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">区域信息</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {area.description || "暂无区域描述信息"}
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-pink-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <FaUsers className="text-pink-500 text-xl mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">角色数量</h3>
                </div>
                <p className="text-3xl font-bold text-pink-600">{area.characters?.length || 0}</p>
                <p className="text-sm text-gray-500 mt-2">位角色</p>
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-pink-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <FaMusic className="text-pink-500 text-xl mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">歌曲数量</h3>
                </div>
                <p className="text-3xl font-bold text-pink-600">{area.songs?.length || 0}</p>
                <p className="text-sm text-gray-500 mt-2">首歌曲</p>
              </div>
            </div>

            {/* 区域角色 */}
            {area.characters?.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center border-b border-pink-200 pb-4">
                  <FaUsers className="text-pink-500 text-2xl mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">区域角色</h2>
                  <span className="ml-3 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                    {area.characters.length} 位
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {area.characters.map((character, index) => (
                    <div
                      key={index}
                      className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-pink-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* 角色头像 */}
                      <div className="flex justify-center mb-4">
                        <div className="relative w-20 h-20 rounded-full border-4 border-pink-300 overflow-hidden shadow-md">
                          <img
                            src={`/img/chara/${area.area_id}/0${index + 1}.png`}
                            className="w-full h-full object-cover"
                            alt={character.name || area.name}
                            onError={e => {
                              const target = e.target as HTMLImageElement
                              target.src = "/img/user.png"
                            }}
                          />
                        </div>
                      </div>

                      {/* 角色名称和团队 */}
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{character.name}</h3>
                        {character.team && (
                          <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-medium">
                            {character.team}
                          </span>
                        )}
                      </div>

                      {/* 角色描述 */}
                      {(character.description1 || character.description2) && (
                        <div className="bg-pink-50/50 rounded-lg p-3 mb-4">
                          {character.description1 && (
                            <p className="text-sm text-gray-700 italic mb-2">
                              "{character.description1}"
                            </p>
                          )}
                          {character.description2 && (
                            <p className="text-sm text-gray-700 italic">
                              "{character.description2}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* 角色属性 */}
                      {character.props && Object.keys(character.props).length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-600">属性信息</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(character.props).map(([key, value]) => (
                              <div
                                key={key}
                                className="bg-white border border-pink-200 rounded-lg px-2 py-1 text-xs"
                              >
                                <span className="font-medium text-pink-600">{key}:</span>
                                <span className="text-gray-600 ml-1">{value as string}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 插画师信息 */}
                      {character.illustrator && (
                        <div className="mt-4 pt-3 border-t border-pink-200">
                          <p className="text-xs text-gray-500">插画: {character.illustrator}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 区域歌曲 */}
            {area.songs?.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center border-b border-pink-200 pb-4">
                  <FaMusic className="text-pink-500 text-2xl mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">区域歌曲</h2>
                  <span className="ml-3 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                    {area.songs.length} 首
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {area.songs.map((song, index) => (
                    <div
                      key={index}
                      className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-pink-200 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center space-x-6">
                        {/* 歌曲封面 */}
                        <div className="flex-shrink-0">
                          <img
                            src={`${baseurl}${song.song_id}.png`}
                            className="w-20 h-20 rounded-lg border-2 border-pink-300 object-cover shadow-md"
                            alt={song.title}
                            onError={e => {
                              const target = e.target as HTMLImageElement
                              target.src = "/img/music.png"
                            }}
                          />
                        </div>

                        {/* 歌曲信息 */}
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">{song.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {song.artist || "未知艺术家"}
                          </p>

                          {/* 歌曲描述 */}
                          {song.description && (
                            <p className="text-sm text-gray-700 bg-pink-50/50 rounded-lg p-3 mb-3">
                              {song.description}
                            </p>
                          )}

                          {/* 详情链接 */}
                          {song.song_id && (
                            <Link
                              href={`/music/${song.song_id}`}
                              className="inline-flex items-center text-pink-600 hover:text-pink-700 transition-colors duration-200"
                            >
                              <span className="text-sm font-medium mr-2">查看歌曲详情</span>
                              <FiExternalLink className="text-sm" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 border border-pink-200 shadow-lg max-w-md">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLocationDot className="text-pink-500 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">未找到区域信息</h2>
              <p className="text-gray-600 mb-6">
                无法找到名为 "{id}" 的区域数据，请稍后再试或检查区域名称。
              </p>
              <Link
                href="/region"
                className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200 font-medium"
              >
                <FaArrowLeft className="mr-2" />
                返回区域列表
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 页脚装饰 */}
      <div className="w-full bg-white/80 backdrop-blur-md border-t border-pink-200/50 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-600">© 2024 MaiWeb - 区域详情页面</p>
        </div>
      </div>
    </div>
  )
}
