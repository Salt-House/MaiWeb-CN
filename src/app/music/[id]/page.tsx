'use client'

import { useParams } from 'next/navigation'
import { Song, getDifficultyColor, transferText, transferVersion, getGenreColor, ChartType, SongScoreProps } from '@/app/music/songModel'
import { Key, useState, useEffect } from 'react'
import NoteTable from './noteTable'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import MusicPlayer from './musicPlayer'
import ScoreDetail from './scoreDetail'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'
import { FaBilibili, FaArrowUpRightFromSquare } from "react-icons/fa6"
import { data } from 'framer-motion/client'
import { Step } from 'react-joyride'
import Guide from '@/app/components/Guide'
import { Button } from '@/app/components/button'


export default function SongDetail() {
  const params = useParams()
  const [song, setSong] = useState<Song | null>(null)
  const [scores, setScores] = useState<SongScoreProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buttonStatus, setButtonStatus] = useState<boolean>(false)
  const steps: Step[] = [
    {
      target: '#note',
      content: '这里您可以左右滚动查看',
      disableBeacon: true
    },
  ]

  useEffect(() => {
    const storedToken = localStorage.getItem('token')

    // TODO: - 待优化逻辑，后端应在没有token的情况下仍然返回歌曲数据，只是没有对应成绩信息。
    const fetchSongData = async () => {
      try {
        // 先检查 localStorage 是否有歌曲信息
        const songData = localStorage.getItem(`song_${params.id}`)
        if (songData) {
          const parsedData = JSON.parse(songData)
          setSong(parsedData)
          setLoading(false)

          // 即使从缓存获取了歌曲信息，也异步获取最新数据
          // fetchLatestData()
          return
        }

        // 如果没有缓存数据，发送网络请求
        fetchLatestData()
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败')
        setLoading(false)
      }
    }

    const fetchLatestData = async () => {
      try {
        const url = `https://dev.maimai.moe/api/maimai/maiweb/minfo?id=${params.id}`
        const response = await fetch(
          url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(`HTTP ${response.status} 造成该问题：暂时不支持URL直接输入id访问歌曲信息，或者没有登录。`)
          } else {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

        }

        const data = await response.json()
        console.log("歌曲数据：", data)
        setSong(data.song)
        setScores(data.scores || [])
        setLoading(false)

        // 缓存到 localStorage
        localStorage.setItem(`song_${params.id}`, JSON.stringify(data.song))
      } catch (err) {
        if (!song) { // 只有在没有缓存数据的情况下才设置错误
          setError(err instanceof Error ? err.message : '获取数据失败')
          setLoading(false)
        }
      }
    }

    fetchSongData()
  }, [params.id])

  const audio_url = `https://assets2.lxns.net/maimai/music/${song?.id ?? params.id}.mp3`

  const textShadow = {
    textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)'
  }

  if (loading) {
    return (
      <div className="relative flex flex-col justify-center items-center mt-10 mb-16">
        <div className="border-4 border-white rounded-2xl">
          <div
            className=" w-[900px] h-80 bg-white rounded-2xl flex flex-col justify-center items-center text-center border-4 border-[rgb(155,244,236)]">
            <div className="container mx-auto p-4">
              <LoadingSpinner size='sm' message="加载中..." description="正在获取乐曲数据" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !song) {
    return (
      <div className="relative flex flex-col justify-center items-center mt-10 mb-16">
        <div className="border-4 border-white rounded-2xl">
          <div
            className=" w-[900px] h-80 bg-white rounded-2xl flex flex-col justify-center items-center text-center border-4 border-[rgb(155,244,236)]">
            <div className="container mx-auto p-4 text-black">
              <div>错误: {error || '未找到歌曲 QAQ'}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative max-sm:w-full flex flex-col justify-center items-center mt-10 mb-16">
      <Guide steps={steps} mark='notetour' />
      <div className="max-sm:w-[90%] w-[900px] flex justify-start mb-2">

        <Link href='/music' className="inline-flex items-center text-white hover:scale-105 transition-colors m-3">
          <FaArrowLeft className="mr-2 size-5" />
          <span className="text-xl font-bold" style={textShadow}>返回音乐列表</span>
        </Link>
      </div>
      <div className="border-4 max-sm:w-[90%] border-white bg-white rounded-2xl">
        <div className="max-sm:w-full w-[900px] bg-white rounded-2xl flex flex-col text-center border-4 border-[rgb(155,244,236)]">
          <SongInfo song={song} />

          {/* 音乐播放器 */}
          <div className="mt-2 mb-6 mx-6">
            <MusicPlayer audioUrl={audio_url} title={song.title} artist={song.artist} songId={song.id.toString()} />
          </div>

          {/* 乐曲成绩 */}
          <div className="flex flex-row space-x-6 justify-center items-center">
            <div className="w-2/5 max-sm:w-[30%] h-1 rounded-full bg-gray-300" />
            <div className="text-gray-700 max-sm:w-[40%] font-bold text-xl">乐曲成绩</div>
            <div className="w-2/5 max-sm:w-[30%] h-1 rounded-full bg-gray-300" />
          </div>
          <ScoreDetail song={song} scores={scores} />

          {/* 谱面详情 */}
          <div className="flex flex-row space-x-6 justify-center items-center">
            <div className="w-2/5 max-sm:w-[30%] h-1 rounded-full bg-gray-300" />
            <div className="text-gray-700 max-sm:w-[40%] font-bold text-xl">谱面详情</div>
            <div className="w-2/5 max-sm:w-[30%] h-1 rounded-full bg-gray-300" />
          </div>
          <NoteDetail song={song} />
        </div>
      </div>
    </div>
  )
}

function SongInfo({ song }: { song: Song }) {
  return (
    <div className="container mx-auto px-4 my-6">
      <div className="flex max-sm:flex-col max-sm:justify-center max-sm:items-center space-x-8 mt-2">
        {/* 左侧曲绘 */}
        <div className="w-64 flex-shrink-0 ml-2">
          <img
            src={`https://assets2.lxns.net/maimai/jacket/${song.id}.png`}
            alt={song.title}
            className="rounded-xl object-cover w-64 h-64"
          />
          {song.rights && (
            <p className="text-xs text-gray-500 mt-2 ml-2 text-left">
              {song.rights}
            </p>
          )}
        </div>

        {/* 右侧信息 */}
        <div className="flex-1 max-sm:w-[90%] flex-col sm:flex-shrink-0 max-sm:mt-4">
          <h1 className="text-3xl font-bold mb-4 ml-1 text-left text-black">{song.title}</h1>
          <div className="sm:flex-1 space-y-3 text-left">
            <div
              className="text-center px-5 py-1 mb-1.5 rounded-full text-white border-2 w-fit"
              style={{
                backgroundColor: getGenreColor(song.genre).bg,
                borderColor: getGenreColor(song.genre).border
              }}
            >
              {transferText(song.genre)}
              {/* {song.genre} */}
            </div>
            <div className="space-y-2.5 text-left">
              <div className="flex flex-row space-x-4">
                <h2 className='text-black'>id: {song.id}</h2>
                {/* <a
                  href="https://maimai.lxns.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
                >
                  关于落雪?
                </a> */}
              </div>
              <h2 className='text-black'>Artist: {song.artist}</h2>
              <div className="flex flex-row space-x-4 items-center">
                <div className="space-y-2.5">
                  <h2 className='text-black'>BPM: {song.bpm}</h2>
                  <h2 className='text-black'>更新版本: {transferVersion(song.version)}</h2>
                </div>
                {song.disabled && (
                  <div className="flex-1 flex justify-center items-center">
                    <h1 className="text-2xl font-bold text-red-500">——此乐曲已删除——</h1>
                  </div>
                )}
              </div>
              <h2 className='text-black'>所属区域: {song.map ?? "无"}</h2>
              <div className="flex flex-row space-x-4">
                <div className="flex rounded-xl border-2 border-[#00a1d6] overflow-hidden">
                  <a
                    href={`https://search.bilibili.com/all?keyword=${song.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-1 bg-white text-[#00a1d6] hover:bg-[#00a1d6] hover:text-white transition-colors"
                  >
                    <FaBilibili className="mr-3 size-5" />
                    WEB
                    {/* <FaArrowUpRightFromSquare className='ml-2' /> */}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='text-left mx-5 mt-5'>
        <div className="font-medium text-black">乐曲别名:</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {song.aliases && song.aliases.length > 0 ? (
            song.aliases.map((alias, index) => (
              <span
                key={index}
                className="bg-[rgb(69,197,255)] text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm"
              >
                {alias}
              </span>
            ))
          ) : (
            <span className="text-gray-500">暂无别名</span>
          )}
        </div>
      </div>
    </div>
  )
}

function NoteDetail({ song }: { song: Song }) {
  return (
    <div id='note' className="flex flex-col space-y-4 max-sm:space-y-2 max-sm:mx-2 m-6">
      {/* Standard谱面 */}
      {song.difficulties?.standard?.length > 0 && (
        <>
          <div className="flex items-center">
            <span className="w-16 max-sm:w-12 text-sm max-sm:text-xs text-white bg-blue-500 rounded-full py-1 mr-2">标准</span>
            <div className="flex flex-wrap space-x-2 max-sm:space-x-1">
              {song.difficulties.standard.map((diff: { level_index: number; level: string, note_designer: string }, idx: Key | null | undefined) => (
                <div className="flex items-end space-x-1 max-sm:mb-1">
                  <div
                    key={idx}
                    className="w-12 h-12 max-sm:w-8 max-sm:h-8 rounded-xl flex items-center justify-center text-xl max-sm:text-sm text-white border-4 max-sm:border-2 border-[rgb(155,244,236)]"
                    style={{
                      backgroundColor: getDifficultyColor(diff.level_index as 0 | 1 | 2 | 3 | 4)
                    }}
                  >
                    {diff.level}
                  </div>
                  <div className="max-sm:text-xs text-black">
                    {(diff.note_designer == "-") ? undefined : (diff.note_designer)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <NoteTable song={song} chartType={'standard' as ChartType} />
        </>
      )}

      {/* DX谱面 */}
      {song.difficulties?.dx?.length > 0 && (
        <>
          <div className="flex items-center">
            <span className="w-16 max-sm:w-12 text-sm max-sm:text-xs text-white bg-orange-500 rounded-full py-1 mr-2">DX</span>
            <div className="flex flex-wrap space-x-2 max-sm:space-x-1">
              {song.difficulties.dx.map((diff: { level_index: number; level: string, note_designer: string }, idx: Key | null | undefined) => (
                <div className="flex items-end space-x-1 max-sm:mb-1">
                  <div
                    key={idx}
                    className="w-12 h-12 max-sm:w-8 max-sm:h-8 rounded-xl flex items-center justify-center text-xl max-sm:text-sm text-white border-4 max-sm:border-2 border-[rgb(155,244,236)]"
                    style={{
                      backgroundColor: getDifficultyColor(diff.level_index as 0 | 1 | 2 | 3 | 4)
                    }}
                  >
                    {diff.level}
                  </div>
                  <div className="max-sm:text-xs text-black">
                    {(diff.note_designer == "-") ? undefined : (diff.note_designer)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <NoteTable song={song} chartType={'dx' as ChartType} />
        </>
      )}

      {/* Utage谱面 */}
      {song.difficulties?.utage?.length > 0 && (
        <>
          <div className="flex items-center">
            <span className="w-16 max-sm:w-12 text-sm max-sm:text-xs text-white rounded-full py-1 mr-2" style={{
              backgroundColor: "rgb(220, 56, 184)"
            }}>宴会场</span>
            <div className="flex flex-wrap space-x-2 max-sm:space-x-1">
              {song.difficulties.utage.map((diff: { level: string }, idx: Key | null | undefined) => (
                <div className="flex items-end space-x-1 max-sm:mb-1">
                  <div
                    key={idx}
                    className="w-12 h-12 max-sm:w-8 max-sm:h-8 rounded-xl flex items-center justify-center text-xl max-sm:text-sm text-white border-4 max-sm:border-2 border-[rgb(155,244,236)]"
                    style={{
                      backgroundColor: "rgb(220, 56, 184)"
                    }}
                  >
                    {diff.level}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <NoteTable song={song} chartType={'utage' as ChartType} />
        </>
      )}
    </div>
  )
}

