"use client"

import LoadingSpinner from "@/components/ui/LoadingSpinner"
import Image from "next/image"
import { useState, useEffect } from "react"
import { FaArrowLeft } from "react-icons/fa"
import { FaGear, FaRightFromBracket, FaArrowRight } from "react-icons/fa6"
import { IoMdPeople } from "react-icons/io"
import { BindAccount, FunctionStatus, ThirdAccount, UserProfile, AccountResponse } from "@/types/user"
import RatingHistory from "./components/RatingHistory"
import SvgStrokedText from "@/components/ui/SvgStrokedText"
import { CONFIG } from "@/config/api"
import http from "@/services/request"
import ChinaMap from "@/components/common/ChinaMap"

// TODO 优化：移除未使用的导入（AnimatedComponent、Link、use、PageTransitionWrapper），减少包体积与编译时间

const defaultUserProfile: UserProfile = {
  id: "请刷新",
  username: "请刷新",
  email: "请刷新",
  privileges: "basic",
  mai_rating: "0",
  mai_play_count: "0",
  mai_player_name: "Player 1",
  mai_nameplate_id: 1,
  mai_icon_id: 1,
  mai_trophy_id: 1,
  mai_frame_id: null,
}

// TODO 优化：`baseUrl` 使用 const 并集中配置（env/config），避免散落于页面
const baseUrl = CONFIG.ASSETS.MAIMAI.BASE

