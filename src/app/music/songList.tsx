import Link from 'next/link'
import { Song, getDifficultyColor, getGenreColor, transferText } from '@/app/music/songModel'

interface SongListProps {
  songs: Song[]
}

export default function SongList({ songs }: SongListProps) {
  return (
    <div className="flex-col w-full max-sm:mt-5 justify-center items-center p-4 space-y-1 ">
      {songs.map((song, index) => (
        <Link
          href={`/music/${song.id}`}
          key={song.id}
          onClick={() => localStorage.setItem(`song_${song.id}`, JSON.stringify(song))}
        >
          <div className="flex h-44 max-sm:h-32 max-sm:mx-auto bg-white px-4 max-sm:px-2 max-sm:mb-16 py-2 space-x-8 max-sm:space-x-2 cursor-pointer duration-300">
            {/* 左侧曲绘封面 */}
            <div className="max-sm:size-28 w-36 h-36 flex-shrink-0">
              <img
                src={`https://assets2.lxns.net/maimai/jacket/${song.id}.png`}
                alt={song.title}
                className="rounded-xl object-cover w-full h-full"
              />
            </div>

            {/* 右侧歌曲信息 */}
            <div className="sm:flex-1 flex flex-col max-sm:h-28 h-40 max-sm:ml-0 ml-2 justify-center min-w-0">
              <div className="sm:flex-1 flex max-sm:flex-col max-sm:h-36 h-40 max-sm:ml-0 ml-2 justify-center">
                {/* 歌曲信息 */}
                <div className="sm:flex-1 flex flex-col items-start min-w-0">
                  <h2
                    className="inline-flex max-sm:ml-0 max-sm:px-2 max-sm:text-xs px-5 py-1 truncate rounded-full text-white border-2"
                    style={{
                      backgroundColor: getGenreColor(song.genre).bg,
                      borderColor: getGenreColor(song.genre).border
                    }}
                  >
                    {transferText(song.genre)}
                  </h2>
                  <h2 className="text-2xl max-sm:text-base max-sm:w-[220px] max-sm:my-1 text-black font-bold my-3 truncate max-w-full">
                    {song.title}
                  </h2>
                  <div className="text-gray-600 self-start w-full max-sm:text-xs">
                    <p className="text-left truncate max-sm:w-[120px]">Artist: {song.artist}</p>
                    <p className="text-left truncate max-sm:w-[120px]">BPM: {song.bpm}</p>
                  </div>
                </div>
                {/* 难度等级 */}
                <div className="flex flex-col space-y-2 max-sm:space-y-1 mb-2 justify-center">
                  {/* Standard谱面 */}
                  {song.difficulties.standard.length > 0 && (
                    <div className="flex items-center">
                      <span className="w-16 max-sm:w-12 max-sm:text-xs text-sm text-white bg-blue-500 rounded-full py-1 mr-2 max-sm:mr-1">标准</span>
                      <div className="flex space-x-2 max-sm:space-x-1">
                        {song.difficulties.standard.map((diff, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 max-sm:w-8 max-sm:h-8 rounded-xl flex items-center justify-center text-xl max-sm:text-sm text-white border-4 max-sm:border-2 border-[rgb(155,244,236)]"
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
                      <span className="w-16 max-sm:w-12 max-sm:text-xs text-sm text-white bg-orange-500 rounded-full py-1 mr-2 max-sm:mr-1">DX</span>
                      <div className="flex space-x-2 max-sm:space-x-1">
                        {song.difficulties.dx.map((diff, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 max-sm:w-8 max-sm:h-8 rounded-xl flex items-center justify-center text-xl max-sm:text-sm text-white border-4 max-sm:border-2 border-[rgb(155,244,236)]"
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
                      <span className="w-16 max-sm:w-12 max-sm:text-xs text-sm text-white rounded-full py-1 mr-2 max-sm:mr-1" style={{
                        backgroundColor: "rgb(220, 56, 184)"
                      }}>宴会场</span>
                      <div className="flex space-x-2 max-sm:space-x-1">
                        {song.difficulties.utage.map((diff, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 max-sm:w-8 max-sm:h-8 rounded-xl flex items-center justify-center text-xl max-sm:text-sm text-white border-4 max-sm:border-2 border-[rgb(155,244,236)]"
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