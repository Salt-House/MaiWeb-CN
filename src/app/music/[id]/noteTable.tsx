"use client"

import { ChartType, DifficultyInfo, Song } from "@/types/music"
import { getDifficultyColor, getNotesWeight, getTotalNotes } from "@/utils/music"
import { motion } from "framer-motion"
import { FaMusic } from "react-icons/fa" // Example icon

// Note type component
const NoteDetailItem = ({
  label,
  value,
  weight,
  icon,
  color,
}: {
  label: string
  value: number | string
  weight: number
  icon: React.ReactNode
  color: string
}) => (
  <div className="grid grid-cols-3 w-full text-sm items-center justify-items-start">
    <div className="flex items-center space-x-2">
      <div style={{ color }} className="w-4 h-4 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-gray-600 font-medium">{label}</span>
    </div>
    <span className="font-bold text-gray-800">总数：{value}</span>
    <span className="text-xs text-gray-500">{weight}%/每个</span>
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
    <div className="w-full grid sm:grid-cols-2 max-sm:grid-cols-1  gap-6 mt-4">
      {songData.map((diff, idx) => {
        const diffColor =
          chartType === "utage"
            ? "rgb(220, 56, 184)"
            : getDifficultyColor(diff.level_index as 0 | 1 | 2 | 3 | 4)
        const totalNotes = getTotalNotes(diff)
        const weights = getNotesWeight(diff)
        const noteDetails = [
          { label: "Tap", value: diff.tap_num, weight: weights.tap.weight, icon: <FaMusic />, color: "#FF7A7A" },
          { label: "Hold", value: diff.hold_num, weight: weights.hold.weight, icon: <FaMusic />, color: "#FFB347" },
          { label: "Slide", value: diff.slide_num, weight: weights.slide.weight, icon: <FaMusic />, color: "#47B3FF" },
          {
            label: "Touch",
            value: chartType === ChartType.STANDARD ? "-" : diff.touch_num,
            weight: weights.touch.weight,
            icon: <FaMusic />,
            color: "#47FFB3",
          },
          { label: "Break", value: diff.break_num, weight: weights.break.weight, icon: <FaMusic />, color: "#FF4747" },
        ]

        return (
          <motion.div
            key={idx}
            className="p-5 rounded-2xl bg-[#F0F2F5] border border-slate-300/50 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <div className="flex flex-col space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center justify-center sm:min-w-20 max-sm:w-10 h-9 px-3 rounded-lg text-white font-bold shadow-md"
                  style={{ backgroundColor: diffColor }}
                >
                  {chartType === "utage" ? `${diff.level} | ${diff.kanji}` : diff.level_value}
                </div>
                <div className="flex flex-col">
               
              </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Total Notes</div>
                  <div className="text-xl font-bold text-gray-800">{totalNotes}</div>
                </div>
              </div>
            <div className="w-full">
              {/* Note Details */}
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
