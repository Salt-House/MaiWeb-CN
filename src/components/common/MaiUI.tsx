"use client"

/**
 * MaiTitle - 官网标题横幅雪碧图复刻 (maiTitle/title.png 696x1469, 13格)
 * 官方规则: .maiTitle{width:696px;height:113px} .titleXxx{background-position:0 -N%}
 */
const POS: Record<string, string> = {
  news: "0", // 最新情报
  play: "-100%", // 游玩
  area: "-200%", // 地区
  character: "-300%", // 角色
  song: "-400%", // 乐曲
  taikai: "-500%", // 大会
  goods: "-600%", // 周边
  goodsDl: "-700%", // 乐曲下载
  card: "-800%", // 卡片
  movie: "-900%", // 影像
  err404: "-1100%",
  ranking: "-1200%", // 排行榜
}

export function MaiTitle({ type = "news" }: { type?: keyof typeof POS }) {
  return (
    <h2
      aria-label={type}
      className="mx-auto my-[10px] mb-[30px] w-[min(696px,calc(100%-32px))] font-bold text-2xl text-center aspect-[696/113] bg-no-repeat bg-[url('/assets/maiTitle/title.png')] max-sm:bg-[url('/assets/maiTitle/title_sp.png')] [background-size:100%_1300%]"
      style={{ backgroundPosition: `0 ${POS[type]}`, color: "transparent", userSelect: "none" }}
    />
  )
}

/** 官网 maiPageUp 回到顶部按钮 (素材比例适配) */
export function MaiPageUp() {
  return (
    <button
      aria-label="回到顶部"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed z-[5] bottom-24 right-5 w-12 h-12 bg-no-repeat bg-center bg-contain bg-[url('/assets/maiPageUp/pageup.png')] hover:scale-110 transition-transform max-sm:bottom-28"
    />
  )
}
