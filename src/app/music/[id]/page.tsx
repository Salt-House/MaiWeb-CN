'use client'

import { useParams } from 'next/navigation'
import { sampleSong, getDifficultyColor } from '@/app/music/songModel'

export default function SongDetail() {
  const params = useParams()
  const songId = params.id as string

  // 这里应该从API获取歌曲数据，暂时使用示例数据
  const song = sampleSong

  return (
    <div className="relative flex flex-col justify-center items-center mt-10 mb-16">
      <div className="border-4 border-white rounded-2xl">
        <div
          className=" w-[900px] h-80 bg-white rounded-2xl flex flex-col justify-center items-center text-center border-4 border-[rgb(155,244,236)]">
          <div className="container mx-auto p-4">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h1 className="text-3xl font-bold mb-4">{song.title}</h1>
              <div className="space-y-2">
                <p>分类: {song.category}</p>
                <p>作曲家: {song.artist}</p>
                <p>BPM: {song.bpm}</p>
                <div className="flex space-x-4 mt-4">
                  {song.difficulties.map((diff, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl text-white border-4 border-[rgb(155,244,236)]"
                      style={{
                        backgroundColor: getDifficultyColor(diff.difficulty)
                      }}
                    >
                      {diff.level}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}