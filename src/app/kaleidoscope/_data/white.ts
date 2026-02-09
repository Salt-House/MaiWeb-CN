import { KaleidoscopeDoorData } from "./types"

const whiteDoor: KaleidoscopeDoorData = {
  slug: "white",
  phase: 2,
  nameJa: "白の扉",
  nameCn: "白之门",
  themeColor: "pink",
  doorColorClass: "text-gray-400",
  doorImage: "/img/kaleidoscope/KALEDOSCOPE_White_door.png",

  unlockArea: "天界ちほー8",
  unlockAreaCn: "天界区域 8",
  bossSong: { id: 1745, name: "氷滅の135小節", artist: "大国奏音" },
  correspondingArea: "天界区域",

  doorUnlockCondition: "完走 天界区域8",

  keyConditions: [
    "1. 获取并装备 背景板「Latent Kingdom」（通过集章卡获取。似乎还可以通过舞里程商店获取？待确定）；",
    "2. 1pc 内只游玩 大国奏音 作曲的 任意难度 的乐曲，不能重复。",
  ],
  keySongDescription: "大国奏音 作曲的乐曲共有6首：",
  keySongIds: [1102, 1234, 1300, 1529, 1542, 1612],
  keyStorageKey: "kaleidoscope_white_gate_checked",
  showCheckmark: false,

  tracks: [
    {
      label: "Track 1:",
      description: "神様エリア (天界 & 高天原区域) 的歌曲（除完美挑战曲）中随机一首",
    },
    {
      label: "Track 2:",
      description:
        "神様エリア (天界 & 高天原区域) 完美挑战 歌曲、TEmPTaTiON、封焔の135秒 中随机一首",
    },
    { label: "Track 3:", description: "", songLink: { id: 1745, name: "氷滅の135小節" } },
  ],
  difficultyProgression: [
    { life: 1, difficulty: "Master", daysAfter: "更新首日", date: "2026/2/10" },
    { life: 10, difficulty: "Master", daysAfter: "3天后", date: "2026/2/13" },
    { life: 30, difficulty: "Master", daysAfter: "6天后", date: "2026/2/16" },
    { life: 50, difficulty: "Master", daysAfter: "9天后", date: "2026/2/19" },
    { life: 100, difficulty: "Expert", daysAfter: "13天后", date: "2026/2/23" },
    { life: 999, difficulty: "任意难度", daysAfter: "20天后", date: "2026/3/2" },
  ],
}

export default whiteDoor
