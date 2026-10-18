"use client"

import { useParams } from "next/navigation"
import { Song, ChartType, SongScoreProps } from "@/types/music"
import { transferText, transferVersion, getGenreColor } from "@/utils/music"
import { useState, useEffect } from "react"
import NoteTable from "./noteTable"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import MusicPlayer from "./musicPlayer"
import ScoreDetail from "./scoreDetail"
import MaiNotesTools from "./maiNotesTools"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import { FaDownload } from "react-icons/fa"
import { FaBilibili } from "react-icons/fa6"
import { motion, Variants } from "framer-motion"
import Image from "next/image"
import { CONFIG } from "@/config/api"
import { getSongDetail } from "@/services/music"

export default function SongDetail() {
  const params = useParams()
  const [song, setSong] = useState<Song | null>(null)
  const [scores, setScores] = useState<SongScoreProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartType, setChartType] = useState<ChartType | null>(null)

  useEffect(() => {
    const fetchSongData = async () => {
      setLoading(true)
      try {
        const storedToken = localStorage.getItem("token")
        
        const data = await getSongDetail(params.id as string, !!storedToken)

        const newSong = storedToken ? data.song : data[0]

        if (newSong) {
          setSong(newSong)
          if (storedToken) {
            setScores(data.scores || [])
          } else {
            setScores([])
          }

          if (newSong.difficulties.dx?.length) {
            setChartType(ChartType.DX)
          } else if (newSong.difficulties.standard?.length) {
            setChartType(ChartType.STANDARD)
          } else if (newSong.difficulties.utage?.length) {
            setChartType(ChartType.UTAGE)
          }
        } else {
          setSong(null)
          setScores([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "获取数据失败")
      } finally {
        setLoading(false)
      }
    }

    fetchSongData()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <LoadingSpinner size="lg" message="正在加载乐曲..." description="请稍候" />
      </div>
    )
  }

  if (error || !song) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <div>错误: {error || "未找到歌曲 QAQ"}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-6">
          <Link
            href="/music"
            className="inline-flex items-center text-mai-ink hover:text-mai-blue-deep transition-colors group bg-white/80 border-2 border-mai-blue-deep/30 rounded-full px-4 py-1.5 shadow-sm hover:border-mai-blue-deep"
          >
            <FaArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="font-bold">返回音乐列表</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col items-center space-y-8">
            <RecordPlayer song={song} />
            <div className="w-full">
              <MusicPlayer
                audioUrl={`${CONFIG.ASSETS.MAIMAI.MUSIC}/${song.id}.mp3`}
                title={song.title}
                artist={song.artist}
                songId={song.id.toString()}
              />
            </div>
          </div>
          <div className="md:col-span-2 space-y-8">
            <SongInfo song={song} />
            {chartType && (
              <div>
                <ChartTypeSwitcher song={song} chartType={chartType} setChartType={setChartType} />
                <NoteTable song={song} chartType={chartType} />
                <MaiNotesTools song={song} chartType={chartType} />
              </div>
            )}
            {scores && scores.length > 0 && <ScoreDetail song={song} scores={scores} />}
          </div>
        </div>
       
      </motion.div>
    </div>
  )
}

/**
 * 谱面类型切换组件
 */
