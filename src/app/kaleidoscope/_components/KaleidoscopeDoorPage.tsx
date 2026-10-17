"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { CONFIG } from "@/config/api"
import SongChecklist, { preloadSongs } from "./SongChecklist"
import type { KaleidoscopeDoorData, ThemeColor } from "../_data/types"

// Tailwind 需要完整类名才能正确 purge，所以在这里集中定义
const themeClasses: Record<ThemeColor, {
  border: string; heading: string; subheading: string
  infoBg: string; infoBorder: string; tableHeader: string
  toggleBg: string; toggleBorder: string; toggleHover: string; toggleText: string
}> = {
  pink: {
    border: "border-pink-300", heading: "text-pink-500", subheading: "text-pink-400",
    infoBg: "bg-pink-50", infoBorder: "border-pink-200", tableHeader: "bg-pink-100",
    toggleBg: "bg-blue-50", toggleBorder: "border-blue-200", toggleHover: "hover:bg-blue-100", toggleText: "text-blue-500",
  },
  purple: {
    border: "border-purple-300", heading: "text-purple-500", subheading: "text-purple-400",
    infoBg: "bg-purple-50", infoBorder: "border-purple-200", tableHeader: "bg-purple-100",
    toggleBg: "bg-purple-50", toggleBorder: "border-purple-200", toggleHover: "hover:bg-purple-100", toggleText: "text-purple-500",
  },
}

interface Props {
  door: KaleidoscopeDoorData
}

