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