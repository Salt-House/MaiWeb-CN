'use client'

import LoadingSpinner from '@/app/components/LoadingSpinner'
import SvgStrokedText from '@/app/components/SvgStrokedText'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { NamePlate, MaiBackGround, Icon, Trophie, Condition } from './model'
import TabNavigation from './components/TabNavigation'
import SearchForm from './components/SearchForm'
import RenderItem from './components/RenderItem'
import LoadMoreButton from './components/LoadMoreButton'
import PreviewModal from './components/PreviewModal'

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
    const [condition, setCondition] = useState<Condition>()
    const [conditionLoading, setConditionLoading] = useState<boolean>(true)

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
    const colorOptions = ["", "Normal", "Bronze", "Gold", "Silver", "Rainbow"];
    const genreOptions = ["デフォルト", "オリジナルちほー", "maimaiシリーズ", "イベントちほー", "実績"];


    const [previewImage, setPreviewImage] = useState<{
        url: string;
        name: string;
        type: string;
    } | null>(null);

    // 获取条件 "icon", "frame", "plate", "trophy"
    const GetCondition = (type: string, id: string) => {
        setConditionLoading(true);
        var requestOptions = {
            method: 'GET',
        };
        let collection_id = (id as string | number).toString().padStart(6, '0');

        fetch(`https://dev.maimai.moe/email/condition?type=${type}&colletion_id=${collection_id}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                if (result) {
                    const data = JSON.parse(result);
                    setCondition({
                        category: data.category,
                        condition: data.condition,
                        condition_CN: data.condition_CN
                    });
                } else {
                    setCondition(undefined);
                }
                setConditionLoading(false);
            })
            .catch(error => console.log('error', error));
    }

    // 打开图片预览
    const openImagePreview = (item: any, type: string) => {
        let imageUrl = '';
        switch (type) {
            case 'frame':
                imageUrl = `https://static.maimai.moe/UI_Frame_${item.id}.png`;
                break;
            case 'nameplate':
                imageUrl = `https://static.maimai.moe/UI_Plate_${item.id.toString().padStart(6, '0')}.png`;
                break;
            case 'icon':
                imageUrl = `${baseUrl}/${type}/${item.id}.png`;
                break;
            case 'trophy':
                switch (item.color) {
                    case "Normal":
                        imageUrl = "bg-[url('/img/trophy/UI_CMN_Shougou_Normal.png')]"
                        break;
                    case "Bronze":
                        imageUrl = "bg-[url('/img/trophy/UI_CMN_Shougou_Bronze.png')]"
                        break;
                    case "Silver":
                        imageUrl = "bg-[url('/img/trophy/UI_CMN_Shougou_Silver.png')]"
                        break;
                    case "Gold":
                        imageUrl = "bg-[url('/img/trophy/UI_CMN_Shougou_Gold.png')]"
                        break;
                    case "Rainbow":
                        imageUrl = "bg-[url('/img/trophy/UI_CMN_Shougou_Rainbow.png')]"
                        break;
                }
                break;
        }

        setPreviewImage({
            url: imageUrl,
            name: item.name,
            type: type
        });
    };

    // 关闭图片预览
    const closeImagePreview = () => {
        setPreviewImage(null);
    };

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


    useEffect(() => {
        refreshData(activeTab);
    }, [activeTab]);

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


    return (
        <div className="container mx-auto py-8 px-4">
            <SvgStrokedText text="收藏品展示" height={100} strokeColor={"#a078e4"} strokeWidth={10} />

            {/* Tab导航 */}
            <TabNavigation 
                activeTab={activeTab}
                onTabChange={(tab) => { setActiveTab(tab); loadData(tab); }}
            />

            {/* 搜索区域 */}
            <SearchForm 
                activeTab={activeTab}
                searchTerm={searchTerm}
                searchColor={searchColor}
                isSearching={isSearching}
                colorOptions={colorOptions}
                onSearchTermChange={setSearchTerm}
                onSearchColorChange={setSearchColor}
                onSearch={handleSearch}
            />

            {/* 内容区域 */}
            <motion.div 
                className="bg-purple-50 rounded-lg p-6 shadow-lg border border-purple-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <AnimatePresence mode="wait">
                    {activeTab === "icon" && (
                        <motion.div 
                            key="icon"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.h2 
                                className="text-xl font-bold text-center mb-6 text-purple-800 border-b-2 border-purple-300 pb-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                玩家头像
                            </motion.h2>

                            {Icons.length === 0 ? (
                                <motion.div 
                                    className="flex justify-center py-12"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <LoadingSpinner size='sm' message='Loading' description='加载头像数据源' />
                                </motion.div>
                            ) : (
                                <>
                                    <motion.div 
                                        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2, staggerChildren: 0.05 }}
                                    >
                                        {Icons.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.02 }}
                                            >
                                                <RenderItem item={item} type="icon" openImagePreview={openImagePreview} GetCondition={GetCondition} />
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* 加载更多按钮 */}
                                    {hasMore.icon && (
                                        <LoadMoreButton loadMore={() => loadMore("icon")} isSearching={isSearching} />
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                    {activeTab === "frame" && (
                        <motion.div 
                            key="frame"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.h2 
                                className="text-xl font-bold text-center mb-6 text-purple-800 border-b-2 border-purple-300 pb-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                游戏背景
                            </motion.h2>
                            {MaiBackGround.length === 0 ? (
                                <motion.div 
                                    className="flex justify-center py-12"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <LoadingSpinner size='sm' message='Loading' description='加载背景数据源' />
                                </motion.div>
                            ) : (
                                <>
                                    <motion.div 
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2, staggerChildren: 0.05 }}
                                    >
                                        {MaiBackGround.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.02 }}
                                            >
                                                <RenderItem item={item} type="frame" openImagePreview={openImagePreview} GetCondition={GetCondition} />
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* 加载更多按钮 */}
                                    {hasMore.frame && (
                                        <LoadMoreButton loadMore={() => loadMore("frame")} isSearching={isSearching} />
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                    {activeTab === "nameplate" && (
                        <motion.div 
                            key="nameplate"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.h2 
                                className="text-xl font-bold text-center mb-6 text-purple-800 border-b-2 border-purple-300 pb-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                玩家名牌
                            </motion.h2>
                            {namePlates.length === 0 ? (
                                <motion.div 
                                    className="flex justify-center py-12"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <LoadingSpinner size='sm' message='Loading' description='加载名牌数据源' />
                                </motion.div>
                            ) : (
                                <>
                                    <motion.div 
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2, staggerChildren: 0.05 }}
                                    >
                                        {namePlates.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.02 }}
                                            >
                                                <RenderItem item={item} type="plate" openImagePreview={openImagePreview} GetCondition={GetCondition} />
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* 加载更多按钮 */}
                                    {hasMore.nameplate && (
                                        <LoadMoreButton loadMore={() => loadMore("nameplate")} isSearching={isSearching} />
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "trophy" && (
                        <motion.div 
                            key="trophy"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.h2 
                                className="text-xl font-bold text-center mb-6 text-purple-800 border-b-2 border-purple-300 pb-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                游戏奖杯
                            </motion.h2>
                            {Trophies.length === 0 ? (
                                <motion.div 
                                    className="flex justify-center py-12"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <LoadingSpinner size='sm' message='Loading' description='加载奖杯数据源' />
                                </motion.div>
                            ) : (
                                <>
                                    <motion.div 
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2, staggerChildren: 0.05 }}
                                    >
                                        {Trophies.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.02 }}
                                            >
                                                <RenderItem item={item} type="trophy" openImagePreview={openImagePreview} GetCondition={GetCondition} />
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* 加载更多按钮 */}
                                    {hasMore.trophy && (
                                        <LoadMoreButton loadMore={() => loadMore("trophy")} isSearching={isSearching} />
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            <PreviewModal 
                previewImage={previewImage}
                condition={condition}
                conditionLoading={conditionLoading}
                onClose={closeImagePreview}
            />

        </div >
    );
}