'use client'

import Navigation from '../components/Navigation';
import StarMove from '@/app/components/StarMove'
import Link from 'next/link'

export default function MusicPage() {
  return (
    <>
      <div className="w-full  overflow-auto scroll-smooth">
        {/* BackGround Layer */}
        <div className="fixed top-0 left-0 w-full h-full  z-[-2]">
          <div className="w-[10px] h-[200px]">
          </div>
          <div className="flex justify-center max-sm:hidden max-md:hidden max-lg:hidden max-xl:hidden">
            <div
              className="w-[1000px] h-[600px] max-xl:h-[400px] max-xl:w-[300px]  bg-[url('/img/chara-left.png')] bg-no-repeat bg-contain bg-left"></div>
            <div className="w-[1200px]"></div>
            <div
              className="w-[1000px] h-[600px] max-xl:h-[400px] max-xl:w-[300px] bg-[url('/img/chara-right.png')] bg-no-repeat bg-contain bg-right"></div>
          </div>
        </div>
        <StarMove/>
        <div className="fixed w-full h-full mt-[-80px] bg-[url('/img/bg_pattern.png')] z-[-3] animate-moveDot"></div>
        {/* Main Layer */}
        <div className="relative w-full">
          {/* Top Container Back */}
          <div className="absolute inset-0 z-[-1] flex justify-center ">
            <div className="w-[900px] h-[500px] bg-[url('/img/aurora.png')] bg-no-repeat bg-contain"></div>
          </div>
          {/* Top Container */}
          <Navigation/>

          {/* Control */}
          <div className="w-[200px] h-[1000px]"></div>

          <div className="fixed top-0 left-0 w-full h-full overflow-auto bg-[url('/img/bg_shines.png')]">
            <Link href="/" className="top-4 left-4 size-44">
              <div
                className="fixed top-4 left-4 size-44 bg-[url('/img/moon.png')] bg-no-repeat bg-contain flex justify-center items-center cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out">
                <img src="/img/logo.png" alt="logo"/>
              </div>
            </Link>
          </div>

          <Link href={"/user"}>
            <div
              className="fixed top-4 right-4 size-44  bg-[url('/img/user.png')] bg-no-repeat bg-contain hover:scale-125 transition-all duration-300 ease-in-out">
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}