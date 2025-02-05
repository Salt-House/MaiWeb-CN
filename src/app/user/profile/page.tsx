"use client";

import AnimatedComponent from "@/app/components/AnimatedComponent";
import ChinaMap from "@/app/components/ChinaMap";
import { Xanh_Mono } from "next/font/google";
import { useState, useEffect } from "react";

interface FunctionStatus {
    BUpdate: boolean,
    CycleReport: boolean,
    RatingPush: boolean,
    AIRecommend: boolean,
    DataShare: boolean,
    DataAnalyse: boolean
}
interface UserProfile {
    id: string,
    username: string,
    email: string,
    privileges: string,
    mai_rating: string,
    mai_play_count: string,
    mai_player_name: string,
    mai_nameplate_id: string,
    mai_icon_id: string,
    mai_trophy_id: string
}
interface ThirdAccount {
    server: string,
    nickname: string,
    identifier: string,
    from: string
}
interface BindAccount {
    islxns: boolean,
    isdivingfish: boolean,
    isarcaed: boolean,
}
const defaultUserProfile: UserProfile = {
    id: "请刷新",
    username: "请刷新",
    email: "请刷新",
    privileges: "basic",
    mai_rating: "0",
    mai_play_count: "0",
    mai_player_name: "Player 1",
    mai_nameplate_id: "1",
    mai_icon_id: "icon-1",
    mai_trophy_id: "trophy-1",
};

