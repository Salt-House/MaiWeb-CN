import React, { useState } from "react"
import { FaPlus, FaCheck } from "react-icons/fa"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import SongItem from "./components/SongItem"
import SongItemSkeleton from "./components/SongItemSkeleton"
import { usePlayer } from "@/app/context/PlayerContext"
import { Song } from "@/types/music"
import { getDifficultyColor, getGenreColor, transferText } from "@/utils/music"
import Image from "next/image"
import { CONFIG } from "@/config/api"

interface SongListProps {
  songs: Song[]
  ordination?: "desc" | "dsc"
  currentCategory?: string
  loading?: boolean
}

function SongList({ songs, currentCategory = "最近添加", loading = false }: SongListProps) {
  const [displayMode, setDisplayMode] = useState<"level" | "level_value">("level")

  return (
    <div className="flex-col w-full max-sm:px-2 justify-center items-center p-4 max-sm:p-0">
      <div className="w-full flex max-sm:flex-col max-sm:items-center justify-around items-center max-sm:mx-auto sm:space-x-10 mb-6">
        <div className="flex bg-pink-300 p-1 rounded-full overflow-hidden max-sm:mb-5 max-sm:h-9 items-center justify-center">
          <div className="flex-1 text-center py-2 max-sm:py-0 px-4 text-base font-medium text-white">
            当前分类：{currentCategory}
          </div>
        </div>
        <div className="flex bg-pink-300 p-1 rounded-full overflow-hidden w-64 max-sm:w-56 max-sm:mb-5 max-sm:h-9">
          <button
            className={`flex-1 py-2 max-sm:py-0 max-sm:flex max-sm:items-center max-sm:justify-center text-center text-sm rounded-full transition-all duration-200 ${displayMode === "level" ? "bg-white shadow-md text-pink-500 font-medium" : "text-white"}`}
            onClick={() => setDisplayMode("level")}
          >
            等级
          </button>
          <button
            className={`flex-1 py-2 max-sm:py-0 max-sm:flex max-sm:items-center max-sm:justify-center text-center text-sm rounded-full transition-all duration-200 ${displayMode === "level_value" ? "bg-white shadow-md text-pink-500 font-medium" : "text-white"}`}
            onClick={() => setDisplayMode("level_value")}
          >
            定数
          </button>
        </div>
      </div>

      <div className="w-full flex flex-wrap justify-center items-center">
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <SongItemSkeleton key={`skeleton-${index}`} />
            ))
          : songs.map((song, index) => (
              <SongItem key={`${song.id}-${index}`} song={song} displayMode={displayMode} />
            ))}
      </div>
    </div>
  )
}

