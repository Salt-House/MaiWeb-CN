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

export default function SongDetail() {
  const params = useParams()
  const [song, setSong] = useState<Song | null>(null)
  const [scores, setScores] = useState<SongScoreProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')

    const fetchSongData = async () => {
      try {
        // 先检查 localStorage 是否有歌曲信息
        const songData = localStorage.getItem(`song_${params.id}`)
        if (songData) {
          console.log('从localStorage获取数据:' + songData)
          const parsedData = JSON.parse(songData)
          setSong(parsedData)
          setLoading(false)

          // 即使从缓存获取了歌曲信息，也异步获取最新数据
          fetchLatestData()
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
        const url = `https://dev.maimai.moe/api/maimai/maiweb/songs?id=${params.id}`
        const response = await fetch(
          url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
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
    <div className="relative flex flex-col justify-center items-center mt-10 mb-16">
      <div className="w-[900px] flex justify-start mb-2">
        <Link href='/music' className="inline-flex items-center text-white hover:scale-105 transition-colors m-3">
          <FaArrowLeft className="mr-2 size-5" />
          <span className="text-xl font-bold" style={textShadow}>返回音乐列表</span>
        </Link>
      </div>
      <div className="border-4 border-white rounded-2xl">
        <div className="w-[900px] bg-white rounded-2xl flex flex-col text-center border-4 border-[rgb(155,244,236)]">
          <SongInfo song={song} />

          {/* 音乐播放器 */}
          <div className="mt-2 mb-6 mx-6">
            <MusicPlayer audioUrl={audio_url} title={song.title} />
          </div>

          {/* 乐曲成绩 */}
          <div className="flex flex-row space-x-6 justify-center items-center">
            <div className="w-2/5 h-1 rounded-full bg-gray-300" />
            <div className="text-gray-700 font-bold text-xl">乐曲成绩</div>
            <div className="w-2/5 h-1 rounded-full bg-gray-300" />
          </div>
          <ScoreDetail song={song} scores={scores} />

          {/* 谱面详情 */}
          <div className="flex flex-row space-x-6 justify-center items-center">
            <div className="w-2/5 h-1 rounded-full bg-gray-300" />
            <div className="text-gray-700 font-bold text-xl">谱面详情</div>
            <div className="w-2/5 h-1 rounded-full bg-gray-300" />
          </div>
          <NoteDetail song={song} />
        </div>
      </div>
    </div>
  )
}

function SongInfo({ song }: { song: Song }) {
  return (
    <div className="container mx-auto pt-4 pl-4 pr-4 mb-6">
      <div className="flex space-x-8 mt-2">
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
        <div className="flex-1 flex-col flex-shrink-0">
          <h1 className="text-3xl font-bold mb-4 ml-1 text-left text-black">{song.title}</h1>
          <div className="flex-1 space-y-3 text-left">
            <h2
              className="inline-flex px-5 py-1 mb-1.5 truncate rounded-full text-white border-2"
              style={{
                backgroundColor: getGenreColor(song.genre).bg,
                borderColor: getGenreColor(song.genre).border
              }}
            >
              {transferText(song.genre)} | {song.genre}
              {/* {song.genre} */}
            </h2>
            <div className="space-y-2.5 text-left">
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
                <h2 className='text-black'>落雪id: {song.id}</h2>
                <a
                  href="https://maimai.lxns.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
                >
                  关于落雪?
                </a>
              </div>
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
    </div>
  )
}

function NoteDetail({ song }: { song: Song }) {
  return (
    <div className="flex flex-col space-y-4 m-6">
      {/* Standard谱面 */}
      {song.difficulties?.standard?.length > 0 && (
        <>
          <div className="flex items-center">
            <span className="w-16 text-sm text-white bg-blue-500 rounded-full py-1 mr-2">标准</span>
            <div className="flex space-x-2">
              {song.difficulties.standard.map((diff: { level_index: number; level: string, note_designer: string }, idx: Key | null | undefined) => (
                <div className="flex items-end space-x-1">
                  <div
                    key={idx}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white border-4 border-[rgb(155,244,236)]"
                    style={{
                      backgroundColor: getDifficultyColor(diff.level_index as 0 | 1 | 2 | 3 | 4)
                    }}
                  >
                    {diff.level}
                  </div>
                  <div>
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
            <span className="w-16 text-sm text-white bg-orange-500 rounded-full py-1 mr-2">DX</span>
            <div className="flex space-x-2">
              {song.difficulties.dx.map((diff: { level_index: number; level: string, note_designer: string }, idx: Key | null | undefined) => (
                <div className="flex items-end space-x-1">
                  <div
                    key={idx}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white border-4 border-[rgb(155,244,236)]"
                    style={{
                      backgroundColor: getDifficultyColor(diff.level_index as 0 | 1 | 2 | 3 | 4)
                    }}
                  >
                    {diff.level}
                  </div>
                  <div>
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
            <span className="w-16 text-sm text-white rounded-full py-1 mr-2" style={{
              backgroundColor: "rgb(220, 56, 184)"
            }}>宴会场</span>
            <div className="flex space-x-2">
              {song.difficulties.utage.map((diff: { level: string }, idx: Key | null | undefined) => (
                <div
                  key={idx}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white border-4 border-[rgb(155,244,236)]"
                  style={{
                    backgroundColor: "rgb(220, 56, 184)"
                  }}
                >
                  {diff.level}
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

