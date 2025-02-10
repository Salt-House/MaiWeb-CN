'use client'

import { useState, useEffect } from 'react'
import { Song } from "@/app/music/songModel"
import SongList from '@/app/music/songList'

const currentVersion = "24005"

export default function MusicPage() {
  //const songs = [sampleSong, sampleSong, sampleSong, sampleSong, sampleSong, sampleSong]
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState('category')

  const [filteredUrl, setFilteredUrl] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const defaultUrl = `version=${currentVersion}`
  useEffect(() => {
    getSongs(defaultUrl)
  }, [])

  const getSongs = async (filteredUrl: string, page: number = 1) => {
    setFilteredUrl(filteredUrl)

    const baseUrl = 'https://dev.maimai.moe/api/maimai/songs?'
    const url = `${baseUrl}${filteredUrl}&page=${page}&page_size=100`

    // console.log(url)
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
      setHasMore(data.length === 100)
      setCurrentPage(page)
      setLoading(false);
    } catch (err) {
      console.error('获取数据错误:', err)
      setError(err instanceof Error ? err.message : '获取数据失败')
      setLoading(false)
    }
  }

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
      <div className="relative flex flex-col justify-center items-center mt-10 mb-16 text-black">
        <div className="border-4 border-white rounded-2xl">
          <div
            className=" w-[900px] h-80 bg-white rounded-2xl flex flex-col justify-center items-center text-center border-4 border-[rgb(155,244,236)]">
            <div className="absolute -top-4 w-48 h-20 text-3xl font-bold text-black">
              {/* Music */}
            </div>
            <div className="flex flex-row space-x-16 -mt-4 mb-2">
              <div
                className="w-80 h-12 bg-blue-700 rounded-full flex flex-row justify-center items-center text-center shadow-md shadow-gray-500 my-5 space-x-3">
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
              <div className="w-80 h-12 bg-white border-4 border-blue-700 rounded-full flex flex-row justify-center items-center text-center shadow-md shadow-gray-500 my-5">
                <div className="flex w-full h-full overflow-hidden">
                  <div className="w-1/3 bg-blue-700 flex items-center justify-center border-r-4 border-blue-700" style={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}>
                    <div className="text-white">搜索</div>
                  </div>
                  <div className="w-2/3 flex items-center justify-center">
                    <input
                      type="text"

                      placeholder="乐曲名/别名/作曲家"
                      className="w-[90%] h-9 bg-transparent text-black placeholder-gray-500 focus:outline-none transition-none"
                      onChange={(e) => getSongs(`keywords=${e.target.value}`)}
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
          </div>
        </div>
      </div>


      <div className='mt-10 mb-32'>
        {/*Music Cards*/}
        <div className="relative flex flex-col justify-center items-center">
          <div className="border-4 border-white rounded-2xl">
            <div className="w-[900px] min-h-60 bg-white rounded-2xl flex flex-col justify-center items-center text-center border-4 border-[rgb(155,244,236)]">
              {loading ? (
                <div>加载中...</div>
              ) : error ? (
                <div>错误: {error}</div>
              ) : (
                songs.length === 0 ? (
                  <div>{`没有找到相关乐曲……{{(>_<)}}`}</div>
                ) : (
                  <SongList songs={songs} />
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

function CategoryBar({ getSongs }: { getSongs: (filteredUrl: string) => Promise<void> }) {
  return (
    <>
      <div className="flex flex-row justify-center items-center space-x-4 mb-4">
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[rgb(247,126,161)] rounded-full bg-white flex justify-center items-center font-bold text-[rgb(255,199,219)] cursor-pointer"
            onClick={() => getSongs(`version=${currentVersion}`)}
          >
            最近更新
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[#b38c00] rounded-full bg-[rgb(255,200,0)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=POPSアニメ")}
          >
            流行&动漫
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[rgb(0,108,196)] rounded-full bg-[rgb(69,197,255)] flex flex-col justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=niconicoボーカロイド")}
          >
            <span>niconico&</span>
            <span>VOCALOID</span>
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[#7f2bb6] rounded-full bg-[rgb(159,54,227)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=東方Project")}
          >
            东方Project
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center space-x-4 mb-7">
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[#62b942] rounded-full bg-[rgb(122,231,83)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=ゲームバラエティ")}
          >
            其他游戏
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[#802323] rounded-full bg-[rgb(255,70,70)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=maimai")}
          >
            舞萌
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[rgb(0,108,196)] rounded-full bg-[rgb(48,157,248)] flex justify-center items-center font-bold cursor-pointer"
            onClick={() => getSongs("genre=オンゲキCHUNITHM")}
          >
            音击&中二
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[rgb(179,46,121)] rounded-full bg-[rgb(220,56,184)] flex justify-center items-center font-bold cursor-pointer"
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
            className="flex items-center justify-center bg-slate-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 px-7 py-2 border-4 border-[rgb(155,244,236)] cursor-pointer"
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
    <div className="h-[172px] max-w-[1200px] mx-auto">
      <div className="grid grid-cols-8 grid-rows-3 gap-4 h-full pt-1">
        {[...Array(24)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-slate-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 px-7 py-2 border-4 border-[rgb(155,244,236)] cursor-pointer"
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
  const versions: (keyof typeof versionIds)[] = ["maimai", "GreeN", "ORANGE", "PiNK", "MURASAKi", "MiLK", "FiNALE", "舞萌DX", "舞萌DX 2021", "舞萌DX 2022", "舞萌DX 2023", "舞萌DX 2024"]
  const versionIds = {
    'maimai': 10000,
    'GreeN': 12000,
    'ORANGE': 14000,
    'PiNK': 16000,
    'MURASAKi': 18000,
    'MiLK': 19000,
    'FiNALE': 19900,
    '舞萌DX': 20000,
    '舞萌DX 2021': 21000,
    '舞萌DX 2022': 22000,
    '舞萌DX 2023': 23000,
    '舞萌DX 2024': 24000,
  }
  const versionsPlus: (keyof typeof versionsPlusIds)[] = ["MAIMAI_PLUS", "MAIMAI_GREEN_PLUS", "MAIMAI_ORANGE_PLUS", "MAIMAI_PINK_PLUS", "MAIMAI_MURASAKI_PLUS", "MAIMAI_MILK_PLUS"]
  const versionsPlusIds = {
    'MAIMAI_PLUS': 11000,
    'MAIMAI_GREEN_PLUS': 13000,
    'MAIMAI_ORANGE_PLUS': 15000,
    'MAIMAI_PINK_PLUS': 17000,
    'MAIMAI_MURASAKI_PLUS': 18500,
    'MAIMAI_MILK_PLUS': 19500,
  }

  return (
    <div className="h-[172px] max-w-[1200px] mx-auto">
      <div className="grid grid-cols-4 grid-rows-3 gap-4 h-full w-full">
        {[...Array(versions.length)].map((_, index) => (
          <div key={index} className="flex items-center justify-center bg-slate-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border-4 border-[rgb(155,244,236)]">
            {index < 6 ? (
              <div className="flex w-full h-full">
                <div
                  className="w-2/3 flex items-center justify-center border-r-4 pt-1 border-[rgb(155,244,236)] cursor-pointer"
                  onClick={() => getSongs(`versions=${versionIds[versions[index]]}`)}
                >
                  {versions[index]}
                </div>
                <div
                  className="w-1/3 flex items-center justify-center text-2xl cursor-pointer"
                  onClick={() => getSongs(`versions=${versionsPlusIds[versionsPlus[index]]}`)}
                >
                  +
                </div>
              </div>
            ) : (

              <div
                className="px-7 py-2 mt-1 cursor-pointer"
                onClick={() => getSongs(`versions=${versionIds[versions[index]]}`)}
              >
                {versions[index]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ActionButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      className="w-40 h-12 bg-white rounded-full flex justify-center items-center text-black my-5 border-4 border-[rgb(155,244,236)] cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      {children}
    </div>
  )
}
