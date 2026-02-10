import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "更新日志 | 乌蒙大象中文玩家站",
  description: "查看MaiWeb中文玩家站的最新更新与功能改进日志",
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
