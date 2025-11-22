"use client"

import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "gradient" | "outline" | "ghost"
  size?: "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
  rounded?: boolean
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  leftIcon,
  rightIcon,
  loading = false,
  rounded = false,
  className = "",
  disabled,
  ...props
}) => {
  // 基础样式
  let baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 "
  baseClasses += "focus:outline-none focus:ring-2 focus:ring-offset-2 "
  baseClasses += "disabled:opacity-50 disabled:cursor-not-allowed "
  baseClasses += "select-none transform active:scale-95 "

  // 大小样式
  switch (size) {
    case "sm":
      baseClasses += "text-sm px-3 py-1.5 gap-1 "
      break
    case "md":
      baseClasses += "text-base px-4 py-2 gap-2 "
      break
    case "lg":
      baseClasses += "text-lg px-6 py-3 gap-3 "
      break
    case "xl":
      baseClasses += "text-xl px-8 py-4 gap-4 "
      break
  }

  // 圆角样式
  if (rounded) {
    baseClasses += "rounded-full "
  } else {
    if (size === "sm" || size === "md") {
      baseClasses += "rounded-lg "
    } else {
      baseClasses += "rounded-xl "
    }
  }

  // 变体样式
  let variantClasses = ""
  switch (variant) {
    case "primary":
      variantClasses = "bg-white text-gray-800 border-4 border-[rgb(155,244,236)] "
      variantClasses += "hover:bg-gray-50 hover:border-[rgb(135,224,216)] hover:shadow-lg "
      variantClasses += "active:border-[rgb(115,204,196)] focus:ring-[rgb(155,244,236)]"
      break
    case "secondary":
      // TODO 规范：移除渐变色变体，统一纯色主题；必要时使用阴影替代
      variantClasses =
        "bg-gradient-to-r from-blue-400 to-purple-500 text-white border-2 border-white/20 "
      variantClasses += "hover:from-blue-500 hover:to-purple-600 hover:shadow-xl "
      variantClasses += "active:from-blue-600 active:to-purple-700 focus:ring-purple-300"
      break
    case "accent":
      // TODO 规范：移除渐变色变体，统一纯色主题
      variantClasses =
        "bg-gradient-to-r from-pink-400 to-orange-400 text-white border-2 border-white/30 "
      variantClasses += "hover:from-pink-500 hover:to-orange-500 hover:shadow-xl "
      variantClasses += "active:from-pink-600 active:to-orange-600 focus:ring-pink-300"
      break
    case "gradient":
      // TODO 规范：移除渐变色变体，统一纯色主题
      variantClasses = "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-white "
      variantClasses += "hover:from-blue-500 hover:via-purple-600 hover:to-pink-500 "
      variantClasses += "hover:shadow-xl hover:shadow-purple-500/25 "
      variantClasses +=
        "active:from-blue-600 active:via-purple-700 active:to-pink-600 focus:ring-purple-300"
      break
    case "outline":
      variantClasses = "bg-transparent border-2 border-[rgb(155,244,236)] text-gray-700 "
      variantClasses += "hover:bg-[rgb(155,244,236)]/10 hover:border-[rgb(135,224,216)] "
      variantClasses += "active:bg-[rgb(155,244,236)]/20 focus:ring-[rgb(155,244,236)]"
      break
    case "ghost":
      variantClasses = "bg-transparent text-gray-700 hover:bg-white/50 "
      variantClasses += "active:bg-white/70 focus:ring-gray-300"
      break
  }

  const finalClassName = `${baseClasses}${variantClasses} ${className}`.trim()

  return (
    <button className={finalClassName} disabled={disabled || loading} {...props}>
      {loading && (
        <div className="mr-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}

      <span className="flex-1">{children}</span>

      {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  )
}

export default Button