function ChartTypeSwitcher({
  song,
  chartType,
  setChartType,
}: {
  song: Song
  chartType: ChartType
  setChartType: (type: ChartType) => void
}) {
  const availableCharts = [
    { type: ChartType.DX, label: "DX" },
    { type: ChartType.STANDARD, label: "Standard" },
    { type: ChartType.UTAGE, label: "Utage" },
  ].filter(chart => song.difficulties[chart.type]?.length > 0)

  return (
    <div className="flex justify-center mb-4">
      <div className="flex space-x-1 p-1 rounded-full bg-white border-2 border-mai-blue-deep/50 shadow-md">
        {availableCharts.map(tab => (
          <button
            key={tab.type}
            onClick={() => setChartType(tab.type)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border-2 ${
              chartType === tab.type ? "bg-mai-yellow text-mai-blue-deep border-mai-blue-deep shadow-md" : "text-mai-ink/60 hover:text-mai-blue-deep border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * 唱片机风格的歌曲封面组件
 */
function RecordPlayer({ song }: { song: Song }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const discVariants: Variants = {
    spinning: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 20,
        ease: "linear",
      },
    },
    stopped: {
      rotate: 0,
      transition: {
        duration: 1,
      },
    },
  }

  return (
    <div className="relative w-full max-w-xs aspect-square">
      <motion.div
        className="w-full h-full rounded-full relative"
        onHoverStart={() => setIsPlaying(true)}
        onHoverEnd={() => setIsPlaying(false)}
        style={{
          background: "#6F34B0",
          boxShadow: "12px 12px 24px rgba(59,7,100,0.45), -10px -10px 22px rgba(233,213,255,0.55), 0 0 18px rgba(251,191,36,0.3)",
        }}
        whileHover={{
          scale: 1.03,
          boxShadow: "16px 16px 32px rgba(59,7,100,0.55), -14px -14px 28px rgba(245,208,254,0.75), 0 0 24px rgba(251,191,36,0.5)",
        }}
        whileTap={{
          scale: 0.99,
          boxShadow: "6px 6px 12px rgba(59,7,100,0.35), -6px -6px 12px rgba(233,213,255,0.45)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative w-full h-full rounded-full">
          {/* Bevel */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: "4px solid rgba(253,230,138,0.9)",
              boxShadow: "inset 8px 8px 16px rgba(59,7,100,0.45), inset -8px -8px 16px rgba(245,208,254,0.3)",
            }}
          />

          {/* Highlight */}
          <div
            className="absolute left-[16%] top-[10%] w-[68%] h-[18%] rounded-full pointer-events-none"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              transform: "rotate(-18deg)",
            }}
          />

          {/* Album art */}
          <div className="absolute inset-8 rounded-full overflow-hidden border border-mai-yellow/60">
            <motion.div
              className="w-full h-full relative"
              variants={discVariants}
              animate={isPlaying ? "spinning" : "stopped"}
            >
              <Image
                src={`${CONFIG.ASSETS.MAIMAI.JACKET}/${song.id}.png`}
                alt={song.title}
                className="object-cover"
                fill
                unoptimized
              />
            </motion.div>
          </div>

          {/* Dashed ring 1 */}
          <div
            className="absolute inset-10 rounded-full pointer-events-none"
            style={{
              border: "2px dashed rgba(253,230,138,0.65)",
            }}
          />

          {/* Dashed ring 2 */}
          <div
            className="absolute inset-16 rounded-full pointer-events-none"
            style={{
              border: "2px dotted rgba(245,208,254,0.7)",
            }}
          />

          {/* Inner shadow ring */}
          <div
            className="absolute inset-20 rounded-full pointer-events-none"
            style={{
              border: "2px solid rgba(253,224,71,0.4)",
              boxShadow:
                "inset 0 0 8px rgba(251,191,36,0.35), 0 0 8px rgba(168,85,247,0.35)",
            }}
          />
        </div>

        {/* Tonearm */}
        <motion.div
          aria-hidden
          className="absolute -top-8 left-8 z-20 pointer-events-none origin-top-left"
          animate={{ rotate: isPlaying ? 22 : -10 }}
          transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.8 }}
        >
          {/* Pivot */}
          <div
            className="w-6 h-6 rounded-full relative"
            style={{
              background: "#FBE426",
              boxShadow: "0 2px 6px rgba(0,0,0,0.28), 0 0 8px rgba(251,191,36,0.6)",
              border: "1px solid rgba(255,255,255,0.8)",
            }}
          />
          {/* Arm */}
          <div
            className="mt-1.5 w-36 h-2 rounded-full"
            style={{
              background: "#FBE426",
              boxShadow: "0 2px 6px rgba(88,28,135,0.35), 0 0 8px rgba(251,191,36,0.4)",
              border: "1px solid rgba(255,255,255,0.65)",
            }}
          />
          {/* Head */}
          <div
            className="relative rounded-lg"
            style={{
              width: "2rem",
              height: "2.5rem",
              marginLeft: "128px",
              marginTop: "-4px",
              background: "#FBE426",
              boxShadow: "0 3px 8px rgba(88,28,135,0.4), 0 0 10px rgba(251,191,36,0.5)",
              border: "1.5px solid rgba(255,255,255,0.85)",
            }}
          >
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block rounded-full"
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#9f1239",
                boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.25)",
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/**
 * 歌曲基本信息组件
 */
function SongInfo({ song }: { song: Song }) {
  const [isDownloadingCover, setIsDownloadingCover] = useState(false)

  const handleDownloadCover = async () => {
    if (isDownloadingCover) return
    setIsDownloadingCover(true)
    const jacketUrl = `${CONFIG.ASSETS.MAIMAI.JACKET}/${song.id}.png`

    try {
      const response = await fetch(jacketUrl, { cache: "no-store" })
      if (!response.ok) {
        throw new Error(`Failed to download cover: ${response.status}`)
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)

      const safeTitle = (song.title || "cover")
        .replaceAll(/[\\/:*?"<>|]/g, "_")
        .replaceAll(/\s+/g, " ")
        .trim()

      const fileName = `${safeTitle}_${song.id}.png`

      const link = document.createElement("a")
      link.href = objectUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)
    } catch {
      window.open(jacketUrl, "_blank", "noopener,noreferrer")
    } finally {
      setIsDownloadingCover(false)
    }
  }

  return (
    <div className="rounded-3xl bg-white border-4 border-mai-blue-deep shadow-2xl overflow-hidden">
      <div className="border-b-4 border-mai-blue-deep bg-mai-yellow px-5 py-2 flex items-center gap-3">
        <Image src="/assets/maiDecorationBg/note_02.png" alt="" width={26} height={26} className="w-6 h-6" />
        <span className="text-lg font-mai font-bold tracking-widest text-mai-blue-deep">乐曲情报</span>
      </div>
      <div className="p-6">
      <h1 className="text-3xl font-mai font-bold text-mai-blue-deep mb-2">{song.title}</h1>
      <p className="text-lg font-medium text-mai-purple mb-4">{song.artist}</p>

      <div className="flex flex-wrap gap-3 items-center mb-4">
        <span
          className="px-4 py-1 rounded-full text-white text-sm font-semibold border-2"
          style={{
            backgroundColor: getGenreColor(song.genre).bg,
            borderColor: getGenreColor(song.genre).border,
          }}
        >
          {transferText(song.genre)}
        </span>
        <span className="text-sm text-mai-ink/70">ID: {song.id}</span>
        <span className="text-sm text-mai-ink/70">BPM: {song.bpm}</span>
        <span className="text-sm text-mai-ink/70">版本: {transferVersion(song.version)}</span>
      </div>

      {song.aliases && song.aliases.length > 0 && (
        <div className="mb-4">
          <div className="font-bold text-mai-ink mb-2">别名:</div>
          <div className="flex flex-wrap gap-2">
            {song.aliases.map((alias, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium text-white border border-mai-yellow shadow-sm bg-mai-purple"
              >
                {alias}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <a
          href={`https://search.bilibili.com/all?keyword=${encodeURIComponent(song.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-4 py-2 rounded-full text-mai-blue-deep bg-white border-2 border-mai-blue-deep/60 shadow-md hover:shadow-lg hover:bg-mai-yellow/30 transition-all duration-300"
        >
          <FaBilibili className="mr-2" />
          <span>在B站搜索</span>
        </a>

        <motion.button
          type="button"
          onClick={handleDownloadCover}
          disabled={isDownloadingCover}
          className="flex items-center px-4 py-2 rounded-full text-mai-blue-deep bg-mai-yellow border-2 border-mai-blue-deep shadow-md hover:shadow-lg hover:brightness-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98, y: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
        >
          {isDownloadingCover ? (
            <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
              <span className="h-4 w-4 rounded-full border-2 border-mai-blue-deep/60 border-t-transparent animate-spin" />
            </span>
          ) : (
            <FaDownload className="mr-2" />
          )}
          <span>下载封面</span>
        </motion.button>
      </div>
      </div>
    </div>
  )
}
