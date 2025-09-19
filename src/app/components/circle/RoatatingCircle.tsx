'use client'
import { motion } from "framer-motion";

/**
 * 旋转圆圈组件 - 实现外层容器旋转和内部子组件自转效果
 * 包含多个动画元素：背景圆圈、星星、瓷砖和中心旋转组件
 */
export default function RoatatingCircle() {


    return (
        <>
            <div className="relative mx-auto z-[1] flex items-center justify-center h-screen">
                <div className="relative w-[1000px] h-[700px] flex items-center justify-center">
                    <motion.img
                        src="/img/circle/circle_white.png"
                        className="absolute z-10 w-[600px] mx-auto"
                        animate={{
                            rotate: -360
                        }}
                        transition={{
                            duration: 120,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    <motion.img
                        src="/img/circle/circle_colorful.png"
                        className="absolute w-[700px] mx-auto"
                        animate={{
                            rotate: -360
                        }}
                        transition={{
                            duration: 100,
                            repeat: Infinity,
                            ease: [0.01, 0.99, 0.28, 0.99]
                        }}
                    />
                    <motion.img
                        src="/img/circle/circle_yellow.png"
                        className="absolute w-[900px] sm:bottom-[-25px] sm:right-[18px]"
                        animate={{
                            rotateZ: [0, 15, -15, 0],
                            rotateY: [0, 10, -10, 0],
                            rotateX: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 80,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "reverse",
                            times: [0, 0.33, 0.66, 1],
                        }}
                        style={{
                            transformStyle: "preserve-3d",
                            perspective: 1500,
                            transformOrigin: "center center",
                        }}
                    />
                    <motion.img
                        src="/img/circle/star_pink.png"
                        className="absolute w-[200px] "
                        animate={{
                            y: [100, -50],
                        }}
                        transition={{
                            duration: 6,
                            delay: 4,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "reverse"
                        }}
                    />
                     <motion.img
                        src="/img/circle/star_pink.png"
                        className="absolute w-[200px] h-[200px]"
                        animate={{
                            y: [100, -50],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 8,
                            delay: 4,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "reverse"
                        }}
                    />
                    <motion.img
                        src="/img/circle/star_yellow.png"
                        className="absolute w-[200px] h-[200px]"
                        animate={{
                            y: [100, -50],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 7,
                            delay: 0.5,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                    />
                    <motion.img
                        src="/img/circle/star_yellow.png"
                        className="absolute w-[200px] h-[200px]"
                        animate={{
                            y: [100, -50],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 10,
                            delay: 5,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                    />
                    <motion.img
                        src="/img/circle/tile_green.png"
                         className="absolute w-[250px] right-[-300px]"
                        animate={{
                            y: [1000, -1000],
                            opacity:[1]
                        }}
                        transition={{
                            duration: 8.5,
                            delay:1.5,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                    />
                    <motion.img
                        src="/img/circle/tile_purple_left.png"
                        className="absolute w-[250px] left-[-300px]"
                        animate={{
                            y: [1000, -1000],
                            opacity:[1]
                        }}
                        transition={{
                            duration: 13,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                    />
                    <motion.img
                        src="/img/circle/tile_purple_right.png"
                        className="absolute w-[150px] right-0"
                        animate={{
                            y: [1000, -1000],
                        }}
                        transition={{
                            duration: 13,
                            delay:0.3,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                    />

                    {/* 外层旋转容器 */}
                    <motion.div
                        id="rotationwrapper"
                        className="absolute mx-auto w-[1000px] h-[1000px]"
                        animate={{
                            rotate: 360
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                        style={{
                            willChange: "transform",
                            width: "400px",
                            height: "400px"
                        }}
                    >
                        {/* 子组件1 - 顶部 */}
                        <motion.div
                            className="absolute top-[-350px] left-1/2 transform -translate-x-1/2"
                            animate={{
                                rotate: -360
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "loop"
                            }}
                            style={{
                                willChange: "transform"
                            }}
                        >
                            <motion.img 
                                src="/img/circle/3d_cube.png"
                                className="w-[100px] z-20"
                                loading="eager"
                            />
                        </motion.div>

                        {/* 子组件2 - 右侧 */}
                        <motion.div
                            className="absolute top-1/2 right-[-230px] transform -translate-y-1/2"
                            animate={{
                                rotate: -360,
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "loop"
                            }}
                            style={{
                                willChange: "transform"
                            }}
                        >
                            <motion.img 
                                src="/img/circle/3d_glove_blue.png"
                                className="w-[60px] z-20"
                                loading="eager"
                            />
                        </motion.div>

                        {/* 子组件3 - 左侧 */}
                        <motion.div
                            className="absolute top-1/2 left-[-130px] transform -translate-y-1/2"
                            animate={{
                                rotate: -360,
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "loop"
                            }}
                            style={{
                                willChange: "transform",
                                transformStyle: "preserve-3d"
                            }}
                        >
                            <motion.img 
                                src="/img/circle/3d_glove_pink.png"
                                className="w-[90px] z-20"
                                loading="eager"
                            />
                        </motion.div>

                        {/* 子组件4 - 左下 */}
                        <motion.div
                            className="absolute bottom-[230px] left-[30px]"
                            animate={{
                                rotate: -360,
                            }}
                            transition={{
                                duration: 12,
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "loop"
                            }}
                            style={{
                                willChange: "transform",
                                transformStyle: "preserve-3d"
                            }}
                        >
                            <motion.img 
                                src="/img/circle/3d_star_small.png"
                                className="w-[30px] z-20"
                                loading="eager"
                            />
                        </motion.div>

                        {/* 子组件5 - 右下 */}
                        <motion.div
                            className="absolute bottom-[130px] right-[30px]"
                            animate={{
                                rotate: -360,
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: "easeInOut",
                                repeatType: "loop"
                            }}
                            style={{
                                willChange: "transform"
                            }}
                        >
                            <motion.img 
                                src="/img/circle/3d_stars.png"
                                className="w-[75px] z-20"
                                loading="eager"
                            />
                        </motion.div>
                    </motion.div>
                    <motion.img
                        src="/img/circle/bg_pattern.png"
                        className="fixed w-[200vw] h-[200vh] z-10"
                        animate={{
                            rotate: 360
                        }}
                        transition={{
                            duration: 240,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        loading="eager"
                    />
                </div>
            </div>
        </>
    )
}