"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Song } from "@/types/music"
import { transferVersion } from "@/utils/music"
import SongList from "./songList"
// import LoadingSpinner from "@/components/ui/LoadingSpinner"
import ActionButton from "@/components/ui/ActionButton"
// import { FaFilter, FaTimes } from "react-icons/fa"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
// import Notice from "../components/Notice"
// import PageTransitionWrapper from "../components/PageTransitionWrapper"
import { getSongs as fetchSongs, getSongRecentUpdated as fetchRecentUpdated } from "@/services/music"

const currentVersion = "25008"

const version: (keyof typeof versionIds)[] = [
  "maimai",
  "GreeN",
  "ORANGE ",
  "PiNK",
  "MURASAKi ",
  "MiLK",
  "FiNALE",
  "舞萌DX",
  "舞萌DX 2021",
  "舞萌DX 2022",
  "舞萌DX 2023",
  "舞萌DX 2024",
  "舞萌DX 2025",
]
const versionIds = {
  maimai: 10000,
  GreeN: 12000,
  "ORANGE ": 14000,
  PiNK: 16000,
  "MURASAKi ": 18000,
  MiLK: 19000,
  FiNALE: 19900,
  舞萌DX: 20000,
  "舞萌DX 2021": 21000,
  "舞萌DX 2022": 22000,
  "舞萌DX 2023": 23000,
  "舞萌DX 2024": 24000,
  "舞萌DX 2025": 25000,
}
const versionPlus: (keyof typeof versionPlusIds)[] = [
  "MAIMAI_PLUS",
  "MAIMAI_GREEN_PLUS",
  "MAIMAI_ORANGE_PLUS",
  "MAIMAI_PINK_PLUS",
  "MAIMAI_MURASAKI_PLUS",
  "MAIMAI_MILK_PLUS",
]
const versionPlusIds = {
  MAIMAI_PLUS: 11000,
  MAIMAI_GREEN_PLUS: 13000,
  MAIMAI_ORANGE_PLUS: 15000,
  MAIMAI_PINK_PLUS: 17000,
  MAIMAI_MURASAKI_PLUS: 18500,
  MAIMAI_MILK_PLUS: 19500,
}

// const Options = [
//   { label: "最新歌曲在前", value: "desc" },
//   { label: "最老歌曲在前", value: "dsc" },
// ]

