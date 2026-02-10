"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { FaExclamationTriangle, FaRedo, FaHome } from "react-icons/fa"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * 错误边界组件，用于捕获和处理客户端异常
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新状态以显示错误UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 默认错误UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-pink-50 via-white to-purple-50">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-pink-100 p-8 md:p-12 text-center max-w-lg w-full">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-4xl text-red-400" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              哎呀，出错了
            </h2>
            
            <p className="text-gray-500 mb-8 leading-relaxed">
              我们遇到了一些意料之外的问题。请尝试刷新页面，或者稍后再试。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-200 font-medium active:scale-95"
              >
                <FaRedo className="text-sm" />
                刷新页面
              </button>
              
              <button
                onClick={() => (window.location.href = "/")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium active:scale-95"
              >
                <FaHome className="text-sm" />
                返回首页
              </button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-8 text-left bg-gray-50 rounded-xl p-4 border border-gray-100 overflow-hidden">
                <details className="group">
                  <summary className="cursor-pointer text-xs font-mono text-gray-400 select-none group-open:mb-2">
                    开发模式错误详情
                  </summary>
                  <pre className="text-xs text-red-500 overflow-auto whitespace-pre-wrap font-mono">
                    {this.state.error.toString()}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