export default function UserProfilePage() {
  const [showGuide, setShowGuide] = useState(false)
  const [activeSection, setActiveSection] = useState("基本信息")
  const [token, setToken] = useState<string | null>("")
  const [userdata, setUserData] = useState<UserProfile>(defaultUserProfile)
  const [accounts, setAccounts] = useState<ThirdAccount[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isBindLoading, setBindIsLoading] = useState<boolean>(false)
  const [lxnstoken, setLxnsToken] = useState<string>("")
  const [divingfishusername, setDivingFishUsername] = useState<string>("")
  const [divingfishpassword, setDivingFishPassword] = useState<string>("")
  const [qr_code, setQrCode] = useState<string>("")
  // TODO 优化：`bindaccount` 未重新赋值可使用 const；避免未使用的 setter 减少不必要状态
  const [bindaccount] = useState<BindAccount>({
    islxns: false,
    isdivingfish: false,
    isarcaed: false,
  })
  // TODO 优化：`setFunctionStatus` 未使用；确认是否需要此状态或移除
  const [functionStatus] = useState<FunctionStatus>({
    BUpdate: true,
    CycleReport: false,
    RatingPush: false,
    AIRecommend: false,
    DataShare: false,
    DataAnalyse: false,
  })

  const [link, setLink] = useState<string>("")
  const textShadow = {
    textShadow:
      "-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)",
  }

  const GetBindAccount = async () => {
    setIsLoading(true)
    try {
      const data = await http.get<AccountResponse[]>("/api/maimai/maiweb/accounts", undefined, {
        retry: 3,
        retryDelay: 1000,
      })

      // console.log("get data")
      if (data && Array.isArray(data) && data.length > 0 && data[0].server) {
        setAccounts(
          data.map(account => ({
            server: account.server,
            nickname: account.nickname,
            identifier: account.identifier,
            from: "none",
          }))
        )
      }
    } catch (error) {
      console.error("Failed to fetch bind account:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const BindLxns = async () => {
    setBindIsLoading(true)
    try {
      await http.post(`/api/maimai/maiweb/accounts/lxns`, null, {
        params: { personal_token: lxnstoken },
        retry: 3,
      })
      alert("绑定成功")
      setLink("")
    } catch (error) {
      console.error(error)
      alert("绑定失败")
    } finally {
      setBindIsLoading(false)
    }
  }

  const BindDivifish = async () => {
    setBindIsLoading(true)
    try {
      // TODO 优化：密码传输应走 HTTPS 且避免通过 QueryString 传递敏感信息，改为 Body + HTTPS；并考虑后端节流与防刷
      await http.post(`/api/maimai/maiweb/accounts/divingfish`, null, {
        params: {
          username: divingfishusername,
          password: divingfishpassword,
        },
        retry: 3,
      })
      alert("绑定成功")
      setLink("")
    } catch (error) {
      console.error(error)
      alert("绑定失败")
    } finally {
      setBindIsLoading(false)
    }
  }

  const BindArcade = async () => {
    setBindIsLoading(true)
    try {
      await http.post(`/api/maimai/maiweb/accounts/arcade`, null, {
        params: { qr_code: qr_code },
        retry: 3,
      })
      alert("绑定成功")
    } catch (error) {
      console.error(error)
      alert("绑定失败")
    } finally {
      setBindIsLoading(false)
    }
  }

  const LogOut = () => {
    const confirmLogout = window.confirm("确定要退出登录吗？")

    // 只有当用户点击"确定"时才执行退出操作
    if (confirmLogout) {
      setToken(null)
      localStorage.removeItem("token")
      window.location.href = "/user"
    }
  }

  const RefreshData = async () => {
    setShowGuide(false)
    setIsLoading(true)

    try {
      // 添加延迟避免频繁请求
      await new Promise(resolve => setTimeout(resolve, 1000))

      await http.put("/api/maimai/maiweb/accounts", undefined, {
        retry: 3,
      })

      alert("刷新成功")
      window.location.href = "/user/profile"
    } catch (error: unknown) {
      console.error("刷新数据失败:", error)
      if ((error as { response?: { status: number } })?.response?.status === 429) {
        alert("请求过于频繁，请稍后再试")
      } else {
        alert("刷新失败，请稍后重试")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const BindThirdAccount = (link: string) => {
    switch (link) {
      case "lxns":
        return (
          <>
            <div className="relative size-96 max-sm:size-72 bg-white bg-opacity-75 backdrop-blur-md rounded-2xl shadow-xl flex flex-col justify-center items-center space-y-5">
              {isBindLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <h1 className="text-2xl font-bold">绑定落雪账号</h1>
                  <h1 className="text-xl font-bold text-red-500">（请至少上传一次成绩至落雪）</h1>
                  <input
                    type="text"
                    name="lxnstoken"
                    id=""
                    placeholder="个人token"
                    className="w-60 rounded-2xl border-4 border-blue-500 p-1 pl-2"
                    value={lxnstoken}
                    onChange={e => setLxnsToken(e.target.value)}
                  />
                  <a
                    href="https://maimai.lxns.net/login"
                    className="absolute bottom-5 right-5 text-blue-500 hover:scale-105 hover:underline duration-300 transition-all ease-in-out"
                  >
                    前往落雪获取token➡️
                  </a>
                  <button
                    className="ml-2 rounded-2xl bg-purple-500 p-1 px-4 text-white font-bold hover:scale-105 hover:shadow-lg duration-300 ease-in-out"
                    onClick={BindLxns}
                  >
                    绑定
                  </button>
                  <button
                    className="absolute right-5 top-0"
                    onClick={() => {
                      setLink("")
                    }}
                  >
                    ❌
                  </button>
                </>
              )}
            </div>
          </>
        )
      case "divingfish":
        return (
          <>
            <div className="relative size-96 max-sm:size-72 bg-white bg-opacity-75 backdrop-blur-md rounded-2xl shadow-xl flex flex-col justify-center items-center space-y-5">
              {isBindLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <h1 className="text-2xl font-bold">绑定水鱼账号</h1>
                  <input
                    type="username"
                    name="divingfishusername"
                    id=""
                    placeholder="水鱼账号"
                    className="w-60 rounded-2xl border-4 border-blue-500 p-1 pl-2"
                    value={divingfishusername}
                    onChange={e => setDivingFishUsername(e.target.value)}
                  />
                  <input
                    type="password"
                    name="divingfishpassword"
                    id=""
                    placeholder="水鱼密码"
                    className="w-60 rounded-2xl border-4 border-blue-500 p-1 pl-2"
                    value={divingfishpassword}
                    onChange={e => setDivingFishPassword(e.target.value)}
                  />
                  <a
                    href="https://www.diving-fish.com/maimaidx/prober/"
                    className="absolute bottom-5 right-5 text-blue-500 hover:scale-105 hover:underline duration-300 transition-all ease-in-out"
                  >
                    前往水鱼注册账号
                  </a>
                  <button
                    className="ml-2 rounded-2xl bg-purple-500 p-1 px-4 text-white font-bold hover:scale-105 hover:shadow-lg duration-300 ease-in-out"
                    onClick={BindDivifish}
                  >
                    绑定
                  </button>
                  <button
                    className="absolute right-5 top-0"
                    onClick={() => {
                      setLink("")
                    }}
                  >
                    ❌
                  </button>
                </>
              )}
            </div>
          </>
        )
      case "arcaed":
        return (
          <>
            <div className="relative size-96 max-sm:size-72 bg-white bg-opacity-75 backdrop-blur-md rounded-2xl shadow-xl flex flex-col justify-center items-center space-y-5">
              {isBindLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <h1 className="text-2xl font-bold">绑定街机账号</h1>
                  <input
                    type="username"
                    name="divingfishusername"
                    id=""
                    placeholder="二维码字段"
                    className="w-60 rounded-2xl border-4 border-blue-500 p-1 pl-2"
                    value={qr_code}
                    onChange={e => setQrCode(e.target.value)}
                  />
                  <button
                    className="ml-2 rounded-2xl bg-purple-500 p-1 px-4 text-white font-bold hover:scale-105 hover:shadow-lg duration-300 ease-in-out"
                    onClick={BindArcade}
                  >
                    绑定
                  </button>
                  <button
                    className="absolute right-5 top-0"
                    onClick={() => {
                      setLink("")
                    }}
                  >
                    ❌
                  </button>
                </>
              )}
            </div>
          </>
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case "基本信息":
        return (
          <div className="relative max-sm:w-full flex flex-col justify-center items-center mb-16 overflow-clip">
            <div className="border-4 border-white bg-white rounded-2xl">
              <div className="relative sm:w-[900px] max-sm:px-2 bg-white/85 rounded-2xl px-10 flex flex-col text-center border-4 border-[rgb(155,244,236)] text-black">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <div className="my-12">
                      <div className="text-white text-4xl font-bold" style={textShadow}>
                        {(() => {
                          // 获取当前时间（UTC+8）
                          const now = new Date()
                          const hours = now.getHours()

                          // 根据时间段返回不同的问候语
                          if (hours >= 5 && hours < 12) {
                            return `上午好，${userdata.username}！`
                          } else if (hours >= 12 && hours < 18) {
                            return `下午好，${userdata.username}！`
                          } else {
                            return `晚上好，${userdata.username}！`
                          }
                        })()}
                      </div>
                    </div>

                    <div
                      className="max-sm:w-full max-sm:p-0 w-full p-4 flex flex-row items-center bg-no-repeat sm:bg-contain max-sm:bg-cover bg-center rounded-xl border-2 border-[#e0e0e0] shadow-md"
                      style={
                        token == null
                          ? { backgroundImage: `url(${baseUrl}/plate/1.png)` }
                          : {
                              backgroundImage: userdata?.mai_nameplate_id
                                ? `url("${CONFIG.ASSETS.STATIC}/UI_Plate_${userdata.mai_nameplate_id.toString().padStart(6, "0")}.png")`
                                : `url("${CONFIG.ASSETS.STATIC}/UI_Plate_000101.png")`,
                            }
                      }
                    >
                      {/* 左侧头像 */}
                      {/* TODO 优化：改用 `next/image` 优化图片加载与 LCP */}
                      <div className="flex justify-center items-center mr-4">
                        {token == null || userdata.mai_icon_id == null ? (
                          <Image
                            src={baseUrl + "/icon/1.png"}
                            className="size-24 rounded-lg border-2 border-gray-300 shadow-lg"
                            width={96}
                            height={96}
                            alt="用户头像"
                            unoptimized
                          />
                        ) : (
                          <Image
                            src={
                              CONFIG.ASSETS.STATIC +
                              "/UI_Icon_" +
                              userdata.mai_icon_id.toString().padStart(6, "0") +
                              ".png"
                            }
                            className="size-24 rounded-lg border-2 border-gray-300 shadow-lg"
                            width={96}
                            height={96}
                            alt="用户头像"
                            unoptimized
                          />
                        )}
                      </div>

                      {/* 右侧信息区域 */}
                      <div className="flex-1 flex flex-col justify-between h-24">
                        {/* Rating值 */}
                        <div className="flex items-center">
                          {/* TODO 优化：遵循 UI 规范，移除渐变色（bg-gradient-to-*） */}
                          <span className="relative max-sm:hidden bg-gradient-to-r from-yellow-300 via-pink-400 to-blue-500 pl-2 pr-3 py-0.5 rounded-lg border-2 border-yellow-200 shadow-md text-left text-white overflow-clip">
                            <SvgStrokedText
                              text={`Rating: ${userdata.mai_rating}`}
                              strokeColor="#9334e9"
                              strokeWidth={5}
                              fill="#fff"
                              fontSize={65}
                              width="120"
                              height="25"
                            />

                            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent z-0"></div>
                          </span>
                          {/* TODO 优化：遵循 UI 规范，移除渐变色（bg-gradient-to-*） */}
                          <span className="relative sm:hidden bg-gradient-to-r from-yellow-300 via-pink-400 to-blue-500 pl-2 pr-3 py-0.5 rounded-lg border-2 border-yellow-200 shadow-md text-left text-white overflow-clip">
                            <SvgStrokedText
                              text={`Rating: ${userdata.mai_rating}`}
                              strokeColor="#9334e9"
                              strokeWidth={5}
                              fill="#fff"
                              fontSize={65}
                              width="120"
                              height="25"
                            />

                            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent z-0"></div>
                          </span>
                        </div>

                        {/* 姓名框 */}
                        <div className="flex text-xl font-bold tracking-wider w-full">
                          <span className="bg-white max-sm:hidden pl-2 pr-2 py-0.5 rounded-lg border-2 border-gray-300 shadow-sm text-left w-64 truncate">
                            {userdata.username}
                          </span>
                          <span className="bg-white sm:hidden pl-2 pr-2 py-0.5 rounded-lg border-2 border-gray-300 shadow-sm text-left w-64 max-sm:w-36  truncate">
                            {userdata.username}
                          </span>
                        </div>

                        {/* 称号 */}
                        <div className="flex justify-start w-full">
                          {/* TODO 优化：遵循 UI 规范，移除渐变色（bg-gradient-to-*） */}
                          <span className="inline-block max-sm:hidden bg-gradient-to-b from-gray-100 via-gray-300 to-gray-100 px-4 py-0 rounded-3xl border-2 border-gray-400 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.8)] text-center text-gray-700 italic text-sm w-64 truncate">
                            欢迎来到 maimai.moe!
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="inline-block sm:hidden max-sm:mx-auto max-sm:mt-2 bg-gradient-to-b from-gray-100 via-gray-300 to-gray-100 px-4 py-0 rounded-3xl border-2 border-gray-400 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.8)] text-center text-gray-700 italic text-sm w-64 truncate">
                      欢迎来到 maimai.moe!
                    </span>

                    <div className="flex justify-end m-3 space-x-4">
                      <button
                        className="inline-flex items-center rounded-2xl bg-blue-500 transition-colors p-1 px-4 text-white font-bold max-sm:text-sm"
                        onClick={() => setShowGuide(true)}
                      >
                        使用指南
                      </button>
                      <button
                        className="inline-flex items-center rounded-2xl bg-purple-500 p-1 px-4 text-white font-bold"
                        onClick={RefreshData}
                      >
                        从查分器导入数据
                      </button>
                    </div>
                    <div className="flex-row flex w-full items-center justify-center mb-2 mt-5">
                      <hr className="w-full border-t-4 border-gray-300 my-5 rounded-full" />
                      <div className="whitespace-nowrap px-7 text-gray-700 font-bold text-2xl">
                        游玩信息
                      </div>
                      <hr className="w-full border-t-4 border-gray-300 my-5 rounded-full" />
                    </div>
                    <div className="w-full flex flex-row justify-around items-center space-x-10 my-3">
                      {/* <div>
                      <ul>
                        <li className='flex justify-between'><b>本日游玩次数:</b>{0} pc</li>
                        <li className='flex justify-between'><b>本周游玩次数:</b>{0} pc</li>
                        <li className='flex justify-between'><b>本月游玩次数:</b>{0} pc</li>
                        <li className='flex justify-between'><b>年度游玩次数:</b>{0} pc</li>
                      </ul>
                    </div>
                    <div>
                      <ul>
                        <li className='flex justify-between'><b>本日提升rating分:</b>{0} rating</li>
                        <li className='flex justify-between'><b>本周提升rating分:</b>{0} rating</li>
                        <li className='flex justify-between'><b>本月提升rating分:</b>{0} rating</li>
                        <li className='flex justify-between'><b>年度提升rating分:</b>{0} rating</li>
                      </ul>
                    </div> */}
                      <h1>完善中</h1>
                    </div>
                    <RatingHistory />
                    <div className="flex-row flex w-full items-center justify-center mb-2 mt-5">
                      <hr className="w-full border-t-4 border-gray-300 my-5 rounded-full" />
                      <div className="whitespace-nowrap px-7 text-gray-700 font-bold text-2xl">
                        已启用功能列表
                      </div>
                      <hr className="w-full border-t-4 border-gray-300 my-5 rounded-full" />
                    </div>
                    <h1 className="text-gray-500 font-bold mb-3">注意：功能显示为当前状态</h1>
                    <div className="w-full flex flex-row justify-around items-center space-x-5 my-3">
                      <div>
                        <ul className="space-y-2">
                          <li className="flex justify-between items-center">
                            <b>b50自动更新:</b>
                            <button
                              className={`ml-2 rounded-2xl ${functionStatus.BUpdate ? "bg-green-500" : "bg-red-500"} p-1 px-4 max-sm:px-2 text-white font-bold`}
                            >
                              {functionStatus.BUpdate ? "已启用" : "关闭"}
                            </button>
                          </li>
                          <li className="flex justify-between items-center">
                            <b>周期报告:</b>
                            <button
                              className={`ml-2 rounded-2xl ${functionStatus.CycleReport ? "bg-green-500" : "bg-red-500"} p-1 px-4 max-sm:px-2 text-white font-bold`}
                            >
                              {functionStatus.CycleReport ? "已启用" : "开发中"}
                            </button>
                          </li>
                          <li className="flex justify-between items-center">
                            <b>每日推荐:</b>
                            <button
                              className={`ml-2 rounded-2xl ${functionStatus.RatingPush ? "bg-green-500" : "bg-red-500"} p-1 px-4 max-sm:px-2 text-white font-bold`}
                            >
                              {functionStatus.RatingPush ? "已启用" : "开发中"}
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <ul className="space-y-2">
                          <li className="flex justify-between items-center">
                            <b>AI智能推荐:</b>
                            <button
                              className={`ml-2 rounded-2xl ${functionStatus.AIRecommend ? "bg-green-500" : "bg-red-500"} p-1 px-4 max-sm:px-2 text-white font-bold`}
                            >
                              {functionStatus.AIRecommend ? "已启用" : "开发中"}
                            </button>
                          </li>
                          <li className="flex justify-between items-center">
                            <b>多方数据共享:</b>
                            <button
                              className={`ml-2 rounded-2xl ${functionStatus.DataShare ? "bg-green-500" : "bg-red-500"} p-1 px-4 max-sm:px-2 text-white font-bold`}
                            >
                              {functionStatus.DataShare ? "已启用" : "开发中"}
                            </button>
                          </li>
                          <li className="flex justify-between items-center">
                            <b>个人数据分析:</b>
                            <button
                              className={`ml-2 rounded-2xl ${functionStatus.DataAnalyse ? "bg-green-500" : "bg-red-500"} p-1 px-4 max-sm:px-2 text-white font-bold`}
                            >
                              {functionStatus.DataAnalyse ? "已启用" : "开发中"}
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex-row flex w-full items-center justify-center mb-2 mt-5">
                      <hr className="w-full border-t-4 border-gray-300 my-5 rounded-full" />
                      <div className="whitespace-nowrap px-7 text-gray-700 font-bold text-2xl">
                        个人全国行脚图
                      </div>
                      <hr className="w-full border-t-4 border-gray-300 my-5 rounded-full" />
                    </div>
                    <div className="w-full h-[400px] my-2 mb-8 flex flex-row justify-center items-center">
                      <ChinaMap />
                    </div>

                    <div className="flex-row flex w-full items-center justify-center mb-2 mt-5">
                      <hr className="w-full border-t-4 border-gray-300 my-5 rounded-full" />
                      <div className="whitespace-nowrap px-7 text-gray-700 font-bold text-2xl">
                        账号设置
                      </div>
                      <hr className="w-full border-t-4 border-gray-300 my-5 rounded-full" />
                    </div>
                    <div
                      id="settings"
                      className="flex flex-col justify-center m-6 mx-16 mb-16 space-y-8"
                    >
                      <button
                        className="inline-flex items-center justify-between rounded-2xl bg-blue-500 p-3 px-4 text-white font-bold w-full"
                        onClick={() => setActiveSection("关联账号")}
                      >
                        <div className="flex items-center">
                          <FaGear className="mr-2" />
                          账号设置
                        </div>
                        <FaArrowRight />
                      </button>
                      <button
                        className="inline-flex items-center justify-between rounded-2xl bg-blue-500 p-3 px-4 text-white font-bold w-full"
                        onClick={() => setActiveSection("隐私设置")}
                      >
                        <div className="flex items-center">
                          <IoMdPeople className="mr-2" />
                          隐私设置
                        </div>
                        <FaArrowRight />
                      </button>

                      {/* 增加间距 */}
                      <div className="py-4 text-gray-400">ヽ(ﾟ∀ﾟ*)ﾉ━━━ｩ♪</div>

                      <button
                        className="inline-flex items-center justify-between rounded-2xl bg-red-500 p-3 px-4 text-white font-bold w-full"
                        onClick={LogOut}
                      >
                        <div className="flex items-center">
                          <FaRightFromBracket className="mr-2" />
                          退出登录
                        </div>
                        <FaArrowRight />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      case "关联账号":
        return (
          <>
            <div className=" max-sm:w-full relative flex flex-col justify-center items-center mb-16">
              <div className="max-sm:w-full sm:w-[900px] flex justify-start mb-2">
                <button
                  className="inline-flex items-center text-white hover:scale-105 transition-colors m-3"
                  onClick={() => setActiveSection("基本信息")}
                >
                  <FaArrowLeft className="mr-2 size-5" />
                  <span className="text-xl font-bold" style={textShadow}>
                    返回个人主页
                  </span>
                </button>
              </div>
              <div className="border-4 max-sm:w-full border-white rounded-2xl">
                <div className="relative max-sm:w-full max-sm:px-0 sm:w-[900px] bg-white/85 rounded-2xl px-10 flex flex-col text-center border-4 border-[rgb(155,244,236)] text-black min-h-96">
                  {isLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <div className="flex-row flex w-full items-center justify-center mb-2 mt-5">
                        <hr className="w-full max-sm:hidden border-t-4 border-gray-300 my-5 rounded-full" />
                        <div className="whitespace-nowrap px-7 text-gray-700 font-bold text-2xl">
                          关联第三方账号
                        </div>
                        <hr className="w-full max-sm:hidden border-t-4 border-gray-300 my-5 rounded-full" />
                      </div>
                      <div className="w-full flex flex-col justify-center items-center space-y-5 my-10">
                        <div className="w-6/12 flex flex-row justify-between">
                          <b>落雪:</b>
                          <button
                            className={`ml-2 rounded-2xl ${bindaccount.islxns ? "bg-green-500" : "bg-red-500"} p-1 px-4 text-white font-bold`}
                            onClick={() => setLink("lxns")}
                          >
                            {bindaccount.islxns ? "已绑定" : "未绑定"}
                          </button>
                        </div>
                        <div className="w-6/12 flex flex-row justify-between">
                          <b>水鱼:</b>
                          <button
                            className={`ml-2 rounded-2xl ${bindaccount.isdivingfish ? "bg-green-500" : "bg-red-500"}  p-1 px-4 text-white font-bold`}
                            onClick={() => {
                              setLink("divingfish")
                            }}
                          >
                            {bindaccount.isdivingfish ? "已绑定" : "未绑定"}
                          </button>
                        </div>
                        <div className="w-6/12 flex flex-row justify-between">
                          <b>Arcade:</b>
                          <button
                            className={`ml-2 rounded-2xl ${bindaccount.isarcaed ? "bg-green-500" : "bg-red-500"} p-1 px-4 text-white font-bold`}
                            onClick={() => {
                              setLink("arcaed")
                            }}
                          >
                            {bindaccount.isarcaed ? "已绑定" : "未绑定"}
                          </button>
                        </div>
                      </div>
                      <div className="py-2"></div>
                      <div className="flex justify-center m-3 mb-10">
                        <button
                          className="right-10 ml-2 rounded-2xl bg-purple-500 p-3 px-4 text-white font-bold inline-block"
                          onClick={GetBindAccount}
                        >
                          更新绑定状态
                        </button>
                      </div>
                      <div className="absolute z-[1000] h-full flex justify-center items-center">
                        {BindThirdAccount(link)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )
      case "隐私设置":
        return (
          <div className="relative flex flex-col justify-center items-center mb-16">
            <div className="max-sm:w-[400px] w-[900px] flex justify-start mb-2">
              <button
                className="inline-flex items-center text-white hover:scale-105 transition-colors m-3"
                onClick={() => setActiveSection("基本信息")}
              >
                <FaArrowLeft className="mr-2 size-5" />
                <span className="text-xl font-bold" style={textShadow}>
                  返回个人主页
                </span>
              </button>
            </div>
            <div className="border-4 border-white rounded-2xl">
              <div className="relative max-sm:w-[400px] max-sm:px-0 w-[900px] bg-white/85 rounded-2xl px-10 flex flex-col text-center border-4 border-[rgb(155,244,236)] text-black">
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                  </>
                ) : (
                  <>
                    <div className="flex-row flex w-full items-center justify-center mb-2 mt-5">
                      <hr className="w-full border-t-4 border-gray-300 my-5 rounded-full" />
                      <div className="whitespace-nowrap px-7 text-gray-700 font-bold text-2xl">
                        隐私设置
                      </div>
                      <hr className="w-full border-t-4 border-gray-300 my-5 rounded-full" />
                    </div>
                    <div className="w-full flex flex-col justify-center items-center space-y-5 my-8">
                      <div className="w-6/12 max-sm:w-9/12 flex flex-row justify-between">
                        <b>第三方软件调取信息:</b>
                        <button className="ml-2 rounded-2xl bg-green-500 p-1 px-2 text-white font-bold">
                          撰写中
                        </button>
                      </div>
                      <div className="w-6/12 max-sm:w-9/12  flex flex-row justify-between">
                        <b>舞萌萌使用隐私协议:</b>
                        <button className="ml-2 rounded-2xl bg-green-500 p-1 px-2 text-white font-bold">
                          撰写中
                        </button>
                      </div>
                      <div className="w-6/12 max-sm:w-9/12  flex flex-row justify-between">
                        <b>数据用于AI推荐:</b>
                        <button className="ml-2 rounded-2xl bg-green-500 p-1 px-2 text-white font-bold">
                          撰写中
                        </button>
                      </div>
                      <div className="w-6/12 max-sm:w-9/12  flex flex-row justify-between">
                        <b>根据数据优化:</b>
                        <button className="ml-2 rounded-2xl bg-green-500 p-1 px-2 text-white font-bold">
                          撰写中
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      case "else":
        return (
          <div className="relative flex flex-col justify-center items-center mb-16">
            <div className="w-[900px] flex justify-start mb-2">
              <button
                className="inline-flex items-center text-white hover:scale-105 transition-colors m-3"
                onClick={() => setActiveSection("基本信息")}
              >
                <FaArrowLeft className="mr-2 size-5" />
                <span className="text-xl font-bold" style={textShadow}>
                  返回个人主页
                </span>
              </button>
            </div>
            <div className="border-4 border-white rounded-2xl">
              <div className="relative w-[900px] bg-white/85 rounded-2xl px-10 flex flex-col text-center border-4 border-[rgb(155,244,236)] text-black">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <h1 className="text-2xl font-bold mt-5">其他设置</h1>
                    <hr className="w-full border-t-4 border-gray-400 my-5" />
                    <h1 className="text-2xl font-bold my-5 mb-10">暂无</h1>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      default:
        return <div>请选择一个选项</div>
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken != "") {
      setToken(storedToken)
    } else {
      window.location.href = "/user"
    }
  }, [])
  useEffect(() => {
    if (token != "") {
      const myHeaders = new Headers()
      // console.log("token:", token);
      myHeaders.append("Authorization", `Bearer ${token}`)

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      }

      fetch(`${CONFIG.API.ENDPOINTS.API}/user/me`, requestOptions)
        .then(response => response.text())
        .then(result => {
          // console.log(result);
          const data = JSON.parse(result)
          if (data.id) {
            setUserData(data)
          } else {
            setUserData(defaultUserProfile)
          }
        })
        .catch(error => console.error(error))
      GetBindAccount()
    }
  }, [token])
  useEffect(() => {
    for (let i = 0; i < accounts.length; i++) {
      if (!isNaN(Number(accounts[i].identifier))) {
        accounts[i].from = "lxns"
        bindaccount.islxns = true
      } else {
        if (accounts[i].identifier.length > 40) {
          accounts[i].from = "arcaed"
          bindaccount.isarcaed = true
        } else {
          accounts[i].from = "divingfish"
          bindaccount.isdivingfish = true
        }
      }
      // console.log(accounts);
    }
  }, [accounts, bindaccount])

  return (
    <div className="w-[900px] max-sm:w-full min-h-[400px] h-auto rounded-2xl mt-10 mx-auto flex flex-col justify-center items-center">
      {userdata.username == "请刷新" ? (
        <>
          <div className="flex flex-col text-center text-xl text-white">
            {/* TODO 优化：遵循 UI 规范，移除渐变色（bg-gradient-to-*） */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 py-2 px-4 rounded-xl shadow-lg mb-4">
              <span className="text-3xl">🤯</span>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                5s内无跳转表明登录状态已过期
              </h1>
            </div>
            {/* TODO 优化：遵循 UI 规范，移除渐变色（bg-gradient-to-*） */}
            <button
              onClick={LogOut}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 p-2 px-5 text-white font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-white/30"
            >
              <FaRightFromBracket className="mr-2" />
              返回重新登录
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            key={activeSection}
            className="max-sm:w-[90%] sm:w-[900px] flex justify-center items-center"
          >
            {renderContent()}
          </div>
          {showGuide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative max-sm:w-[90%] w-[600px] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8">
                <button
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowGuide(false)}
                >
                  <span className="text-xl">×</span>
                </button>

                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  操作指南
                </h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <span className=" w-6 h-6 bg-purple-500 rounded-full text-white text-sm flex items-center justify-center mr-2">
                        1
                      </span>
                      这里是个人信息页！
                    </h3>
                    <p className="text-gray-600 ml-8">查看个人信息、游玩数据及功能开启状态</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <span className=" w-6 h-6 bg-blue-500 rounded-full text-white text-sm flex items-center justify-center mr-2">
                        2
                      </span>
                      关联账号
                    </h3>
                    <p className="text-gray-600 ml-8">绑定第三方账号，实现数据互通</p>
                    <i className="text-gray-600 ml-8 text-sm">注:推荐绑定Arcade账号</i>
                    <p className="text-gray-600 ml-8">
                      在绑定账号后请点击
                      <button
                        className="my-2 rounded-2xl bg-purple-500 p-1 px-4 text-white font-bold"
                        onClick={RefreshData}
                      >
                        从查分器导入数据
                      </button>
                      导入数据(一天只有两次手动更新次数)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <span className=" w-6 h-6 bg-green-500 rounded-full text-white text-sm flex items-center justify-center mr-2">
                        3
                      </span>
                      账号 & 隐私设置
                    </h3>
                    <p className="text-gray-600 ml-8">
                      {`管理账号和查分器绑定 -> 账号设置`}
                      <br />
                      个人数据的使用范围和隐私选项（撰写中）
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">
                    提示：点击右上角的刷新按钮可以更新最新数据
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
