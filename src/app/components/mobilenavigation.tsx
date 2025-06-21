'use client'

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { useEffect } from "react";

interface MobileNavigationProps {
  textstroke: React.CSSProperties;
}

export default function MobileNavigation({ textstroke }: MobileNavigationProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userIconId, setUserIconId] = useState<string>("1"); // 默认头像ID

  // 获取用户token和头像信息
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);

      // 获取用户信息
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${storedToken}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      fetch("https://dev.maimai.moe/api/user/me", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          try {
            const data = JSON.parse(result);
            if (data.mai_icon_id) {
              setUserIconId(data.mai_icon_id);
            }
          } catch (error) {
            console.error("获取用户信息失败:", error);
          }
        })
        .catch((error) => console.error(error));
    }
  }, []);

  // 头像URL
  const baseUrl = "https://assets2.lxns.net/maimai";
  const avatarUrl = `${baseUrl}/icon/${userIconId}.png`;
  const defaultAvatarUrl = `${baseUrl}/icon/1.png`;

  return (
    <div className="relative">
      {/* Top Container Back */}
      <div className="absolute inset-0 z-[-1] flex justify-center">
        <div className="max-sm:w-full w-[900px] h-[500px] bg-[url('/img/aurora.png')] bg-no-repeat bg-contain"></div>
      </div>

      {/* 导航栏 */}
      <div className="relative z-[10] max-sm:w-[90%] max-sm:text-xl max-sm:h-14 w-[90%] max-w-[800px] bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-6 mx-auto mt-10 flex items-center justify-between sm:justify-center">
        {/* 移动端汉堡菜单按钮 */}
        <div className="sm:hidden flex items-center">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-blue-500 text-2xl"
          >
            {showMobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* 桌面端导航链接 */}
        <div className="hidden sm:flex items-center max-sm:space-x-3 space-x-4 justify-center text-2xl text-white font-bold">
          <Link id="music" href={"/music"} className="hover:scale-125 transition-all duration-300 ease-in-out text-blue-500" style={textstroke}>音乐</Link>
          <div>|</div>
          <Link id="region" href={"/region"} className="hover:scale-125 transition-all duration-300 ease-in-out text-blue-500" style={textstroke}>区域</Link>
          <div>|</div>
          <Link id="tool" href={"/tool"} className="hover:scale-125 transition-all duration-300 ease-in-out text-blue-500" style={textstroke}>工具</Link>
          <div>|</div>
          <Link id="tool" href={"/qa"} className="hover:scale-125 transition-all duration-300 ease-in-out text-blue-500" style={textstroke}>问题与反馈</Link>
          {/* <div>|</div> */}
          {/* <Link id="guide" href={"/guide"} className="hover:scale-125 transition-all duration-300 ease-in-out text-blue-500" style={textstroke}>教学</Link> */}
        </div>

        {/* 移动端右侧用户头像 */}
        <div className="sm:hidden">
          <Link href="/user/profile">
            <div className="w-8 h-8 rounded-lg overflow-hidden border-2 border-blue-300 shadow-md">
              <img
                src={token ? avatarUrl : defaultAvatarUrl}
                alt="用户头像"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // 如果加载失败，使用默认头像
                  (e.target as HTMLImageElement).src = defaultAvatarUrl;
                }}
              />
            </div>
          </Link>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {showMobileMenu && (
        <div className="sm:hidden absolute z-20 w-[90%] max-w-[410px] mx-auto left-0 right-0 mt-2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col">
            <Link
              href={"/"}
              className="p-4 text-blue-500 font-bold border-b border-gray-200 hover:bg-blue-50"
              onClick={() => setShowMobileMenu(false)}
            >
              主页
            </Link>
            <Link
              href={"/music"}
              className="p-4 text-blue-500 font-bold border-b border-gray-200 hover:bg-blue-50"
              onClick={() => setShowMobileMenu(false)}
            >
              音乐
            </Link>
            <Link
              href={"/region"}
              className="p-4 text-blue-500 font-bold border-b border-gray-200 hover:bg-blue-50"
              onClick={() => setShowMobileMenu(false)}
            >
              区域
            </Link>
            <Link
              href={"/tool"}
              className="p-4 text-blue-500 font-bold border-b border-gray-200 hover:bg-blue-50"
              onClick={() => setShowMobileMenu(false)}
            >
              工具
            </Link>
             <Link
              href={"/qa"}
              className="p-4 text-blue-500 font-bold border-b border-gray-200 hover:bg-blue-50"
              onClick={() => setShowMobileMenu(false)}
            >
              问题与反馈
            </Link>
            {/*<Link*/}
            {/*  href={"/guide"}*/}
            {/*  className="p-4 text-blue-500 font-bold hover:bg-blue-50"*/}
            {/*  onClick={() => setShowMobileMenu(false)}*/}
            {/*>*/}
            {/*  教学*/}
            {/*</Link>*/}
          </div>
        </div>
      )}
    </div>
  );
}