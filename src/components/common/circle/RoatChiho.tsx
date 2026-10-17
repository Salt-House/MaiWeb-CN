"use client"
import { motion } from "framer-motion"

export default function RoatChiho() {
  return (
    <>
      <motion.img
        src="assets/magical/app/img.png"
        animate={{
          y: [0, -20, 0],
        }}
        className="relative z-10 w-[500px] max-w-[90%] max-sm:hidden mx-auto mb-4"
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        onClick={() => alert("不要点你爹")}
      />
      <motion.img
          src="assets/magical/app/img.png"
          animate={{
          y: [0, -20, 0],
        }}
        className="relative z-10 w-[75%] sm:hidden mx-auto mb-4"
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        onClick={() => alert("不要点你爹")}
      />
    </>
  )
}
