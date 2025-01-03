'use client'

import Link from "next/link";
import AnimatedComponent from "../components/AnimatedComponent";
import { useEffect } from "react";




export default function IntroductionPage() {

    useEffect(() => {
        const now = new Date();
        const hours = now.getUTCHours() + 8; // Convert to East 8th timezone
        if (hours >= 22 && hours < 23) {
          alert("系统正处于开发阶段，每天22:30-23:00为部署测试时间，网站不稳定，您的数据可能不会被记录\n请注意，本问卷仅限于中国大陆地区，如果您不在中国大陆地区，请不要填写");
        }
      }, []);
    
    useEffect(() => {
        document.title = "介绍 - maimai中国玩家站";
    }, []);
    return (
        <>

            <AnimatedComponent>
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-[-1]">
                    <div className="w-[10px] h-[200px]">
                    </div>
                    <div className="flex justify-center max-sm:hidden max-md:hidden max-lg:hidden max-xl:hidden">
                        <div className="w-[1000px] h-[600px] max-xl:h-[400px] max-xl:w-[300px]  bg-[url('/img/chara-left.png')] bg-no-repeat bg-contain bg-left"></div>
                        <div className="w-[1200px]"></div>
                        <div className="w-[1000px] h-[600px] max-xl:h-[400px] max-xl:w-[300px] bg-[url('/img/chara-right.png')] bg-no-repeat bg-contain bg-right"></div>
                    </div>
                </div>
                <div className="relative z-[50] w-full h-[1200px] max-sm:h-[1000px] ">
                    <div className="flex justify-center p-10 items-center text-center w-[1000px] mx-auto text-[50px]  max-sm:w-full max-sm:p-5 max-sm:text-[32px] max-md:w-full max-lg:w-full max-xl:w-full">
                        Welcome to maimai 大中华区玩家站 🧤🧤
                    </div>
                    <div className="flex justify-center w-full h-screen ">
                        <div className="w-[1000px] h-[600px] max-sm:w-[300px] max-sm:h-[600px] max-md:w-[500px] max-2xl:w-[800px] bg-white/50 backdrop-blur-lg shadow-lg rounded-lg p-6 mt-10 transition-all duration-300 ease-in-out hover:bg-white/70 hover:shadow-2xl hover:backdrop-blur-xl hover:scale-105 overflow-auto scrollbar-hide">
                            <h1 className="text-2xl  text-gray-700">Maimai大中华区玩家站</h1>
                            <p className="mt-4 text-gray-500 indent-4 mb-3">
                            我们旨在打造一个为中国Maimai玩家服务的乌蒙大象玩家站🌐，所有开发者都来自wmc群体。
                            </p>
                            <p className="mt-4 text-gray-500 indent-4 mb-3">
                            订阅我们的组织在Github🥰🥰 <a className="underline text-blue-700" href="https://github.com/Salt-House">Salt House</a>
                            </p>
                            <h1 className="text-2xl  text-gray-700">它具有什么功能？</h1>
                            <p className="mt-4 text-gray-500 indent-4">
                                我们的玩家站将集成大部分的开源maimai项目相关功能，我们诚邀各位maimai第三方项目开发者加入我们的开发团队，共同打造一个更好的玩家站。
                            </p>
                            <ul className="list-decimal mt-4 pl-5 text-gray-500 mb-3">
                                <li>将会展示大量的有关maimai的游戏信息，包括但不限于：机厅信息、更新内容、未来可能的更新计划、机厅活动等等</li>
                                <li>将会尽可能提供maimai相关工具，包括但不限于：b50查询，随机段位，牌子完成度等等。<br></br>
                                    <b>注意：我们的这些功能将会在官方提供之后立刻删除⚠️</b>
                                </li>
                            </ul>
                            <h1 className="text-2xl  text-gray-700">帮助我们</h1>
                            <p className="mt-4 text-gray-500 indent-4">
                                我们设计了一套基础问卷，如果您对问卷有任何希望添加的内容请联系我们，问卷计划将在<b>12.1号</b>发布。
                                在发布问卷期间，我们依旧会对问卷的内容有所更新。
                                <a href="mailto:tokiya@tokya.online?subject=问卷反馈" className="text-blue-500 underline hover:text-blue-700">
                                    向我们发送邮件告知您的意见
                                </a>
                            </p>
                            <div>
                                <Link
                                    href={'/questionnaire'}
                                    className="w-[144px] h-[40px] bg-[url('/img/bg_button.png')] bg-no-repeat bg-cover rounded-full flex items-center justify-center text-white  text-lg shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 active:shadow-md transition duration-300 ease-in-out"
                                >
                                    开发问卷
                                </Link>
                            </div>
                            <div className="w-full mx-auto mt-5 text-center  text-2xl text-red-500">
                                我们的项目将在2025.1.1 00:00:00正式启动
                            </div>
                        </div>
                    </div>
                </div>

            </AnimatedComponent>
        </>
    )
}