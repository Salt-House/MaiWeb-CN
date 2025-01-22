'use client'

import { useState } from 'react'
import { sampleSong } from "@/app/music/songModel"
import SongList from '@/app/music/songList'

export default function MusicPage() {
  const songs = [sampleSong, sampleSong, sampleSong, sampleSong, sampleSong, sampleSong]
  const [selectedOption, setSelectedOption] = useState('category')

  return (
    <>
      <style jsx>{`
        select {
          appearance: none; /* 清除默认样式 */
          -webkit-appearance: none; /* 兼容 Safari */
          -moz-appearance: none; /* 兼容 Firefox */
          color: white; /* 默认文本颜色 */
        }
        select option {
          color: black; /* 默认选项文本颜色 */
          background-color: white; /* 默认选项背景颜色 */
        }
        select:focus option:checked {
          color: black; /* 被选中选项的文本颜色 */
          background-color: white; /* 被选中选项的背景颜色 */
        }
        select:not(:focus) option:checked {
          color: black; /* 失去焦点时被选中选项的文本颜色 */
          background-color: white; /* 失去焦点时被选中选项的背景颜色 */
        }
    `}</style>
      {/*Top Search Options Bar*/}
      <div className="relative flex flex-col justify-center items-center mt-10 mb-16">
        <div className="border-4 border-white rounded-2xl">
          <div
            className=" w-[900px] h-80 bg-white rounded-2xl flex flex-col justify-center items-center text-center border-4 border-[rgb(155,244,236)]">
            <div className="absolute -top-4 w-48 h-20 text-3xl font-bold text-black">
              Music
            </div>
            <div className="flex flex-row space-x-16 -mt-4 mb-2">
              <div
                className="w-80 h-12 bg-blue-700 rounded-full flex flex-row justify-center items-center text-center shadow-md shadow-gray-500 my-5 space-x-3">
                <div className="text-white ml-2">按照</div>
                <select
                  className="w-40 h-9 rounded-full px-4 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 border"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  <option value="category">乐曲种类</option>
                  <option value="aeuio">あいうえお</option>
                  <option value="level">等级</option>
                  <option value="version">版本</option>
                </select>
                <div className="text-white ml-2">分类</div>
              </div>
              <div
                className="w-80 h-12 bg-blue-700 rounded-full flex flex-row justify-center items-center text-center shadow-md shadow-gray-500 my-5 space-x-5">
                <div className="ml-2 text-white">搜索</div>
                <input type="text" name="" id="" placeholder="乐曲名/作曲家"
                  className="w-56 h-9 ml-2 p-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300" />
              </div>
            </div>
            <div className='h-[172px]'>
              {/* 根据选择的选项显示不同分类选项 */}
              {selectedOption === 'category' && <CategoryBar />}
              {selectedOption === 'aeuio' && <AeuioBar />}
              {selectedOption === 'level' && <LevelBar />}
              {selectedOption === 'version' && <div>版本页面</div>}
            </div>

            {/* AnimateVolume */}
            <div className="absolute -bottom-8 flex space-x-2">
              <div className="w-2 h-8 bg-[#5ac0b6] animate-volume"></div>
              <div className="w-2 h-10 bg-[#7ef2e7] animate-volume [animation-delay:0.1s]"></div>
              <div className="w-2 h-6 bg-[rgb(112,240,228)] animate-volume [animation-delay:0.2s]"></div>
              <div className="w-2 h-12 bg-[#65d8cd] animate-volume [animation-delay:0.3s]"></div>
              <div className="w-2 h-10 bg-[rgb(112,240,228)] animate-volume [animation-delay:0.4s]"></div>
              <div className="w-2 h-6 bg-[rgb(112,240,228)] animate-volume [animation-delay:0.5s]"></div>
              <div className="w-2 h-12 bg-[rgb(112,240,228)] animate-volume [animation-delay:0.6s]"></div>
              <div className="w-2 h-6 bg-[rgb(112,240,228)] animate-volume [animation-delay:0.7s]"></div>
              <div className="w-2 h-8 bg-[rgb(112,240,228)] animate-volume [animation-delay:0.8s]"></div>
            </div>
          </div>
        </div>
      </div>

      {/*Music Cards*/}
      <div className="relative flex flex-col justify-center items-center mt-10 mb-32">
        <div className="border-4 border-white rounded-2xl">
          <div
            className="w-[900px] min-h-80 bg-white rounded-2xl flex flex-col justify-center items-center text-center border-4 border-[rgb(155,244,236)]">
            <SongList songs={songs} />
          </div>
        </div>
      </div>
    </>
  )
}

function CategoryBar() {
  return (
    <>
      <div className="flex flex-row justify-center items-center space-x-4 mb-4">
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[rgb(247,126,161)] rounded-full bg-white flex justify-center items-center font-bold text-[rgb(255,199,219)]">
            最近更新
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[#b38c00] rounded-full bg-[rgb(255,200,0)] flex justify-center items-center font-bold">
            流行&动漫
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[rgb(0,108,196)] rounded-full bg-[rgb(69,197,255)] flex flex-col justify-center items-center font-bold">
            <span>niconico&</span>
            <span>VOCALOID</span>
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[#7f2bb6] rounded-full bg-[rgb(159,54,227)] flex justify-center items-center font-bold">
            东方Project
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center space-x-4 mb-7">
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[#62b942] rounded-full bg-[rgb(122,231,83)] flex justify-center items-center font-bold">
            其他游戏
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[#802323] rounded-full bg-[rgb(255,70,70)] flex justify-center items-center font-bold">
            舞萌
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[rgb(0,108,196)] rounded-full bg-[rgb(48,157,248)] flex justify-center items-center font-bold">
            音击&中二
          </div>
        </div>
        <div
          className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
          <div
            className="w-44 h-16 border-4 border-[rgb(179,46,121)] rounded-full bg-[rgb(220,56,184)] flex justify-center items-center font-bold">
            宴会场
          </div>
        </div>
      </div>
    </>
  )
}

function AeuioBar() {
  const items: String[] = [
    'あ行', 'か行', 'さ行', 'た行', 'な行',
    'は行', 'ま行', 'や行', 'ら行', 'わ行',
    'A-G', 'H-N', 'O-U', 'V-Z', '数字·その他'
  ]

  return (
    <div className="h-[172px] max-w-[1200px] mx-auto">
      <div className="grid grid-cols-5 grid-rows-3 gap-4 h-full">
        {[...Array(15)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-slate-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 px-7 py-2 border-4 border-[rgb(155,244,236)]"
          >
            {items[index]}
          </div>
        ))}
      </div>
    </div>
  )
}

function LevelBar() {
  const levels = [
    '1', '2', '3', '4', '5', '6', '7', '7+',
    '8', '8+', '9', '9+', '10', '10+', '11', '11+',
    '12', '12+', '13', '13+', '14', '14+', '15', '宴']

  return (
    <div className="h-[172px] max-w-[1200px] mx-auto">
      <div className="grid grid-cols-8 grid-rows-3 gap-4 h-full">
        {[...Array(24)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-slate-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 px-7 py-2 border-4 border-[rgb(155,244,236)]"
          >
            {levels[index]}
          </div>
        ))}
      </div>
    </div>
  )
}

function VersionBar() {
}