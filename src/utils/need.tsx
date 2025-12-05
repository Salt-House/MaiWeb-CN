/**
 * 路线相关API请求函数
 */
import { CONFIG } from "@/config/api"

// API基础URL
const BASE_URL = CONFIG.API.ENDPOINTS.EMAIL

/**
 * 获取路线列表
 * @returns Promise<string> 返回路线列表数据
 */
export const getRoadList = async (): Promise<string> => {
  const requestOptions = {
    method: "GET",
    redirect: "follow" as RequestRedirect,
  }

  try {
    const response = await fetch(`${BASE_URL}/road/list`, requestOptions)
    const result = await response.text()
    return result
  } catch (error) {
    console.log("error", error)
    throw error
  }
}

/**
 * 添加路线星标
 * @param id 路线ID
 * @returns Promise<string> 返回操作结果
 */
export const addRoadStar = async (id: string | number): Promise<string> => {
  const requestOptions = {
    method: "GET",
    redirect: "follow" as RequestRedirect,
  }

  try {
    const response = await fetch(`${BASE_URL}/road/add_star?id=${id}`, requestOptions)
    const result = await response.text()
    return result
  } catch (error) {
    console.log("error", error)
    throw error
  }
}

/**
 * 添加路线评论
 * @param commentData 评论数据
 * @returns Promise<string> 返回操作结果
 */
export const addRoadComment = async (commentData: {
  id: number
  role: string
  comment: string
  uid: number
}): Promise<string> => {
  const myHeaders = new Headers()
  myHeaders.append("Content-Type", "application/json")

  const raw = JSON.stringify(commentData)

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow" as RequestRedirect,
  }

  try {
    const response = await fetch(`${BASE_URL}/road/add_comment`, requestOptions)
    const result = await response.text()
    return result
  } catch (error) {
    console.log("error", error)
    throw error
  }
}
