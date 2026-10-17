import { DifficultyInfo } from "@/types/music"

// 难度颜色辅助函数
export function getDifficultyColor(difficulty: number): string {
  const colors: { [key: number]: string } = {
    0: "#1eb300",
    1: "#e1d030",
    2: "#ff1744",
    3: "#ab47bc",
    4: "#acaadd",
    5: "#b38c00", // Remaster? or other
  }
  return colors[difficulty] || "#000000"
}

// 乐曲种类文字转换
export function transferText(genre: string): string {
  const texts: { [key: string]: string } = {
    POPSアニメ: "流行&动漫",
    niconicoボーカロイド: "niconico & VOCALOID",
    東方Project: "东方Project",
    ゲームバラエティ: "其他游戏",
    maimai: "舞萌",
    オンゲキCHUNITHM: "音击/中二节奏",
    utage: "宴会场",
  }
  return texts[genre] || genre
}

// 乐曲版本文字转换
export function transferVersion(version: number): string {
  const versions: { [key: number]: string } = {
    10000: "maimai",
    11000: "maimai PLUS",
    12000: "maimai GreeN",
    13000: "maimai GreeN PLUS",
    14000: "maimai ORANGE",
    15000: "maimai ORANGE PLUS",
    16000: "maimai PiNK",
    17000: "maimai PiNK PLUS",
    18000: "maimai MURASAKi",
    18500: "maimai MURASAKi PLUS",
    19000: "maimai MILK",
    19500: "maimai MILK PLUS",
    19900: "maimai FiNALE",
    20000: "舞萌DX",
    21000: "舞萌DX 2021",
    22000: "舞萌DX 2022",
    23000: "舞萌DX 2023",
    24000: "舞萌DX 2024",
    25000: "舞萌DX 2025",
  }

  return (
    versions[version] ||
    versions[Math.floor(version / 100) * 100] ||
    String(version)
  )
}

// 乐曲种类对应颜色
export function getGenreColor(genre: string): { bg: string; border: string } {
  const colors: { [key: string]: { bg: string; border: string } } = {
    POPSアニメ: { bg: "rgb(255,200,0)", border: "#b38c00" },
    "流行&动漫": { bg: "rgb(255,200,0)", border: "#b38c00" },
    niconicoボーカロイド: { bg: "rgb(69,197,255)", border: "rgb(0,108,196)" },
    "niconico & VOCALOID": { bg: "rgb(69,197,255)", border: "rgb(0,108,196)" },
    東方Project: { bg: "rgb(159,54,227)", border: "#7f2bb6" },
    东方Project: { bg: "rgb(159,54,227)", border: "#7f2bb6" },
    ゲームバラエティ: { bg: "rgb(122,231,83)", border: "#62b942" },
    其他游戏: { bg: "rgb(122,231,83)", border: "#62b942" },
    maimai: { bg: "rgb(255,70,70)", border: "#802323" },
    舞萌: { bg: "rgb(255,70,70)", border: "#802323" },
    オンゲキCHUNITHM: { bg: "rgb(48,157,248)", border: "rgb(0,108,196)" },
    "音击&中二节奏": { bg: "rgb(48,157,248)", border: "rgb(0,108,196)" },
    utage: { bg: "rgb(220,56,184)", border: "rgb(179,46,121)" },
  }
  return colors[genre] || { bg: "rgb(255,200,0)", border: "#b38c00" }
}

// 获取总音符数
export const getTotalNotes = (diff: DifficultyInfo) => {
  const noteTypes: (keyof DifficultyInfo)[] = [
    "tap_num",
    "hold_num",
    "slide_num",
    "touch_num",
    "break_num",
  ]
  return noteTypes.reduce((sum, type) => sum + (Number(diff[type]) || 0), 0)
}

// 获取各 Note 的权重
export const getNotesWeight = (diff: DifficultyInfo) => {
  const piece =
    101 /
    (diff.tap_num +
      diff.touch_num +
      diff.hold_num * 2 +
      diff.slide_num * 3 +
      diff.break_num * 5)

  // 保留小数点后四位
  const toFixed4 = (n: number) => Number(n.toFixed(4))
  return {
    tap: {
      num: diff.tap_num,
      weight: toFixed4(piece),
    },
    hold: {
      num: diff.hold_num,
      weight: toFixed4(piece * 2),
    },
    slide: {
      num: diff.slide_num,
      weight: toFixed4(piece * 3),
    },
    touch: {
      num: diff.touch_num,
      weight: toFixed4(piece),
    },
    break: {
      num: diff.break_num,
      weight: toFixed4(piece * 5),
    },
    piece: piece // 导出基础单位 piece 以供高精度计算
  }
}

// 计算单曲 DX Rating
export function calculateDxRating(level: number, achievement: number): number {
  let rate = 0
  if (achievement >= 100.5) rate = 22.4
  else if (achievement >= 100.0) rate = 21.6
  else if (achievement >= 99.5) rate = 21.1
  else if (achievement >= 99.0) rate = 20.8
  else if (achievement >= 98.0) rate = 20.3
  else if (achievement >= 97.0) rate = 20.0
  else if (achievement >= 94.0) rate = 16.8
  else if (achievement >= 90.0) rate = 15.2
  else if (achievement >= 80.0) rate = 13.6
  else rate = 0 // 一般不会低于 80

  return Math.floor(level * rate * (achievement / 100))
}

// 获取评价等级
export function getRateString(achievement: number): string {
  if (achievement >= 100.5) return "SSS+"
  if (achievement >= 100) return "SSS"
  if (achievement >= 99.5) return "SS+"
  if (achievement >= 99) return "SS"
  if (achievement >= 98) return "S+"
  if (achievement >= 97) return "S"
  if (achievement >= 94) return "AAA"
  if (achievement >= 90) return "AA"
  if (achievement >= 80) return "A"
  if (achievement >= 75) return "BBB"
  if (achievement >= 70) return "BB"
  if (achievement >= 60) return "B"
  if (achievement >= 50) return "C"
  return "D"
}
