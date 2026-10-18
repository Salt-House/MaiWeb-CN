"use client"

import { useState, useRef } from "react"
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaPlus, FaCheck } from "react-icons/fa"
import { motion } from "framer-motion"
import { usePlayer } from "@/app/context/PlayerContext"
import DownloadButton from "@/components/ui/button/DownloadButton"
import { CONFIG } from "@/config/api"

interface MusicPlayerProps {
  audioUrl: string
  title?: string
  artist?: string
  songId?: string
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioUrl, title, artist, songId }) => {
  const [isAddedToPlaylist, setIsAddedToPlaylist] = useState(false)
  const progressBarRef = useRef<HTMLDivElement | null>(null)
  const volumeBarRef = useRef<HTMLInputElement | null>(null)

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
    duration: globalDuration,
  } = usePlayer()

  const isCurrentTrack =
    currentTrack && (currentTrack.id === songId || currentTrack.audioUrl === audioUrl)

  const handleTogglePlay = () => {
    if (isCurrentTrack) {
      togglePlay()
    } else {
      playTrack({
        id: songId || title || "unknown",
        title: title || "未知歌曲",
        artist: artist || "未知艺术家",
        audioUrl,
        coverUrl: `${CONFIG.ASSETS.MAIMAI.JACKET}/${songId || "default"}.png`,
      })
    }
  }

  const handleAddToPlaylist = () => {
    addToPlaylist({
      id: songId || title || "unknown",
      title: title || "未知歌曲",
      artist: artist || "未知艺术家",
      audioUrl,
      coverUrl: `${CONFIG.ASSETS.MAIMAI.JACKET}/${songId || "default"}.png`,
    })

    setIsAddedToPlaylist(true)

    setTimeout(() => {
      setIsAddedToPlaylist(false)
    }, 1000)
  }

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !isCurrentTrack) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const newProgress = Math.max(0, Math.min(1, offsetX / rect.width))
    setGlobalProgress(newProgress)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setGlobalVolume(newVolume)
  }

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const currentTime = isCurrentTrack ? globalCurrentTime : 0
  const duration = isCurrentTrack ? globalDuration : 0
  const displayIsPlaying = isCurrentTrack ? isPlaying : false
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <motion.div
      className="w-full p-6 rounded-3xl bg-white border-4 border-mai-blue-deep shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Progress Bar */}
        <div className="w-full flex items-center space-x-3">
          <span className="text-xs text-mai-ink/70 w-10 text-center">{formatTime(currentTime)}</span>
          <div
            ref={progressBarRef}
            className="flex-1 h-2 rounded-full cursor-pointer bg-mai-blue-deep/10 border border-mai-blue-deep/30"
            onClick={handleProgressChange}
          >
            <motion.div
              className="h-full rounded-full bg-mai-purple"
              style={{ width: `${progressPercentage}%` }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
          <span className="text-xs text-mai-ink/70 w-10 text-center">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="w-full flex justify-center items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToPlaylist}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-mai-blue-deep border-2 border-mai-blue-deep/50 shadow-sm hover:bg-mai-yellow/40 hover:border-mai-blue-deep transition-colors"
            title="添加到播放列表"
          >
            {isAddedToPlaylist ? (
              <FaCheck className="size-6 text-green-500" />
            ) : (
              <FaPlus className="size-6" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTogglePlay}
            className="w-16 h-16 flex items-center justify-center rounded-full text-white shadow-lg shadow-mai-blue-deep/30 transition-all border-2 border-mai-yellow bg-mai-purple"
          >
            {displayIsPlaying ? <FaPause size={20} /> : <FaPlay size={20} className="ml-1" />}
          </motion.button>

          <DownloadButton
            url={audioUrl}
            filename={`${title || "music"}.mp3`}
            variant="outline"
            shape="circle"
          />
        </div>

        {/* Volume Control */}
        <div className="w-full flex items-center justify-center space-x-2 pt-2">
          <FaVolumeMute className="text-mai-ink/70" />
          <div className="relative w-32 h-2 flex items-center">
            <div className="w-full h-1.5 bg-mai-blue-deep/10 rounded-full border border-mai-blue-deep/30" />
            <div
              className="absolute h-1.5 bg-mai-purple rounded-full"
              style={{ width: `${globalVolume * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={globalVolume}
              onChange={handleVolumeChange}
              className="absolute w-full h-full appearance-none cursor-pointer bg-transparent"
              ref={volumeBarRef}
            />
          </div>
          <FaVolumeUp className="text-mai-ink/70" />
        </div>
      </div>
    </motion.div>
  )
}
export default MusicPlayer
