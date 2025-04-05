'use client'

import { useState, useEffect, useRef } from 'react'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaPlus } from 'react-icons/fa'
import { usePlayer } from '@/app/context/PlayerContext'

interface MusicPlayerProps {
  audioUrl: string
  title?: string
  songId?: string
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioUrl, title, songId }) => {
  // 本地状态，用于非当前播放歌曲的情况
  const [localCurrentTime, setLocalCurrentTime] = useState(0)
  const [localDuration, setLocalDuration] = useState(0)
  const [localIsPlaying, setLocalIsPlaying] = useState(false)

  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const [isDraggingVolume, setIsDraggingVolume] = useState(false)
  const [isDraggingProgress, setIsDraggingProgress] = useState(false)
  const progressBarRef = useRef<HTMLDivElement | null>(null)
  const volumeBarRef = useRef<HTMLDivElement | null>(null)
  const volumeKnobRef = useRef<HTMLDivElement | null>(null)
  const progressKnobRef = useRef<HTMLDivElement | null>(null)
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
      audioUrl,
      coverUrl: `https://assets2.lxns.net/maimai/jacket/${songId || 'default'}.png`
    })
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

  // 处理音量变化
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

  // 音量拖动
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
    <div className="w-full bg-white rounded-lg shadow-md p-3 flex items-center space-x-4 border-2 border-[rgb(155,244,236)]">
      {/* 播放/暂停按钮 */}
      <button
        onClick={handleTogglePlay}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[rgb(69,197,255)] text-white hover:bg-[rgb(55,180,235)] transition-colors"
      >
        {displayIsPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
      </button>

      {/* 进度条 */}
      <div className="flex-1">
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

      {/* 添加到播放列表按钮 */}
      <button
        onClick={handleAddToPlaylist}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgb(155,90,213)] text-white hover:bg-[rgb(135,70,193)] transition-colors"
        title="添加到播放列表"
      >
        <FaPlus />
      </button>

      {/* 音量控制 */}
      <div className="relative">
        <button
          onClick={() => setShowVolumeControl(!showVolumeControl)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          {globalVolume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>

        {showVolumeControl && (
          <div className="absolute bottom-full right-0 mb-2 p-2 bg-white rounded-full shadow-lg border border-gray-300">
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
        )}
      </div>
    </div>
  )
}
export default MusicPlayer
