"use client"

import { useEffect, useState } from "react"
import { Song, getDifficultyColor, SongScoreProps, ChartType } from "../songModel"
import { FaChevronDown } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import { CONFIG } from "@/config/api"
import Image from "next/image"

export default function ScoreDetail({ song, scores }: { song: Song; scores?: SongScoreProps[] }) {
  const [loading, setLoading] = useState(true)
  const [scoreData, setScoreData] = useState<SongScoreProps[]>([])
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false)

  useEffect(() => {
    setLoading(true)
    setHasAttemptedLoad(false)

    if (scores && scores.length > 0) {
      setScoreData(scores)
      setLoading(false)
      setHasAttemptedLoad(true)
      return
    }

    const fetchScores = async () => {
      const storedToken = localStorage.getItem("token")
      if (!storedToken) {
        setLoading(false)
        setHasAttemptedLoad(true)
        return
      }

      try {
        const response = await fetch(
          `${CONFIG.API.ENDPOINTS.API}/maimai/maiweb/minfo?id=${song.id}`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        )
        if (!response.ok) throw new Error("Failed to fetch scores")
        const data = await response.json()
        if (data.scores && Array.isArray(data.scores)) {
          setScoreData(data.scores)
        }
      } catch (e) {
        console.error("获取成绩数据失败:", e)
      } finally {
        setLoading(false)
        setHasAttemptedLoad(true)
      }
    }

    fetchScores()
  }, [song.id, scores])

  if (!localStorage.getItem("token")) {
    return <div className="text-center py-8 text-gray-500">登录以查看个人乐曲成绩</div>
  }

  if (loading && !hasAttemptedLoad) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner size="ultrasm" message="加载成绩中..." />
      </div>
    )
  }

  if ((!scoreData || scoreData.length === 0) && hasAttemptedLoad) {
    return (
      <div className="text-center py-12 text-gray-500">暂无该歌曲的分数数据，快去打一把吧！</div>
    )
  }

  const standardScores = scoreData
    .filter(s => s.type === "standard")
    .sort((a, b) => a.level_index - b.level_index)
  const dxScores = scoreData
    .filter(s => s.type === "dx")
    .sort((a, b) => a.level_index - b.level_index)

  return (
    <div className="w-full p-4 space-y-8">
      {standardScores.length > 0 && (
        <ScoreSection
          title="标准谱面"
          scores={standardScores}
          song={song}
          chartType={ChartType.STANDARD}
        />
      )}
      {dxScores.length > 0 && (
        <ScoreSection title="DX谱面" scores={dxScores} song={song} chartType={ChartType.DX} />
      )}
    </div>
  )
}

function ScoreSection({
  title,
  scores,
  song,
  chartType,
}: {
  title: string
  scores: SongScoreProps[]
  song: Song
  chartType: ChartType
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl bg-[#F0F2F5] border border-slate-300/50 shadow-sm"
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-xl font-bold text-gray-700">{title}</h3>
        <motion.div animate={{ rotate: isExpanded ? 0 : -180 }} transition={{ duration: 0.3 }}>
          <FaChevronDown className="text-gray-500" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-6 space-y-6">
              {scores.map((score, index) => (
                <ScoreCard key={index} score={score} song={song} chartType={chartType} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ScoreCard({
  score,
  song,
  chartType,
}: {
  score: SongScoreProps
  song: Song
  chartType: ChartType
}) {
  const difficulty = song.difficulties[chartType]?.find(d => d.level_index === score.level_index)

  return (
    <div className="p-5 rounded-xl bg-[#e6e9ee] border border-slate-300/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center space-x-4">
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center shadow-md"
          style={{ backgroundColor: getDifficultyColor(score.level_index as 0 | 1 | 2 | 3 | 4) }}
        >
          {difficulty?.level_value || score.level_index}
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#F0F2F5] border border-white/60 shadow-sm">
            {/* TODO 优化：改用 `next/image`；将评级图标静态导入，避免运行时路径拼接 */}
            {getRateImage(score.achievements) && (
              <Image
                src={getRateImage(score.achievements)!}
                alt="Achievement Rate"
                width={0}
                height={0}
                sizes="100vw"
                className="h-8 mb-1 w-auto"
              />
            )}
            <p className="text-lg font-bold text-gray-800">{score.achievements.toFixed(4)}%</p>
          </div>
          <div className="flex items-center justify-center space-x-4">
            {getFCImage(score.fc) && (
              /* TODO 优化：改用 `next/image`；并为 `fc` 值建立严格类型 */
              <Image
                src={getFCImage(score.fc)!}
                alt="Full Combo"
                width={0}
                height={0}
                sizes="100vw"
                className="h-10 w-auto"
              />
            )}
            {getFSImage(score.fs) && (
              /* TODO 优化：改用 `next/image`；修复 `getFSImage` 中可能的资源路径拼写错误（ggrade） */
              <Image
                src={getFSImage(score.fs)!}
                alt="Full Sync"
                width={0}
                height={0}
                sizes="100vw"
                className="h-10 w-auto"
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div className="p-2 rounded-lg bg-[#F0F2F5] border border-white/60 shadow-sm">
          <p className="text-sm text-gray-500">DX Score</p>
          <p className="text-lg font-semibold text-gray-800">{score.dx_score}</p>
        </div>
        <div className="p-2 rounded-lg bg-[#F0F2F5] border border-white/60 shadow-sm">
          <p className="text-sm text-gray-500">DX Rating</p>
          <p className="text-lg font-semibold text-gray-800">{score.dx_rating}</p>
        </div>
      </div>
    </div>
  )
}

// Helper functions (getRateImage, getFCImage, getFSImage) remain the same
function getRateImage(achievements: number | null): string | null {
  if (achievements === null) return null
  if (achievements >= 100.5) return "/img/grade/sssp.webp"
  if (achievements >= 100) return "/img/grade/sss.webp"
  if (achievements >= 99.5) return "/img/grade/ssp.webp"
  if (achievements >= 99) return "/img/grade/ss.webp"
  if (achievements >= 98) return "/img/grade/sp.webp"
  if (achievements >= 97) return "/img/grade/s.webp"
  if (achievements >= 94) return "/img/grade/aaa.webp"
  if (achievements >= 90) return "/img/grade/aa.webp"
  if (achievements >= 80) return "/img/grade/a.webp"
  return null
}

function getFCImage(fc: string | null): string | null {
  if (!fc) return null
  const map: { [key: string]: string } = {
    app: "/img/grade/app.webp",
    ap: "/img/grade/ap.webp",
    fcp: "/img/grade/fcp.webp",
    fc: "/img/grade/fc.webp",
  }
  return map[fc] || null
}

function getFSImage(fs: string | null): string | null {
  if (!fs) return null
  const map: { [key: string]: string } = {
    fsdp: "/img/grade/fsdp.webp",
    fsd: "/img/grade/fsd.webp",
    fsp: "/img/grade/fsp.webp",
    fs: "/img/grade/fs.webp",
    sync: "/img/grade/sync.webp",
  }
  return map[fs] || null
}
