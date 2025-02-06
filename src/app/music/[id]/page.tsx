'use client'

import { useParams } from 'next/navigation'
import { getDifficultyColor, Song } from '@/app/music/songModel'
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key, useState, useEffect } from 'react'

export default function SongDetail() {
  const params = useParams()
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSongData = async () => {
      try {
        // 先检查 localStorage 是否有歌曲信息
        const songData = localStorage.getItem(`song_${params.id}`)
        if (songData) {
          setSong(JSON.parse(songData))
          setLoading(false)
          return
        }

        const url = `https://dev.maimai.moe/api/maimai/songs?id=${params.id}`

        // 如果没有缓存数据，发送网络请求
        const response = await fetch(
          url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setSong(data[0])  // API 返回的是数组，取第一个元素
        setLoading(false)

        // 缓存到 localStorage
        localStorage.setItem(`song_${params.id}`, JSON.stringify(data[0]))
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败')
        setLoading(false)
      }
    }

    fetchSongData()
  }, [params.id])

  if (loading) {
    return (
      <div className="relative flex flex-col justify-center items-center mt-10 mb-16">
        <div className="border-4 border-white rounded-2xl">
          <div
            className=" w-[900px] h-80 bg-white rounded-2xl flex flex-col justify-center items-center text-center border-4 border-[rgb(155,244,236)]">
            <div className="container mx-auto p-4">
              <h1 className="text-3xl font-bold mb-4">加载中...</h1>
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
            <div className="container mx-auto p-4">
              <div>错误: {error || '未找到歌曲'}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col justify-center items-center mt-10 mb-16">
      <div className="border-4 border-white rounded-2xl">
        <div
          className=" w-[900px] h-80 bg-white rounded-2xl flex flex-col justify-center items-center text-center border-4 border-[rgb(155,244,236)]">
          <div className="container mx-auto p-4">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h1 className="text-3xl font-bold mb-4">{song.title}</h1>
              <div className="space-y-2">
                <p>分类: {song.genre}</p>
                <p>作曲家: {song.artist}</p>
                <p>BPM: {song.bpm}</p>
                <div className="flex flex-col space-y-4 mt-4">
                  {/* Standard谱面 */}
                  {song.difficulties?.standard?.length > 0 && (
                    <div className="flex items-center">
                      <span className="w-20 text-sm text-gray-500 mr-2">Standard</span>
                      <div className="flex space-x-2">
                        {song.difficulties.standard.map((diff: { level_index: number; level: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }, idx: Key | null | undefined) => (
                          <div
                            key={idx}
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl text-white border-4 border-[rgb(155,244,236)]"
                            style={{
                              backgroundColor: getDifficultyColor(diff.level_index as 0 | 1 | 2 | 3 | 4)
                            }}
                          >
                            {diff.level}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DX谱面 */}
                  {song.difficulties?.dx?.length > 0 && (
                    <div className="flex items-center">
                      <span className="w-20 text-sm text-gray-500 mr-2">DX</span>
                      <div className="flex space-x-2">
                        {song.difficulties.dx.map((diff: { level_index: number; level: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }, idx: Key | null | undefined) => (
                          <div
                            key={idx}
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl text-white border-4 border-[rgb(155,244,236)]"
                            style={{
                              backgroundColor: getDifficultyColor(diff.level_index as 0 | 1 | 2 | 3 | 4)
                            }}
                          >
                            {diff.level}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Utage谱面 */}
                  {song.difficulties?.utage?.length > 0 && (
                    <div className="flex items-center">
                      <span className="w-20 text-sm text-gray-500 mr-2">宴会场</span>
                      <div className="flex space-x-2">
                        {song.difficulties.utage.map((diff: { level: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }, idx: Key | null | undefined) => (
                          <div
                            key={idx}
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl text-white border-4 border-[rgb(155,244,236)]"
                            style={{
                              backgroundColor: "rgb(220, 56, 184)"
                            }}
                          >
                            {diff.level}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}