"use client"

import { useState, useMemo, useEffect } from "react"
import { Song, ChartType, DifficultyInfo } from "@/types/music"
import { getNotesWeight, getRateString, calculateDxRating, getDifficultyColor } from "@/utils/music"
import { motion, AnimatePresence } from "framer-motion"
import { FaCalculator, FaListUl, FaChevronDown, FaUndo } from "react-icons/fa"

interface MaiNotesToolsProps {
  song: Song
  chartType: ChartType
}

type Tab = "boundary" | "calculator"

export default function MaiNotesTools({ song, chartType }: MaiNotesToolsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("boundary")
  const [isOpen, setIsOpen] = useState(true)

  // Get current difficulty data based on chart type
  // Note: MaiNotesTools should probably receive the specific difficulty, but here we receive the song and iterate or select
  // For simplicity, let's display tools for ALL difficulties or allow selection.
  // Given the layout of NoteTable (which lists all difficulties), maybe we should place this component PER difficulty or have a selector.
  // However, usually tools are per-chart.
  // Let's assume we want to show a selector for difficulty level if multiple exist.
  
  const difficulties = useMemo(() => {
    return song.difficulties[chartType] || []
  }, [song, chartType])

  const [selectedLevelIndex, setSelectedLevelIndex] = useState<number>(
    difficulties.length > 0 ? difficulties[0].level_index : 0
  )

  const selectedDiff = useMemo(() => 
    difficulties.find(d => d.level_index === selectedLevelIndex) || difficulties[0]
  , [difficulties, selectedLevelIndex])

  if (!selectedDiff) return null

  return (
    <div className="w-full mt-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header / Toggle */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-100 text-pink-500 rounded-lg">
            <FaCalculator />
          </div>
          <h2 className="text-xl font-bold text-gray-800">谱面分析工具箱</h2>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 0 : -180 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown className="text-gray-500" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200"
          >
            {/* Difficulty Selector */}
            <div className="p-4 flex flex-wrap gap-2 justify-center bg-white">
              {difficulties.map((diff) => (
                <button
                  key={diff.level_index}
                  onClick={() => setSelectedLevelIndex(diff.level_index)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border-2 ${
                    selectedLevelIndex === diff.level_index
                      ? "scale-105 shadow-md"
                      : "opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                  }`}
                  style={{
                    backgroundColor: selectedLevelIndex === diff.level_index ? getDifficultyColor(diff.level_index) : "transparent",
                    borderColor: getDifficultyColor(diff.level_index),
                    color: selectedLevelIndex === diff.level_index ? "white" : getDifficultyColor(diff.level_index),
                  }}
                >
                  {diff.level_value}
                </button>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab("boundary")}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center space-x-2 transition-colors ${
                  activeTab === "boundary"
                    ? "text-pink-500 border-b-2 border-pink-500 bg-pink-50/30"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaListUl />
                <span>容错速查</span>
              </button>
              <button
                onClick={() => setActiveTab("calculator")}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center space-x-2 transition-colors ${
                  activeTab === "calculator"
                    ? "text-pink-500 border-b-2 border-pink-500 bg-pink-50/30"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaCalculator />
                <span>分数计算器</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === "boundary" ? (
                <BoundaryTable diff={selectedDiff} />
              ) : (
                <ScoreCalculator diff={selectedDiff} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

function BoundaryTable({ diff }: { diff: DifficultyInfo }) {
  const weights = useMemo(() => getNotesWeight(diff), [diff])
  const piece = weights.piece

  // Calculation Helper
  // Great (-20%), Good (-50%), Miss (-100%)
  const calcMaxLoss = (target: number) => 101 - target
  
  const getCount = (lossPerNote: number, maxLoss: number) => {
    if (lossPerNote <= 0) return "∞"
    return Math.floor(maxLoss / lossPerNote)
  }

  const rows = [
    { label: "SSS+", target: 100.5 },
    { label: "SSS", target: 100.0 },
    { label: "SS+", target: 99.5 },
    { label: "SS", target: 99.0 },
    { label: "S+", target: 98.0 },
  ]

  // Loss definition per note type (simplified for DX)
  // Tap/Touch/Slide/Hold: Great=0.2*piece, Good=0.5*piece, Miss=1.0*piece
  // Break: Miss=1.0*piece (approx, Break has 2500/2550 base but lets use piece as unit for approximation)
  // Note: Break Perfect is complicated (2550 vs 2500), usually Break loss is calculated separately.
  // For this "Simple" checker, we focus on Tap/Hold/Slide Miss/Great counts.
  
  const lossTapGreat = piece * 0.2
  const lossTapMiss = piece * 1.0
  const lossBreakMiss = piece * 5.0 // Rough approximation for Break Miss (entire break score lost)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-500 border-b border-slate-200">
            <th className="pb-3 font-medium">目标评价</th>
            <th className="pb-3 font-medium">Tap Great</th>
            <th className="pb-3 font-medium">Tap Miss</th>
            <th className="pb-3 font-medium">Break Miss (估)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => {
            const maxLoss = calcMaxLoss(row.target)
            if (maxLoss < 0) return null // Should not happen for these targets

            return (
              <tr key={row.label} className="group hover:bg-slate-50 transition-colors">
                <td className="py-3 font-bold text-gray-800">{row.label} <span className="text-xs font-normal text-gray-400">({row.target}%)</span></td>
                <td className="py-3 text-gray-600">{getCount(lossTapGreat, maxLoss)}</td>
                <td className="py-3 text-gray-600">{getCount(lossTapMiss, maxLoss)}</td>
                <td className="py-3 text-gray-600">{getCount(lossBreakMiss, maxLoss)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="mt-4 text-xs text-gray-400 text-center">
        * 注：容错数基于理论权重估算，仅供参考。Break Miss 包含 Break 基础分与额外分。
      </p>
    </div>
  )
}

function ScoreCalculator({ diff }: { diff: DifficultyInfo }) {
  const weights = useMemo(() => getNotesWeight(diff), [diff])
  
  // State for user inputs (Loss counts)
  // Instead of entering "How many Perfects", it's easier to enter "How many Greats/Misses" (Losses)
  // assuming Full Combo otherwise.
  // Or we can provide a full input. Let's provide "Loss Input" mode as it's faster.
  
  const [counts, setCounts] = useState({
    tapGreat: 0, tapGood: 0, tapMiss: 0,
    holdGreat: 0, holdGood: 0, holdMiss: 0,
    slideGreat: 0, slideGood: 0, slideMiss: 0,
    breakGreat: 0, breakGood: 0, breakMiss: 0, // Simplified
  })

  const handleReset = () => {
    setCounts({
      tapGreat: 0, tapGood: 0, tapMiss: 0,
      holdGreat: 0, holdGood: 0, holdMiss: 0,
      slideGreat: 0, slideGood: 0, slideMiss: 0,
      breakGreat: 0, breakGood: 0, breakMiss: 0,
    })
  }

  const handleChange = (field: keyof typeof counts, value: string) => {
    const num = Math.max(0, parseInt(value) || 0)
    setCounts(prev => ({ ...prev, [field]: num }))
  }

  // Calculate Result
  const totalScore = useMemo(() => {
    const piece = weights.piece
    // Start with 101% (Max) and subtract losses
    let loss = 0
    
    // Tap/Touch (Combined as Tap for input simplicity or we should separate? NoteTable has Touch)
    // For simplicity, let's treat Touch as Tap here or ignore Touch inputs if not present.
    // Let's assume these inputs cover Touch too if user sums them up.
    
    loss += counts.tapGreat * (piece * 0.2)
    loss += counts.tapGood * (piece * 0.5)
    loss += counts.tapMiss * (piece * 1.0)

    loss += counts.holdGreat * (piece * 2 * 0.2)
    loss += counts.holdGood * (piece * 2 * 0.5)
    loss += counts.holdMiss * (piece * 2 * 1.0)

    loss += counts.slideGreat * (piece * 3 * 0.2)
    loss += counts.slideGood * (piece * 3 * 0.5)
    loss += counts.slideMiss * (piece * 3 * 1.0)

    // Break is tricky. 
    // Break Perfect = 100% base + Bonus.
    // Break Great = 60% base + 60% Bonus? 
    // Let's use simplified deduction: Break Miss loses 5 * piece (Base) + Bonus (approx 1%).
    // For this calculator, let's use the weight system strictly:
    // Break Weight = 5 * piece.
    // Great = 80%? No, Break Great is different.
    // Let's stick to "Simple Weight Loss" for now:
    loss += counts.breakMiss * (piece * 5) // Very rough
    
    const result = Math.max(0, 101 - loss)
    return Number(result.toFixed(4))
  }, [counts, weights])

  const dxRating = calculateDxRating(Number(diff.level_value), totalScore)
  const rateString = getRateString(totalScore)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InputGroup label="Tap/Touch" type="tap" counts={counts} onChange={handleChange} color="text-pink-500" />
        <InputGroup label="Hold" type="hold" counts={counts} onChange={handleChange} color="text-yellow-500" />
        <InputGroup label="Slide" type="slide" counts={counts} onChange={handleChange} color="text-blue-500" />
        <InputGroup label="Break" type="break" counts={counts} onChange={handleChange} color="text-red-500" />
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleReset}
          className="flex items-center text-sm text-gray-500 hover:text-pink-500 transition-colors"
        >
          <FaUndo className="mr-1" /> 重置
        </button>
      </div>

      {/* Result Card */}
      <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-pink-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
        <div className="relative z-10 flex justify-between items-end">
          <div>
            <div className="text-slate-400 text-sm mb-1">预测达成率</div>
            <div className="text-4xl font-bold font-mono tracking-tighter">
              {totalScore.toFixed(4)}%
            </div>
            <div className="text-2xl font-bold text-pink-400 mt-1">{rateString}</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400 text-sm mb-1">预测 DX Rating</div>
            <div className="text-3xl font-bold">{dxRating}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InputGroup({ 
  label, 
  type, 
  counts, 
  onChange,
  color
}: { 
  label: string
  type: string
  counts: any
  onChange: (field: any, val: string) => void
  color: string
}) {
  return (
    <div className="space-y-2">
      <div className={`font-bold text-sm ${color}`}>{label}</div>
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border border-slate-100">
          <span className="text-xs text-gray-500 font-bold w-8">Great</span>
          <input 
            type="number" 
            min="0"
            className="w-full bg-transparent text-right font-mono text-sm focus:outline-none"
            placeholder="0"
            value={counts[`${type}Great`] || ""}
            onChange={(e) => onChange(`${type}Great`, e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border border-slate-100">
          <span className="text-xs text-gray-500 font-bold w-8">Good</span>
          <input 
            type="number" 
            min="0"
            className="w-full bg-transparent text-right font-mono text-sm focus:outline-none"
            placeholder="0"
            value={counts[`${type}Good`] || ""}
            onChange={(e) => onChange(`${type}Good`, e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border border-slate-100">
          <span className="text-xs text-gray-500 font-bold w-8">Miss</span>
          <input 
            type="number" 
            min="0"
            className="w-full bg-transparent text-right font-mono text-sm focus:outline-none"
            placeholder="0"
            value={counts[`${type}Miss`] || ""}
            onChange={(e) => onChange(`${type}Miss`, e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
