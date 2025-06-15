'use client'

import LoadingSpinner from '@/app/components/LoadingSpinner'
import SvgStrokedText from '@/app/components/SvgStrokedText'
import TextScroller from '@/app/components/TextScroller'
import { useEffect, useState } from 'react'

interface NamePlate {
    id: string,
    name: string,
    description: string,
    genre: string
}
interface MaiBackGround {
    id: string,
    name: string,
    description: string,
    genre: string
}
interface Icon {
    id: string,
    name: string,
    description: string,
    genre: string
}
interface Trophie {
    id: string,
    name: string,
    color: string,
}

let baseUrl = "https://assets2.lxns.net/maimai"

// 统一的数据获取函数
const fetchData = async (url: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: myHeaders,
        });
        const text = await response.text();
        return JSON.parse(text);
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return [];
    }
};


export default function CollectionPage() {
    const [namePlates, setNamePlates] = useState<NamePlate[]>([])
    const [MaiBackGround, setMaiBackGround] = useState<MaiBackGround[]>([])
    const [Icons, setIcons] = useState<Icon[]>([])
    const [Trophies, setTrophies] = useState<Trophie[]>([])
    const [activeTab, setActiveTab] = useState<string>("icon")

    // 搜索相关状态
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [searchColor, setSearchColor] = useState<string>("")
    const [searchGenre, setSearchGenre] = useState<string>("")
    const [isSearching, setIsSearching] = useState<boolean>(false)

    // 分页相关状态
    const [currentPage, setCurrentPage] = useState<Record<string, number>>({
        icon: 1,
        frame: 1,
        nameplate: 1,
        trophy: 1
    });
    const [hasMore, setHasMore] = useState<Record<string, boolean>>({
        icon: true,
        frame: true,
        nameplate: true,
        trophy: true
    });
    const pageSize = 30;

    // 颜色选项
    const colorOptions = ["", "Gold", "Silver", "bronze", "purple", "blue", "green", "red", "yellow"];
    const genreOptions = ["デフォルト", "オリジナルちほー", "maimaiシリーズ", "イベントちほー", "実績"];


    // 加载数据函数
    const loadData = async (type: string, searchParams: Record<string, string> = {}, append: boolean = false) => {
        setIsSearching(true);
        let endpoint = "";
        let setter;

        // 构建查询参数
        const queryParams = new URLSearchParams();
        queryParams.append("page", append ? (currentPage[type] + 1).toString() : "1");
        queryParams.append("page_size", pageSize.toString());

        // 添加搜索参数
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });

        // 根据类型确定端点和设置器
        switch (type) {
            case "icon":
                endpoint = "icons";
                setter = setIcons;
                break;
            case "frame":
                endpoint = "frames";
                setter = setMaiBackGround;
                break;
            case "nameplate":
                endpoint = "nameplates";
                setter = setNamePlates;
                break;
            case "trophy":
                endpoint = "trophies";
                setter = setTrophies;
                break;
        }

        // 获取数据
        try {
            const apiUrl = `https://dev.maimai.moe/api/maimai/${endpoint}?${queryParams.toString()}`;
            console.log("API请求URL:", apiUrl);

            const data = await fetchData(apiUrl);

            if (setter) {
                // 如果是加载更多，则追加数据，否则替换数据
                if (append) {
                    // 根据不同的数据类型选择正确的状态更新方法
                    switch (type) {
                        case "icon":
                            setIcons(prev => [...prev, ...data]);
                            break;
                        case "frame":
                            setMaiBackGround(prev => [...prev, ...data]);
                            break;
                        case "nameplate":
                            setNamePlates(prev => [...prev, ...data]);
                            break;
                        case "trophy":
                            setTrophies(prev => [...prev, ...data]);
                            break;
                    }

                    // 更新页码
                    setCurrentPage(prev => ({
                        ...prev,
                        [type]: prev[type] + 1
                    }));

                    // 检查是否还有更多数据
                    setHasMore(prev => ({
                        ...prev,
                        [type]: data.length === pageSize
                    }));
                } else {
                    // 直接替换数据
                    setter(data);

                    // 重置页码
                    setCurrentPage(prev => ({
                        ...prev,
                        [type]: 1
                    }));

                    // 检查是否还有更多数据
                    setHasMore(prev => ({
                        ...prev,
                        [type]: data.length === pageSize
                    }));
                }
            } else {
                console.error(`No setter found for type: ${type}`);
            }
        } catch (error) {
            console.error(`Error loading ${type}:`, error);
        } finally {
            setIsSearching(false);
        }
    };

    // 加载更多数据
    const loadMore = (type: string) => {
        loadData(type, {
            name: searchTerm,
            color: searchColor,
            genre: searchGenre
        }, true);
    };

    // 刷新数据
    const refreshData = (type: string) => {
        // 重置搜索条件
        setSearchTerm("");
        setSearchColor("");
        setSearchGenre("");

        // 加载第一页数据
        loadData(type);
    };

    // 初始加载
    useEffect(() => {
        loadData("icon");
        loadData("frame");
        loadData("nameplate");
        loadData("trophy");
    }, []);

    // 处理搜索
    const handleSearch = (e: React.FormEvent) => {
        // 阻止表单默认提交行为，防止页面刷新
        e.preventDefault();

        // 调用loadData函数，传递当前活动标签和搜索参数
        loadData(activeTab, {
            keywords: searchTerm,  // 从状态中获取的搜索关键词
            color: searchColor, // 从状态中获取的颜色筛选条件（仅对奖杯有效）
            genre: searchGenre // 从状态中获取的区域筛选条件（仅对名牌和背景有效）
        });
    };

    // 高亮选中的Tab
    const getTabClass = (tabName: string) => {
        return `px-4 py-2 font-medium text-sm transition-colors duration-200 ${activeTab === tabName
            ? "bg-purple-600 text-white rounded-lg shadow-md"
            : "text-gray-600 hover:text-purple-600 hover:bg-purple-100 rounded-lg"
            }`;
    };

    // 渲染收藏品项目
    const renderItem = (item: any, type: string) => {
        let upHalfColorClass = ""
        let downHalfColorClass = ""
        let borderColorClass = ""
        let bottomColorClass = ""
        if (item.color) {
            switch (item.color) {
                case "Normal":
                    upHalfColorClass = "bg-[rgb(237,237,237)]"
                    downHalfColorClass = "bg-[rgb(218,218,218)]"
                    borderColorClass = "border-[rgb(189,189,189)]"
                    bottomColorClass = "border-[rgb(92,93,102)]"
                    break;
                case "Bronze":
                    upHalfColorClass = "bg-[rgb(218,218,218)]"
                    downHalfColorClass = "bg-[rgb(221,114,62)]"
                    borderColorClass = "border-[rgb(221,114,62)]"
                    bottomColorClass = "border-[rgb(172,120,98)]"
                    break;
                case "Silver":
                    upHalfColorClass = "bg-[rgb(224,227,248)]"
                    downHalfColorClass = "bg-[rgb(149,181,226)]"
                    borderColorClass = "border-[rgb(191,215,248)]"
                    bottomColorClass = "border-[rgb(35,53,171)]"
                    break;
                case "Gold":
                    upHalfColorClass = "bg-[rgb(255,223,76)]"
                    downHalfColorClass = "bg-[rgb(250,191,8)]"
                    borderColorClass = "border-[rgb(255,223,76)]"
                    bottomColorClass = "border-[rgb(187,62,6)]"
                    break;
                case "Rainbow":
                    upHalfColorClass = "bg-gradient-to-b from-purple-400 to-pink-500"
                    downHalfColorClass = "bg-gradient-to-b from-blue-400 to-green-500"
                    break;
            }
        }
        switch (type) {
            case 'frame':
                return (
                    <div
                        key={item.id}
                        className="relative rounded-lg shadow-sm max-sm:h-16 h-28 aspect-[1080/452] bg-no-repeat bg-contain hover:shadow-md transition-all duration-300 overflow-hidden"
                        style={{ backgroundImage: `url(https://static.maimai.moe/UI_Frame_${item.id}.png)` }}
                    >
                        {/* 毛玻璃 + 文字层 */}
                        <div className="absolute max-sm:hidden inset-0 backdrop-blur-sm bg-white/40 flex items-center justify-center transition-opacity duration-300 hover:opacity-0">
                            <SvgStrokedText
                                text={item.name}
                                strokeColor="#9334e9"
                                strokeWidth={3}
                                fill="#fff"
                                fontSize={18}
                                width="200"
                                height="100"
                            />
                        </div>
                        <div className="absolute sm:hidden inset-0 backdrop-blur-sm bg-white/40 flex items-center justify-center transition-opacity duration-300 hover:opacity-0">
                            <SvgStrokedText
                                text={item.name}
                                strokeColor="#9334e9"
                                strokeWidth={3}
                                fill="#fff"
                                fontSize={18}
                                width="120"
                                height="60"
                            />
                        </div>
                    </div>
                );

            case 'trophy':
                return (
                    <div
                        key={item.id}
                        className={`relative rounded-full max-sm:w-44 w-72 h-12 p-3 border-b-4 ${bottomColorClass} transition-all duration-300 flex flex-col items-center`}
                    >
                        <div className="absolute inset-0 overflow-hidden rounded-full">
                            <div className={`w-full rounded-t-full h-1/2 ${upHalfColorClass} border-t-4 border-l-4 border-r-4 ${borderColorClass}`} />
                            <div className={`w-full rounded-b-full h-1/2 ${downHalfColorClass} border-b-4 border-l-4 border-r-4 ${borderColorClass}`} />
                        </div>
                        <div
                            className="max-w-40 text-white font-bold absolute z-[2]"
                            style={{ textShadow: "1px 1px 5px rgba(0, 0, 0)" }}
                        >
                            <TextScroller text={item.name} speed={10} delay={2} />
                        </div>
                    </div>
                );

            case 'nameplate':
                return (
                    <div
                        key={item.id}
                        className="relative rounded-lg shadow-sm h-12 aspect-[724/120] bg-no-repeat bg-contain hover:shadow-md transition-all duration-300 overflow-hidden"
                        style={{
                            backgroundImage: `url(https://static.maimai.moe/UI_Plate_${item.id.toString().padStart(6, '0')}.png)`
                        }}
                    >
                        {/* 毛玻璃 + 文字层 */}
                        <div className="absolute inset-0 backdrop-blur-sm bg-white/40 flex items-center justify-center transition-opacity duration-300 hover:opacity-0">
                            <SvgStrokedText
                                text={item.name}
                                strokeColor="#9334e9"
                                strokeWidth={3}
                                fill="#fff"
                                fontSize={18}
                                width="200"
                                height="100"
                            />
                        </div>
                    </div>
                );

            default:
                return (
                    <div
                        key={item.id}
                        className="relative rounded-full p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-purple-100 hover:border-purple-300 flex flex-col items-center"
                    >
                        <div className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 mb-2">
                            <img
                                src={`${baseUrl}/${type}/${item.id}.png`}
                                alt={item.name}
                                className="object-contain size-15 mt-2"
                            />
                            <p className="text-center text-sm leading-tight w-96">
                                {item.name}
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-center text-purple-800 mb-8">收藏品展示</h1>

            {/* Tab导航 */}
            <div className="flex justify-center mb-6 bg-white p-2 rounded-lg shadow-sm">
                <div className="flex space-x-2">
                    <button onClick={() => { setActiveTab("icon"); loadData("icon"); }} className={getTabClass("icon")}>头像</button>
                    <button onClick={() => { setActiveTab("frame"); loadData("frame"); }} className={getTabClass("frame")}>背景</button>
                    <button onClick={() => { setActiveTab("nameplate"); loadData("nameplate"); }} className={getTabClass("nameplate")}>名牌</button>
                    <button onClick={() => { setActiveTab("trophy"); loadData("trophy"); }} className={getTabClass("trophy")}>奖杯</button>
                </div>
            </div>

            {/* 搜索区域 */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between mb-3">
                    <h2 className="text-lg font-medium text-purple-700">筛选选项</h2>
                    <button
                        onClick={() => refreshData(activeTab)}
                        className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                        disabled={isSearching}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        重置筛选
                    </button>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                    <div className="flex-grow">
                        <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 mb-1">名称搜索</label>
                        <input
                            id="search-term"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="输入名称关键词..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        />
                    </div>

                    {activeTab === "trophy" ?
                        <>
                            <div className="md:w-1/4">
                                <label htmlFor="search-color" className="block text-sm font-medium text-gray-700 mb-1">奖杯颜色</label>
                                <select
                                    id="search-color"
                                    value={searchColor}
                                    onChange={(e) => setSearchColor(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                >
                                    <option value="">全部颜色</option>
                                    {colorOptions.slice(1).map(color => (
                                        <option key={color} value={color}>
                                            {
                                                color === "Rainbow" ? "彩虹" :
                                                    color === "Gold" ? "金色" :
                                                        color === "Silver" ? "银色" :
                                                            color === "Bronze" ? "铜色" :
                                                                color === "Normal" ? "普通" : color}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </> : <>
                            {activeTab === "icon" ? <>
                            </> : <>
                                <div className="md:w-1/4">
                                    <label htmlFor="search-genre" className="block text-sm font-medium text-gray-700 mb-1">区域</label>
                                    <select
                                        id="search-genre"
                                        value={searchGenre}
                                        onChange={(e) => setSearchGenre(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    >
                                        <option value="">全部区域</option>
                                        {genreOptions.map(genre => (
                                            <option key={genre} value={genre}>
                                                {genre === "デフォルト" ? "默认" :
                                                    genre === "オリジナルちほー" ? "原创区域" :
                                                        genre === "maimaiシリーズ" ? "maimai系列" :
                                                            genre === "イベントちほー" ? "活动区域" :
                                                                genre === "実績" ? "成就" : genre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                            }

                        </>
                    }


                    <div className="md:self-end">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                            disabled={isSearching}
                        >
                            {isSearching ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    搜索中...
                                </>
                            ) : "搜索"}
                        </button>
                    </div>
                </form>
            </div>

            {/* 内容区域 */}
            <div className="bg-purple-50/50 rounded-lg p-4 shadow-inner">
                {activeTab === "icon" && (
                    <div className="animate-fadeIn">
                        <h2 className="text-lg font-medium mb-4 text-purple-700 border-b pb-2">玩家头像</h2>

                        {Icons.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <LoadingSpinner size='sm' message='Loading' description='加载头像数据源' />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {Icons.map((item) => renderItem(item, "icon"))}
                                </div>

                                {/* 加载更多按钮 */}
                                {hasMore.icon && (
                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={() => loadMore("icon")}
                                            disabled={isSearching}
                                            className="px-4 py-2 bg-white border border-purple-300 rounded-md text-purple-600 hover:bg-purple-50 transition-colors flex items-center shadow-sm"
                                        >
                                            {isSearching ? (
                                                <>
                                                    <svg className="animate-spin mr-2 h-4 w-4 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    加载中...
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                    加载更多
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {activeTab === "frame" && (
                    <div className="animate-fadeIn">
                        <h2 className="text-lg font-medium mb-4 text-purple-700 border-b pb-2">游戏背景</h2>
                        {MaiBackGround.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <LoadingSpinner size='sm' message='Loading' description='加载背景数据源' />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 place-items-center gap-3 gap-x-1">
                                    {MaiBackGround.map((item) => renderItem(item, "frame"))}
                                </div>

                                {/* 加载更多按钮 */}
                                {hasMore.frame && (
                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={() => loadMore("frame")}
                                            disabled={isSearching}
                                            className="px-4 py-2 bg-white border border-purple-300 rounded-md text-purple-600 hover:bg-purple-50 transition-colors flex items-center shadow-sm"
                                        >
                                            {isSearching ? "加载中..." : "加载更多"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {activeTab === "nameplate" && (
                    <div className="animate-fadeIn">
                        <h2 className="text-lg font-medium mb-4 text-purple-700 border-b pb-2">玩家名牌</h2>
                        {namePlates.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <LoadingSpinner size='sm' message='Loading' description='加载名牌数据源' />
                            </div>
                        ) : (
                            <>
                                <div className="grid max-sm:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 place-items-center gap-3">
                                    {namePlates.map((item) => renderItem(item, "nameplate"))}
                                </div>

                                {/* 加载更多按钮 */}
                                {hasMore.nameplate && (
                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={() => loadMore("nameplate")}
                                            disabled={isSearching}
                                            className="px-4 py-2 bg-white border border-purple-300 rounded-md text-purple-600 hover:bg-purple-50 transition-colors flex items-center shadow-sm"
                                        >
                                            {isSearching ? "加载中..." : "加载更多"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {activeTab === "trophy" && (
                    <div className="animate-fadeIn">
                        <h2 className="text-lg font-medium mb-4 text-purple-700 border-b pb-2">游戏奖杯</h2>
                        {Trophies.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <LoadingSpinner size='sm' message='Loading' description='加载奖杯数据源' />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {Trophies.map((item) => renderItem(item, "trophy"))}
                                </div>

                                {/* 加载更多按钮 */}
                                {hasMore.trophy && (
                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={() => loadMore("trophy")}
                                            disabled={isSearching}
                                            className="px-4 py-2 bg-white border border-purple-300 rounded-md text-purple-600 hover:bg-purple-50 transition-colors flex items-center shadow-sm"
                                        >
                                            {isSearching ? "加载中..." : "加载更多"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}