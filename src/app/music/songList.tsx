import { Song } from '@/app/music/songModel'

interface SongListProps {
  songs: Song[]
}

export default function SongList({ songs }: SongListProps) {
  return (
    <div className="flex-col w-full p-4 space-y-1">
      {songs.map((song, index) => (
        <>
          <div key={song.id} className="flex h-44 bg-white px-4 py-2 space-x-8">
            {/* 左侧曲绘封面 */}
            <div className="w-36 h-36">
              <img src="/img/testResource/HeartPieDanceHall.png" alt="" className="rounded-xl" />
            </div>

            {/* 右侧歌曲信息 */}
            <div className="flex-1 flex flex-col h-40 ml-2">
              <div className="flex-1 flex h-40 ml-2 justify-center">
                {/* 歌曲信息 */}
                <div className="flex-1 flex flex-col items-start">
                  <h2 className="inline-flex px-3 py-1 truncate rounded-full text-white border-2 border-[#b38c00] bg-[rgb(255,200,0)] ">{song.category}</h2>
                  <h2 className="text-2xl font-bold my-3">{song.title}</h2>
                  <div className="text-gray-600 self-start w-full">
                    <p className="text-left">Artist: {song.artist}</p>
                    <p className="text-left">BPM: {song.bpm}</p>
                  </div>
                </div>

                {/* 难度等级 */}
                <div className="flex space-x-2 items-center mb-2">
                  {song.difficulties.map((diff, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white border-4 border-[rgb(155,244,236)]"
                      style={{
                        backgroundColor: getDifficultyColor(diff.difficulty)
                      }}
                    >
                      {diff.level}
                    </div>
                  ))}
                </div>
              </div>
              {index < songs.length - 1 && <div className="flex justify-center mx-1">
                <div className="w-full h-1 rounded-full bg-gray-300" />
              </div>}
            </div>
          </div>
        </>
      ))}
    </div>
  )
}

// 难度颜色辅助函数
function getDifficultyColor(difficulty: keyof typeof colors): string {
  const colors = {
    'Basic': '#1eb300',
    'Advanced': '#e1d030',
    'Expert': '#ff1744',
    'Master': '#ab47bc',
    'Re:Master': '#acaadd'
  }
  return colors[difficulty]
}