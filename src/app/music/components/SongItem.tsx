import { Song, getGenreColor, transferText } from "@/app/music/songModel"
import { FaPlus, FaCheck } from "react-icons/fa"
import { usePlayer } from "@/app/context/PlayerContext"
import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { CONFIG } from "@/config/api"

interface SongItemProps {
  song: Song
  displayMode: "level" | "level_value"
}

/**
 * 单个歌曲项组件
 * 显示歌曲的详细信息，包括封面、标题、艺术家、难度等级等
 * 支持添加到播放列表功能
 */
export default function SongItem({ song, displayMode }: SongItemProps) {
  const { addToPlaylist } = usePlayer()
  const [isAdded, setIsAdded] = useState(false)
  const [roate, setRoate] = useState<boolean>(false)

  /**
   * 处理添加歌曲到播放列表
   * @param song 要添加的歌曲对象
   */
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
    setIsAdded(true)

    // 1秒后恢复图标
    setTimeout(() => {
      setIsAdded(false)
    }, 1000)
  }

  return (
    <motion.div
      className="relative songitem-premium mr-10 flex items-center w-fit min-w-[450px] max-lg:min-w-[400px] max-w-[480px] max-lg:max-w-[420px] max-h-[160px] max-lg:max-h-[140px] bg-pink-500 rounded-full mb-10 max-sm:mb-4 pr-4 max-sm:w-full max-sm:min-w-0 max-sm:max-w-full max-sm:mr-0 max-sm:pr-2"
      whileHover={{ y: -4, scale: 1.02 }}
      onHoverStart={() => setRoate(true)}
      onHoverEnd={() => setRoate(false)}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.5 }}
    >
      <a
        href={`${CONFIG.API.WEB.MUSIC}/${song.id}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => localStorage.setItem(`song_${song.id}`, JSON.stringify(song))}
        className="flex items-center"
      >
        {/* 添加到播放列表按钮 */}
        <button
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            handleAddToPlaylist(song)
          }}
          className={`absolute z-10 max-sm:-left-1 max-sm:-top-1 left-0 top-0 w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-pink-600 transition-colors ${isAdded ? "bg-green-400 hover:bg-green-500" : "bg-pink-500 hover:bg-pink-600"}`}
          title="添加到播放列表"
        >
          {isAdded ? <FaCheck /> : <FaPlus />}
        </button>
        <motion.div
          className="songitem-avatar group flex-shrink-0 size-40 max-lg:size-36 max-sm:size-32 border-4 border-pink-300 rounded-full relative hover:border-pink-400 transition-colors duration-300"
          style={{
            // 外轮廓拟态阴影（无渐变）：双向阴影营造浮起感
            boxShadow: "8px 8px 16px rgba(190,24,93,0.35), -8px -8px 16px rgba(249,168,212,0.6)",
          }}
          whileHover={{
            scale: 1.03,
            boxShadow:
              "12px 12px 24px rgba(190,24,93,0.45), -12px -12px 24px rgba(249,168,212,0.7)",
          }}
          whileTap={{
            scale: 0.99,
            boxShadow: "4px 4px 8px rgba(190,24,93,0.25), -4px -4px 8px rgba(249,168,212,0.5)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* CD盘面（方案B）：虚线同心环 + 斜角外圈 + 中心孔 */}
          <div className="relative w-full h-full rounded-full">
            {/* 斜角外圈（bevel） */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: "4px solid rgba(255,255,255,0.25)",
                boxShadow:
                  "inset 6px 6px 12px rgba(190,24,93,0.20), inset -6px -6px 12px rgba(249,168,212,0.30)",
              }}
            />

            {/* 上侧高光带（无渐变，低不透明白条） */}
            <div
              className="absolute left-[16%] top-[10%] w-[68%] h-[18%] rounded-full pointer-events-none"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                transform: "rotate(-18deg)",
              }}
            />

            {/* 专辑图贴纸区域（进一步内缩，露出更多环形） */}
            <div className="absolute inset-2 rounded-full overflow-hidden">
              <Image
                src={`${CONFIG.ASSETS.MAIMAI.JACKET}/${song.id}.png`}
                alt={song.title}
                className="rounded-full object-cover"
                style={{
                  transform: roate ? "rotate(360deg)" : "rotate(0deg)",
                  transition: "transform 20s linear",
                }}
                fill
                unoptimized
              />
            </div>

            {/* 虚线同心环1 */}
            <div
              className="absolute inset-8 rounded-full pointer-events-none"
              style={{
                border: "2px dashed rgba(255,255,255,0.45)",
              }}
            />

            {/* 虚线同心环2 */}
            <div
              className="absolute inset-12 rounded-full pointer-events-none"
              style={{
                border: "2px dashed rgba(255,255,255,0.30)",
              }}
            />

            {/* 内凹过渡环 */}
            <div
              className="absolute inset-16 rounded-full pointer-events-none"
              style={{
                border: "2px solid rgba(0,0,0,0.05)",
                boxShadow:
                  "inset 3px 3px 6px rgba(190,24,93,0.16), inset -3px -3px 6px rgba(249,168,212,0.24)",
              }}
            />
          </div>

          {/* 扫头（Tonearm） */}
          <div
            aria-hidden
            className="absolute -top-6 left-6 z-20 pointer-events-none origin-top-left -rotate-[-2deg] transition-transform duration-300 "
          >
            {/* 基座（pivot） */}
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                boxShadow: "2px 2px 4px rgba(0,0,0,0.15), -2px -2px 4px rgba(255,255,255,0.5)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            />
            {/* 手臂（arm） */}
            <div
              className="mt-1 w-24 h-1.5 rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.9)",
                boxShadow: "3px 3px 6px rgba(0,0,0,0.12), -3px -3px 6px rgba(255,255,255,0.5)",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            />
            {/* 磁头（head） */}
            <div
              className="ml-[86px] mt-[-2px] w-6 h-8 rounded-md relative"
              style={{
                backgroundColor: "rgba(255,255,255,0.96)",
                boxShadow: "3px 3px 6px rgba(0,0,0,0.15), -3px -3px 6px rgba(255,255,255,0.55)",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block rounded-full"
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.25)",
                }}
              />
            </div>
          </div>
        </motion.div>
        <SongCategory genre={song.genre} />
        <div id="level" className="ml-4 max-sm:ml-2 flex flex-col justify-center items-start">
          <p className="text-white font-bold text-xl max-lg:text-lg truncate max-w-[200px] max-lg:max-w-[180px] max-sm:max-w-[150px]">
            {song.title}
          </p>
          <div className="flex flex-col mb-0.5">
            {song.difficulties.dx.length > 0 && (
              <div className="flex items-center">
                <Image
                  src={"/img/dx.png"}
                  width={60}
                  height={30}
                  alt="DX"
                  className="-ml-2 max-lg:w-14 max-sm:w-12"
                />
                {song.difficulties.dx.map(diff => (
                  <SongLevelText
                    key={diff.level_index}
                    level={
                      displayMode === "level"
                        ? diff.level
                        : Number.isInteger(diff.level_value)
                          ? `${diff.level_value}.0`
                          : diff.level_value
                    }
                    level_index={diff.level_index as 0 | 1 | 2 | 3 | 4}
                  />
                ))}
              </div>
            )}
            {song.difficulties.standard.length > 0 && (
              <div className="flex items-center">
                <Image
                  src={"/img/standard.png"}
                  width={60}
                  height={30}
                  alt="standard"
                  className="-ml-2 max-lg:w-14 max-sm:w-12"
                />
                {song.difficulties.standard.map(diff => (
                  <SongLevelText
                    key={diff.level_index}
                    level={
                      displayMode === "level"
                        ? diff.level
                        : Number.isInteger(diff.level_value)
                          ? `${diff.level_value}.0`
                          : diff.level_value
                    }
                    level_index={diff.level_index as 0 | 1 | 2 | 3 | 4}
                  />
                ))}
              </div>
            )}
            {song.difficulties.utage.length > 0 && (
              <div className="flex items-center">
                <Image
                  src={"/img/utage.png"}
                  width={60}
                  height={30}
                  alt="utage"
                  className="-ml-2 max-lg:w-14 max-sm:w-12"
                />
                {song.difficulties.utage.map(diff => (
                  <SongLevelText
                    key={diff.level_index}
                    level={
                      displayMode === "level"
                        ? diff.level
                        : Number.isInteger(diff.level_value)
                          ? `${diff.level_value}.0`
                          : diff.level_value
                    }
                    level_index={diff.level_index as 0 | 1 | 2 | 3 | 4}
                  />
                ))}
              </div>
            )}
          </div>
          <p className="text-white truncate max-w-[200px] max-lg:max-w-[180px] max-sm:max-w-[150px] mb-2">
            BPM: {song.bpm}&nbsp;&nbsp;Artist: {song.artist}
          </p>
        </div>
      </a>
    </motion.div>
  )
}

/**
 * 歌曲难度等级文本组件
 * 显示带有描边效果的难度等级数字
 * @param level 难度等级值
 * @param level_index 难度等级索引，用于确定颜色
 */
/**
 * 根据难度等级获取描边颜色
 */
function getStrokeColor(level_index: 0 | 1 | 2 | 3 | 4): string {
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
      return "#ffffff" // Re:Master
    default:
      return "#ffffff"
  }
}

/**
 * 根据难度等级获取文字颜色
 */
function getTextColor(level_index: 0 | 1 | 2 | 3 | 4): string {
  switch (level_index) {
    case 0:
      return "#ffffff" // Basic
    case 1:
      return "#ffffff" // Advanced
    case 2:
      return "#ffffff" // Expert
    case 3:
      return "#ffffff" // Master
    case 4:
      return "#5f3184" // Re:Master
    default:
      return "#ffffff"
  }
}

function SongLevelText({
  level,
  level_index,
}: {
  level: number | string
  level_index: 0 | 1 | 2 | 3 | 4
}) {
  return (
    <div className="relative mx-1.5 max-sm:mx-1">
      <span
        className="absolute inset-0 text-2xl max-lg:text-xl font-bold"
        style={{
          color: "transparent",
          WebkitTextStroke: `4px ${getStrokeColor(level_index)}`,
        }}
      >
        {level}
      </span>
      <span
        className="relative text-2xl max-lg:text-xl font-bold"
        style={{
          color: getTextColor(level_index),
        }}
      >
        {level}
      </span>
    </div>
  )
}

function SongCategory({ genre }: { genre: string }) {
  return (
    <>
      <h2
        className="absolute z-[50] -top-5 right-0 inline-flex max-sm:ml-0 max-sm:px-3 max-sm:text-xs px-5 py-1 truncate rounded-full text-white border-2"
        style={{
          backgroundColor: getGenreColor(genre).bg,
          borderColor: getGenreColor(genre).border,
        }}
      >
        {transferText(genre)}
      </h2>
    </>
  )
}
