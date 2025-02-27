import Link from 'next/link'
import { Song, getDifficultyColor, getGenreColor, transferText } from '@/app/music/songModel'

interface SongListProps {
  songs: Song[]
}

export default function SongList({ songs }: SongListProps) {
  return (
    <div className="flex-col w-full p-4 space-y-1">
      {songs.map((song, index) => (
        <Link
          href={`/music/${song.id}`}
          key={song.id}
          onClick={() => localStorage.setItem(`song_${song.id}`, JSON.stringify(song))}
        >
          <div className="flex h-44 bg-white px-4 py-2 space-x-8 cursor-pointer duration-300">
            {/* 左侧曲绘封面 */}
            <div className="w-36 h-36 flex-shrink-0">
              <img
                src={`https://assets2.lxns.net/maimai/jacket/${song.id}.png`}
                alt={song.title}
                className="rounded-xl object-cover w-full h-full"
              />
            </div>

            {/* 右侧歌曲信息 */}
            <div className="flex-1 flex flex-col h-40 ml-2 justify-center min-w-0">
              <div className="flex-1 flex h-40 ml-2 justify-center">
                {/* 歌曲信息 */}
                <div className="flex-1 flex flex-col items-start min-w-0">
                  <h2
                    className="inline-flex px-5 py-1 truncate rounded-full text-white border-2"
                    style={{
                      backgroundColor: getGenreColor(song.genre).bg,
                      borderColor: getGenreColor(song.genre).border
                    }}
                  >
                    {/* {transferText(song.genre)} */}
                    {song.genre}
                  </h2>
                  <h2 className="text-2xl text-black font-bold my-3 truncate max-w-full">
                    {song.title}
                  </h2>
                  <div className="text-gray-600 self-start w-full">
                    <p className="text-left truncate">Artist: {song.artist}</p>
                    <p className="text-left truncate">BPM: {song.bpm}</p>
                  </div>
                </div>

                {/* 难度等级 */}
                <div className="flex flex-col space-y-2 mb-2 justify-center">
                  {/* Standard谱面 */}
                  {song.difficulties.standard.length > 0 && (
                    <div className="flex items-center">
                      <span className="w-16 text-sm text-white bg-blue-500 rounded-full py-1 mr-2">标准</span>
                      <div className="flex space-x-2">
                        {song.difficulties.standard.map((diff, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white border-4 border-[rgb(155,244,236)]"
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
                  {song.difficulties.dx.length > 0 && (
                    <div className="flex items-center">
                      <span className="w-16 text-sm text-white bg-orange-500 rounded-full py-1 mr-2">DX</span>
                      <div className="flex space-x-2">
                        {song.difficulties.dx.map((diff, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white border-4 border-[rgb(155,244,236)]"
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
                  {song.difficulties.utage.length > 0 && (
                    <div className="flex items-center">
                      <span className="w-16 text-sm text-white rounded-full py-1 mr-2" style={{
                        backgroundColor: "rgb(220, 56, 184)"
                      }}>宴会场</span>
                      <div className="flex space-x-2">
                        {song.difficulties.utage.map((diff, idx) => (
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
                  )}
                </div>
              </div>
              {index < songs.length - 1 && <div className="flex justify-center mx-1">
                <div className="w-full h-1 rounded-full bg-gray-300" />
              </div>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}