"use client"

import React, { useEffect, useRef, useState } from "react"
import { FaDownload } from "react-icons/fa"

type DownloadVariant = "primary" | "accent" | "outline" | "ghost"
type DownloadShape = "circle" | "pill" | "rect"

interface DownloadButtonProps {
  /** 资源地址（同源或已配置 CORS） */
  url: string
  /** 保存的文件名，缺省时尝试从 URL 解析 */
  filename?: string
  /** 样式变体：显式声明，替代对 className 的字符串探测 */
  variant?: DownloadVariant
  /** 形状：circle 图标圆钮 / pill 胶囊（配 children）/ rect 矩形 */
  shape?: DownloadShape
  className?: string
  disabled?: boolean
  children?: React.ReactNode
  onDownloadStart?: () => void
  onDownloadEnd?: () => void
  onSuccess?: () => void
  onError?: (error: Error) => void
}

// 与 Button.tsx 加载态、PreviewModal 加载圈一致的风格（border 环 + animate-spin）
const Spinner = ({ className = "" }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
  />
)

const VARIANT_CLASSES: Record<DownloadVariant, string> = {
  primary:
    "bg-mai-purple text-white shadow-sm hover:bg-mai-indigo hover:shadow-md focus-visible:ring-mai-purple-light",
  accent:
    "bg-mai-rose text-white shadow-sm hover:bg-mai-rose-deep hover:shadow-md focus-visible:ring-mai-pink-soft",
  outline:
    "bg-white text-mai-blue-deep border-2 border-mai-blue-deep/50 shadow-sm hover:bg-mai-yellow/40 hover:border-mai-blue-deep focus-visible:ring-mai-blue",
  ghost: "text-mai-blue-deep hover:bg-black/5 focus-visible:ring-mai-blue",
}

const SHAPE_CLASSES: Record<DownloadShape, string> = {
  circle: "w-12 h-12 rounded-full text-sm font-semibold",
  pill: "px-3 py-1.5 rounded-full text-sm font-medium",
  rect: "px-4 py-2 rounded-lg text-sm font-medium",
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  url,
  filename,
  variant = "primary",
  shape = "rect",
  className = "",
  disabled = false,
  children,
  onDownloadStart,
  onDownloadEnd,
  onSuccess,
  onError,
}) => {
  const [isDownloading, setIsDownloading] = useState(false)
  // null = 服务器未提供 Content-Length，只能显示不确定进度
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // 卸载时中断进行中的下载，避免内存泄漏与卸载后 setState
  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  // 内置错误提示，自动消退，不依赖父组件兜底
  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(null), 4000)
    return () => clearTimeout(timer)
  }, [error])

  const isSameOrigin = (target: string) => {
    try {
      return new URL(target, window.location.origin).origin === window.location.origin
    } catch {
      return false
    }
  }

  const filenameFromUrl = (target: string) => {
    try {
      const last = new URL(target, window.location.origin).pathname
        .split("/")
        .filter(Boolean)
        .pop()
      return last ? decodeURIComponent(last) : undefined
    } catch {
      return undefined
    }
  }

  const triggerAnchorDownload = (href: string, name?: string) => {
    const link = document.createElement("a")
    link.href = href
    if (name) link.download = name
    link.rel = "noopener"
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isDownloading || disabled) return

    if (!url) {
      setError("下载地址无效")
      onError?.(new Error("下载地址无效"))
      return
    }

    const controller = new AbortController()
    abortRef.current = controller
    setError(null)
    setProgress(null)
    setIsDownloading(true)
    onDownloadStart?.()

    try {
      const finalName = filename ?? filenameFromUrl(url)

      // 同源资源：直接走原生 <a download>，浏览器自带进度条，文件不占用页面内存
      if (isSameOrigin(url)) {
        triggerAnchorDownload(url, finalName)
        onSuccess?.()
        return
      }

      // 跨源资源：需 fetch 为 Blob 才能自定义文件名；流式读取以提供进度反馈
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) throw new Error(`服务器返回 ${response.status}`)

      const total = Number(response.headers.get("content-length")) || 0
      const reader = response.body?.getReader()
      if (!reader) throw new Error("当前浏览器不支持流式下载")

      const chunks: Uint8Array[] = []
      let received = 0
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        received += value.length
        setProgress(total > 0 ? Math.min(received / total, 0.99) : null)
      }

      // TS 5.7+ 中 Uint8Array<ArrayBufferLike> 与 BlobPart 的泛型不兼容，运行时无碍
      const blob = new Blob(chunks as unknown as BlobPart[])
      const objectUrl = URL.createObjectURL(blob)
      triggerAnchorDownload(objectUrl, finalName)
      URL.revokeObjectURL(objectUrl)
      onSuccess?.()
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      const message =
        err instanceof TypeError
          ? "无法访问资源（网络或跨域限制）"
          : err instanceof Error
            ? err.message
            : "网络错误"
      console.error("下载失败:", err)
      setError(message)
      onError?.(err instanceof Error ? err : new Error(message))
    } finally {
      abortRef.current = null
      setIsDownloading(false)
      setProgress(null)
      onDownloadEnd?.()
    }
  }

  const progressLabel = progress !== null ? `${Math.round(progress * 100)}%` : "下载中"

  // 下载中内容：圆钮空间有限，已知进度时只显示百分比；未知时显示 spinner。
  // 胶囊/矩形则 spinner + 进度文字并排。
  let content: React.ReactNode
  if (isDownloading) {
    content =
      shape === "circle" ? (
        progress !== null ? (
          <span className="tabular-nums">{progressLabel}</span>
        ) : (
          <Spinner className="w-5 h-5" />
        )
      ) : (
        <>
          <Spinner className="w-3.5 h-3.5" />
          <span className="tabular-nums">{progressLabel}</span>
        </>
      )
  } else {
    content = children || <FaDownload className={shape === "circle" ? "size-5" : undefined} />
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled || isDownloading}
        aria-busy={isDownloading}
        aria-label={children ? undefined : isDownloading ? "正在下载" : "下载"}
        title={children ? undefined : isDownloading ? "正在下载" : "下载"}
        className={`inline-flex select-none items-center justify-center gap-1.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${SHAPE_CLASSES[shape]} ${VARIANT_CLASSES[variant]} ${className}`}
      >
        {content}
      </button>

      {/* 错误提示：组件内置兜底，4 秒后自动消退 */}
      {error && (
        <div
          role="alert"
          className="absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-mai-red px-3 py-1.5 text-xs font-medium text-white shadow-lg"
        >
          下载失败：{error}
        </div>
      )}

      {/* 屏幕阅读器状态播报（仅播报阶段变化，不含百分比，避免刷屏） */}
      <span role="status" aria-live="polite" className="sr-only">
        {isDownloading ? "正在下载" : error ? `下载失败，${error}` : ""}
      </span>
    </div>
  )
}

export default DownloadButton
