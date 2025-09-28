"use client"

import { ChartType, DifficultyInfo, getDifficultyColor, Song } from "../songModel"
import { motion } from "framer-motion"
import { FaMusic } from "react-icons/fa" // Example icon

// Helper to get total notes
const getTotalNotes = (diff: DifficultyInfo) => {
  const noteTypes: (keyof DifficultyInfo)[] = [
    "tap_num",
    "hold_num",
    "slide_num",
    "touch_num",
    "break_num",
  ]
  return noteTypes.reduce((sum, type) => sum + (Number(diff[type]) || 0), 0)
}

// Note type component
const NoteDetailItem = ({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
  color: string
}) => (
  <div className="flex items-center justify-between w-full text-sm">
    <div className="flex items-center space-x-2">
      <div style={{ color }} className="w-4 h-4">
        {icon}
      </div>
      <span className="text-gray-600 font-medium">{label}</span>
    </div>
    <span className="font-bold text-gray-800">{value}</span>
  </div>
)

export default function NoteTable({ song, chartType }: { song: Song; chartType: ChartType }) {
  let songData: DifficultyInfo[] = []

  switch (chartType) {
    case ChartType.STANDARD:
      songData = song.difficulties.standard
      break
    case ChartType.DX:
      songData = song.difficulties.dx
      break
    case ChartType.UTAGE:
      songData = song.difficulties.utage
      break
    default:
      break
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      {songData.map((diff, idx) => {
        const diffColor =
          chartType === "utage"
            ? "rgb(220, 56, 184)"
            : getDifficultyColor(diff.level_index as 0 | 1 | 2 | 3 | 4)
        const totalNotes = getTotalNotes(diff)

        const noteDetails = [
          { label: "Tap", value: diff.tap_num, icon: <FaMusic />, color: "#FF7A7A" },
          { label: "Hold", value: diff.hold_num, icon: <FaMusic />, color: "#FFB347" },
          { label: "Slide", value: diff.slide_num, icon: <FaMusic />, color: "#47B3FF" },
          {
            label: "Touch",
            value: chartType === ChartType.STANDARD ? "-" : diff.touch_num,
            icon: <FaMusic />,
            color: "#47FFB3",
          },
          { label: "Break", value: diff.break_num, icon: <FaMusic />, color: "#FF4747" },
        ]

        return (
          <motion.div
            key={idx}
            className="p-5 rounded-2xl bg-[#F0F2F5] border border-slate-300/50 shadow-sm"
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <div className="flex flex-col space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center justify-center min-w-20 h-9 px-3 rounded-lg text-white font-bold shadow-md"
                  style={{ backgroundColor: diffColor }}
                >
                  {chartType === "utage" ? `${diff.level} | ${diff.kanji}` : diff.level_value}
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Total Notes</div>
                  <div className="text-xl font-bold text-gray-800">{totalNotes}</div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gray-300 shadow-inner" />

              {/* Note Details */}
              <div className="flex flex-col space-y-3">
                {noteDetails.map(item => (
                  <NoteDetailItem key={item.label} {...item} />
                ))}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
