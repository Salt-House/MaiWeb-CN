"use client"

/**
 * PageTransition 进出场动画增强版
 * 功能:
 * 1. 多种内置 variant (fade / fadeUp / fadeDown / slideLeft / slideRight / scaleFade / none)
 * 2. 可配置 duration / ease / delay / debounceDelay
 * 3. 首屏可选择跳过动画 (skipInitial)
 * 4. 基于 pathname + 防抖生成 stableKey，避免快速路由切换抖动
 * 5. 尊重系统 prefers-reduced-motion 设置，自动降级为简单淡入
 * 6. will-change 优化，减少布局抖动
 */

import { motion, AnimatePresence, useReducedMotion, Variants, Easing } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode, useEffect, useRef, useState } from "react"
import FrozenRouter from "./HOC/FrozenRouter"
import { cn } from "@/lib/utils"

type VariantName =
  | "fade"
  | "fadeUp"
  | "fadeDown"
  | "slideLeft"
  | "slideRight"
  | "scaleFade"
  | "none"

interface PageTransitionProps {
  children: ReactNode
  /** 预设动画名称 */
  variant?: VariantName
  /** 动画时长 (s) */
  duration?: number
  /** framer-motion ease 值 */
  ease?: Easing | Easing[]
  /** 延迟 (s) */
  delay?: number
  /** 是否跳过首屏初始动画（客户端第一次渲染） */
  skipInitial?: boolean
  /** pathname 稳定防抖时间 (ms) */
  debounceDelay?: number
  /** 自定义 className 追加到容器 */
  className?: string
}

const VARIANT_BUILDERS: Record<VariantName, () => Variants> = {
  fade: () => ({
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  }),
  fadeUp: () => ({
    initial: { opacity: 0, y: 16 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -16 },
  }),
  fadeDown: () => ({
    initial: { opacity: 0, y: -16 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: 16 },
  }),
  slideLeft: () => ({
    initial: { opacity: 0, x: 40 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -40 },
  }),
  slideRight: () => ({
    initial: { opacity: 0, x: -40 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 40 },
  }),
  scaleFade: () => ({
    initial: { opacity: 0, scale: 0.96 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.98 },
  }),
  none: () => ({
    initial: { opacity: 1 },
    in: { opacity: 1 },
    out: { opacity: 1 },
  }),
}

export default function PageTransition({
  children,
  variant = "fadeUp",
  duration = 0.45,
  ease = "easeInOut",
  delay = 0,
  skipInitial = true,
  debounceDelay = 60,
  className,
}: PageTransitionProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const isFirstRenderRef = useRef(true)
  const [stableKey, setStableKey] = useState(pathname)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 生成稳定 key：路径变化后等待 debounceDelay 毫秒再确认
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => setStableKey(pathname), debounceDelay)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [pathname, debounceDelay])

  useEffect(() => {
    // 一旦客户端完成第一次渲染，标记为 false
    isFirstRenderRef.current = false
  }, [])

  // reduced motion 时，无论选择什么 variant，都降级到简单淡入
  const chosenVariantName: VariantName = prefersReducedMotion ? "fade" : variant
  const variants = VARIANT_BUILDERS[chosenVariantName]()

  const transition = {
    type: "tween" as const,
    ease,
    duration,
    delay,
  }

  // 首屏可跳过 initial -> in 的过渡，避免闪烁
  const disableInitial = skipInitial && isFirstRenderRef.current

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stableKey}
        {...(!disableInitial && { initial: "initial" })}
        animate="in"
        exit="out"
        variants={variants}
        transition={transition}
        className={cn("min-h-screen w-full", className)}
        style={{ willChange: "transform, opacity" }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  )
}

// Loading transition component
export function LoadingTransition() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex items-center gap-3"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span className="text-lg font-medium">加载中...</span>
      </motion.div>
    </motion.div>
  )
}

// Smooth scroll component
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="scroll-smooth"
    >
      {children}
    </motion.div>
  )
}