function SongListLegacy({ songs, currentCategory = "最近添加", loading = false }: SongListProps) {
  // 使用usePlayer hook获取播放器上下文
  const { addToPlaylist } = usePlayer()
  // 添加状态来跟踪哪些歌曲已被添加到播放列表
  const [addedSongs, setAddedSongs] = useState<{ [key: string]: boolean }>({})
  // 添加状态来跟踪当前显示模式：等级或具体定数
  const [displayMode, setDisplayMode] = useState<"level" | "level_value">("level")

  const handleAddToPlaylist = (song: Song) => {
    const audioUrl = `${CONFIG.ASSETS.MAIMAI.MUSIC}/${song.id}.mp3`

    addToPlaylist({
      id: `${song.id}`,
      title: song.title,
      artist: song.artist,
      audioUrl,
      coverUrl: `${CONFIG.ASSETS.MAIMAI.JACKET}/${song.id || "default"}.png`,
    })

    // 更新状态，标记该歌曲已添加
    setAddedSongs(prev => ({ ...prev, [song.id]: true }))

    // 1秒后恢复图标
    setTimeout(() => {
      setAddedSongs(prev => ({ ...prev, [song.id]: false }))
    }, 1000)
  }

  return (
    <div className="border-1 border-white bg-white rounded-2xl p-2 m-2">
      <div className="border-4 border-pink-300 bg-white rounded-2xl flex-col w-full max-w-6xl mx-auto max-sm:px-2 justify-center items-center p-4 max-sm:p-0">
        <div className="w-full flex max-sm:flex-col max-sm:items-start justify-between items-center mb-6 px-4 max-sm:px-1">
          <div className="text-lg font-medium max-sm:mb-3 text-black">
            当前分类：{currentCategory}
          </div>
          <div className="flex bg-[rgb(158,175,238)] p-1 rounded-full overflow-hidden w-64 max-sm:w-40 max-sm:mb-5 max-sm:h-9">
            <button
              className={`flex-1 py-2 max-sm:py-0 max-sm:flex max-sm:items-center max-sm:justify-center text-center text-sm rounded-full transition-all duration-200 ${displayMode === "level" ? "bg-white shadow-md text-[rgb(158,175,238)] font-medium" : "text-white"}`}
              onClick={() => setDisplayMode("level")}
            >
              等级
            </button>
            <button
              className={`flex-1 py-2 max-sm:py-0 max-sm:flex max-sm:items-center max-sm:justify-center text-center text-sm rounded-full transition-all duration-200 ${displayMode === "level_value" ? "bg-white shadow-md text-[rgb(158,175,238)] font-medium" : "text-white"}`}
              onClick={() => setDisplayMode("level_value")}
            >
              定数
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner size="sm" message="加载中..." description="正在获取乐曲数据" />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {songs.map((song, index) => (
              <>
                <div
                  id="clickDetail"
                  className="relative mb-10 max-sm:mb-1 w-full max-w-6xl"
                  key={`${song.id}-${index}`}
                >
                  <a
                    href={`${CONFIG.API.WEB.MUSIC}/${song.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => localStorage.setItem(`song_${song.id}`, JSON.stringify(song))}
                  >
                    <div className="flex h-36 max-sm:h-auto max-sm:flex-row max-sm:items-start max-sm:mx-auto bg-white px-4 max-sm:px-2 py-2 space-x-8 max-sm:space-x-2 cursor-pointer duration-300">
                      {/* 左侧曲绘封面 */}
                      <div className="max-sm:size-24 relative w-36 h-36 flex-shrink-0">
                        <Image
                          src={`${CONFIG.ASSETS.MAIMAI.JACKET}/${song.id}.png`}
                          alt={song.title}
                          className="rounded-xl object-cover"
                          fill
                          unoptimized
                        />
                      </div>

                      {/* 右侧歌曲信息 */}
                      <div className="sm:flex-1 flex flex-col max-sm:h-auto h-40 justify-center min-w-0 max-sm:flex-1 pl-2 max-sm:pl-3">
                        <div className="sm:flex-1 flex max-sm:flex-col max-sm:h-auto h-40 justify-center">
                          {/* 歌曲信息 */}
                          <div className="sm:flex-1 flex flex-col items-start min-w-0">
                            <h2
                              className="inline-flex max-sm:ml-0 max-sm:px-2 max-sm:text-xs px-5 py-1 truncate rounded-full text-white border-2"
                              style={{
                                backgroundColor: getGenreColor(song.genre).bg,
                                borderColor: getGenreColor(song.genre).border,
                              }}
                            >
                              {transferText(song.genre)}
                            </h2>
                            <h2 className="text-2xl max-sm:text-left max-sm:text-base max-sm:w-full text-black font-bold my-3 max-sm:my-1 truncate max-w-full">
                              {song.title}
                            </h2>
                            <div className="text-gray-600 self-start w-full max-sm:text-xs">
                              <p className="text-left truncate">Artist: {song.artist}</p>
                              <p className="text-left truncate">BPM: {song.bpm}</p>
                            </div>
                          </div>
                          {/* 难度等级 */}
                          <div className="flex flex-col space-y-2 max-sm:space-y-1 mb-2 justify-center max-sm:mt-2 max-sm:w-full">
                            {/* Standard谱面 */}
                            {song.difficulties.standard.length > 0 && (
                              <div className="flex items-center">
                                <span className="w-16 max-sm:w-12 max-sm:text-xs text-sm text-white bg-blue-500 rounded-full py-1 mr-2 max-sm:mr-1">
                                  标准
                                </span>
                                <div className="flex space-x-2 max-sm:space-x-1">
                                  {song.difficulties.standard.map((diff, idx) => (
                                    <>
                                      <div key={idx} className="flex flex-col">
                                        <div
                                          key={idx}
                                          className="w-12 h-12 max-sm:w-8 max-sm:h-8 rounded-xl flex items-center justify-center text-xl max-sm:text-sm text-white border-4 max-sm:border-2 border-[rgb(155,244,236)]"
                                          style={{
                                            backgroundColor: getDifficultyColor(
                                              diff.level_index as 0 | 1 | 2 | 3 | 4
                                            ),
                                          }}
                                        >
                                          {displayMode === "level"
                                            ? diff.level
                                            : Number.isInteger(diff.level_value)
                                              ? `${diff.level_value}.0`
                                              : diff.level_value}
                                        </div>
                                      </div>
                                    </>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* DX谱面 */}
                            {song.difficulties.dx.length > 0 && (
                              <div className="flex items-center">
                                <span className="w-16 max-sm:w-12 max-sm:text-xs text-sm text-white bg-orange-500 rounded-full py-1 mr-2 max-sm:mr-1">
                                  DX
                                </span>
                                <div className="flex flex-row space-x-2 max-sm:space-x-1">
                                  {song.difficulties.dx.map((diff, idx) => (
                                    <>
                                      <div key={idx} className="flex flex-col">
                                        <div
                                          className="w-12 h-12 max-sm:w-8 max-sm:h-8 rounded-xl flex items-center justify-center text-xl max-sm:text-sm text-white border-4 max-sm:border-2 border-[rgb(155,244,236)]"
                                          style={{
                                            backgroundColor: getDifficultyColor(
                                              diff.level_index as 0 | 1 | 2 | 3 | 4
                                            ),
                                          }}
                                        >
                                          {displayMode === "level"
                                            ? diff.level
                                            : Number.isInteger(diff.level_value)
                                              ? `${diff.level_value}.0`
                                              : diff.level_value}
                                        </div>
                                      </div>
                                    </>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Utage谱面 */}
                            {song.difficulties.utage.length > 0 && (
                              <div className="flex items-center">
                                <span
                                  className="w-16 max-sm:w-12 max-sm:text-xs text-sm text-white rounded-full py-1 mr-2 max-sm:mr-1"
                                  style={{
                                    backgroundColor: "rgb(220, 56, 184)",
                                  }}
                                >
                                  宴会场
                                </span>
                                <div className="flex space-x-2 max-sm:space-x-1">
                                  {song.difficulties.utage.map((diff, idx) => (
                                    <div
                                      key={idx}
                                      className="w-12 h-12 max-sm:w-8 max-sm:h-8 rounded-xl flex items-center justify-center text-xl max-sm:text-sm text-white border-4 max-sm:border-2 border-[rgb(155,244,236)]"
                                      style={{
                                        backgroundColor: "rgb(220, 56, 184)",
                                      }}
                                    >
                                      {diff.level}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {index < songs.length - 1 && (
                          <div className="flex justify-center mx-1 max-sm:mt-2">
                            <div className="w-full h-0.5 rounded-full bg-gray-300" />
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                  <button
                    id="addMusicPlay"
                    onClick={() => handleAddToPlaylist(song)}
                    className={`absolute max-sm:-left-1 max-sm:-top-1 left-0 top-0 w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-[rgb(135,70,193)] transition-colors ${addedSongs[song.id] ? "bg-green-400 hover:bg-green-500" : "bg-[rgb(155,90,213)] hover:bg-[rgb(135,70,193)]"}`}
                    title="添加到播放列表"
                  >
                    {addedSongs[song.id] ? <FaCheck /> : <FaPlus />}
                  </button>
                </div>
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface SongListContainerProps extends SongListProps {
  isLegacyMode?: boolean
}

export default function SongListContainer({
  songs,
  currentCategory = "最近添加",
  ordination = "desc",
  loading = false,
  isLegacyMode = false,
}: SongListContainerProps) {
  return (
    <div className="w-full">
      {/* 根据模式渲染不同的组件 */}
      {isLegacyMode ? (
        <SongListLegacy
          songs={songs}
          currentCategory={currentCategory}
          ordination={ordination}
          loading={loading}
        />
      ) : (
        <SongList
          songs={songs}
          currentCategory={currentCategory}
          ordination={ordination}
          loading={loading}
        />
      )}
    </div>
  )
}
