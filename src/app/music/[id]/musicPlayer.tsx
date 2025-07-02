'use client'

import { useState, useEffect, useRef } from 'react'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaPlus, FaCheck, FaDownload } from 'react-icons/fa'
import { usePlayer } from '@/app/context/PlayerContext'
import DownloadButton from '@/app/components/button/DownloadButton'

interface MusicPlayerProps {
  audioUrl: string
  title?: string
  artist?: string
  songId?: string
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioUrl, title, artist, songId }) => {
  // 本地状态，用于非当前播放歌曲的情况
  const [localCurrentTime, setLocalCurrentTime] = useState(0)
  const [localDuration, setLocalDuration] = useState(0)
  const [localIsPlaying, setLocalIsPlaying] = useState(false)

  // 添加状态来跟踪是否已添加到播放列表
  const [isAddedToPlaylist, setIsAddedToPlaylist] = useState(false)
  // 添加下载状态
  const [isDownloading, setIsDownloading] = useState(false)

  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const [isDraggingVolume, setIsDraggingVolume] = useState(false)
  const [isDraggingProgress, setIsDraggingProgress] = useState(false)
  const progressBarRef = useRef<HTMLDivElement | null>(null)
  const volumeBarRef = useRef<HTMLDivElement | null>(null)
  const volumeKnobRef = useRef<HTMLDivElement | null>(null)
  const progressKnobRef = useRef<HTMLDivElement | null>(null)
  // 为移动端音量控制添加单独的ref
  const mobileVolumeBarRef = useRef<HTMLDivElement | null>(null)
  const localAudioRef = useRef<HTMLAudioElement | null>(null)

  // 使用全局播放器上下文
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    addToPlaylist,
    setProgress: setGlobalProgress,
    volume: globalVolume,
    setVolume: setGlobalVolume,
    currentTime: globalCurrentTime,
    duration: globalDuration
  } = usePlayer()

  // 检查当前歌曲是否是全局播放器正在播放的歌曲
  const isCurrentTrack = currentTrack && (currentTrack.id === songId || currentTrack.audioUrl === audioUrl)

  // 初始化本地音频元素，用于预览和获取时长
  useEffect(() => {
    const audio = new Audio(audioUrl)
    localAudioRef.current = audio

    audio.addEventListener('loadedmetadata', () => {
      setLocalDuration(audio.duration)
    })

    audio.addEventListener('timeupdate', () => {
      if (!isCurrentTrack) {
        setLocalCurrentTime(audio.currentTime)
      }
    })

    audio.addEventListener('ended', () => {
      setLocalIsPlaying(false)
    })

    // 加载音频以获取元数据
    audio.load()

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('loadedmetadata', () => { })
      audio.removeEventListener('timeupdate', () => { })
      audio.removeEventListener('ended', () => { })
    }
  }, [audioUrl, isCurrentTrack])

  // 处理播放/暂停
  const handleTogglePlay = () => {
    if (isCurrentTrack) {
      // 如果是当前播放的歌曲，使用全局播放器控制
      togglePlay()
    } else {
      // 如果不是当前播放的歌曲，切换到这首歌
      playTrack({
        id: songId || title || 'unknown',
        title: title || '未知歌曲',
        artist: artist || '未知艺术家',
        audioUrl,
        coverUrl: `https://assets2.lxns.net/maimai/jacket/${songId || 'default'}.png`
      })
    }
  }

  // 添加到播放列表
  const handleAddToPlaylist = () => {
    addToPlaylist({
      id: songId || title || 'unknown',
      title: title || '未知歌曲',
      artist: artist || '未知艺术家',
      audioUrl,
      coverUrl: `https://assets2.lxns.net/maimai/jacket/${songId || 'default'}.png`
    })

    // 更新状态，标记已添加
    setIsAddedToPlaylist(true)

    // 1秒后恢复图标
    setTimeout(() => {
      setIsAddedToPlaylist(false)
    }, 1000)
  }

  // 处理下载
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isDownloading) return

    try {
      setIsDownloading(true)
      console.log('开始下载')

      // 使用 fetch 获取文件数据
      const response = await fetch(audioUrl)
      if (!response.ok) throw new Error('下载失败')

      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)

      // 创建临时链接元素
      const link = document.createElement('a')
      link.href = downloadUrl

      // 设置文件名
      const filename = `${title || 'music'}.mp3`
      link.download = filename

      // 设置链接不可见并添加到文档
      link.style.display = 'none'
      document.body.appendChild(link)

      // 触发下载
      link.click()

      // 清理临时元素和 URL 对象
      document.body.removeChild(link)
      URL.revokeObjectURL(downloadUrl)

    } catch (error) {
      console.error('下载失败:', error)
      alert('下载失败')
    } finally {
      setIsDownloading(false)
    }
  }

  // 处理进度条点击
  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return

    const progressBar = progressBarRef.current
    const rect = progressBar.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const newProgress = offsetX / rect.width

    if (newProgress >= 0 && newProgress <= 1) {
      if (isCurrentTrack) {
        // 如果是当前播放的歌曲，更新全局进度
        setGlobalProgress(newProgress)
      } else {
        // 如果不是当前播放的歌曲，更新本地进度
        if (localAudioRef.current) {
          localAudioRef.current.currentTime = newProgress * localDuration
          setLocalCurrentTime(localAudioRef.current.currentTime)
        }
      }
    }
  }

  // 处理音量变化 - 桌面端垂直音量条
  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return

    const volumeBar = volumeBarRef.current
    const rect = volumeBar.getBoundingClientRect()
    const offsetY = rect.bottom - e.clientY
    const newVolume = Math.max(0, Math.min(1, offsetY / rect.height))

    setGlobalVolume(newVolume)

    // 同时更新本地音频的音量
    if (localAudioRef.current) {
      localAudioRef.current.volume = newVolume
    }
  }

  // 处理音量变化 - 移动端水平音量条
  const handleMobileVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mobileVolumeBarRef.current) return

    const volumeBar = mobileVolumeBarRef.current
    const rect = volumeBar.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const newVolume = Math.max(0, Math.min(1, offsetX / rect.width))

    setGlobalVolume(newVolume)

    // 同时更新本地音频的音量
    if (localAudioRef.current) {
      localAudioRef.current.volume = newVolume
    }
  }

  // 音量拖动 - 桌面端
  const startVolumeDrag = (e: React.MouseEvent) => {
    setIsDraggingVolume(true)
    handleVolumeChange(e as React.MouseEvent<HTMLDivElement>)

    function onMouseMove(e: MouseEvent) {
      if (!volumeBarRef.current) return

      const volumeBar = volumeBarRef.current
      const rect = volumeBar.getBoundingClientRect()
      const offsetY = rect.bottom - e.clientY
      const newVolume = Math.max(0, Math.min(1, offsetY / rect.height))

      setGlobalVolume(newVolume)

      // 同时更新本地音频的音量
      if (localAudioRef.current) {
        localAudioRef.current.volume = newVolume
      }
    }

    const onMouseUp = () => {
      setIsDraggingVolume(false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  // 音量拖动 - 移动端
  const startMobileVolumeDrag = (e: React.MouseEvent) => {
    setIsDraggingVolume(true)
    handleMobileVolumeChange(e as React.MouseEvent<HTMLDivElement>)

    function onMouseMove(e: MouseEvent) {
      if (!mobileVolumeBarRef.current) return

      const volumeBar = mobileVolumeBarRef.current
      const rect = volumeBar.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const newVolume = Math.max(0, Math.min(1, offsetX / rect.width))

      setGlobalVolume(newVolume)

      // 同时更新本地音频的音量
      if (localAudioRef.current) {
        localAudioRef.current.volume = newVolume
      }
    }

    const onMouseUp = () => {
      setIsDraggingVolume(false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  // 进度拖动
  const startProgressDrag = (e: React.MouseEvent) => {
    setIsDraggingProgress(true)
    handleProgressChange(e as React.MouseEvent<HTMLDivElement>)

    function onMouseMove(e: MouseEvent) {
      if (!progressBarRef.current) return

      const progressBar = progressBarRef.current
      const rect = progressBar.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const newProgress = Math.max(0, Math.min(1, offsetX / rect.width))

      if (isCurrentTrack) {
        // 如果是当前播放的歌曲，更新全局进度
        setGlobalProgress(newProgress)
      } else {
        // 如果不是当前播放的歌曲，更新本地进度
        if (localAudioRef.current) {
          localAudioRef.current.currentTime = newProgress * localDuration
          setLocalCurrentTime(localAudioRef.current.currentTime)
        }
      }
    }

    const onMouseUp = () => {
      setIsDraggingProgress(false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  // 根据是否是当前播放的歌曲，选择使用全局状态还是本地状态
  const currentTime = isCurrentTrack ? globalCurrentTime : localCurrentTime
  const duration = isCurrentTrack ? globalDuration : localDuration
  const displayIsPlaying = isCurrentTrack ? isPlaying : localIsPlaying

  // 计算当前进度百分比
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-3 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0 border-2 border-[rgb(155,244,236)]">
      {/* 移动端进度条 */}
      <div className="w-full md:hidden my-2">
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
          <div
            ref={progressBarRef}
            className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer relative"
            onClick={handleProgressChange}
          >
            <div
              className="absolute top-0 left-0 h-full bg-[rgb(69,197,255)] rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>

            <div
              ref={progressKnobRef}
              className="absolute top-1/2 w-4 h-4 bg-white border-2 border-[rgb(69,197,255)] rounded-full transform -translate-y-1/2 cursor-grab shadow-md hover:scale-110 transition-transform"
              style={{
                left: `${progressPercentage}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseDown={startProgressDrag}
              onMouseOver={() => progressKnobRef.current?.classList.add('scale-110')}
              onMouseOut={() => progressKnobRef.current?.classList.remove('scale-110')}
            ></div>
          </div>
          <span className="text-xs text-gray-500">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 控制按钮行 - 在移动端是第二行，两端对齐 */}
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center">
          {/* 播放/暂停按钮 - 始终居左 */}
          <button
            onClick={handleTogglePlay}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[rgb(69,197,255)] text-white hover:bg-[rgb(55,180,235)] transition-colors"
          >
            {displayIsPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
          </button>
        </div>

        {/* 桌面端的进度条*/}
        <div className="hidden md:block flex-1 mx-4">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
            <div
              ref={progressBarRef}
              className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer relative"
              onClick={handleProgressChange}
            >
              <div
                className="absolute top-0 left-0 h-full bg-[rgb(69,197,255)] rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>

              <div
                ref={progressKnobRef}
                className="absolute top-1/2 w-4 h-4 bg-white border-2 border-[rgb(69,197,255)] rounded-full transform -translate-y-1/2 cursor-grab shadow-md hover:scale-110 transition-transform"
                style={{
                  left: `${progressPercentage}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseDown={startProgressDrag}
                onMouseOver={() => progressKnobRef.current?.classList.add('scale-110')}
                onMouseOut={() => progressKnobRef.current?.classList.remove('scale-110')}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
          </div>
        </div>

        {/* 右侧按钮组 */}
        <div className="flex items-center space-x-2">
          {/* 下载按钮 */}
          <DownloadButton
            url={audioUrl}
            filename={`${title || 'music'}.mp3`}
            onDownloadStart={() => console.log('开始下载')}
            onError={(error) => console.error('下载失败', error)}
          />

          {/* 添加到播放列表按钮 */}
          <button
            onClick={handleAddToPlaylist}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-white transition-colors ${isAddedToPlaylist ? 'bg-green-400 hover:bg-green-500' : 'bg-[rgb(155,90,213)] hover:bg-[rgb(135,70,193)]'}`}
            title="添加到播放列表"
          >
            {isAddedToPlaylist ? <FaCheck /> : <FaPlus />}
          </button>

          {/* 音量控制 */}
          <div className="relative">
            <button
              onClick={() => setShowVolumeControl(!showVolumeControl)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-black hover:bg-gray-100"
            >
              {globalVolume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>

            {showVolumeControl && (
              <>
                {/* 桌面端音量控制 - 垂直布局 */}
                <div className="absolute bottom-full right-0 mb-2 p-2 bg-white rounded-full shadow-lg border border-gray-300 hidden md:block">
                  <div
                    ref={volumeBarRef}
                    className="w-1 h-20 bg-gray-300 rounded-full cursor-pointer relative mx-auto my-1"
                    onClick={handleVolumeChange}
                  >
                    <div
                      className="absolute bottom-0 left-0 w-full bg-[rgb(69,197,255)] rounded-full"
                      style={{ height: `${globalVolume * 100}%` }}
                    ></div>

                    <div
                      ref={volumeKnobRef}
                      className="absolute w-4 h-4 bg-white border-2 border-[rgb(69,197,255)] rounded-full -left-1.5 transform -translate-y-1/2 cursor-grab shadow-md hover:scale-110 transition-transform"
                      style={{ bottom: `${globalVolume * 100}%`, transform: 'translateY(50%)' }}
                      onMouseDown={startVolumeDrag}
                      onMouseOver={() => volumeKnobRef.current?.classList.add('scale-110')}
                      onMouseOut={() => volumeKnobRef.current?.classList.remove('scale-110')}
                    ></div>
                  </div>
                </div>

                {/* 移动端音量控制 - 水平布局，在图标下方 */}
                <div className="absolute top-full right-1/2 transform translate-x-1/2 mt-2 p-2 bg-white rounded-full shadow-lg border border-gray-300 md:hidden">
                  <div
                    ref={mobileVolumeBarRef}
                    className="h-1 w-20 bg-gray-300 rounded-full cursor-pointer relative mx-auto my-1"
                    onClick={handleMobileVolumeChange}
                  >
                    <div
                      className="absolute top-0 left-0 h-full bg-[rgb(69,197,255)] rounded-full"
                      style={{ width: `${globalVolume * 100}%` }}
                    ></div>

                    <div
                      className="absolute top-1/2 w-4 h-4 bg-white border-2 border-[rgb(69,197,255)] rounded-full transform -translate-y-1/2 cursor-grab shadow-md hover:scale-110 transition-transform"
                      style={{ left: `${globalVolume * 100}%`, transform: 'translate(-50%, -50%)' }}
                      onMouseDown={startMobileVolumeDrag}
                    ></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default MusicPlayer
