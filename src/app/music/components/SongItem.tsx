import { Song, getDifficultyColor, getGenreColor, transferText } from '@/app/music/songModel'
import { FaPlus, FaCheck } from 'react-icons/fa'
import { usePlayer } from '@/app/context/PlayerContext'
import { useState } from 'react'
import Image from 'next/image'
import SvgStrokedText from '@/app/components/SvgStrokedText'
import { motion } from 'framer-motion'

interface SongItemProps {
    song: Song
    index: number
    totalSongs: number
    displayMode: 'level' | 'level_value'
}

/**
 * 单个歌曲项组件
 * 显示歌曲的详细信息，包括封面、标题、艺术家、难度等级等
 * 支持添加到播放列表功能
 */
    export default function SongItem({ song, index, totalSongs, displayMode }: SongItemProps) {
    const { addToPlaylist } = usePlayer()
    const [isAdded, setIsAdded] = useState(false)

    /**
     * 处理添加歌曲到播放列表
     * @param song 要添加的歌曲对象
     */
    const handleAddToPlaylist = (song: Song) => {
        const audioUrl = `https://assets2.lxns.net/maimai/music/${song.id}.mp3`

        addToPlaylist({
            id: `${song.id}`,
            title: song.title,
            artist: song.artist,
            audioUrl,
            coverUrl: `https://assets2.lxns.net/maimai/jacket/${song.id || 'default'}.png`
        })

        // 更新状态，标记该歌曲已添加
        setIsAdded(true)

        // 1秒后恢复图标
        setTimeout(() => {
            setIsAdded(false)
        }, 1000)
    }

    return (
        // <div className='relative mb-10 max-sm:mb-1'>
        //   <a
        //     href={`https://dev.maimai.moe/music/${song.id}`}
        //     target="_blank"
        //     rel="noopener noreferrer"
        //     onClick={() => localStorage.setItem(`song_${song.id}`, JSON.stringify(song))}
        //   >
        //     <div className="flex h-36 max-sm:h-auto max-sm:flex-row max-sm:items-start max-sm:mx-auto bg-white px-4 max-sm:px-2 py-2 space-x-8 max-sm:space-x-2 cursor-pointer duration-300">
        //       {/* 左侧曲绘封面 */}
        //       <div className="max-sm:size-24 relative w-36 h-36 flex-shrink-0">
        //         <Image
        //           src={`https://assets2.lxns.net/maimai/jacket/${song.id}.png`}
        //           alt={song.title}
        //           className="rounded-xl object-cover"
        //           fill
        //           unoptimized 
        //         />
        //       </div>

        //       {/* 右侧歌曲信息 */}
        //       <div className="sm:flex-1 flex flex-col max-sm:h-auto h-40 justify-center min-w-0 max-sm:flex-1 pl-2 max-sm:pl-3">
        //         <div className="sm:flex-1 flex max-sm:flex-col max-sm:h-auto h-40 justify-center">
        //           {/* 歌曲信息 */}
        //           <div className="sm:flex-1 flex flex-col items-start min-w-0">
        //             <h2
        //               className="inline-flex max-sm:ml-0 max-sm:px-2 max-sm:text-xs px-5 py-1 truncate rounded-full text-white border-2"
        //               style={{
        //                 backgroundColor: getGenreColor(song.genre).bg,
        //                 borderColor: getGenreColor(song.genre).border
        //               }}
        //             >
        //               {transferText(song.genre)}
        //             </h2>
        //             <h2 className="text-2xl max-sm:text-left max-sm:text-base max-sm:w-full text-black font-bold my-3 max-sm:my-1 truncate max-w-full">
        //               {song.title}
        //             </h2>
        //             <div className="text-gray-600 self-start w-full max-sm:text-xs">
        //               <p className="text-left truncate">Artist: {song.artist}</p>
        //               <p className="text-left truncate">BPM: {song.bpm}</p>
        //             </div>
        //           </div>
        //           {/* 难度等级 */}
        //           <div className="flex flex-col space-y-2 max-sm:space-y-1 mb-2 justify-center max-sm:mt-2 max-sm:w-full">
        //             {/* Standard谱面 */}
        //             {song.difficulties.standard.length > 0 && (
        //               <div className="flex items-center">
        //                 <span className="w-16 max-sm:w-12 max-sm:text-xs text-sm text-white bg-pink-500 rounded-full py-1 mr-2 max-sm:mr-1">标准</span>
        //                 <div className="flex space-x-2 max-sm:space-x-1">
        //                   {song.difficulties.standard.map((diff, idx) => (
        //                     <div key={idx} className='flex flex-col'>
        //                       <div
        //                         className="w-12 h-12 max-sm:w-8 max-sm:h-8 rounded-xl flex items-center justify-center text-xl max-sm:text-sm text-white border-4 max-sm:border-2 border-pink-300"
        //                         style={{
        //                           backgroundColor: getDifficultyColor(diff.level_index as 0 | 1 | 2 | 3 | 4)
        //                         }}
        //                       >
        //                         {displayMode === 'level' ? diff.level : (Number.isInteger(diff.level_value) ? `${diff.level_value}.0` : diff.level_value)}
        //                       </div>
        //                     </div>
        //                   ))}
        //                 </div>
        //               </div>
        //             )}

        //             {/* DX谱面 */}
        //             {song.difficulties.dx.length > 0 && (
        //               <div className="flex items-center">
        //                 <span className="w-16 max-sm:w-12 max-sm:text-xs text-sm text-white bg-orange-500 rounded-full py-1 mr-2 max-sm:mr-1">DX</span>
        //                 <div className="flex flex-row space-x-2 max-sm:space-x-1">
        //                   {song.difficulties.dx.map((diff, idx) => (
        //                     <div key={idx} className='flex flex-col'>
        //                       <div
        //                         className="w-12 h-12 max-sm:w-8 max-sm:h-8 rounded-xl flex items-center justify-center text-xl max-sm:text-sm text-white border-4 max-sm:border-2 border-pink-300"
        //                         style={{
        //                           backgroundColor: getDifficultyColor(diff.level_index as 0 | 1 | 2 | 3 | 4)
        //                         }}
        //                       >
        //                         {displayMode === 'level' ? diff.level : (Number.isInteger(diff.level_value) ? `${diff.level_value}.0` : diff.level_value)}
        //                       </div>
        //                     </div>
        //                   ))}
        //                 </div>
        //               </div>
        //             )}

        //             {/* Utage谱面 */}
        //             {song.difficulties.utage.length > 0 && (
        //               <div className="flex items-center">
        //                 <span className="w-16 max-sm:w-12 max-sm:text-xs text-sm text-white rounded-full py-1 mr-2 max-sm:mr-1" style={{
        //                   backgroundColor: "rgb(220, 56, 184)"
        //                 }}>宴会场</span>
        //                 <div className="flex space-x-2 max-sm:space-x-1">
        //                   {song.difficulties.utage.map((diff, idx) => (
        //                     <div
        //                       key={idx}
        //                       className="w-12 h-12 max-sm:w-8 max-sm:h-8 rounded-xl flex items-center justify-center text-xl max-sm:text-sm text-white border-4 max-sm:border-2 border-pink-300"
        //                       style={{
        //                         backgroundColor: "rgb(220, 56, 184)"
        //                       }}
        //                     >
        //                       {diff.level}
        //                     </div>
        //                   ))}
        //                 </div>
        //               </div>
        //             )}
        //           </div>
        //         </div>
        //         {/* 分隔线 */}
        //         {index < totalSongs - 1 && (
        //           <div className="flex justify-center mx-1 max-sm:mt-2">
        //             <div className="w-full h-0.5 rounded-full bg-gray-300" />
        //           </div>
        //         )}
        //       </div>
        //     </div>
        //   </a>

        //   {/* 添加到播放列表按钮 */}
        //   <button
        //     onClick={() => handleAddToPlaylist(song)}
        //     className={`absolute max-sm:-left-1 max-sm:-top-1 left-0 top-0 w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-pink-600 transition-colors ${isAdded ? 'bg-green-400 hover:bg-green-500' : 'bg-pink-500 hover:bg-pink-600'}`}
        //     title="添加到播放列表"
        //   >
        //     {isAdded ? <FaCheck /> : <FaPlus />}
        //   </button>
        // </div>
        <motion.div
            className='relative songitem-premium flex items-center w-fit bg-pink-500 rounded-full mb-10 max-sm:mb-1 pr-4'
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.995 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.5 }}
        >
            {/* 添加到播放列表按钮 */}
            <button
                onClick={() => handleAddToPlaylist(song)}
                className={`absolute z-10 max-sm:-left-1 max-sm:-top-1 left-0 top-0 w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-pink-600 transition-colors ${isAdded ? 'bg-green-400 hover:bg-green-500' : 'bg-pink-500 hover:bg-pink-600'}`}
                title="添加到播放列表"
            >
                {isAdded ? <FaCheck /> : <FaPlus />}
            </button>
            <motion.div
                className='songitem-avatar flex-shrink-0 size-40 border-4 border-pink-300 rounded-full relative shadow-lg hover:border-pink-400 transition-colors duration-300'
                whileHover={{ rotate: -1.5, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <Image
                    src={`https://assets2.lxns.net/maimai/jacket/${song.id}.png`}
                    alt={song.title}
                    className='rounded-full object-cover'
                    fill
                    unoptimized
                />
            </motion.div>
            <div className='ml-4 flex flex-col justify-center items-start'>
                <p className='text-white font-bold text-xl truncate max-w-[200px]'>{song.title}</p>
                <div id='level' className='flex flex-col mt-1 space-y-1'>
                    {song.difficulties.dx.length > 0 && (
                        <div className='flex items-center'>
                            <Image src={'/img/dx.png'} width={60} height={30} alt="DX" className='-ml-2' />
                            {song.difficulties.dx.map((diff) => (
                                <SongLevelText
                                    key={diff.level_index}
                                    level={displayMode === 'level' ? diff.level : (Number.isInteger(diff.level_value) ? `${diff.level_value}.0` : diff.level_value)}
                                    level_index={diff.level_index as 0 | 1 | 2 | 3 | 4}
                                />
                            ))}
                        </div>
                    )}
                    {song.difficulties.standard.length > 0 && (
                        <div className='flex items-center'>
                            <Image src={'/img/standard.png'} width={60} height={30} alt="standard" className='-ml-2' />
                            {song.difficulties.standard.map((diff) => (
                                <SongLevelText
                                    key={diff.level_index}
                                    level={displayMode === 'level' ? diff.level : (Number.isInteger(diff.level_value) ? `${diff.level_value}.0` : diff.level_value)}
                                    level_index={diff.level_index as 0 | 1 | 2 | 3 | 4}
                                />
                            ))}
                        </div>
                    )}
                    {song.difficulties.utage.length > 0 && (
                        <div className='flex items-center'>
                            <Image src={'/img/utage.png'} width={60} height={30} alt="utage" className='-ml-2' />
                            {song.difficulties.utage.map((diff) => (
                                <SongLevelText
                                    key={diff.level_index}
                                    level={displayMode === 'level' ? diff.level : (Number.isInteger(diff.level_value) ? `${diff.level_value}.0` : diff.level_value)}
                                    level_index={diff.level_index as 0 | 1 | 2 | 3 | 4}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <p>BPM:{song.bpm}</p>
            </div>
        </motion.div>
    )
}

/**
 * 歌曲难度等级文本组件
 * 显示带有描边效果的难度等级数字   
 * @param level 难度等级值
 * @param level_index 难度等级索引，用于确定颜色
 */
/**
 * 根据难度等级获取描边颜色
 */
function getStrokeColor(level_index: 0 | 1 | 2 | 3 | 4): string {
    switch (level_index) {
        case 0: return '#437f25'  // Basic
        case 1: return '#956e05'  // Advanced 
        case 2: return '#994d55'  // Expert
        case 3: return '#5f3184'  // Master
        case 4: return '#ffffff'  // Re:Master
        default: return '#ffffff'
    }
}

/**
 * 根据难度等级获取文字颜色
 */
function getTextColor(level_index: 0 | 1 | 2 | 3 | 4): string {
    switch (level_index) {
        case 0: return '#ffffff'  // Basic
        case 1: return '#ffffff'  // Advanced
        case 2: return '#ffffff'  // Expert
        case 3: return '#ffffff'  // Master
        case 4: return '#5f3184'  // Re:Master
        default: return '#ffffff'
    }
}

function SongLevelText({ level, level_index }: { level: number | string, level_index: 0 | 1 | 2 | 3 | 4 }) {
    return (
        <div className="relative mx-2">
            <span className="absolute inset-0 text-2xl font-bold" style={{
                color: 'transparent',
                WebkitTextStroke: `4px ${getStrokeColor(level_index)}`,
            }}>
                {level}
            </span>
            <span className="relative text-2xl font-bold" style={{
                color: getTextColor(level_index)
            }}>
                {level}
            </span>
        </div>
    )
}