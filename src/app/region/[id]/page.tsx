'use client'

import { use, useEffect, useState } from "react";
import { Area } from "../page";
import Link from "next/link";
import { FaArrowLeft, FaLocationDot, FaLanguage } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import LoadingSpinner from "@/app/components/LoadingSpinner";

interface PageProps {
    params: {
        id: string;
    };
}

export default function AreaDetailPage({ params }: PageProps) {
    const id = params.id;
    const [area, setArea] = useState<Area>();
    const [lang, setLang] = useState("ja");
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState("ja");
    const textstroke = {
        textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)'
    };
    const baseurl = "https://assets2.lxns.net/maimai/jacket/";

    const GetAreaDetail = () => {
        setLoading(true);
        const decodedId = decodeURIComponent(id);
        fetch(`https://dev.maimai.moe/api/maimai/areas?lang=${language}&name=${decodedId}&page=1&page_size=100`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })
            .then(res => res.json())
            .then(data => {
                setArea(data[0]);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };


    useEffect(()=>{
        GetAreaDetail();
    },[language])
    

    useEffect(() => {
        GetAreaDetail();
    }, []);

    return (
        <div className="relative w-full max-w-[900px] h-auto mx-auto py-10 px-4 flex flex-col items-center max-sm:py-6 overflow-x-hidden">
            {/* 背景装饰 */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-[-1]">
                <div className="opacity-25">
                    <div className="w-full h-[200px] bg-[url('/img/bg_shines.png')] bg-no-repeat bg-contain bg-center"></div>
                </div>
            </div>

            {/* 返回按钮 */}
            <Link href="/region" className="absolute top-4 left-4 flex items-center text-white transition-colors group max-sm:text-sm">
                <FaArrowLeft className="mr-1 group-hover:animate-pulse" />
                <span className="text-2xl font-medium max-sm:text-lg" style={textstroke}>返回区域列表</span>
            </Link>

            {/* 语言切换按钮 */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
                <FaLanguage className="text-white text-xl" style={textstroke} />
                <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-1 border border-white/30">
                    <button
                        onClick={() => setLanguage('ja')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                            language === 'ja'
                                ? 'bg-white text-purple-600 shadow-sm'
                                : 'text-white hover:bg-white/20'
                        }`}
                    >
                        日本語
                    </button>
                    <button
                        onClick={() => setLanguage('zh')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                            language === 'zh'
                                ? 'bg-white text-purple-600 shadow-sm'
                                : 'text-white hover:bg-white/20'
                        }`}
                    >
                        中文
                    </button>
                </div>
            </div>

            {/* 主内容区域 */}
            <div className="w-full max-w-[900px] mx-auto mt-10 max-sm:mt-6">
                {loading ? (
                    <LoadingSpinner size="md" />
                ) : area ? (
                    <div className="rounded-xl p-6 transition-all duration-300">
                        {/* 标题 */}
                        <div className="flex flex-col mb-5 items-center">
                            <h1 className="text-white w-full text-center whitespace-nowrap font-bold text-2xl max-sm:text-xl" style={textstroke}>
                                {area.name}
                            </h1>
                            <div className="relative w-full flex justify-center items-center my-4">
                                <img
                                    src={`/img/version/${area.id}.png`}
                                    className="w-80 h-80 object-contain animate-floatUpDown transition-all duration-300 ease-in-out max-sm:w-52 max-sm:h-52"
                                    alt={area.name}
                                />
                            </div>
                        </div>

                        {/* 区域基本信息 */}
                        <div className="bg-white/50 rounded-lg p-4 border-2 border-[rgb(155,244,236)] mb-6">
                            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">区域基本信息</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <FaLocationDot className="text-purple-500 mr-2" />
                                    <span className="text-gray-700 font-medium">区域ID: </span>
                                    <span className="ml-2">{area.id}</span>
                                </div>
                            </div>
                            {area.description && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">区域描述:</h3>
                                    <p className="text-gray-600 bg-white/70 p-3 rounded-md">{area.description}</p>
                                </div>
                            )}
                        </div>

                        {/* 区域角色 */}
                        {area.characters?.length > 0 && (
                            <div className="bg-white/50 rounded-lg p-4 border-2 border-[rgb(155,244,236)] mb-6">
                                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">区域角色</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {area.characters.map((character, index) => (
                                        <div key={index} className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-all duration-200">
                                            <div className="flex flex-col md:flex-row max-sm:items-center max-sm:text-center">
                                                <div className="w-28 h-28 overflow-hidden rounded-lg border-2 border-purple-200 flex-shrink-0 mx-auto md:mx-0 mb-3 md:mb-0">
                                                    <img
                                                        src={`/img/chara/${area.id}/0${index + 1}.png`}
                                                        className="w-full h-full object-cover"
                                                        alt={character.name || area.name}
                                                    />
                                                </div>
                                                <div className="md:ml-4 mt-3 md:mt-0 flex-grow">
                                                    <div className="flex flex-wrap items-center mb-2 max-sm:justify-center">
                                                        <h3 className="font-bold text-lg text-purple-800 mr-2">{character.name}</h3>
                                                        {character.team && (
                                                            <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                                                                {character.team}
                                                            </span>
                                                        )}
                                                        {character.illustrator && (
                                                            <span className="ml-auto text-xs text-gray-500 max-sm:ml-0 max-sm:mt-1">
                                                                插画: {character.illustrator}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {(character.description1 || character.description2) && (
                                                        <div className="bg-gray-50 p-2 rounded-md mb-2 text-sm italic text-gray-600">
                                                            {character.description1 && <p>"{character.description1}"</p>}
                                                            {character.description2 && <p className="mt-1">"{character.description2}"</p>}
                                                        </div>
                                                    )}
                                                    {character.props && Object.keys(character.props).length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                                                            {Object.entries(character.props).map(([key, value]) => (
                                                                <div key={key} className="flex items-center bg-white border border-gray-200 rounded px-2 py-1 text-xs">
                                                                    <span className="font-medium text-gray-700 mr-1">{key}:</span>
                                                                    <span className="text-gray-600">{value as string}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 区域歌曲 */}
                        {area.songs?.length > 0 && (
                            <div className="bg-white/50 rounded-lg p-4 border-2 border-[rgb(155,244,236)]">
                                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">区域歌曲</h2>
                                <div className="grid grid-cols-1 gap-3">
                                    {area.songs.map((song, index) => (
                                        <div key={index} className="flex flex-col bg-white rounded-lg hover:bg-gray-50 transition-all duration-200">
                                            <div className="flex flex-col sm:flex-row items-center p-3 max-sm:text-center">
                                                <img src={`${baseurl}${song.id}.png`} className="w-24 h-24 mb-2 sm:mb-0 sm:mr-8" alt="" />
                                                <div className="flex-grow">
                                                    <h3 className="font-medium text-gray-800">{song.title}</h3>
                                                    <p className="text-sm text-gray-500">{song.artist || "未知艺术家"}</p>
                                                </div>
                                                <Link href={`/music/${song.id}`} className="flex items-center text-blue-500 hover:text-blue-600 mt-2 sm:mt-0">
                                                    <span className="text-sm mr-1">详情</span>
                                                    <FiExternalLink />
                                                </Link>
                                            </div>
                                            {song.description && (
                                                <>
                                                    <div className="border-t border-gray-200 mx-3"></div>
                                                    <div className="p-3 text-sm text-gray-600">
                                                        {song.description}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 text-center">
                        <h2 className="text-xl font-medium text-gray-800 mb-3">未找到区域信息</h2>
                        <p className="text-gray-600 mb-4">无法找到名为 "{id}" 的区域数据，请稍后再试或检查区域名称。</p>
                        <Link href="/region" className="inline-block px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
                            返回区域列表
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
