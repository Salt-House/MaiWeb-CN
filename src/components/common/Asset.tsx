"use client"

/**
 * Asset - 复刻 maimai 官网 Zero 框架 el-asset 组件的资源解析规则
 *
 * 官方解析规则 (lib/site.js → Zero.component('el-asset')):
 *   youtube → https://i.ytimg.com/vi/{src}/hqdefault.jpg     (视频缩略图)
 *   near    → /storage/{src}                                 (站内 storage)
 *   far     → https://maimaidx.jp/maimai-mobile/img/Music/{src} (外部曲绘)
 *   site    → /assets/{src}                                  (全站共享素材)
 *   adap    → {page}/assets/{pc|sp}/{src}                    (双端适配图)
 *   url     → 原样直链
 *   默认    → {page}/assets/{src}
 *
 * 另支持官方隐藏特性: src 中的 "$mq" 占位符会被替换为当前设备名 (pc/sp)
 * 官方双端断点: 600px
 */

import { useEffect, useMemo, useState } from "react"
import clsx from "clsx"

/** 官方 Zero.config.storage 镜像 */
const STORAGE = {
  near: "/storage",
  far: "https://maimaidx.jp/maimai-mobile/img/Music",
} as const

export interface AssetProps {
  /** 资源路径, 可含 $mq 占位符 */
  src: string
  alt?: string
  title?: string
  /** 竖版 (官方 extraClass.vert) */
  vert?: boolean
  /** YouTube 缩略图模式 */
  youtube?: boolean
  /** 站内 storage 模式 */
  near?: boolean
  /** 外部曲绘模式 */
  far?: boolean
  /** 全站共享素材模式 (/assets/) */
  site?: boolean
  /** pc/sp 双端适配模式 */
  adap?: boolean
  /** 原样直链模式 */
  url?: boolean
  /** 页面基准目录 (默认 /assets), 官方为每页 SPA 的 {page} */
  page?: string
  loading?: "eager" | "lazy" | "auto"
  className?: string
  width?: number | string
  height?: number | string
  [key: string]: unknown
}

/** 官方 MQDEVICE: ≤600px 为 sp, 否则 pc */
function useMaiDevice(): "pc" | "sp" {
  const [device, setDevice] = useState<"pc" | "sp">("pc")
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)")
    const update = () => setDevice(mq.matches ? "sp" : "pc")
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return device
}

/** 复刻官方 getUrl 逻辑 */
export function resolveAssetSrc(
  props: Pick<AssetProps, "src" | "youtube" | "near" | "far" | "site" | "adap" | "url" | "page">,
  device: "pc" | "sp"
): string {
  const src = props.src.replace(/\$mq\b/g, device)
  const base = props.page ? `/${props.page}/assets` : "/assets"
  if (props.youtube) return `https://i.ytimg.com/vi/${src}/hqdefault.jpg`
  if (props.near) return `${STORAGE.near}/${src}`
  if (props.far) return `${STORAGE.far}/${src}`
  if (props.site) return `/assets/${src}`
  if (props.adap) return `${base}/${device}/${src}`
  if (props.url) return src
  return `${base}/${src}`
}

export default function Asset({
  src,
  alt = "",
  title,
  vert,
  youtube,
  near,
  far,
  site,
  adap,
  url,
  page,
  loading = "auto",
  className,
  width,
  height,
  ...rest
}: AssetProps) {
  const device = useMaiDevice()
  const resolved = useMemo(
    () => resolveAssetSrc({ src, youtube, near, far, site, adap, url, page }, device),
    [src, youtube, near, far, site, adap, url, page, device]
  )

  return (
    <img
      data-el="asset"
      className={clsx("elAsset", vert ? "elAsset-vert" : "elAsset-horz", className)}
      src={resolved}
      alt={alt}
      title={title}
      loading={loading === "auto" ? undefined : loading}
      width={width}
      height={height}
      {...rest}
    />
  )
}
