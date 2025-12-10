// utils/request.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"
import { CONFIG } from "@/config/api"

const isServer = typeof window === "undefined"

const baseURL = CONFIG.API.BASE

// 扩展 AxiosRequestConfig 类型以支持重试配置
interface RetryConfig extends InternalAxiosRequestConfig {
  retry?: number
  retryDelay?: number
  __retryCount?: number
}

class Http {
  // Axios 实例
  private instance: AxiosInstance

  //   构造函数初始化 Axios 实例和拦截器
  constructor() {
    // 创建 Axios 实例
    this.instance = axios.create({
      baseURL, // 基础 URL
      timeout: 10000, // 请求超时时间
      withCredentials: true, // 允许跨域携带 cookie
    })

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 添加 token
        const token = !isServer ? localStorage.getItem("token") : null
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 可根据返回结构自定义
        if (response.data.code !== undefined && response.data.code !== 0) {
          console.warn("业务错误:", response.data.message)
          return Promise.reject(response.data)
        }
        return response.data
      },
      async error => {
        // 处理 401、500 等
        if (error.response) {
          const { status } = error.response
          if (status === 401 && !isServer) {
            window.location.href = "/login"
          }
        }

        // 重试逻辑
        const config = error.config as RetryConfig
        if (!config || !config.retry) return Promise.reject(error)

        config.__retryCount = config.__retryCount || 0

        if (config.__retryCount >= config.retry) {
          return Promise.reject(error)
        }

        config.__retryCount += 1

        const backoff = new Promise(resolve => {
          setTimeout(() => {
            resolve(null)
          }, config.retryDelay || 1000)
        })

        await backoff
        return this.instance(config)
      }
    )
  }

  // TODO 优化：为 `params` 指定具体类型，避免使用 any；同时考虑在调用处通过泛型约束返回数据结构
  get<T>(url: string, params?: any, config?: AxiosRequestConfig & { retry?: number }): Promise<T> {
    return this.instance.get(url, { params, ...config })
  }

  // TODO 优化：为 `data` 指定明确的类型；建议统一返回类型结构并在此处做最小封装，避免过度耦合响应拦截器
  post<T>(url: string, data?: any, config?: AxiosRequestConfig & { retry?: number }): Promise<T> {
    return this.instance.post(url, data, config)
  }

  // TODO 优化：避免 `any`；考虑将 `AxiosRequestConfig` 透传并在调用侧定义数据模型
  put<T>(url: string, data?: any, config?: AxiosRequestConfig & { retry?: number }): Promise<T> {
    return this.instance.put(url, data, config)
  }

  delete<T>(url: string, config?: AxiosRequestConfig & { retry?: number }): Promise<T> {
    return this.instance.delete(url, config)
  }
}

// 创建一个单例实例
const http = new Http()
// 导出实例
export default http
