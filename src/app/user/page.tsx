"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import LoadingSpinner from "../components/LoadingSpinner"
import { FaArrowLeft } from "react-icons/fa"
import { CONFIG } from "@/config/api"

export default function UserPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [token, setToken] = useState<string | null>()
  const [isHovered, setIsHovered] = useState(true)
  const [register, setRegister] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const Register = () => {
    setIsLoading(true)
    const myHeaders = new Headers()
    myHeaders.append("accept", "application/json")
    myHeaders.append("Content-Type", "application/json")

    const raw = JSON.stringify({
      username: username,
      email: email,
      password: password,
    })
    console.log(raw)

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    }

    fetch(`${CONFIG.API.ENDPOINTS.API}/auth/register`, requestOptions)
      .then(async response => {
        const statusCode = response.status
        const data = await response.json()
        console.log(`Status Code: ${statusCode}`)
        if (statusCode == 201) {
          alert("Register Success")
          window.location.href = "/user"
        } else {
          throw new Error(
            data.message + "该报错仅会在「邮箱」或「用户名」其中一个以上已注册时存在" ||
              "注册失败，请稍后再试。"
          )
        }
      })
      .then(result => {
        alert("Register 失败")
        console.log(result)
      })
      .catch(error => alert(error))
  }
  const Login = () => {
    setIsLoading(true)
    const myHeaders = new Headers()
    myHeaders.append("accept", "application/json")
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded")

    const urlencoded = new URLSearchParams()
    urlencoded.append("grant_type", "")
    urlencoded.append("username", username)
    urlencoded.append("password", password)
    urlencoded.append("scope", "")
    urlencoded.append("client_id", "")
    urlencoded.append("client_secret", "")

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    }
    fetch(`${CONFIG.API.ENDPOINTS.API}/auth/jwt/login`, requestOptions)
      .then(response => response.text())
      .then(result => {
        const data = JSON.parse(result)
        if (data.access_token) {
          // 修改：使用 try-catch 确保 localStorage 操作成功
          try {
            localStorage.setItem("token", data.access_token)
            // 添加：同时在 sessionStorage 中也存储一份
            sessionStorage.setItem("token", data.access_token)
            window.location.href = "/user/profile"
          } catch (error) {
            console.error("存储 token 失败:", error)
            alert("登录状态保存失败，请检查浏览器设置")
          }
        } else {
          alert("登录失败，请重试")
          setIsLoading(false)
        }
      })
      .catch(error => {
        console.error(error)
        alert("登录请求失败，请重试。错误详情: " + error)
        setIsLoading(false)
      })
  }

  const sendVerificationEmail = () => {
    setIsLoading(true)
    fetch(`${CONFIG.API.ENDPOINTS.EMAIL}/verify/email?email=${email}`)
      .then(async response => {
        const data = await response.json()
        if (response.ok) {
          alert(data.message)
        } else {
          throw new Error(data.message || "发送验证邮件失败，请稍后再试。")
        }
      })
      .catch(error => alert(error))
      .finally(() => setIsLoading(false))
  }

  const changePassword = () => {
    setIsLoading(true)
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")

    const raw = JSON.stringify({
      email: email,
      password: newPassword,
      code: parseInt(code),
    })

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    }

    fetch(`${CONFIG.API.ENDPOINTS.EMAIL}/change_password`, requestOptions)
      .then(async response => {
        const data = await response.json()
        if (response.ok) {
          alert(data.message)
          setForgotPassword(false)
        } else {
          throw new Error(data.message || "密码修改失败，请稍后再试。")
        }
      })
      .catch(error => alert(error))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      const newToken = ""
      localStorage.setItem("token", newToken)
      setToken(newToken)
    } else {
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
    if (token && token.startsWith("ey")) {
      window.location.href = "/user/profile"
    } else {
      console.log(token)
      console.log("Token invalid")
    }
  }, [token])

  return (
    <>
      <div className="max-sm:w-full w-[900px] mt-20  mx-auto relative flex justify-center">
        <div className=" max-sm:w-[90%] w-[450px] h-[600px] bg-[rgb(239,246,255)] rounded-2xl flex flex-row border-4 border-white">
          {/* 舞萌萌登录与注册 */}
          <div
            className={`h-full bg-blue-500 max-sm:w-full p-5 rounded-2xl transition-all duration-300 ease-in-out w-[450px] border-l-4 border-white shadow-lg relative`}
          >
            {isHovered ? (
              <>
                {register ? (
                  <>
                    <div className="h-full flex flex-col p-2 justify-center items-center space-y-2">
                      <button
                        className="flex items-center text-white font-medium hover:text-gray-200 transition-colors absolute top-4 left-4"
                        onClick={() => setRegister(false)}
                      >
                        <FaArrowLeft className="mr-1" /> 返回登录
                      </button>
                      <Image
                        src="/img/logo.png"
                        className="w-48 h-auto"
                        alt="舞萌萌网站 Logo"
                        width={192}
                        height={192}
                        priority
                      />
                      <h1 className="text-2xl font-bold">舞萌萌账号注册</h1>
                      {isLoading ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          <input
                            type="username"
                            id="username"
                            placeholder="username (4-16位)"
                            className=" w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-md"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                          />
                          <input
                            type="password"
                            id="password"
                            placeholder="password"
                            className=" w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-md"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                          />
                          <input
                            type="email"
                            id="email"
                            placeholder="email"
                            className=" w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-md"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                          />
                          <button
                            className="w-32 h-12 border-4 border-white rounded-2xl text-xl font-bold"
                            onClick={Register}
                          >
                            注册
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {forgotPassword ? (
                      <>
                        <div className="h-full flex flex-col p-2 justify-center items-center space-y-2">
                          <button
                            className="flex items-center text-white font-medium hover:text-gray-200 transition-colors absolute top-4 left-4"
                            onClick={() => setForgotPassword(false)}
                          >
                            <FaArrowLeft className="mr-1" /> 返回登录
                          </button>
                          <Image
                            src="/img/logo.png"
                            className="w-48 h-auto"
                            alt="舞萌萌网站 Logo"
                            width={192}
                            height={192}
                            priority
                          />
                          <h1 className="text-2xl font-bold">忘记密码</h1>
                          {isLoading ? (
                            <LoadingSpinner />
                          ) : (
                            <>
                              <input
                                type="email"
                                id="email"
                                placeholder="email"
                                className=" w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-md"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                              />
                              <button
                                className="w-48 h-12 border-4 border-white rounded-2xl text-xl font-bold"
                                onClick={sendVerificationEmail}
                              >
                                发送验证码
                              </button>
                              <input
                                type="text"
                                id="code"
                                placeholder="验证码"
                                className=" w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-md"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                              />
                              <input
                                type="password"
                                id="newPassword"
                                placeholder="新密码"
                                className=" w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-md"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                              />
                              <button
                                className="w-32 h-12 border-4 border-white rounded-2xl text-xl font-bold"
                                onClick={changePassword}
                              >
                                修改密码
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex flex-col p-2 justify-center items-center space-y-2">
                        <Image
                          src="/img/logo.png"
                          className="w-48 h-auto"
                          alt="舞萌萌网站 Logo"
                          width={192}
                          height={192}
                          priority
                        />
                        <h1 className="text-2xl font-bold">舞萌萌账号登录</h1>
                        {isLoading ? (
                          <LoadingSpinner />
                        ) : (
                          <>
                            <input
                              type="username"
                              id="username"
                              placeholder="username"
                              className=" w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-md"
                              value={username}
                              onChange={e => setUsername(e.target.value)}
                            />
                            <input
                              type="password"
                              id="password"
                              placeholder="password"
                              className=" w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-md"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                            />
                            <div className="flex flex-row space-x-5">
                              <button
                                className="w-32 h-12 border-4 border-white rounded-2xl text-xl font-bold hover:scale-105"
                                onClick={Login}
                              >
                                登录
                              </button>
                              <button
                                className="w-32 h-12 border-4 border-white rounded-2xl text-xl font-bold hover:scale-105"
                                onClick={() => {
                                  setRegister(true)
                                }}
                              >
                                注册
                              </button>
                            </div>
                            <button
                              className="text-white mt-4"
                              onClick={() => setForgotPassword(true)}
                            >
                              忘记密码?
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <div className="h-full flex flex-col justify-center items-center text-center space-y-5">
                  <h1 className="w-[80px] font-bold text-2xl">
                    使用<br></br>舞萌萌
                  </h1>
                  <Image
                    src="/img/arrowright.png"
                    onClick={() => setIsHovered(true)}
                    className="animate-leftToRight cursor-pointer"
                    alt="点击进入登录注册页面"
                    width={50}
                    height={50}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
