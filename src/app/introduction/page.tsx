import AnimatedComponent from "../components/AnimatedComponent";



export default function IntroductionPage() {
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
                    <div className="flex justify-center p-10 items-center text-center w-[1000px] mx-auto text-[50px] font-bold max-sm:w-full max-sm:p-5 max-sm:text-[32px] max-md:w-full max-lg:w-full max-xl:w-full">
                        Welcome to maimai 大中华区玩家站
                    </div>
                    <div className="flex justify-center w-full h-screen ">
                        <div className="w-[1000px] h-[600px] max-sm:w-[300px] max-sm:h-[600px] max-md:w-[500px] max-2xl:w-[800px] bg-white/50 backdrop-blur-lg shadow-lg rounded-lg p-6 mt-10 transition-all duration-300 ease-in-out hover:bg-white/70 hover:shadow-2xl hover:backdrop-blur-xl hover:scale-105 overflow-auto scrollbar-hide">
                            <h1 className="text-2xl font-bold text-gray-700">Maimai大中华区玩家站</h1>
                            <p className="mt-4 text-gray-500 indent-4 mb-3">
                                我们旨在打造一个为中国Maimai玩家服务的乌蒙大象玩家站，所有开发者都来自wmc群体。
                            </p>
                            <h1 className="text-2xl font-bold text-gray-700">它具有什么功能？</h1>
                            <p className="mt-4 text-gray-500 indent-4">
                                我们的玩家站将集成大部分的开源maimai项目相关功能，我们诚邀各位maimai第三方项目开发者加入我们的开发团队，共同打造一个更好的玩家站。
                            </p>
                            <ul className="list-decimal mt-4 pl-5 text-gray-500 mb-3">
                                <li>将会展示大量的有关maimai的游戏信息，包括但不限于：机厅信息、更新内容、未来可能的更新计划、机厅活动等等</li>
                                <li>将会尽可能提供maimai相关工具，包括但不限于：b50查询，随机段位，牌子完成度等等。<br></br>
                                    <b>注意：我们的这些功能将会在官方提供之后立刻删除</b>
                                </li>
                            </ul>
                            <h1 className="text-2xl font-bold text-gray-700">帮助我们</h1>
                            <p className="mt-4 text-gray-500 indent-4">
                                我们设计了一套基础问卷，如果您对问卷有任何希望添加的内容请联系我们，问卷计划将在<b>12.1号</b>发布。
                                在发布问卷期间，我们依旧会对问卷的内容有所更新。
                                <a href="mailto:tokiya@tokya.online?subject=问卷反馈" className="text-blue-500 underline hover:text-blue-700">
                                    向我们发送邮件告知您的意见
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

            </AnimatedComponent>
        </>
    )
}