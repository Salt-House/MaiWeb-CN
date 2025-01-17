// 难度等级枚举
export enum Difficulty {
  BASIC = 'Basic',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert',
  MASTER = 'Master',
  REMASTER = 'Re:Master'
}

// 谱面类型枚举
export enum ChartType {
  STANDARD = 'Standard',
  DX = 'DX'
}

// noinspection JSUnusedGlobalSymbols
export enum Category {
  POPS_AND_ANIME = '流行&动漫',
  NICONICO_AND_VOCALOID = 'niconico&VOCALOID',
  TOUHOU_PROJECT = '东方Project',
  GAME_AND_VARIETY = '其他游戏',
  MAIMAI = '舞萌',
  ONGEKI_AND_CHUNITHM = '音击&中二',
  UTAGE = '宴会场'
}

// 难度信息接口
export interface DifficultyInfo {
  difficulty: Difficulty;
  level: string;
  internalLevel?: number; // 内定数
  noteDesigner?: string;
  totalNoteCount: number;
  tapCount: number;
  holdCount: number;
  slideCount: number;
  touchCount: number;
  breakCount: number;
}

// 歌曲数据模型接口
export interface Song {
  id: string;
  title: string;
  titleJP?: string;
  titleEN?: string;
  nickname?: [string];
  artist: string;
  coverImageUrl: string;
  category: string;
  chartType: [string];
  version: string;
  bpm: number;
  difficulties: DifficultyInfo[];
  isNew?: boolean;
  releaseDate?: string;
}

export const sampleSong: Song = {
  id: '114514',
  title: '愛包ダンスホール',
  titleJP: '愛包ダンスホール',
  titleEN: 'Heart Pie Dancehall',
  nickname: ['爱包舞厅'],
  artist: 'HIMEHINA',
  coverImageUrl: '/src/app/music/testResource/HeartPieDanceHall.png',
  category: Category.POPS_AND_ANIME,
  chartType: [ChartType.DX],
  version: 'maimaiDX PRiSM',
  bpm: 141,
  difficulties: [
    {
      difficulty: Difficulty.BASIC,
      level: "3",
      totalNoteCount: 182,
      tapCount: 151,
      holdCount: 13,
      slideCount: 4,
      touchCount: 4,
      breakCount: 10
    },
    {
      difficulty: Difficulty.ADVANCED,
      level: "6",
      totalNoteCount: 315,
      tapCount: 275,
      holdCount: 16,
      slideCount: 9,
      touchCount: 14,
      breakCount: 1
    },
    {
      difficulty: Difficulty.EXPERT,
      level: "9",
      internalLevel: 9.2,
      noteDesigner: 'サファ太',
      totalNoteCount: 514,
      tapCount: 394,
      holdCount: 45,
      slideCount: 21,
      touchCount: 20,
      breakCount: 34
    },
    {
      difficulty: Difficulty.MASTER,
      level: "13",
      internalLevel: 13.1,
      noteDesigner: 'アマリリス',
      totalNoteCount: 839,
      tapCount: 598,
      holdCount: 65,
      slideCount: 75,
      touchCount: 46,
      breakCount: 55
    },
    // 测试是否正常显示remaster难度
    // {
    //     difficulty: Difficulty.REMASTER,
    //     level: "13+",
    //     internalLevel: 13.1,
    //     noteDesigner: 'アマリリス',
    //     totalNoteCount: 839,
    //     tapCount: 598,
    //     holdCount: 65,
    //     slideCount: 75,
    //     touchCount: 46,
    //     breakCount: 55
    // },
  ]
}