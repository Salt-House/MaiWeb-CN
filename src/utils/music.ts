// 难度颜色辅助函数
export function getDifficultyColor(difficulty: number): string {
  const colors: { [key: number]: string } = {
    0: "#1eb300",
    1: "#e1d030",
    2: "#ff1744",
    3: "#ab47bc",
    4: "#acaadd",
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
