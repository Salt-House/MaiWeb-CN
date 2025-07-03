// utils/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const isServer = typeof window === 'undefined'

const baseURL = process.env.NEXT_PUBLIC_API_BASE || 'https://api.example.com'

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
      (config) => {
        // 添加 token
        const token = !isServer ? localStorage.getItem('token') : null
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 可根据返回结构自定义
        if (response.data.code !== 0) {
          console.warn('业务错误:', response.data.message)
          return Promise.reject(response.data)
        }
        return response.data
      },
      (error) => {
        // 处理 401、500 等
        if (error.response) {
          const { status } = error.response
          if (status === 401 && !isServer) {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, { params, ...config })
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }
}


// 创建一个单例实例
const http = new Http()
// 导出实例
export default http
