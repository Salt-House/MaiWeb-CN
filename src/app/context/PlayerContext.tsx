"use client"

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react"

export interface PlaylistItem {
  id: string
  title: string
  artist: string
  audioUrl: string
  coverUrl: string
}

// 播放模式枚举
export enum PlayMode {
  SEQUENCE = "sequence", // 顺序播放
  SINGLE = "single", // 单曲循环
}

export interface PlayerContextType {
  currentTrack: PlaylistItem | null
  playlist: PlaylistItem[]
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playMode: PlayMode
  addToPlaylist: (track: PlaylistItem) => void
  removeFromPlaylist: (id: string) => void
  playTrack: (track: PlaylistItem) => void
  togglePlay: () => void
  nextTrack: () => void
  previousTrack: () => void
  clearPlaylist: () => void
  setProgress: (progress: number) => void
  setVolume: (volume: number) => void
  togglePlayMode: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<PlaylistItem | null>(null)
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [playMode, setPlayMode] = useState<PlayMode>(PlayMode.SEQUENCE) // 默认顺序播放

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 初始化音频元素
  useEffect(() => {
    // TODO 优化：封装音频元素初始化到独立函数，避免重复；在 SSR 环境检测 window
    const audio = new Audio()
    audio.volume = volume
    audioRef.current = audio

    // 监听音频事件
    // TODO 事件：提取具名回调以便在 cleanup 中正确移除监听
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime)
    })

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration)
    })

    audio.addEventListener("ended", handleTrackEnded)

    return () => {
      audio.pause()
      audio.src = ""
      // TODO 清理：当前移除监听使用不同匿名函数，无法正确移除；需保存同一函数引用
      audio.removeEventListener("timeupdate", () => {})
      audio.removeEventListener("loadedmetadata", () => {})
      audio.removeEventListener("ended", handleTrackEnded)
    }
  }, [])

  // 处理音频结束事件的函数
  const handleTrackEnded = () => {
    if (playMode === PlayMode.SINGLE || playlist.length <= 1) {
      // 单曲循环模式下，或者播放列表只有一首歌时，重新播放当前歌曲
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(error => {
          console.error("重新播放失败:", error)
        })
      }
    } else {
      // 顺序播放模式下，播放下一首
      if (currentTrack && playlist.length > 1) {
        const currentIndex = playlist.findIndex(item => item.id === currentTrack.id)

        // 如果找不到当前歌曲或者是播放列表中的最后一首
        if (currentIndex === -1 || currentIndex === playlist.length - 1) {
          // 循环到第一首
          setCurrentTrack(playlist[0])
        } else {
          // 播放下一首
          setCurrentTrack(playlist[currentIndex + 1])
        }

        // 确保自动开始播放
        setIsPlaying(true)
      }
    }
  }

  // 更新音频结束事件处理函数的依赖
  useEffect(() => {
    if (!audioRef.current) return

    // 移除旧的事件监听器
    audioRef.current.removeEventListener("ended", handleTrackEnded)

    // 添加新的事件监听器
    audioRef.current.addEventListener("ended", handleTrackEnded)

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleTrackEnded)
      }
    }
  }, [playMode, currentTrack, playlist]) // 添加所有相关依赖

  // 从本地存储加载播放列表和播放模式
  useEffect(() => {
    const savedPlaylist = localStorage.getItem("music_playlist")
    const savedCurrentTrack = localStorage.getItem("music_current_track")
    const savedVolume = localStorage.getItem("music_volume")
    const savedPlayMode = localStorage.getItem("music_play_mode")
    // TODO 容错：为 JSON.parse 添加 try/catch；并校验对象结构

    if (savedPlaylist) {
      setPlaylist(JSON.parse(savedPlaylist))
    }

    if (savedCurrentTrack) {
      setCurrentTrack(JSON.parse(savedCurrentTrack))
    }

    if (savedVolume) {
      const vol = parseFloat(savedVolume)
      setVolume(vol)
      if (audioRef.current) {
        audioRef.current.volume = vol
      }
    }

    if (savedPlayMode) {
      setPlayMode(savedPlayMode as PlayMode)
    }
  }, [])

  // 保存播放列表和播放模式到本地存储
  useEffect(() => {
    // TODO 存储：考虑节流写入或在页面卸载时写入，减少频繁 localStorage 操作
    if (playlist.length > 0) {
      localStorage.setItem("music_playlist", JSON.stringify(playlist))
    }

    if (currentTrack) {
      localStorage.setItem("music_current_track", JSON.stringify(currentTrack))
    }

    localStorage.setItem("music_play_mode", playMode)
  }, [playlist, currentTrack, playMode])

  // 保存音量设置
  useEffect(() => {
    localStorage.setItem("music_volume", volume.toString())
  }, [volume])

  // 当当前曲目改变时，更新音频源
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return

    audioRef.current.src = currentTrack.audioUrl
    audioRef.current.load()

    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error("播放失败:", error)
        setIsPlaying(false)
      })
    }
  }, [currentTrack])

  // 控制播放/暂停
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return

    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error("播放失败:", error)
        setIsPlaying(false)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentTrack])

  // 切换播放模式
  const togglePlayMode = () => {
    // 记录当前的播放状态
    const wasPlaying = isPlaying

    setPlayMode(prevMode => (prevMode === PlayMode.SEQUENCE ? PlayMode.SINGLE : PlayMode.SEQUENCE))

    // 如果切换前是播放状态，确保切换后仍然保持播放
    if (wasPlaying && !isPlaying && audioRef.current) {
      setIsPlaying(true)
    }
  }

  const addToPlaylist = (track: PlaylistItem) => {
    // 检查是否已存在于播放列表中
    if (!playlist.some(item => item.id === track.id)) {
      setPlaylist(prev => [...prev, track])
    }

    // 如果当前没有播放的曲目，设置为当前曲目
    if (!currentTrack) {
      setCurrentTrack(track)
    }
  }

  const removeFromPlaylist = (id: string) => {
    // 检查是否是当前播放的曲目
    const isCurrentTrack = currentTrack && currentTrack.id === id

    // 获取当前索引和更新后的播放列表
    const currentIndex = playlist.findIndex(item => item.id === id)
    const updatedPlaylist = playlist.filter(item => item.id !== id)

    // 更新播放列表状态
    setPlaylist(updatedPlaylist)

    // 如果删除的是当前播放的曲目
    if (isCurrentTrack) {
      // 停止当前音频播放
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }

      // 如果更新后的播放列表不为空，切换到新的曲目
      if (updatedPlaylist.length > 0) {
        // 确定下一首要播放的歌曲索引
        let nextIndex = currentIndex
        // 如果删除的是最后一首，则播放第一首
        if (nextIndex >= updatedPlaylist.length) {
          nextIndex = 0
        }

        // 设置新的当前曲目
        setCurrentTrack(updatedPlaylist[nextIndex])
        // 保持播放状态
        setIsPlaying(true)
      } else {
        // 如果播放列表为空，清除当前曲目并停止播放
        setCurrentTrack(null)
        setIsPlaying(false)
      }
    }
  }

  const playTrack = (track: PlaylistItem) => {
    setCurrentTrack(track)
    setIsPlaying(true)

    // 如果曲目不在播放列表中，添加到播放列表
    if (!playlist.some(item => item.id === track.id)) {
      setPlaylist(prev => [...prev, track])
    }
  }

  const togglePlay = () => {
    setIsPlaying(prev => !prev)
  }

  const nextTrack = () => {
    if (!currentTrack) return

    // 如果播放列表只有一首歌，重新播放当前歌曲
    if (playlist.length <= 1) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(error => {
          console.error("重新播放失败:", error)
        })
      }
      return
    }

    // 查找当前歌曲在播放列表中的索引
    const currentIndex = playlist.findIndex(item => item.id === currentTrack.id)

    // 如果找不到当前歌曲或者是播放列表中的最后一首
    if (currentIndex === -1 || currentIndex === playlist.length - 1) {
      // 循环到第一首
      setCurrentTrack(playlist[0])
    } else {
      // 播放下一首
      setCurrentTrack(playlist[currentIndex + 1])
    }

    // 确保自动开始播放
    setIsPlaying(true)
  }

  const previousTrack = () => {
    if (!currentTrack || playlist.length <= 1) return

    // 查找当前歌曲在播放列表中的索引
    const currentIndex = playlist.findIndex(item => item.id === currentTrack.id)

    // 如果找不到当前歌曲或者是播放列表中的第一首
    if (currentIndex === -1 || currentIndex === 0) {
      // 循环到最后一首
      setCurrentTrack(playlist[playlist.length - 1])
    } else {
      // 播放上一首
      setCurrentTrack(playlist[currentIndex - 1])
    }

    // 确保自动开始播放
    setIsPlaying(true)
  }

  const clearPlaylist = () => {
    setPlaylist([])
    setCurrentTrack(null)
    setIsPlaying(false)
    localStorage.removeItem("music_playlist")
    localStorage.removeItem("music_current_track")
  }

  // 设置进度
  const setProgress = (progress: number) => {
    // TODO 边界：约束 progress 到 [0,1]；并处理 duration 为 NaN 的情况
    if (!audioRef.current) return

    const newTime = progress * audioRef.current.duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // 设置音量
  const setVolumeValue = (newVolume: number) => {
    // TODO 边界：将音量范围限制为 [0,1]；并同步到 localStorage
    if (!audioRef.current) return

    audioRef.current.volume = newVolume
    setVolume(newVolume)
  }

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        playlist,
        isPlaying,
        currentTime,
        duration,
        volume,
        playMode,
        addToPlaylist,
        removeFromPlaylist,
        playTrack,
        togglePlay,
        nextTrack,
        previousTrack,
        clearPlaylist,
        setProgress,
        setVolume: setVolumeValue,
        togglePlayMode,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider")
  }
  return context
}
