'use client'


import { useState, useEffect, useCallback } from 'react'
import { Song, transferVersion } from "@/app/music/songModel"
import SongList from '@/app/music/songList'
import LoadingSpinner from '../components/LoadingSpinner'
import ActionButton from '../components/ActionButton'
import type { Step } from 'react-joyride';
import Guide from '../components/Guide'
import { FaFilter, FaTimes } from 'react-icons/fa'
import { AnimatePresence, motion } from 'framer-motion'
import Notice from '../components/Notice'


const currentVersion = "25000"

const version: (keyof typeof versionIds)[] = ["maimai", "GreeN", "ORANGE ", "PiNK", "MURASAKi ", "MiLK", "FiNALE", "舞萌DX", "舞萌DX 2021", "舞萌DX 2022", "舞萌DX 2023", "舞萌DX 2024", "舞萌DX 2025"]
const versionIds = {
  'maimai': 10000,
  'GreeN': 12000,
  'ORANGE ': 14000,
  'PiNK': 16000,
  'MURASAKi ': 18000,
  'MiLK': 19000,
  'FiNALE': 19900,
  '舞萌DX': 20000,
  '舞萌DX 2021': 21000,
  '舞萌DX 2022': 22000,
  '舞萌DX 2023': 23000,
  '舞萌DX 2024': 24000,
  '舞萌DX 2025': 25000,
}
const versionPlus: (keyof typeof versionPlusIds)[] = ["MAIMAI_PLUS", "MAIMAI_GREEN_PLUS", "MAIMAI_ORANGE_PLUS", "MAIMAI_PINK_PLUS", "MAIMAI_MURASAKI_PLUS", "MAIMAI_MILK_PLUS"]
const versionPlusIds = {
  'MAIMAI_PLUS': 11000,
  'MAIMAI_GREEN_PLUS': 13000,
  'MAIMAI_ORANGE_PLUS': 15000,
  'MAIMAI_PINK_PLUS': 17000,
  'MAIMAI_MURASAKI_PLUS': 18500,
  'MAIMAI_MILK_PLUS': 19500,
}

const Options = [
  { label: "最新歌曲在前", value: "desc" },
  { label: "最老歌曲在前", value: "dsc" },
]

