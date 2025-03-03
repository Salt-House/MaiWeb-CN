'use client'

import { useState, useEffect, useRef } from 'react'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'

interface MusicPlayerProps {
  audioUrl: string
  title?: string
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const [isDraggingVolume, setIsDraggingVolume] = useState(false)
  const [isDraggingProgress, setIsDraggingProgress] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressBarRef = useRef<HTMLDivElement | null>(null)
  const volumeBarRef = useRef<HTMLDivElement | null>(null)
  const volumeKnobRef = useRef<HTMLDivElement | null>(null)
  const progressKnobRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const audio = new Audio(audioUrl)
    audioRef.current = audio

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
    })

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
    })

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
    })

    audio.volume = volume

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('loadedmetadata', () => { })
      audio.removeEventListener('timeupdate', () => { })
      audio.removeEventListener('ended', () => { })
    }
  }, [audioUrl])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return

    const progressBar = progressBarRef.current
    const rect = progressBar.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const newProgress = offsetX / rect.width

    if (newProgress >= 0 && newProgress <= 1) {
      const newTime = newProgress * duration
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current || !audioRef.current) return

    const volumeBar = volumeBarRef.current
    const rect = volumeBar.getBoundingClientRect()
    const offsetY = rect.bottom - e.clientY
    const newVolume = Math.max(0, Math.min(1, offsetY / rect.height))

    audioRef.current.volume = newVolume
    setVolume(newVolume)
  }

  const startVolumeDrag = (e: React.MouseEvent) => {
    setIsDraggingVolume(true)
    handleVolumeChange(e as React.MouseEvent<HTMLDivElement>)

    function onMouseMove(e: MouseEvent) {
      if (!volumeBarRef.current || !audioRef.current) return

      const volumeBar = volumeBarRef.current
      const rect = volumeBar.getBoundingClientRect()
      const offsetY = rect.bottom - e.clientY
      const newVolume = Math.max(0, Math.min(1, offsetY / rect.height))

      audioRef.current.volume = newVolume
      setVolume(newVolume)
    }

    const onMouseUp = () => {
      setIsDraggingVolume(false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const startProgressDrag = (e: React.MouseEvent) => {
    setIsDraggingProgress(true)
    handleProgressChange(e as React.MouseEvent<HTMLDivElement>)

    function onMouseMove(e: MouseEvent) {
      if (!progressBarRef.current || !audioRef.current) return

      const progressBar = progressBarRef.current
      const rect = progressBar.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const newProgress = Math.max(0, Math.min(1, offsetX / rect.width))

      const newTime = newProgress * duration
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
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

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-3 flex items-center space-x-4 border-2 border-[rgb(155,244,236)]">
      {/* 播放/暂停按钮 */}
      <button
        onClick={togglePlay}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[rgb(69,197,255)] text-white hover:bg-[rgb(55,180,235)] transition-colors"
      >
        {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
      </button>

      {/* 进度条 */}
      <div className="flex-1">
        {/* {title && <div className="text-sm font-medium text-gray-700 mb-1">{title}</div>} */}
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
          <div
            ref={progressBarRef}
            className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer relative"
            onClick={handleProgressChange}
          >
            <div
              className="absolute top-0 left-0 h-full bg-[rgb(69,197,255)] rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>

            <div
              ref={progressKnobRef}
              className="absolute top-1/2 w-4 h-4 bg-white border-2 border-[rgb(69,197,255)] rounded-full transform -translate-y-1/2 cursor-grab shadow-md hover:scale-110 transition-transform"
              style={{
                left: `${(currentTime / duration) * 100}%`,
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

      {/* 音量控制 */}
      <div className="relative">
        <button
          onClick={() => setShowVolumeControl(!showVolumeControl)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
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
                style={{ height: `${volume * 100}%` }}
              ></div>

              <div
                ref={volumeKnobRef}
                className="absolute w-4 h-4 bg-white border-2 border-[rgb(69,197,255)] rounded-full -left-1.5 transform -translate-y-1/2 cursor-grab shadow-md hover:scale-110 transition-transform"
                style={{ bottom: `${volume * 100}%`, transform: 'translateY(50%)' }}
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