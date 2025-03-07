import { useEffect, useState } from 'react'
import { Song, getDifficultyColor, SongScoreProps, ChartType } from "../songModel"
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'


export default function ScoreDetail({ song }: { song: Song }) {
  const [scoreData, setScoreData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 从localStorage获取分数数据
    const storedScores = localStorage.getItem('scores')
    if (storedScores) {
      try {
        const scoresData = JSON.parse(storedScores)
        console.log("解析分数数据成功:", scoresData)
        // 根据歌曲ID查找对应的所有难度分数数据
        console.log("歌曲ID:", song.id)
        const songScores = scoresData.filter((item: any) => item.song_id === song.id)
        setScoreData(songScores)
        console.log("找到分数了：", songScores)
      } catch (e) {
        console.error("解析分数数据失败:", e)
      }
    }
    setLoading(false)
  }, [song.id])

  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    return <div className="text-center py-4">登录以查看个人乐曲成绩</div>
  }

  if (loading) {
    return <div className="text-center py-4">加载中...</div>
  }

  if (!scoreData || scoreData.length === 0) {
    return <div className="text-center py-4">暂无该歌曲的分数数据</div>
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

  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <span className={`w-16 text-sm text-white ${bgColor} rounded-full py-1 text-center`}>{title}</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label={isExpanded ? "收起" : "展开"}
        >
          {isExpanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
        </button>
      </div>
      {isExpanded && (
        <div className="space-y-4 mx-2">
          {scores.map((score: any, index: number) => (
            <div key={index} className={`flex items-start ${index === scores.length - 1 ? (needBottomBorder ? 'border-b-2 pb-4 mb-8' : 'pb-4 mb-4') : 'border-b-2 pb-4 mb-4'}`}>
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
                <div className="grid grid-cols-3 gap-4">
                  {/* 成绩和评级 */}
                  <div>
                    <p className="text-lg font-semibold">{score.achievements ? `${score.achievements.toFixed(4)}%` : "暂无成绩"}</p>
                    <p className="text-sm">{getRateText(score.achievements)}</p>
                  </div>

                  {/* 全连和全同步 */}
                  <div>
                    <p className="font-medium">
                      <span className={getFCColor(score.fc)}>
                        {getFCText(score.fc)}
                      </span>
                    </p>
                    <p className="font-medium">
                      <span className={getFSColor(score.fs)}>
                        {getFSText(score.fs)}
                      </span>
                    </p>
                  </div>

                  {/* DX分数和DX Rating */}
                  <div>
                    <p className="font-medium">DX分数: {score.dx_score || "暂无"}</p>
                    <p className="font-medium">DX Rating: {score.dx_rating || "暂无"}</p>
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