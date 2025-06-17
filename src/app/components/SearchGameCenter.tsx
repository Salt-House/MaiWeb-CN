'use client'

import { useEffect, useState } from 'react';
import { FcClock } from "react-icons/fc";
import { FaMapMarkerAlt, FaCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
    const [inputValue, setInputValue] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const options = ["1km", "5km", "10km"];
    const [searchGameCenter, setSearchGameCenter] = useState<ArcadeSearchRequest>({
        range: 3000,
        sort: 'distance',
        page_index: 1,
        page_size: 10,
    });
    const [arcadeResults, setArcadeResults] = useState<Arcade[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [resultError, setResultError] = useState("");

    // 初始化获取位置信息
    const getLocation = () => {
        if (!navigator.geolocation) {
            console.error("浏览器不支持地理定位");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setSearchGameCenter((prev) => ({
                    ...prev,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }));
            },
            (error) => {
                console.error("定位失败", error);
            },
            {
                enableHighAccuracy: true, // 启用高精度
                timeout: 10000,           // 10秒超时
                maximumAge: 0,            // 不使用缓存位置
            }
        );
    };
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setSearchGameCenter((prev) => ({
                    ...prev,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }));
            },
            (error) => {
                console.error("定位失败", error);
            }
        );
    }, []); // 仅在组件挂载时执行一次 

    // 格式化日期
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    };

    // 查询机厅
    const GetGameCenter = () => {
        console.log('searchGameCenter', searchGameCenter);
        setIsLoading(true);
        setShowResults(true);
        setResultError("");

        var requestOptions = {
            method: 'GET',
        };

        let baseurl = "https://api.maimap.tech/arcades?"
        for (const key in searchGameCenter) {
            if (searchGameCenter[key] !== undefined && searchGameCenter[key] !== null) {
                baseurl += `${key}=${searchGameCenter[key]}&`;
            }
        }

        fetch(baseurl, requestOptions)
            .then(response => response.json())
            .then(result => {
                setIsLoading(false);
                if (result.success) {
                    setArcadeResults(result.data || []);
                    console.log('arcadeResults', result.data);
                    if ((result.data || []).length === 0) {
                        setResultError("未找到符合条件的机厅");
                    }
                } else {
                    setResultError("查询失败，请稍后重试");
                    setArcadeResults([]);
                }
            })
            .catch(error => {
                console.log('error', error);
                setIsLoading(false);
                setResultError("查询过程中出现错误");
                setArcadeResults([]);
            });
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


    return (
        <>
            {/* Search Game Center - 机厅搜索区域 */}
            <div id="searchGameCenter" className="relative my-10 max-sm:w-[390px] w-[800px] mx-auto flex flex-col justify-center items-center rounded-2xl overflow-visible">
                {/* 多层边框背景 - 保持原设计风格 */}
                <div className="absolute rounded-2xl inset-x-0 inset-y-0 z-[-1] bg-white">
                    <div className="border-4 border-white rounded-2xl">
                        <div className="border-4 border-[rgb(113,241,229)] rounded-2xl">
                            <div className="border-4 border-white rounded-2xl">
                                <div className="border-4 border-[rgb(125,136,217)] rounded-2xl">
                                    <div className="w-full h-full rounded-2xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logo元素 */}
                <img className="absolute w-48 -top-16" src="/img/logo.png" alt="" />

                {/* 标题 */}
                <div className="text-2xl text-center font-bold bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 bg-clip-text text-transparent mt-6">
                    查找附近的游戏机厅
                </div>

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
                                <option value="name">按名称排序</option>
                                <option value="popularity">按热门程度</option>
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

                {/* 搜索按钮 - 使用原网站的多层边框风格 */}
                <div className="mt-4 mb-4">
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

                {/* 装饰元素 - maimai风格圆形图案 */}
                <div className="absolute -left-8 bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-[rgb(245,242,193)] to-[rgb(164,247,238)] opacity-50"></div>
                <div className="absolute -right-8 bottom-12 w-12 h-12 rounded-full bg-gradient-to-br from-[rgb(125,136,217)] to-[rgb(164,247,238)] opacity-50"></div>
            </div>

            {/* 机厅查询结果显示区域 */}
            <AnimatePresence>
                {showResults && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-sm:w-[410px] w-[800px] mx-auto mb-20"
                    >
                        <div className="bg-white rounded-2xl p-4 shadow-lg border-4 border-[rgb(113,241,229)]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    机厅查询结果
                                </h3>
                                <button
                                    onClick={() => setShowResults(false)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full border-t-4 border-r-4 border-b-4 border-[rgb(125,136,217)] animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <img src="/img/handpink.png" className="w-8 h-8 animate-pulse" alt="" />
                                        </div>
                                    </div>
                                    <p className="mt-4 text-gray-600">正在查询附近机厅...</p>
                                </div>
                            ) : resultError ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">{resultError}</p>
                                    <p className="text-sm text-gray-500 mt-2">请尝试调整搜索条件或范围</p>
                                </div>
                            ) : (
                                <div className="max-h-[400px] overflow-y-auto pr-1 arcade-results">
                                    {arcadeResults.map((arcade, index) => (
                                        <motion.div
                                            key={arcade.arcade_id || index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="mb-3 last:mb-0"
                                        >
                                            <div className={`bg-gradient-to-r ${arcade.arcade_dead ? 'from-gray-100 to-gray-200' : 'from-[rgb(245,242,193)]/30 to-[rgb(164,247,238)]/30'} 
                        rounded-xl p-3 hover:shadow-md transition-all duration-300 border-2 
                        ${arcade.arcade_dead ? 'border-gray-300' : 'border-[rgb(113,241,229)]'}`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center">
                                                            <FaCircle className={`mr-2 text-xs ${arcade.arcade_dead ? 'text-gray-400' : 'text-green-500'}`} />
                                                            <h3 className="font-bold text-lg">{arcade.arcade_name}</h3>
                                                            {arcade.arcade_dead && (
                                                                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">
                                                                    已关闭
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center text-gray-600 mt-2">
                                                            <FaMapMarkerAlt className="mr-1 text-[rgb(125,136,217)]" />
                                                            <p className="text-sm line-clamp-2">{arcade.arcade_address}</p>
                                                        </div>

                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {arcade.arcade_count && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                    机台数: {arcade.arcade_count}
                                                                </span>
                                                            )}
                                                            {arcade.arcade_cost !== null && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    单次: {arcade.arcade_cost}元
                                                                </span>
                                                            )}
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                </svg>
                                                                更新: {formatDate(arcade.created_at.toString())}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="ml-2 flex flex-col items-center">
                                                        <button className="p-2 rounded-full bg-[rgb(113,241,229)] hover:bg-[rgb(113,241,229)]/70 transition-colors" onClick={() => handleNavigation(arcade)}>
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                                            </svg>
                                                        </button>
                                                        {arcade.distance && (
                                                            <>
                                                                <p className="font-bold">{arcade.distance.toFixed(0)}米</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {!isLoading && arcadeResults.length > 0 && (
                                <div className="mt-4 text-center text-sm text-gray-500">
                                    共找到 {arcadeResults.length} 个机厅
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
