'use client'

import Link from "next/link"
import { SetStateAction, useEffect, useState } from "react";
import ChinaMap from "./components/ChinaMap";
import { FiChevronRight } from "react-icons/fi";
import NewsCard from "./components/NewsCard";
import SearchGameCenter from "./components/SearchGameCenter";
import Guide from "./components/Guide";
import { Step } from "react-joyride";
import TokenChecker from "./hooks/TokenChecker";

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
  const [news3, setNews3] = useState<NewsProps[]>([])
  const [token, setToken] = useState<string>("")
  const textstroke = {
    textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)'
  };

  const steps: Step[] = [
    {
      target: '#music',
      content: '点击这里可以查看乐曲信息（包括成绩），铺面确认，乐曲播放等功能',
      disableBeacon: true
    },
    {
      target: '#region',
      content: '点击这里可以查看舞萌区域信息，区域伙伴，区域跑图等功能',
    },
    {
      target: '#tool',
      content: '点击这里可以查看舞萌工具，卷王工具，成绩工具等功能',
    },
    {
      target: '#funDetail',
      content: '这里可以查看我们已完成的功能和正在开发中的功能',
    },
    {
      target: '#news',
      content: '在这里可以查看最新的舞萌资讯',
    },
    {
      target: '#searchGameCenter',
      content: '在这里可以搜索机厅信息',
    },
    {
      target: '#playmap',
      content: '在这里可以查看全国行脚图，点亮你的行脚地图！',
    },
    {
      target: '#user',
      content: '点击这里可以登录或注册账号，进入用户页面（不要问为什么是牛奶）',
      disableScrolling: false,
    },
    {
      target: '#musicPlayer',
      content: '全局舞萌音乐播放器,点击乐曲封面可以最小化播放器',
      disableScrolling: false,
    }
  ];

  const getNews = async (limit: number, offset: number): Promise<NewsProps[]> => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    try {
      const response = await fetch(`https://dev.maimai.moe/api/maimai/maiweb/news?limit=${limit}&offset=${offset}`, requestOptions);
      const result = await response.text();
      const data = JSON.parse(result);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  useEffect(() => {
    const now = new Date();
    const hours = now.getUTCHours() + 8; // Convert to East 8th timezone
    if (hours >= 22 && hours < 23) {
      alert("晚上好，夜深了，注意休息哦！");
    }
    getNews(3, 0).then(data => setNews1(data));
    getNews(3, 3).then(data => setNews2(data));
    getNews(6, 0).then(data => setNews3(data));
    setToken(localStorage.getItem('token') || '');
    if (localStorage.getItem('token') == '0') {
      localStorage.removeItem('token');
    }
  }, []);



  useEffect(() => {
    const news = JSON.stringify(news3)
    localStorage.setItem('mainews', news);
  }, [news3]);



  return (
    <>
      <div className="w-full overflow-hidden">
        {/* Main Layer */}
        <div className="relative w-full max-sm:w-[420px]">
          {/* 使用抽离的 Guide 组件 */}
          <Guide steps={steps} autoStart={true} mark={"hometour"} />
          {/* Control */}

          <div className="max-sm:h-[40px] w-[200px] h-[100px]"></div>
          <div className="mx-auto w-44 h-12 font-bold text-xl text-center">
            
            {token == "" ? <div> 🔴无登陆状态</div> : <TokenChecker token={token} />}
          </div>
          {/* Welcome to Home page */}
          <div id="funDetail" className=" flex flex-col justify-center items-center max-sm:w-[420px]">
            <div className="w-full max-w-[420px] sm:max-w-[900px] mx-auto px-4 sm:px-0 max-sm:text-2xl sm:text-4xl text-center font-bold text-white bg-clip-text text-transparent"
              style={textstroke}>
              Welcome to maimai.moe in China!!!<br></br>
              本站点提供以下服务功能<br></br>
              <img src="/img/handblue.png" className="h-8 sm:h-14 inline-block animate-bounce" alt="" />
              <img src="/img/handpink.png" className="h-8 sm:h-14 inline-block animate-bounce" alt="" />
            </div>
            {/* 桌面端 */}
            <div className="w-[900px] max-sm:hidden  mt-10 ">
              <div className="flex flex-row justify-center items-center space-x-4">
                <div className="w-96 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain">
                  <div className="text-white pl-4">完成开发</div>
                  <div className="w-full flex justify-center items-center h-16 text-center text-2xl text-white font-bold">全国行脚</div>
                  <div className="text-black pl-8 pt-5">提供统计全国各省份出勤行脚图，大家一起点亮地图吧！✅ </div>
                </div>
                <div className="w-96 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain">
                  <div className="text-white pl-4">部分完成</div>
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
                  <div className="text-white pl-4">缺少数据</div>
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
                  <div className="text-white pl-6">开发中</div>
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
                  <div className="text-white pl-5">优化中</div>
                  <div className="w-full flex justify-center items-center h-16 text-center text-2xl text-white font-bold">舞萌成绩工具</div>
                  <div className="text-black pl-8 pt-5">
                    <ul className="list-decimal list-inside">
                      <li>水鱼、落雪绑定✅</li>
                      <li>机台绑定✅</li>
                      <li>B50查询✅</li>
                      <li>歌曲成绩查询✅</li>
                    </ul>
                  </div>
                </div>
                <div className="w-96 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain">
                  <div className="text-white pl-4">部分完成</div>
                  <div className="w-full flex justify-center items-center h-16 text-center text-2xl text-white font-bold">资讯</div>
                  <div className="text-black pl-8 pt-5">
                    <ul className="list-decimal list-inside">
                      <li>国服舞萌最新资讯</li>
                      <li>最新最热资讯✅ </li>
                      <li>未来更新爆料</li>
                      <li>联动资讯</li>
                      <li>机厅活动资讯</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* 移动端 */}
            <div className="w-full max-w-[900px] sm:hidden max-sm:w-[420px] mt-5 sm:mt-10 px-4 sm:px-0 mx-auto">
              <div className="relative">
                <div className="max-sm:overflow-x-auto pl-10 max-sm:scroll-smooth max-sm:snap-x max-sm:snap-mandatory">
                  <div className="flex max-sm:w-max sm:flex-row sm:flex-wrap justify-start sm:justify-center items-center gap-4">
                    {/* 全国行脚卡片 */}
                    <div className="w-80 sm:w-96 flex-shrink-0 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain snap-center transform hover:scale-105 transition-all duration-300">
                      <div className="text-white pl-4">完成开发</div>
                      <div className="w-full flex justify-center items-center h-16 text-center text-xl sm:text-2xl text-white font-bold">全国行脚</div>
                      <div className="text-black pl-8 pt-5">提供统计全国各省份出勤行脚图，大家一起点亮地图吧！✅ </div>
                    </div>

                    {/* 乐曲工具卡片 */}
                    <div className="w-80 sm:w-96 flex-shrink-0 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain snap-center transform hover:scale-105 transition-all duration-300">
                      <div className="text-white pl-4">部分完成</div>
                      <div className="w-full flex justify-center items-center h-16 text-center text-xl sm:text-2xl text-white font-bold">乐曲工具</div>
                      <div className="text-black pl-8 pt-5">
                        <ul className="list-decimal list-inside">
                          <li>基础乐曲信息查询✅ </li>
                          <li>快速且便捷的铺面确认</li>
                          <li>支持别名查询✅ </li>
                          <li className="list-none">.......</li>
                        </ul>
                      </div>
                    </div>

                    <div className="w-80 sm:w-96 flex-shrink-0 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain snap-center transform hover:scale-105 transition-all duration-300">
                      {/* 卷王工具内容 */}
                      <div className="text-white pl-4">缺少数据</div>
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

                    <div className="w-80 sm:w-96 flex-shrink-0 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain snap-center transform hover:scale-105 transition-all duration-300">
                      {/* 舞萌区域工具内容 */}
                      <div className="text-white pl-6">开发中</div>
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

                    <div className="w-80 sm:w-96 flex-shrink-0 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain snap-center transform hover:scale-105 transition-all duration-300">
                      {/* 舞萌成绩工具内容 */}
                      <div className="text-white pl-5">优化中</div>
                      <div className="w-full flex justify-center items-center h-16 text-center text-2xl text-white font-bold">舞萌成绩工具</div>
                      <div className="text-black pl-8 pt-5">
                        <ul className="list-decimal list-inside">
                          <li>水鱼、落雪绑定✅</li>
                          <li>机台绑定✅</li>
                          <li>B50查询✅</li>
                          <li>歌曲成绩查询✅</li>
                        </ul>
                      </div>
                    </div>

                    <div className="w-80 sm:w-96 flex-shrink-0 h-72 p-1 bg-[url('/img/news_bg.png')] bg-no-repeat bg-contain snap-center transform hover:scale-105 transition-all duration-300">
                      {/* 资讯内容 */}
                      <div className="text-white pl-4">部分完成</div>
                      <div className="w-full flex justify-center items-center h-16 text-center text-2xl text-white font-bold">资讯</div>
                      <div className="text-black pl-8 pt-5">
                        <ul className="list-decimal list-inside">
                          <li>国服舞萌最新资讯</li>
                          <li>最新最热资讯✅</li>
                          <li>未来更新爆料</li>
                          <li>联动资讯</li>
                          <li>机厅活动资讯</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 滑动指示器 - 仅在移动端显示 */}
                <div className="sm:hidden w-full flex flex-col items-center gap-2 mt-4">
                  <div className="flex items-center gap-2">
                    <FiChevronRight className="text-purple-500 text-2xl animate-pulse" />
                    <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500 rounded-full animate-shimmer" />
                    <FiChevronRight className="text-purple-500 text-2xl animate-pulse" />
                  </div>
                  <span className="text-sm font-medium text-purple-400 animate-bounce">
                    向右滑动查看更多
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* News */}
          <div id="news" className="w-full max-w-[420px] sm:max-w-[1200px] mx-auto px-4 sm:px-5 text-white mb-8">
            <div className="flex justify-center items-center text-center text-white font-bold text-3xl mb-10" style={textstroke}>
              — 舞萌相关资讯 —
            </div>
            <div className="flex flex-col space-y-6">
              {/* First row */}
              <div className="flex flex-col sm:flex-row justify-center items-center max-sm:space-y-4 sm:space-x-4">
                {news1.length === 0 ? (
                  <></>
                ) : (
                  <>
                    {news1.map((news, index) => (
                      <NewsCard
                        key={index}
                        title={news.title}
                        content={news.content}
                        image_url={news.image_url}
                        source={news.source}
                        source_url={news.source_url}
                        source_author={news.source_author}
                        source_created_at={news.source_created_at}
                        size="sm"
                      />
                    ))}
                  </>
                )}
              </div>

              {/* Second row */}
              <div className="flex flex-col max-sm:hidden sm:flex-row justify-center items-center max-sm:space-y-4 sm:space-x-4">
                {news2.length === 0 ? (
                  <></>
                ) : (
                  <>
                    {news2.map((news, index) => (
                      <NewsCard
                        key={index}
                        title={news.title}
                        content={news.content}
                        image_url={news.image_url}
                        source={news.source}
                        source_url={news.source_url}
                        source_author={news.source_author}
                        source_created_at={news.source_created_at}
                        size="sm"
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
            <div className="w-full flex justify-end mt-2">
              <Link href={'/tool/news'} className="text-xl text-white font-bold hover:border-b-4 border-purple-500 hover:scale-105 transition-all duration-300 ease-in-out" style={textstroke}>查看更多{">"}{">"}</Link>
            </div>
          </div>

          {/* 使用独立的SearchGameCenter组件 */}
          <SearchGameCenter />

          {/* Map Play display */}
          <div id="playmap" className="relative w-full max-sm:w-[390px] sm:w-[900px] h-[400px] sm:h-[480px] bg-white mx-auto flex flex-col justify-center items-center rounded-2xl border-4 border-[#41e7d7] shadow-xl">
            <div className="absolute -top-5 flex justify-center items-center text-white font-bold text-xl sm:text-2xl" style={textstroke}>
              全国出勤行脚图
            </div>
            <div className="w-full sm:w-[800px] h-[350px] sm:h-[450px] p-3 sm:p-5">
              {token == '' ? (
                <div className="w-full h-full flex justify-center items-center">
                  <h1 className="text-lg sm:text-xl font-bold tracking-wide">请登录查看</h1>
                </div>
              ) : (
                <ChinaMap />
              )}
            </div>
          </div>
          <div className="w-[900px] max-sm:mt-5 max-sm:w-[420px] mt-2 h-20 flex mx-auto justify-center items-center space-x-4 text-white font-bold max-sm:text-xl text-2xl">
            <div className="border-4 border-white rounded-full hover:scale-105 transition-all duration-300 ease-in-out">
              <div className="relative p-5 rounded-full bg-[#41e7d7] border-4 border-[#2ea297]">
                <button>全国玩家行脚图<br></br><b className="absolute w-full left-0 bottom-0 text-lg text-red-500">数据不足，暂无法使用</b></button>
              </div>
            </div>
            <div className="border-4 border-white rounded-full hover:scale-105 transition-all duration-300 ease-in-out">
              <div className="p-5 rounded-full bg-[rgb(48,182,244)] border-4 border-[#2692c3]">
                <button>个人玩家行脚图</button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </>
  )
}




