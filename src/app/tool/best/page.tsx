"use client"

import AnimatedComponent from "@/app/components/AnimatedComponent"
import Button from "@/app/components/button/Button"
import Guide from "@/app/components/Guide"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import { ShareableImageSub } from "@/app/components/ShareableImage"
import { UserProfile } from "@/app/user/model"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { Step } from "react-joyride"
import { CONFIG } from "@/config/api"

// 定义MusicGradeProps接口
interface MusicGradeProps {
  id: number
  title: string
  level: string
  level_index: number
  level_value: number
  achievements: number
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
  const [best35, setBest35] = useState<any>()
  const [best15, setBest15] = useState<any>()
  const [rating35, setRating35] = useState<any>()
  const [rating15, setRating15] = useState<any>()
  const [token, setToken] = useState<string | null>()
  let baseUrl = CONFIG.ASSETS.MAIMAI.BASE
  let ArcaedGradeB35: MusicGradeProps[] = []
  let ArcaedGradeB15: MusicGradeProps[] = []
  const [nowFrom, setNowFrom] = useState<string | null>("暂无可用数据源")
  const [accounts, setAccounts] = useState<ThirdAccount[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [user, setUser] = useState<UserProfile>()
  const [buttonStatus, setButtonStatus] = useState<boolean>(false)

  const textstroke = {
    textShadow:
      "-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)",
  }
  useEffect(() => {
    // const data = { "rating": 15468, "rating_b35": 10833, "rating_b15": 4635, "scores_b35": [{ "id": 1343, "title": "マツヨイナイトバグ", "level": "13+", "level_index": 3, "achievements": 100.5263, "fc": 3, "fs": 0, "dx_score": 2747, "dx_rating": 312.0, "rate": 0, "type": "dx" }, { "id": 400, "title": "デッドレッドガールズ", "level": "13+", "level_index": 3, "achievements": 100.6019, "fc": null, "fs": 0, "dx_score": 2494, "dx_rating": 312.0, "rate": 0, "type": "standard" }, { "id": 1096, "title": "モ°ルモ°ル", "level": "13+", "level_index": 3, "achievements": 100.6086, "fc": 3, "fs": 0, "dx_score": 2487, "dx_rating": 312.0, "rate": 0, "type": "dx" }, { "id": 1236, "title": "Last Samurai", "level": "13+", "level_index": 3, "achievements": 100.5609, "fc": 3, "fs": 2, "dx_score": 1200, "dx_rating": 312.0, "rate": 0, "type": "dx" }, { "id": 1466, "title": "群青シグナル", "level": "13+", "level_index": 3, "achievements": 100.5721, "fc": null, "fs": 0, "dx_score": 2661, "dx_rating": 312.0, "rate": 0, "type": "dx" }, { "id": 1310, "title": "Trick tear", "level": "14", "level_index": 3, "achievements": 100.2449, "fc": null, "fs": 0, "dx_score": 2246, "dx_rating": 311.0, "rate": 1, "type": "dx" }, { "id": 1461, "title": "#狂った民族２ PRAVARGYAZOOQA", "level": "14", "level_index": 3, "achievements": 100.1856, "fc": null, "fs": 0, "dx_score": 2513, "dx_rating": 311.0, "rate": 1, "type": "dx" }, { "id": 1573, "title": "Final Step!", "level": "13+", "level_index": 3, "achievements": 100.7084, "fc": null, "fs": 0, "dx_score": 2347, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1566, "title": "Knight Rider", "level": "13+", "level_index": 3, "achievements": 100.772, "fc": null, "fs": 0, "dx_score": 2414, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 701, "title": "Doll Judgment", "level": "13+", "level_index": 3, "achievements": 100.5674, "fc": null, "fs": 0, "dx_score": 2389, "dx_rating": 310.0, "rate": 0, "type": "standard" }, { "id": 1288, "title": "Big Daddy", "level": "13+", "level_index": 3, "achievements": 100.5366, "fc": null, "fs": 0, "dx_score": 2705, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 841, "title": "終点", "level": "13+", "level_index": 3, "achievements": 100.7131, "fc": 3, "fs": 0, "dx_score": 1973, "dx_rating": 310.0, "rate": 0, "type": "standard" }, { "id": 711, "title": "拝啓ドッペルゲンガー", "level": "13+", "level_index": 3, "achievements": 100.506, "fc": null, "fs": 0, "dx_score": 2815, "dx_rating": 310.0, "rate": 0, "type": "standard" }, { "id": 288, "title": "六兆年と一夜物語", "level": "13+", "level_index": 3, "achievements": 100.8854, "fc": 3, "fs": 0, "dx_score": 2037, "dx_rating": 310.0, "rate": 0, "type": "standard" }, { "id": 1453, "title": "Rainbow Rush Story", "level": "13+", "level_index": 3, "achievements": 100.7663, "fc": null, "fs": 0, "dx_score": 2514, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1459, "title": "You Mean the World to Me", "level": "13+", "level_index": 3, "achievements": 100.5134, "fc": null, "fs": 0, "dx_score": 1879, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 548, "title": "DETARAME ROCK&ROLL THEORY", "level": "13+", "level_index": 3, "achievements": 100.686, "fc": 3, "fs": 0, "dx_score": 2191, "dx_rating": 310.0, "rate": 0, "type": "standard" }, { "id": 1524, "title": "Alice's Suitcase", "level": "13+", "level_index": 3, "achievements": 100.6736, "fc": 3, "fs": 0, "dx_score": 2144, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1576, "title": "Cthugha", "level": "14", "level_index": 3, "achievements": 100.139, "fc": null, "fs": 0, "dx_score": 3095, "dx_rating": 309.0, "rate": 1, "type": "dx" }, { "id": 1176, "title": "Climax", "level": "14", "level_index": 3, "achievements": 100.2156, "fc": null, "fs": 0, "dx_score": 3017, "dx_rating": 309.0, "rate": 1, "type": "dx" }, { "id": 1475, "title": "SUPER AMBULANCE", "level": "14", "level_index": 3, "achievements": 100.0727, "fc": null, "fs": 0, "dx_score": 2760, "dx_rating": 309.0, "rate": 1, "type": "dx" }, { "id": 379, "title": "Caliburne ～Story of the Legendary sword～", "level": "14", "level_index": 3, "achievements": 100.2489, "fc": null, "fs": 0, "dx_score": 2517, "dx_rating": 309.0, "rate": 1, "type": "standard" }, { "id": 1479, "title": "Hainuwele", "level": "14", "level_index": 3, "achievements": 100.0418, "fc": null, "fs": 0, "dx_score": 2685, "dx_rating": 309.0, "rate": 1, "type": "dx" }, { "id": 1231, "title": "生命不詳", "level": "13+", "level_index": 3, "achievements": 100.8213, "fc": 3, "fs": 0, "dx_score": 2329, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1022, "title": "TwisteD! XD", "level": "13+", "level_index": 3, "achievements": 100.5343, "fc": null, "fs": 0, "dx_score": 2414, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1296, "title": "とびだせ！TO THE COSMIC!!", "level": "13+", "level_index": 3, "achievements": 100.724, "fc": 2, "fs": 0, "dx_score": 2564, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1447, "title": "エゴロック", "level": "13+", "level_index": 3, "achievements": 100.6095, "fc": null, "fs": 0, "dx_score": 1928, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 461, "title": "無敵We are one!!", "level": "13+", "level_index": 3, "achievements": 100.6059, "fc": 3, "fs": 0, "dx_score": 2525, "dx_rating": 308.0, "rate": 0, "type": "standard" }, { "id": 1143, "title": "アトロポスと最果の探究者", "level": "13+", "level_index": 3, "achievements": 100.6573, "fc": null, "fs": 0, "dx_score": 2194, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1445, "title": "遺伝子レベル∞スパイラル", "level": "13+", "level_index": 3, "achievements": 100.6425, "fc": 3, "fs": 0, "dx_score": 2263, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1159, "title": "Beautiful Future", "level": "13+", "level_index": 3, "achievements": 100.5278, "fc": 3, "fs": 0, "dx_score": 2236, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1195, "title": "マネマネサイコトロピック", "level": "13+", "level_index": 3, "achievements": 100.5842, "fc": 3, "fs": 2, "dx_score": 2290, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 561, "title": "いっしそう電☆舞舞神拳！", "level": "13+", "level_index": 3, "achievements": 100.5671, "fc": 3, "fs": 0, "dx_score": 2353, "dx_rating": 308.0, "rate": 0, "type": "standard" }, { "id": 1208, "title": "Cyaegha", "level": "13+", "level_index": 3, "achievements": 100.505, "fc": 3, "fs": 0, "dx_score": 2543, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 849, "title": "Kattobi KEIKYU Rider", "level": "13+", "level_index": 3, "achievements": 100.5978, "fc": 3, "fs": 2, "dx_score": 2319, "dx_rating": 308.0, "rate": 0, "type": "standard" }], "scores_b15": [{ "id": 1527, "title": "enchanted wanderer", "level": "13+", "level_index": 3, "achievements": 100.7009, "fc": 2, "fs": 0, "dx_score": 1653, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1588, "title": "Complex Mind", "level": "13+", "level_index": 3, "achievements": 100.6411, "fc": null, "fs": 0, "dx_score": 2357, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1587, "title": "Halfway(>∀<)", "level": "13+", "level_index": 3, "achievements": 100.6558, "fc": 3, "fs": 0, "dx_score": 2476, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1542, "title": "ここからはじまるプロローグ。 (Kanon Remix)", "level": "13+", "level_index": 3, "achievements": 100.578, "fc": null, "fs": 0, "dx_score": 2536, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1553, "title": "Last Kingdom", "level": "13+", "level_index": 3, "achievements": 100.7854, "fc": 2, "fs": 0, "dx_score": 2328, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1590, "title": "あつすぎの歌", "level": "13+", "level_index": 3, "achievements": 100.7567, "fc": 3, "fs": 2, "dx_score": 2217, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1633, "title": "OMAKENO Stroke", "level": "13+", "level_index": 3, "achievements": 100.8466, "fc": 2, "fs": 0, "dx_score": 2033, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1546, "title": "地球", "level": "14", "level_index": 3, "achievements": 100.2835, "fc": null, "fs": 0, "dx_score": 2351, "dx_rating": 309.0, "rate": 1, "type": "dx" }, { "id": 1561, "title": "おとせサンダー", "level": "13+", "level_index": 4, "achievements": 100.5527, "fc": null, "fs": 0, "dx_score": 2621, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1556, "title": "Hello, Hologram", "level": "13+", "level_index": 3, "achievements": 100.7926, "fc": 2, "fs": 0, "dx_score": 2430, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1539, "title": "リフヴェイン", "level": "13+", "level_index": 3, "achievements": 100.5441, "fc": 3, "fs": 2, "dx_score": 1772, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1584, "title": "コンティニュー！ feat. 藍月なくる", "level": "13+", "level_index": 3, "achievements": 100.6865, "fc": 3, "fs": 0, "dx_score": 2434, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1543, "title": "モ°ルモ°ル (MZK Skippin' Remix)", "level": "13+", "level_index": 3, "achievements": 100.6718, "fc": 2, "fs": 2, "dx_score": 1885, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1533, "title": "にゃーにゃー冒険譚", "level": "13+", "level_index": 3, "achievements": 100.5203, "fc": null, "fs": 0, "dx_score": 2934, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1604, "title": "『ウソテイ』 ～一回戦せりなvsしろなvsなずな～", "level": "13+", "level_index": 3, "achievements": 100.5811, "fc": 3, "fs": 0, "dx_score": 2406, "dx_rating": 308.0, "rate": 0, "type": "dx" }] }
    // setBest35(data.scores_b35)
    // setBest15(data.scores_b15)
    // setRating15(data.rating_b15)
    // setRating35(data.rating_b35)
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"))
    }
    // alert('Arcade数据源暂不可用')
  }, [])
  useEffect(() => {
    if (token) {
      // TODO 网络：统一封装请求；移除多处 console.log；添加错误重试
      GetBindAccount()
      var myHeaders = new Headers()
      myHeaders.append("Authorization", `Bearer ${token}`)

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
  }, [token])
  useEffect(() => {
    if (accounts.length > 0) {
      setNowFrom(accounts[0].from)
    }
  }, [accounts])
  useEffect(() => {
    GetBest50()
  }, [nowFrom])

  const GetBindAccount = () => {
    // TODO 类型：避免使用 any；将返回数据映射至强类型结构
    setIsLoading(true)
    const myHeaders = new Headers()
    myHeaders.append("accept", "application/json")
    myHeaders.append("Authorization", `Bearer ${token}`)

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
        if (data[0].server) {
          const updatedAccounts = data.map((account: any) => {
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
        }
        console.log(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error(error)
        setIsLoading(false)
      })
  }
  const GetBest50 = () => {
    // TODO 性能：对长列表的渲染进行虚拟化；对数据处理使用 `useMemo` 缓存
    setIsLoading(true)
    let nickname = ""
    if (nowFrom == "divingfish") {
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].from == "divingfish") {
          nickname = accounts[i].identifier
        }
      }
      const myHeaders = new Headers()
      myHeaders.append("accept", "application/json")

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      }
      let firstWord = ""
      let tmp = nickname.split(" ")

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
          Array.isArray(data.scores_b15) &&
            data.scores_b15.forEach((song: any, index: number) => {
              ArcaedGradeB15.push({
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
          Array.isArray(data.scores_b35) &&
            data.scores_b35.forEach((song: any, index: number) => {
              ArcaedGradeB35.push({
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
          // TODO 日志：移除
          console.log(data)
          setBest35(ArcaedGradeB35)
          setBest15(ArcaedGradeB15)
          setRating15(Math.ceil(data.rating_b15))
          setRating35(Math.ceil(data.rating_b35))
          setIsLoading(false)
        })
        .catch(error => {
          console.error(error)
          setIsLoading(false)
        })
    } else if (nowFrom == "lxns") {
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].from == "lxns") {
          nickname = accounts[i].identifier
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
          Array.isArray(data.scores_b15) &&
            data.scores_b15.forEach((song: any, index: number) => {
              ArcaedGradeB15.push({
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
          Array.isArray(data.scores_b35) &&
            data.scores_b35.forEach((song: any, index: number) => {
              ArcaedGradeB35.push({
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
          // TODO 日志：移除
          console.log(data)
          setBest35(ArcaedGradeB35)
          setBest15(ArcaedGradeB15)
          setRating15(Math.ceil(data.rating_b15))
          setRating35(Math.ceil(data.rating_b35))
          setIsLoading(false)
        })
        .catch(error => {
          console.error(error)
          setIsLoading(false)
        })
    } else if (nowFrom == "maiweb") {
      // TODO 日志：移除
      console.log("开始从maiweb获取数据")
      const myHeaders = new Headers()
      myHeaders.append("Accept", "application/json")
      myHeaders.append("Authorization", `Bearer ${token}`)

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
          // 检查data是否为数组并且有数据
          Array.isArray(data.scores_b15) &&
            data.scores_b15.forEach((song: any, index: number) => {
              ArcaedGradeB15.push({
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
          Array.isArray(data.scores_b35) &&
            data.scores_b35.forEach((song: any, index: number) => {
              ArcaedGradeB35.push({
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
          // TODO 日志：移除
          console.log(data)
          setBest35(ArcaedGradeB35)
          setBest15(ArcaedGradeB15)
          setRating15(Math.ceil(data.rating_b15))
          setRating35(Math.ceil(data.rating_b35))
          setIsLoading(false)
        })
        .catch(error => {
          console.error(error)
          setIsLoading(false)
        })
    }
  }
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

  const ShareBest = () => {
    var myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    setButtonStatus(true)

    var raw = JSON.stringify({
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

    var requestOptions = {
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
      .catch(error => console.log("error", error))
  }

  return (
    <>
      <div className="relative w-full max-w-[1600px] p-5 flex flex-col justify-center items-center mx-auto">
        <Guide steps={steps} autoStart={true} mark={"b50tour"} />

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
                onClick={GetBindAccount}
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
                      onClick={() => setNowFrom(account.from)}
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
                  onClick={GetBest50}
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

        <div className="w-full flex flex-col items-center">
          <div id="b50" className="w-full max-w-[1600px] px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 w-full justify-items-center">
              {isLoading ? (
                <div className="col-span-full flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  {best35 && best35.length > 0 ? (
                    best35.map((song: any, index: number) => {
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
                    best15.map((song: any, index: number) => {
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
