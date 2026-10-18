"use client"

import { useCallback, useEffect, useState, type MouseEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { FaCheck, FaPlus, FaSyncAlt } from "react-icons/fa"
import { ChartType, type DifficultyInfo, type Song } from "@/types/music"
import { getGenreColor, transferText } from "@/utils/music"
import { usePlayer } from "@/app/context/PlayerContext"
import { getSongs as fetchSongs } from "@/services/music"
import { CONFIG } from "@/config/api"

/** 与乐曲列表页保持一致的当前版本号（舞萌DX 2025） */
const CURRENT_VERSION = "25008"
/** 首页一次展示的推荐数量 */
const RECOMMEND_COUNT = 5

/**
 * 取歌曲的最高难度（DX 与 STANDARD 合并比较）用于展示
 */
function getTopDifficulty(song: Song): DifficultyInfo | null {
  const all = [...song.difficulties.dx, ...song.difficulties.standard]
  if (all.length === 0) return null
  return all.reduce((top, cur) => (cur.level_value > top.level_value ? cur : top))
}

/** 难度描边颜色（与乐曲列表页 SongItem 保持一致） */
function getStrokeColor(level_index: number): string {
  switch (level_index) {
    case 0:
      return "#437f25" // Basic
    case 1:
      return "#956e05" // Advanced
    case 2:
      return "#994d55" // Expert
    case 3:
      return "#5f3184" // Master
    case 4:
      return "#ffffff" // Re:MASTER
    default:
      return "#ffffff"
  }
}

/** 难度文字颜色（Re:MASTER 为深紫，其余为白色） */
function getTextColor(level_index: number): string {
  return level_index === 4 ? "#5f3184" : "#ffffff"
}

/**
 * 单条推荐乐曲行（乐曲列表页 SongItem 的紧凑版）
 * 保留「星象魔法阵曲绘圆盘 + 鎏金虚线环 + 紫罗兰渐变胶囊」的 MAGiCAL 视觉语言
 */
function RecommendSongRow({ song, index }: { song: Song; index: number }) {
  const { addToPlaylist } = usePlayer()
  const [isAdded, setIsAdded] = useState(false)

  const topDiff = getTopDifficulty(song)
  const genreColor = getGenreColor(song.genre)

  /** 添加到播放列表（不打断跳转） */
  const handleAddToPlaylist = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToPlaylist({
      id: `${song.id}`,
      title: song.title,
      artist: song.artist,
      audioUrl: `${CONFIG.ASSETS.MAIMAI.MUSIC}/${song.id}.mp3`,
      coverUrl: `${CONFIG.ASSETS.MAIMAI.JACKET}/${song.id || "default"}.png`,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1000)
  }

  return (
    <motion.a
      href={`${CONFIG.API.WEB.MUSIC}/${song.id}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => localStorage.setItem(`song_${song.id}`, JSON.stringify(song))}
      className="group relative flex items-center gap-2 w-full rounded-full pl-1.5 pr-2 py-1.5 border-2 border-amber-200/70 overflow-hidden"
      style={{
        // MAGiCAL 主题配色：魔法王国幻紫渐变 + 柔和星光内高光
        background: "linear-gradient(135deg, #5b21b6 0%, #7e22ce 52%, #a855f7 100%)",
        boxShadow:
          "0 6px 14px rgba(88, 28, 135, 0.35), inset 0 1px 4px rgba(254, 243, 199, 0.3)",
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.4 }}
      whileHover={{
        y: -2,
        scale: 1.02,
        boxShadow:
          "0 10px 20px rgba(107, 33, 168, 0.5), 0 0 14px rgba(251, 191, 36, 0.3), inset 0 1px 5px rgba(254, 243, 199, 0.4)",
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 曲绘圆盘：『時渡りの時計』式魔法阵（紧凑版） */}
      <div
        className="relative size-12 lg:size-14 shrink-0 rounded-full border-2 border-amber-300/90"
        style={{
          background: "radial-gradient(circle, #3b0764 0%, #581c87 65%, #7e22ce 100%)",
          boxShadow:
            "4px 4px 10px rgba(59, 7, 100, 0.45), -3px -3px 8px rgba(233, 213, 255, 0.5), 0 0 8px rgba(251, 191, 36, 0.35)",
        }}
      >
        <div className="absolute inset-1 rounded-full overflow-hidden border border-amber-200/50">
          <Image
            src={`${CONFIG.ASSETS.MAIMAI.JACKET}/${song.id}.png`}
            alt={song.title}
            fill
            sizes="56px"
            unoptimized
            className="rounded-full object-cover transition-transform duration-700 group-hover:rotate-180"
          />
        </div>
        {/* 魔法阵鎏金虚线外环 */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: "2px dashed rgba(253, 230, 138, 0.65)" }}
        />
        {/* 魔法阵内环 */}
        <div
          className="absolute inset-2.5 rounded-full pointer-events-none"
          style={{ border: "1px dotted rgba(245, 208, 254, 0.7)" }}
        />
      </div>

      {/* 歌名 / 艺术家 / 分类与难度 */}
      <div className="flex-1 min-w-0 flex flex-col">
        <p className="text-white font-bold text-sm truncate drop-shadow-[0_1px_2px_rgba(59,7,100,0.8)]">
          {song.title}
        </p>
        <p className="text-purple-100/90 text-xs truncate">{song.artist}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="inline-flex items-center px-1.5 py-[1px] text-[10px] font-semibold text-white rounded-full border truncate max-w-[92px]"
            style={{ backgroundColor: genreColor.bg, borderColor: genreColor.border }}
          >
            {transferText(song.genre)}
          </span>
          {topDiff && (
            <span className="inline-flex items-center gap-0.5">
              <span className="text-[9px] font-bold text-purple-200/90 leading-none">
                {topDiff.type === ChartType.DX ? "DX" : "STD"}
              </span>
              <span className="relative text-sm font-bold leading-none">
                <span
                  className="absolute inset-0 text-sm font-bold"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: `2.5px ${getStrokeColor(topDiff.level_index)}`,
                  }}
                >
                  {topDiff.level}
                </span>
                <span style={{ color: getTextColor(topDiff.level_index) }}>{topDiff.level}</span>
              </span>
            </span>
          )}
        </div>
      </div>

      {/* 添加到播放列表按钮 */}
      <button
        onClick={handleAddToPlaylist}
        title="添加到播放列表"
        aria-label="添加到播放列表"
        className={`shrink-0 size-7 flex items-center justify-center rounded-full text-white text-xs border border-amber-200/80 shadow-md transition-all duration-300 ${
          isAdded ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-600 hover:bg-rose-500"
        }`}
      >
        {isAdded ? <FaCheck /> : <FaPlus />}
      </button>
    </motion.a>
  )
}

/**
 * 首页乐曲推荐卡片
 * 数据取自最新版本乐曲池，本地随机抽取推荐；
 * 布局结构与 KaleidoscopeCard 一致（lg:h-full → flex-1 链路），
 * 保证与右侧 SearchGameCenter 等高显示。
 */
const RecommendMusicCard = () => {
  const [pool, setPool] = useState<Song[]>([])
  const [shown, setShown] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  /** 从曲池中随机抽取一批推荐（Fisher-Yates 洗牌） */
  const shuffleShow = useCallback((list: Song[]) => {
    const shuffled = [...list]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setShown(shuffled.slice(0, RECOMMEND_COUNT))
  }, [])

  /** 拉取最新版本乐曲池 */
  const load = useCallback(async () => {
    setLoading(true)
    setFailed(false)
    try {
      const data = await fetchSongs(`version=${CURRENT_VERSION}`, 1, 100)
      if (data && data.length > 0) {
        setPool(data)
        shuffleShow(data)
      } else {
        setFailed(true)
      }
    } catch (err) {
      console.error("获取推荐乐曲失败:", err)
      setFailed(true)
    } finally {
      setLoading(false)
    }
  }, [shuffleShow])

  useEffect(() => {
    // TODO(v2): 迁移至 useSyncExternalStore，消除级联渲染
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  return (
    <div className="w-full lg:h-full flex justify-center">
      <div className="w-full lg:h-full max-w-[900px] max-sm:w-[90%] lg:flex lg:flex-col">
        <motion.div
          className="relative my-10 w-full lg:flex-1 flex flex-col items-center rounded-2xl overflow-visible"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* MAGiCAL 黄色标头横幅: 音符 + 乐曲推荐 + 换一批 */}
          <motion.div
            className="relative z-10 w-full border-b-4 border-mai-blue-deep bg-mai-yellow py-2 px-4 rounded-t-3xl flex items-center justify-center gap-3"
            initial={{ scale: 0, rotate: -3 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.45, duration: 0.8, delay: 0.2 }}
          >
            <Image
              src="/assets/maiDecorationBg/note_02.png"
              alt=""
              width={28}
              height={28}
              className="w-6 h-6 max-sm:hidden"
            />
            <span className="text-lg sm:text-2xl font-bold tracking-widest text-mai-blue-deep">
              乐曲推荐
            </span>
            <button
              onClick={() => shuffleShow(pool)}
              disabled={loading || pool.length === 0}
              className="w-8 h-8 flex items-center justify-center rounded-full text-mai-blue-deep hover:bg-mai-blue-deep/10 disabled:opacity-40 transition-colors"
              title="换一批推荐"
              aria-label="换一批推荐"
            >
              <FaSyncAlt className={`text-sm ${loading ? "animate-spin" : ""}`} />
            </button>
          </motion.div>

          {/* 卡片白色背景（呼吸光晕阴影，与首页其它卡片一致） */}
          <motion.div
            className="absolute rounded-3xl inset-x-0 inset-y-0 z-[-1] bg-white/95 border-4 border-mai-blue-deep shadow-2xl"
            animate={{
              boxShadow: [
                "0 25px 50px -12px rgba(1, 45, 123, 0.35)",
                "0 25px 50px -12px rgba(111, 52, 176, 0.30)",
                "0 25px 50px -12px rgba(1, 45, 123, 0.35)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* 推荐乐曲列表 */}
          <div className="relative z-10 w-full lg:flex-1 flex flex-col justify-center gap-2.5 px-3 py-4">
            {failed ? (
              <div className="flex flex-col items-center gap-3 py-8 text-mai-ink/60 text-sm">
                <p>推荐乐曲加载失败</p>
                <button
                  onClick={load}
                  className="px-4 py-1.5 rounded-full bg-mai-yellow border-2 border-mai-blue-deep text-mai-blue-deep font-bold hover:bg-mai-yellow/80 transition-colors"
                >
                  重试
                </button>
              </div>
            ) : loading ? (
              Array.from({ length: RECOMMEND_COUNT }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="flex items-center gap-2 w-full rounded-full py-1.5 pl-1.5 pr-2 border-2 border-gray-200 bg-gray-100/80 animate-pulse"
                >
                  <div className="size-12 lg:size-14 shrink-0 rounded-full bg-gray-300/70" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="h-3 rounded bg-gray-300/70 w-3/4" />
                    <div className="h-2.5 rounded bg-gray-300/50 w-1/2" />
                    <div className="h-2.5 rounded bg-gray-300/40 w-1/3" />
                  </div>
                </div>
              ))
            ) : (
              shown.map((song, index) => (
                <RecommendSongRow key={`${song.id}-${index}`} song={song} index={index} />
              ))
            )}
          </div>

          {/* 查看全部乐曲入口 */}
          <Link
            href="/music"
            className="relative z-10 w-full text-center text-mai-purple font-bold text-sm py-2.5 border-t-2 border-dashed border-mai-blue-deep/20 hover:text-mai-blue-deep transition-colors"
          >
            查看全部乐曲 &gt;&gt;
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default RecommendMusicCard