export default function MusicPage() {
  //const songs = [sampleSong, sampleSong, sampleSong, sampleSong, sampleSong, sampleSong]
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [advancedSearchDisplay, setAdvancedSearchDisplay] = useState(false)
  const [selectedOption, setSelectedOption] = useState('category')
  // 添加一个状态来跟踪当前选择的分类名称
  const [currentCategory, setCurrentCategory] = useState<string>('最近更新')

  const [filteredUrl, setFilteredUrl] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const steps: Step[] = [
    {
      target: '#filter-select',
      content: '选择乐曲分类',
      disableBeacon: true
    },
    {
      target: '#clickDetail',
      content: '点击乐曲查看详情',
    },
    {
      target: '#addMusicPlay',
      content: '点击添加到播放列表',
    }
  ]

  const textstroke = {
    textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)'
  };

  const defaultUrl = `version=${currentVersion}`
  useEffect(() => {
    getSongs(defaultUrl)
  }, [])

  const getSongs = useCallback(async (filteredUrl: string, page: number = 1) => {
    setFilteredUrl(filteredUrl)
    setLoading(true)
    // 根据filteredUrl设置当前分类名称
    if (filteredUrl.includes('version=') && filteredUrl.includes(currentVersion)) {
      setCurrentCategory('最近更新')
    } else if (filteredUrl.includes('genre=POPSアニメ')) {
      setCurrentCategory('流行&动漫')
    } else if (filteredUrl.includes('genre=niconicoボーカロイド')) {
      setCurrentCategory('niconico&VOCALOID')
    } else if (filteredUrl.includes('genre=東方Project')) {
      setCurrentCategory('东方Project')
    } else if (filteredUrl.includes('genre=ゲームバラエティ')) {
      setCurrentCategory('其他游戏')
    } else if (filteredUrl.includes('genre=maimai')) {
      setCurrentCategory('舞萌')
    } else if (filteredUrl.includes('genre= オンゲキCHUNITHM')) {
      setCurrentCategory('音击&中二')
    } else if (filteredUrl.includes('type=utage')) {
      setCurrentCategory('宴会场')
    } else if (filteredUrl.includes('level=')) {
      const level = filteredUrl.split('level=')[1].split('&')[0]
      setCurrentCategory(`等级 ${decodeURIComponent(level)}`)
    } else if (filteredUrl.includes('version=')) {
      const versionId = filteredUrl.split('version=')[1].split('&')[0]
      const version = Object.entries(versionIds).find(([_, id]) => id.toString() === versionId)?.[0] ||
        Object.entries(versionPlusIds).find(([_, id]) => id.toString() === versionId)?.[0]
      setCurrentCategory(version || '未知版本')
    } else if (filteredUrl.includes('keywords=')) {
      const keyword = filteredUrl.split('keywords=')[1].split('&')[0]
      setCurrentCategory(`搜索: ${decodeURIComponent(keyword)}`)
    } else {
      setCurrentCategory('最近更新')
    }

    const baseUrl = 'https://dev.maimai.moe/api/maimai/songs?'
    const url = `${baseUrl}${filteredUrl}&page=${page}&page_size=100`

    if (!songs) {
      setLoading(true)
    }

    try {
      const response = await fetch(
        url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (page === 1) {
        setSongs(data)
      } else {
        setSongs(prev => [...prev, ...data])
      }
      console.log(data);
      //console.log(url)
      setHasMore(data.length === 100)
      setCurrentPage(page)
      setLoading(false);
    } catch (err) {
      console.error('获取数据错误:', err)
      setError(err instanceof Error ? err.message : '获取数据失败')
      setLoading(false)
    }
  }, [])

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

      <div id='filter-select' className="relative max-sm:w-full flex flex-col justify-center items-center mt-10 mb-24 text-black ">
        <Guide steps={steps} autoStart={true} mark={"musictour"} />
        <div className="border-4 relative border-white max-sm:w-[90%] bg-white rounded-2xl">
          <div
            className="w-[900px] max-sm:w-full max-sm:h-96 mx-auto h-80 bg-white rounded-2xl flex flex-col justify-center items-center text-center border-4 border-[rgb(155,244,236)]">
            <div className="absolute -top-4 w-48 max-sm:h-10 h-20 text-3xl font-bold text-white" style={textstroke}>
              音乐
            </div>
            <div className="flex flex-row max-sm:w-[90%] max-sm:flex-col max-sm:justify-center max-sm:items-center max-sm:space-x-0 max-sm:mt-0 max-sm:mb-0 space-x-16 -mt-4 mb-2">
              <div
                className="w-80 h-12 max-sm:w-full max-sm:my-0 max-sm:mt-4 bg-blue-700 rounded-full flex flex-row justify-center items-center text-center shadow-md shadow-gray-500 my-5 space-x-3">
                <div className="text-white ml-2">按照</div>
                <select
                  className="w-40 h-9 rounded-full px-4 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 border"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  <option value="category">乐曲种类</option>
                  {/* <option value="aeuio">あいうえお</option> */}
                  <option value="level">等级</option>
                  <option value="version">版本</option>
                </select>
                <div className="text-white ml-2">分类</div>
              </div>
              <div className="w-80 max-sm:w-full h-12 bg-white border-4 border-blue-700 rounded-full flex flex-row justify-center items-center text-center shadow-md shadow-gray-500 my-5">
                <div className="flex w-full h-full overflow-hidden">
                  <div className="w-1/3 bg-blue-700 flex items-center justify-center border-r-4 border-blue-700" style={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}>
                    <div className="text-white">搜索</div>
                  </div>
                  <div className="w-2/3 flex items-center justify-center">
                    <input
                      type="text"
                      placeholder="乐曲名/别名/作曲家"
                      className="w-[90%] h-9 bg-transparent text-black placeholder-gray-500 focus:outline-none transition-none"
                      onChange={(e) => { if (e.target.value !== '') { getSongs(`keywords=${e.target.value}`) } }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='h-[172px]'>
              {/* 根据选择的选项显示不同分类选项 */}
              {selectedOption === 'category' && <CategoryBar getSongs={getSongs} />}
              {/* {selectedOption === 'aeuio' && <AeuioBar getSongs={getSongs} />} */}
              {selectedOption === 'level' && <LevelBar getSongs={getSongs} />}
              {selectedOption === 'version' && <VersionBar getSongs={getSongs} />}
            </div>
            {/* AnimateVolume */}
            <div className="absolute -bottom-8 flex space-x-2">
              <div className="w-2 h-8 bg-[#5ac0b6] animate-volume"></div>
              <div className="w-2 h-10 bg-[#7ef2e7] animate-volume [animation-delay:0.1s]"></div>
              <div className="w-2 h-6 bg-[rgb(112,240,228)] animate-volume [animation-delay:0.2s]"></div>
              <div className="w-2 h-12 bg-[#65d8cd] animate-volume [animation-delay:0.3s]"></div>
              <div className="w-2 h-10 bg-[rgb(112,240,228)] animate-volume [animation-delay:0.4s]"></div>
              <div className="w-2 h-6 bg-[rgb(112,240,228)] animate-volume [animation-delay:0.5s]"></div>
              <div className="w-2 h-12 bg-[rgb(112,240,228)] animate-volume [animation-delay:0.6s]"></div>
              <div className="w-2 h-6 bg-[rgb(112,240,228)] animate-volume [animation-delay:0.7s]"></div>
              <div className="w-2 h-8 bg-[rgb(112,240,228)] animate-volume [animation-delay:0.8s]"></div>
            </div>
            <AnimatePresence mode="wait">
              {!advancedSearchDisplay && (
                <>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-sm:w-[90%] absolute sm:right-0 max-sm:-right-24 -bottom-20 mx-auto "
                  >
                    <button className=" aspect-[324/157]  sm:h-28 max-sm:h-24 transition-all duration-300 ease-in-out hover:brightness-110 bg-no-repeat bg-contain bg-[url('/img/refine_btn.png')]"
                      onClick={() => setAdvancedSearchDisplay(!advancedSearchDisplay)}>
                      <h1 className='text-xl font-bold text-white relative top-4 -left-4 '>打开高级搜索</h1>
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
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="max-sm:w-[90%] sm:w-[900px] relative -bottom-5 mx-auto "
              >
                <AdvancedSearchBar getSongs={getSongs} close={() => setAdvancedSearchDisplay(false)} currentCategory={setCurrentCategory} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div >

      <div className='max-sm:mx-auto max-sm:w-full mb-32'>
        {/*Music Cards*/}
        <div className="relative max-sm:w-[90%] max-sm:mx-auto flex flex-col justify-center items-center">
          <div className="border-4 max-sm:w-full border-white bg-white rounded-2xl">
            <div className="max-sm:w-full max-sm:pt-4 w-[900px] min-h-60 bg-white rounded-2xl flex flex-col justify-center items-center text-center border-4 border-[rgb(155,244,236)]">
              {loading ? (
                <LoadingSpinner size='sm' message="加载中..." description="正在获取乐曲数据" />
              ) : error ? (
                <div>错误: {error}</div>
              ) : (
                songs.length === 0 ? (
                  <>
                    <div className='text-3xl mb-2'>❌</div>
                    <div>{`没有找到相关乐曲……{{(>_<)}}`}</div>
                  </>
                ) : (
                  <SongList songs={songs} currentCategory={currentCategory} />
                )
              )}
            </div>
          </div>
        </div>
        {/* 加载更多 */}
        <div className="relative flex flex-col justify-center items-center">
          <div className="flex space-x-4">
            {hasMore && (
              <ActionButton onClick={() => getSongs(filteredUrl, currentPage + 1)}>
                加载更多
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
function CategoryBar({ getSongs }: { getSongs: (filteredUrl: string) => Promise<void> }) {
  return (
    <>
      <div className="flex sm:hidden flex-row max-sm:text-sm justify-center items-center max-sm:space-x-0 space-x-4 mb-4">
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[rgb(247,126,161)] rounded-full bg-white flex justify-center items-center font-bold text-[rgb(255,199,219)] cursor-pointer"
            onClick={() => getSongs(`versions=${currentVersion}`)}
          >
            最近更新
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[#b38c00] rounded-full bg-[rgb(255,200,0)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=POPSアニメ")}
          // onClick={() => getSongs("genre=POPSアニメ")}
          >
            流行&动漫
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[rgb(0,108,196)] rounded-full bg-[rgb(69,197,255)] flex flex-col justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=niconicoボーカロイド")}
          // onClick={() => getSongs("genre=niconico&VOCALOID")}
          >
            <span className='max-sm:hidden'>niconico&</span>
            <span >VOCALOID</span>
          </div>
        </div>

      </div>
      <div className="flex sm:hidden flex-row justify-center items-center max-sm:space-x-0 space-x-4 mb-7">
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[#62b942] rounded-full bg-[rgb(122,231,83)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=ゲームバラエティ")}
          // onClick={() => getSongs("genre=其他游戏")}
          >
            其他游戏
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[#802323] rounded-full bg-[rgb(255,70,70)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=maimai")}
          // onClick={() => getSongs("genre=舞萌")}
          >
            舞萌
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[rgb(0,108,196)] rounded-full bg-[rgb(48,157,248)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=オンゲキCHUNITHM")}
          >
            音击&中二
          </div>
        </div>

      </div>
      <div className="flex sm:hidden flex-row justify-center items-center max-sm:space-x-0 space-x-4 mb-7">
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="max-sm:w-[120px] max-sm:h-10 w-44 h-16 border-4 border-[#7f2bb6] rounded-full bg-[rgb(159,54,227)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=東方Project")}
          // onClick={() => getSongs("genre=东方Project")}
          >
            东方Project
          </div>
        </div>

        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[rgb(179,46,121)] rounded-full bg-[rgb(220,56,184)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("type=utage")}
          >
            宴会场
          </div>
        </div>
      </div>
      <div className="flex max-sm:hidden flex-row max-sm:text-sm justify-center items-center max-sm:space-x-0 space-x-4 mb-4">
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[rgb(247,126,161)] rounded-full bg-white flex justify-center items-center font-bold text-[rgb(255,199,219)] cursor-pointer"
            onClick={() => getSongs(`versions=${currentVersion}`)}
          >
            最近更新
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[#b38c00] rounded-full bg-[rgb(255,200,0)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=POPSアニメ")}
          // onClick={() => getSongs("genre=POPSアニメ")}
          >
            流行&动漫
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[rgb(0,108,196)] rounded-full bg-[rgb(69,197,255)] flex flex-col justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=niconicoボーカロイド")}
          // onClick={() => getSongs("genre=niconico&VOCALOID")}
          >
            <span className='max-sm:hidden'>niconico&</span>
            <span >VOCALOID</span>
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
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
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[#62b942] rounded-full bg-[rgb(122,231,83)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=ゲームバラエティ")}
          // onClick={() => getSongs("genre=其他游戏")}
          >
            其他游戏
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[#802323] rounded-full bg-[rgb(255,70,70)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=maimai")}
          // onClick={() => getSongs("genre=舞萌")}
          >
            舞萌
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="max-sm:w-[90px] max-sm:h-10 w-44 h-16 border-4 border-[rgb(0,108,196)] rounded-full bg-[rgb(48,157,248)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=オンゲキCHUNITHM")}
          >
            音击&中二
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
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

// 暂时不实现
function AeuioBar({ getSongs }: { getSongs: (filteredUrl: string) => Promise<void> }) {
  const items: String[] = [
    'あ行', 'か行', 'さ行', 'た行', 'な行',
    'は行', 'ま行', 'や行', 'ら行', 'わ行',
    'A-G', 'H-N', 'O-U', 'V-Z', '数字·その他'
  ]

  return (
    <div className="h-[172px] max-w-[1200px] mx-auto">
      <div className="grid grid-cols-5 grid-rows-3 gap-4 h-full">
        {[...Array(15)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-slate-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 px-7 py-2 border-4 border-[rgb(155,244,236)] cursor-pointer text-black"
          >
            {items[index]}
          </div>
        ))}
      </div>
    </div>
  )
}

function LevelBar({ getSongs }: { getSongs: (filteredUrl: string) => Promise<void> }) {
  const levels = [
    '1', '2', '3', '4', '5', '6', '7', '7+',
    '8', '8+', '9', '9+', '10', '10+', '11', '11+',
    '12', '12+', '13', '13+', '14', '14+', '15', '宴']

  return (
    <div className="h-[172px] max-sm:w-full max-sm:pb-2 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-8 grid-rows-3 gap-4 max-sm:grid-cols-7 max-sm:grid-rows-4 max-sm:gap-2 max-sm:px-2 h-full pt-1">
        {[...Array(24)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-slate-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 max-sm:px-2 px-7 py-2 border-4 border-[rgb(155,244,236)] cursor-pointer text-black"
            onClick={() => levels[index] == "宴"
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
          <div key={index} className="flex items-center justify-center bg-slate-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border-4 border-[rgb(155,244,236)]">
            {index < 6 ? (
              <div className="flex w-full h-full">
                <div
                  className="w-2/3 flex items-center justify-center overflow-hidden border-r-4 max-sm:pb-1 pt-1 border-[rgb(155,244,236)] cursor-pointer text-black"
                  onClick={() => getSongs(`versions=${versionIds[version[index]]}`)}>
                  <p className={`${version[index].length > 6 ? 'max-sm:animate-text-scroll' : ''}`}>{version[index]}</p>
                </div>
                <div
                  className="w-1/3 flex items-center max-sm:pb-1 justify-center text-2xl cursor-pointer text-black"
                  onClick={() => getSongs(`versions=${versionPlusIds[versionPlus[index]]}`)}>
                  +
                </div>
              </div>
            ) : (
              <div
                className="max-sm:px-0 px-7 py-2 mt-1 cursor-pointer text-black"
                onClick={() => getSongs(`versions=${versionIds[version[index]]}`)}>
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

function AdvancedSearchBar({ getSongs, close, currentCategory }: { getSongs: (filteredUrl: string) => Promise<void>, close: () => void, currentCategory: React.Dispatch<React.SetStateAction<string>> }) {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedVersion, setSelectedVersion] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  let str = ""


  const genres = [
    { value: '', label: '全部类型' },
    { value: 'POPSアニメ', label: '流行&动漫' },
    { value: 'niconicoボーカロイド', label: 'niconico&VOCALOID' },
    { value: '東方Project', label: '东方Project' },
    { value: 'ゲームバラエティ', label: '其他游戏' },
    { value: 'maimai', label: '舞萌' },
    { value: 'オンゲキCHUNITHM', label: '音击&中二' },
  ]

  const levels = [
    { value: '', label: '全部等级' },
    ...['1', '2', '3', '4', '5', '6', '7', '7+', '8', '8+', '9', '9+', '10', '10+', '11', '11+', '12', '12+', '13', '13+', '14', '14+', '15'].map(level => ({
      value: level,
      label: `等级 ${level}`
    }))
  ]

  const versions = [
    { value: '', label: '全部版本' },
    ...version.map((v, index) => ({
      value: versionIds[v],
      label: v
    })),
    ...versionPlus.map((v, index) => ({
      value: versionPlusIds[v],
      label: v
    }))
  ]

  const handleSearch = () => {
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

    const queryString = params.length > 0 ? params.join('&') : `versions${currentVersion}`
    console.log('查询字符串:', queryString) // 调试日志
    getSongs(queryString)

  }

  useEffect(() => {
    str = ""
    if (searchKeyword.trim()) {
      str += (`关键词: ${searchKeyword.trim()} `)
    }
    if (selectedGenre) {
      str += (`类型: ${selectedGenre} `)
    }
    if (selectedLevel) {
      str += (`等级: ${selectedLevel} `)
    }
    if (selectedVersion) {
      str += (`版本: ${transferVersion(Number(selectedVersion))} `)
    }
    handleSearch()
    currentCategory(str)

  }, [searchKeyword, selectedGenre, selectedLevel, selectedVersion])

  const handleReset = () => {
    setSearchKeyword('')
    setSelectedGenre('')
    setSelectedLevel('')
    setSelectedVersion('')
    getSongs(`versions=${currentVersion}`)
  }

  return (
    <div className="w-full  mx-auto bg-white rounded-2xl p-6 shadow-lg">
      {/* 主搜索行 */}
      <div className="flex flex-row justify-center items-center max-sm:flex-col max-sm:space-y-3 space-x-4 max-sm:space-x-0 mb-4">
        {/* 关键词搜索 */}
        <div className="flex-1 h-12 bg-white border-4 border-blue-700 rounded-full flex flex-row justify-center items-center shadow-md shadow-gray-500">
          <div className="flex w-full h-full overflow-hidden">
            <div className="w-1/4 bg-blue-700 flex items-center justify-center border-r-4 border-blue-700" style={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}>
              <div className="text-white text-sm">关键词</div>
            </div>
            <div className="w-3/4 flex items-center justify-center">
              <input
                type="text"
                placeholder="乐曲名/别名/作曲家"
                className="w-[90%] h-9 bg-transparent text-black placeholder-gray-500 focus:outline-none"
                value={searchKeyword}
                onChange={(e) => { setSearchKeyword(e.target.value);handleSearch()}}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleReset}
            className="px-8 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors shadow-md hover:shadow-lg font-bold"
          >
            🔄 重置
          </button>
          <button
            onClick={close}
            className="size-12 bg-[url('/img/close.png')] bg-no-repeat bg-contain text-white rounded-full hover:brightness-110 transition-colors shadow-md hover:shadow-lg font-bold"
          >
          </button>
        </div>

      </div>
      {/* 高级筛选选项 */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out max-h-96 opacity-100`}>
        <div className="bg-white border-4 border-[rgb(155,244,236)] rounded-2xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 乐曲类型 */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 mb-2">乐曲类型</label>
              <select
                className="w-full h-10 px-3 bg-white border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-black"
                value={selectedGenre}
                onChange={(e) => { setSelectedGenre(e.target.value); }}
              >
                {genres.map((genre) => (
                  <option key={genre.value} value={genre.value}>
                    {genre.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 等级 */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 mb-2">等级</label>
              <select
                className="w-full h-10 px-3 bg-white border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-black"
                value={selectedLevel}
                onChange={(e) => { setSelectedLevel(e.target.value); }}
              >
                {levels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 版本 */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 mb-2">版本</label>
              <select
                className="w-full h-10 px-3 bg-white border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-black"
                value={selectedVersion}
                onChange={(e) => { setSelectedVersion(e.target.value); }}
              >
                {versions.map((version) => (
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

