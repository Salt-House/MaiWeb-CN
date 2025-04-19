import { useEffect, useState } from 'react'
import { Song, getDifficultyColor, SongScoreProps, ChartType } from "../songModel"
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import LoadingSpinner from '@/app/components/LoadingSpinner'


export default function ScoreDetail({ song, scores }: { song: Song, scores?: SongScoreProps[] }) {
  const [loading, setLoading] = useState(true)
  const [scoreData, setScoreData] = useState<SongScoreProps[]>([])
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false)

  useEffect(() => {
    // 重置状态，避免切换歌曲时显示上一首歌的数据
    setLoading(true)
    setHasAttemptedLoad(false)

    if (scores && scores.length > 0) {
      setScoreData(scores)
      setLoading(false)
      setHasAttemptedLoad(true)
      return
    }

    // 如果没有传入scores，则尝试从API获取
    const fetchScores = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        setLoading(false)
        setHasAttemptedLoad(true)
        return
      }

      try {
        const response = await fetch(
          `https://dev.maimai.moe/api/maimai/maiweb/scores?song_id=${song.id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (data.scores && Array.isArray(data.scores)) {
          setScoreData(data.scores)
        }
      } catch (e) {
        console.error("获取成绩数据失败:", e)
      } finally {
        setLoading(false)
        setHasAttemptedLoad(true)
      }
    }

    fetchScores()
  }, [song.id, scores])

  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    return <div className="text-center py-4">登录以查看个人乐曲成绩</div>
  }

  if (loading && !hasAttemptedLoad) {
    return (
      <div className="text-center py-4">
        <LoadingSpinner size="ultrasm" message="加载成绩中..." />
      </div>
    )
  }

  if ((!scoreData || scoreData.length === 0) && hasAttemptedLoad) {
    return <div className="text-center py-12">暂无该歌曲的分数数据，快去打一把吧！</div>
  }

  // 按照类型分组
  const standardScores = scoreData.filter((score: any) => score.type === 'standard');
  const dxScores = scoreData.filter((score: any) => score.type === 'dx');
  const utageScores = scoreData.filter((score: any) => score.type === 'utage');

  return (
    <div className='mx-6'>
      {/* 标准谱面成绩 */}
      {standardScores.length > 0 && (
        <ScoreSection
          title="标准"
          scores={standardScores}
          bgColor="bg-blue-500"
          chartType="standard"
          needBottomBorder={dxScores.length > 0}
        />
      )}

      {/* DX谱面成绩 */}
      {dxScores.length > 0 && (
        <ScoreSection
          title="DX"
          scores={dxScores}
          bgColor="bg-orange-500"
          chartType="dx"
          needBottomBorder={false}
        />
      )}

      {/* 宴会场谱面成绩 */}
      {/* {utageScores.length > 0 && (
        <ScoreSection
          title="宴会场"
          scores={utageScores}
          bgColor="bg-[rgb(220,56,184)]"
          chartType="utage"
        />
      )} */}
    </div>
  )
}

// 成绩区块组件
function ScoreSection({ title, scores, bgColor, chartType, needBottomBorder }: {
  title: string,
  scores: any[],
  bgColor: string,
  chartType: string,
  needBottomBorder: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 按照level_index排序，从小到大
  const sortedScores = [...scores].sort((a, b) => a.level_index - b.level_index);

  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <span className={`w-16 text-sm text-white ${bgColor} rounded-full py-1 text-center`}>{title}</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors text-black"
          aria-label={isExpanded ? "收起" : "展开"}
        >
          {isExpanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
        </button>
      </div>
      {isExpanded && (
        <div className="space-y-4 mx-2">
          {sortedScores.map((score: any, index: number) => (
            <div key={index} className={`flex items-start ${index === sortedScores.length - 1 ? (needBottomBorder ? 'border-b-2 pb-4 mb-8' : 'pb-4 mb-4') : 'border-b-2 pb-4 mb-4'}`}>
              {/* 难度方块 */}
              <div className="mr-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white border-4 border-[rgb(155,244,236)]"
                  style={{
                    backgroundColor: getDifficultyColor(score.level_index)
                  }}
                >
                  {score.level}
                </div>
              </div>

              {/* 成绩信息 */}
              <div className="flex-1">
                <div className="grid max-sm:grid-cols-1 grid-cols-3 gap-4 max-sm:gap-2 max-sm:pl-2 pl-8 mx-4 max-sm:mx-1">
                  {/* 成绩和评级 */}
                  <div className="flex items-center space-x-3 justify-center">
                    {getRateImage(score.achievements) ? (
                      <img src={getRateImage(score.achievements)!} alt={getRateText(score.achievements)} className="max-sm:h-8 h-10" />
                    ) : (
                      <div className="max-sm:text-base text-lg font-medium">{getRateText(score.achievements)}</div>
                    )}
                    <p className="max-sm:text-base text-lg font-semibold text-black">{score.achievements ? `${score.achievements.toFixed(4)}%` : "暂无成绩"}</p>
                  </div>

                  {/* FC FDX */}
                  <div className="flex items-center justify-center space-x-4 max-sm:py-2">
                    {getFCImage(score.fc) ? (
                      <div className='max-sm:size-10 size-12 bg-no-repeat bg-center max-sm:bg-[length:45px_45px] bg-[length:55px_55px]' style={{ backgroundImage: `url(${getFCImage(score.fc)})` }}></div>
                    ) : (
                      <div className='max-sm:size-8 size-10 rounded-full bg-gray-400'></div>
                    )}

                    {getFSImage(score.fs) ? (
                      <div className='max-sm:size-10 size-12 bg-no-repeat bg-center max-sm:bg-[length:45px_45px] bg-[length:55px_55px]' style={{ backgroundImage: `url(${getFSImage(score.fs)})` }}></div>
                    ) : (
                      <div className='max-sm:size-8 size-10 rounded-full bg-gray-400'></div>
                    )}
                  </div>

                  {/* DX分数和DX Rating */}
                  <div className="text-center text-black">
                    <p className="font-medium max-sm:text-sm">DX分数: {score.dx_score || "暂无"}</p>
                    <p className="font-medium max-sm:text-sm">DX Rating: {score.dx_rating || "暂无"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 根据rate值返回对应的评级图片路径
function getRateImage(achievements: number | null): string | null {
  if (achievements === null) return null;
  switch (true) {
    case achievements >= 100.5:
      return '/img/grade/sssp.webp';
    case achievements >= 100:
      return '/img/grade/sss.webp';
    case achievements >= 99.5:
      return '/img/grade/ssp.webp';
    case achievements >= 99:
      return '/img/grade/ss.webp';
    case achievements >= 98:
      return '/img/grade/sp.webp';
    case achievements >= 97:
      return '/img/grade/s.webp';
    case achievements >= 94:
      return '/img/grade/aaa.webp';
    case achievements >= 90:
      return '/img/grade/aa.webp';
    case achievements >= 80:
      return '/img/grade/a.webp';
    case achievements >= 75:
      return '/img/grade/bbb.webp';
    case achievements >= 70:
      return '/img/grade/bb.webp';
    case achievements >= 60:
      return '/img/grade/b.webp';
    case achievements >= 50:
      return '/img/grade/c.webp';
    case achievements >= 0:
      return '/img/grade/d.webp';
    default:
      return null;
  }
}

// 根据rate值返回对应的评级文本
function getRateText(achievements: number | null): string {
  if (achievements === null) return "无评级";
  switch (true) {
    case achievements >= 100.5:
      return "SSS+";
    case achievements >= 100:
      return "SSS";
    case achievements >= 99.5:
      return "SS+";
    case achievements >= 99:
      return "SS";
    case achievements >= 98:
      return "S+";
    case achievements >= 97:
      return "S";
    case achievements >= 94:
      return "AAA";
    case achievements >= 90:
      return "AA";
    case achievements >= 80:
      return "A";
    case achievements >= 75:
      return "BBB";
    case achievements >= 70:
      return "BB";
    case achievements >= 60:
      return "B";
    case achievements >= 50:
      return "C";
    case achievements >= 0:
      return "D";
  }
  return "未知";
}

// 根据fc值返回对应的图片路径
function getFCImage(fc: number | null): string | null {
  if (fc === null) return null;
  const fcImageMap: { [key: number]: string } = {
    0: '/img/grade/app.webp',
    1: '/img/grade/ap.webp',
    2: '/img/grade/fcp.webp',
    3: '/img/grade/fc.webp',
  };
  return fcImageMap[fc] || null;
}

// 根据fs值返回对应的图片路径
function getFSImage(fs: number | null): string | null {
  if (fs === null) return null;
  const fsImageMap: { [key: number]: string } = {
    0: '/img/grade/sync.webp',
    1: '/img/grade/fs.webp',
    2: '/img/grade/fsp.webp',
    3: '/img/grade/fsd.webp',
    4: '/img/grade/fsdp.webp',
  };
  return fsImageMap[fs] || null;
}

// 根据fc值返回对应的文本
function getFCText(fc: number | null): string {
  if (fc === null) return "无FC";
  const fcMap: { [key: number]: string } = {
    0: "AP+",
    1: "AP",
    2: "FC+",
    3: "FC",
  };
  return fcMap[fc] || "未知";
}

// 根据fc值返回对应的颜色类名
function getFCColor(fc: number | null): string {
  if (fc === null) return "text-gray-500";
  const fcColorMap: { [key: number]: string } = {
    0: "text-yellow-600",
    1: "text-yellow-600",
    2: "text-green-500",
    3: "text-green-600",
  };
  return fcColorMap[fc] || "text-gray-500";
}

// 根据fs值返回对应的文本
function getFSText(fs: number | null): string {
  if (fs === null) return "无FS";
  const fsMap: { [key: number]: string } = {
    0: "SYNC PLAY",
    1: "FS",
    2: "FS+",
    3: "FDX",
    4: "FDX+",
  };
  return fsMap[fs] || "未知";
}

// 根据fs值返回对应的颜色类名
function getFSColor(fs: number | null): string {
  if (fs === null) return "text-gray-500";
  const fsColorMap: { [key: number]: string } = {
    0: "text-blue-500",
    1: "text-blue-500",
    2: "text-blue-500",
    3: "text-yellow-500",
    4: "text-yellow-500",
  };
  return fsColorMap[fs] || "text-gray-500";
}