export default function MusicPage() {
  //const songs = [sampleSong, sampleSong, sampleSong, sampleSong, sampleSong, sampleSong]
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false) // 新增加载更多状态
  const [error, setError] = useState<string | null>(null)
  const [advancedSearchDisplay, setAdvancedSearchDisplay] = useState(false)
  const [selectedOption, setSelectedOption] = useState("category")
  // 添加一个状态来跟踪当前选择的分类名称
  const [currentCategory, setCurrentCategory] = useState<string>("最近更新")
  // UI模式状态管理
  const [isLegacyMode, setIsLegacyMode] = useState(false)

  const [filteredUrl, setFilteredUrl] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const defaultUrl = `version=${currentVersion}`

  // 初始化时从localStorage读取UI模式设置
  useEffect(() => {
    const savedMode = localStorage.getItem("maimaimoe-music-ui-mode")
    if (savedMode === "legacy") {
      setTimeout(() => setIsLegacyMode(true), 0)
    }
  }, [])

  // 当UI模式改变时保存到localStorage
  useEffect(() => {
    localStorage.setItem("maimaimoe-music-ui-mode", isLegacyMode ? "legacy" : "modern")
  }, [isLegacyMode])

  const getSongs = useCallback(async (filteredUrl: string, page: number = 1) => {
    setFilteredUrl(filteredUrl)
    if (page == 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    // 根据filteredUrl设置当前分类名称
    if (filteredUrl.includes(`version=${currentVersion}`)) {
      setCurrentCategory("最近更新")
    } else if (filteredUrl.includes("genre=POPSアニメ")) {
      setCurrentCategory("流行&动漫")
    } else if (filteredUrl.includes("genre=niconicoボーカロイド")) {
      setCurrentCategory("niconico&VOCALOID")
    } else if (filteredUrl.includes("genre=東方Project")) {
      setCurrentCategory("东方Project")
    } else if (filteredUrl.includes("genre=ゲームバラエティ")) {
      setCurrentCategory("其他游戏")
    } else if (filteredUrl.includes("genre=maimai")) {
      setCurrentCategory("舞萌")
    } else if (filteredUrl.includes("genre=オンゲキCHUNITHM")) {
      setCurrentCategory("音击&中二")
    } else if (filteredUrl.includes("type=utage")) {
      setCurrentCategory("宴会场")
    } else if (filteredUrl.includes("level=")) {
      const level = filteredUrl.split("level=")[1].split("&")[0]
      setCurrentCategory(`等级 ${decodeURIComponent(level)}`)
    } else if (filteredUrl.includes("versions=")) {
      const versionId = filteredUrl.split("versions=")[1].split("&")[0]
      const version =
        Object.entries(versionIds).find(([, id]) => id.toString() === versionId)?.[0] ||
        Object.entries(versionPlusIds).find(([, id]) => id.toString() === versionId)?.[0]
      setCurrentCategory(version || "未知版本")
    } else if (filteredUrl.includes("keywords=")) {
      const keyword = filteredUrl.split("keywords=")[1].split("&")[0]
      setCurrentCategory(`搜索: ${decodeURIComponent(keyword)}`)
    } else {
      setLoadingMore(true)
    }

    try {
      const data = await fetchSongs(filteredUrl, page, 100)

      if (page === 1) {
        setSongs(data)
      } else {
        setSongs(prev => [...prev, ...data])
      }
      console.log(data)
      //console.log(url)
      setHasMore(data.length === 100)
      setCurrentPage(page)
      setLoading(false)
      setLoadingMore(false)
    } catch (err) {
      console.error("获取数据错误:", err)
      setError(err instanceof Error ? err.message : "获取数据失败")
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  const getSongRecentUpdated = useCallback(async () => {
    try {
      const data = await fetchRecentUpdated()
      setSongs(data)
      setHasMore(data.length === 100)
      setCurrentPage(1)
      setLoading(false)
      setLoadingMore(false)
    } catch (err) {
      console.error("获取数据错误:", err)
      setError(err instanceof Error ? err.message : "获取数据失败")
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    // TODO(v2): migrate to a unified data-fetching layer to avoid cascading renders
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getSongRecentUpdated()
  // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [defaultUrl, getSongs])

  // MARK: - 主视图
  return (
    <>
      <style jsx>{`
        select {
          appearance: none; /* 清除默认样式 */
          -webkit-appearance: none; /* 兼容 Safari */
          -moz-appearance: none; /* 兼容 Firefox */
          color: white; /* 默认文本颜色 */
        }
        select option {
          color: black; /* 默认选项文本颜色 */
          background-color: white; /* 默认选项背景颜色 */
        }
        select:focus option:checked {
          color: black; /* 被选中选项的文本颜色 */
          background-color: white; /* 被选中选项的背景颜色 */
        }
        select:not(:focus) option:checked {
          color: black; /* 失去焦点时被选中选项的文本颜色 */
          background-color: white; /* 失去焦点时被选中选项的背景颜色 */
        }
      `}</style>

      {/*Top Search Options Bar*/}
      <div
        id="filter-select"
        className="relative max-sm:w-full flex flex-col justify-center items-center mt-10 mb-24 text-black "
      >
        <div className="border-4 relative border-mai-blue-deep max-sm:w-[90%] bg-white rounded-3xl shadow-2xl">
          <div className="w-[900px] max-sm:w-full max-sm:h-96 mx-auto h-80 rounded-3xl flex flex-col justify-center text-center">
            <div className="items-center">
              <div className="absolute -top-4 sm:-top-5 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-2 rounded-full border-4 border-mai-blue-deep bg-mai-yellow px-5 py-0.5 shadow-lg">
              <Image src="/assets/maiDecorationBg/note_02.png" alt="" width={22} height={22} className="w-5 h-5 max-sm:hidden" />
              <span className="text-2xl sm:text-3xl font-mai font-bold tracking-widest text-mai-blue-deep">音乐</span>
              <Image src="/assets/maiDecorationBg/note_01.png" alt="" width={22} height={22} className="w-5 h-5 max-sm:hidden" />
              </div>
              <div className="flex flex-row max-sm:w-[90%] max-sm:flex-col max-sm:justify-center max-sm:items-center max-sm:space-x-0 max-sm:mt-0 max-sm:mb-0 justify-center items-center space-x-16 mt-8 mb-2">
                <div className="w-80 h-12 max-sm:w-full max-sm:my-0 max-sm:mt-4 rounded-full flex flex-row justify-center items-center text-center my-5 space-x-3 border-2 border-mai-yellow bg-mai-purple shadow-[0_6px_14px_rgba(1,45,123,0.3)]">
                  <div className="text-white max-sm:ml-0 ml-2">按照</div>
                  <select
                    className="w-40 h-9 rounded-full px-4 bg-transparent focus:outline-none focus:ring-2 focus:ring-mai-yellow transition-all duration-300 border border-white/40 bg-white/10"
                    value={selectedOption}
                    onChange={e => setSelectedOption(e.target.value)}
                  >
                    <option value="category">乐曲种类</option>
                    {/* <option value="aeuio">あいうえお</option> */}
                    <option value="level">等级</option>
                    <option value="version">版本</option>
                  </select>
                  <div className="text-white max-sm:ml-0 ml-2">分类</div>
                </div>
                <div className="w-80 max-sm:w-full h-12 bg-white border-4 border-mai-blue-deep rounded-full flex flex-row justify-center items-center text-center shadow-lg my-5">
                  <div className="flex w-full h-full overflow-hidden">
                    <div
                      className="w-1/3 bg-mai-blue-deep flex items-center justify-center border-r-4 border-mai-blue-deep"
                      style={{ borderTopLeftRadius: "1rem", borderBottomLeftRadius: "1rem" }}
                    >
                      <div className="text-white">搜索</div>
                    </div>
                    <div className="w-2/3 flex items-center justify-center">
                      <input
                        type="text"
                        placeholder="乐曲名/别名/作曲家"
                        className="w-[90%] h-9 bg-transparent text-black placeholder-gray-500 focus:outline-none transition-none"
                        onChange={e => {
                          if (e.target.value !== "") {
                            getSongs(`keywords=${e.target.value}`)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[172px]">
                {/* 根据选择的选项显示不同分类选项 */}
                {selectedOption === "category" && <CategoryBar getSongs={getSongs} getSongRecentUpdated={getSongRecentUpdated} />}
                {/* {selectedOption === 'aeuio' && <AeuioBar getSongs={getSongs} />} */}
                {selectedOption === "level" && <LevelBar getSongs={getSongs} />}
                {selectedOption === "version" && <VersionBar getSongs={getSongs} />}
              </div>
            </div>
            {/* UI模式切换勾选框 */}
            <div className="flex justify-start mt-4 mb-8 ml-4 pl-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="legacy-mode-toggle"
                  checked={isLegacyMode}
                  onChange={e => setIsLegacyMode(e.target.checked)}
                  className="w-4 h-4 accent-mai-purple bg-white border-2 border-mai-blue-deep/50 rounded focus:ring-mai-purple focus:ring-2"
                />
                <label
                  htmlFor="legacy-mode-toggle"
                  className="text-sm font-medium text-mai-ink cursor-pointer select-none"
                >
                  使用经典UI
                </label>
              </div>
            </div>

            {/* AnimateVolume */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 max-sm:hidden flex space-x-2">
              <div className="w-2 h-8 bg-mai-yellow animate-volume"></div>
              <div className="w-2 h-10 bg-mai-purple animate-volume [animation-delay:0.1s]"></div>
              <div className="w-2 h-6 bg-mai-yellow animate-volume [animation-delay:0.2s]"></div>
              <div className="w-2 h-12 bg-mai-yellow animate-volume [animation-delay:0.3s]"></div>
              <div className="w-2 h-10 bg-mai-purple animate-volume [animation-delay:0.4s]"></div>
              <div className="w-2 h-6 bg-mai-yellow animate-volume [animation-delay:0.5s]"></div>
              <div className="w-2 h-12 bg-mai-yellow animate-volume [animation-delay:0.6s]"></div>
              <div className="w-2 h-6 bg-mai-purple animate-volume [animation-delay:0.7s]"></div>
              <div className="w-2 h-8 bg-mai-yellow animate-volume [animation-delay:0.8s]"></div>
            </div>
            <AnimatePresence mode="wait">
              {!advancedSearchDisplay && (
                <>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-sm:w-[90%] absolute sm:right-0  -bottom-20 mx-auto "
                  >
                    <button
                      className=" aspect-[324/157]  sm:h-28 max-sm:h-24 transition-all duration-300 ease-in-out hover:brightness-110 bg-no-repeat bg-contain bg-[url('/img/refine_btn.png')]"
                      onClick={() => setAdvancedSearchDisplay(!advancedSearchDisplay)}
                    >
                      <h1 className="text-xl font-bold text-white relative top-4 -left-4 ">
                        高级搜索
                      </h1>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {advancedSearchDisplay && (
            <>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="max-sm:w-[90%] sm:w-[900px] relative -bottom-5 mx-auto "
              >
                <AdvancedSearchBar
                  getSongs={getSongs}
                  close={() => setAdvancedSearchDisplay(false)}
                  currentCategory={setCurrentCategory}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="max-sm:mx-auto max-sm:w-full mb-32">
        {/*Music Cards*/}
        <div className="relative max-sm:w-[90%] max-sm:mx-auto flex flex-col justify-center items-center">
          <div className="w-full max-sm:w-full rounded-2xl">
            <div className="max-sm:w-full max-sm:pt-4 w-[80%] mx-auto min-h-60 rounded-2xl flex flex-col justify-center items-center text-center text-mai-blue-deep font-bold">
              {loading ? (
                <SongList
                  songs={songs}
                  currentCategory={currentCategory}
                  loading={true}
                  isLegacyMode={isLegacyMode}
                />
              ) : error ? (
                <div className="text-mai-red font-bold">错误: {error}</div>
              ) : songs.length === 0 ? (
                <>
                  <div className="text-3xl mb-2">❌</div>
                  <div>{`没有找到相关乐曲……{{(>_<)}}`}</div>
                </>
              ) : (
                <SongList
                  songs={songs}
                  currentCategory={currentCategory}
                  loading={false}
                  isLegacyMode={isLegacyMode}
                />
              )}
            </div>
          </div>
        </div>
        {/* 加载更多 */}
        <div className="relative flex flex-col justify-center items-center">
          <div className="flex space-x-4">
            {hasMore && (
              <ActionButton onClick={() => getSongs(filteredUrl, currentPage + 1)}>
                {loadingMore ? (
                  <div className="flex items-center">
                    <span className="ml-2">加载中...</span>
                  </div>
                ) : (
                  "加载更多"
                )}
              </ActionButton>
            )}
            {/* <ActionButton onClick={() => {
              console.log('Scrolling to top...'); // 添加调试日志
            }}>
              返回顶部
            </ActionButton> */}
          </div>
        </div>
      </div>
    </>
  )
}

// MARK: - 分类栏
function CategoryBar({ getSongs, getSongRecentUpdated }: { getSongs: (filteredUrl: string) => Promise<void>, getSongRecentUpdated: () => Promise<void> }) {
  return (
    <>
      <div className="flex sm:hidden flex-row max-sm:text-sm justify-center items-center max-sm:space-x-0 space-x-4 mb-4">
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-mai-blue-deep rounded-full bg-mai-yellow flex justify-center items-center font-bold text-mai-blue-deep cursor-pointer"
            onClick={() => getSongRecentUpdated()}
          >
            最近更新
          </div>
        </div>
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[#b38c00] rounded-full bg-[rgb(255,200,0)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=POPSアニメ")}
            // onClick={() => getSongs("genre=POPSアニメ")}
          >
            流行&动漫
          </div>
        </div>
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[rgb(0,108,196)] rounded-full bg-[rgb(69,197,255)] flex flex-col justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=niconicoボーカロイド")}
            // onClick={() => getSongs("genre=niconico&VOCALOID")}
          >
            <span className="max-sm:hidden">niconico&</span>
            <span>VOCALOID</span>
          </div>
        </div>
      </div>
      <div className="flex sm:hidden flex-row justify-center items-center max-sm:space-x-0 space-x-4 mb-7">
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[#62b942] rounded-full bg-[rgb(122,231,83)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=ゲームバラエティ")}
            // onClick={() => getSongs("genre=其他游戏")}
          >
            其他游戏
          </div>
        </div>
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[#802323] rounded-full bg-[rgb(255,70,70)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=maimai")}
            // onClick={() => getSongs("genre=舞萌")}
          >
            舞萌
          </div>
        </div>
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[rgb(0,108,196)] rounded-full bg-[rgb(48,157,248)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=オンゲキCHUNITHM")}
          >
            音击&中二
          </div>
        </div>
      </div>
      <div className="flex sm:hidden flex-row justify-center items-center max-sm:space-x-0 space-x-4 mb-7">
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[120px] max-sm:h-10 w-44 h-16 border-4 border-[#7f2bb6] rounded-full bg-[rgb(159,54,227)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=東方Project")}
            // onClick={() => getSongs("genre=东方Project")}
          >
            东方Project
          </div>
        </div>

        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[rgb(179,46,121)] rounded-full bg-[rgb(220,56,184)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("type=utage")}
          >
            宴会场
          </div>
        </div>
      </div>
      <div className="flex max-sm:hidden flex-row max-sm:text-sm justify-center items-center max-sm:space-x-0 space-x-4 mb-4">
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-mai-blue-deep rounded-full bg-mai-yellow flex justify-center items-center font-bold text-mai-blue-deep cursor-pointer"
            onClick={() => getSongRecentUpdated()}
          >
            最近更新
          </div>
        </div>
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[#b38c00] rounded-full bg-[rgb(255,200,0)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=POPSアニメ")}
            // onClick={() => getSongs("genre=POPSアニメ")}
          >
            流行&动漫
          </div>
        </div>
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[rgb(0,108,196)] rounded-full bg-[rgb(69,197,255)] flex flex-col justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=niconicoボーカロイド")}
            // onClick={() => getSongs("genre=niconico&VOCALOID")}
          >
            <span className="max-sm:hidden">niconico&</span>
            <span>VOCALOID</span>
          </div>
        </div>
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[120px] max-sm:h-10 w-44 h-16 border-4 border-[#7f2bb6] rounded-full bg-[rgb(159,54,227)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=東方Project")}
            // onClick={() => getSongs("genre=东方Project")}
          >
            东方Project
          </div>
        </div>
      </div>
      <div className="flex max-sm:hidden flex-row justify-center items-center max-sm:space-x-0 space-x-4 mb-7">
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[#62b942] rounded-full bg-[rgb(122,231,83)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=ゲームバラエティ")}
            // onClick={() => getSongs("genre=其他游戏")}
          >
            其他游戏
          </div>
        </div>
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[#802323] rounded-full bg-[rgb(255,70,70)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=maimai")}
            // onClick={() => getSongs("genre=舞萌")}
          >
            舞萌
          </div>
        </div>
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[rgb(0,108,196)] rounded-full bg-[rgb(48,157,248)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=オンゲキCHUNITHM")}
          >
            音击&中二
          </div>
        </div>
        <div className=" border-2 border-mai-blue-deep/40 rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[rgb(179,46,121)] rounded-full bg-[rgb(220,56,184)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("type=utage")}
          >
            宴会场
          </div>
        </div>
      </div>
    </>
  )
}

function LevelBar({ getSongs }: { getSongs: (filteredUrl: string) => Promise<void> }) {
  const levels = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "7+",
    "8",
    "8+",
    "9",
    "9+",
    "10",
    "10+",
    "11",
    "11+",
    "12",
    "12+",
    "13",
    "13+",
    "14",
    "14+",
    "15",
    "宴",
  ]

  return (
    <div className="h-[172px] max-sm:w-full max-sm:pb-2 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-8 grid-rows-3 gap-4 max-sm:grid-cols-7 max-sm:grid-rows-4 max-sm:gap-2 max-sm:px-2 h-full pt-1">
        {[...Array(24)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-mai-purple hover:border-mai-purple hover:text-white transition-all duration-300 max-sm:px-2 px-7 py-2 border-2 border-mai-blue-deep/40 cursor-pointer text-mai-blue-deep font-bold"
            onClick={() =>
              levels[index] == "宴"
                ? getSongs("type=utage")
                : getSongs(`level=${encodeURIComponent(levels[index])}`)
            }
          >
            {levels[index]}
          </div>
        ))}
      </div>
    </div>
  )
}

function VersionBar({ getSongs }: { getSongs: (filteredUrl: string) => Promise<void> }) {
  return (
    <div className="h-[172px] max-sm:w-full max-sm:pb-2 max-sm:text-sm max-w-[1200px] mx-auto">
      <div className="grid grid-cols-5 grid-rows-3 gap-4 max-sm:grid-cols-3 max-sm:grid-rows-5 max-sm:gap-2 max-sm:px-1 h-full w-full">
        {[...Array(version.length)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-mai-blue-deep/40 hover:border-mai-purple"
          >
            {index < 6 ? (
              <div className="flex w-full h-full">
                <div
                  className="w-2/3 flex items-center justify-center overflow-hidden border-r-2 max-sm:pb-1 pt-1 border-mai-blue-deep/30 cursor-pointer text-mai-blue-deep font-bold"
                  onClick={() => getSongs(`versions=${versionIds[version[index]]}`)}
                >
                  <p className={`${version[index].length > 6 ? "max-sm:animate-text-scroll" : ""}`}>
                    {version[index]}
                  </p>
                </div>
                <div
                  className="w-1/3 flex items-center max-sm:pb-1 justify-center text-2xl cursor-pointer text-mai-purple font-bold"
                  onClick={() => getSongs(`versions=${versionPlusIds[versionPlus[index]]}`)}
                >
                  +
                </div>
              </div>
            ) : (
              <div
                className="max-sm:px-0 px-7 py-2 mt-1 cursor-pointer text-mai-blue-deep font-bold"
                onClick={() => getSongs(`versions=${versionIds[version[index]]}`)}
              >
                {version[index]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// 在 VersionBar 函数后添加新的 AdvancedSearchBar 组件

function AdvancedSearchBar({
  getSongs,
  close,
  currentCategory,
}: {
  getSongs: (filteredUrl: string) => Promise<void>
  close: () => void
  currentCategory: React.Dispatch<React.SetStateAction<string>>
}) {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [selectedVersion, setSelectedVersion] = useState("")
  const [isInitialRender, setIsInitialRender] = useState(true)
  const str = useRef("")

  const genres = [
    { value: "", label: "全部类型" },
    { value: "POPSアニメ", label: "流行&动漫" },
    { value: "niconicoボーカロイド", label: "niconico&VOCALOID" },
    { value: "東方Project", label: "东方Project" },
    { value: "ゲームバラエティ", label: "其他游戏" },
    { value: "maimai", label: "舞萌" },
    { value: "オンゲキCHUNITHM", label: "音击&中二" },
  ]

  const levels = [
    { value: "", label: "全部等级" },
    ...[
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "7+",
      "8",
      "8+",
      "9",
      "9+",
      "10",
      "10+",
      "11",
      "11+",
      "12",
      "12+",
      "13",
      "13+",
      "14",
      "14+",
      "15",
    ].map(level => ({
      value: level,
      label: `等级 ${level}`,
    })),
  ]

  const versions = [
    { value: "", label: "全部版本" },
    ...version.map(v => ({
      value: versionIds[v],
      label: v,
    })),
    ...versionPlus.map(v => ({
      value: versionPlusIds[v],
      label: v,
    })),
  ]

  const handleSearch = useCallback(() => {
    const params = []

    if (searchKeyword.trim()) {
      params.push(`keywords=${encodeURIComponent(searchKeyword.trim())}`)
    }
    if (selectedGenre) {
      params.push(`genre=${selectedGenre}`)
    }
    if (selectedLevel) {
      params.push(`level=${encodeURIComponent(selectedLevel)}`)
    }
    if (selectedVersion) {
      params.push(`versions=${selectedVersion}`)
    }

    const queryString = params.length > 0 ? params.join("&") : `versions${currentVersion}`
    // console.log('查询字符串:', queryString) // 调试日志
    getSongs(queryString)
  }, [searchKeyword, selectedGenre, selectedLevel, selectedVersion, getSongs])

  useEffect(() => {
    // 跳过首次渲染时的执行
    if (isInitialRender) {
      setTimeout(() => setIsInitialRender(false), 0)
      return
    }

    str.current = ""
    if (searchKeyword.trim()) {
      str.current += `关键词: ${searchKeyword.trim()} `
    }
    if (selectedGenre) {
      str.current += `类型: ${selectedGenre} `
    }
    if (selectedLevel) {
      str.current += `等级: ${selectedLevel} `
    }
    if (selectedVersion) {
      str.current += `版本: ${transferVersion(Number(selectedVersion))} `
    }
    handleSearch()
    currentCategory(str.current)
  }, [
    searchKeyword,
    selectedGenre,
    selectedLevel,
    selectedVersion,
    handleSearch,
    currentCategory,
    isInitialRender,
  ])

  const handleReset = () => {
    setSearchKeyword("")
    setSelectedGenre("")
    setSelectedLevel("")
    setSelectedVersion("")
    getSongs(`versions=${currentVersion}`)
  }

  return (
    <div className="w-full mx-auto bg-white rounded-3xl p-6 shadow-2xl border-4 border-mai-blue-deep">
      {/* 主搜索行 */}
      <div className="flex flex-row justify-center items-center max-sm:flex-col max-sm:space-y-3 space-x-4 max-sm:space-x-0 mb-4">
        {/* 关键词搜索 */}
        <div className="flex-1 h-12 bg-white border-4 border-mai-blue-deep rounded-full flex flex-row justify-center items-center shadow-lg">
          <div className="flex w-full h-full overflow-hidden">
            <div
              className="w-1/4 bg-mai-blue-deep flex items-center justify-center border-r-4 border-mai-blue-deep"
              style={{ borderTopLeftRadius: "1rem", borderBottomLeftRadius: "1rem" }}
            >
              <div className="text-white text-sm">关键词</div>
            </div>
            <div className="w-3/4 flex items-center justify-center">
              <input
                type="text"
                placeholder="乐曲名/别名/作曲家"
                className="w-[90%] h-9 bg-transparent text-black placeholder-gray-500 focus:outline-none"
                value={searchKeyword}
                onChange={e => {
                  setSearchKeyword(e.target.value)
                  handleSearch()
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleReset}
            className="px-8 py-2 bg-mai-yellow text-mai-blue-deep border-2 border-mai-blue-deep rounded-full hover:bg-white transition-colors shadow-md hover:shadow-lg font-bold"
          >
            🔄 重置
          </button>
          <button
            onClick={close}
            className="size-12 bg-[url('/img/close.png')] bg-no-repeat bg-contain text-white rounded-full hover:brightness-110 transition-colors shadow-md hover:shadow-lg font-bold"
          ></button>
        </div>
      </div>
      {/* 高级筛选选项 */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out max-h-96 opacity-100`}
      >
        <div className="bg-mai-yellow/10 border-2 border-mai-blue-deep/30 rounded-2xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 乐曲类型 */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-mai-ink mb-2">乐曲类型</label>
              <select
                className="w-full h-10 px-3 bg-white border-2 border-mai-blue-deep/40 rounded-full focus:outline-none focus:ring-2 focus:ring-mai-purple focus:border-transparent transition-all duration-300 text-mai-ink"
                value={selectedGenre}
                onChange={e => {
                  setSelectedGenre(e.target.value)
                }}
              >
                {genres.map(genre => (
                  <option key={genre.value} value={genre.value}>
                    {genre.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 等级 */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-mai-ink mb-2">等级</label>
              <select
                className="w-full h-10 px-3 bg-white border-2 border-mai-blue-deep/40 rounded-full focus:outline-none focus:ring-2 focus:ring-mai-purple focus:border-transparent transition-all duration-300 text-mai-ink"
                value={selectedLevel}
                onChange={e => {
                  setSelectedLevel(e.target.value)
                }}
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 版本 */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-mai-ink mb-2">版本</label>
              <select
                className="w-full h-10 px-3 bg-white border-2 border-mai-blue-deep/40 rounded-full focus:outline-none focus:ring-2 focus:ring-mai-purple focus:border-transparent transition-all duration-300 text-mai-ink"
                value={selectedVersion}
                onChange={e => {
                  setSelectedVersion(e.target.value)
                }}
              >
                {versions.map(version => (
                  <option key={version.value} value={version.value}>
                    {version.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 操作按钮 */}
        </div>
      </div>
    </div>
  )
}
