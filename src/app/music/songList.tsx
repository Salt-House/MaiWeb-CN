import Link from 'next/link'
import { Song, getDifficultyColor, getGenreColor, transferText } from '@/app/music/songModel'
import { FaPlus, FaCheck } from 'react-icons/fa'
import { usePlayer } from '@/app/context/PlayerContext'
import { useState } from 'react'


interface SongListProps {
  songs: Song[]
}

export default function SongList({ songs }: SongListProps) {
  // 使用usePlayer hook获取播放器上下文
  const { addToPlaylist } = usePlayer()
  // 添加状态来跟踪哪些歌曲已被添加到播放列表
  const [addedSongs, setAddedSongs] = useState<{ [key: string]: boolean }>({})

  // 根据上下文修改handleAddToPlaylist函数，确保有正确的参数
  const handleAddToPlaylist = (song: Song) => {
    // 假设Song类型的对象包含id和title，但可能不包含audioUrl
    // 根据上下文构造audioUrl

    const audioUrl = `https://assets2.lxns.net/maimai/music/${song.id}.mp3`

    addToPlaylist({
      id: `${song.id}`,
      title: song.title,
      artist: song.artist,
      audioUrl,
      coverUrl: `https://assets2.lxns.net/maimai/jacket/${song.id || 'default'}.png`
    })

    // 更新状态，标记该歌曲已添加
    setAddedSongs(prev => ({ ...prev, [song.id]: true }))

    // 1秒后恢复图标
    setTimeout(() => {
      setAddedSongs(prev => ({ ...prev, [song.id]: false }))
    }, 1000)
  }

  return (
    <div className="flex-col w-full max-sm:mt-5 justify-center items-center p-4 space-y-1 ">
      {songs.map((song, index) => (
        <>
          <div id='clickDetail' className='relative'>
            <a
              href={`https://dev.maimai.moe/music/${song.id}`}
              key={song.id}
              target="_blank"
              rel="noopener noreferrer"
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
                    <div className="w-full mt-2 h-1 rounded-full bg-gray-300" />
                  </div>
                  }
                </div>
              </div>
            </a>
            <button
              id='addMusicPlay'
              onClick={() => handleAddToPlaylist(song)}

              className={`absolute left-0 top-0 w-8 h-8 flex items-center justify-center rounded-full  text-white hover:bg-[rgb(135,70,193)] transition-colors ${addedSongs[song.id] ? 'bg-green-400 hover:bg-green-500' : 'bg-[rgb(155,90,213)] hover:bg-[rgb(135,70,193)]'}`}

              title="添加到播放列表"
            >
              {addedSongs[song.id] ? <FaCheck /> : <FaPlus />}
            </button>
          </div>

        </>
      ))}
    </div>
  )
}