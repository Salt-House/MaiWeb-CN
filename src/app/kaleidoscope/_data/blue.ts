import { KaleidoscopeDoorData } from "./types"

const blueDoor: KaleidoscopeDoorData = {
  slug: "blue",
  phase: 1,
  nameJa: "青の扉",
  nameCn: "青之门",
  themeColor: "pink",
  doorColorClass: "text-sky-400",
  doorImage: "/img/kaleidoscope/KALEDOSCOPE_Blue_door.png",

  unlockArea: "スカイストリートちほー6",
  unlockAreaCn: "天空街区域 6",
  bossSong: { id: 1740, name: "果ての空、僕らが見た光。", artist: "TAKU1175 ft.駄々子" },
  correspondingArea: "天空街区域",

  doorUnlockCondition: "完走 天空街区域6",

  keyConditions: [],
  keySongDescription: "以 任意难度 游玩下列29首 天空街区域 歌曲：",
  keySongIds: [
    1009, 1008, 1100, 1097, 1098, 1099, 1164, 1163, 1162, 1161, 1228, 1229,
    1230, 1231, 1463, 1464, 1465, 1466, 1538, 1539, 1540, 1541, 1620, 1622,
    1623, 1621, 1737, 1738, 1739,
  ],
  keyStorageKey: "kaleidoscope_blue_gate_checked",
  showCheckmark: true,

  tracks: [
    { label: "Track 1:", description: "23首 天空街区域 歌曲 （除完美挑战曲）中 随机一首" },
    { label: "Track 2:", description: "6首 天空街区域 完美挑战 歌曲 中随机一首" },
    { label: "Track 3:", description: "", songLink: { id: 1740, name: "果ての空、僕らが見た光。" } },
  ],

  difficultyProgression: [
    { life: 1, difficulty: "Master", daysAfter: "更新首日", date: "2026/1/23" },
    { life: 10, difficulty: "Master", daysAfter: "3天后", date: "2026/1/26" },
    { life: 30, difficulty: "Master", daysAfter: "6天后", date: "2026/1/29" },
    { life: 50, difficulty: "Master", daysAfter: "9天后", date: "2026/2/1" },
    { life: 100, difficulty: "Expert", daysAfter: "13天后", date: "2026/2/5" },
    { life: 999, difficulty: "任意难度", daysAfter: "20天后", date: "2026/2/12" },
  ],
}

export default blueDoor
