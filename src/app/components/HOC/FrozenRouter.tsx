"use client"

import { ReactNode, useContext, useRef } from "react"
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime"

const FrozenRouter = ({ children }: { children: ReactNode }) => {
  const context = useContext(LayoutRouterContext)
  const frozen = useRef(context).current

  // 只有当上下文发生变化（即路由跳转导致父级context更新）时才需要强制使用冻结的context
  // 这样可以减少不必要的Provider渲染，缓解 "Detected multiple renderers" 警告
  if (frozen === context) {
    return <>{children}</>
  }

  return <LayoutRouterContext.Provider value={frozen}>{children}</LayoutRouterContext.Provider>
}

export default FrozenRouter
