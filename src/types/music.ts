// 难度成绩分布曲线
export interface RateCurve {
  sample_size: number
  fit_level_value: number
  avg_achievements: number
  stdev_achievements: number
  avg_dx_score: number
  rate_sample_size: { [key: number]: number }
  fc_sample_size: { [key: number]: number }
}

// 谱面类型枚举
export enum ChartType {
  STANDARD = "standard",
  DX = "dx",
  UTAGE = "utage",
}

// 难度信息接口
export interface DifficultyInfo {
  type: ChartType
  level: string
  level_value: number
  level_index: number
  note_designer: string
  version: number
  tap_num: number
  hold_num: number
  slide_num: number
  touch_num: number
  break_num: number
  curve?: RateCurve
  kanji?: string
  description?: string
  is_buddy?: boolean
}

// 歌曲数据模型接口
export interface Song {
  id: number
  title: string
  artist: string
  genre: string
  bpm: number
  map: string
  version: number
  rights: string | null
  aliases: string[]
  disabled: boolean
  difficulties: {
    standard: DifficultyInfo[]
    dx: DifficultyInfo[]
    utage: DifficultyInfo[]
  }
}

export interface SongScoreProps {
  id: string
  title: string
  level: string
  level_index: number
  achievements: number
  fc: string
  fs: string
  dx_score: number
  dx_rating: number
  rate: number
  type: string
}
