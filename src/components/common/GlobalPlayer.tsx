"use client"

import { usePlayer, PlayMode } from "@/app/context/PlayerContext" // Updated import path
import { useEffect, useRef, useState } from "react"
import { FaForward, FaBackward, FaList, FaTimes, FaRedo } from "react-icons/fa"
import { FaCirclePlay, FaCirclePause } from "react-icons/fa6"
import Image from "next/image"

export default function GlobalPlayer() {
  const {
    currentTrack,
    playlist,
    isPlaying,
    currentTime,
    duration,
    playMode,
    togglePlay,
    nextTrack,
    previousTrack,
    playTrack,
    removeFromPlaylist,
    setProgress,
    togglePlayMode,
  } = usePlayer()

  const [showPlaylist, setShowPlaylist] = useState(false)
  // 添加最小化状态
  const [isMinimized, setIsMinimized] = useState(false)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // 设置媒体会话 - 初始化和事件处理程序
  useEffect(() => {
    if (!("mediaSession" in navigator)) return

    try {
      // 注册媒体会话操作处理程序
      navigator.mediaSession.setActionHandler("play", () => togglePlay())
      navigator.mediaSession.setActionHandler("pause", () => togglePlay())
      navigator.mediaSession.setActionHandler("previoustrack", () => previousTrack())
      navigator.mediaSession.setActionHandler("nexttrack", () => nextTrack())
    } catch (error) {
      console.error("注册媒体会话处理程序失败:", error)
    }

    return () => {
      // 清理处理程序
      try {
        navigator.mediaSession.setActionHandler("play", null)
        navigator.mediaSession.setActionHandler("pause", null)
        navigator.mediaSession.setActionHandler("previoustrack", null)
        navigator.mediaSession.setActionHandler("nexttrack", null)
      } catch {
        // 忽略清理错误
      }
    }
  }, [togglePlay, previousTrack, nextTrack])

  // 设置媒体会话 - 更新元数据
  useEffect(() => {
    if (!currentTrack || !("mediaSession" in navigator)) return

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        artwork: [{ src: currentTrack.coverUrl, sizes: "512x512", type: "image/jpeg" }],
      })
    } catch (error) {
      console.error("更新媒体会话元数据失败:", error)
    }
  }, [currentTrack])

  // 更新媒体会话播放状态
  useEffect(() => {
    if (!("mediaSession" in navigator)) return

    try {
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused"
    } catch (error) {
      console.error("更新媒体会话播放状态失败:", error)
    }
  }, [isPlaying])

  // 更新媒体会话播放位置
  useEffect(() => {
    // 只有在页面可见时才更新，以节省资源
    if (document.visibilityState === "hidden") return

    if (
      "mediaSession" in navigator &&
      duration > 0 &&
      isFinite(duration) &&
      isFinite(currentTime) &&
      currentTime >= 0
    ) {
      try {
        // 简单节流：只在整数秒更新，或者接近结束时更新
        // 也可以使用时间戳进行更精确的节流，但对于媒体会话，每秒更新一次通常足够
        // 注意：MediaSession API 会自动推断播放进度，所以不需要频繁更新
        // 这里我们放宽更新频率，例如每 5 秒更新一次，或者在播放状态改变时更新
        // 但为了保持 UI 同步，我们可以检查当前时间与上一次更新时间的差值

        // 由于 currentTime 更新频率较高，这里不进行过度复杂的节流，
        // 而是依赖 mediaSession 的自动推断能力，只在偏差较大时修正，或者直接更新（如果浏览器内部有优化）
        // 实践中，每秒更新一次是合理的

        navigator.mediaSession.setPositionState({
          duration: duration,
          playbackRate: 1,
          position: currentTime,
        })
      } catch {
        // 忽略非关键错误，例如在某些状态下更新失败
        // console.error("设置媒体会话位置状态失败:", error)
      }
    }
  }, [currentTime, duration])

  // 处理进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return

    const progressBar = e.currentTarget
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left
    const progressBarWidth = progressBar.clientWidth
    const percentage = clickPosition / progressBarWidth

    setProgress(percentage)
  }

  // 格式化时间
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // 计算进度百分比
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!currentTrack) {
    return null // 如果没有当前曲目，不显示播放器
  }

  return (
    <div id="musicPlayer" className="fixed bottom-5 left-5 z-50">
      {/* 播放器主体 */}
      <div
        className={`bg-white/90 backdrop-blur-md rounded-xl shadow-lg border-2 border-[rgb(155,244,236)] transition-all duration-300 ${isMinimized ? "p-2" : "p-3"}`}
        style={{ width: isMinimized ? "auto" : "18rem" }}
      >
        <div className={`flex items-center ${isMinimized ? "" : "space-x-3"}`}>
          {/* 封面 - 添加点击事件切换最小化状态 */}
          <div
            className={`flex-shrink-0 cursor-pointer transition-all duration-300 relative ${isMinimized ? "w-10 h-10" : "w-12 h-12"}`}
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "展开播放器" : "最小化播放器"}
          >
            <Image
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-md"
              priority
            />
          </div>

          {/* 当不是最小化状态时显示的内容 */}
          {!isMinimized && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate text-black">{currentTrack.title}</div>
              {currentTrack.artist && (
                <div className="text-xs truncate text-black/70 -mt-0.5 mb-0.5">
                  {currentTrack.artist}
                </div>
              )}

              {/* 进度条 */}
              <div
                ref={progressBarRef}
                className="w-full h-1.5 bg-gray-200 rounded-full mt-1 cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* 时间 */}
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}
        </div>

        {/* 控制按钮 - 只在非最小化状态显示 */}
        {!isMinimized && (
          <div className="flex justify-between items-center mt-2 mx-3">
            {/* 播放模式切换按钮 */}
            <button
              onClick={togglePlayMode}
              className="text-gray-700 hover:text-blue-500 transition-colors"
              title={playMode === PlayMode.SINGLE ? "单曲循环" : "顺序播放"}
            >
              {playMode === PlayMode.SINGLE ? (
                <div className="relative">
                  <FaRedo />
                  <span className="absolute text-[8px] font-bold bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
                    1
                  </span>
                </div>
              ) : (
                <FaRedo />
              )}
            </button>

            {/* 其他按钮保持不变 */}
            <button
              onClick={previousTrack}
              className="text-gray-700 hover:text-blue-500 transition-colors w-6 flex justify-center"
            >
              <FaBackward />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center text-blue-500"
            >
              {isPlaying ? (
                <FaCirclePause className="w-8 h-8" />
              ) : (
                <FaCirclePlay className="w-8 h-8" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="text-gray-700 hover:text-blue-500 transition-colors w-6 flex justify-center"
            >
              <FaForward />
            </button>

            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="text-gray-700 hover:text-blue-500 transition-colors"
            >
              <FaList />
            </button>
          </div>
        )}

        {/* 播放列表 - 只在非最小化状态且显示播放列表时显示 */}
        {!isMinimized && showPlaylist && (
          <div className="mt-3 max-h-60 overflow-y-auto bg-white rounded-lg border border-gray-200">
            {/* 播放列表内容保持不变 */}
            {playlist.length === 0 ? (
              <div className="p-3 text-center text-gray-500">播放列表为空</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {playlist.map(item => (
                  <li
                    key={item.id}
                    className={`flex items-center p-2 hover:bg-gray-50 ${
                      currentTrack.id === item.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => playTrack(item)}>
                      <div className="text-sm font-medium truncate text-black">{item.title}</div>
                    </div>
                    <button
                      onClick={() => removeFromPlaylist(item.id)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <FaTimes size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
