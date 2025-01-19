"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ChinaMap from '../components/ChinaMap';

interface FunctionStatus {
  BUpdate: boolean,
  CycleReport: boolean,
  RatingPush: boolean,
  AIRecommend: boolean,
}

export default function UserPage() {
  const [token, setToken] = useState<string | null>("token");
  const [isHovered, setIsHovered] = useState(false);
  const [thirdalignment, setthirdalignment] = useState<string | null>(null);
  const [loginHint, setLoginHint] = useState<string | null>("请选择登陆方式");
  const [agree, setAgree] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('基本信息');

  const renderContent = () => {
    switch (activeSection) {
      case '基本信息':
        return (
          <>
            <div className='w-[800px]  p-10 flex flex-col justify-center items-center bg-white/30 backdrop-blur-md text-black overflow-auto rounded-2xl'>
              <h1 className='text-2xl font-bold mt-5'>基本信息</h1>
              <hr className='w-full border-t-4 border-gray-400 my-5' />
              <div className='w-full flex flex-row space-x-10 justify-around'>
                <div className='flex flex-col justify-center items-center space-y-5'>
                  <img src="/img/chara-left.png" className='size-48 rounded-full border-2 border-gray-500 shadow-xl' alt="" />
                  <div className='border-2 border-white rounded-2xl'>
                    <button className='w-24 h-8 rounded-2xl bg-white border-4 border-[#3c81f6] font-bold'>更改头像</button>
                  </div>
                </div>
                <div className='flex flex-col justify-center items-center text-xl '>
                  <div className='w-48 flex justify-between'><b>昵称:</b><p>YOSHIKI</p></div>
                  <div className='w-48 flex justify-between'><b>机台登陆状态:</b><p>未登陆</p></div>
                  <div className='w-48 flex justify-between'><b>Rating:</b><p>00000</p></div>
                </div>
              </div>
              <h1 className='text-2xl font-bold mt-5'>游玩信息</h1>
              <hr className='w-full border-t-4 border-gray-400 my-5' />
              <div className='w-full flex flex-row justify-around items-center space-x-10'>
                <div>
                  <ul>
                    <li className='flex justify-between'><b>本日游玩次数:</b>{0}pc</li>
                    <li className='flex justify-between'><b>本周游玩次数:</b>{0}pc</li>
                    <li className='flex justify-between'><b>本月游玩次数:</b>{0}pc</li>
                    <li className='flex justify-between'><b>本年度游玩次数:</b>{0}pc</li>
                  </ul>
                </div>
                <div>
                  <ul>
                    <li className='flex justify-between'><b>本日提升rating分:</b>{0}rating</li>
                    <li className='flex justify-between'><b>本周提升rating分:</b>{0}rating</li>
                    <li className='flex justify-between'><b>本月提升rating分:</b>{0}rating</li>
                    <li className='flex justify-between'><b>本年度提升rating分:</b>{0}rating</li>
                  </ul>
                </div>
              </div>
              <h1 className='text-2xl font-bold mt-5'>启用功能列表</h1>
              <hr className='w-full border-t-4 border-gray-400 my-5' />
              <div className='w-full flex flex-row justify-around items-center space-x-10'>
                <div>
                  <ul className='space-y-2'>
                    <li className='flex justify-between'>
                      <b>b50自动更新:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>启用</button>
                    </li>
                    <li className='flex justify-between'>
                      <b>周期报告:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>启用</button>
                    </li>
                    <li className='flex justify-between'>
                      <b>每日推分推荐:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>启用</button>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className='space-y-2'>
                    <li className='flex justify-between'>
                      <b>AI智能推荐:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>启用</button>
                    </li>
                    <li className='flex justify-between'>
                      <b>多方数据共享:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>启用</button>
                    </li>
                    <li className='flex justify-between'>
                      <b>个人数据分析:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>启用</button>
                    </li>
                  </ul>
                </div>
              </div>
              <h1 className='text-2xl font-bold mt-5'>个人全国行脚图</h1>
              <hr className='w-full border-t-4 border-gray-400 my-5' />
              <div className='w-full h-[200px] mb-10 flex flex-row justify-center items-center'>
                <ChinaMap />
              </div>
              <h1 className='text-2xl font-bold mt-5'>The End</h1>
              <hr className='w-full border-t-4 border-gray-400 my-5' />
            </div>
          </>
        );
      case '关联账号':
        return (
          <>
            <div className='w-[800px]  p-10 flex flex-col justify-center items-center bg-white/30 backdrop-blur-md text-black overflow-auto rounded-2xl'>
              <h1 className='text-2xl font-bold mt-5'>关联第三方账号</h1>
              <hr className='w-full border-t-4 border-gray-400 my-5' />
              <div className='w-full flex flex-col justify-center items-center space-y-5'>
                <div className='w-6/12 flex flex-row justify-between'><b>QQ:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>未绑定</button></div>
                <div className='w-6/12 flex flex-row justify-between'><b>Wechat:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>未绑定</button></div>
                <div className='w-6/12 flex flex-row justify-between'><b>Github:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>未绑定</button></div>
                <div className='w-6/12 flex flex-row justify-between'><b>落雪:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>未绑定</button></div>
                <div className='w-6/12 flex flex-row justify-between'><b>水鱼:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>未绑定</button></div>
              </div>
            </div>
          </>
        );
      case '隐私设置':
        return (
          <>
            <div className='w-[800px]  p-10 flex flex-col justify-center items-center bg-white/30 backdrop-blur-md text-black overflow-auto rounded-2xl'>
              <h1 className='text-2xl font-bold mt-5'>隐私设置</h1>
              <hr className='w-full border-t-4 border-gray-400 my-5' />
              <div className='w-full flex flex-col justify-center items-center space-y-5'>
                <div className='w-6/12 flex flex-row justify-between'><b>第三方软件调取信息:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>同意</button></div>
                <div className='w-6/12 flex flex-row justify-between'><b>舞萌萌使用隐私协议:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>同意</button></div>
                <div className='w-6/12 flex flex-row justify-between'><b>数据用于AI推荐:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>同意</button></div>
                <div className='w-6/12 flex flex-row justify-between'><b>根据数据优化:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>同意</button></div>
              </div>
            </div>
          </>
        );
      case 'else':
        return (
          <>
            <div className='w-[800px]  p-10 flex flex-col justify-center items-center bg-white/30 backdrop-blur-md text-black overflow-auto rounded-2xl'>
              <h1 className='text-2xl font-bold mt-5'>其他设置</h1>
              <hr className='w-full border-t-4 border-gray-400 my-5' />
              <h1 className='text-2xl font-bold mt-5'>暂无</h1>
            </div>
          </>
        );
      default:
        return <div>请选择一个选项</div>;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      const newToken = 'your-token-value';
      localStorage.setItem('token', newToken);
    }
  }, []);

  return (
    <div className="w-[900px] mt-20  mx-auto relative flex justify-center overflow-y-scroll">
      {token == null ?
        // 登陆页面
        <div className='relative w-[600px] h-[500px] bg-[rgb(239,246,255)] rounded-2xl flex flex-row'>
          <div className={`h-[500px] bg-pink-500 p-5 left-0 rounded-l-2xl transition-all duration-300 ease-in-out ${isHovered ? 'w-[150px]' : 'w-[450px]'} `}>
            {isHovered ?
              <div className='h-full flex flex-col justify-center items-center space-y-5'>
                <img src="/img/third/lxns.webp" onClick={() => setIsHovered(false)} className='size-16' alt="" />
                <div className='size-16 bg-[rgb(133,144,250)] font-bold flex justify-center items-center text-center rounded-full'>水鱼</div>
                <div className='size-16 bg-[rgb(133,144,250)] font-bold flex justify-center items-center text-center rounded-full'>暂无</div>
                <div className='size-16 bg-[rgb(133,144,250)] font-bold flex justify-center items-center text-center rounded-full'>暂无</div>
                <div className='size-16 bg-[rgb(133,144,250)] font-bold flex justify-center items-center text-center rounded-full'>暂无</div>
              </div>
              :
              <div className='w-full h-full flex flex-col p-5 justify-center items-center space-y-5'>
                <h1 className='text-2xl font-bold'>欢迎使用第三方账号登陆</h1>
                <h2 className='font-bold text-xl'>{loginHint}</h2>
                <div className='flex flex-row space-x-5'>
                  <img src="/img/third/lxns.webp" className='size-12' onClick={() => { setthirdalignment("lxns"); setLoginHint("使用落雪账号登陆") }} alt="" />
                  <img src="/img/third/lxns.webp" className='size-12' onClick={() => { setthirdalignment("qq"); setLoginHint("使用QQ账号登陆") }} alt="" />
                  <img src="/img/third/lxns.webp" className='size-12' onClick={() => { setthirdalignment("wechat"); setLoginHint("使用微信账号登陆") }} alt="" />
                  <img src="/img/third/lxns.webp" className='size-12' onClick={() => { setthirdalignment("divingfish"); setLoginHint("使用水鱼账号登陆") }} alt="" />
                  <img src="/img/third/lxns.webp" className='size-12' onClick={() => { setthirdalignment("github"); setLoginHint("使用Github账号登陆") }} alt="" />
                </div>
                <input type="username" id="username" placeholder='username' className=' w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-sm focus:scale-105' />
                <input type="password" id="password" placeholder='password' className=' w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-sm focus:scale-105' />
                <button className='w-32 h-12 border-4 border-white rounded-2xl text-xl font-bold'>登陆</button>
              </div>
            }
          </div>
          <div className={`h-[500px] bg-blue-500 p-5 right-0 rounded-r-2xl transition-all duration-300 ease-in-out ${isHovered ? 'w-[450px]' : 'w-[150px]'} `}>
            {isHovered ?
              <>
                <div className='h-full flex flex-col p-2 justify-center items-center space-y-2'>
                  <h1 className='text-2xl font-bold'>使用舞萌萌账号登陆</h1>
                  <input type="username" id="username" placeholder='username' className=' w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-sm focus:scale-105' />
                  <input type="password" id="password" placeholder='password' className=' w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-sm focus:scale-105' />
                  <button className='w-32 h-12 border-4 border-white rounded-2xl text-xl font-bold'>登陆</button>
                </div>
              </>
              :
              <>
                <div className='h-full flex justify-center items-center'>
                  <h1 className='w-[100px] font-bold text-2xl'>使用第一方账号登陆</h1>
                  <img src="/img/arrowright.png" onClick={() => setIsHovered(true)} className='animate-leftToRight' alt="" />
                </div>
              </>}

          </div>
        </div>
        :
        // 用户页面 
        <div className='w-[900px] h-auto rounded-2xl flex flex-col justify-center items-center'>
          <div className='w-[700px] h-24  bg-white/30 backdrop-blur-md rounded-xl text-black font-bold flex justify-center items-center mb-5'>
            <ul className='flex flex-row justify-center items-center space-x-5 text-xl'>
              <li><a href='#' onClick={() => setActiveSection("基本信息")}>基本信息</a></li>
              <li>|</li>
              <li><a href='#' onClick={() => setActiveSection("关联账号")}>关联账号</a></li>
              <li>|</li>
              <li><a href='#' onClick={() => setActiveSection("隐私设置")}>隐私设置</a></li>
              <li>|</li>
              <li><a href='#' onClick={() => setActiveSection("else")}>else</a></li>
            </ul>
          </div>
          <div className='w-[800px] flex justify-center items-center'>
            {renderContent()}
          </div>
        </div>
      }
    </div>
  );
}