import React, { useEffect, useRef, useState } from "react"

interface TextScrollerProps {
  text: string
  speed?: number
  delay?: number
}

const TextScroller: React.FC<TextScrollerProps> = ({ text, speed = 10, delay = 2 }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [scrollNeeded, setScrollNeeded] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const [textWidth, setTextWidth] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    const textEl = textRef.current
    if (!el || !textEl) return

    // 检查是否需要滚动
    const needsScroll = textEl.scrollWidth > el.clientWidth
    setScrollNeeded(needsScroll)

    // 获取容器和文本宽度，用于计算动画
    if (needsScroll) {
      setContainerWidth(el.clientWidth)
      setTextWidth(textEl.scrollWidth)
    }

    // 当窗口大小变化时重新检查
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (!el || !textEl) return
        setScrollNeeded(textEl.scrollWidth > el.clientWidth)
        setContainerWidth(el.clientWidth)
        setTextWidth(textEl.scrollWidth)
      }, 200)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [text])

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden whitespace-nowrap">
      {scrollNeeded ? (
        <div
          className="inline-block animate-marquee"
          style={{
            animationDuration: `${speed}s`,
            animationDelay: `${delay}s`,
          }}
        >
          <span ref={textRef} className="inline-block">
            {text}
          </span>
          <span className="inline-block ml-8">{text}</span>
        </div>
      ) : (
        <span ref={textRef} className="inline-block truncate">
          {text}
        </span>
      )}
    </div>
  )
}

export default TextScroller