export default function UserProfilePage() {
    const [activeSection, setActiveSection] = useState('基本信息');
    const [token, setToken] = useState<string | null>();
    const [userdata, setUserData] = useState<UserProfile>(defaultUserProfile);
    const [accounts, setAccounts] = useState<ThirdAccount[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lxnstoken, setLxnsToken] = useState<string>("");
    let [bindaccount, setBindAccount] = useState<BindAccount>({
        islxns: false,
        isdivingfish: false,
        isarcaed: false
    })
    const [functionStatus, setFunctionStatus] = useState<FunctionStatus>({
        BUpdate: false,
        CycleReport: true,
        RatingPush: false,
        AIRecommend: true,
        DataShare: false,
        DataAnalyse: false
    })
    const [link, setLink] = useState<string>("");
    useEffect(() => {
        for (let i = 0; i < accounts.length; i++) {
            if (!isNaN(Number(accounts[i].identifier))) {
                accounts[i].from = "lxns"
                bindaccount.islxns = true
            } else {
                accounts[i].from = "divingfish"
                bindaccount.isdivingfish = true
            }
        }
        console.log(accounts)
    }, [accounts])

    const GetBindAccount = () => {
        setIsLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };
        // console.log("start fetch bind account")
        fetch("https://dev.maimai.moe/api/maimai/maiweb/accounts", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log("get data")
                try {
                    const data = JSON.parse(result)
                    if (data[0].server) {
                        setAccounts(data.map((account: any) => ({
                            server: account.server,
                            nickname: account.nickname,
                            identifier: account.identifier,
                            from: "none"
                        })));
                    }
                    setIsLoading(false);

                } catch (e) {
                    alert("获取绑定账号失败")
                    setIsLoading(false);
                }
            })
            .catch((error) => console.error(error));

    }

    const BindLxns = () => {
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
        };

        fetch(`https://dev.maimai.moe/api/maimai/maiweb/accounts/lxns?personal_token=${lxnstoken}`, requestOptions)
            .then((response) => {
                const statusCode = response.status;
                console.log(`Status Code: ${statusCode}`);
                if (statusCode === 200) {
                    alert("绑定成功")
                    setLink('')
                }else{
                    alert("绑定失败")
                }
            })
            .then((result) => { })
            .catch((error) => console.error(error));
    }

    const LogOut = () => {
        setToken(null);
        localStorage.removeItem('token');
        window.location.href = '/user';
    }

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
                                    <div className='w-80 flex justify-between'><b>昵称:</b><p>{userdata.username}</p></div>
                                    <div className='w-80 flex justify-between'><b>邮箱:</b><p>{userdata.email}</p></div>
                                    <div className='w-80 flex justify-between'><b>Rating:</b><p>{userdata.mai_rating}</p></div>
                                    <button className={`ml-2 mt-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold`} onClick={LogOut}>退出舞萌萌登陆</button>
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
                                        <li className='flex justify-between items-center'>
                                            <b>b50自动更新:</b><button className={`ml-2 rounded-2xl ${functionStatus.BUpdate ? 'bg-red-500' : 'bg-green-500'} p-1 px-4 text-white font-bold`}>{functionStatus.BUpdate ? '关闭' : '启用'}</button>
                                        </li>
                                        <li className='flex justify-between items-center'>
                                            <b>周期报告:</b><button className={`ml-2 rounded-2xl ${functionStatus.CycleReport ? 'bg-red-500' : 'bg-green-500'} p-1 px-4 text-white font-bold`}>{functionStatus.CycleReport ? '关闭' : '启用'}</button>
                                        </li>
                                        <li className='flex justify-between items-center'>
                                            <b>每日推分推荐:</b><button className={`ml-2 rounded-2xl ${functionStatus.RatingPush ? 'bg-red-500' : 'bg-green-500'} p-1 px-4 text-white font-bold`}>{functionStatus.RatingPush ? '关闭' : '启用'}</button>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <ul className='space-y-2'>
                                        <li className='flex justify-between items-center'>
                                            <b>AI智能推荐:</b><button className={`ml-2 rounded-2xl ${functionStatus.AIRecommend ? 'bg-red-500' : 'bg-green-500'} p-1 px-4 text-white font-bold`}>{functionStatus.AIRecommend ? '关闭' : '启用'}</button>
                                        </li>
                                        <li className='flex justify-between items-center'>
                                            <b>多方数据共享:</b><button className={`ml-2 rounded-2xl ${functionStatus.DataShare ? 'bg-red-500' : 'bg-green-500'} p-1 px-4 text-white font-bold`}>{functionStatus.DataShare ? '关闭' : '启用'}</button>
                                        </li>
                                        <li className='flex justify-between items-center'>
                                            <b>个人数据分析:</b><button className={`ml-2 rounded-2xl ${functionStatus.DataAnalyse ? 'bg-red-500' : 'bg-green-500'} p-1 px-4 text-white font-bold`}>{functionStatus.DataAnalyse ? '关闭' : '启用'}</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <h1 className='text-gray-500 font-bold'>注意:所有功能显示当前状态</h1>
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
                        <div className='relative w-[800px] h-[600px] p-10 flex flex-col  items-center bg-white/30 backdrop-blur-md text-black overflow-auto rounded-2xl'>
                            <h1 className='text-2xl font-bold mt-5'>关联第三方账号</h1>
                            <hr className='w-full border-t-4 border-gray-400 my-5' />
                            <div className='w-full flex flex-col justify-center items-center space-y-5'>
                                <div className='w-6/12 flex flex-row justify-between'><b>落雪:</b><button className={`ml-2 rounded-2xl ${bindaccount.islxns ? 'bg-green-500' : 'bg-red-500'} p-1 px-4 text-white font-bold`} onClick={() => setLink('lxns')}>{bindaccount.islxns ? '已绑定' : '未绑定'}</button></div>
                                <div className='w-6/12 flex flex-row justify-between'><b>水鱼:</b><button className={`ml-2 rounded-2xl ${bindaccount.isdivingfish ? 'bg-green-500' : 'bg-red-500'}  p-1 px-4 text-white font-bold`} onClick={() => { setLink('divingfish') }}>{bindaccount.isdivingfish ? '已绑定' : '未绑定'}</button></div>
                                <div className='w-6/12 flex flex-row justify-between'><b>Arcaed:</b><button className={`ml-2 rounded-2xl ${bindaccount.isarcaed ? 'bg-green-500' : 'bg-red-500'} p-1 px-4 text-white font-bold`} onClick={() => { setLink('arcaed') }}>{bindaccount.isarcaed ? '已绑定' : '未绑定'}</button></div>
                            </div>
                            <button className="absolute top-5 right-10 ml-2 rounded-2xl bg-purple-500 p-1 px-4 text-white font-bold" onClick={GetBindAccount}>更新绑定状态</button>
                            <div className="absolute z-[1000] h-full flex justify-center items-center">
                                {BindThirdAccount(link)}
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

    const BindThirdAccount = (link: string) => {
        switch (link) {
            case 'lxns':
                return (
                    <>
                        <AnimatedComponent>
                            <div className="relative size-96 bg-white bg-opacity-75 backdrop-blur-md rounded-2xl shadow-xl flex flex-col justify-center items-center space-y-5">
                                <h1 className="text-2xl font-bold">绑定落雪账号</h1>
                                <h1 className="text-xl font-bold text-red-500">（请至少上传一次成绩至落雪）</h1>
                                <input type="text" name="token" id="" placeholder="个人token" className="w-60 rounded-2xl border-4 border-blue-500 p-1 pl-2" />
                                <a href="https://maimai.lxns.net/login" className="absolute bottom-5 right-5 text-blue-500 hover:scale-105 hover:underline duration-300 transition-all ease-in-out">前往落雪获取token➡️</a>
                                <button className="ml-2 rounded-2xl bg-purple-500 p-1 px-4 text-white font-bold hover:scale-105 hover:shadow-lg duration-300 ease-in-out" >绑定</button>
                                <button className="absolute right-5 top-0" onClick={() => { setLink('') }}>❌</button>
                            </div>
                        </AnimatedComponent>
                    </>
                )
            case 'divingfish':
                return (
                    <>
                        <AnimatedComponent>
                            <div className="relative size-96 bg-white bg-opacity-75 backdrop-blur-md rounded-2xl shadow-xl flex flex-col justify-center items-center space-y-5">
                                <h1 className="text-2xl font-bold">绑定水鱼账号</h1>
                                <input type="username" name="divingfishusername" id="" placeholder="水鱼账号" className="w-60 rounded-2xl border-4 border-blue-500 p-1 pl-2" />
                                <input type="password" name="divingfishpassword" id="" placeholder="水鱼密码" className="w-60 rounded-2xl border-4 border-blue-500 p-1 pl-2" />
                                <a href="" className="absolute bottom-5 right-5 text-blue-500 hover:scale-105 hover:underline duration-300 transition-all ease-in-out">前往水鱼注册账号</a>
                                <button className="ml-2 rounded-2xl bg-purple-500 p-1 px-4 text-white font-bold hover:scale-105 hover:shadow-lg duration-300 ease-in-out" >绑定</button>
                                <button className="absolute right-5 top-0" onClick={() => { setLink('') }}>❌</button>
                            </div>
                        </AnimatedComponent>
                    </>
                )
            case 'arcaed':
                return (
                    <>
                        <AnimatedComponent>
                            <div className="relative size-96 bg-white bg-opacity-75 backdrop-blur-md rounded-2xl shadow-xl flex flex-col justify-center items-center space-y-5">
                                <h1 className="text-2xl font-bold">开发中</h1>
                                <button className="absolute right-5 top-0" onClick={() => { setLink('') }}>❌</button>
                            </div>
                        </AnimatedComponent>
                    </>
                )
            default:
                return null
        }
    }

    useEffect(() => {
        setToken(localStorage.getItem('token'));
    }, []);

    useEffect(() => {
        const myHeaders = new Headers();
        // console.log(token);
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        fetch("https://dev.maimai.moe/api/user/me", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                const data = JSON.parse(result);
                if (data.id) {
                    setUserData(data);
                } else {
                    setUserData(defaultUserProfile);
                }
            })
            .catch((error) => console.error(error));
    }, [token])

    return (
        <div className='w-[900px] h-auto rounded-2xl mt-10 mx-auto flex flex-col justify-center items-center'>
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
            {isLoading ?
                <>
                    <div className="fixed z-[1000] inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-16 h-16 border-4 border-t-4 border-t-transparent border-white rounded-full animate-spin"></div>
                    </div>
                </>
                :
                <>
                </>}
        </div>
    );
}