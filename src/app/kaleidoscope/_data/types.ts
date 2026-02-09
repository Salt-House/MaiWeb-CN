export interface KaleidoscopeTrack {
  label: string
  description: string
  songLink?: { id: number; name: string }
}

export interface DifficultyStep {
  life: number | string
  difficulty: string
  daysAfter: string
  date: string
}

export type ThemeColor = "pink" | "purple"

export interface KaleidoscopeDoorData {
  slug: string
  phase: number
  nameJa: string
  nameCn: string
  themeColor: ThemeColor
  // 首页卡片上门名的颜色（如 "text-sky-400"），与 themeColor 无关
  doorColorClass: string
  doorImage: string

  unlockArea: string
  unlockAreaCn: string
  bossSong: { id: number; name: string; artist: string }
  correspondingArea: string

  doorUnlockCondition: string

  keyConditions: string[]
  keySongDescription: string
  keySongIds: number[]
  keyStorageKey: string
  showCheckmark: boolean

  tracks: KaleidoscopeTrack[]
  difficultyProgression: DifficultyStep[]
}
