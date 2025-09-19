"use client"
import { motion } from "framer-motion";



export default function RoatChiho() {
    return(
        <>
           <motion.img
            src="/img/circle/torikoro.png"
            animate={{
              y: [0, -20, 0],
            }}
            className="w-[400px] max-sm:hidden mx-auto mb-20"
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity
            }}
            onClick={() => alert("不要点你爹")}
           />
             <motion.img
            src="/img/circle/chara.png"
            animate={{
              y: [0, -20, 0],
            }}
            className="w-[380px] sm:hidden mx-auto mb-20"
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity
            }}
            onClick={() => alert("不要点你爹")}
           />
        </>
    )
}