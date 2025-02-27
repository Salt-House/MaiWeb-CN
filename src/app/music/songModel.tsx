// 歌曲数据模型接口
export interface Song {
  id: number;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  map: string;
  version: number;
  rights: string | null;
  aliases: string[];
  disabled: boolean;
  difficulties: {
    standard: DifficultyInfo[];
    dx: DifficultyInfo[];
    utage: DifficultyInfo[];
  };
}

// 难度信息接口
export interface DifficultyInfo {
  type: ChartType;
  level: string;
  level_value: number;
  level_index: number;
  note_designer: string;
  version: number;
  tap_num: number;
  hold_num: number;
  slide_num: number;
  touch_num: number;
  break_num: number;
  curve?: RateCurve;
  kanji?: string;
  description?: string;
  is_buddy?: boolean;
}

// 谱面类型枚举
export enum ChartType {
  STANDARD = 'standard',
  DX = 'dx',
  UTAGE = 'utage'
}


// 难度成绩分布曲线
export interface RateCurve {
  sample_size: number;
  fit_level_value: number;
  avg_achievements: number;
  stdev_achievements: number;
  avg_dx_score: number;
  rate_sample_size: { [key: number]: number };
  fc_sample_size: { [key: number]: number };
}

// 难度颜色辅助函数
export function getDifficultyColor(difficulty: keyof typeof colors): string {
  const colors = {
    0: '#1eb300',
    1: '#e1d030',
    2: '#ff1744',
    3: '#ab47bc',
    4: '#acaadd'
  }
  return colors[difficulty]
}

// 乐曲种类文字转换
export function transferText(genre: string): string {
  const texts = {
    'POPSアニメ': '流行&动漫',
    'niconicoボーカロイド': 'niconico & VOCALOID',
    '東方Project': '东方Project',
    'ゲームバラエティ': '其他游戏',
    'maimai': '舞萌',
    'オンゲキCHUNITHM': '音击/中二节奏',
    'utage': '宴会场'
  }
  return texts[genre as keyof typeof texts] || genre
}

// 乐曲种类对应颜色
export function getGenreColor(genre: string): { bg: string, border: string } {
  const colors = {
    'POPSアニメ': { bg: 'rgb(255,200,0)', border: '#b38c00' },
    '流行&动漫': { bg: 'rgb(255,200,0)', border: '#b38c00' },
    'niconicoボーカロイド': { bg: 'rgb(69,197,255)', border: 'rgb(0,108,196)' },
    'niconico & VOCALOID': { bg: 'rgb(69,197,255)', border: 'rgb(0,108,196)' },
    '東方Project': { bg: 'rgb(159,54,227)', border: '#7f2bb6' },
    '东方Project': { bg: 'rgb(159,54,227)', border: '#7f2bb6' },
    'ゲームバラエティ': { bg: 'rgb(122,231,83)', border: '#62b942' },
    '其他游戏': { bg: 'rgb(122,231,83)', border: '#62b942' },
    'maimai': { bg: 'rgb(255,70,70)', border: '#802323' },
    '舞萌': { bg: 'rgb(255,70,70)', border: '#802323' },
    'オンゲキCHUNITHM': { bg: 'rgb(48,157,248)', border: 'rgb(0,108,196)' },
    '音击&中二节奏': { bg: 'rgb(48,157,248)', border: 'rgb(0,108,196)' },
    'utage': { bg: 'rgb(220,56,184)', border: 'rgb(179,46,121)' }
  }
  return colors[genre as keyof typeof colors] || { bg: 'rgb(255,200,0)', border: '#b38c00' }
}

// 难度等级枚举
// export enum Difficulty {
//   BASIC = 'Basic',
//   ADVANCED = 'Advanced',
//   EXPERT = 'Expert',
//   MASTER = 'Master',
//   REMASTER = 'Re:Master'
// }

// export enum Category {
//   POPS_AND_ANIME = '流行&动漫',
//   NICONICO_AND_VOCALOID = 'niconico&VOCALOID',
//   TOUHOU_PROJECT = '东方Project',
//   GAME_AND_VARIETY = '其他游戏',
//   MAIMAI = '舞萌',
//   ONGEKI_AND_CHUNITHM = '音击&中二',
//   UTAGE = '宴会场'
// }