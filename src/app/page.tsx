'use client'

import { Chilanka } from "next/font/google";
import Head from "next/head";
import Link from "next/link"
import { useEffect, useState } from "react";
import ChinaMap from "./components/ChinaMap";

interface NewsProps {
  title: string,
  content: string,
  image_url: string,
  source: string,
  source_url: string,
  source_author: string,
  source_created_at: string
}


export default function Home() {
  const [news1, setNews1] = useState<NewsProps[]>([
    {
      "title": "【2/27(木)「大都会区域9」登场！】在遥远过去的记忆中、黒姫在思考着什么呢――新人曲师也参战的KOP6th International ver. 決…",
      "content": "【2/27(木)「大都会区域9」登场！】\n在遥远过去的记忆中、黒姫在思考着什么呢――\n新人曲师也参战的\nKOP6th International ver. 決勝楽曲「雨露霜雪」登场！\n\n🎧参加曲师\nRiraN / Reku Mochizuki / かねこちはる vs t+pazolite",
      "image_url": "http://i0.hdslb.com/bfs/archive/4237cbd92befef9ba793ec76effeef25277c26f0.jpg",
      "source": "bilibili",
      "source_url": "https://t.bilibili.com/1037499077487493121",
      "source_author": "舞萌でらっくす公式",
      "source_created_at": "2025-02-24T12:26:18"
    },
    {
      "title": "t+pazolite vs かねこちはる - 宙天 [maimai でらっくす]",
      "content": "maimai official\nTitle：宙天\nArtist：t+pazolite vs かねこちはる\nMovie：川崎ヒロミツ (SIKAKU Inc.)\nIllust：Metropolis Stories\n\n「雨露霜雪」がかなり王道の合作だったため、かなり邪道の合作になりました。\nt+pazolite\n\n音楽ゲーム『maimai でらっくす』　全国のゲームセンターで絶賛稼働中！",
      "image_url": "http://i2.hdslb.com/bfs/archive/1a9c2a00470b19160a490f4b156535854c3190be.jpg",
      "source": "bilibili",
      "source_url": "https://t.bilibili.com/1037498549231681538",
      "source_author": "舞萌でらっくす公式",
      "source_created_at": "2025-02-24T12:24:15"
    },
    {
      "title": "【2/27(木)～「KALEIDXSCOPE -終末エリア-」登场！】KING of Performai The 6th FINAL ROUND　宙天 /…",
      "content": "【2/27(木)～「KALEIDXSCOPE -終末エリア-」登场！】\nKING of Performai The 6th FINAL ROUND\n　宙天 / t+pazolite vs かねこちはる\n\n找到「黒の扉」「黒の鍵」、\n就可以在カレイドスコープ中的「黒の扉」完成乐曲并解禁！",
      "image_url": "http://i2.hdslb.com/bfs/archive/ee90348591b72ff267b7c0254ba6963f1e868542.jpg",
      "source": "bilibili",
      "source_url": "https://t.bilibili.com/1037498420355399697",
      "source_author": "舞萌でらっくす公式",
      "source_created_at": "2025-02-24T12:23:45"
    }
  ])
  const [news2, setNews2] = useState<NewsProps[]>([
    {
      "title": "【KoP 6th 切片】闭幕 & Burning Hearts ～炎のANGEL～ / 汤毛&光吉猛修",
      "content": "KoP official",
      "image_url": "http://i0.hdslb.com/bfs/archive/3d4e3d408fbe5e7771e3a0c39489d34c13ffab00.jpg",
      "source": "bilibili",
      "source_url": "https://t.bilibili.com/1037496500522844227",
      "source_author": "舞萌でらっくす公式",
      "source_created_at": "2025-02-24T12:16:18"
    },
    {
      "title": "【maimai でらっくす】雨露霜雪 - かねこちはる vs t+pazolite【official】",
      "content": "maimai official\nTitle：雨露霜雪\nArtist：かねこちはる vs t+pazolite\nMovie：Kazuma Enta、cell、SEGA\nIllust：えすてぃお\n\n\n音楽ゲーム『maimai でらっくす』　全国のゲームセンターで絶賛稼働中！",
      "image_url": "http://i0.hdslb.com/bfs/archive/c12c9f5a3da4d65d6bb049f4690479412f608334.jpg",
      "source": "bilibili",
      "source_url": "https://t.bilibili.com/1037496229950390293",
      "source_author": "舞萌でらっくす公式",
      "source_created_at": "2025-02-24T12:15:15"
    },
    {
      "title": "【maimai でらっくす】Colorfull:Encounter / Reku Mochizuki【Official MV】",
      "content": "maimai official\nTitle：Colorfull:Encounter\nArtist：Reku Mochizuki\nMovie：cell、Kazuma Enta、SEGA\nIllust：尾崎ドミノ\n\n愛してやまないmaimaiシリーズへの想いを込めた、とても大切な楽曲です。\nカラフルな思い出たちとの出会いが、これからもずっと続いていきますように。\n\n(略称は「フルエン」でお願いします！)",
      "image_url": "http://i1.hdslb.com/bfs/archive/da4ad9a8ec7c73d299a640e08c1b088e355570f7.jpg",
      "source": "bilibili",
      "source_url": "https://t.bilibili.com/1037494486165356565",
      "source_author": "舞萌でらっくす公式",
      "source_created_at": "2025-02-24T12:08:29"
    }
  ])
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options = ["1km", "5km", "10km"];
  const textstroke = {
    textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)'
  };


  useEffect(() => {
    const now = new Date();
    const hours = now.getUTCHours() + 8; // Convert to East 8th timezone
    if (hours >= 22 && hours < 23) {
      alert("系统正处于开发阶段，每天22:30-23:00为部署测试时间，网站不稳定，您的数据可能不会被记录\n请注意，本问卷仅限于中国大陆地区，如果您不在中国大陆地区，请不要填写");
    }
  }, []);

  return (
    <>
      <div className="w-full  overflow-auto scroll-smooth">

        {/* Main Layer */}
        <div className="relative w-full">

          {/* Control */}
          <div className="w-[200px] h-[100px]"></div>

          {/* Welcome to Home page */}
          <div className=" flex flex-col justify-center items-center">
            <div className="relative w-[900px] mx-auto text-4xl text-center font-bold text-white bg-clip-text text-transparent"
              style={textstroke}>
              Welcome to Maimai.moe In China!!!<br></br>
              本站点提供以下服务功能
              <img src="/img/handblue.png" className="h-14 inline-block animate-bounce" alt="" />
              <img src="/img/handpink.png" className="h-14 inline-block animate-bounce" alt="" />
            </div>
            <div className="w-[900px]  mt-10 ">
              <div className="flex flex-row justify-center items-center space-x-4">
                <div className="w-96 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain">
                  <div className="">2024/12/31</div>
                  <div className="w-full flex justify-center items-center h-16 text-center text-2xl text-white font-bold">全国行脚</div>
                  <div className="text-black pl-8 pt-5">提供统计全国各省份出勤行脚图，让我们一起点亮地图吧！✅ </div>
                </div>
                <div className="w-96 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain">
                  <div className="">2024/12/31</div>
                  <div className="w-full flex justify-center items-center h-16 text-center text-2xl text-white font-bold">乐曲工具</div>
                  <div className="text-black pl-8 pt-5">
                    <ul className="list-decimal list-inside">
                      <li>基础乐曲信息查询✅ </li>
                      <li>快速且便捷的铺面确认</li>
                      <li>支持别名查询✅ </li>
                      <li className="list-none">.......</li>
                    </ul>
                  </div>
                </div>
                <div className="w-96 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain">
                  <div className="">2024/12/31</div>
                  <div className="w-full flex justify-center items-center h-16 text-center text-2xl text-white font-bold">卷王工具</div>
                  <div className="text-black pl-8 pt-5">
                    <ul className="list-decimal list-inside">
                      <li>查询实力排名</li>
                      <li>在全体中歌曲成绩排名</li>
                      <li>在好友中歌曲成绩排名</li>
                      <li>歌曲AP次数排名</li>
                      <li>最少寸止次数排名</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center space-x-4">
                <div className="w-96 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain">
                  <div className="">2024/12/31</div>
                  <div className="w-full flex justify-center items-center h-16 text-center text-2xl text-white font-bold">舞萌区域工具</div>
                  <div className="text-black pl-8 pt-5">
                    <ul className="list-decimal list-inside">
                      <li>各区域基本信息</li>
                      <li>区域伙伴</li>
                      <li>区域跑图一览</li>
                      <li className="list-none">.......</li>
                    </ul>
                  </div>
                </div>
                <div className="w-96 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain">
                  <div className="">2024/12/31</div>
                  <div className="w-full flex justify-center items-center h-16 text-center text-2xl text-white font-bold">舞萌背景介绍</div>
                  <div className="text-black pl-8 pt-5">
                    <ul className="list-decimal list-inside">
                      <li>区域背景介绍介绍</li>
                      <li>角色背景介绍</li>
                      <li className="list-none">.......</li>
                    </ul>
                  </div>
                </div>
                <div className="w-96 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain">
                  <div className="">2024/12/31</div>
                  <div className="w-full flex justify-center items-center h-16 text-center text-2xl text-white font-bold">资讯</div>
                  <div className="text-black pl-8 pt-5">
                    <ul className="list-decimal list-inside">
                      <li>国服舞萌最新资讯</li>
                      <li>最新最热资讯</li>
                      <li>未来更新爆料</li>
                      <li>联动资讯</li>
                      <li>机厅活动资讯</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Update News Display */}
          <div className="w-[1200px]  mx-auto p-5">
            <div className="flex justify-center items-center text-center text-white font-bold text-3xl mb-10" style={textstroke}>
              舞萌相关资讯
            </div>
            {/* First row */}
            <div className="flex flex-row justify-center items-center space-x-4 mb-6">
              {news1.length === 0 ?
                <>
                  <Link href={'/'} className="w-96 h-48 bg-[url('/img/news/sample.png')] bg-no-repeat bg-contain hover:cursor-pointer"></Link>
                  <Link href={'/'} className="w-96 h-48 bg-[url('/img/news/sample.png')] bg-no-repeat bg-contain hover:cursor-pointer"></Link>
                  <Link href={'/'} className="w-96 h-48 bg-[url('/img/news/sample.png')] bg-no-repeat bg-contain hover:cursor-pointer"></Link>
                </> :
                <>
                  {news1.map((news, index) => (
                    <>
                      <div key={index} className="w-[540px] h-72 p-2 bg-blue-500 bg-no-repeat bg-contain shadow-lg hover:cursor-pointer rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out">
                        <h1 className="w-96 h-12 py-2 px-1 font-bold text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">{news.title}</h1>
                        <a href={'/'} >
                          <img referrerPolicy="no-referrer" className="w-[450px] h-52 object-cover border-4 border-white" src={news.image_url} />
                        </a>
                      </div>
                    </>
                  ))}
                </>}
            </div>
            <div className="flex flex-row justify-center items-center space-x-4">
              {news1.length === 0 ?
                <>
                  <Link href={'/'} className="w-96 h-48 bg-[url('/img/news/sample.png')] bg-no-repeat bg-contain hover:cursor-pointer"></Link>
                  <Link href={'/'} className="w-96 h-48 bg-[url('/img/news/sample.png')] bg-no-repeat bg-contain hover:cursor-pointer"></Link>
                  <Link href={'/'} className="w-96 h-48 bg-[url('/img/news/sample.png')] bg-no-repeat bg-contain hover:cursor-pointer"></Link>
                </> :
                <>
                  {news2.map((news, index) => (
                    <>
                      <div key={index} className="w-[540px] h-72 p-2 bg-blue-500 bg-no-repeat bg-contain shadow-lg hover:cursor-pointer rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out">
                        <h1 className="w-96 h-12 py-2 px-1 font-bold text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">{news.title}</h1>
                        <a href={'/'} >
                          <img referrerPolicy="no-referrer" className="w-[450px] h-52 object-cover border-4 border-white" src={news.image_url} />
                        </a>
                      </div>
                    </>
                  ))}
                </>}
            </div>
            <div className="w-full flex justify-end mt-2">
              <a href="" className=" text-xl text-white font-bold hover:border-b-4 border-purple-500 hover:scale-105 transition-all duration-300 ease-in-out" style={textstroke}>查看更多{">"}{">"}</a>
            </div>
          </div>

          {/* Search Music */}
          <div className="relative w-[900px] mx-auto mb-32 mt-16 flex flex-col justify-center items-center shadow-xl">
            <div className="border-4 border-white rounded-2xl">
              <div className=" w-[900px] h-80 bg-white rounded-2xl flex flex-col justify-center items-center text-center border-4 border-[rgb(155,244,236)]">
                <div className="absolute -top-4 w-48 h-20 text-3xl font-bold text-white" style={textstroke}>
                  Music
                </div>
                <div className="flex flex-row justify-center items-center space-x-4 mb-4">
                  <div className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
                    <div className="w-44 h-16 border-4 border-[#802323] rounded-full bg-[rgb(255,70,70)] flex justify-center items-center font-bold">
                      Maimai
                    </div>
                  </div>ƒ
                  <div className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
                    <div className="w-44 h-16 border-4 border-[rgb(0,108,196)] rounded-full bg-[rgb(69,197,255)] flex justify-center items-center font-bold">
                      Vocal
                    </div>
                  </div>
                  <div className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
                    <div className="w-44 h-16 border-4 border-[#7f2bb6] rounded-full bg-[rgb(159,54,227)] flex justify-center items-center font-bold">
                      东方
                    </div>
                  </div>
                  <div className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
                    <div className="w-44 h-16 border-4 border-[#b38c00] rounded-full bg-[rgb(255,200,0)] flex justify-center items-center font-bold">
                      Pop&Animate
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-center items-center space-x-4 mb-4">
                  <div className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
                    <div className="w-44 h-16 border-4 border-[#62b942] rounded-full bg-[rgb(122,231,83)] flex justify-center items-center font-bold">
                      Game
                    </div>
                  </div>ƒ
                  <div className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
                    <div className="w-44 h-16 border-4 border-[rgb(0,108,196)] rounded-full bg-[rgb(48,157,248)] flex justify-center items-center font-bold">
                      CHUNITHM
                    </div>
                  </div>
                  <div className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
                    <div className="w-44 h-16 border-4 border-[rgb(179,46,121)] rounded-full bg-[rgb(220,56,184)] flex justify-center items-center font-bold">
                      宴！
                    </div>
                  </div>
                  <div className=" border-4 border-white bg-[rgb(69,197,255)] rounded-full  shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out text-stroke text-stroke-2 text-white">
                    <div className="w-44 h-16 border-4 border-[rgb(247,126,161)] rounded-full bg-white flex justify-center items-center font-bold text-[rgb(255,199,219)]">
                      最近更新
                    </div>
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
          </div>

          {/* Search Game Center */}
          <div className="relative mb-32 w-[800px] h-64 mx-auto flex flex-col justify-center items-center space-y-5 rounded-2xl overflow-visible shadow-xl">
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
            <div className="absolute z-[1000] h-full w-full flex items-center justify-center bg-black bg-opacity-50">
              <h1 className="text-xl font-bold tracking-wide">请等待接口开放</h1>
            </div>
          </div>

          {/* Map Play display */}
          <div className="relative w-[900px] h-[500px] bg-white mx-auto flex flex-col justify-center items-center rounded-2xl border-4 border-[#41e7d7] shadow-xl">
            <div className="absolute -top-5 flex justify-center items-center text-white font-bold text-2xl" style={textstroke}>全国出勤行脚图 </div>
            <div className="w-[800px] h-[450px] p-5 ">
              <ChinaMap />
            </div>
          </div>
          <div className="w-[900px] mt-2 h-20 flex mx-auto justify-center items-center space-x-4 text-white font-bold text-2xl">
            <div className="border-4 border-white rounded-full hover:scale-105 transition-all duration-300 ease-in-out">
              <div className="relative p-5 rounded-full bg-[#41e7d7] border-4 border-[#2ea297]">
                <button>全国玩家行脚图<br></br><b className="absolute w-full left-0  bottom-0 text-lg text-red-500">数据不足，暂无法使用</b></button>
              </div>
            </div>
            <div className="border-4 border-white rounded-full hover:scale-105 transition-all duration-300 ease-in-out">
              <div className="p-5 rounded-full bg-[rgb(48,182,244)] border-4 border-[#2692c3]">
                <button>个人玩家行脚图</button>
              </div>
            </div>
          </div>

          {/* thanks */}
          <div className="mt-10 w-full flex flex-col justify-center items-center h-64 bg-[url('/img/bg_pc.png')]  bg-contain text-center">
            <div className="w-28 h-12 text-2xl text-black font-bold">
              鸣谢
            </div>
            {/* First row */}
            <div className="mb-5 flex flex-row space-x-5">
              <a href="https://chinese-font.netlify.app/zh-cn/">
                <div className="w-48 h-16 bg-white text-2xl bg-[url('/img/thanks/WebChineseFontsPlan.png')] bg-no-repeat bg-contain"></div>
              </a>
              <a href="https://turou.fun">
                <div className="w-48 h-16 bg-white text-2xl bg-[url('/img/thanks/UsaginoNiku.png')] bg-no-repeat bg-contain bg-center"></div>
              </a>
              <a href="https://maimai.turou.fun">
                <div className="w-48 h-16 bg-white text-2xl bg-[url('/img/thanks/MaimaiPy.png')] bg-no-repeat bg-contain bg-center"></div>
              </a>
              <div className="w-48 h-16 bg-white"></div>
            </div>
            {/* Second row */}
            <div className="flex flex-row space-x-5">
              <div className="w-48 h-16 bg-white"></div>
              <div className="w-48 h-16 bg-white"></div>
              <div className="w-48 h-16 bg-white"></div>
              <div className="w-48 h-16 bg-white"></div>
            </div>
            <div className="text-black my-2">
              © 2024 Salt House. All rights reserved.
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

