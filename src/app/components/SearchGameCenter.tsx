'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FcClock } from "react-icons/fc";
// 移除直接引入 framer-motion，结果列表改为动态组件以减小首屏 bundle
import dynamic from 'next/dynamic';
import {ExceptOptions} from "type-fest/source/except";

// 接口定义
export interface ArcadeSearchRequest {
    lat?: number;
    lng?: number;
    name?: string;
    page_index?: number;
    page_size?: number;
    range?: number;
    sort?: string;
    [property: string]: any;
}

export interface Arcade {
    arcade_address: string;
    arcade_cost: number | null;
    arcade_count: number | null;
    arcade_dead: boolean;
    arcade_id: number;
    arcade_lat: number;
    arcade_lng: number;
    arcade_name: string;
    created_at: Date;
    distance?: number;
    [property: string]: any;
}

const SearchGameCenter = () => {
    // 状态管理
    const key = "AA7BZ-FVT6T-ZQ5XP-VCND7-DKFYF-RKBCU"
    const [address, setAddress] = useState("")
    const [inputValue, setInputValue] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const options = ["1km", "5km", "10km"];
    const [searchGameCenter, setSearchGameCenter] = useState<ArcadeSearchRequest>({
        range: 3000,
        sort: 'distance',
        page_index: 1,
        page_size: 50,
    });
    const [arcadeResults, setArcadeResults] = useState<Arcade[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [resultError, setResultError] = useState("");
    ;
    /**
     * 获取用户当前位置
     */
    const getLocation = () => {
        if (!navigator.geolocation) {
            alert("浏览器不支持地理定位");
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setSearchGameCenter((prev) => ({
                    ...prev,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }));
                setIsLoading(false);
                // alert('位置获取成功，可以开始搜索机厅');
            },
            (error) => {
                console.error("定位失败", error);
                setIsLoading(false);
                let errorMessage = "定位失败";
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "用户拒绝了定位请求";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "位置信息不可用";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "定位请求超时";
                        break;
                }
                // alert(errorMessage + "，请尝试手动输入地址");
            },
            {
                enableHighAccuracy: true, // 启用高精度
                timeout: 10000,           // 10秒超时
                maximumAge: 0,            // 不使用缓存位置
            }
        );
    };

    /**
     * 从输入地址获取位置坐标
     */
    const getLocationFromAdress = () =>{
        if (!address.trim()) {
            alert('请输入地址');
            return;
        }
        
        setIsLoading(true);
        var requestOptions = {
            method: 'GET',
            redirect: 'follow' as RequestRedirect
        };

        fetch(`https://dev.maimai.moe/email/transfer/tencent/address2latlng?address=${address}`, requestOptions)
            .then(response => response.text())
            .then(result =>{
                const data = JSON.parse(result);
                if (data.lat && data.lng) {
                    setSearchGameCenter((prev)=>({
                        ...prev,
                        lat:data.lat,
                        lng:data.lng,
                    }));
                    // 地址解析成功后自动搜索机厅
                    // 使用setTimeout确保状态更新完成后再搜索
                    setTimeout(() => {
                        // 创建临时的搜索参数，包含新的坐标
                        const tempSearchParams = {
                            ...searchGameCenter,
                            lat: data.lat,
                            lng: data.lng
                        };
                        
                        // 直接调用搜索API而不是GetGameCenter函数，避免状态更新延迟
                        performSearch(tempSearchParams);
                    }, 100);
                } else {
                    alert('地址解析失败，请检查地址是否正确');
                    setIsLoading(false);
                }
            })
            .catch(error => {
                console.log('error', error);
                alert('地址查询失败，请稍后重试');
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getLocation();
    }, []); // 仅在组件挂载时执行一次 

    // 格式化日期
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    };

    /**
     * 执行机厅搜索的核心函数
     * @param searchParams 搜索参数
     */
    const performSearch = (searchParams: ArcadeSearchRequest) => {
        console.log('searchParams', searchParams);
        setIsLoading(true);
        setShowResults(true);
        setResultError("");

        var requestOptions = {
            method: 'GET',
        };

        // 构建查询URL
        let baseurl = "https://dev.maimai.moe/email/search_gamecenter?"
        for (const key in searchParams) {
            if (searchParams[key] !== undefined && searchParams[key] !== null && searchParams[key] !== '') {
                baseurl += `${key}=${encodeURIComponent(searchParams[key])}&`;
            }
        }
        // 移除最后的&符号
        baseurl = baseurl.slice(0, -1);

        console.log('查询URL:', baseurl);

        fetch(baseurl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                setIsLoading(false);
                if (result.success) {
                    const arcades = result.data || [];
                    setArcadeResults(arcades);
                    console.log('arcadeResults', arcades);
                    if (arcades.length === 0) {
                        setResultError("未找到符合条件的机厅，请尝试扩大搜索范围或调整搜索条件");
                    }
                } else {
                    setResultError(result.message || "查询失败，请稍后重试");
                    setArcadeResults([]);
                }
            })
            .catch(error => {
                console.error('查询机厅失败:', error);
                setIsLoading(false);
                setResultError("查询过程中出现网络错误，请检查网络连接后重试");
                setArcadeResults([]);
            });
    };

    /**
     * 查询机厅（用户点击搜索按钮时调用）
     */
    const GetGameCenter = () => {
        // 检查是否有位置信息
        if (!searchGameCenter.lat || !searchGameCenter.lng) {
            // alert('请先获取位置信息或输入地址');
            return;
        }

        performSearch(searchGameCenter);
    };

    
    const handleNavigation = (target: Arcade) => {
        const ua = navigator.userAgent.toLowerCase();
        const name = encodeURIComponent(target.arcade_name); // 编码避免中文或特殊字符问题
        let url = '';


        // Android：尝试打开高德地图 App
        url = `androidamap://navi?sourceApplication=yourapp&lat=${target.arcade_lat}&lon=${target.arcade_lng}&dev=0&style=2&poiname=${name}`;

        // 回退策略：5秒后跳转到高德地图网页版
        setTimeout(() => {
            window.location.href = `https://uri.amap.com/navigation?to=${target.arcade_lng},${target.arcade_lat},${name}&mode=car&policy=1`;
        }, 500);


        window.location.href = url;
    };

    // 移除自动触发搜索的useEffect，避免无限循环
    // 现在只有用户主动点击搜索按钮或地址解析成功后才会搜索


    // 动态引入结果组件（含 framer-motion），仅在需要显示结果时加载
    const SearchGameCenterResults = dynamic(() => import('./SearchGameCenterResults'), {
        ssr: false,
        loading: () => <div className="max-sm:w-[90%] w-[800px] mx-auto mb-10 text-center text-gray-500">加载结果组件...</div>
    });

    return (
        <>
            {/* Search Game Center - 机厅搜索区域 */}
            <div id="searchGameCenter" className="relative my-10 max-sm:w-[90%] w-[800px] mx-auto flex flex-col justify-center items-center rounded-2xl overflow-visible">
                {/* 多层边框背景 - 保持原设计风格 */}
                <div className="absolute rounded-2xl inset-x-0 inset-y-0 z-[-1] bg-white border-4 border-[rgb(113,241,229)]">
                    {/* <div className="border-4 border-white rounded-2xl">
                        <div className="border-4 border-[rgb(113,241,229)] rounded-2xl">
                            <div className="border-4 border-white rounded-2xl">
                                <div className="border-4 border-[rgb(125,136,217)] rounded-2xl">
                                    <div className="w-full h-full rounded-2xl"></div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Logo元素 (使用 next/image 以获得自动优化、懒加载与格式转换) */}
                <Image
                    className="absolute w-48 -top-16"
                    src="/img/logo.png"
                    alt="网站 Logo"
                    width={192}
                    height={192}
                    priority
                />

                                {/* 搜索表单 */}
                                <div className="w-full px-8 mt-4 mb-2">
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {/* 搜索范围选择器 */}
                                        <div className="relative min-w-[140px] max-sm:w-full rounded-full overflow-hidden border-2 border-[rgb(113,241,229)]">
                                            <select
                                                className="w-full py-2.5 px-4 appearance-none bg-white text-black focus:outline-none"
                                                value={searchGameCenter.range}
                                                onChange={(e) => setSearchGameCenter(prev => ({ ...prev, range: parseInt(e.target.value) }))}
                                            >
                                                <option value={1000}>1公里范围</option>
                                                <option value={3000}>3公里范围</option>
                                                <option value={5000}>5公里范围</option>
                                                <option value={10000}>10公里范围</option>
                                                <option value={20000}>20公里范围</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-gradient-to-r from-transparent to-[rgb(164,247,238)]">
                                                <svg className="h-4 w-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </div>
                                        </div>

                                        {/* 排序方式选择器 */}
                                        <div className="relative min-w-[140px] max-sm:w-full rounded-full overflow-hidden border-2 border-[rgb(113,241,229)]">
                                            <select
                                                className="w-full py-2.5 px-4 appearance-none bg-white text-black focus:outline-none"
                                                value={searchGameCenter.sort}
                                                onChange={(e) => setSearchGameCenter(prev => ({ ...prev, sort: e.target.value }))}
                                            >
                                                <option value="distance">按距离排序</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 bg-gradient-to-r from-transparent to-[rgb(164,247,238)]">
                                                <svg className="h-4 w-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </div>
                                        </div>

                                        {/* 机厅名称搜索 */}
                                        <div className="relative min-w-[200px] max-sm:w-full">
                                            <input
                                                type="text"
                                                placeholder="输入机厅名称"
                                                className="w-full py-2.5 px-4 rounded-full border-2 border-[rgb(113,241,229)] focus:outline-none focus:ring-2 focus:ring-[rgb(125,136,217)]"
                                                value={searchGameCenter.name || ''}
                                                onChange={(e) => setSearchGameCenter(prev => ({ ...prev, name: e.target.value }))}
                                            />
                                        </div>

                                        {/* 地址搜索 */}
                                        <div className="relative min-w-[200px] max-sm:w-full">
                                            <input
                                                type="text"
                                                placeholder="输入地址"
                                                className="w-full py-2.5 px-4 rounded-full border-2 border-[rgb(113,241,229)] focus:outline-none focus:ring-2 focus:ring-[rgb(125,136,217)]"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                            />
                                        </div>

                                        <button
                                            onClick={getLocation}
                                            className="flex items-center justify-center h-11 w-11 rounded-full bg-gradient-to-r from-[rgb(245,242,193)] to-[rgb(164,247,238)] border-2 border-[rgb(113,241,229)] hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                            title="获取我的位置"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[rgb(80,60,150)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* 搜索按钮 */}
                                <div className="mt-4 mb-4 flex flex-wrap justify-center gap-4">
                                    <div className="border-3 border-white rounded-full hover:scale-110 transition-all duration-300">
                                        <div className="border-3 border-[rgb(113,241,229)] rounded-full">
                                            <div className="border-3 border-white rounded-full">
                                                <button
                                                    className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[rgb(245,242,193)] to-[rgb(164,247,238)] hover:from-[rgb(164,247,238)] hover:to-[rgb(245,242,193)] text-lg font-bold text-[rgb(80,60,150)] shadow-md flex items-center gap-2 disabled:opacity-70"
                                                    onClick={GetGameCenter}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <div className="animate-spin h-5 w-5 border-b-2 border-[rgb(80,60,150)] rounded-full"></div>
                                                            搜索中...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                            </svg>
                                                            搜索机厅
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-3 border-white rounded-full hover:scale-110 transition-all duration-300">
                                        <div className="border-3 border-[rgb(113,241,229)] rounded-full">
                                            <div className="border-3 border-white rounded-full">
                                                <button
                                                    className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[rgb(164,247,238)] to-[rgb(125,136,217)] hover:from-[rgb(125,136,217)] hover:to-[rgb(164,247,238)] text-lg font-bold text-white shadow-md flex items-center gap-2 disabled:opacity-70"
                                                    onClick={getLocationFromAdress}
                                                    disabled={isLoading || !address.trim()}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
                                                            查询中...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            地址查询
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 定位信息提示 */}
                                {searchGameCenter.lat && searchGameCenter.lng ? (
                                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                                        <FcClock />
                                        <span>已获取您的位置信息，可直接搜索附近机厅</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                                        <FcClock />
                                        <span>未获取到您的位置信息</span>
                                    </div>
                                )}

                                {/* 装饰元素 */}
                                <div className="absolute -left-8 bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-[rgb(245,242,193)] to-[rgb(164,247,238)] opacity-50"></div>
                                <div className="absolute -right-8 bottom-12 w-12 h-12 rounded-full bg-gradient-to-br from-[rgb(125,136,217)] to-[rgb(164,247,238)] opacity-50"></div>
                        </div>
                        {(showResults || isLoading || resultError) && (
                            <SearchGameCenterResults
                                showResults={showResults}
                                isLoading={isLoading}
                                resultError={resultError}
                                arcadeResults={arcadeResults}
                                onClose={() => setShowResults(false)}
                                formatDate={formatDate}
                                handleNavigation={handleNavigation}
                            />
                        )}

            {/* 自定义滚动条样式 */}
            <style jsx global>{`
        .arcade-results::-webkit-scrollbar {
          width: 6px;
        }
        
        .arcade-results::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .arcade-results::-webkit-scrollbar-thumb {
          background: rgb(113,241,229);
          border-radius: 10px;
        }
        
        .arcade-results::-webkit-scrollbar-thumb:hover {
          background: rgb(125,136,217);
        }
      `}</style>
        </>
    );
};

export default SearchGameCenter;
