import { ReactNode, useEffect, useRef, useState } from "react"
import domtoimage from "dom-to-image"
import LoadingSpinner from "./LoadingSpinner"
import { UserProfile } from "../user/model"
import { CONFIG } from "@/config/api"

interface MusicGradeProps {
  id: number
  title: string
  level: string
  level_index: number
  level_value: number
  achievements: number
  fc: number | null
  fs: number
  dx_score: number
  dx_rating: number
  rate: number
  type: string
}

let baseUrl = CONFIG.ASSETS.MAIMAI.BASE

interface ShareableImageSubProps extends MusicGradeProps {
  index: number
}

export function ShareableImageSub(props: ShareableImageSubProps) {
  let levelColor: string = "bg-green-500"
  let nameColor: string = "bg-green-500"
  let fc = null
  let fs = null
  let stars = 0
  let achievements = null
  let textstroke: React.CSSProperties = {
    textShadow:
      "-1px -1px 2px rgba(128, 90, 213, 1), 1px -1px 2px rgba(128, 90, 213, 1), -1px 1px 1px rgba(128, 90, 213, 1), 1px 1px 1px rgba(128, 90, 213, 1)",
  }
  let GradeColor = {
    textShadow: `
          -1px -1px 1px rgba(255, 215, 0, 1),
          1px -1px 1px rgba(255, 215, 0, 1),
          -1px 1px 0.5px rgba(255, 69, 0, 1),
          1px 1px 0.5px rgba(255, 69, 0, 1)
        `,
  }
  let bg = "bg-purple-500"
  switch (props.level_index) {
    case 0:
      levelColor = "bg-green-500"
      nameColor = "text-green-500"
      textstroke = {
        textShadow:
          "-2px -2px 4px rgba(34, 197, 94, 1), 2px -2px 4px rgba(34, 197, 94, 1), -2px 2px 2px rgba(34, 197, 94, 1), 2px 2px 2px rgba(34, 197, 94, 1)",
      }
      bg = "bg-green-500"
      break
    case 1:
      levelColor = "bg-yellow-500"
      nameColor = "text-white"
      textstroke = {
        textShadow:
          "-2px -2px 4px rgba(234, 179, 8, 1), 2px -2px 4px rgba(234, 179, 8, 1), -2px 2px 2px rgba(234, 179, 8, 1), 2px 2px 2px rgba(234, 179, 8, 1)",
      }
      bg = "bg-yellow-500"
      break
    case 2:
      levelColor = "bg-red-500"
      nameColor = "text-white"
      textstroke = {
        textShadow:
          "-2px -2px 4px rgba(239, 68, 68, 1), 2px -2px 4px rgba(239, 68, 68, 1), -2px 2px 2px rgba(239, 68, 68, 1), 2px 2px 2px rgba(239, 68, 68, 1)",
      }
      bg = "bg-red-500"
      break
    case 3:
      levelColor = "bg-purple-500"
      nameColor = "text-white"
      textstroke = {
        textShadow:
          "-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)",
      }
      bg = "bg-purple-500"
      break
    case 4:
      levelColor = "bg-purple-500"
      nameColor = "text-white"

      textstroke = {
        textShadow:
          "-2px -2px 2px rgba(255, 255, 255, 1), 2px -2px 2px rgba(255, 255, 255, 1), -2px 2px 2px rgba(255, 255, 255, 1), 2px 2px 2px rgba(255, 255, 255, 1)",
      }
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
  switch (true) {
    case props.achievements >= 100.5:
      achievements = "/img/grade/sssp.webp"
      break
    case props.achievements >= 100:
      achievements = "/img/grade/sss.webp"
      break
    case props.achievements >= 99.5:
      achievements = "/img/grade/ssp.webp"
      break
    case props.achievements >= 99:
      achievements = "/img/grade/ss.webp"
      break
    case props.achievements >= 98:
      achievements = "/img/grade/sp.webp"
      break
    case props.achievements >= 97:
      achievements = "/img/grade/s.webp"
      break
    case props.achievements >= 94:
      achievements = "/img/grade/aaa.webp"
      break
    case props.achievements >= 90:
      achievements = "/img/grade/aa.webp"
      break
    case props.achievements >= 80:
      achievements = "/img/grade/a.webp"
      break
    default:
      achievements = null
      break
  }
  return (
    <>
      <div className="w-[280px] h-[110px] m-2 border-white border-2 rounded-xl">
        <div className="relative w-full text-white h-full border-2 border-blue-500 rounded-xl flex">
          <div className={`absolute z-[-2] w-full h-full ${bg}`}></div>
          <div className="absolute z-[-1] w-full h-full">
            <div className="absolute bottom-0 w-full h-[20px] bg-white"></div>
          </div>
          <div className="m-1 rounded-2xl border-white border-4">
            <div className=" border-4 rounded-xl bg-blue-500 border-blue-500">
              {/* TODO 优化：改用 `next/image` 并在 next.config.ts 中配置远程域名，以获得自动优化与缓存 */}
              <img
                className="size-20 rounded-xl"
                src={`${baseUrl}/jacket/${props.id}.png`}
                crossOrigin="anonymous"
                alt={props.title}
              />
            </div>
          </div>
          <div className="pt-1">
            <p className={`w-[130px] truncate text-sm ${nameColor}`}>{props.title}</p>
            <hr className="border-dashed" />
            <div className={`text-2xl flex font-bold ${nameColor}`}>
              <p className="w-[100px]">{props.achievements}</p>
              {/* TODO 优化：改用 `next/image`；将评分勋章使用静态导入，避免运行时路径错误 */}
              <img src={`${achievements}`} className="w-[70px]" alt="" />{" "}
            </div>
            <div className="text-sm flex">
              <p>DxScore: {props.dx_score}</p>
            </div>
            <div className="font-bold mt-1 flex items-center text-black">
              <p className="w-[30px]">#{props.index + 1}</p>
              <p className="w-[80px] text-sm">
                {props.level_value}-{">"}
                {props.dx_rating}
              </p>
              {fc != null ? (
                <>
                  {/* TODO 优化：改用 `next/image`；统一资源路径管理 */}
                  <img src={fc} className="w-[22px] h-[22px]" alt="" />
                </>
              ) : (
                <div className="w-[15px] h-[15px] rounded-full bg-gray-500"></div>
              )}
              {fs != null ? (
                <>
                  {/* TODO 优化：改用 `next/image`；统一资源路径管理 */}
                  <img src={fs} className="w-[22px] h-[22px]" alt="" />
                </>
              ) : (
                <div className="w-[15px] h-[15px] rounded-full bg-gray-300"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