export default function KaleidoscopeDoorPage({ door }: Props) {
  const [isSpoilerOpen, setIsSpoilerOpen] = useState(false)
  const [isKeyListOpen, setIsKeyListOpen] = useState(false)
  const t = themeClasses[door.themeColor]

  useEffect(() => {
    if (door.keySongIds.length > 0) {
      preloadSongs(door.keySongIds, door.keyStorageKey)
    }
  }, [door])

  const textShadow = {
    textShadow:
      "-2px -2px 4px rgba(236, 72, 153, 1), 2px -2px 4px rgba(236, 72, 153, 1), -2px 2px 2px rgba(236, 72, 153, 1), 2px 2px 2px rgba(236, 72, 153, 1)",
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center text-white hover:scale-105 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span className="text-xl font-bold" style={textShadow}>
              返回首页
            </span>
          </Link>
          <div className="w-[150px]"></div>
        </div>

        <div className="relative">
          <div className="border-4 border-white bg-white rounded-2xl">
            <div className={`bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden border-4 ${t.border}`}>
              <div className="p-8">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    KALEIDXSCOPE: Phase #{door.phase} {door.nameJa} ({door.nameCn})
                  </h1>
                </div>

                <div className="prose prose-lg max-w-none text-gray-800">
                  {/* Spoiler: General KALEIDXSCOPE Info */}
                  <div
                    className="flex items-center justify-between bg-red-50 p-4 rounded-lg border border-red-200 cursor-pointer hover:bg-red-100 transition-colors mb-4"
                    onClick={() => setIsSpoilerOpen(!isSpoilerOpen)}
                  >
                    <p className="font-bold text-red-500 m-0">
                      折叠部分包含 KALEIDXSCOPE 的相关剧透。请谨慎阅读。
                    </p>
                    {isSpoilerOpen ? (
                      <FaChevronUp className="text-red-500" />
                    ) : (
                      <FaChevronDown className="text-red-500" />
                    )}
                  </div>

                  <AnimatePresence>
                    {isSpoilerOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2">
                          <p className="mb-4">
                            KALEIDXSCOPE（写作 KALEID×SCOPE，发音为&quot;kaleidoscope&quot;，万花筒）是 maimai DX PRiSM 推出的一种游戏模式，用于解锁首发版本中的 BOSS 曲。其机制类似于 maimai MiLK 的生存挑战（Survival Course），并且是 maimai FiNALE 中 PANDORA BOXXX 的继任者。
                          </p>
                          <p className="mb-4">
                            该模式于 2024 年 9 月 12 日在日服上线，2025 年 1 月 16 日在国际服上线，并于 2025 年 12 月 24 日（实则 2026 年 1 月 23 日）在国服上线。
                          </p>

                          <h2 className={`text-2xl font-bold mt-8 mb-4 ${t.heading}`}>基本信息</h2>
                          <p className="mb-4">
                            在 maimai DX PRiSM 和 maimai DX PRiSM PLUS 中，每个原创区域的尽头都有一扇锁住的&quot;门&quot;，需要对应的&quot;钥匙&quot;才能解锁。首次解锁后，KALEIDXSCOPE 游戏模式将从下一局起出现在模式选择画面中。
                          </p>
                          <p className="mb-4">
                            要获得钥匙，必须满足每个钥匙独特的特定条件。满足条件后，在该局游戏结束时会显示通知，确认已获得钥匙。即使尚未发现对应的门，也可以先获得钥匙。
                          </p>
                          <p className="mb-4">
                            只要解锁了至少一扇门，该模式即可选择。选择该模式时会显示警告，玩家必须确认后才能进入。
                          </p>

                          <h2 className={`text-2xl font-bold mt-8 mb-4 ${t.heading}`}>机制</h2>
                          <p className="mb-4">
                            每个编号的阶段（Phase）对应游戏内宇宙的一个原创区域。选择已用钥匙解锁的路线，将开始对应的 3 首歌曲挑战。
                          </p>
                          <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>挑战开始前会显示当前的生命值，玩家需再次确认。</li>
                            <li>如果同一台机器上的两名玩家中只有一人解锁了门和钥匙，另一名玩家仍可游玩该路线，但无法解锁歌曲，也无法获得门的碎片。在这种情况下，该路线不会被标记为已通关。</li>
                            <li>如果进入该模式时没有可游玩的路线，游戏将默认开始普通模式。</li>
                          </ul>

                          <h3 className={`text-xl font-bold mt-6 mb-3 ${t.subheading}`}>路线规则：</h3>
                          <ul className="list-disc pl-5 mb-4 space-y-2">
                            <li>使用生命值系统，每一个非 Perfect 的判定都会扣除 1 点生命值。曲目之间没有生命值回复，生命值耗尽时该局游戏立即结束。</li>
                            <li>与段位认定的&quot;真段位&quot;不同，在多人游戏模式中，如果一名玩家失败而另一名玩家未失败，失败的玩家无法继续游玩，该局剩余时间将被锁定。</li>
                            <li>使用 TRACK SKIP 会导致挑战立即失败。</li>
                            <li>路线中的每一首曲目都是从该路线的曲库中随机抽取的。最后一首曲目是一首新歌，通关后即可解锁，由该区域的一位作曲家创作。</li>
                            <li>只能选择等于或高于当前解锁门槛的难度。难度在第一首曲目开始前选择，且 3 首曲目必须以所选难度游玩。</li>
                            <li>生命值和难度门槛会根据通关人数（日服）或发布天数（国际服 & 国服）逐步放宽。条件每天凌晨 4:00 更新。</li>
                          </ul>

                          <p className="mt-8 text-sm text-gray-500 italic border-t pt-4">
                            *内容参考： RemyWiki
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Door-specific info */}
                  <h2 className={`text-2xl font-bold mt-8 mb-4 ${t.heading}`}>
                    Phase #{door.phase}: {door.nameJa} ({door.nameCn})
                  </h2>
                  <div className={`${t.infoBg} p-6 rounded-xl border ${t.infoBorder} mb-6`}>
                    <ul className="space-y-2">
                      <li>
                        <strong>解锁区域：</strong> {door.unlockArea} ({door.unlockAreaCn})
                      </li>
                      <li>
                        <strong>解锁曲目：</strong>{" "}
                        {door.bossSong.id > 0 ? (
                          <Link
                            href={`${CONFIG.API.WEB.MUSIC}/${door.bossSong.id}`}
                            target="_blank"
                            className="text-pink-500 hover:underline"
                          >
                            {door.bossSong.name}
                          </Link>
                        ) : (
                          <span>{door.bossSong.name}</span>
                        )}
                      </li>
                      <li><strong>艺术家：</strong> {door.bossSong.artist}</li>
                      <li><strong>对应区域：</strong> {door.correspondingArea}</li>
                    </ul>
                  </div>

                  <h3 className={`text-xl font-bold mt-6 mb-3 ${t.subheading}`}>
                    {door.nameCn}解锁条件
                  </h3>
                  <p className="mb-4">
                    <span className="font-bold">{door.doorUnlockCondition}</span>
                  </p>

                  {/* Key acquisition */}
                  <h3 className={`text-xl font-bold mt-6 mb-3 ${t.subheading}`}>钥匙获取条件</h3>
                  <div className="mb-6">
                    {door.keyConditions.length > 0 && (
                      <ul className="list-disc pl-5 mb-4 space-y-2">
                        {door.keyConditions.map((cond, i) => (
                          <li key={i}>{cond}</li>
                        ))}
                      </ul>
                    )}
                    {door.keySongIds.length > 0 ? (
                      <>
                        <div
                          className={`flex items-center justify-between ${t.toggleBg} p-4 rounded-lg border ${t.toggleBorder} cursor-pointer ${t.toggleHover} transition-colors mb-4`}
                          onClick={() => setIsKeyListOpen(!isKeyListOpen)}
                        >
                          <p className={`font-bold ${t.toggleText} m-0`}>
                            {door.keySongDescription}
                          </p>
                          {isKeyListOpen ? (
                            <FaChevronUp className={t.toggleText} />
                          ) : (
                            <FaChevronDown className={t.toggleText} />
                          )}
                        </div>
                        <AnimatePresence>
                          {isKeyListOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-2">
                                <SongChecklist songIds={door.keySongIds} storageKey={door.keyStorageKey} showCheckmark={door.showCheckmark} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <p className="text-gray-500 italic">钥匙歌曲列表待更新</p>
                    )}
                  </div>

                  {/* Course structure */}
                  <h3 className={`text-xl font-bold mt-6 mb-3 ${t.subheading}`}>完走条件</h3>
                  <div className={`mb-6 ${t.infoBg} p-6 rounded-xl border ${t.infoBorder}`}>
                    <ul className="space-y-3">
                      {door.tracks.map((track, i) => (
                        <li key={i} className="flex items-start">
                          <span className={`font-bold ${t.heading} min-w-[80px]`}>{track.label}</span>
                          <span>
                            {track.description}
                            {track.songLink && (
                              track.songLink.id > 0 ? (
                                <Link
                                  href={`${CONFIG.API.WEB.MUSIC}/${track.songLink.id}`}
                                  target="_blank"
                                  className="text-pink-500 hover:underline"
                                >
                                  {track.songLink.name}
                                </Link>
                              ) : (
                                <span>{track.songLink.name}</span>
                              )
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Difficulty progression table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className={t.tableHeader}>
                        <tr>
                          <th className="py-2 px-4 border-b text-left">生命值</th>
                          <th className="py-2 px-4 border-b text-left">所需难度</th>
                          <th className="py-2 px-4 border-b text-left">发布天数</th>
                          <th className="py-2 px-4 border-b text-left">日期</th>
                        </tr>
                      </thead>
                      <tbody>
                        {door.difficultyProgression.map((row, i) => (
                          <tr key={i}>
                            <td className="py-2 px-4 border-b">{row.life}</td>
                            <td className="py-2 px-4 border-b">{row.difficulty}</td>
                            <td className="py-2 px-4 border-b">{row.daysAfter}</td>
                            <td className="py-2 px-4 border-b">{row.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
