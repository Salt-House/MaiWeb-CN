'use client'

import Head from "next/head";
import Link from "next/link"
import { useEffect, useState } from "react"


function StarMove({ count = 5 }) {
  // 生成均匀分布的水平位置
  const generateEvenlyDistributedPositions = (count: number) => {
    const step = 100 / count; // 将屏幕宽度按元素数量等分 (百分比)
    return Array.from({ length: count }).map((_, index) => {
      const base = index * step; // 每个区间的起点
      const randomOffset = Math.random() * step * 0.8; // 在区间内偏移 (80% 范围)
      return base + randomOffset; // 确保值分布在 [base, base + step*0.8]
    });
  };

  const positions = generateEvenlyDistributedPositions(count);

  return (
    <>
      {positions.map((startLeft, index) => {
        const startTop = Math.random() * 5; // 随机起始高度 (0% ~ 5%)

        const style = {
          top: `${startTop}vh`, // 随机起始高度
          left: `${startLeft}vw`, // 均匀分布的水平位置
        };

        return (
          <div
            key={index}
            style={style}
            className="fixed w-[200px] h-[150px] bg-[url('/img/tail.png')] bg-no-repeat bg-contain z-[-2] animate-moveStar"
          ></div>
        );
      })}
    </>
  );
}



export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options = ["1km", "5km", "10km"];


  useEffect(() => {
    const now = new Date();
    const hours = now.getUTCHours() + 8; // Convert to East 8th timezone
    if (hours >= 22 && hours < 23) {
      alert("系统正处于开发阶段，每天22:30-23:00为部署测试时间，网站不稳定，您的数据可能不会被记录\n请注意，本问卷仅限于中国大陆地区，如果您不在中国大陆地区，请不要填写");
    }
  }, []);


  return (
    <>
      <div className="w-full h-[1280px] overflow-y-scroll">
        {/* BackGround Layer */}
        <div className="fixed top-0 left-0 w-full h-full overflow-auto z-[-1] bg-[url('/img/bg_shines.png')]">
          <div className="fixed top-4 left-4 size-44 bg-[url('/img/moon.png')] bg-contain flex justify-center items-center">
            <img src="/img/logo.png" alt="" />
          </div>
        </div>
        <div className="fixed top-0 left-0 w-full h-full overflow-auto z-[-2]">
          <div className="w-[10px] h-[200px]">
          </div>
          <div className="flex justify-center max-sm:hidden max-md:hidden max-lg:hidden max-xl:hidden">
            <div className="w-[1000px] h-[600px] max-xl:h-[400px] max-xl:w-[300px]  bg-[url('/img/chara-left.png')] bg-no-repeat bg-contain bg-left"></div>
            <div className="w-[1200px]"></div>
            <div className="w-[1000px] h-[600px] max-xl:h-[400px] max-xl:w-[300px] bg-[url('/img/chara-right.png')] bg-no-repeat bg-contain bg-right"></div>
          </div>
        </div>
        <StarMove />
        <div className="fixed w-full h-full mt-[-80px] bg-[url('/img/bg_pattern.png')] z-[-3] animate-moveDot"></div>
        {/* Main Layer */}
        <div className="relative w-full">
          {/* Top Container Back */}
          <div className="absolute inset-0 z-[-1] flex justify-center ">
            <div className="w-[900px] h-[500px] bg-[url('/img/aurora.png')] bg-no-repeat bg-contain"></div>
          </div>
          {/* Top Container */}
          <div className="relative z-[10] w-[90%] max-w-[800px] bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-6 mx-auto mt-10 flex items-center space-x-4 justify-center
          text-2xl  text-white ">
            <Link href={"/music"} className="hover:scale-125 transition-all duration-300 ease-in-out">音乐</Link>
            <div>|</div>
            <Link href={"/region"} className="hover:scale-125 transition-all duration-300 ease-in-out">区域</Link>
            <div>|</div>
            <Link href={"/"} className="hover:scale-125 transition-all duration-300 ease-in-out">工具</Link>
            <div>|</div>
            <Link href={"/"} className="hover:scale-125 transition-all duration-300 ease-in-out">教学</Link>
          </div>
          {/* Control */}
          <div className="w-[200px] h-[100px]"></div>
          {/* Welcome to Home page */}
          <div className="mb-10 flex flex-col justify-center items-center">
            <div className="w-[900px] mx-auto text-4xl text-center font-bold bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 bg-clip-text text-transparent">
              Welcome to Maimai.moe In China!!!<br></br>
              本站点提供以下服务功能
            </div>
            <div className="w-[900px]  mt-10 mb-10">
              <div className="flex flex-row justify-center items-center space-x-4">
                <div className="w-96 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain">
                <div className="">2024/12/31</div>
                <div className="w-full flex justify-center items-center h-16 text-center text-xl font-bold text-black">全国行脚</div>
                </div>
                <div className="w-96 h-72 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain"></div>
                <div className="w-96 h-72 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain"></div>
              </div>
              <div className="flex flex-row justify-center items-center space-x-4">
                <div className="w-96 h-72 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain"></div>
                <div className="w-96 h-72 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain"></div>
                <div className="w-96 h-72 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain"></div>
              </div>
            </div>
          </div>
          {/* Search Music */}
          <div className="relative mb-32 flex flex-col justify-center items-center">
            <div className=" w-[800px] h-80 bg-white bg-opacity-75 rounded-2xl flex flex-col justify-center items-center text-center">
              <div className="absolute -top-6 w-48 h-20 text-3xl font-bold text-black">
                Music
              </div>
              <div className="flex flex-row justify-center items-center space-x-4 mb-4">
                <div className="w-44 h-16 border-4 border-[#65d8cd] bg-white text-black rounded-full flex justify-center items-center shadow-lg hover:shadow-2xl hover:scale-105 transtia  transition-all duration-300 ease-in-out">
                  Maimai
                </div><div className="w-44 h-16 border-4 border-[#65d8cd] bg-white text-black rounded-full flex justify-center items-center shadow-lg hover:shadow-2xl hover:scale-105 transtia  transition-all duration-300 ease-in-out">
                  Maimai
                </div><div className="w-44 h-16 border-4 border-[#65d8cd] bg-white text-black rounded-full flex justify-center items-center shadow-lg hover:shadow-2xl hover:scale-105 transtia  transition-all duration-300 ease-in-out">
                  Maimai
                </div>
              </div>
              <div className="flex flex-row justify-center items-center space-x-4 mb-4">
                <div className="w-44 h-16 border-4 border-[#65d8cd] bg-white text-black rounded-full flex justify-center items-center shadow-lg hover:shadow-2xl hover:scale-105 transtia  transition-all duration-300 ease-in-out">
                  Maimai
                </div><div className="w-44 h-16 border-4 border-[#65d8cd] bg-white text-black rounded-full flex justify-center items-center shadow-lg hover:shadow-2xl hover:scale-105 transtia  transition-all duration-300 ease-in-out">
                  Maimai
                </div><div className="w-44 h-16 border-4 border-[#65d8cd] bg-white text-black rounded-full flex justify-center items-center shadow-lg hover:shadow-2xl hover:scale-105 transtia  transition-all duration-300 ease-in-out">
                  Maimai
                </div>
              </div>
              <div className="w-72 h-12 bg-blue-700 rounded-full flex flex-row justify-center items-center text-center shadow-md shadow-gray-500">
                <div className="ml-2">查询</div>
                <input type="text" name="" id="" placeholder="乐曲名/作曲家" className="w-56 h-10 ml-2 p-4 rounded-l-none rounded-r-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300" />
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
          <div></div>
          {/* Search Game Center */}
          <div className="relative w-[800px] h-64 mx-auto flex flex-col justify-center items-center space-y-5 rounded-2xl overflow-visible">
            <div className="absolute  rounded-2xl inset-x-0 z-[-1] bg-white">
              <div className="border-4 border-white rounded-2xl">
                <div className="border-4 border-[rgb(113,241,229)] rounded-2xl">
                  <div className="border-4 border-white rounded-2xl">
                    <div className="border-4 border-[rgb(125,136,217)] rounded-2xl">
                      <div className="w-[800px] h-64 rounded-2xl">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <img className="absolute w-48 -top-16" src="/img/logo.png" alt="" />
            <div className="text-2xl text-center font-bold bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 bg-clip-text text-transparent">
              选择你的出勤机厅
            </div>
            <div className="border-4 border-white rounded-full">
              <div className="border-4 border-[rgb(113,241,229)] rounded-full ">
                <div className=" border-4 border-white rounded-full">
                  <div className="w-[650px] h-24 p-4 bg-[rgb(113,241,229)] rounded-full
                  flex justify-center items-center space-x-4 space-y- text-black text-xl">
                    <p>从现在的位置以</p>
                    <div className="relative w-48">
                      <input
                        type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onFocus={() => setIsDropdownOpen(true)} onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)} placeholder="选择范围"
                        className="w-full px-4 py-2 border border-gray-300 rounded-full text-black focus:outline-none"
                      />
                      {isDropdownOpen && (
                        <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto text-black">
                          {options.filter((option) =>
                            option.toLowerCase().includes(inputValue.toLowerCase())
                          ).map((option, index) => (
                            <li key={index} onMouseDown={() => setInputValue(option)} className="px-4 py-2 cursor-pointer bg-[rgb(164,247,238)] hover:bg-gray-100">
                              {option}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <p>为范围</p>
                    <div className="border-2 border-white rounded-full hover:scale-125 transition-all duration-300">
                      <div className="border-2 border-[rgb(113,241,229)] rounded-full">
                        <button className="w-24 border-2 p-2 border-white rounded-full bg-[rgb(245,242,193)] hover:bg-[rgb(210,251,246)] ">
                          查找
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* thanks */}
          <div className="mt-10 w-full flex flex-col justify-center items-center h-64 bg-[url('/img/bg_pc.png')]  bg-contain text-center">
            <div className="w-28 h-12 text-2xl text-black">
              鸣谢
            </div>
            {/* First row */}
            <div className="mb-5 flex flex-row space-x-5">
              <div className="w-48 h-16 bg-white"></div>
              <div className="w-48 h-16 bg-white"></div>
              <div className="w-48 h-16 bg-white"></div>
              <div className="w-48 h-16 bg-white"></div>
            </div>
            {/* Second row */}
            <div className="mb-5 flex flex-row space-x-5">
              <div className="w-48 h-16 bg-white"></div>
              <div className="w-48 h-16 bg-white"></div>
              <div className="w-48 h-16 bg-white"></div>
              <div className="w-48 h-16 bg-white"></div>
            </div>
          </div>
          <Link href={"/user"}>
            <div className="fixed top-4 right-4 size-44  bg-[url('/img/user.png')] bg-no-repeat bg-contain hover:scale-125 transition-all duration-300 ease-in-out">
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}

