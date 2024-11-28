import Link from "next/link"

export default function Home() {
  const introClick = () => {

  }
  return (
    <>
      <div className="w-full h-[1280px]">
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-[-1]">
          <div className="w-[10px] h-[200px]">
          </div>
          <div className="flex justify-center max-sm:hidden max-md:hidden max-lg:hidden max-xl:hidden">
            <div className="w-[1000px] h-[600px] max-xl:h-[400px] max-xl:w-[300px]  bg-[url('/img/chara-left.png')] bg-no-repeat bg-contain bg-left"></div>
            <div className="w-[1200px]"></div>
            <div className="w-[1000px] h-[600px] max-xl:h-[400px] max-xl:w-[300px] bg-[url('/img/chara-right.png')] bg-no-repeat bg-contain bg-right"></div>
          </div>
        </div>
        <div className="relative w-full">
          <div className="w-[90%] max-w-[800px] bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-6 mx-auto mt-10 flex items-center space-x-4">
            <div className="flex-shrink-0 text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M6 18h12m-6-6h.01M3 3h18M4 5a2 2 0 012-2h12a2 2 0 012 2M6 5v14a2 2 0 002 2h8a2 2 0 002-2V5"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">页面开发中 🚧</h2>
              <p className="text-gray-600">
                我们正在努力完善此页面，敬请期待！若有建议，请通过反馈功能联系我们。
              </p>
            </div>
          </div>
          <div className="w-[200px] h-[200px]"></div>
          <div className="flex flex-col justify-center items-center space-y-5">
            <div>
              <Link
                href={'/introduction'}
                className="w-[360px] h-[100px] bg-[url('/img/bg_button.png')] bg-no-repeat bg-cover rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 active:shadow-md transition duration-300 ease-in-out"
              >
                关于我们的项目介绍
              </Link>
            </div>
            <div>
              <Link
                href={'/questionnaire'}
                className="w-[360px] h-[100px] bg-[url('/img/bg_button.png')] bg-no-repeat bg-cover rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 active:shadow-md transition duration-300 ease-in-out"
              >
                开发问卷
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
