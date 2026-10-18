import { Song } from "@/types/music"
import { getGenreColor, transferText } from "@/utils/music"
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
 * 单个歌曲项组件（maimai でらっくす MAGiCAL 主题版）
 * 灵感源自「魔法おうこくちほー」、新搭档「カナデラ」与核心道具「時渡りの時計」
 * 将原本 CiRCLE 版本的「黑胶唱片 + 唱针」升级为「星象魔法阵 + 时渡之钟指针」
 */
export default function SongItem({ song, displayMode }: SongItemProps) {
    const { addToPlaylist } = usePlayer()
    const [isAdded, setIsAdded] = useState(false)
    const [isHovered, setIsHovered] = useState<boolean>(false)

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
            className="relative songitem-magical mr-10 flex items-center w-fit min-w-[450px] max-lg:min-w-[400px] max-w-[480px] max-lg:max-w-[420px] max-h-[160px] max-lg:max-h-[140px] rounded-full mb-10 max-sm:mb-4 pr-4 max-sm:w-full max-sm:min-w-0 max-sm:max-w-full max-sm:mr-0 max-sm:pr-2 border-2 border-mai-yellow"
            style={{
                // MAGiCAL 主题配色：魔法王国幻紫渐变 + 柔和星光内高光
                background:
                    "#6F34B0",
                boxShadow:
                    "0 10px 24px rgba(1, 45, 123, 0.3)",
            }}
            whileHover={{
                y: -4,
                scale: 1.02,
                boxShadow:
                    "0 14px 30px rgba(107, 33, 168, 0.5), 0 0 18px rgba(251, 191, 36, 0.35), inset 0 2px 8px rgba(254, 243, 199, 0.5)",
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileTap={{ scale: 0.995 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.5 }}
        >
            {/* 卡片背景星光点缀（MAGiCAL 魔法星尘装饰） */}
            <span
                aria-hidden
                className="pointer-events-none select-none absolute right-6 bottom-2 text-mai-yellow/40 text-xs"
            >
        ✦ ✧ ✦
      </span>

            <a
                href={`${CONFIG.API.WEB.MUSIC}/${song.id}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                    localStorage.setItem(`song_${song.id}`, JSON.stringify(song))
                }
                className="flex items-center w-full"
            >
                {/* 添加到播放列表按钮（融入 カナデラ 红斗篷宝石配色与鎏金描边） */}
                <button
                    onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddToPlaylist(song)
                    }}
                    className={`absolute z-30 max-sm:-left-1 max-sm:-top-1 left-0 top-0 w-8 h-8 flex items-center justify-center rounded-full text-white border border-mai-yellow shadow-md transition-all duration-300 ${
                        isAdded
                            ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/40"
                            : "bg-rose-600 hover:bg-rose-500 shadow-rose-900/40"
                    }`}
                    title="添加到播放列表"
                >
                    {isAdded ? <FaCheck /> : <FaPlus />}
                </button>

                {/* 曲绘圆盘：『時渡りの時計』× 魔法阵（替代原版 CD 盘面） */}
                <motion.div
                    className="songitem-avatar group flex-shrink-0 size-40 max-lg:size-36 max-sm:size-32 border-4 border-mai-yellow rounded-full relative hover:border-mai-yellow transition-colors duration-300"
                    style={{
                        background:
                            "#6F34B0",
                        boxShadow:
                            "8px 8px 18px rgba(59, 7, 100, 0.45), -6px -6px 16px rgba(233, 213, 255, 0.55), 0 0 12px rgba(251, 191, 36, 0.35)",
                    }}
                    whileHover={{
                        scale: 1.03,
                        boxShadow:
                            "12px 12px 24px rgba(59, 7, 100, 0.55), -8px -8px 20px rgba(245, 208, 254, 0.75), 0 0 20px rgba(251, 191, 36, 0.6)",
                    }}
                    whileTap={{
                        scale: 0.99,
                        boxShadow:
                            "4px 4px 10px rgba(59, 7, 100, 0.35), -4px -4px 10px rgba(233, 213, 255, 0.45)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <div className="relative w-full h-full rounded-full">
                        {/* 外层鎏金魔法钟表刻度外圈 */}
                        <div
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{
                                border: "3px dashed rgba(253, 230, 138, 0.65)",
                                boxShadow:
                                    "inset 4px 4px 10px rgba(59, 7, 100, 0.45), inset -4px -4px 10px rgba(245, 208, 254, 0.35)",
                            }}
                        />

                        {/* 专辑曲绘区域（内缩露出外围魔法阵环） */}
                        <div className="absolute inset-2.5 rounded-full overflow-hidden border border-mai-yellow/60">
                            <Image
                                src={`${CONFIG.ASSETS.MAIMAI.JACKET}/${song.id}.png`}
                                alt={song.title}
                                className="rounded-full object-cover"
                                style={{
                                    transform: isHovered ? "rotate(360deg)" : "rotate(0deg)",
                                    transition: "transform 20s linear",
                                }}
                                fill
                                unoptimized
                            />
                        </div>

                        {/* 魔法阵外环（悬停时逆向慢速旋转，营造时空回旋感） */}
                        <div
                            className="absolute inset-5 rounded-full pointer-events-none"
                            style={{
                                border: "2px dashed rgba(254, 240, 138, 0.65)",
                                transform: isHovered ? "rotate(-180deg)" : "rotate(0deg)",
                                transition: "transform 16s linear",
                            }}
                        />

                        {/* 魔法阵内环（星芒粉紫虚线环） */}
                        <div
                            className="absolute inset-11 rounded-full pointer-events-none"
                            style={{
                                border: "1.5px dotted rgba(245, 208, 254, 0.7)",
                            }}
                        />

                        {/* 核心星象光环（替代原版 CD 中心孔） */}
                        <div
                            className="absolute inset-16 rounded-full pointer-events-none"
                            style={{
                                border: "2px solid rgba(253, 224, 71, 0.35)",
                                boxShadow:
                                    "inset 0 0 8px rgba(251, 191, 36, 0.35), 0 0 8px rgba(168, 85, 247, 0.35)",
                            }}
                        />
                    </div>

                    {/* 『時渡りの時計』鎏金魔导指针（替代原版唱片扫头 Tonearm） */}
                    <div
                        aria-hidden
                        className={`absolute -top-5 left-6 z-20 pointer-events-none origin-top-left transition-transform duration-500 ${
                            isHovered ? "rotate-6" : "-rotate-6"
                        }`}
                    >
                        {/* 钟表轴心（镶嵌 カナデラ 红宝石） */}
                        <div
                            className="w-4 h-4 rounded-full flex items-center justify-center"
                            style={{
                                background: "#FBE426",
                                boxShadow:
                                    "0 2px 6px rgba(0, 0, 0, 0.25)",
                                border: "1px solid rgba(255, 255, 255, 0.8)",
                            }}
                        >
                            <span className="w-2 h-2 rounded-full bg-rose-600 shadow-inner" />
                        </div>

                        {/* 鎏金钟表长针（魔杖针身） */}
                        <div
                            className="mt-0.5 w-24 h-1.5 rounded-full"
                            style={{
                                background:
                                    "#FBE426",
                                boxShadow: "0 2px 6px rgba(88, 28, 135, 0.35)",
                                border: "1px solid rgba(255, 255, 255, 0.65)",
                            }}
                        />

                        {/* 指针末端星芒魔导头 */}
                        <div
                            className="ml-[84px] mt-[-5px] w-7 h-7 rounded-full flex items-center justify-center relative"
                            style={{
                                background: "#FBE426",
                                boxShadow:
                                    "0 3px 8px rgba(88, 28, 135, 0.4), 0 0 10px rgba(251, 191, 36, 0.5)",
                                border: "1.5px solid rgba(255, 255, 255, 0.85)",
                            }}
                        >
              <span className="text-[11px] leading-none text-purple-900 font-bold select-none">
                ✦
              </span>
                        </div>
                    </div>
                </motion.div>

                <SongCategory genre={song.genre} />

                <div
                    id="level"
                    className="ml-4 max-sm:ml-2 flex flex-col justify-center items-start"
                >
                    <p className="text-white font-bold text-xl max-lg:text-lg truncate max-w-[200px] max-lg:max-w-[180px] max-sm:max-w-[150px] drop-shadow-[0_1px_2px_rgba(59,7,100,0.8)]">
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
                    <p className="text-purple-100/95 text-sm truncate max-w-[200px] max-lg:max-w-[180px] max-sm:max-w-[150px] mb-2">
                        BPM: {song.bpm}&nbsp;&nbsp;Artist: {song.artist}
                    </p>
                </div>
            </a>
        </motion.div>
    )
}

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
        <h2
            className="absolute z-[50] -top-5 right-0 inline-flex items-center gap-1 max-sm:ml-0 max-sm:px-3 max-sm:text-xs px-5 py-1 truncate rounded-full text-white font-semibold border-2 shadow-md"
            style={{
                backgroundColor: getGenreColor(genre).bg,
                borderColor: getGenreColor(genre).border,
                boxShadow: "0 4px 10px rgba(59, 7, 100, 0.3)",
            }}
        >
      <span aria-hidden className="text-mai-yellow text-xs">
        ✦
      </span>
            {transferText(genre)}
        </h2>
    )
}