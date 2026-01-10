"use client"

import Button from "@/components/ui/button/Button"
import Guide from "@/components/common/Guide"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { ShareableImageSub } from "@/components/common/ShareableImage"
import { UserProfile } from "@/types/user"
import { useCallback, useEffect, useState } from "react"
import { Step } from "react-joyride"
import { CONFIG } from "@/config/api"

// 定义MusicGradeProps接口
interface MusicGradeProps {
  id: number
  title: string
  level: string
  level_index: number
  level_value: number
  achievements: number | string
  fc: number | null
  fs: number
  dx_score: number
  dx_rating: number
  rate: number
  type: string
}

interface ThirdAccount {
  server: string
  nickname: string
  identifier: string
  from: string
}

export default function BestPage() {
  const [best35, setBest35] = useState<MusicGradeProps[]>([])
  const [best15, setBest15] = useState<MusicGradeProps[]>([])
  const [rating35, setRating35] = useState<number>(0)
  const [rating15, setRating15] = useState<number>(0)
  const [token, setToken] = useState<string | null>()
  const [nowFrom, setNowFrom] = useState<string | null>("暂无可用数据源")
  const [accounts, setAccounts] = useState<ThirdAccount[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [user, setUser] = useState<UserProfile>()
  const [buttonStatus, setButtonStatus] = useState<boolean>(false)

  const textstroke = {
    textShadow:
      "-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)",
  }
  const GetBest50 = useCallback(
    (fromOverride?: string, accountsOverride?: ThirdAccount[]) => {
      // TODO 性能：对长列表的渲染进行虚拟化；对数据处理使用 `useMemo` 缓存
      setIsLoading(true)
      const targetFrom = fromOverride ?? nowFrom
      const targetAccounts = accountsOverride ?? accounts

      let nickname = ""
      if (targetFrom === "divingfish") {
        for (let i = 0; i < targetAccounts.length; i++) {
          if (targetAccounts[i].from === "divingfish") {
            nickname = targetAccounts[i].identifier
          }
        }
        const myHeaders = new Headers()
        myHeaders.append("accept", "application/json")

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
        }
        let firstWord = ""
        const tmp = nickname.split(" ")

        if (tmp.length > 2) {
          firstWord = tmp.slice(0, tmp.length - 1).join(" ")
        } else {
          firstWord = tmp[0]
        }
        fetch(
          `${CONFIG.API.ENDPOINTS.API}/maimai/divingfish/bests?username=${firstWord}`,
          requestOptions
        )
          .then(response => response.text())
          .then(result => {
            localStorage.setItem("best", result)
            const data = JSON.parse(result)
            const b15: MusicGradeProps[] = []
            const b35: MusicGradeProps[] = []

            if (Array.isArray(data.scores_b15)) {
              data.scores_b15.forEach((song: any) => {
                b15.push({
                  id: Number(song.id),
                  title: song.title,
                  level: song.level,
                  level_index: song.level_index,
                  level_value: song.level_value,
                  achievements: song.achievements,
                  fc: song.fc,
                  fs: song.fs,
                  dx_score: song.dx_score,
                  dx_rating: song.dx_rating,
                  rate: song.rate,
                  type: song.type,
                })
              })
            }
            if (Array.isArray(data.scores_b35)) {
              data.scores_b35.forEach((song: any) => {
                b35.push({
                  id: Number(song.id),
                  title: song.title,
                  level: song.level,
                  level_index: song.level_index,
                  level_value: song.level_value,
                  achievements: song.achievements,
                  fc: song.fc,
                  fs: song.fs,
                  dx_score: song.dx_score,
                  dx_rating: song.dx_rating,
                  rate: song.rate,
                  type: song.type,
                })
              })
            }
            // TODO 日志：移除
            console.log(data)
            setBest35(b35)
            setBest15(b15)
            setRating15(Math.ceil(data.rating_b15))
            setRating35(Math.ceil(data.rating_b35))
            setIsLoading(false)
          })
          .catch(error => {
            console.error(error)
            setIsLoading(false)
          })
      } else if (targetFrom === "lxns") {
        for (let i = 0; i < targetAccounts.length; i++) {
          if (targetAccounts[i].from === "lxns") {
            nickname = targetAccounts[i].identifier
          }
        }
        const myHeaders = new Headers()
        myHeaders.append("accept", "application/json")

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
        }

        fetch(`${CONFIG.API.ENDPOINTS.API}/maimai/lxns/bests?friend_code=${nickname}`, requestOptions)
          .then(response => response.text())
          .then(result => {
            localStorage.setItem("best", result)
            const data = JSON.parse(result)
            const b15: MusicGradeProps[] = []
            const b35: MusicGradeProps[] = []

            if (Array.isArray(data.scores_b15)) {
              data.scores_b15.forEach((song: any) => {
                b15.push({
                  id: Number(song.id),
                  title: song.title,
                  level: song.level,
                  level_index: song.level_index,
                  level_value: song.level_value,
                  achievements: song.achievements,
                  fc: song.fc,
                  fs: song.fs,
                  dx_score: song.dx_score,
                  dx_rating: song.dx_rating,
                  rate: song.rate,
                  type: song.type,
                })
              })
            }
            if (Array.isArray(data.scores_b35)) {
              data.scores_b35.forEach((song: any) => {
                b35.push({
                  id: Number(song.id),
                  title: song.title,
                  level: song.level,
                  level_index: song.level_index,
                  level_value: song.level_value,
                  achievements: song.achievements.split(".")[1],
                  fc: song.fc,
                  fs: song.fs,
                  dx_score: song.dx_score,
                  dx_rating: song.dx_rating,
                  rate: song.rate,
                  type: song.type,
                })
              })
            }
            // TODO 日志：移除
            console.log(data)
            setBest35(b35)
            setBest15(b15)
            setRating15(Math.ceil(data.rating_b15))
            setRating35(Math.ceil(data.rating_b35))
            setIsLoading(false)
          })
          .catch(error => {
            console.error(error)
            setIsLoading(false)
          })
      } else if (targetFrom === "maiweb") {
        // TODO 日志：移除
        console.log("开始从maiweb获取数据")
        const myHeaders = new Headers()
        myHeaders.append("Accept", "application/json")
        if (token) {
          myHeaders.append("Authorization", `Bearer ${token}`)
        }

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
        }
        // TODO 日志：移除
        console.log("发起请求")
        fetch(`${CONFIG.API.ENDPOINTS.API}/maimai/maiweb/bests`, requestOptions)
          .then(response => response.text())
          .then(result => {
            localStorage.setItem("best", result)
            const data = JSON.parse(result)
            const b15: MusicGradeProps[] = []
            const b35: MusicGradeProps[] = []

            // 检查data是否为数组并且有数据
            if (Array.isArray(data.scores_b15)) {
              data.scores_b15.forEach((song: any) => {
                b15.push({
                  id: Number(song.id),
                  title: song.title,
                  level: song.level,
                  level_index: song.level_index,
                  level_value: song.level_value,
                  achievements: song.achievements,
                  fc: song.fc,
                  fs: song.fs,
                  dx_score: song.dx_score,
                  dx_rating: song.dx_rating,
                  rate: song.rate,
                  type: song.type,
                })
              })
            }
            if (Array.isArray(data.scores_b35)) {
              data.scores_b35.forEach((song: any) => {
                b35.push({
                  id: Number(song.id),
                  title: song.title,
                  level: song.level,
                  level_index: song.level_index,
                  level_value: song.level_value,
                  achievements: song.achievements,
                  fc: song.fc,
                  fs: song.fs,
                  dx_score: song.dx_score,
                  dx_rating: song.dx_rating,
                  rate: song.rate,
                  type: song.type,
                })
              })
            }
            // TODO 日志：移除
            console.log(data)
            setBest35(b35)
            setBest15(b15)
            setRating15(Math.ceil(data.rating_b15))
            setRating35(Math.ceil(data.rating_b35))
            setIsLoading(false)
          })
          .catch(error => {
            console.error(error)
            setIsLoading(false)
          })
      }
    },
    [nowFrom, accounts, token]
  )

  const GetBindAccount = useCallback(
    (tokenOverride?: string) => {
      // TODO 类型：避免使用 any；将返回数据映射至强类型结构
      setIsLoading(true)
      const myHeaders = new Headers()
      myHeaders.append("accept", "application/json")
      const targetToken = tokenOverride ?? token
      myHeaders.append("Authorization", `Bearer ${targetToken}`)

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      }
      // TODO 日志：移除
      console.log("start fetch bind account")
      fetch(`${CONFIG.API.ENDPOINTS.API}/maimai/maiweb/accounts`, requestOptions)
        .then(response => response.text())
        .then(result => {
          // TODO 日志：移除
          console.log("get data")
          const data = JSON.parse(result)
          let updatedAccounts: ThirdAccount[] = []
          if (data.length > 0 && data[0].server) {
            updatedAccounts = data.map((account: any) => {
              let from = ""
              if (!isNaN(Number(account.identifier))) {
                from = "lxns"
              } else {
                if (account.identifier.length > 40) {
                  from = "maiweb"
                } else {
                  from = "divingfish"
                }
              }
              return {
                server: account.server,
                nickname: account.nickname,
                identifier: account.identifier,
                from: from,
              }
            })
            setAccounts(updatedAccounts)
            if (updatedAccounts.length > 0) {
              setNowFrom(updatedAccounts[0].from)
              GetBest50(updatedAccounts[0].from, updatedAccounts)
            }
          }
          console.log(data)
          setIsLoading(false)
        })
        .catch(error => {
          console.error(error)
          setIsLoading(false)
        })
    },
    [token, GetBest50]
  )
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      // TODO 网络：统一封装请求；移除多处 console.log；添加错误重试
      setTimeout(() => {
        GetBindAccount(storedToken)
      }, 0)
      const myHeaders = new Headers()
      myHeaders.append("Authorization", `Bearer ${storedToken}`)

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      }

      fetch(`${CONFIG.API.ENDPOINTS.API}/user/me`, requestOptions)
        .then(response => response.text())
        .then(result => {
          const data = JSON.parse(result)
          setUser(data)
          // TODO 日志：移除调试日志或上报到统一日志系统
          console.log(data)
        })
        .catch(error => console.log("error", error))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const steps: Step[] = [
    {
      target: "#b50control",
      content: "这里是B50查询控制面板",
      disableBeacon: true,
    },
    {
      target: "#b50",
      content: "这里会显示b50信息",
    },
  ]

  const ShareBest = useCallback(() => {
    setButtonStatus(true)
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")

    const raw = JSON.stringify({
      category: "b50",
      b35_songs: best35,
      "135_songs": best15,
      rating_b15: rating15,
      rating_b35: rating35,
      user: {
        username: user?.username,
        mai_play_name: user?.mai_player_name,
        mai_nameplate_id: (user?.mai_nameplate_id ?? 11).toString().padStart(6, "0") || 11,
        mai_icon_id: user?.mai_icon_id || 101,
        mai_trophy_id: user?.mai_trophy_id || 101,
        mai_frame_id: user?.mai_frame_id || 350051,
      },
    })
    console.log(raw)

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    }

    fetch(`${CONFIG.API.ENDPOINTS.EMAIL}/best-song-list`, requestOptions)
      .then(response => response.blob())
      .then(blob => {
        setButtonStatus(false)
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "best_song_list.png" // 下载的文件名
        a.click()
        URL.revokeObjectURL(url)
      })
      .catch(error => {
        console.log("error", error)
        setButtonStatus(false)
      })
  }, [best35, best15, rating15, rating35, user])

  return (
    <>
      <div className="relative w-full max-w-[1600px] p-5 flex flex-col justify-center items-center mx-auto">
        <Guide steps={steps} mark={"b50tour"} />

        <div className="mb-8 max-sm:w-full w-full max-w-[900px] space-y-4">
          {/* 标题区域 */}
          <h1 className="text-3xl font-bold text-center bg-clip-text text-white" style={textstroke}>
            Best 50 查询
          </h1>
          {/* 控制面板 */}
          <div
            id="b50control"
            className="bg-white/5 backdrop-blur-md rounded-2xl mx-auto p-5 shadow-xl border border-white/10"
          >
            {/* 数据源选择区域 */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <button
                onClick={() => GetBindAccount()}
                className="flex-shrink-0 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                刷新数据源
              </button>
              <div className="flex-1 flex flex-wrap gap-2 items-center bg-white/5 rounded-xl p-3">
                <span className="text-black/90 text-sm">可用数据源:</span>
                <div className="flex flex-wrap gap-2">
                  {accounts.map((account, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setNowFrom(account.from)
                        GetBest50(account.from)
                      }}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg 
                                                    ${
                                                      account.from === nowFrom
                                                        ? "bg-blue-500/90 text-white shadow-lg scale-105"
                                                        : "bg-white/10 text-black/80 hover:bg-white/20"
                                                    }`}
                    >
                      {account.from}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 状态栏 */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl">
                <span className="text-lg">{nowFrom === "暂无可用数据源" ? "🔴" : "🟢"}</span>
                <span className="text-white/90 text-sm">
                  当前数据源: <span className="font-medium ml-1">{nowFrom}</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => GetBest50()}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-500/80 to-teal-500/80 text-white text-sm font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  手动更新数据
                </button>
                <Button onClick={ShareBest} variant="accent" loading={buttonStatus}>
                  下载B50
                </Button>
                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm">
                  <span className="text-white/90 text-sm">Rating:</span>
                  <span className="ml-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                    {rating35 + rating15 || "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center z-[10]">
          <div id="b50" className="w-full max-w-[1600px] px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 w-full justify-items-center">
              {isLoading ? (
                <div className="col-span-full flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  {best35 && best35.length > 0 ? (
                    best35.map((song, index) => {
                      return <ShareableImageSub key={song.id} {...song} index={index} />
                    })
                  ) : (
                    <div className="col-span-full text-center">暂无数据</div>
                  )}
                </>
              )}
            </div>

            <hr className="w-full mx-auto border-t-4 border-gray-400 my-5" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 w-full justify-items-center">
              {isLoading ? (
                <></>
              ) : (
                <>
                  {best15 &&
                    best15.map((song, index) => {
                      return <ShareableImageSub key={song.id} {...song} index={index} />
                    })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
