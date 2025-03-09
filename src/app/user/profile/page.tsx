"use client";

import AnimatedComponent from "@/app/components/AnimatedComponent";
import ChinaMap from "@/app/components/ChinaMap";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useState, useEffect, use } from "react";

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
    mai_icon_id: "1",
    mai_trophy_id: "1",
};

let baseUrl = "https://assets2.lxns.net/maimai"

export default function UserProfilePage() {
    const [showGuide, setShowGuide] = useState(false);
    const [activeSection, setActiveSection] = useState('基本信息');
    const [token, setToken] = useState<string | null>("");
    const [userdata, setUserData] = useState<UserProfile>(defaultUserProfile);
    const [accounts, setAccounts] = useState<ThirdAccount[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isBindLoading, setBindIsLoading] = useState<boolean>(false);
    const [lxnstoken, setLxnsToken] = useState<string>("");
    const [divingfishusername, setDivingFishUsername] = useState<string>("");
    const [divingfishpassword, setDivingFishPassword] = useState<string>("");
    const [qr_code, setQrCode] = useState<string>("");
    let [bindaccount, setBindAccount] = useState<BindAccount>({
        islxns: false,
        isdivingfish: false,
        isarcaed: false
    })
    const [functionStatus, setFunctionStatus] = useState<FunctionStatus>({
        BUpdate: true,
        CycleReport: false,
        RatingPush: false,
        AIRecommend: false,
        DataShare: false,
        DataAnalyse: false
    })
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken != "") {
            setToken(storedToken);
        } else {
            window.location.href = '/user';
        }
    }, []);
    const [link, setLink] = useState<string>("");
    useEffect(() => {
        for (let i = 0; i < accounts.length; i++) {
            if (!isNaN(Number(accounts[i].identifier))) {
                accounts[i].from = "lxns"
                bindaccount.islxns = true
            } else {
                if (accounts[i].identifier.length > 10) {
                    accounts[i].from = "arcaed";
                    bindaccount.isarcaed = true;
                } else {
                    accounts[i].from = "divingfish"
                    bindaccount.isdivingfish = true
                }
            }
            console.log(accounts);
        }
    }, [accounts]);
    useEffect(() => {
        if (token != "") {
            const myHeaders = new Headers();
            console.log("token:", token);
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
            GetBindAccount();
        }
    }, [token])
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
                    setIsLoading(false);
                }
            })
            .catch((error) => console.error(error));

    }
    const BindLxns = () => {
        setBindIsLoading(true);
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
                    setBindIsLoading(false);
                } else {
                    alert("绑定失败")
                    setBindIsLoading(false);
                }
            })
            .then((result) => { })
            .catch((error) => console.error(error));
    }
    const BindDivifish = () => {
        setBindIsLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
        };

        fetch(`https://dev.maimai.moe/api/maimai/maiweb/accounts/divingfish?username=${divingfishusername}&password=${divingfishpassword}`, requestOptions)
            .then((response) => {
                const statusCode = response.status;
                console.log(`Status Code: ${statusCode}`);
                if (statusCode === 200) {
                    alert("绑定成功")
                    setLink('')
                    setBindIsLoading(false);
                } else {
                    alert("绑定失败")
                    setBindIsLoading(false);

                }
            })
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }
    const BindArcade = () => {
        setBindIsLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
        };

        fetch(`https://dev.maimai.moe/api/maimai/maiweb/accounts/arcade?qr_code=${qr_code}`, requestOptions)
            .then((response) => {
                const statusCode = response.status;
                console.log(`Status Code: ${statusCode}`);
                if (statusCode === 200) {
                    alert("绑定成功")
                    setBindIsLoading(false);
                } else {
                    alert("绑定失败")
                    setBindIsLoading(false);
                }
            })
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }
    const LogOut = () => {
        setToken(null);
        localStorage.removeItem('token');
        window.location.href = '/user';
    }
    const RefreshData = async() => {
        setShowGuide(false)
        setIsLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
        };

        try {
            // 添加延迟避免频繁请求
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await fetch("https://dev.maimai.moe/api/maimai/maiweb/accounts", requestOptions);

            if (response.status === 429) {
                alert("请求过于频繁，请稍后再试");
                setIsLoading(false);
                return;
            }

            if (response.status === 200) {
                alert("刷新成功");
                window.location.href = '/user/profile';
            } else {
                alert("刷新失败");
            }
        } catch (error) {
            console.error("刷新数据失败:", error);
            alert("刷新失败，请稍后重试");
        } finally {
            setIsLoading(false);
        }
    }

    const renderContent = () => {
        switch (activeSection) {
            case '基本信息':
                return (
                    <>
                        <div className='relative w-[800px]  p-10 flex flex-col justify-center items-center bg-white/30 backdrop-blur-md text-black overflow-auto rounded-2xl'>
                            {isLoading ? <><LoadingSpinner /></> : <>
                                <button className="absolute top-5 right-10 ml-2 rounded-2xl bg-purple-500 p-1 px-4 text-white font-bold" onClick={RefreshData}>从查分器导入数据</button>
                                <h1 className='text-2xl font-bold mt-5'>基本信息</h1>
                                <hr className='w-full border-t-4 border-gray-400 my-5' />
                                <div className='w-full p-5 flex flex-row space-x-2 items-center bg-no-repeat bg-contain bg-center' style={token == null ? { backgroundImage: `url(${baseUrl}/plate/1.png)` } : { backgroundImage: `url(${baseUrl}/plate/301.png)` }}>
                                    <div className='flex flex-col justify-center items-center' >
                                        {token == null || userdata.mai_icon_id == null ?
                                            <img src={baseUrl + '/icon/1.png'} className='size-24 rounded-xl border-2 border-gray-500 shadow-xl' alt="" />
                                            :
                                            <img src={baseUrl + '/icon/' + userdata.mai_icon_id + '.png'} className='size-24 rounded-xl borRder-2 border-gray-500 shadow-xl' alt="" />
                                        }
                                    </div>
                                    <div className='flex flex-col justify-center items-center text-xl '>
                                        <div className='w-[400px] h-16 p-x-2 text-2xl flex justify-center items-center bg-no-repeat bg-contain bg-center'
                                            style={token == null ? { backgroundImage: `url(${baseUrl}/plate/1.png)` } : { backgroundImage: `url(${baseUrl}/plate/301.png)` }}>
                                            <b className="mx-auto w-64 text-center bg-white rounded-2xl">{userdata.username}</b>
                                        </div>
                                        <div className='w-80 flex '><b>Rating:</b><p>{userdata.mai_rating}</p></div>
                                    </div>
                                </div>
                                <button className={`ml-2 mt-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold`} onClick={LogOut}>退出舞萌萌登陆</button>
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
                                <h1 className='text-2xl font-bold mt-5'>已启用功能列表</h1>
                                <hr className='w-full border-t-4 border-gray-400 my-5' />
                                <div className='w-full flex flex-row justify-around items-center space-x-10'>
                                    <div>
                                        <ul className='space-y-2'>
                                            <li className='flex justify-between items-center'>
                                                <b>b50自动更新:</b><button className={`ml-2 rounded-2xl ${functionStatus.BUpdate ? 'bg-green-500' : 'bg-red-500'} p-1 px-4 text-white font-bold`}>{functionStatus.BUpdate ? '已启用' : '关闭'}</button>
                                            </li>
                                            <li className='flex justify-between items-center'>
                                                <b>周期报告:</b><button className={`ml-2 rounded-2xl ${functionStatus.CycleReport ? 'bg-green-500' : 'bg-red-500'} p-1 px-4 text-white font-bold`}>{functionStatus.CycleReport ? '已启用' : '开发中'}</button>
                                            </li>
                                            <li className='flex justify-between items-center'>
                                                <b>每日推分推荐:</b><button className={`ml-2 rounded-2xl ${functionStatus.RatingPush ? 'bg-green-500' : 'bg-red-500'} p-1 px-4 text-white font-bold`}>{functionStatus.RatingPush ? '已启用' : '开发中'}</button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <ul className='space-y-2'>
                                            <li className='flex justify-between items-center'>
                                                <b>AI智能推荐:</b><button className={`ml-2 rounded-2xl ${functionStatus.AIRecommend ? 'bg-green-500' : 'bg-red-500'} p-1 px-4 text-white font-bold`}>{functionStatus.AIRecommend ? '已启用' : '开发中'}</button>
                                            </li>
                                            <li className='flex justify-between items-center'>
                                                <b>多方数据共享:</b><button className={`ml-2 rounded-2xl ${functionStatus.DataShare ? 'bg-green-500' : 'bg-red-500'} p-1 px-4 text-white font-bold`}>{functionStatus.DataShare ? '已启用' : '开发中'}</button>
                                            </li>
                                            <li className='flex justify-between items-center'>
                                                <b>个人数据分析:</b><button className={`ml-2 rounded-2xl ${functionStatus.DataAnalyse ? 'bg-green-500' : 'bg-red-500'} p-1 px-4 text-white font-bold`}>{functionStatus.DataAnalyse ? '已启用' : '开发中'}</button>
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
                            </>}

                        </div>
                    </>
                );
            case '关联账号':
                return (
                    <>
                        <div className='relative w-[800px] h-[600px] p-10 flex flex-col  items-center bg-white/30 backdrop-blur-md text-black overflow-auto rounded-2xl'>
                            {isLoading ? <LoadingSpinner /> : <>
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
                            </>}
                        </div>
                    </>
                );
            case '隐私设置':
                return (
                    <>
                        <div className='w-[800px]  p-10 flex flex-col justify-center items-center bg-white/30 backdrop-blur-md text-black overflow-auto rounded-2xl'>
                            {isLoading ? <><LoadingSpinner /></> : <>
                                <h1 className='text-2xl font-bold mt-5'>隐私设置</h1>
                                <hr className='w-full border-t-4 border-gray-400 my-5' />
                                <div className='w-full flex flex-col justify-center items-center space-y-5'>
                                    <div className='w-6/12 flex flex-row justify-between'><b>第三方软件调取信息:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>撰写中</button></div>
                                    <div className='w-6/12 flex flex-row justify-between'><b>舞萌萌使用隐私协议:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>撰写中</button></div>
                                    <div className='w-6/12 flex flex-row justify-between'><b>数据用于AI推荐:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>撰写中</button></div>
                                    <div className='w-6/12 flex flex-row justify-between'><b>根据数据优化:</b><button className='ml-2 rounded-2xl bg-green-500 p-1 px-4 text-white font-bold'>撰写中</button></div>
                                </div>
                            </>}

                        </div>
                    </>
                );
            case 'else':
                return (
                    <>
                        <div className='w-[800px]  p-10 flex flex-col justify-center items-center bg-white/30 backdrop-blur-md text-black overflow-auto rounded-2xl'>
                            {isLoading ? <LoadingSpinner /> : <>
                                <h1 className='text-2xl font-bold mt-5'>其他设置</h1>
                                <hr className='w-full border-t-4 border-gray-400 my-5' />
                                <h1 className='text-2xl font-bold mt-5'>暂无</h1>
                            </>}
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
                        <AnimatedComponent isVisible={true}>
                            <div className="relative size-96 bg-white bg-opacity-75 backdrop-blur-md rounded-2xl shadow-xl flex flex-col justify-center items-center space-y-5">
                                {isBindLoading ? <LoadingSpinner /> : <>
                                    <h1 className="text-2xl font-bold">绑定落雪账号</h1>
                                    <h1 className="text-xl font-bold text-red-500">（请至少上传一次成绩至落雪）</h1>
                                    <input type="text" name="lxnstoken" id="" placeholder="个人token" className="w-60 rounded-2xl border-4 border-blue-500 p-1 pl-2" value={lxnstoken} onChange={(e) => setLxnsToken(e.target.value)} />
                                    <a href="https://maimai.lxns.net/login" className="absolute bottom-5 right-5 text-blue-500 hover:scale-105 hover:underline duration-300 transition-all ease-in-out">前往落雪获取token➡️</a>
                                    <button className="ml-2 rounded-2xl bg-purple-500 p-1 px-4 text-white font-bold hover:scale-105 hover:shadow-lg duration-300 ease-in-out" onClick={BindLxns}>绑定</button>
                                    <button className="absolute right-5 top-0" onClick={() => { setLink('') }}>❌</button>
                                </>}

                            </div>
                        </AnimatedComponent>
                    </>
                )
            case 'divingfish':
                return (
                    <>
                        <AnimatedComponent isVisible={true}>
                            <div className="relative size-96 bg-white bg-opacity-75 backdrop-blur-md rounded-2xl shadow-xl flex flex-col justify-center items-center space-y-5">
                                {isBindLoading ? <LoadingSpinner /> : <>

                                    <h1 className="text-2xl font-bold">绑定水鱼账号</h1>
                                    <input type="username" name="divingfishusername" id="" placeholder="水鱼账号" className="w-60 rounded-2xl border-4 border-blue-500 p-1 pl-2" value={divingfishusername} onChange={(e) => setDivingFishUsername(e.target.value)} />
                                    <input type="password" name="divingfishpassword" id="" placeholder="水鱼密码" className="w-60 rounded-2xl border-4 border-blue-500 p-1 pl-2" value={divingfishpassword} onChange={(e) => setDivingFishPassword(e.target.value)} />
                                    <a href="" className="absolute bottom-5 right-5 text-blue-500 hover:scale-105 hover:underline duration-300 transition-all ease-in-out">前往水鱼注册账号</a>
                                    <button className="ml-2 rounded-2xl bg-purple-500 p-1 px-4 text-white font-bold hover:scale-105 hover:shadow-lg duration-300 ease-in-out" onClick={BindDivifish}>绑定</button>
                                    <button className="absolute right-5 top-0" onClick={() => { setLink('') }}>❌</button>
                                </>}

                            </div>
                        </AnimatedComponent>
                    </>
                )
            case 'arcaed':
                return (
                    <>
                        <AnimatedComponent isVisible={true}>
                            <div className="relative size-96 bg-white bg-opacity-75 backdrop-blur-md rounded-2xl shadow-xl flex flex-col justify-center items-center space-y-5">
                                {isBindLoading ? <LoadingSpinner /> : <>

                                    <h1 className="text-2xl font-bold">绑定街机账号</h1>
                                    <input type="username" name="divingfishusername" id="" placeholder="二维码字段" className="w-60 rounded-2xl border-4 border-blue-500 p-1 pl-2" value={qr_code} onChange={(e) => setQrCode(e.target.value)} />
                                    <button className="ml-2 rounded-2xl bg-purple-500 p-1 px-4 text-white font-bold hover:scale-105 hover:shadow-lg duration-300 ease-in-out" onClick={BindArcade}>绑定</button>
                                    <button className="absolute right-5 top-0" onClick={() => { setLink('') }}>❌</button>
                                </>}
                            </div>
                        </AnimatedComponent>
                    </>
                )
            default:
                return null
        }
    }
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
                    <li>|</li>
                    <li><button
                        onClick={() => setShowGuide(true)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        使用指南
                    </button></li>
                </ul>
            </div>
            <div className='w-[800px] flex justify-center items-center'>
                {renderContent()}
            </div>
            {showGuide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <AnimatedComponent isVisible={true}>
                        <div className="relative w-[600px] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8">
                            <button
                                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                                onClick={() => setShowGuide(false)}
                            >
                                <span className="text-xl">×</span>
                            </button>

                            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                                操作指南
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <span className="inline-block w-6 h-6 bg-purple-500 rounded-full text-white text-sm flex items-center justify-center mr-2">1</span>
                                        基本信息
                                    </h3>
                                    <p className="text-gray-600 ml-8">查看个人信息、游玩数据及功能开启状态</p>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <span className="inline-block w-6 h-6 bg-blue-500 rounded-full text-white text-sm flex items-center justify-center mr-2">2</span>
                                        关联账号
                                    </h3>
                                    <p className="text-gray-600 ml-8">绑定第三方账号，实现数据互通</p>
                                    <i className="text-gray-600 ml-8 text-sm">注:推荐绑定Arcaed账号</i>
                                    <p className="text-gray-600 ml-8">在绑定账号后请点击<button className="my-2 rounded-2xl bg-purple-500 p-1 px-4 text-white font-bold" onClick={RefreshData}>从查分器导入数据</button>导入数据</p>

                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <span className="inline-block w-6 h-6 bg-green-500 rounded-full text-white text-sm flex items-center justify-center mr-2">3</span>
                                        隐私设置
                                    </h3>
                                    <p className="text-gray-600 ml-8">管理个人数据的使用范围和隐私选项（撰写中）</p>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500">
                                    提示：点击右上角的刷新按钮可以更新最新数据
                                </p>
                            </div>
                        </div>
                    </AnimatedComponent>
                </div>
            )}

        </div>
    );
}