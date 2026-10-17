"use client"
import { useEffect, useState } from "react"
import { CONFIG } from "@/config/api"
import LoadingSpinner from "@/components/ui/LoadingSpinner" // Updated import path

/**
 * 自动检查 token 是否有效，并返回提示信息
 */
export default function TokenChecker() {
  const [statusMessage, setStatusMessage] = useState<string>("验证登录状态中")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [token, setToken] = useState<string>("")
  useEffect(() => {
    const temp = localStorage.getItem("token")
    if (temp) {
      setTimeout(() => setToken(temp), 0)
      const checkToken = async () => {
        try {
          const response = await fetch(`${CONFIG.API.ENDPOINTS.API}/user/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${temp}`,
            },
            credentials: "include",
            mode: "cors",
          })

          if (response.status !== 200) {
            setStatusMessage("您的登录凭证已过期或者尚未登录。")
            setIsLoading(false)
          } else {
            setStatusMessage("已登录")
            setIsLoading(false)
          }
        } catch (error) {
          setStatusMessage("出现未知错误" + error)
          setIsLoading(false)
        }
      }
      checkToken()
    }
  }, [])

  return (
    <div className="text-black text-lg">
      {isLoading == true ? (
        <>
          <div className="flex space-x-5">
            <LoadingSpinner size={"ultrasm"} message={""} description={""} />
            <h1>&quot;验证中&quot;</h1>
          </div>
        </>
      ) : (
        <div>🟢 {statusMessage}</div>
      )}
    </div>
  )
}
