"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import CONFIG from "@/config/api"
import { allDoors } from "../_data"
import type { KaleidoscopeDoorData } from "../_data/types"

function DoorItem({ door }: { door: KaleidoscopeDoorData }) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/kaleidoscope/${door.slug}`)}
      className="group flex flex-row max-sm:flex-col w-full py-6 px-4 items-center justify-center cursor-pointer hover:bg-mai-sky/15 transition-colors"
    >
      {/* Left: Door Image */}
      <div className="w-1/3 max-sm:w-full flex justify-center items-center max-sm:mb-4">
        <div className="relative w-32 h-32 max-sm:w-24 max-sm:h-24">
          <Image
            src={door.doorImage}
            alt={door.nameCn}
            fill
            className="object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Right: Text */}
      <div className="w-2/3 max-sm:w-full flex flex-col justify-center max-sm:px-6 text-left max-sm:text-center">
        <h2 className="text-2xl max-sm:text-xl font-bold text-mai-blue-deep mb-3 drop-shadow-sm">
          maimai DX KALEIDXSCOPE:
          <br />
          <span className={door.doorColorClass}>{door.nameCn}</span> 解禁！
        </h2>
        <div className="text-mai-ink text-base leading-relaxed space-y-2">
          <p>
            完成特定条件即可开启{door.nameCn}，挑战新曲：
            {door.bossSong.id > 0 ? (
              <span className="font-bold">
                <Link
                  href={`${CONFIG.API.WEB.MUSIC}/${door.bossSong.id}`}
                  target="_blank"
                  className={`${door.doorColorClass} hover:underline`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {door.bossSong.name}
                </Link>
              </span>
            ) : (
              <span className="font-bold">{door.bossSong.name}</span>
            )}
          </p>
          <p className="text-mai-purple font-bold mt-2 text-base">
            解锁方法、钥匙获取及挑战详情 &gt;&gt;
          </p>
        </div>
      </div>
    </div>
  )
}

const KaleidoscopeCard = () => {
  return (
    <div className="w-full lg:h-full flex justify-center">
      <div className="w-full lg:h-full max-w-[900px] max-sm:w-[90%] lg:flex lg:flex-col">
        <motion.div
          className="relative my-10 w-full lg:flex-1 flex flex-col items-center rounded-2xl overflow-visible"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
  
        >
          {/* MAGiCAL 黄色标头横幅: logo + KALEIDXSCOPE */}
          <motion.div
            className="relative z-10 w-full border-b-4 border-mai-blue-deep bg-mai-yellow py-2 px-4 rounded-t-3xl flex items-center justify-center gap-3"
            initial={{ scale: 0, rotate: -3 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.45, duration: 0.8, delay: 0.2 }}
          >
            <Image
              src="assets/magical/app/logo.png"
              alt="maimai DX Logo"
              width={48}
              height={48}
              priority
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow"
            />
            <span className="text-lg sm:text-2xl font-bold tracking-widest text-mai-blue-deep">
              KALEIDXSCOPE
            </span>
            <Image
              src="/assets/maiDecorationBg/note_02.png"
              alt=""
              width={28}
              height={28}
              className="w-6 h-6 max-sm:hidden"
            />
          </motion.div>

          {/* Background */}
          <motion.div
            className="absolute rounded-3xl inset-x-0 inset-y-0 z-[-1] bg-white/95 border-4 border-mai-blue-deep shadow-2xl"
            animate={{
              boxShadow: [
                "0 25px 50px -12px rgba(1, 45, 123, 0.35)",
                "0 25px 50px -12px rgba(111, 52, 176, 0.30)",
                "0 25px 50px -12px rgba(1, 45, 123, 0.35)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Door List */}
          <div className="relative z-10 w-full lg:flex-1 flex flex-col justify-center">
            {allDoors.map((door, index) => (
              <div key={door.slug}>
                {index > 0 && <hr className="border-t-2 border-dashed border-mai-blue-deep/20 mx-6" />}
                <DoorItem door={door} />
              </div>
            ))}
          </div>

          {/* Decorative star */}
          <motion.div
            className="absolute -top-6 -right-6 w-12 h-12 opacity-40"
            animate={{ rotate: 360, y: [0, -10, 0] }}
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Image
              src="/img/circle/star_yellow.png"
              alt="装饰星星"
              width={48}
              height={48}
              className="w-full h-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default KaleidoscopeCard
