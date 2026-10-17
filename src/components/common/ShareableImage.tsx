import { CONFIG } from "@/config/api"
import Image from "next/image"

interface MusicGradeProps {
  id: number
  title: string
  level: string
  level_index: number
  level_value: number
  achievements: number | string
  fc: number | null
  fs: number
  dx_score: number
  dx_rating: number
  rate: number
  type: string
}

const baseUrl = CONFIG.ASSETS.MAIMAI.BASE

interface ShareableImageSubProps extends MusicGradeProps {
  index: number
}

export function ShareableImageSub(props: ShareableImageSubProps) {
  let nameColor: string = "bg-green-500"
  let fc = null
  let fs = null
  let achievements = null
  let bg = "bg-purple-500"
  switch (props.level_index) {
    case 0:
      nameColor = "text-green-500"
      bg = "bg-green-500"
      break
    case 1:
      nameColor = "text-white"
      bg = "bg-yellow-500"
      break
    case 2:
      nameColor = "text-white"
      bg = "bg-red-500"
      break
    case 3:
      nameColor = "text-white"
      bg = "bg-purple-500"
      break
    case 4:
      nameColor = "text-white"
      bg = "bg-[rgb(211,172,250)]"
      break
  }
  switch (props.fc) {
    case 0:
      fc = "/img/grade/app.webp"
      break
    case 1:
      fc = "/img/grade/ap.webp"
      break
    case 2:
      fc = "/img/grade/fcp.webp"
      break
    case 3:
      fc = "/img/grade/fc.webp"
      break
    default:
      fc = null
      break
  }
  switch (props.fs) {
    case 0:
      fs = "/img/grade/sync.webp"
      break
    case 1:
      fs = "/img/grade/fs.webp"
      break
    case 2:
      fs = "/img/grade/fsp.webp"
      break
    case 3:
      fs = "/img/grade/fsd.webp"
      break
    default:
      fs = "/img/grade/fsdp.webp"
      break
  }
  const numericAchievements = Number(props.achievements)
  switch (true) {
    case numericAchievements >= 100.5:
      achievements = "/img/grade/sssp.webp"
      break
    case numericAchievements >= 100:
      achievements = "/img/grade/sss.webp"
      break
    case numericAchievements >= 99.5:
      achievements = "/img/grade/ssp.webp"
      break
    case numericAchievements >= 99:
      achievements = "/img/grade/ss.webp"
      break
    case numericAchievements >= 98:
      achievements = "/img/grade/sp.webp"
      break
    case numericAchievements >= 97:
      achievements = "/img/grade/s.webp"
      break
    case numericAchievements >= 94:
      achievements = "/img/grade/aaa.webp"
      break
    case numericAchievements >= 90:
      achievements = "/img/grade/aa.webp"
      break
    case numericAchievements >= 80:
      achievements = "/img/grade/a.webp"
      break
    default:
      achievements = null
      break
  }
  return (
    <>
      <div className="w-full h-[110px] border-white border-2 rounded-xl overflow-hidden relative">
        <div className="relative w-full text-white h-full border-2 border-blue-500 rounded-xl flex">
          <div className={`absolute z-[-2] w-full h-full ${bg}`}></div>
          <div className="absolute z-[-1] w-full h-full">
            <div className="absolute bottom-0 w-full h-[20px] bg-white"></div>
          </div>
          <div className="m-1 rounded-2xl border-white border-4 shrink-0">
            <div className=" border-4 rounded-xl bg-blue-500 border-blue-500">
              <Image
                className="size-20 rounded-xl"
                src={`${baseUrl}/jacket/${props.id}.png`}
                width={80}
                height={80}
                alt={props.title}
                unoptimized // 暂时保留 unoptimized 以避免跨域/配置问题，后续可在 next.config.ts 中配置
              />
            </div>
          </div>
          <div className="pt-1 flex-1 min-w-0 pr-2 flex flex-col">
            <p className={`w-full truncate text-sm ${nameColor}`}>{props.title}</p>
            <hr className="border-dashed my-0.5" />
            <div className={`flex items-center justify-between ${nameColor} flex-1`}>
              <div className="flex flex-col justify-center">
                <span className="text-2xl font-bold leading-none">{props.achievements}</span>
                <span className="text-xs mt-0.5">DxScore: {props.dx_score}</span>
              </div>
              {achievements && (
                <Image
                  src={achievements}
                  className="h-10 w-auto object-contain"
                  width={40}
                  height={40}
                  alt="rank"
                  unoptimized
                />
              )}
            </div>
            <div className="font-bold mt-1 flex items-center text-black justify-between">
              <div className="flex items-center">
                <p className="w-[30px]">#{props.index + 1}</p>
                <p className="text-sm">
                  {props.level_value}-{">"}
                  {props.dx_rating}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {fc != null ? (
                  <Image
                    src={fc}
                    className="w-[22px] h-[22px]"
                    width={22}
                    height={22}
                    alt=""
                    unoptimized
                  />
                ) : (
                  <div className="w-[15px] h-[15px] rounded-full bg-gray-500"></div>
                )}
                {fs != null ? (
                  <Image
                    src={fs}
                    className="w-[22px] h-[22px]"
                    width={22}
                    height={22}
                    alt=""
                    unoptimized
                  />
                ) : (
                  <div className="w-[15px] h-[15px] rounded-full bg-gray-300"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
