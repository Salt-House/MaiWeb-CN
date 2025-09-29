"use client"

import { useState, useRef } from "react"
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaPlus, FaCheck } from "react-icons/fa"
import { motion } from "framer-motion"
import { usePlayer } from "@/app/context/PlayerContext"
import DownloadButton from "@/app/components/button/DownloadButton"

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
        coverUrl: `https://assets2.lxns.net/maimai/jacket/${songId || "default"}.png`,
      })
    }
  }

  const handleAddToPlaylist = () => {
    addToPlaylist({
      id: songId || title || "unknown",
      title: title || "未知歌曲",
      artist: artist || "未知艺术家",
      audioUrl,
      coverUrl: `https://assets2.lxns.net/maimai/jacket/${songId || "default"}.png`,
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
      className="w-full p-6 rounded-3xl bg-[#F0F2F5] border border-slate-300/50 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Progress Bar */}
        <div className="w-full flex items-center space-x-3">
          <span className="text-xs text-gray-500 w-10 text-center">{formatTime(currentTime)}</span>
          <div
            ref={progressBarRef}
            className="flex-1 h-2 rounded-full cursor-pointer bg-slate-200 border border-slate-300/70"
            onClick={handleProgressChange}
          >
            <motion.div
              className="h-full bg-pink-400 rounded-full"
              style={{ width: `${progressPercentage}%` }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
          <span className="text-xs text-gray-500 w-10 text-center">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="w-full flex justify-center items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToPlaylist}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F0F2F5] text-gray-600 border border-white/60 shadow-sm transition-colors"
            title="添加到播放列表"
          >
            {isAddedToPlaylist ? <FaCheck className="text-green-500" /> : <FaPlus />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTogglePlay}
            className="w-20 h-20 flex items-center justify-center rounded-full bg-pink-400 text-white shadow-lg shadow-pink-400/30 transition-colors"
          >
            {displayIsPlaying ? <FaPause size={28} /> : <FaPlay size={28} className="ml-1" />}
          </motion.button>

          <DownloadButton
            url={audioUrl}
            filename={`${title || "music"}.mp3`}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#F0F2F5] text-gray-600 border border-white/60 shadow-sm transition-colors"
          />
        </div>

        {/* Volume Control */}
        <div className="w-full flex items-center justify-center space-x-2 pt-2">
          <FaVolumeMute className="text-gray-500" />
          <div className="relative w-32 h-2 flex items-center">
            <div className="w-full h-1.5 bg-slate-200 rounded-full border border-slate-300/70" />
            <div
              className="absolute h-1.5 bg-pink-400 rounded-full"
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
          <FaVolumeUp className="text-gray-500" />
        </div>
      </div>
    </motion.div>
  )
}
export default MusicPlayer
