import { Song } from '@/app/music/songModel'
import { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import SongItem from './components/SongItem'


interface SongListProps {
  songs: Song[]
  ordination?: 'desc' | 'dsc'
  currentCategory?: string
  loading?: boolean
}

export default function SongList({ songs, currentCategory = '最近添加', ordination = 'desc', loading = false }: SongListProps) {
  // 添加状态来跟踪当前显示模式：等级或具体定数
  const [displayMode, setDisplayMode] = useState<'level' | 'level_value'>('level')

  return (
    <div className="flex-col w-full max-sm:px-2 justify-center items-center p-4 max-sm:p-0">
      <div className="flex max-sm:flex-col max-sm:items-start justify-center items-center mb-6 px-4 max-sm:px-1">
        <div className="text-lg font-medium max-sm:mb-3 text-black">
          当前分类：{currentCategory}
        </div>
        <div className="flex bg-pink-300 p-1 rounded-full overflow-hidden w-64 max-sm:w-40 max-sm:mb-5 max-sm:h-9">
          <button
            className={`flex-1 py-2 max-sm:py-0 max-sm:flex max-sm:items-center max-sm:justify-center text-center text-sm rounded-full transition-all duration-200 ${displayMode === 'level' ? 'bg-white shadow-md text-pink-500 font-medium' : 'text-white'}`}
            onClick={() => setDisplayMode('level')}
          >
            等级
          </button>
          <button
            className={`flex-1 py-2 max-sm:py-0 max-sm:flex max-sm:items-center max-sm:justify-center text-center text-sm rounded-full transition-all duration-200 ${displayMode === 'level_value' ? 'bg-white shadow-md text-pink-500 font-medium' : 'text-white'}`}
            onClick={() => setDisplayMode('level_value')}
          >
            定数
          </button>
        </div>
      </div>

      <div className='w-full flex flex-wrap justify-center items-center'>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner size='sm' message="加载中..." description="正在获取乐曲数据" />
          </div>
        ) : (
          songs.map((song, index) => (
            <SongItem
              key={`${song.id}-${index}`}
              song={song}
              index={index}
              totalSongs={songs.length}
              displayMode={displayMode}
            />
          ))
        )}
      </div>

    </div >
  )
}