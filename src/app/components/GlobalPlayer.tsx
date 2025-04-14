'use client'

import { usePlayer, PlaylistItem, PlayMode } from '../context/PlayerContext'
import { useEffect, useRef, useState } from 'react'
import { FaPlay, FaPause, FaForward, FaBackward, FaList, FaTimes, FaRedo, FaRandom } from 'react-icons/fa'

export default function GlobalPlayer() {
  const {
    currentTrack,
    playlist,
    isPlaying,
    currentTime,
    duration,
    volume,
    playMode,
    togglePlay,
    nextTrack,
    previousTrack,
    playTrack,
    removeFromPlaylist,
    setProgress,
    setVolume,
    togglePlayMode
  } = usePlayer()

  const [showPlaylist, setShowPlaylist] = useState(false)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // 设置媒体会话
  useEffect(() => {
    if (!currentTrack) return;

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        artwork: [
          { src: currentTrack.coverUrl, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      // 注册媒体会话操作处理程序
      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => togglePlay());
      navigator.mediaSession.setActionHandler('previoustrack', () => previousTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());

      // 更新播放状态
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [currentTrack, isPlaying, togglePlay, previousTrack, nextTrack]);

  // 更新媒体会话播放状态
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  // 更新媒体会话播放位置
  useEffect(() => {
    if ('mediaSession' in navigator && duration > 0) {
      navigator.mediaSession.setPositionState({
        duration: duration,
        playbackRate: 1,
        position: currentTime
      });
    }
  }, [currentTime, duration]);

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
    if (isNaN(time)) return '0:00'

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // 计算进度百分比
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!currentTrack) {
    return null // 如果没有当前曲目，不显示播放器
  }

  return (
    <div className="fixed bottom-5 left-5 z-50">
      {/* 播放器主体 */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-3 w-72 border-2 border-[rgb(155,244,236)]">
        <div className="flex items-center space-x-3">
          {/* 封面 */}
          <div className="w-12 h-12 flex-shrink-0">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          {/* 标题和进度 */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-black">
              {currentTrack.title}
            </div>
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
        </div>

        {/* 控制按钮 */}
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
                <span className="absolute text-[8px] font-bold bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">1</span>
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
            className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            {isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
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

        {/* 播放列表 */}
        {showPlaylist && (
          <div className="mt-3 max-h-60 overflow-y-auto bg-white rounded-lg border border-gray-200">
            {playlist.length === 0 ? (
              <div className="p-3 text-center text-gray-500">播放列表为空</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {playlist.map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-center p-2 hover:bg-gray-50 ${currentTrack.id === item.id ? 'bg-blue-50' : ''
                      }`}
                  >
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => playTrack(item)}
                    >
                      <div className="text-sm font-medium truncate text-black">
                        {item.title}
                      </div>
                      {item.artist && (
                        <div className="text-xs truncate text-black/70">
                          {item.artist}
                        </div>
                      )}
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